export const metadata = {
  title: 'Contact Us | bg-remove.com',
  description: 'Get in touch with the bg-remove.com team.',
};

export default function ContactPage() {
  return (
    <div className="main-content" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Contact Us</h1>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', lineHeight: '1.8' }}>
        <p>If you have any questions, feedback, or business inquiries, we'd love to hear from you. Please reach out to us using the information below.</p>
        
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Email Support</h2>
        <p>You can contact our support team at: <strong>support@bg-remove.com</strong></p>
        
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Business Inquiries</h2>
        <p>For partnerships, media coverage, and other business-related matters, please email: <strong>business@bg-remove.com</strong></p>
        
        <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Send us a message</h3>
          <p>Alternatively, you can connect with us through our official social media channels or the ViteNest community forum. We typically respond within 24-48 hours during regular business days.</p>
        </div>
      </div>
    </div>
  );
}
