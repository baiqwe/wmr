import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Shield, Zap, Target, Sparkles, Smartphone, ImageIcon, Lock, Eye, Download } from 'lucide-react';

interface HomeStaticContentProps {
    locale: string;
}

export default async function HomeStaticContent({ locale }: HomeStaticContentProps) {
    const isZh = locale === 'zh';
    const t = await getTranslations({ locale, namespace: 'features' });

    return (
        <>
            {/* What Section */}
            <WhatSection isZh={isZh} />

            {/* How Section */}
            <HowSection isZh={isZh} />

            {/* Why Section */}
            <WhySection isZh={isZh} />

            {/* Features Section */}
            <FeaturesSection t={t} />

            {/* FAQ Section */}
            <FAQSection isZh={isZh} />

            {/* CTA Section */}
            <CTASection isZh={isZh} locale={locale} />
        </>
    );
}

function WhatSection({ isZh }: { isZh: boolean }) {
    return (
        <section className="py-20 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '什么是 Watermark Remover？' : 'What is Watermark Remover?'}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {isZh
                                ? 'Watermark Remover 是专为去除 AI 生成图片水印设计的免费工具。无论是 Google Gemini 的可见水印还是 SynthID 隐形水印，都能快速处理。100% 浏览器本地处理，您的图片永远不会上传到服务器。'
                                : 'Watermark Remover is a free tool designed specifically to remove watermarks from AI-generated images. Whether it\'s Google Gemini visible watermarks or SynthID invisible watermarks, we handle them all. 100% browser-based processing - your images never leave your device.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-background rounded-lg p-6 border border-border">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {isZh ? 'Gemini 水印' : 'Gemini Watermarks'}
                            </h3>
                            <p className="text-muted-foreground">
                                {isZh
                                    ? '专门优化处理 Google Gemini 生成图片中的可见水印和标记。'
                                    : 'Specifically optimized for visible watermarks and markers in Google Gemini generated images.'}
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 border border-border">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Eye className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {isZh ? 'SynthID 检测' : 'SynthID Detection'}
                            </h3>
                            <p className="text-muted-foreground">
                                {isZh
                                    ? '识别并处理 Google 的 SynthID 隐形数字水印技术。'
                                    : 'Detect and process Google\'s SynthID invisible digital watermarking technology.'}
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 border border-border">
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {isZh ? '隐私保护' : 'Privacy First'}
                            </h3>
                            <p className="text-muted-foreground">
                                {isZh
                                    ? '所有处理都在您的浏览器本地完成，图片从不上传到任何服务器。'
                                    : 'All processing happens locally in your browser. Images never upload to any server.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HowSection({ isZh }: { isZh: boolean }) {
    const steps = isZh ? [
        { number: 1, title: '上传图片', desc: '拖放或点击上传您的 AI 生成图片' },
        { number: 2, title: '标记水印', desc: '用画笔涂抹需要去除的水印区域' },
        { number: 3, title: '一键去除', desc: '点击去除按钮，即刻获得干净图片' },
    ] : [
        { number: 1, title: 'Upload Image', desc: 'Drag and drop or click to upload your AI-generated image' },
        { number: 2, title: 'Mark Watermark', desc: 'Paint over the watermark area you want to remove' },
        { number: 3, title: 'Remove Instantly', desc: 'Click remove button and get your clean image' },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '如何使用？' : 'How It Works'}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {isZh
                                ? '简单三步，即可去除 AI 图片水印。无需注册，无需下载。'
                                : 'Three simple steps to remove AI watermarks. No registration, no download required.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="relative text-center">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function WhySection({ isZh }: { isZh: boolean }) {
    const reasons = isZh ? [
        { icon: Lock, title: '完全私密', desc: '图片永不上传服务器，100% 浏览器本地处理' },
        { icon: Zap, title: '即时处理', desc: '秒级完成水印去除，实时查看处理效果' },
        { icon: Sparkles, title: '免费使用', desc: '无需注册，无需付费，无任何隐藏费用' },
        { icon: Smartphone, title: '随处可用', desc: '支持桌面和移动设备，任何现代浏览器都能用' },
    ] : [
        { icon: Lock, title: 'Completely Private', desc: 'Images never upload to servers, 100% browser-based processing' },
        { icon: Zap, title: 'Instant Processing', desc: 'Remove watermarks in seconds, see results in real-time' },
        { icon: Sparkles, title: 'Free to Use', desc: 'No registration, no payment, no hidden fees' },
        { icon: Smartphone, title: 'Works Everywhere', desc: 'Desktop and mobile supported, works in any modern browser' },
    ];

    return (
        <section className="py-20 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '为什么选择我们？' : 'Why Choose Us?'}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {reasons.map((reason, idx) => {
                            const Icon = reason.icon;
                            return (
                                <div key={idx} className="bg-background rounded-lg p-6 border border-border hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                                            <p className="text-muted-foreground">{reason.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection({ t }: { t: any }) {
    const features = [
        { icon: Lock, title: t('feature_1_title'), desc: t('feature_1_desc') },
        { icon: Zap, title: t('feature_2_title'), desc: t('feature_2_desc') },
        { icon: Target, title: t('feature_3_title'), desc: t('feature_3_desc') },
        { icon: Sparkles, title: t('feature_4_title'), desc: t('feature_4_desc') },
        { icon: Smartphone, title: t('feature_5_title'), desc: t('feature_5_desc') },
        { icon: ImageIcon, title: t('feature_6_title'), desc: t('feature_6_desc') },
    ];

    return (
        <section id="features" className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-6xl space-y-12 text-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {t('title')}
                        </h2>
                        <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-muted/30 p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
                                >
                                    <div className="space-y-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FAQSection({ isZh }: { isZh: boolean }) {
    const faqs = isZh ? [
        {
            q: "如何去除 Gemini 图片中的水印？",
            a: "1. 上传您的 Gemini 生成图片\n2. 用画笔工具涂抹水印区域\n3. 点击\"去除水印\"按钮\n4. 下载处理后的干净图片"
        },
        {
            q: "这个工具是免费的吗？",
            a: "是的，Watermark Remover 完全免费使用。没有隐藏费用，没有水印，也不需要注册账号。"
        },
        {
            q: "我的图片安全吗？",
            a: "绝对安全！所有图片处理都在您的浏览器本地完成，从不上传到任何服务器。您的图片和隐私得到 100% 保护。"
        },
        {
            q: "可以去除 SynthID 水印吗？",
            a: "我们的工具可以帮助处理可见的水印和标记。对于 SynthID 等隐形数字水印，我们通过图像重处理技术来减轻其影响。"
        }
    ] : [
        {
            q: "How do I remove watermarks from Gemini images?",
            a: "1. Upload your Gemini-generated image\n2. Use the brush tool to paint over the watermark area\n3. Click the 'Remove Watermark' button\n4. Download your clean image"
        },
        {
            q: "Is this tool free?",
            a: "Yes, Watermark Remover is completely free to use. No hidden fees, no watermarks on output, and no registration required."
        },
        {
            q: "Are my images safe?",
            a: "Absolutely! All image processing happens locally in your browser. Nothing is uploaded to any server. Your images and privacy are 100% protected."
        },
        {
            q: "Can it remove SynthID watermarks?",
            a: "Our tool can help process visible watermarks and markers. For invisible digital watermarks like SynthID, we use image reprocessing techniques to reduce their impact."
        }
    ];

    return (
        <section className="py-20 bg-muted/20 border-t">
            <div className="container px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '常见问题' : 'Frequently Asked Questions'}
                        </h2>
                    </div>

                    <div className="grid gap-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-background rounded-lg p-6 space-y-3 border border-border">
                                <h3 className="text-xl font-bold">{faq.q}</h3>
                                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTASection({ isZh, locale }: { isZh: boolean; locale: string }) {
    return (
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-4xl text-center space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            {isZh ? '立即开始' : 'Start Removing Watermarks'}
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                            {isZh
                                ? '免费、快速、完全私密。无需注册，立即使用。'
                                : 'Free, fast, and completely private. No sign-up required.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Link
                                href={`/${locale}`}
                                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity font-medium text-lg"
                            >
                                {isZh ? '上传图片开始' : 'Upload Image to Start'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
