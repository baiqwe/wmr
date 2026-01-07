'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useWatermarkRemover, WatermarkConfig } from '@/hooks/useWatermarkRemover';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import ImageUploader from './image-uploader';
import CompareSlider from './compare-slider';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, RefreshCw, Sparkles, Loader2, CheckCircle, Settings2 } from 'lucide-react';

interface WatermarkEditorProps {
    onImageUploaded?: (uploaded: boolean, imageSrc?: string) => void;
}

export default function WatermarkEditor({ onImageUploaded }: WatermarkEditorProps) {
    const t = useTranslations('editor');
    const { removeWatermark } = useWatermarkRemover();
    const { downloadImage, convertHeic } = useImageProcessor();

    const [originalImage, setOriginalImage] = useState<string>('');
    const [processedImage, setProcessedImage] = useState<string>('');
    const [fileName, setFileName] = useState<string>('image');
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
    const [error, setError] = useState<string | null>(null);

    // Manual Adjustment State
    const [adjustMode, setAdjustMode] = useState(false);
    const [customSize, setCustomSize] = useState([80]);
    const [customMargin, setCustomMargin] = useState([42]);

    // Core processing function
    const processImage = useCallback(async (src: string, config?: WatermarkConfig) => {
        setIsProcessing(true);
        try {
            const result = await removeWatermark(src, config);
            if (result.success && result.resultDataUrl) {
                setProcessedImage(result.resultDataUrl);
                setError(null);
            } else {
                setError(result.error || 'Processing failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsProcessing(false);
        }
    }, [removeWatermark]);

    const handleImageSelect = useCallback(async (imageSrc: string, file: File) => {
        setOriginalImage(imageSrc);
        setFileName(file.name.replace(/\.[^/.]+$/, ''));
        // processedImage will be set by the initial process call
        setError(null);

        if (onImageUploaded) {
            onImageUploaded(true, imageSrc);
        }

        // Initialize sliders based on image size and run initial processing
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const isLarge = img.width > 1024 && img.height > 1024;
            setCustomSize([isLarge ? 80 : 40]);
            setCustomMargin([isLarge ? 42 : 21]);

            // First run with auto settings (undefined config)
            processImage(imageSrc, undefined);
        };
    }, [processImage, onImageUploaded]);

    // Handle slider adjustments
    const handleAdjustmentChange = () => {
        if (!originalImage) return;
        processImage(originalImage, {
            size: customSize[0],
            margin: customMargin[0]
        });
    };

    const handleDownload = () => {
        if (!processedImage) return;
        downloadImage(processedImage, `${fileName}_clean`, downloadFormat, 0.95);
    };

    const handleReset = () => {
        setOriginalImage('');
        setProcessedImage('');
        setFileName('image');
        setError(null);
        setAdjustMode(false); // Reset adjustment mode
        if (onImageUploaded) {
            onImageUploaded(false, undefined);
        }
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

    // Processing State (Initial only, adjustment loading is handled by CompareSlider)
    if (isProcessing && !processedImage) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="animate-pulse">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                    <h3 className="text-xl font-semibold mb-2">{t('processing')}</h3>
                    <p className="text-muted-foreground">
                        正在使用逆向 Alpha 混合算法...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-destructive mb-2">{t('error_title')}</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={handleReset} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('error_retry')}
                    </Button>
                </div>
            </div>
        );
    }

    // Result View (Compare Slider)
    return (
        <div className="space-y-6">
            {/* Success Badge */}
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 border border-green-500/30 rounded-full px-4 py-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{t('success_badge')}</span>
                </div>
            </div>

            <CompareSlider
                beforeImage={originalImage}
                afterImage={processedImage}
                isLoading={isProcessing}
                autoSlide={!adjustMode} // Disable auto-slide when adjusting
                autoSlideDelay={300}
                className="max-w-4xl mx-auto"
            />

            {/* Manual Adjustment Panel */}
            <div className="max-w-2xl mx-auto bg-card border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        <h3 className="font-medium">{t('adjust_title')}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="adjust-mode"
                            checked={adjustMode}
                            onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                setAdjustMode(isChecked);

                                if (!isChecked && originalImage) {
                                    // Revert to auto-processing
                                    processImage(originalImage, undefined);

                                    // Reset sliders to default values
                                    const img = new Image();
                                    img.src = originalImage;
                                    img.onload = () => {
                                        const isLarge = img.width > 1024 && img.height > 1024;
                                        setCustomSize([isLarge ? 80 : 40]);
                                        setCustomMargin([isLarge ? 42 : 21]);
                                    };
                                }
                            }}
                        />
                        <Label htmlFor="adjust-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('adjust_enable')}
                        </Label>
                    </div>
                </div>

                {adjustMode ? (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-top-2 pt-2">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label>{t('adjust_size')}: {customSize[0]}px</Label>
                            </div>
                            <Slider
                                value={customSize}
                                onValueChange={setCustomSize}
                                onValueCommit={handleAdjustmentChange}
                                min={20}
                                max={150}
                                step={1}
                            />
                            <p className="text-xs text-muted-foreground">{t('adjust_size_hint')}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label>{t('adjust_margin')}: {customMargin[0]}px</Label>
                            </div>
                            <Slider
                                value={customMargin}
                                onValueChange={setCustomMargin}
                                onValueCommit={handleAdjustmentChange}
                                min={0}
                                max={100}
                                step={1}
                            />
                            <p className="text-xs text-muted-foreground">{t('adjust_margin_hint')}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground text-center pt-1">
                        {t('adjust_auto_hint')}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {t('button_download')}
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

            {/* Algorithm Note */}
            <p className="text-center text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 inline mr-1" />
                使用逆向 Alpha 混合算法 · 像素级精准还原
            </p>
        </div>
    );
}
