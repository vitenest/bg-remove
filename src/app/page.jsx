import HomeClient from '../components/HomeClient';
import { seoContent } from '../utils/seoContent';

export async function generateMetadata() {
  const content = seoContent.default;
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: 'website',
      url: 'https://bg-remove.com',
    }
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
    }
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
