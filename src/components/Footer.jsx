import React from 'react';
import { Zap, Mail, Globe, MessageCircle, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand & Social */}
          <div className="footer-brand-section">
            <div className="footer-brand-title">
              <div className="footer-logo-icon">
                <Zap size={24} />
              </div>
              <span className="footer-brand-name">
                bg-remove
              </span>
            </div>
            <p className="footer-desc">
              Advanced AI technology to extract subjects and remove backgrounds with pixel-perfect precision instantly in your browser.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-link">
                <Globe size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <Mail size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="footer-social-link">
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Product Menu */}
          <div>
            <h3 className="footer-heading">Product</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Background Removal</a></li>
              <li><a href="#" className="footer-link">Video Editing</a></li>
              <li><a href="#" className="footer-link">API Integration</a></li>
              <li><a href="#" className="footer-link">Pricing Options</a></li>
            </ul>
          </div>

          {/* Resources Menu */}
          <div>
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Documentation</a></li>
              <li><a href="#" className="footer-link">Tutorials & Guides</a></li>
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Community Forum</a></li>
            </ul>
          </div>

          {/* Company Menu */}
          <div>
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">About ViteNest</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} bg-remove.com - A <strong>ViteNest</strong> Product.</p>
          <p style={{ margin: 0 }}>Developed by <strong>ViteRank</strong>.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
