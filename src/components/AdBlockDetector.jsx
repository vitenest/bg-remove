"use client";
import React, { useState, useEffect } from 'react';

export default function AdBlockDetector() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    const checkAdBlocker = async () => {
      let isBlocked = false;

    // Method 1: DOM Check (AdBlockers usually hide elements with ad-related classes)
      const adTest = document.createElement('div');
      adTest.innerHTML = '&nbsp;';
      adTest.className = 'adsbox ad-placement doubleclick ad-placeholder ad-badge';
      adTest.style.position = 'absolute';
      adTest.style.top = '-1000px';
      adTest.style.left = '-1000px';
      document.body.appendChild(adTest);

      // Wait a moment for ad blocker stylesheets/scripts to kick in
      await new Promise(r => setTimeout(r, 150));

      if (adTest.offsetHeight === 0 || adTest.style.display === 'none') {
        isBlocked = true;
      }
      
      adTest.remove();
      
      if (isBlocked) {
        setAdBlockDetected(true);
      }
    };

    checkAdBlocker();
    
    // Periodically re-check just in case the ad blocker initialized late
    const interval = setInterval(checkAdBlocker, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!adBlockDetected) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '24px',
        maxWidth: '550px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        margin: 'auto'
      }}>
        <div style={{
          width: '70px', height: '70px', 
          background: '#fee2e2', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111', marginBottom: '1rem' }}>
          Ad Blocker Detected
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
          <strong>bg-remove</strong> is a 100% free tool that relies on advertisements to keep the servers running. Please disable your ad blocker for this site to continue using the service.
        </p>

        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
            How to disable your Ad Blocker:
          </h3>
          <ul style={{ paddingLeft: '1.25rem', color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Chrome / Extensions:</strong> Click the AdBlock/uBlock icon in the top right of your browser and select "Pause on this site" or click the large power button.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Brave Browser:</strong> Click the Lion icon next to the URL bar and toggle "Shields DOWN".</li>
            <li style={{ marginBottom: '0' }}><strong>Safari (iOS):</strong> Tap the "aA" icon in the address bar and select "Turn Off Content Blockers".</li>
          </ul>
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(135deg, #ff416c 0%, #8a2387 100%)',
            color: '#fff',
            border: 'none',
            padding: '14px 24px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
            transition: 'transform 0.2s, opacity 0.2s',
            boxShadow: '0 10px 20px -5px rgba(255, 65, 108, 0.4)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          I've disabled it, Reload Page
        </button>
      </div>
    </div>
  );
}
