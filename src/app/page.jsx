import HomeClient from '../components/HomeClient';
import { seoContent } from '../utils/seoContent';

export async function generateMetadata() {
  const content = seoContent.default;
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: 'https://bg-remove.com',
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: 'website',
      url: 'https://bg-remove.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default function Page() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "bg-remove.com",
      "url": "https://bg-remove.com",
      "description": seoContent.default.metaDescription,
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "8430"
      },
      "featureList": "Remove background from images, Video background removal, HD Output, 100% Free, Secure and Private, No Server Uploads"
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Transparent PNG Maker",
          "url": "https://bg-remove.com/tools/png"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "AI Video Background Remover",
          "url": "https://bg-remove.com/tools/video"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "GIF Background Remover",
          "url": "https://bg-remove.com/tools/gif"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Convert JPG to Transparent",
          "url": "https://bg-remove.com/tools/jpg"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Transparent Logo Maker",
          "url": "https://bg-remove.com/tools/logo"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 6,
          "name": "Extract PDF Images",
          "url": "https://bg-remove.com/tools/pdf"
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomeClient />
    </>
  );
}
