'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const isZh = currentLocale === 'zh';
  const localePrefix = `/${currentLocale}`;

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={localePrefix} className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍌</span>
              <span className="font-bold text-lg">WMR</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('product')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={localePrefix} className="text-muted-foreground hover:text-foreground transition-colors">
                  {isZh ? 'Gemini 水印去除' : 'Gemini Watermark Remover'}
                </Link>
              </li>
              <li>
                <Link href={localePrefix} className="text-muted-foreground hover:text-foreground transition-colors">
                  {isZh ? 'Gemini Logo 去除' : 'Gemini Logo Remover'}
                </Link>
              </li>
              <li>
                <Link href={`${localePrefix}#features`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('link_features')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t('resources')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${localePrefix}/about`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('link_about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${localePrefix}/privacy`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('link_privacy')}
                </Link>
              </li>
              <li>
                <Link href={`${localePrefix}/terms`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('link_terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WMR. {t('rights')}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>🛡️ {isZh ? '100% 浏览器处理' : '100% Browser-Based'}</span>
            <span>🔒 {isZh ? '隐私优先' : 'Privacy First'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
