import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { processImageRMBG } from './rmbg';

export async function processVideo(file, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;
      
      video.onloadedmetadata = async () => {
        try {
          const duration = video.duration;
          const width = video.videoWidth;
          const height = video.videoHeight;
          
          // Limit to 10 seconds to prevent memory issues in browser
          const processDuration = Math.min(duration, 10);
          const fps = 30; // standard fps
          const totalFrames = Math.floor(processDuration * fps);
          
          let muxer = new Muxer({
            target: new ArrayBufferTarget(),
            video: {
              codec: 'avc',
              width: width,
              height: height
            },
            fastStart: 'in-memory'
          });

          let videoEncoder = new VideoEncoder({
            output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
            error: e => reject(e)
          });

          videoEncoder.configure({
            codec: 'avc1.42001f', // Baseline profile
            width: width,
            height: height,
            bitrate: 2_000_000,
            framerate: fps,
            hardwareAcceleration: 'prefer-hardware'
          });

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          // Model is already initialized during preload

          for (let i = 0; i < totalFrames; i++) {
            const time = i / fps;
            video.currentTime = time;
            
            await new Promise((res) => {
              const checkReady = () => {
                if (video.readyState >= 2 && Math.abs(video.currentTime - time) < 0.05) {
                  video.removeEventListener('seeked', checkReady);
                  res();
                }
              };
              video.addEventListener('seeked', checkReady);
              checkReady(); // Check immediately in case it's already there
            });

            ctx.drawImage(video, 0, 0, width, height);
            
            const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
            const blobUrl = URL.createObjectURL(blob);
            const processedBlob = await processImageRMBG(blobUrl);
            URL.revokeObjectURL(blobUrl);
            
            const img = new Image();
            img.src = URL.createObjectURL(processedBlob);
            await new Promise(res => img.onload = res);
            
            // Draw a green screen background since MP4 doesn't support alpha channel well
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(img.src);

            const frame = new VideoFrame(canvas, { timestamp: (i * 1000000) / fps });
            videoEncoder.encode(frame, { keyFrame: i % fps === 0 });
            frame.close();

            onProgress(Math.round(((i + 1) / totalFrames) * 100));
          }

          await videoEncoder.flush();
          muxer.finalize();
          const buffer = muxer.target.buffer;
          const finalBlob = new Blob([buffer], { type: 'video/mp4' });
          resolve(URL.createObjectURL(finalBlob));
        } catch (err) {
          reject(err);
        }
      };
      
      video.onerror = reject;
    } catch (e) {
      reject(e);
    }
  });
}
