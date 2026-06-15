"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';

import { AlertCircle, File, Image as ImageIcon, Film, Download, RefreshCcw, Plus, ArrowRight, Brush, Heart, Camera, MessageSquare, Code, Store, Monitor, Car, Building } from 'lucide-react';
import { initRMBGModel, processImageRMBG } from '../utils/rmbg';
import { processVideo } from '../utils/videoProcessor';
import { canProcess, getWaitTimeMs, recordUsage, formatWaitTime } from '../utils/usageTracker';
import { useParams } from 'next/navigation';
import { seoContent } from '../utils/seoContent';
import ImageCompareSlider from './ImageCompareSlider';
import AdPlacement from './AdPlacement';

function HomeClient() {
  const params = useParams();
  const toolName = params?.toolName;
  const currentContent = seoContent[toolName] || seoContent.default;

  useEffect(() => {
    // Preload the AI models in the background so they are ready instantly when the user drops a file
    const preloadModels = async () => {
      try {
        await initRMBGModel();
        console.log("AI models preloaded successfully in the background.");
      } catch (err) {
        console.error("Failed to preload AI models:", err);
      }
    };
    preloadModels();
  }, []);


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
    
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
    const isVideo = file.type.startsWith('video/') || videoExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    // Validate file type based on current tool route
    if (toolName === 'video' && !isVideo) {
      setStatus('error');
      setErrorMessage('Please upload a valid video file on this page.');
      return;
    }
    
    if (toolName !== 'video' && isVideo) {
      setStatus('error');
      setErrorMessage('Please upload an image file on this page. To process videos, please navigate to the Video Background Remover tool.');
      return;
    }
    
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
    
    // Clean up old blob URLs to free memory before creating new ones
    if (originalMedia) URL.revokeObjectURL(originalMedia);
    if (processedMedia) URL.revokeObjectURL(processedMedia);
    
    const objectUrl = URL.createObjectURL(file);
    setOriginalMedia(objectUrl);
    setProcessedMedia(null);
    setStatus('processing');
    setErrorMessage('');
    setLimitMessage('');
    setProgress(0);

    try {
      if (isImage) {
        const blob = await processImageRMBG(objectUrl);
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
    // Clean up blob URLs to free memory
    if (originalMedia) URL.revokeObjectURL(originalMedia);
    if (processedMedia) URL.revokeObjectURL(processedMedia);
    
    setStatus('idle');
    setOriginalMedia(null);
    setProcessedMedia(null);
    setErrorMessage('');
    setLimitMessage('');
    setProgress(0);
    setMediaType(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          
          <div style={{ margin: '2rem 0' }}>
            <AdPlacement type="horizontal" />
          </div>
          
          {status === 'idle' || status === 'error' ? (
            <>
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
                  accept={toolName === 'video' ? "video/*" : "image/*"}
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
                        {toolName === 'video' ? (
                          <Film size={40} className="dropzone-icon" />
                        ) : (
                          <ImageIcon size={40} className="dropzone-icon" />
                        )}
                      </div>
                      <button className="upload-btn" onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}>
                        <div className="btn-icon-wrapper">
                          <Plus size={16} />
                        </div>
                        {toolName === 'video' ? 'Upload Video' : 'Upload Image'}
                      </button>
                      <div className="dropzone-text font-bold">
                        {toolName === 'video' 
                          ? 'Drop a video to magically remove the background.' 
                          : 'Drop an image to magically remove the background.'}
                      </div>
                      <div className="dropzone-subtext mt-2">
                        {toolName === 'video'
                          ? 'Max Video Duration: 10s. Limit: 3 vids / 1 hr.'
                          : 'Limit: 25 imgs / 15 mins.'}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div style={{ margin: '2rem 0' }}>
                <AdPlacement type="horizontal" />
              </div>
            </>
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
              <p className="text-gray text-center processing-subtitle">Applying advanced AI models... Please wait.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="result-container glass-panel">
              <AdPlacement type="horizontal" style={{ margin: '0 0 2rem 0' }} />
              {mediaType === 'video' ? (
                <div className="image-comparison">
                  <div className="image-card">
                    <div className="image-card-title text-gray mb-2">Original</div>
                    <div className="image-wrapper">
                      <video src={originalMedia} autoPlay loop muted playsInline />
                    </div>
                  </div>
                  <div className="image-card">
                    <div className="image-card-title gradient-text mb-2">Background Removed</div>
                    <div className="image-wrapper checkerboard">
                      <video src={processedMedia} autoPlay loop muted playsInline />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <ImageCompareSlider original={originalMedia} processed={processedMedia} />
                </div>
              )}

              <AdPlacement type="horizontal" style={{ margin: '1rem 0 2rem 0' }} />

              <div className="actions mt-6">
                <button className="btn-secondary" onClick={reset}>
                  <RefreshCcw size={18} />
                  Try Another
                </button>
                <button className="btn-primary glow-effect" onClick={handleDownload}>
                  <Download size={18} />
                  Download Result
                </button>
              </div>

              {/* More Free Tools Banner inside Result */}
              <div style={{ marginTop: '3rem', width: '100%', maxWidth: '600px' }}>
                <div style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #e4e4e7', backgroundColor: '#fafafa' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111111' }}>More Free Tools</h3>
                  <p style={{ color: '#52525b', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    bg-remove is part of the ViteNest ecosystem. Discover more premium free tools designed to boost your productivity.
                  </p>
                  <a href="https://vitenest.com/products" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', color: '#111111', textDecoration: 'none', transition: 'background-color 0.2s' }}>
                    ✨ Explore All ViteNest Tools
                  </a>
                </div>
              </div>
              <AdPlacement type="horizontal" style={{ margin: '3rem 0 0 0' }} />
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
              {(() => {
                const activeTabData = currentContent.tabs.find(t => t.name === activeTab) || currentContent.tabs[0];
                if (activeTabData.processedImage) {
                  return <ImageCompareSlider original={activeTabData.image} processed={activeTabData.processedImage} />;
                }
                return (
                  <Image 
                    src={activeTabData.image} 
                    alt={activeTab} 
                    className="tab-image rounded-lg" 
                    width={900}
                    height={500}
                    style={{ width: '100%', height: 'auto' }}
                  />
                );
              })()}
            </div>
          </div>
        </section>

        <div style={{ padding: '0 2rem' }}>
          <AdPlacement type="horizontal" />
        </div>

        {/* Section 2: Dynamic Privacy/Features */}
        <section className="feature-section split-section">
          <div className="split-image-container">
             <div className="mock-stacked-images">
                <Image src={currentContent.splitImage} alt="Privacy Shield" className="mock-img-front" width={250} height={300} />
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

        <div style={{ padding: '0 2rem' }}>
          <AdPlacement type="horizontal" />
        </div>

        {/* Section 3: One tool, endless uses */}
        <section className="feature-section text-center uses-section">
          <h2>One tool, endless uses</h2>
          <p className="subtitle mx-auto" style={{ maxWidth: '800px', lineHeight: '1.6' }}>
            Edit your photos' backgrounds to white for flawless <strong>e-commerce shots, car listings,</strong> or <strong>professional headshots.</strong> Create a transparent background (PNG) to design the perfect <strong>logo</strong> or <strong>graphic</strong> for any project or presentation. Whatever your need, our AI saves you time and helps you deliver professional results in seconds.
          </p>
          
          <div className="uses-grid">
            <div className="use-card group">
              <Brush size={24} className="use-card-icon" />
              <div className="use-card-title">
                Magic Brush
              </div>
            </div>
            <div className="use-card group">
              <Heart size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Individuals
              </div>
            </div>
            <div className="use-card group">
              <Camera size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Photographers
              </div>
            </div>
            <div className="use-card group">
              <MessageSquare size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Marketing
              </div>
            </div>
            <div className="use-card group">
              <Code size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Developers
              </div>
            </div>
            <div className="use-card group">
              <Store size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Ecommerce
              </div>
            </div>
            <div className="use-card group">
              <Monitor size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Media
              </div>
            </div>
            <div className="use-card group">
              <Car size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Car Dealerships
              </div>
            </div>
            <div className="use-card group">
              <Building size={24} className="use-card-icon" />
              <div className="use-card-title">
                for Enterprise
              </div>
            </div>
          </div>
        </section>        
        
        <div style={{ padding: '0 2rem' }}>
          <AdPlacement type="horizontal" />
        </div>
        
        {/* Section 4: Boost Efficiency */}
        <section className="efficiency-section">
          <div className="efficiency-layout">
            
            {/* Left side: 3x3 Grid */}
            <div className="efficiency-image-side">
              <div className="efficiency-grid-container">
                <div className="efficiency-grid">
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80" alt="Shoe" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&q=80" alt="Jacket" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=200&q=80" alt="Hat" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=200&q=80" alt="Cosmetic" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=200&q=80" alt="Pants" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=200&q=80" alt="Blue Shoe" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=200&q=80" alt="Heels" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=200&q=80" alt="Bag" className="efficiency-grid-img" width={200} height={200} /></div>
                  <div className="efficiency-grid-item"><Image src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80" alt="Serum" className="efficiency-grid-img" width={200} height={200} /></div>
                </div>
              </div>
            </div>
            
            {/* Right side: Text Content */}
            <div className="efficiency-text-side">
              <h2 className="efficiency-title">
                Boost your efficiency with automated background removal
              </h2>
              
              <p className="efficiency-desc">
                With our AI platform, deleting backgrounds and extracting the subject from an image is fast and effortless.
              </p>
              
              <div className="efficiency-list">
                <div className="efficiency-list-item">
                  <div className="efficiency-list-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  Save time and money
                </div>
                <div className="efficiency-list-item">
                  <div className="efficiency-list-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  Process images in bulk
                </div>
                <div className="efficiency-list-item">
                  <div className="efficiency-list-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  Integrate with your workflow
                </div>
              </div>


            </div>
          </div>
        </section>

        <div style={{ padding: '0 2rem' }}>
          <AdPlacement type="horizontal" />
        </div>

        {/* Section 5: How it Works */}
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
               <p>Our advanced AI isolates your subject instantly with pixel-perfect precision.</p>
             </div>
             <div className="step-card glass-panel">
               <div className="step-number">3</div>
               <h3>Download</h3>
               <p>Save your high-resolution, pixel-perfect cutout for free.</p>
             </div>
          </div>
        </section>

        <div style={{ padding: '0 2rem' }}>
          <AdPlacement type="horizontal" />
        </div>

        {/* Section 4: FAQ */}
        <section className="feature-section faq-section">
          <h2 className="text-center">Frequently Asked Questions</h2>
          <div className="faq-container">
            <div className="faq-item glass-panel">
              <h4>Is it really 100% free?</h4>
              <p>Yes! Our highly optimized AI pipeline allows us to offer professional background removal completely free of charge.</p>
            </div>
            <div className="faq-item glass-panel">
              <h4>Are my photos kept private?</h4>
              <p>Absolutely. Our system is designed with privacy in mind, ensuring maximum security for your sensitive assets.</p>
            </div>
            <div className="faq-item glass-panel">
              <h4>Is there a file size limit?</h4>
              <p>Our system can handle high-resolution photos and short 10-second videos with ease.</p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default HomeClient;
