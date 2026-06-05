import { useState, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Download, RefreshCcw, AlertCircle, Plus } from 'lucide-react';

function Home() {
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // New State for tabs
  const [activeTab, setActiveTab] = useState('Individuals');
  
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file.');
      setStatus('error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);
    setProcessedImage(null);
    setStatus('processing');
    setErrorMessage('');

    try {
      const config = {
        publicPath: window.location.origin + '/models/',
        debug: false,
        output: {
          format: 'image/png',
          quality: 1.0
        }
      };
      const blob = await removeBackground(file, config);
      const processedUrl = URL.createObjectURL(blob);
      setProcessedImage(processedUrl);
      setStatus('success');
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
    setOriginalImage(null);
    setProcessedImage(null);
    setErrorMessage('');
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const a = document.createElement('a');
    a.href = processedImage;
    a.download = 'magic_remove_result.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const tabs = ['Individuals', 'E-Commerce', 'Social Media', 'Designers'];

  return (
    <>

      <div className="main-content">
        <section className="hero">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <span style={{ border: '1px solid #3f3f46', borderRadius: '999px', padding: '0.2rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               ✨ Now supports video here
            </span>
          </div>

          <h1>Remove Background From Images For <span className="gradient-text">Free</span></h1>
          <p className="mb-8">Experience accurate background removal, running entirely in your browser!</p>
          
          {status === 'idle' || status === 'error' ? (
            <div 
              className={`dropzone-container ${isDragging ? 'drag-active' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="file-input-hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="dropzone-content">
                {status === 'error' ? (
                  <>
                    <AlertCircle size={48} color="#ef4444" />
                    <div className="dropzone-text" style={{ color: '#ef4444' }}>Error: {errorMessage}</div>
                    <div className="dropzone-subtext">Click or drag another image to try again</div>
                  </>
                ) : (
                  <>
                    <button className="upload-btn" onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}>
                      <div style={{ background: 'white', color: '#8a2387', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                        <Plus size={16} style={{ margin: 'auto' }} />
                      </div>
                      Upload Image
                    </button>
                    <div className="dropzone-text">Drop an image or paste <span className="dropzone-link">URL</span> (Image or Video)</div>
                    <div style={{ fontSize: '0.8rem', color: '#71717a', textDecoration: 'underline', marginTop: '0.5rem' }}>View Limits and Supported Formats</div>
                    <div className="dropzone-subtext">By uploading a file or URL you agree to our <strong>Terms of Use</strong> and <strong>Privacy Policy</strong>.</div>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {status === 'processing' && (
            <div className="processing-container">
              <div className="spinner"></div>
              <div className="dropzone-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Removing Background...</div>
              <p className="text-gray text-center" style={{ fontSize: '0.9rem' }}>Everything processes completely on your device.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="result-container">
              <div className="image-comparison">
                <div className="image-card">
                  <div className="image-card-title text-gray mb-2">Original</div>
                  <div className="image-wrapper">
                    <img src={originalImage} alt="Original" />
                  </div>
                </div>
                <div className="image-card">
                  <div className="image-card-title gradient-text mb-2">Background Removed</div>
                  <div className="image-wrapper checkerboard">
                    <img src={processedImage} alt="Processed" />
                  </div>
                </div>
              </div>

              <div className="actions" style={{ justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={reset}>
                  <RefreshCcw size={16} />
                  Upload Another Image
                </button>
                <button className="btn-primary" onClick={handleDownload} style={{ padding: '0.75rem 2rem' }}>
                  <Download size={16} />
                  Download Image
                </button>
              </div>
            </div>
          )}
        </section>
        
        {/* Section 1: Professional Results for Everyone */}
        <section className="feature-section text-center">
          <h2>Professional Results for Everyone</h2>
          <p className="subtitle">Get stunning, pixel-perfect image transformations regardless of your use case!</p>
          
          <div className="tabs-container">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="tab-content">
            <div className="placeholder-image-container">
              {/* Using a placeholder image for demonstration */}
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" alt="Person" className="tab-image" />
            </div>
          </div>
        </section>

        {/* Section 2: 100% Private & Secure */}
        <section className="feature-section split-section">
          <div className="split-image-container">
             <div className="mock-stacked-images">
                <img src="https://images.unsplash.com/photo-1614064641913-6b71f301d222?auto=format&fit=crop&w=400&q=80" alt="Privacy Shield" className="mock-img-front" />
                <div className="mock-shape-circle"></div>
             </div>
          </div>
          <div className="split-text-container">
            <h2>100% Private & Secure</h2>
            <p className="subtitle" style={{textAlign: 'left'}}>Your images never leave your device.</p>
            
            <div className="feature-box">
              <h3>Zero Server Uploads</h3>
              <p>Unlike other tools that send your sensitive data to the cloud, our advanced AI runs entirely inside your browser. This guarantees absolute privacy for your personal photos and business assets.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Lightning Fast Performance */}
        <section className="feature-section split-section reverse">
          <div className="split-text-container">
            <h2>Lightning Fast Performance</h2>
            <p>Experience instant background removal powered by on-device hardware acceleration. No waiting in server queues, no internet latency—just immediate results the moment you drop an image.</p>
            <a href="#" className="link-pink">Try it now</a>
          </div>
          <div className="split-image-container flex-end">
            <div className="mock-api-images">
               <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=500&q=80" alt="Fast Performance" className="mock-img-sofa-small" />
               <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80" alt="Fast Processing" className="mock-img-sofa-large" />
               <div className="mock-shape-circle-pink"></div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default Home;
