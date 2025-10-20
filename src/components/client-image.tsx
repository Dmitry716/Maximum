"use client";

import Image from "next/image";
import { useState } from "react";

interface ClientImageProps {
  src: string;
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export function ClientImage({ src, fallbackSrc, ...props }: ClientImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.error('Error loading image:', src);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      } else {
        setHasError(true);
      }
    }
  };

  if (hasError && !fallbackSrc) {
    return null; // Скрываем изображение если произошла ошибка и нет fallback
  }

  return <Image {...props} src={imageSrc} onError={handleError} />;
}