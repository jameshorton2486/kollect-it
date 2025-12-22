import crypto from "crypto";

/**
 * ImageKit Configuration
 * 
 * Required Environment Variables:
 * - NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: Public URL endpoint (client + server)
 * - NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: Public API key (client + server)
 * - IMAGEKIT_PRIVATE_KEY: Private key (server-only, no NEXT_PUBLIC_ prefix)
 */

// Lazy configuration access to avoid crashing dev/build when env is missing
export function getImagekitConfig() {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!urlEndpoint || !publicKey || !privateKey) {
    throw new Error("ImageKit environment variables are not fully configured");
  }
  return { urlEndpoint, publicKey, privateKey };
}

/**
 * Generate authentication parameters for ImageKit uploads
 * Used by the client to authenticate direct uploads
 */
export async function getImageKitAuthParams() {
  const { privateKey } = getImagekitConfig();
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return {
    token,
    expire,
    signature,
  };
}

/**
 * Get ImageKit URL with transformations
 * Example: getImageKitUrl('/products/image.jpg', 'w-400,h-400,fo-auto')
 */
export function getImageKitUrl(path: string, transformation?: string): string {
  try {
    const { urlEndpoint } = getImagekitConfig();
    if (transformation) return `${urlEndpoint}/tr:${transformation}${path}`;
    return `${urlEndpoint}${path}`;
  } catch {
    // If not configured, return the raw path to avoid hard failures in dev
    return path;
  }
}

/**
 * Common transformation presets
 * 
 * Format: w-width,h-height,fo-auto (fit outside auto),q-quality
 * - fo-auto: Maintains aspect ratio, fits within bounds
 * - q: Quality (80-85 recommended for WebP)
 */
export const imageTransformations = {
  /** Admin preview thumbnails - 400px square */
  admin_preview: "w-400,h-400,fo-auto,q-80",
  
  /** Product grid - 600px square crop for consistent grid */
  product_grid: "w-600,h-600,fo-auto,c-at_max,q-85",
  
  /** Product detail page - 2000px max width */
  product_detail: "w-2000,fo-auto,q-85",
  
  /** Legacy presets (for backward compatibility) */
  thumbnail: "w-400,h-400,fo-auto,q-80",
  productCard: "w-600,h-600,fo-auto,q-85",
  gallery: "w-1600,h-1600,fo-auto,q-95",
};

