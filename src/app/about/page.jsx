export const metadata = {
  title: 'About Us | bg-remove.com',
  description: 'Learn more about bg-remove.com, the ultimate free AI background remover tool.',
};

export default function AboutPage() {
  return (
    <div className="main-content" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>About Us</h1>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', lineHeight: '1.8' }}>
        <p>Welcome to <strong>bg-remove.com</strong>, your number one source for AI-powered background removal. We're dedicated to giving you the very best of image processing tools, with a focus on speed, privacy, and ease of use.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Our Mission</h2>
        <p>Founded with the vision to make professional image editing accessible to everyone, bg-remove.com leverages cutting-edge artificial intelligence to extract subjects from photos and videos in seconds. Whether you are an e-commerce owner, a photographer, a marketer, or just someone looking to create a cool meme, our platform is designed for you.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Privacy First</h2>
        <p>We believe that your data belongs to you. That is why our tools process your images and videos directly on your device when possible, ensuring maximum privacy and security. We don't store or share your uploaded files.</p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Part of ViteNest</h2>
        <p>bg-remove.com is proudly part of the ViteNest ecosystem—a suite of premium, free tools built to boost your productivity. We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>
      </div>
    </div>
  );
}
