import { seoContent } from '../utils/seoContent';

export default function sitemap() {
  const baseUrl = 'https://bg-remove.com';

  const routes = Object.keys(seoContent).map((route) => ({
    url: route === 'default' ? baseUrl : `${baseUrl}/tools/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === 'default' ? 1 : 0.8,
  }));

  return routes;
}
