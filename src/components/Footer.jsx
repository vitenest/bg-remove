import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand & Desc */}
          <div className="footer-brand-section">
            <div className="footer-brand-title">
              <Image src="/images/logo-bg-remove.png" alt="bg-remove logo" width={240} height={64} style={{ objectFit: 'contain', objectPosition: 'left', height: '64px', width: 'auto' }} />
            </div>
            <p className="footer-desc" style={{ maxWidth: '400px' }}>
              The ultimate free online background remover. Seamlessly extract subjects from images and videos with lightning speed and absolute privacy.
            </p>
          </div>

          {/* Tools Menu */}
          <div className="footer-links-section">
            <h3 className="footer-heading">Background Tools</h3>
            <ul className="footer-list">
              <li><Link href="/tools/png" className="footer-link">Transparent PNG Maker</Link></li>
              <li><Link href="/tools/jpg" className="footer-link">Remove Background from JPG</Link></li>
              <li><Link href="/tools/video" className="footer-link">Video Background Remover</Link></li>
              <li><Link href="/tools/logo" className="footer-link">Logo Background Remover</Link></li>
              <li><Link href="/tools/signature" className="footer-link">Signature Extractor</Link></li>
            </ul>
          </div>

          {/* More Free Tools Menu */}
          <div className="footer-ecosystem-section">
            <h3 className="footer-heading">More Free Tools</h3>
            <p className="footer-desc" style={{ marginBottom: '1.5rem', fontSize: '0.95rem', maxWidth: '350px' }}>
              bg-remove.com is part of the ViteNest ecosystem. Discover more premium free tools designed to boost your productivity.
            </p>
            <a href="https://vitenest.com/products" target="_blank" rel="noopener noreferrer" className="btn-vitenest-explore">
              Explore All ViteNest Tools <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} bg-remove.com - A <strong>ViteNest</strong> Product
            </p>
            <p style={{ margin: 0 }}>
              Developed by <strong>ViteRank</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
