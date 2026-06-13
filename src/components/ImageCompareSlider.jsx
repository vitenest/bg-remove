import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';

const ImageCompareSlider = ({ original, processed }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleDrag = (e) => {
    if (!containerRef.current) return;
    
    // Support both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate percentage, clamped between 0 and 100
    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(position, 100));
    
    setSliderPosition(position);
  };

  return (
    <div 
      className="image-compare-container"
      ref={containerRef}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleDrag(e);
      }}
      onTouchMove={handleDrag}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        aspectRatio: '16/9',
        maxHeight: '70vh',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        userSelect: 'none'
      }}
    >
      {/* Base layer: Processed Image (Transparent with Checkerboard) */}
      <div 
        className="checkerboard"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%',
          backgroundColor: '#f3f4f6'
        }}
      >
        <Image 
          src={processed} 
          alt="Background Removed" 
          fill
          unoptimized={typeof processed === 'string' && processed.startsWith('blob:')}
          style={{ objectFit: 'contain', pointerEvents: 'none' }}
        />
      </div>

      {/* Top layer: Original Image (Clipped) */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%',
          backgroundColor: '#ffffff',
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      >
        <Image 
          src={original} 
          alt="Original" 
          fill
          unoptimized={typeof original === 'string' && original.startsWith('blob:')}
          style={{ objectFit: 'contain', pointerEvents: 'none' }}
        />
      </div>

      {/* Slider Line & Handle */}
      <div 
        style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: `${sliderPosition}%`,
          transform: 'translateX(-50%)',
          width: '4px',
          backgroundColor: '#ffffff',
          cursor: 'ew-resize',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e5e7eb'
        }}>
          <ChevronsLeftRight size={20} color="#4b5563" />
        </div>
      </div>
      
      {/* Range Input (Invisible, for accessibility and native dragging) */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%',
          opacity: 0,
          cursor: 'ew-resize',
          zIndex: 20
        }}
      />
      
      {/* Labels */}
      <div style={{
        position: 'absolute',
        top: '16px', left: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: sliderPosition < 15 ? 0 : 1,
        transition: 'opacity 0.2s'
      }}>
        Original
      </div>
      <div style={{
        position: 'absolute',
        top: '16px', right: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: sliderPosition > 85 ? 0 : 1,
        transition: 'opacity 0.2s'
      }}>
        Result
      </div>
    </div>
  );
};

export default ImageCompareSlider;
