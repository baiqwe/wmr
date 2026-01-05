'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface MaskCanvasProps {
    imageSrc: string;
    brushSize: number;
    onMaskChange?: (maskDataUrl: string | null) => void;
    className?: string;
}

export default function MaskCanvas({
    imageSrc,
    brushSize,
    onMaskChange,
    className = ''
}: MaskCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);

    // Load and display the image
    useEffect(() => {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const container = containerRef.current;
        if (!canvas || !maskCanvas || !container) return;

        const ctx = canvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!ctx || !maskCtx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Calculate display size maintaining aspect ratio
            const containerWidth = container.clientWidth;
            const maxHeight = 500;
            const aspectRatio = img.width / img.height;

            let displayWidth = containerWidth;
            let displayHeight = containerWidth / aspectRatio;

            if (displayHeight > maxHeight) {
                displayHeight = maxHeight;
                displayWidth = maxHeight * aspectRatio;
            }

            // Set canvas sizes
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            maskCanvas.width = displayWidth;
            maskCanvas.height = displayHeight;

            setCanvasSize({ width: displayWidth, height: displayHeight });

            // Draw image
            ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

            // Clear mask canvas
            maskCtx.clearRect(0, 0, displayWidth, displayHeight);

            setImageLoaded(true);
        };
        img.src = imageSrc;
    }, [imageSrc]);

    // Get mouse/touch position relative to canvas
    const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = maskCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }, []);

    // Draw on mask canvas
    const draw = useCallback((x: number, y: number) => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        // Draw semi-transparent red circle to show mask area
        maskCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        maskCtx.beginPath();
        maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        maskCtx.fill();
    }, [brushSize]);

    // Export mask as data URL
    const exportMask = useCallback(() => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return null;

        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return null;

        // Check if there's any mask drawn
        const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const hasContent = imageData.data.some((value, index) => index % 4 === 3 && value > 0);

        if (!hasContent) return null;

        // Create binary mask (white where marked, black elsewhere)
        const binaryCanvas = document.createElement('canvas');
        binaryCanvas.width = maskCanvas.width;
        binaryCanvas.height = maskCanvas.height;
        const binaryCtx = binaryCanvas.getContext('2d');
        if (!binaryCtx) return null;

        // Fill with black
        binaryCtx.fillStyle = 'black';
        binaryCtx.fillRect(0, 0, binaryCanvas.width, binaryCanvas.height);

        // Draw white where mask exists
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] > 0) { // If alpha > 0
                const pixelIndex = i / 4;
                const x = pixelIndex % maskCanvas.width;
                const y = Math.floor(pixelIndex / maskCanvas.width);
                binaryCtx.fillStyle = 'white';
                binaryCtx.fillRect(x, y, 1, 1);
            }
        }

        return binaryCanvas.toDataURL('image/png');
    }, []);

    // Notify parent of mask changes
    useEffect(() => {
        if (onMaskChange && imageLoaded) {
            onMaskChange(exportMask());
        }
    }, [isDrawing, onMaskChange, exportMask, imageLoaded]);

    // Mouse/touch event handlers
    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        const pos = getPosition(e);
        draw(pos.x, pos.y);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPosition(e);
        draw(pos.x, pos.y);
    };

    const handleEnd = () => {
        setIsDrawing(false);
        if (onMaskChange) {
            onMaskChange(exportMask());
        }
    };

    // Clear mask
    const clearMask = useCallback(() => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        if (onMaskChange) {
            onMaskChange(null);
        }
    }, [onMaskChange]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Image canvas (bottom layer) */}
            <canvas
                ref={canvasRef}
                className="block rounded-lg border border-border"
                style={{ width: canvasSize.width || '100%', height: canvasSize.height || 'auto' }}
            />

            {/* Mask canvas (top layer, for drawing) */}
            <canvas
                ref={maskCanvasRef}
                className="absolute top-0 left-0 rounded-lg cursor-crosshair"
                style={{
                    width: canvasSize.width || '100%',
                    height: canvasSize.height || 'auto',
                    touchAction: 'none'
                }}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            />

            {/* Clear button */}
            {imageLoaded && (
                <button
                    onClick={clearMask}
                    className="absolute top-2 right-2 px-3 py-1 bg-background/90 backdrop-blur-sm text-sm rounded-md border border-border hover:bg-muted transition-colors"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
