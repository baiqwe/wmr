'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import WatermarkEditor from '@/components/feature/watermark-editor';

interface HomeInteractiveProps {
    onShowStaticContent: (show: boolean) => void;
}

export default function HomeInteractive({ onShowStaticContent }: HomeInteractiveProps) {
    const [imageUploaded, setImageUploaded] = useState(false);

    const handleImageUploaded = (uploaded: boolean, imageSrc?: string) => {
        setImageUploaded(uploaded);
        onShowStaticContent(!uploaded);
    };

    return (
        <HeroWithUploadSection
            onImageUploaded={handleImageUploaded}
            imageUploaded={imageUploaded}
        />
    );
}

function HeroWithUploadSection({
    onImageUploaded,
    imageUploaded
}: {
    onImageUploaded: (uploaded: boolean, imageSrc?: string) => void;
    imageUploaded: boolean;
}) {
    const t = useTranslations('hero');

    // If image is uploaded, show the watermark editor in full width
    if (imageUploaded) {
        return (
            <section className="py-8 lg:py-12 bg-background">
                <div className="container px-4 md:px-6">
                    <WatermarkEditor onImageUploaded={onImageUploaded} />
                </div>
            </section>
        );
    }

    // Hero section with left-right layout and H1 SEO strategy
    return (
        <section className="relative py-12 lg:py-20 bg-gradient-to-b from-yellow-50/50 via-orange-50/30 to-background dark:from-yellow-950/20 dark:via-orange-950/10 dark:to-background">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                    {/* Left side: SEO H1 Strategy - Visual Deception (Option C) */}
                    <div className="space-y-6 lg:space-y-8">
                        <div className="inline-flex items-center rounded-full px-4 py-2 text-sm bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-800/50">
                            <span className="mr-2">🍌</span>
                            {t('badge')}
                        </div>

                        {/* H1 方案 C: 代码连续，视觉分层 */}
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            <span className="block text-foreground">{t('h1_part1')}</span>
                            <span className="block text-2xl md:text-4xl text-yellow-600 dark:text-yellow-500 mt-2">
                                & {t('h1_part2')}
                            </span>
                        </h1>

                        {/* 密度控制: 首段文字自然植入两个关键词 */}
                        <p className="text-lg text-muted-foreground md:text-xl max-w-xl leading-relaxed">
                            {t('hero_desc')}
                        </p>

                        {/* 信任信号 (Trust) */}
                        <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {t('feature_1')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                {t('feature_2')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                {t('feature_3')}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Upload area with trust signals */}
                    <div className="flex flex-col items-center justify-center min-h-[400px] lg:min-h-[500px]">
                        <div className="w-full max-w-lg bg-card border rounded-2xl shadow-xl p-6">
                            <WatermarkEditor onImageUploaded={onImageUploaded} />

                            {/* 信任信号 (Trust): 放在工具正下方 */}
                            <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">🛡️ 100% Client-Side</span>
                                <span className="flex items-center gap-1">⚡ AI Inpainting</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Export visibility control hook for parent component
export function useHomeInteractive() {
    const [showStaticContent, setShowStaticContent] = useState(true);
    return { showStaticContent, setShowStaticContent };
}
