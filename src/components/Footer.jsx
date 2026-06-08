import React from 'react';
import { Zap, Mail, Globe, MessageCircle, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 mt-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Social */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-2 rounded-lg text-white">
                <Zap size={24} />
              </div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                bg-remove
              </span>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed" style={{ textAlign: 'left' }}>
              Advanced AI technology to extract subjects and remove backgrounds with pixel-perfect precision instantly in your browser.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Product Menu */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4" style={{ textAlign: 'left' }}>Product</h3>
            <ul className="space-y-3 text-gray-500" style={{ textAlign: 'left', padding: 0, listStyle: 'none' }}>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Background Removal</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Video Editing</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">API Integration</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Pricing Options</a></li>
            </ul>
          </div>

          {/* Resources Menu */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4" style={{ textAlign: 'left' }}>Resources</h3>
            <ul className="space-y-3 text-gray-500" style={{ textAlign: 'left', padding: 0, listStyle: 'none' }}>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Documentation</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Tutorials & Guides</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Community Forum</a></li>
            </ul>
          </div>

          {/* Company Menu */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4" style={{ textAlign: 'left' }}>Company</h3>
            <ul className="space-y-3 text-gray-500" style={{ textAlign: 'left', padding: 0, listStyle: 'none' }}>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">About ViteNest</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Careers</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors text-decoration-none">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} bg-remove.com - A <strong>ViteNest</strong> Product.</p>
          <p style={{ margin: 0 }}>Developed by <strong className="text-gray-500">ViteRank</strong>.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
