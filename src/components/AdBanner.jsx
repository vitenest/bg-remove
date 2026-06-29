"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function AdBanner({ type, className = '' }) {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getAdId = () => {
    switch (type) {
      case 'native': return process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID;
      case '468x60': return process.env.NEXT_PUBLIC_ADSTERRA_468X60;
      case '300x250': return process.env.NEXT_PUBLIC_ADSTERRA_300X250;
      case '160x600': return process.env.NEXT_PUBLIC_ADSTERRA_160X600;
      case '160x300': return process.env.NEXT_PUBLIC_ADSTERRA_160X300;
      case '320x50': return process.env.NEXT_PUBLIC_ADSTERRA_320X50;
      case '728x90': return process.env.NEXT_PUBLIC_ADSTERRA_728X90;
      default: return null;
    }
  };

  const adId = getAdId();
  const isDummy = !adId || adId.includes('dummy');

  useEffect(() => {
    if (!isDummy && type === 'native' && containerRef.current && !containerRef.current.hasChildNodes()) {
      // Native Banner Injection
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = `https://pl29637924.effectivecpmnetwork.com/${adId}/invoke.js`;
      containerRef.current.appendChild(script);

      // Observe when adsterra injects the native ad
      const observer = new MutationObserver(() => {
        if (containerRef.current && containerRef.current.innerHTML.length > 50) {
          setIsLoaded(true);
          observer.disconnect();
        }
      });
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }
  }, [adId, isDummy, type]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'ad_loaded' && e.data?.id === adId) {
        setIsLoaded(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [adId]);

  const getDimensions = () => {
    if (type === 'native') return { width: '100%', height: 'auto', minHeight: '250px' };
    const [w, h] = type.split('x');
    return { width: `${w}px`, height: `${h}px`, minHeight: `${h}px` };
  };

  const dimensions = getDimensions();

  const getIframeSrcDoc = (w, h, id) => `<!DOCTYPE html>
<html>
  <head>
    <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${id}',
        'format' : 'iframe',
        'height' : ${parseInt(h, 10)},
        'width' : ${parseInt(w, 10)},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highperformanceformat.com/${id}/invoke.js"></script>
    <script>
      let checkCount = 0;
      const interval = setInterval(() => {
        if (document.body.innerHTML.includes('iframe') || document.body.innerHTML.includes('img') || document.body.innerHTML.includes('href')) {
          window.parent.postMessage({ type: 'ad_loaded', id: '${id}' }, '*');
          clearInterval(interval);
        }
        checkCount++;
        if (checkCount > 20) clearInterval(interval); // Stop checking after 10 seconds
      }, 500);
    </script>
  </body>
</html>`;

  const showAd = isDummy || isLoaded;

  return (
    <div className={`ad-container ${className}`} style={{
      display: 'flex',
      justifyContent: 'center',
      margin: showAd ? '1.5rem auto' : '0 auto',
      width: '100%',
      maxWidth: type === 'native' ? '1000px' : dimensions.width,
      height: showAd ? (type === 'native' ? 'auto' : dimensions.height) : '0px',
      minHeight: showAd ? dimensions.minHeight : '0px',
      overflow: 'hidden',
      transition: 'height 0.4s ease, min-height 0.4s ease, margin 0.4s ease',
      opacity: showAd ? 1 : 0
    }}>
      {isDummy ? (
        <div style={{
          width: dimensions.width,
          maxWidth: '100%',
          height: dimensions.height,
          minHeight: dimensions.minHeight,
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
      ) : type === 'native' ? (
        <div 
          ref={containerRef} 
          id={`container-${adId}`} 
          style={{ 
            minWidth: '100%', 
            display: 'flex',
            justifyContent: 'center'
          }} 
        />
      ) : (
        <iframe
          srcDoc={getIframeSrcDoc(dimensions.width, dimensions.height, adId)}
          width={parseInt(dimensions.width, 10)}
          height={parseInt(dimensions.height, 10)}
          frameBorder="0"
          scrolling="no"
          style={{ 
            display: 'block', 
            margin: '0 auto', 
            minWidth: dimensions.width, 
            minHeight: dimensions.height 
          }} 
        />
      )}
    </div>
  );
}
