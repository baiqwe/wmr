'use client';

import { useCallback } from 'react';

interface ProcessResult {
    success: boolean;
    resultDataUrl?: string;
    error?: string;
}

// 定义自定义配置接口
export interface WatermarkConfig {
    size?: number;   // 自定义水印尺寸 (px)
    margin?: number; // 自定义右下角边距 (px)
}

// 蒙版配置：基于实测 Gemini 水印尺寸
// 实测：Logo ~36x36, margin ~23px，使用稍大的蒙版确保完全覆盖
const MASKS = {
    small: '/masks/gemini_mask_40.png', // 实测版本 (40x40)
    large: '/masks/gemini_mask_80.png'  // 放大版本 (80x80)
};

/**
 * Gemini Watermark Removal using Inverse Alpha Blending
 * Ported from: https://github.com/allenk/GeminiWatermarkTool
 * 
 * This algorithm mathematically reverses the watermark blending to restore original pixels.
 * Formula: original = (watermarked - alpha * logo) / (1 - alpha)
 */
export function useWatermarkRemover() {

    /**
     * Remove Gemini Watermark using Inverse Alpha Blending
     * @param imageSrc - Original image data URL or src
     * @param customConfig - (Optional) Custom size and margin configuration
     */
    const removeWatermark = useCallback(async (
        imageSrc: string,
        customConfig?: WatermarkConfig
    ): Promise<ProcessResult> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        resolve({ success: false, error: 'Failed to get canvas context' });
                        return;
                    }

                    // 1. Draw original image
                    ctx.drawImage(img, 0, 0);

                    // 2. Determine Configuration (Auto-detection or Custom)
                    // Gemini Rules: 
                    // - Large (96x96, 64px margin): BOTH width AND height > 1024
                    // - Small (48x48, 32px margin): Otherwise (including 1024x1024)

                    // 即使是手动模式，我们也需要选择一个“最接近”的源蒙版文件来缩放
                    // 保留原有的自动判断逻辑作为默认值
                    const isLarge = img.width > 1024 && img.height > 1024;

                    const baseConfig = isLarge ? {
                        maskSrc: MASKS.large,
                        defaultSize: 80,   // 实测放大版
                        defaultMargin: 42  // 21 * 2
                    } : {
                        maskSrc: MASKS.small,
                        defaultSize: 40,   // 实测版本
                        defaultMargin: 21  // 实测边距
                    };

                    // 3. Apply Parameters (Custom overrides Default)
                    const targetSize = customConfig?.size ?? baseConfig.defaultSize;
                    const targetMargin = customConfig?.margin ?? baseConfig.defaultMargin;

                    // 4. Calculate Position (Bottom-Right)
                    const logoX = img.width - targetMargin - targetSize;
                    const logoY = img.height - targetMargin - targetSize;

                    // Safety check for very small images or invalid positions
                    if (logoX < 0 || logoY < 0) {
                        resolve({ success: false, error: 'Image too small for watermark removal with current settings' });
                        return;
                    }

                    // 5. Load the appropriate Alpha Mask
                    const maskImg = new Image();
                    maskImg.crossOrigin = 'anonymous';
                    maskImg.src = baseConfig.maskSrc;

                    maskImg.onload = () => {
                        // Create a temp canvas to process mask data (scaling if needed)
                        const maskCanvas = document.createElement('canvas');
                        maskCanvas.width = targetSize;
                        maskCanvas.height = targetSize;
                        const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });

                        if (!maskCtx) {
                            resolve({ success: false, error: 'Failed to process mask' });
                            return;
                        }

                        // Use drawImage to scale the source mask to targetSize
                        // This handles the resizing dynamically
                        maskCtx.drawImage(maskImg, 0, 0, targetSize, targetSize);

                        // Get pixel data
                        const maskData = maskCtx.getImageData(0, 0, targetSize, targetSize);
                        const imgData = ctx.getImageData(logoX, logoY, targetSize, targetSize);

                        // 6. Apply Inverse Alpha Blending (Core Algorithm)
                        // Formula: original = (watermarked - alpha * logo) / (1 - alpha)

                        const pixelCount = targetSize * targetSize;
                        const data = imgData.data;
                        const mData = maskData.data;
                        const logoValue = 255.0; // Gemini logo is white

                        // Parameters to avoid division by zero or noise amplification
                        const ALPHA_THRESHOLD = 0.002; // Ignore very small alpha (noise)
                        const MAX_ALPHA = 0.99;        // Avoid division by zero

                        for (let i = 0; i < pixelCount * 4; i += 4) {
                            // Mask is grayscale/white-on-black, so any channel (R) represents alpha intensity
                            // alpha normalized to 0.0 - 1.0
                            let alpha = mData[i] / 255.0;

                            if (alpha < ALPHA_THRESHOLD) continue;

                            // Clamp alpha
                            if (alpha > MAX_ALPHA) alpha = MAX_ALPHA;

                            const oneMinusAlpha = 1.0 - alpha;
                            const alphaTimesLogo = alpha * logoValue;

                            // Process R, G, B channels
                            for (let c = 0; c < 3; c++) {
                                const watermarked = data[i + c];

                                // The Inverse Formula
                                let original = (watermarked - alphaTimesLogo) / oneMinusAlpha;

                                // Clamp result to valid byte range
                                if (original < 0) original = 0;
                                if (original > 255) original = 255;

                                data[i + c] = original;
                            }
                            // Alpha channel (data[i+3]) remains unchanged
                        }

                        // 7. Put processed pixels back
                        ctx.putImageData(imgData, logoX, logoY);

                        resolve({
                            success: true,
                            resultDataUrl: canvas.toDataURL(imageSrc.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png')
                        });
                    };

                    maskImg.onerror = () => {
                        console.error(`Failed to load mask: ${baseConfig.maskSrc}`);
                        resolve({ success: false, error: '系统缺少水印蒙版文件。请联系管理员。' });
                    };
                } catch (e) {
                    resolve({ success: false, error: e instanceof Error ? e.message : 'Unknown error' });
                }
            };

            img.onerror = () => {
                resolve({ success: false, error: 'Failed to load image' });
            };

            img.src = imageSrc;
        });
    }, []);

    return { removeWatermark };
}
