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
          let width = video.videoWidth;
          let height = video.videoHeight;
          
          // Cap resolution to 360px to massively speed up AI processing
          const MAX_DIM = 360;
          if (width > MAX_DIM || height > MAX_DIM) {
            const ratio = width / height;
            if (ratio > 1) {
              width = MAX_DIM;
              height = Math.round(MAX_DIM / ratio);
            } else {
              height = MAX_DIM;
              width = Math.round(MAX_DIM * ratio);
            }
          }
          // Ensure even dimensions for mp4 encoder
          width = width - (width % 2);
          height = height - (height % 2);

          // Limit to 10 seconds to prevent memory issues in browser
          const processDuration = Math.min(duration, 10);
          const fps = 10; // Reduced to 10 fps for superfast processing
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
            codec: 'avc1.4d002a', // Main profile, Level 4.2 (supports 1080p+)
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
            
            await new Promise((res) => {
              const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                res();
              };
              video.addEventListener('seeked', onSeeked);
              video.currentTime = time;
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
            
            // Yield to the event loop to prevent the browser from hanging/crashing
            await new Promise(resolve => setTimeout(resolve, 20));
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
