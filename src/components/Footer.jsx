import React from 'react';
import { Zap } from 'lucide-react';

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

          </div>

          {/* Tools Menu */}
          <div>
            <h3 className="footer-heading">Tools</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Background Removal</a></li>
              <li><a href="#" className="footer-link">Video Editing</a></li>
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
