/** @type {import('next-sitemap').IConfig} */
module.exports = {
    // TODO: Update to actual domain when available
    siteUrl: process.env.SITE_URL || 'https://wmr.example.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: ['/api/*', '/_next/*', '/server-sitemap.xml', '/icon.svg', '/apple-icon.png', '/_auth-pages/*'],

    // Generate alternate language links
    alternateRefs: [
        {
            href: 'https://wmr.example.com/en',
            hreflang: 'en',
        },
        {
            href: 'https://wmr.example.com/zh',
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

    // Static pages only (no more format-specific MakeBW pages)
    additionalPaths: async (config) => {
        const locales = ['en', 'zh'];
        const staticPages = ['privacy', 'terms', 'about'];
        const result = [];

        // Add static pages
        for (const locale of locales) {
            for (const page of staticPages) {
                const priority = page.includes('privacy') || page.includes('terms') ? 0.5 : 0.7;
                result.push({
                    loc: `/${locale}/${page}`,
                    changefreq: 'monthly',
                    priority: priority,
                    lastmod: new Date().toISOString(),
                });
            }
        }

        return result;
    },

    transform: async (config, path) => {
        let priority = 0.7;
        let changefreq = 'weekly';

        if (path === '/en' || path === '/zh') {
            priority = 1.0;
            changefreq = 'daily';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
        };
    },
};
