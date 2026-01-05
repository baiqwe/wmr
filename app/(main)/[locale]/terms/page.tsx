import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const isZh = locale === 'zh';

    const title = isZh ? '服务条款 - WMR' : 'Terms of Service - WMR';
    const description = isZh
        ? 'WMR 的服务条款。了解使用我们免费 Gemini 水印去除工具的条款和条件。'
        : 'Terms of Service for WMR. Learn about the terms and conditions for using our free Gemini Watermark Remover tool.';

    return { title, description };
}

export default async function TermsPage({ params }: PageProps) {
    const { locale } = await params;
    const isZh = locale === 'zh';

    return (
        <main className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-8">
                    {isZh ? '服务条款' : 'Terms of Service'}
                </h1>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-8">
                        {isZh
                            ? '使用 WMR 即表示您同意以下条款。请仔细阅读。'
                            : 'By using WMR, you agree to these terms. Please read them carefully.'}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">{isZh ? '1. 服务描述' : '1. Service Description'}</h2>
                        <p className="text-muted-foreground">
                            {isZh
                                ? 'WMR 是一个免费的在线工具，用于去除 Gemini 水印和 Logo。所有图片处理都在您的浏览器本地完成。'
                                : 'WMR is a free online tool for removing Gemini watermarks and logos. All image processing happens locally in your browser.'}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">{isZh ? '2. 使用限制' : '2. Usage Restrictions'}</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>{isZh ? '您必须拥有处理图片的合法权利' : 'You must have legal rights to process the images'}</li>
                            <li>{isZh ? '请勿用于非法目的' : 'Do not use for illegal purposes'}</li>
                            <li>{isZh ? '请勿尝试破坏或滥用服务' : 'Do not attempt to break or abuse the service'}</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">{isZh ? '3. 免责声明' : '3. Disclaimer'}</h2>
                        <p className="text-muted-foreground">
                            {isZh
                                ? '本服务按"原样"提供，不做任何担保。我们对使用本服务产生的任何直接或间接损失不承担责任。'
                                : 'This service is provided "as is" without any warranties. We are not responsible for any direct or indirect damages resulting from the use of this service.'}
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
