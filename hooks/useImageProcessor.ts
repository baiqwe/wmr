'use client';

import { useCallback } from 'react';

/**
 * Image utility functions for watermark removal workflow
 * - downloadImage: Export processed images as PNG or JPG
 * - convertHeic: Convert HEIC files to compatible format
 */
export const useImageProcessor = () => {

    /**
     * Download processed image
     */
    const downloadImage = useCallback((
        dataUrl: string,
        filename: string,
        format: 'png' | 'jpg' = 'png',
        quality: number = 0.95
    ) => {
        const link = document.createElement('a');
        link.download = `${filename}.${format}`;

        if (format === 'jpg') {
            // Convert to JPG (no transparency)
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // White background for JPG
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                link.href = canvas.toDataURL('image/jpeg', quality);
                link.click();
            };
            img.src = dataUrl;
        } else {
            link.href = dataUrl;
            link.click();
        }
    }, []);

    /**
     * Convert HEIC to compatible format
     */
    const convertHeic = useCallback(async (file: File): Promise<string> => {
        // Dynamic import to reduce bundle size
        const heic2any = (await import('heic2any')).default;

        const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/png',
        });

        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        return URL.createObjectURL(blob);
    }, []);

    return { downloadImage, convertHeic };
};
