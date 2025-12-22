/**
 * Image Validation and Optimization Utilities
 * 
 * Enforces:
 * - WebP format preference (converts if needed)
 * - Max dimensions (2000px width)
 * - Image type validation
 * - File size limits
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  needsConversion?: boolean;
  originalFile?: File;
  convertedFile?: File;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 2000; // pixels
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const PREFERRED_TYPE = 'image/webp';
const WEBP_QUALITY = 0.85; // 85% quality

/**
 * Validate image file
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: JPEG, PNG, WebP, AVIF. Got: ${file.type || 'unknown'}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
    };
  }

  return { valid: true, needsConversion: file.type !== PREFERRED_TYPE };
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Resize image to max dimensions while maintaining aspect ratio
 */
export function resizeImage(
  file: File,
  maxWidth: number = MAX_DIMENSION,
  maxHeight: number = MAX_DIMENSION,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // If no resize needed and already WebP, return original
      if (width === img.width && height === img.height && file.type === PREFERRED_TYPE) {
        resolve(file);
        return;
      }

      // Create canvas and resize
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to Blob (WebP format)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image'));
            return;
          }

          // Create new File object with WebP extension
          const fileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
          const newFile = new File([blob], fileName, {
            type: PREFERRED_TYPE,
            lastModified: Date.now(),
          });

          resolve(newFile);
        },
        PREFERRED_TYPE,
        WEBP_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Validate and optimize image (resize + convert to WebP)
 */
export async function validateAndOptimizeImage(
  file: File,
  sku?: string,
): Promise<File> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file');
  }

  // Get dimensions and resize if needed
  let optimizedFile: File;
  
  try {
    const dimensions = await getImageDimensions(file);
    
    if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
      // Resize and convert to WebP
      optimizedFile = await resizeImage(file, MAX_DIMENSION, MAX_DIMENSION);
    } else if (file.type !== PREFERRED_TYPE) {
      // Convert to WebP without resizing
      optimizedFile = await resizeImage(file, dimensions.width, dimensions.height);
    } else {
      // Already optimal, return as-is
      optimizedFile = file;
    }
  } catch (error) {
    // If dimension check fails, try resize anyway (might be corrupted metadata)
    optimizedFile = await resizeImage(file);
  }

  // Rename with SKU if provided
  if (sku) {
    const extension = optimizedFile.name.split('.').pop() || 'webp';
    const newName = `${sku}-${Date.now()}.${extension}`;
    optimizedFile = new File([optimizedFile], newName, {
      type: optimizedFile.type,
      lastModified: optimizedFile.lastModified,
    });
  }

  return optimizedFile;
}

/**
 * Generate alt text from product title
 */
export function generateAltText(productTitle: string, index: number, isMain: boolean): string {
  const base = productTitle.trim();
  if (isMain) {
    return base;
  }
  return `${base} - Image ${index + 1}`;
}
