import React from 'react';

// This is a reusable placeholder component for advertisement placements.
// Once you have a publisher ID (like Google AdSense), you can replace the placeholder
// div with your actual <ins class="adsbygoogle" ... /> tag.

export default function AdPlacement({ type = 'horizontal', style = {} }) {
  const isHorizontal = type === 'horizontal';

  return (
    <div 
      className={`ad-placement-container ${isHorizontal ? 'ad-responsive-banner' : 'ad-box-banner'}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1.5rem auto',
        backgroundColor: '#f4f4f5',
        border: '1px dashed #d4d4d8',
        borderRadius: '8px',
        color: '#a1a1aa',
        fontSize: '0.85rem',
        fontWeight: '600',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        width: '100%',
        maxWidth: isHorizontal ? '970px' : '300px',
        overflow: 'hidden',
        ...style
      }}
    >
      <span>Advertisement</span>
    </div>
  );
}
