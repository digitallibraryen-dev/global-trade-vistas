/**
 * Fallback images for services and products when no Supabase image is set.
 * These are lightweight WebP images bundled with the app (~20-60KB each).
 */

import sourcingImg from "@/assets/services/sourcing.webp";
import qualityImg from "@/assets/services/quality.webp";
import logisticsImg from "@/assets/services/logistics.webp";
import brandingImg from "@/assets/services/branding.webp";
import supplierImg from "@/assets/services/supplier.webp";

import electronicsImg from "@/assets/products/electronics.webp";
import machineryImg from "@/assets/products/machinery.webp";
import textilesImg from "@/assets/products/textiles.webp";
import solarImg from "@/assets/products/solar.webp";
import constructionImg from "@/assets/products/construction.webp";

export const serviceFallbacks = [sourcingImg, qualityImg, logisticsImg, brandingImg, supplierImg];
export const productFallbacks = [electronicsImg, machineryImg, textilesImg, solarImg, constructionImg];

/** Pick a consistent fallback based on index */
export function getServiceFallback(index: number): string {
  return serviceFallbacks[index % serviceFallbacks.length];
}

export function getProductFallback(index: number): string {
  return productFallbacks[index % productFallbacks.length];
}
