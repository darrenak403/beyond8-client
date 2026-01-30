'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onError?: () => void;
}

function SafeImageInner({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  fallbackSrc = '/bg-web.jpg',
  onError,
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [useRegularImg, setUseRegularImg] = useState(false);

  const handleImageError = () => {
    onError?.();

    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else {
      setUseRegularImg(true);
    }
  };

  const isExternalUrl = (url: string) => {
    if (typeof window === 'undefined') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname !== window.location.hostname;
    } catch {
      return false;
    }
  };

  // For external URLs that might not be in next.config.js, use regular img tag
  if (useRegularImg || isExternalUrl(imageSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(fill ? 'absolute inset-0 w-full h-full object-cover' : '', className)}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  // For internal or configured external URLs, use Next.js Image
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      onError={handleImageError}
    />
  );
}

export default function SafeImage(props: SafeImageProps) {
  // Use key to force remount when src changes, avoiding setState in useEffect
  return <SafeImageInner key={props.src} {...props} />;
}
