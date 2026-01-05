import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Shield, Users } from 'lucide-react';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const isZh = locale === 'zh';

    const ogImage = '/logo-icon.png';
    const title = isZh ? '关于我们 - Gemini Watermark Remover' : 'About Us - Gemini Watermark Remover';
    const description = isZh
        ? '了解 WMR - 免费的 Gemini 水印和 Logo 去除工具。100% 浏览器本地处理，保护您的隐私。'
        : 'Learn about WMR - the free Gemini Watermark and Logo Remover. 100% browser-based processing to protect your privacy.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://cleanaiimages.com/${locale}/about`,
            images: [
                {
                    url: ogImage,
                    width: 512,
                    height: 512,
                    alt: isZh ? 'WMR 关于我们' : 'WMR About Us',
                },
            ],
        },
    };
}

export default async function AboutPage({ params }: PageProps) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", position: 1, name: isZh ? '首页' : 'Home', item: `https://cleanaiimages.com/${locale}` },
            { "@type": "ListItem", position: 2, name: isZh ? '关于我们' : 'About Us', item: `https://cleanaiimages.com/${locale}/about` },
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <main className="min-h-screen bg-background">
                <div className="container max-w-4xl mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold text-center mb-8">
                        {isZh ? '关于 WMR' : 'About WMR'}
                    </h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <Target className="w-6 h-6 text-yellow-500" />
                                {isZh ? '我们的使命' : 'Our Mission'}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {isZh
                                    ? 'WMR (Watermark Remover) 的目标是提供最好的免费 Gemini 水印和 Logo 去除工具。我们相信每个人都应该能够轻松清理 AI 生成图片中的水印，而不必担心隐私问题或付费订阅。'
                                    : 'WMR (Watermark Remover) aims to provide the best free Gemini Watermark and Logo Remover. We believe everyone should be able to easily clean watermarks from AI-generated images without worrying about privacy issues or paid subscriptions.'}
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-green-500" />
                                {isZh ? '隐私优先' : 'Privacy First'}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {isZh
                                    ? '我们的工具 100% 在您的浏览器中运行。您的图片永远不会上传到任何服务器。所有的 AI 修复处理都在您的设备本地完成，确保您的图片安全和隐私。'
                                    : 'Our tool runs 100% in your browser. Your images are never uploaded to any server. All AI inpainting processing happens locally on your device, ensuring your images remain safe and private.'}
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-500" />
                                {isZh ? '为谁而建' : 'Built For'}
                            </h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>{isZh ? '内容创作者需要清理 AI 生成的图片' : 'Content creators who need to clean AI-generated images'}</li>
                                <li>{isZh ? '设计师想要移除 Gemini Logo' : 'Designers who want to remove Gemini logos'}</li>
                                <li>{isZh ? '任何需要快速、免费、私密水印去除的人' : 'Anyone who needs fast, free, and private watermark removal'}</li>
                            </ul>
                        </section>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href={`/${locale}`}
                            className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            {isZh ? '开始使用' : 'Get Started'}
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
