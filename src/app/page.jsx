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
  const schema = {
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
  };

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
