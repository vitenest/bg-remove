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

      // Method 2: Network Check (AdBlockers usually block requests to known ad networks)
      if (!isBlocked) {
        try {
          await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store'
          });
        } catch (e) {
          isBlocked = true;
        }
      }
      
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
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '24px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '80px', height: '80px', 
          background: '#fee2e2', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111', marginBottom: '1rem' }}>
          Ad Blocker Detected
        </h2>
        <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.05rem' }}>
          <strong>bg-remove</strong> is a 100% free tool that relies on advertisements to keep the servers running. Please disable your ad blocker for this site to continue using the service.
        </p>
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
          I've disabled my ad blocker, Reload
        </button>
      </div>
    </div>
  );
}
