"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Layers, ChevronDown, File, FileText, FileImage, Diamond, PenTool, Image as ImageIcon, Camera, Code, Cpu, Menu, X } from 'lucide-react';
import { getCookie, setCookie } from '../utils/browserTracker';

function Navbar() {
  const [showNewBadge, setShowNewBadge] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const hidden = getCookie('hideVideoBadge');
    if (!hidden) {
      setShowNewBadge(true);
    }
  }, []);

  const handleVideoClick = () => {
    setCookie('hideVideoBadge', 'true', 30);
    setShowNewBadge(false);
    setIsMobileMenuOpen(false);
  };
  return (
    <nav className="navbar">
      <Link href="/" className="nav-brand">
        <Image src="/images/logo-bg-remove.png" alt="bg-remove logo" width={240} height={64} style={{ objectFit: 'contain', height: '64px', width: 'auto' }} priority />
      </Link>
      
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="nav-item-dropdown">
          <Link href="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Erase Background <ChevronDown size={14} /></Link>
          
          <div className="mega-menu">
            <div className="mega-menu-col">
              <h4>File Type</h4>
              <ul className="mega-menu-list">
                <li><Link href="/tools/png" className="mega-menu-item" onClick={() => setIsMobileMenuOpen(false)}><File className="mega-menu-icon" /> PNG</Link></li>
                <li><Link href="/tools/jpg" className="mega-menu-item" onClick={() => setIsMobileMenuOpen(false)}><FileImage className="mega-menu-icon" /> JPG</Link></li>
                <li><Link href="/tools/jpeg" className="mega-menu-item" onClick={() => setIsMobileMenuOpen(false)}><FileImage className="mega-menu-icon" /> JPEG</Link></li>
                <li><Link href="/tools/pdf" className="mega-menu-item" onClick={() => setIsMobileMenuOpen(false)}><FileText className="mega-menu-icon" /> PDF</Link></li>
                <li><Link href="/tools/gif" className="mega-menu-item" onClick={() => setIsMobileMenuOpen(false)}><FileImage className="mega-menu-icon" /> GIF</Link></li>
              </ul>
            </div>
            <div className="mega-menu-col">
              <h4>Remove Background</h4>
              <ul className="mega-menu-list">
                <li><Link href="/tools/logo" className="mega-menu-item" onClick={() => setIsMobileMenuOpen(false)}><Diamond className="mega-menu-icon" /> Logo</Link></li>
                <li><Link href="/tools/signature" className="mega-menu-item" onClick={() => setIsMobileMenuOpen(false)}><PenTool className="mega-menu-icon" /> Signature</Link></li>
              </ul>
            </div>

          </div>
        </div>

        <Link href="/tools/video" className="nav-link" onClick={handleVideoClick}>
          Erase Video Background {showNewBadge && <span className="badge-new">NEW</span>}
        </Link>
        <Link href="/features" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
        <a href="https://vitenest.com/products" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px', textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
          More Tools
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
