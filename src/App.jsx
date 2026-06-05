import { useState, useRef } from 'react';
import removeBackground from '@imgly/background-removal';
import { UploadCloud, Download, Sparkles, RefreshCcw, AlertCircle } from 'lucide-react';
import './index.css';

function App() {
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
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
      // The background removal runs entirely locally
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          // Could implement progress bar here
          console.log(`Progress: ${key} - ${current}/${total}`);
        }
      });
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
    a.download = 'removed_background.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="app-container">
      <header>
        <h1 className="gradient-text">Magic Remove</h1>
        <p>Stunning, instant background removal running entirely in your browser.</p>
      </header>

      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                  <AlertCircle size={64} color="#ef4444" />
                  <div className="dropzone-text" style={{ color: '#ef4444' }}>Error: {errorMessage}</div>
                  <div className="dropzone-subtext">Click or drag another image to try again</div>
                </>
              ) : (
                <>
                  <UploadCloud className="upload-icon" />
                  <div className="dropzone-text">Click or Drag & Drop an Image</div>
                  <div className="dropzone-subtext">Supports JPG, PNG, WEBP (Runs locally, no data sent)</div>
                </>
              )}
            </div>
          </div>
        ) : null}

        {status === 'processing' && (
          <div className="processing-container glass-panel">
            <div className="spinner"></div>
            <div className="processing-text">Applying AI Magic...</div>
            <div className="processing-subtext">Downloading AI model on first run. Please wait.</div>
            <div className="processing-subtext">This process runs entirely on your device.</div>
          </div>
        )}

        {status === 'success' && (
          <div className="result-container">
            <div className="image-comparison">
              <div className="image-card glass-panel" style={{ padding: '1rem' }}>
                <div className="image-card-title">Original</div>
                <div className="image-wrapper">
                  <img src={originalImage} alt="Original" />
                </div>
              </div>
              <div className="image-card glass-panel" style={{ padding: '1rem' }}>
                <div className="image-card-title gradient-text">Background Removed</div>
                <div className="image-wrapper checkerboard">
                  <img src={processedImage} alt="Processed" />
                </div>
              </div>
            </div>

            <div className="actions">
              <button className="btn-secondary" onClick={reset}>
                <RefreshCcw size={18} />
                Try Another
              </button>
              <button className="btn-primary" onClick={handleDownload}>
                <Download size={18} />
                Download Full Image
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="local-badge">
        <div className="pulse-dot"></div>
        100% Local AI
      </div>
    </div>
  );
}

export default App;
