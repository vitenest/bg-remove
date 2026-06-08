"use client";

import { useState, useRef, useEffect } from 'react';
import { removeBackground, preload } from '@imgly/background-removal';
import { Download, RefreshCcw, AlertCircle, Plus, Film, Image as ImageIcon } from 'lucide-react';
import { processVideo } from '../utils/videoProcessor';
import { canProcess, getWaitTimeMs, recordUsage, formatWaitTime } from '../utils/usageTracker';
import { useParams } from 'next/navigation';
import { seoContent } from '../utils/seoContent';

function HomeClient() {
  const params = useParams();
  const toolName = params?.toolName;
  const currentContent = seoContent[toolName] || seoContent.default;

  useEffect(() => {
    // Preload the AI models in the background so they are ready instantly when the user drops a file
    const preloadModels = async () => {
      try {
        const config = {
          publicPath: typeof window !== 'undefined' ? window.location.origin + '/models/' : '/models/',
          model: 'medium',
          debug: false
        };
        await preload(config);
        console.log("AI models preloaded successfully in the background.");
      } catch (err) {
        console.error("Failed to preload AI models:", err);
      }
    };
    preloadModels();
  }, []);

  useEffect(() => {
    document.title = currentContent.metaTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = currentContent.metaDescription;
  }, [currentContent]);
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error, limit_reached
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [originalMedia, setOriginalMedia] = useState(null);
  const [processedMedia, setProcessedMedia] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [limitMessage, setLimitMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [activeTab, setActiveTab] = useState(currentContent.tabs[0].name);

  useEffect(() => {
    if (currentContent.tabs && currentContent.tabs.length > 0) {
      setActiveTab(currentContent.tabs[0].name);
    }
  }, [toolName, currentContent]);
  
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setErrorMessage('Please upload a valid image or video file.');
      setStatus('error');
      return;
    }

    const type = isVideo ? 'video' : 'image';
    if (!canProcess(type)) {
      const waitMs = getWaitTimeMs(type);
      setLimitMessage(`You have reached the limit for ${type}s. Please come back after ${formatWaitTime(waitMs)}.`);
      setStatus('limit_reached');
      return;
    }

    setMediaType(type);
    const objectUrl = URL.createObjectURL(file);
    setOriginalMedia(objectUrl);
    setProcessedMedia(null);
    setStatus('processing');
    setErrorMessage('');
    setLimitMessage('');
    setProgress(0);

    try {
      if (isImage) {
        const config = {
          publicPath: typeof window !== 'undefined' ? window.location.origin + '/models/' : '/models/',
          model: 'medium',
          debug: false,
          output: { format: 'image/png', quality: 1.0 }
        };
        const blob = await removeBackground(file, config);
        const processedUrl = URL.createObjectURL(blob);
        setProcessedMedia(processedUrl);
        recordUsage('image');
        setStatus('success');
      } else if (isVideo) {
        const processedUrl = await processVideo(file, (p) => setProgress(p));
        setProcessedMedia(processedUrl);
        recordUsage('video');
        setStatus('success');
      }
    } catch (error) {
      console.error("Background removal failed:", error);
      setErrorMessage(error.message || 'Failed to remove background. Please try again.');
      setStatus('error');
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const reset = () => {
    setStatus('idle');
    setOriginalMedia(null);
    setProcessedMedia(null);
    setErrorMessage('');
    setLimitMessage('');
    setProgress(0);
    setMediaType(null);
  };

  const handleDownload = () => {
    if (!processedMedia) return;
    const a = document.createElement('a');
    a.href = processedMedia;
    a.download = mediaType === 'video' ? 'magic_remove_result.mp4' : 'magic_remove_result.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="main-content">
        <section className="hero">
          <div className="badge-container">
            <span className="badge glow-border">
               ✨ Now supports Video Background Removal!
            </span>
          </div>

          <h1 className="hero-title">
            {currentContent.heroTitle.includes('for free') ? (
              <>
                {currentContent.heroTitle.split('for free')[0]}
                <span className="gradient-text">for free</span>
                {currentContent.heroTitle.split('for free')[1]}
              </>
            ) : currentContent.heroTitle}
          </h1>
          <p className="hero-subtitle">{currentContent.heroSubtitle}</p>
          
          {status === 'idle' || status === 'error' ? (
            <div 
              className={`dropzone-container glass-panel ${isDragging ? 'drag-active' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="file-input-hidden" 
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="dropzone-content">
                {status === 'error' ? (
                  <>
                    <AlertCircle size={56} color="#ef4444" className="error-icon" />
                    <div className="dropzone-text error-text">Error: {errorMessage}</div>
                    <div className="dropzone-subtext">Click or drag another file to try again</div>
                  </>
                ) : (
                  <>
                    <div className="icons-row">
                      <ImageIcon size={40} className="dropzone-icon" />
                      <Film size={40} className="dropzone-icon" />
                    </div>
                    <button className="upload-btn" onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}>
                      <div className="btn-icon-wrapper">
                        <Plus size={16} />
                      </div>
                      Upload File
                    </button>
                    <div className="dropzone-text font-bold">Drop an image or video to magically remove the background.</div>
                    <div className="dropzone-subtext mt-2">Max Video Duration: 10s. Limits: 25 imgs / 15 mins, 3 vids / 1 hr.</div>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {status === 'limit_reached' && (
            <div className="processing-container glass-panel">
              <AlertCircle size={56} color="#f59e0b" className="mb-4" />
              <div className="dropzone-text processing-title" style={{ color: '#f59e0b' }}>Limit Reached</div>
              <p className="text-gray text-center processing-subtitle mt-2">{limitMessage}</p>
              <button className="btn-secondary mt-4" onClick={reset}>
                <RefreshCcw size={18} />
                Try Another File
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="processing-container glass-panel">
              <div className="spinner"></div>
              <div className="dropzone-text processing-title">
                {mediaType === 'video' ? `Processing Video... ${progress}%` : 'Removing Background...'}
              </div>
              {mediaType === 'video' && (
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
              )}
              <p className="text-gray text-center processing-subtitle">Everything processes completely on your device.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="result-container glass-panel">
              <div className="image-comparison">
                <div className="image-card">
                  <div className="image-card-title text-gray mb-2">Original</div>
                  <div className="image-wrapper">
                    {mediaType === 'video' ? (
                      <video src={originalMedia} autoPlay loop muted playsInline />
                    ) : (
                      <img src={originalMedia} alt="Original" />
                    )}
                  </div>
                </div>
                <div className="image-card">
                  <div className="image-card-title gradient-text mb-2">Background Removed</div>
                  <div className="image-wrapper checkerboard">
                    {mediaType === 'video' ? (
                      <video src={processedMedia} autoPlay loop muted playsInline />
                    ) : (
                      <img src={processedMedia} alt="Processed" />
                    )}
                  </div>
                </div>
              </div>

              <div className="actions">
                <button className="btn-secondary" onClick={reset}>
                  <RefreshCcw size={18} />
                  Try Another
                </button>
                <button className="btn-primary glow-effect" onClick={handleDownload}>
                  <Download size={18} />
                  Download Result
                </button>
              </div>
            </div>
          )}
        </section>
        
        {/* Section 1: Dynamic Features */}
        <section className="feature-section text-center">
          <h2>{currentContent.section1Title}</h2>
          <p className="subtitle">{currentContent.section1Text}</p>
          
          <div className="tabs-container">
            {currentContent.tabs.map(tab => (
              <button 
                key={tab.name} 
                className={`tab-btn ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
              </button>
            ))}
          </div>
          
          <div className="tab-content">
            <div className="placeholder-image-container glass-panel p-4">
              <img 
                src={currentContent.tabs.find(t => t.name === activeTab)?.image || currentContent.tabs[0].image} 
                alt={activeTab} 
                className="tab-image rounded-lg" 
              />
            </div>
          </div>
        </section>

        {/* Section 2: Dynamic Privacy/Features */}
        <section className="feature-section split-section">
          <div className="split-image-container">
             <div className="mock-stacked-images">
                <img src={currentContent.splitImage} alt="Privacy Shield" className="mock-img-front" />
                <div className="mock-shape-circle"></div>
             </div>
          </div>
          <div className="split-text-container">
            <h2>{currentContent.section2Title}</h2>
            <p className="subtitle" style={{textAlign: 'left'}}>{currentContent.section2Subtitle}</p>
            
            <div className="feature-box">
              <h3>{currentContent.section2FeatureTitle}</h3>
              <p>{currentContent.section2FeatureText}</p>
            </div>
          </div>
        </section>

        {/* Section 3: How it Works */}
        <section className="feature-section text-center how-it-works-section">
          <h2>How It Works</h2>
          <p className="subtitle">Three simple steps to perfect transparent backgrounds.</p>
          <div className="steps-grid">
             <div className="step-card glass-panel">
               <div className="step-number">1</div>
               <h3>Upload</h3>
               <p>Drag & drop your image or video directly into your browser.</p>
             </div>
             <div className="step-card glass-panel">
               <div className="step-number">2</div>
               <h3>AI Magic</h3>
               <p>Our completely local AI isolates your subject instantly with zero server uploads.</p>
             </div>
             <div className="step-card glass-panel">
               <div className="step-number">3</div>
               <h3>Download</h3>
               <p>Save your high-resolution, pixel-perfect cutout for free.</p>
             </div>
          </div>
        </section>

        {/* Section 4: FAQ */}
        <section className="feature-section faq-section">
          <h2 className="text-center">Frequently Asked Questions</h2>
          <div className="faq-container">
            <div className="faq-item glass-panel">
              <h4>Is it really 100% free?</h4>
              <p>Yes! Because our advanced AI runs entirely in your browser, we bypass expensive cloud compute costs. This allows us to offer professional background removal completely free of charge.</p>
            </div>
            <div className="faq-item glass-panel">
              <h4>Are my photos kept private?</h4>
              <p>Absolutely. Your files never leave your device. All image and video processing happens locally within your web browser, ensuring maximum privacy and security for your sensitive assets.</p>
            </div>
            <div className="faq-item glass-panel">
              <h4>Is there a file size limit?</h4>
              <p>Since processing happens locally, the only limit is your device's memory. Most modern laptops and phones can handle high-resolution photos and short 10-second videos with ease.</p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default HomeClient;
