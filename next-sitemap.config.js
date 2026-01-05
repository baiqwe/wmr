/** @type {import('next-sitemap').IConfig} */
module.exports = {
    // TODO: Update to actual domain when available
    siteUrl: process.env.SITE_URL || 'https://watermarkremover.example.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: ['/api/*', '/_next/*', '/server-sitemap.xml', '/icon.svg', '/apple-icon.png', '/_auth-pages/*'],

    // Generate alternate language links
    alternateRefs: [
        {
            href: 'https://watermarkremover.example.com/en',
            hreflang: 'en',
        },
        {
            href: 'https://watermarkremover.example.com/zh',
            hreflang: 'zh',
        },
    ],

    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
    },

    // ✅ 核心修复：手动添加动态路由路径
    additionalPaths: async (config) => {
        const locales = ['en', 'zh'];
        const formats = ['jpg', 'png', 'webp', 'heic'];
        const staticPages = [
            'color-to-black-and-white',
            'photo-to-coloring-page',
            'invert-colors',
            'privacy',
            'terms',
            'about'
        ];
        const result = [];

        // Add format-specific pages
        for (const locale of locales) {
            for (const format of formats) {
                const path = `/${locale}/${format}-to-black-and-white`;

                result.push({
                    loc: path,
                    changefreq: 'weekly',
                    priority: 0.9,
                    lastmod: new Date().toISOString(),
                });
            }
        }

        // Add static feature and policy pages
        for (const locale of locales) {
            for (const page of staticPages) {
                const priority = page.includes('privacy') || page.includes('terms') ? 0.5 : 0.8;
                result.push({
                    loc: `/${locale}/${page}`,
                    changefreq: page.includes('privacy') || page.includes('terms') ? 'monthly' : 'weekly',
                    priority: priority,
                    lastmod: new Date().toISOString(),
                });
            }
        }

        return result;
    },

    transform: async (config, path) => {
        // Add priority and changefreq based on page type
        let priority = 0.7;
        let changefreq = 'weekly';

        if (path === '/en' || path === '/zh') {
            // Homepage has highest priority
            priority = 1.0;
            changefreq = 'daily';
        } else if (path.includes('-to-black-and-white')) {
            // Format pages are important landing pages
            priority = 0.9;
            changefreq = 'weekly';
        } else if (path.includes('photo-to-coloring-page') || path.includes('color-to-black-and-white')) {
            // Feature pages
            priority = 0.8;
            changefreq = 'weekly';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
        };
    },
};
