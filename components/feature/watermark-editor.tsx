'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useWatermarkRemover } from '@/hooks/useWatermarkRemover';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import ImageUploader from './image-uploader';
import CompareSlider from './compare-slider';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Sparkles, Loader2, CheckCircle } from 'lucide-react';

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

    const handleImageSelect = async (imageSrc: string, file: File) => {
        setOriginalImage(imageSrc);
        setFileName(file.name.replace(/\.[^/.]+$/, ''));
        setProcessedImage('');
        setError(null);

        if (onImageUploaded) {
            onImageUploaded(true, imageSrc);
        }

        // 自动开始处理 (一键式体验)
        setIsProcessing(true);
        try {
            const result = await removeWatermark(imageSrc);
            if (result.success && result.resultDataUrl) {
                setProcessedImage(result.resultDataUrl);
            } else {
                setError(result.error || 'Processing failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
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
        setFileName('image');
        setError(null);
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

    // Processing State
    if (isProcessing) {
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
                    <h3 className="text-xl font-semibold text-destructive mb-2">处理失败</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={handleReset} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        重新开始
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
                    <span className="font-medium">水印已成功去除</span>
                </div>
            </div>

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
