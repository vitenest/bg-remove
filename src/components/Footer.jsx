function Footer() {
  return (
    <footer>
      <p style={{ marginBottom: '0.5rem', color: '#1f2937' }}>
        © {new Date().getFullYear()} bg-remove.com - A <strong>ViteNest</strong> Product
      </p>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
        Developed by <strong style={{ color: '#1f2937' }}>ViteRank</strong>
      </p>
    </footer>
  );
}

export default Footer;
