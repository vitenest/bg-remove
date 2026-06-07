import { ShieldCheck, Zap, Image as ImageIcon } from 'lucide-react';

export const metadata = {
  title: 'Features - bg-remove.com',
  description: 'Learn about the privacy-first, lightning-fast features of bg-remove.com',
};

function Features() {
  return (
    <div className="main-content">
      <div className="text-center" style={{ padding: '2rem 0' }}>
        <h1>Why Use <span className="gradient-text">Magic Remove</span>?</h1>
        <p className="text-gray" style={{ fontSize: '1.25rem', marginTop: '1rem' }}>
          Experience the next generation of background removal tools.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <ShieldCheck size={32} />
          </div>
          <h3>100% Privacy Preserved</h3>
          <p>
            Unlike other services that upload your photos to the cloud, Magic Remove processes everything right inside your browser. Your images never leave your device.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Zap size={32} />
          </div>
          <h3>Lightning Fast</h3>
          <p>
            Powered by modern WebAssembly and ONNX models, the background removal is almost instantaneous once the small AI model is cached on your device.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <ImageIcon size={32} />
          </div>
          <h3>High Quality Results</h3>
          <p>
            Our local AI model handles tricky edges like hair, fur, and complex backgrounds with ease, leaving you with a perfectly clean transparent PNG.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
