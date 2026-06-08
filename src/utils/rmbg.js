import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage
} from "@huggingface/transformers";

// Configure Transformers.js
env.allowLocalModels = false;
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.proxy = true; // Run WebAssembly in a Web Worker
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
      model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
        revision: "main",
        progress_callback: (progress) => {
          if (onProgress && progress.status === 'progress') {
            onProgress(progress.progress || 0);
          }
        }
      });

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
    throw new Error("Model not initialized. Call initRMBGModel first.");
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
