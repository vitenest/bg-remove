"use client";

import React, { useEffect, useRef } from 'react';

export default function AdBanner({ type, className = '' }) {
  const containerRef = useRef(null);

  const getAdId = () => {
    switch (type) {
      case 'native': return '9347a32f7bdbc94f350d019836ebb681';
      case '468x60': return '67286763890a78c12aad668ddaf86b0b';
      case '300x250': return '54db04cd5ab8b113dc390f80d2c552b0';
      case '160x600': return '3c4bbd1b5f95eee467521b864a02bc4b';
      case '160x300': return '3c4bbd1b5f95eee467521b864a02bc4b'; // Fallback to 160x600 key
      case '320x50': return '5b91b208b7c893f71b71c50b71f4980b';
      case '728x90': return '33d55c68b268bf6400af34bca4b7de4c';
      default: return null;
    }
  };

  const adId = getAdId();
  const isDummy = !adId || adId.includes('dummy');

  const getDimensions = () => {
    if (type === 'native') return { width: '100%', height: 'auto', minHeight: '250px' };
    const [w, h] = type.split('x');
    return { width: `${w}px`, height: `${h}px`, minHeight: `${h}px` };
  };

  useEffect(() => {
    if (!isDummy && containerRef.current && !containerRef.current.hasChildNodes()) {
      if (type === 'native') {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = `https://pl30130412.effectivecpmnetwork.com/${adId}/invoke.js`;
        containerRef.current.appendChild(script);
      } else {
        const dimensions = getDimensions();
        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.innerHTML = `atOptions = {
          'key' : '${adId}',
          'format' : 'iframe',
          'height' : ${parseInt(dimensions.height, 10)},
          'width' : ${parseInt(dimensions.width, 10)},
          'params' : {}
        };`;
        
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `https://www.highperformanceformat.com/${adId}/invoke.js`;
        
        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(invokeScript);
      }
    }
  }, [adId, isDummy, type]);

  return (
    <div className={`ad-container ${className}`} style={{
      display: 'flex',
      justifyContent: 'center',
      margin: '1.5rem auto',
      width: '100%',
      maxWidth: type === 'native' ? '1000px' : getDimensions().width,
      overflow: 'hidden'
    }}>
      {isDummy ? (
        <div style={{
          width: getDimensions().width,
          maxWidth: '100%',
          height: getDimensions().height,
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          border: '1px dashed #e5e7eb',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Ad Placeholder: {type}
        </div>
      ) : (
        <div 
          ref={containerRef} 
          id={`container-${adId}`} 
          style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} 
        />
      )}
    </div>
  );
}
