import { parseGIF, decompressFrames } from 'gifuct-js';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { processImageRMBG } from './rmbg';

export async function processGif(file, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await file.arrayBuffer();
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);
      
      if (!frames || frames.length === 0) {
        throw new Error("No frames found in GIF");
      }
      
      const origWidth = frames[0].dims.width;
      const origHeight = frames[0].dims.height;
      
      // Superfast: limit resolution to 360px max
      const MAX_DIM = 360;
      let scale = 1;
      if (origWidth > MAX_DIM || origHeight > MAX_DIM) {
        scale = Math.min(MAX_DIM / origWidth, MAX_DIM / origHeight);
      }
      const outWidth = Math.round(origWidth * scale);
      const outHeight = Math.round(origHeight * scale);
      
      const gifEncoder = GIFEncoder(); // gifenc factory function
      
      const composeCanvas = document.createElement('canvas');
      composeCanvas.width = origWidth;
      composeCanvas.height = origHeight;
      const composeCtx = composeCanvas.getContext('2d', { willReadFrequently: true });
      
      // Sub-sample frames to max 15 frames for superfast AI processing
      const skip = Math.max(1, Math.floor(frames.length / 15));
      const extractedFrames = [];
      let prevFrameData = null;

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        
        // Handle disposal
        if (i > 0 && frames[i-1].disposalType === 2) {
           composeCtx.clearRect(frames[i-1].dims.left, frames[i-1].dims.top, frames[i-1].dims.width, frames[i-1].dims.height);
        } else if (i > 0 && frames[i-1].disposalType === 3 && prevFrameData) {
           composeCtx.putImageData(prevFrameData, 0, 0);
        }
        
        if (frame.disposalType === 3) {
           prevFrameData = composeCtx.getImageData(0, 0, origWidth, origHeight);
        }
        
        // Draw patch
        if (frame.dims.width > 0 && frame.dims.height > 0) {
          const patchCanvas = document.createElement('canvas');
          patchCanvas.width = frame.dims.width;
          patchCanvas.height = frame.dims.height;
          const patchCtx = patchCanvas.getContext('2d');
          const patchData = patchCtx.createImageData(frame.dims.width, frame.dims.height);
          patchData.data.set(frame.patch);
          patchCtx.putImageData(patchData, 0, 0);
          composeCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
        }
        
        // Sub-sample logic
        if (i % skip === 0) {
          const c = document.createElement('canvas');
          c.width = origWidth;
          c.height = origHeight;
          c.getContext('2d').drawImage(composeCanvas, 0, 0);
          
          extractedFrames.push({
            canvas: c,
            delay: (frame.delay || 100) * skip
          });
        }
      }
      
      // Process extracted frames with AI
      for (let i = 0; i < extractedFrames.length; i++) {
        const extFrame = extractedFrames[i];
        
        const blob = await new Promise(res => extFrame.canvas.toBlob(res, 'image/png'));
        const blobUrl = URL.createObjectURL(blob);
        const processedBlob = await processImageRMBG(blobUrl);
        URL.revokeObjectURL(blobUrl);
        
        const img = new Image();
        img.src = URL.createObjectURL(processedBlob);
        await new Promise(res => img.onload = res);
        
        // Draw to output scaled canvas
        const procCanvas = document.createElement('canvas');
        procCanvas.width = outWidth;
        procCanvas.height = outHeight;
        const procCtx = procCanvas.getContext('2d', { willReadFrequently: true });
        procCtx.drawImage(img, 0, 0, outWidth, outHeight);
        URL.revokeObjectURL(img.src);
        
        const procData = procCtx.getImageData(0, 0, outWidth, outHeight).data;
        
        // gifenc requires format rgba4444 for transparency support natively
        const palette = quantize(procData, 256, { format: 'rgba4444' });
        const index = applyPalette(procData, palette, 'rgba4444');
        
        gifEncoder.writeFrame(index, outWidth, outHeight, {
          palette,
          delay: extFrame.delay,
          transparent: true,
          dispose: 2 // Clear frame to background color for transparent gifs
        });
        
        if (onProgress) {
          onProgress(Math.round(((i + 1) / extractedFrames.length) * 100));
        }
        
        // Yield to the event loop to prevent the browser from hanging/crashing
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      gifEncoder.finish();
      const finalBlob = new Blob([gifEncoder.bytesView()], { type: 'image/gif' });
      resolve(URL.createObjectURL(finalBlob));
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
