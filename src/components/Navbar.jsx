import { Link } from 'react-router-dom';
import { Layers, ChevronDown, File, FileText, FileImage, Diamond, PenTool, Image as ImageIcon, Camera, Code, Cpu } from 'lucide-react';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Layers size={28} color="#d946ef" />
        <span>bg-remove.com</span>
      </Link>
      
      <div className="nav-links">
        <div className="nav-item-dropdown">
          <Link to="/" className="nav-link">Erase Background <ChevronDown size={14} /></Link>
          
          <div className="mega-menu">
            <div className="mega-menu-col">
              <h4>File Type</h4>
              <ul className="mega-menu-list">
                <li><Link to="/" className="mega-menu-item"><File className="mega-menu-icon" /> PNG</Link></li>
                <li><Link to="/" className="mega-menu-item"><FileImage className="mega-menu-icon" /> JPG</Link></li>
                <li><Link to="/" className="mega-menu-item"><FileImage className="mega-menu-icon" /> JPEG</Link></li>
                <li><Link to="/" className="mega-menu-item"><FileText className="mega-menu-icon" /> PDF</Link></li>
                <li><Link to="/" className="mega-menu-item"><FileImage className="mega-menu-icon" /> GIF</Link></li>
                <li><Link to="/" className="mega-menu-item"><Code className="mega-menu-icon" /> HTML</Link></li>
              </ul>
            </div>
            <div className="mega-menu-col">
              <h4>Remove Background</h4>
              <ul className="mega-menu-list">
                <li><Link to="/" className="mega-menu-item"><Diamond className="mega-menu-icon" /> Logo</Link></li>
                <li><Link to="/" className="mega-menu-item"><PenTool className="mega-menu-icon" /> Signature</Link></li>
              </ul>
            </div>
            <div className="mega-menu-col">
              <h4>Solution</h4>
              <ul className="mega-menu-list">
                <li><Link to="/" className="mega-menu-item"><ImageIcon className="mega-menu-icon" /> Change Background</Link></li>
                <li><Link to="/" className="mega-menu-item"><Camera className="mega-menu-icon" /> Passport Photo Maker</Link></li>
                <li><Link to="/" className="mega-menu-item"><Code className="mega-menu-icon" /> Remove Background API</Link></li>
                <li><Link to="/" className="mega-menu-item"><Cpu className="mega-menu-icon" /> AI Background Generator</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <Link to="/" className="nav-link">Erase Video Background <span className="badge-new">NEW</span></Link>
        <Link to="/" className="nav-link">Pricing</Link>
        <Link to="/features" className="nav-link">Features</Link>
      </div>
    </nav>
  );
}

export default Navbar;
