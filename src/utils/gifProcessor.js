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
      
      // Limit frames to prevent memory/processing crash
      const processFrames = frames.slice(0, Math.min(frames.length, 50));
      
      const width = processFrames[0].dims.width;
      const height = processFrames[0].dims.height;
      
      const gifEncoder = new GIFEncoder();
      
      const composeCanvas = document.createElement('canvas');
      composeCanvas.width = width;
      composeCanvas.height = height;
      const composeCtx = composeCanvas.getContext('2d', { willReadFrequently: true });
      
      for (let i = 0; i < processFrames.length; i++) {
        const frame = processFrames[i];
        
        // Disposal logic (simplified: if disposalType === 2, clear canvas)
        if (frame.disposalType === 2) {
          composeCtx.clearRect(0, 0, width, height);
        }
        
        // Draw current frame patch onto composeCanvas
        const patchCanvas = document.createElement('canvas');
        patchCanvas.width = frame.dims.width;
        patchCanvas.height = frame.dims.height;
        const patchCtx = patchCanvas.getContext('2d');
        
        const patchData = patchCtx.createImageData(frame.dims.width, frame.dims.height);
        patchData.data.set(frame.patch);
        patchCtx.putImageData(patchData, 0, 0);
        
        composeCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
        
        // Process the composed frame
        const blob = await new Promise(res => composeCanvas.toBlob(res, 'image/png'));
        const blobUrl = URL.createObjectURL(blob);
        const processedBlob = await processImageRMBG(blobUrl);
        URL.revokeObjectURL(blobUrl);
        
        const img = new Image();
        img.src = URL.createObjectURL(processedBlob);
        await new Promise(res => img.onload = res);
        
        // Draw the processed image to a clean canvas to extract pixels
        const procCanvas = document.createElement('canvas');
        procCanvas.width = width;
        procCanvas.height = height;
        const procCtx = procCanvas.getContext('2d', { willReadFrequently: true });
        procCtx.clearRect(0, 0, width, height);
        procCtx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(img.src);
        
        const procData = procCtx.getImageData(0, 0, width, height).data;
        
        // Quantize and apply palette (using rgba4444 for transparency support)
        const palette = quantize(procData, 256, { format: 'rgba4444' });
        const index = applyPalette(procData, palette, 'rgba4444');
        
        // Add frame to gif
        gifEncoder.writeFrame(index, width, height, {
          palette,
          delay: frame.delay,
          transparent: true,
          colorDepth: 8,
          dispose: -1
        });
        
        if (onProgress) {
          onProgress(Math.round(((i + 1) / processFrames.length) * 100));
        }
      }
      
      gifEncoder.finish();
      const finalBlob = new Blob([gifEncoder.bytesView()], { type: 'image/gif' });
      resolve(URL.createObjectURL(finalBlob));
    } catch (err) {
      reject(err);
    }
  });
}
