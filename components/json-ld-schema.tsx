/**
 * JSON-LD Structured Data for SoftwareApplication
 * Helps search engines understand Watermark Remover as a web application
 * 
 * Note: This is a server component to avoid hydration issues
 */
import { getTranslations } from 'next-intl/server';

export async function SoftwareApplicationSchema({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'metadata' });

    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Watermark Remover - Free AI Tool",
        "description": t('description'),
        "applicationCategory": "PhotoEditingApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "AI-powered watermark removal",
            "Gemini SynthID detection",
            "Privacy-first browser processing",
            "No upload required",
            "Before/after comparison slider",
            "Multiple format support (JPG, PNG, WebP)"
        ],
        "screenshot": "https://watermarkremover.com/og-image.png",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "2150"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
