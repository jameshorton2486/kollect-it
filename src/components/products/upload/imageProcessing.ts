import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;

export async function processImage(file: File): Promise<File> {
  try {
    // Create an image element from the file
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));

    // Create a canvas for resizing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Set fixed dimensions
    const targetSize = 500;
    canvas.width = targetSize;
    canvas.height = targetSize;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetSize, targetSize);

    // Calculate dimensions maintaining aspect ratio
    let drawWidth = targetSize;
    let drawHeight = targetSize;
    const aspectRatio = img.width / img.height;

    if (aspectRatio > 1) {
      drawHeight = targetSize / aspectRatio;
    } else {
      drawWidth = targetSize * aspectRatio;
    }

    // Center the image
    const x = (targetSize - drawWidth) / 2;
    const y = (targetSize - drawHeight) / 2;

    // Draw the image
    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    // Remove background if possible
    try {
      const processedBlob = await removeBackground(img);
      return new File([processedBlob], file.name, { type: 'image/png' });
    } catch (error) {
      console.error('Background removal failed, using original image:', error);
      // If background removal fails, continue with the resized image
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/png' }));
          }
        }, 'image/png');
      });
    }
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
}

export async function removeBackground(imageElement: HTMLImageElement): Promise<Blob> {
  const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
    device: 'webgpu',
  });
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);
  
  const imageData = canvas.toDataURL('image/jpeg', 0.8);
  const result = await segmenter(imageData);
  
  if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
    throw new Error('Invalid segmentation result');
  }
  
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  const outputCtx = outputCanvas.getContext('2d');
  
  if (!outputCtx) throw new Error('Could not get output canvas context');
  
  outputCtx.drawImage(canvas, 0, 0);
  
  const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const data = outputImageData.data;
  
  for (let i = 0; i < result[0].mask.data.length; i++) {
    const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
    data[i * 4 + 3] = alpha;
  }
  
  outputCtx.putImageData(outputImageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}