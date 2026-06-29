import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { blogPosts } from '../../../utils/blogPosts';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | bg-remove.com`,
    description: post.excerpt,
    openGraph: {
      images: [post.featuredImage],
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="main-content" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh', textAlign: 'left', lineHeight: '1.8' }}>
      <Link href="/blog" style={{ color: '#3b82f6', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to Blog</Link>
      
      <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'left', lineHeight: '1.2' }}>{post.title}</h1>
      <div style={{ color: '#888', fontSize: '1rem', marginBottom: '2rem' }}>{post.date} • {post.readTime}</div>
      
      <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '3rem', borderRadius: '16px', overflow: 'hidden' }}>
        <Image src={post.featuredImage} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
      </div>

      <div className="glass-panel" style={{ padding: '3rem', fontSize: '1.15rem' }}>
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
      
      {/* Basic blog styling for the injected HTML */}
        <style dangerouslySetInnerHTML={{__html: `
          .blog-content h2 { margin-top: 3rem; margin-bottom: 1.5rem; font-size: 1.8rem; color: #111111; }
          .blog-content p { margin-bottom: 1.5rem; color: #52525b; }
          .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin-bottom: 1.5rem; color: #52525b; }
          .blog-content li { margin-bottom: 0.5rem; }
          .blog-content strong { color: #111111; }
        `}} />
    </div>
  );
}
