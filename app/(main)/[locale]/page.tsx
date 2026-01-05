import HomeClientWrapper from '@/components/home/HomeClientWrapper';
import HomeStaticContent from '@/components/home/HomeStaticContent';

// ✅ This is now a Server Component (no 'use client')
// Hero/Interactive content is client-side, static content is server-rendered for SEO

// ✅ 告诉 Cloudflare 构建时生成这几个页面，而不是运行时计算
export async function generateStaticParams() {
    return [
        { locale: 'en' },
        { locale: 'zh' }
    ];
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;

    // Server-rendered static content for better LCP and SEO
    const staticContent = await HomeStaticContent({ locale });

    return (
        <HomeClientWrapper staticContent={staticContent} />
    );
}
