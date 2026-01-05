'use client';

import { useCallback } from 'react';

interface ProcessResult {
    success: boolean;
    resultDataUrl?: string;
    error?: string;
}

/**
 * Client-side watermark removal hook using Canvas inpainting
 * Uses simple content-aware fill algorithm for MVP
 */
export function useWatermarkRemover() {

    /**
     * Remove watermark using mask-based inpainting
     * @param imageSrc - Original image data URL or src
     * @param maskDataUrl - Binary mask (white = area to remove)
     */
    const removeWatermark = useCallback(async (
        imageSrc: string,
        maskDataUrl: string
    ): Promise<ProcessResult> => {
        return new Promise((resolve) => {
            try {
                const img = new Image();
                const mask = new Image();

                let imageLoaded = false;
                let maskLoaded = false;

                const processWhenReady = () => {
                    if (!imageLoaded || !maskLoaded) return;

                    // Create canvas for processing
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        resolve({ success: false, error: 'Failed to get canvas context' });
                        return;
                    }

                    // Draw original image
                    ctx.drawImage(img, 0, 0);

                    // Get image data
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;

                    // Create mask canvas at same size
                    const maskCanvas = document.createElement('canvas');
                    maskCanvas.width = img.width;
                    maskCanvas.height = img.height;
                    const maskCtx = maskCanvas.getContext('2d');

                    if (!maskCtx) {
                        resolve({ success: false, error: 'Failed to get mask context' });
                        return;
                    }

                    maskCtx.drawImage(mask, 0, 0, img.width, img.height);
                    const maskData = maskCtx.getImageData(0, 0, img.width, img.height);
                    const maskPixels = maskData.data;

                    // Find masked pixels and apply inpainting
                    const width = canvas.width;
                    const height = canvas.height;
                    const sampleRadius = 15; // Pixels to sample from around the mask

                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            const idx = (y * width + x) * 4;

                            // Check if this pixel is in the mask (white = masked)
                            if (maskPixels[idx] > 128) {
                                // This pixel needs to be inpainted
                                // Sample surrounding non-masked pixels
                                let totalR = 0, totalG = 0, totalB = 0, count = 0;

                                for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
                                    for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
                                        const nx = x + dx;
                                        const ny = y + dy;

                                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                            const nidx = (ny * width + nx) * 4;

                                            // Only sample non-masked pixels
                                            if (maskPixels[nidx] < 128) {
                                                // Weight by distance (closer pixels have more influence)
                                                const dist = Math.sqrt(dx * dx + dy * dy);
                                                const weight = 1 / (1 + dist * 0.5);

                                                totalR += pixels[nidx] * weight;
                                                totalG += pixels[nidx + 1] * weight;
                                                totalB += pixels[nidx + 2] * weight;
                                                count += weight;
                                            }
                                        }
                                    }
                                }

                                if (count > 0) {
                                    pixels[idx] = Math.round(totalR / count);
                                    pixels[idx + 1] = Math.round(totalG / count);
                                    pixels[idx + 2] = Math.round(totalB / count);
                                }
                            }
                        }
                    }

                    // Apply light blur to smooth transitions
                    const blurRadius = 2;
                    const blurredData = applyGaussianBlur(pixels, width, height, maskPixels, blurRadius);

                    // Copy blurred data only for masked regions
                    for (let i = 0; i < pixels.length; i += 4) {
                        if (maskPixels[i] > 128) {
                            pixels[i] = blurredData[i];
                            pixels[i + 1] = blurredData[i + 1];
                            pixels[i + 2] = blurredData[i + 2];
                        }
                    }

                    ctx.putImageData(imageData, 0, 0);

                    resolve({
                        success: true,
                        resultDataUrl: canvas.toDataURL('image/png')
                    });
                };

                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    imageLoaded = true;
                    processWhenReady();
                };
                img.onerror = () => {
                    resolve({ success: false, error: 'Failed to load image' });
                };

                mask.crossOrigin = 'anonymous';
                mask.onload = () => {
                    maskLoaded = true;
                    processWhenReady();
                };
                mask.onerror = () => {
                    resolve({ success: false, error: 'Failed to load mask' });
                };

                img.src = imageSrc;
                mask.src = maskDataUrl;

            } catch (error) {
                resolve({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }, []);

    return { removeWatermark };
}

/**
 * Apply gaussian blur to smooth inpainted regions
 */
function applyGaussianBlur(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    maskPixels: Uint8ClampedArray,
    radius: number
): Uint8ClampedArray {
    const result = new Uint8ClampedArray(pixels.length);
    const kernel = createGaussianKernel(radius);
    const kernelSize = kernel.length;
    const halfKernel = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Only blur masked pixels
            if (maskPixels[idx] > 128) {
                let r = 0, g = 0, b = 0, totalWeight = 0;

                for (let ky = 0; ky < kernelSize; ky++) {
                    for (let kx = 0; kx < kernelSize; kx++) {
                        const nx = x + kx - halfKernel;
                        const ny = y + ky - halfKernel;

                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const nidx = (ny * width + nx) * 4;
                            const weight = kernel[ky][kx];

                            r += pixels[nidx] * weight;
                            g += pixels[nidx + 1] * weight;
                            b += pixels[nidx + 2] * weight;
                            totalWeight += weight;
                        }
                    }
                }

                result[idx] = Math.round(r / totalWeight);
                result[idx + 1] = Math.round(g / totalWeight);
                result[idx + 2] = Math.round(b / totalWeight);
                result[idx + 3] = pixels[idx + 3];
            } else {
                result[idx] = pixels[idx];
                result[idx + 1] = pixels[idx + 1];
                result[idx + 2] = pixels[idx + 2];
                result[idx + 3] = pixels[idx + 3];
            }
        }
    }

    return result;
}

/**
 * Create 2D Gaussian kernel
 */
function createGaussianKernel(radius: number): number[][] {
    const size = radius * 2 + 1;
    const kernel: number[][] = [];
    const sigma = radius / 2;
    let sum = 0;

    for (let y = 0; y < size; y++) {
        kernel[y] = [];
        for (let x = 0; x < size; x++) {
            const dx = x - radius;
            const dy = y - radius;
            const value = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
            kernel[y][x] = value;
            sum += value;
        }
    }

    // Normalize
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            kernel[y][x] /= sum;
        }
    }

    return kernel;
}
