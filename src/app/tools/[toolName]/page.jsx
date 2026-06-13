import HomeClient from '../../../components/HomeClient';
import { seoContent } from '../../../utils/seoContent';

export async function generateMetadata({ params }) {
  const toolName = params?.toolName;
  const content = seoContent[toolName] || seoContent.default;
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: 'website',
      url: `https://bg-remove.com/tools/${toolName}`,
    }
  };
}

export async function generateStaticParams() {
  return Object.keys(seoContent)
    .filter(key => key !== 'default')
    .map((toolName) => ({
      toolName,
    }));
}

export default function ToolPage() {
  return <HomeClient />;
}
