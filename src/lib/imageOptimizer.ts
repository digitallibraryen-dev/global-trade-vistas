/**
 * Client-side image optimization utility.
 * Compresses, resizes, and converts images to WebP before uploading.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB input limit

interface OptimizeResult {
  main: Blob;
  thumbnail: Blob;
  mainName: string;
  thumbName: string;
}

/**
 * Load an image File into an HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Draw image onto canvas at target dimensions, export as WebP blob.
 */
function resizeToWebP(
  img: HTMLImageElement,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const scale = Math.min(1, maxWidth / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas not supported"));

    // Use high-quality resampling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Failed to create WebP blob"));
        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}

/**
 * Progressively reduce quality until blob is under targetSize.
 */
async function compressToTarget(
  img: HTMLImageElement,
  maxWidth: number,
  targetSizeKB: number,
  initialQuality = 0.82
): Promise<Blob> {
  let quality = initialQuality;
  let blob = await resizeToWebP(img, maxWidth, quality);

  // Try reducing quality in steps until we hit the target
  const targetBytes = targetSizeKB * 1024;
  let attempts = 0;
  while (blob.size > targetBytes && quality > 0.3 && attempts < 6) {
    quality -= 0.08;
    blob = await resizeToWebP(img, maxWidth, quality);
    attempts++;
  }

  return blob;
}

/**
 * Optimize an image file for admin upload.
 * Returns main image (≤800px, target ≤100KB) and thumbnail (≤400px, target ≤50KB).
 */
export async function optimizeImageForUpload(file: File): Promise<OptimizeResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image too large. Please upload an image smaller than 5MB.");
  }

  const img = await loadImage(file);

  const [main, thumbnail] = await Promise.all([
    compressToTarget(img, 800, 100, 0.82),
    compressToTarget(img, 400, 50, 0.75),
  ]);

  // Cleanup object URL
  URL.revokeObjectURL(img.src);

  const id = crypto.randomUUID();
  return {
    main,
    thumbnail,
    mainName: `${id}.webp`,
    thumbName: `${id}_thumb.webp`,
  };
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
