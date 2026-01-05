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

    // Hero section with left-right layout
    return (
        <section className="relative py-12 lg:py-20 bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-background dark:from-blue-950/20 dark:via-purple-950/10 dark:to-background">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                    {/* Left side: Title and description */}
                    <div className="space-y-6 lg:space-y-8">
                        <div className="inline-flex items-center rounded-full px-4 py-2 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                            <span className="mr-2">🎨</span>
                            {t('badge')}
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                            {t('title')}
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {t('title_highlight')}
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                            {t('subtitle')}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {t('feature_1')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                {t('feature_2')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                {t('feature_3')}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Upload area */}
                    <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
                        <div className="w-full max-w-lg">
                            <WatermarkEditor onImageUploaded={onImageUploaded} />
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
