import HomeClient from '../../../components/HomeClient';
import { seoContent } from '../../../utils/seoContent';

export async function generateMetadata({ params }) {
  const toolName = params?.toolName;
  const content = seoContent[toolName] || seoContent.default;
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `https://bg-remove.com/tools/${toolName}`,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: 'website',
      url: `https://bg-remove.com/tools/${toolName}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(seoContent)
    .filter(key => key !== 'default')
    .map((toolName) => ({
      toolName,
    }));
}

export default function ToolPage({ params }) {
  const toolName = params?.toolName;
  const content = seoContent[toolName] || seoContent.default;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `bg-remove.com - ${content.metaTitle}`,
    "url": `https://bg-remove.com/tools/${toolName}`,
    "description": content.metaDescription,
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
