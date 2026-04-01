import { useState } from "react";
import { getThumbnailUrl, getMediumImageUrl, getOptimizedImageUrl } from "@/lib/imageUtils";
import { cn } from "@/lib/utils";

type ImageSize = "thumbnail" | "medium" | "full";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  size?: ImageSize;
  width?: number;
  height?: number;
  fallback?: React.ReactNode;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  size = "thumbnail",
  width,
  height,
  fallback,
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return fallback ? <>{fallback}</> : null;
  }

  const optimizedSrc =
    size === "thumbnail"
      ? getThumbnailUrl(src)
      : size === "medium"
        ? getMediumImageUrl(src)
        : width
          ? getOptimizedImageUrl(src, { width, quality: 80 })
          : src;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={cn(className)}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      onError={() => setError(true)}
    />
  );
};

export default OptimizedImage;
