/**
 * Utility to generate optimized thumbnail URLs from Supabase Storage URLs.
 * Uses Supabase's built-in image transformation API.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

/**
 * Checks if a URL is a Supabase Storage public URL.
 */
function isSupabaseStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/');
}

/**
 * Transforms a Supabase Storage URL to use the render/image endpoint
 * for on-the-fly resizing and format conversion.
 *
 * Falls back to the original URL if it's not a Supabase storage URL.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): string {
  if (!url) return '';

  // Only transform Supabase Storage URLs
  if (!isSupabaseStorageUrl(url)) return url;

  const { width = 400, height, quality = 75 } = options;

  // Convert /storage/v1/object/public/... to /storage/v1/render/image/public/...
  const renderUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );

  const params = new URLSearchParams();
  if (width) params.set('width', String(width));
  if (height) params.set('height', String(height));
  params.set('quality', String(quality));

  return `${renderUrl}?${params.toString()}`;
}

/**
 * Returns a thumbnail URL (small card size) for grid/list views.
 */
export function getThumbnailUrl(url: string | null | undefined): string {
  return getOptimizedImageUrl(url, { width: 480, quality: 70 });
}

/**
 * Returns a medium-sized URL for detail/hero views.
 */
export function getMediumImageUrl(url: string | null | undefined): string {
  return getOptimizedImageUrl(url, { width: 800, quality: 80 });
}
