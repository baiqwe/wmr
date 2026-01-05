/**
 * JSON-LD Structured Data for SoftwareApplication
 * Tells Google about dual core functions: Watermark Remover + Logo Remover
 */
import { getTranslations } from 'next-intl/server';

export async function SoftwareApplicationSchema({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'metadata' });

    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Gemini Watermark & Logo Remover",
        "description": "A free tool to remove Gemini Watermarks and specifically erase Gemini Logos from AI generated images.",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Gemini Logo Remover",
            "Gemini Watermark Remover",
            "SynthID Cleaning",
            "AI Inpainting",
            "Privacy-first browser processing",
            "No upload required"
        ],
        "screenshot": "https://wmr.example.com/og-image.png",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "120"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
