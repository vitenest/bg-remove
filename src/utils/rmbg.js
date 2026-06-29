import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage
} from "@huggingface/transformers";

// Configure Transformers.js
env.allowLocalModels = false;
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.proxy = false; // Disable Web Worker proxy
  env.backends.onnx.wasm.numThreads = 1; // Require single thread to avoid SharedArrayBuffer / COOP headers issues
}

let model = null;
let processor = null;
let isInitializing = false;
let initPromise = null;

export async function initRMBGModel(onProgress) {
  if (model && processor) return true;
  if (isInitializing) return initPromise;

  isInitializing = true;
  initPromise = (async () => {
    try {
      let device = 'wasm';
      if (typeof navigator !== 'undefined' && navigator.gpu) {
        device = 'webgpu';
      }
      try {
        model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
          revision: "main",
          device: device,
          progress_callback: (progress) => {
            if (onProgress && progress.status === 'progress') {
              onProgress(progress.progress || 0);
            }
          }
        });
      } catch (e) {
        console.warn("WebGPU initialization failed, falling back to WASM", e);
        model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
          revision: "main",
          device: "wasm",
          progress_callback: (progress) => {
            if (onProgress && progress.status === 'progress') {
              onProgress(progress.progress || 0);
            }
          }
        });
      }

      processor = await AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
        revision: "main",
        config: {
          do_normalize: true,
          do_pad: false,
          do_rescale: true,
          do_resize: true,
          image_mean: [0.5, 0.5, 0.5],
          feature_extractor_type: "ImageFeatureExtractor",
          image_std: [1, 1, 1],
          resample: 2,
          rescale_factor: 0.00392156862745098,
          size: { width: 1024, height: 1024 }
        }
      });
      return true;
    } catch (err) {
      console.error("Failed to initialize RMBG model:", err);
      model = null;
      processor = null;
      throw err;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

export async function processImageRMBG(imageUrl) {
  if (!model || !processor) {
    await initRMBGModel();
  }

  if (!model || !processor) {
    throw new Error("Model failed to initialize.");
  }

  // Load image
  const img = await RawImage.fromURL(imageUrl);

  // Pre-process image
  const { pixel_values } = await processor(img);

  // Predict alpha matte
  const { output } = await model({ input: pixel_values });

  // Resize mask back to original size
  const maskData = (
    await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
      img.width,
      img.height
    )
  ).data;

  // Create new canvas
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  // Draw original image to canvas
  ctx.drawImage(img.toCanvas(), 0, 0);

  // Update alpha channel
  const pixelData = ctx.getImageData(0, 0, img.width, img.height);
  for (let i = 0; i < maskData.length; ++i) {
    pixelData.data[4 * i + 3] = maskData[i];
  }
  ctx.putImageData(pixelData, 0, 0);

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob"));
    }, "image/png");
  });
}
