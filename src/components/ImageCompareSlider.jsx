import React, { useState, useRef, useEffect } from 'react';
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
      className="image-compare-container rounded-xl overflow-hidden shadow-lg relative select-none w-full max-w-4xl mx-auto"
      ref={containerRef}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleDrag(e); // Only drag when primary mouse button is pressed
      }}
      onTouchMove={handleDrag}
      style={{ aspectRatio: '16/9', maxHeight: '70vh' }}
    >
      {/* Base layer: Processed Image (Transparent with Checkerboard) */}
      <div className="absolute inset-0 w-full h-full checkerboard bg-gray-100">
        <img 
          src={processed} 
          alt="Background Removed" 
          className="w-full h-full object-contain pointer-events-none" 
        />
      </div>

      {/* Top layer: Original Image (Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full bg-white"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img 
          src={original} 
          alt="Original" 
          className="w-full h-full object-contain pointer-events-none" 
        />
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize hover:bg-purple-100 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200">
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm pointer-events-none z-10 transition-opacity" style={{ opacity: sliderPosition < 15 ? 0 : 1 }}>
        Original
      </div>
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm pointer-events-none z-10 transition-opacity" style={{ opacity: sliderPosition > 85 ? 0 : 1 }}>
        Result
      </div>
    </div>
  );
};

export default ImageCompareSlider;
