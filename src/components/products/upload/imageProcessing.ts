
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

    // Convert to file and return
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: 'image/png' }));
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
}
