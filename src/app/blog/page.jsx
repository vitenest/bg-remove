import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '../../utils/blogPosts';

export const metadata = {
  title: 'Blog | bg-remove.com',
  description: 'Tips, tutorials, and news about background removal and image editing.',
};

export default function BlogIndexPage() {
  return (
    <div className="main-content" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Blog</h1>
      <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>Tips, tutorials, and news from the bg-remove team.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {blogPosts.map(post => (
          <div key={post.slug} className="glass-panel" style={{ padding: '0', textAlign: 'left', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', height: '200px' }}>
              <Image src={post.featuredImage} alt={post.title} fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="gradient-text-hover">
                  {post.title}
                </Link>
              </h2>
              <p style={{ color: '#ccc', marginBottom: '2rem', flexGrow: 1, lineHeight: '1.6' }}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
