import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Eye, Server, Cookie } from 'lucide-react';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const isZh = locale === 'zh';

    const title = isZh ? '隐私政策 - WMR' : 'Privacy Policy - WMR';
    const description = isZh
        ? 'WMR 的隐私政策。所有图片处理都在您的浏览器本地完成，从不上传到服务器。了解我们如何保护您的隐私。'
        : 'WMR Privacy Policy. All image processing happens locally in your browser, never uploaded to servers. Learn how we protect your privacy.';

    return { title, description };
}

export default async function PrivacyPage({ params }: PageProps) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return (
        <main className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-8">
                    {isZh ? '隐私政策' : 'Privacy Policy'}
                </h1>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-green-500" />
                        <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
                            {isZh ? '核心承诺：您的图片从不离开您的设备' : 'Core Promise: Your images never leave your device'}
                        </h2>
                    </div>
                    <p className="text-muted-foreground">
                        {isZh
                            ? 'WMR 的所有图片处理都 100% 在您的浏览器本地完成。我们不会上传、存储或访问您的任何图片。'
                            : 'All WMR image processing happens 100% locally in your browser. We do not upload, store, or access any of your images.'}
                    </p>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            {isZh ? '我们收集什么' : 'What We Collect'}
                        </h2>
                        <p className="text-muted-foreground">
                            {isZh
                                ? '我们仅收集匿名的网站使用统计数据（如页面访问量）用于改善服务。我们不收集任何个人身份信息或您处理的图片。'
                                : 'We only collect anonymous website usage statistics (like page views) to improve our service. We do not collect any personally identifiable information or your processed images.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Server className="w-5 h-5" />
                            {isZh ? '本地处理' : 'Local Processing'}
                        </h2>
                        <p className="text-muted-foreground">
                            {isZh
                                ? '我们的 Gemini 水印去除器使用浏览器内置的 Canvas API 处理图片。所有计算都在您的设备上完成，不需要服务器参与。'
                                : 'Our Gemini Watermark Remover uses the browser\'s built-in Canvas API to process images. All computation happens on your device without any server involvement.'}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Cookie className="w-5 h-5" />
                            {isZh ? 'Cookies' : 'Cookies'}
                        </h2>
                        <p className="text-muted-foreground">
                            {isZh
                                ? '我们使用必要的技术 Cookie 来保存您的语言和主题偏好。这些 Cookie 不用于追踪或广告目的。'
                                : 'We use essential technical cookies to save your language and theme preferences. These cookies are not used for tracking or advertising purposes.'}
                        </p>
                    </section>
                </div>

                <div className="text-center mt-12">
                    <Link
                        href={`/${locale}`}
                        className="text-yellow-600 hover:underline"
                    >
                        {isZh ? '返回首页' : 'Back to Home'}
                    </Link>
                </div>
            </div>
        </main>
    );
}
