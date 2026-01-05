'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useWatermarkRemover } from '@/hooks/useWatermarkRemover';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import ImageUploader from './image-uploader';
import MaskCanvas from './mask-canvas';
import CompareSlider from './compare-slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download, RefreshCw, Eraser, Loader2 } from 'lucide-react';

interface WatermarkEditorProps {
    onImageUploaded?: (uploaded: boolean, imageSrc?: string) => void;
}

export default function WatermarkEditor({ onImageUploaded }: WatermarkEditorProps) {
    const t = useTranslations('editor');
    const { removeWatermark } = useWatermarkRemover();
    const { downloadImage, convertHeic } = useImageProcessor();

    const [originalImage, setOriginalImage] = useState<string>('');
    const [processedImage, setProcessedImage] = useState<string>('');
    const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('image');
    const [brushSize, setBrushSize] = useState<number>(30);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
    const [showResult, setShowResult] = useState(false);

    const handleImageSelect = (imageSrc: string, file: File) => {
        setOriginalImage(imageSrc);
        setFileName(file.name.replace(/\.[^/.]+$/, ''));
        setProcessedImage('');
        setMaskDataUrl(null);
        setShowResult(false);
        if (onImageUploaded) {
            onImageUploaded(true, imageSrc);
        }
    };

    const handleMaskChange = useCallback((mask: string | null) => {
        setMaskDataUrl(mask);
    }, []);

    const handleRemoveWatermark = async () => {
        if (!originalImage || !maskDataUrl) return;

        setIsProcessing(true);
        try {
            const result = await removeWatermark(originalImage, maskDataUrl);
            if (result.success && result.resultDataUrl) {
                setProcessedImage(result.resultDataUrl);
                setShowResult(true);
            } else {
                console.error('Watermark removal failed:', result.error);
            }
        } catch (error) {
            console.error('Error removing watermark:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        downloadImage(processedImage, `${fileName}_clean`, downloadFormat, 0.95);
    };

    const handleReset = () => {
        setOriginalImage('');
        setProcessedImage('');
        setMaskDataUrl(null);
        setFileName('image');
        setShowResult(false);
        if (onImageUploaded) {
            onImageUploaded(false, undefined);
        }
    };

    const handleBackToEdit = () => {
        setShowResult(false);
        setProcessedImage('');
    };

    // Step 1: Upload
    if (!originalImage) {
        return (
            <div className="max-w-2xl mx-auto">
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    onHeicConvert={convertHeic}
                />
            </div>
        );
    }

    // Step 3: Show Result
    if (showResult && processedImage) {
        return (
            <div className="space-y-6">
                <CompareSlider
                    beforeImage={originalImage}
                    afterImage={processedImage}
                    isLoading={false}
                    autoSlide={true}
                    autoSlideDelay={300}
                    className="max-w-4xl mx-auto"
                />

                <div className="flex flex-wrap justify-center gap-3">
                    <Button
                        onClick={handleDownload}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {t('button_download')}
                    </Button>
                    <Button
                        onClick={handleBackToEdit}
                        variant="outline"
                        size="lg"
                    >
                        <Eraser className="w-4 h-4 mr-2" />
                        Edit More
                    </Button>
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        size="lg"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('button_reset')}
                    </Button>
                </div>

                {/* Download format selector */}
                <div className="flex justify-center gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="format"
                            checked={downloadFormat === 'png'}
                            onChange={() => setDownloadFormat('png')}
                            className="accent-primary"
                        />
                        {t('download_png')}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="format"
                            checked={downloadFormat === 'jpg'}
                            onChange={() => setDownloadFormat('jpg')}
                            className="accent-primary"
                        />
                        {t('download_jpg')}
                    </label>
                </div>
            </div>
        );
    }

    // Step 2: Draw Mask
    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="text-center bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground">
                    {t('hint_draw')}
                </p>
            </div>

            {/* Brush Size Control */}
            <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">{t('brush_label')}</Label>
                    <span className="text-sm text-muted-foreground">{brushSize}px</span>
                </div>
                <Slider
                    value={[brushSize]}
                    onValueChange={(v) => setBrushSize(v[0])}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('brush_small')}</span>
                    <span>{t('brush_large')}</span>
                </div>
            </div>

            {/* Canvas */}
            <MaskCanvas
                imageSrc={originalImage}
                brushSize={brushSize}
                onMaskChange={handleMaskChange}
                className="max-w-4xl mx-auto"
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
                <Button
                    onClick={handleRemoveWatermark}
                    disabled={isProcessing || !maskDataUrl}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t('processing')}
                        </>
                    ) : (
                        <>
                            <Eraser className="w-4 h-4 mr-2" />
                            {t('button_remove')}
                        </>
                    )}
                </Button>
                <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('button_reset')}
                </Button>
            </div>

            {!maskDataUrl && (
                <p className="text-center text-sm text-muted-foreground">
                    Draw on the watermark to enable removal
                </p>
            )}
        </div>
    );
}
