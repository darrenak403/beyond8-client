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
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
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

  // Chuẩn hóa src trước khi truyền vào <Image> hoặc <img>
  const normalizeSrc = (url: string): string => {
    if (!url) return fallbackSrc;

    // Data URL hoặc blob URL dùng thẳng (sẽ render bằng <img> phía dưới)
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    // Đã là URL tuyệt đối hoặc path hợp lệ
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url;
    }

    // Trường hợp chuỗi như 'course1.png' → coi là asset local
    return `/${url.replace(/^\/+/, '')}`;
  };

  const normalizedSrc = normalizeSrc(imageSrc);

  // For external URLs that might not be in next.config.js, use regular img tag
  if (
    useRegularImg ||
    normalizedSrc.startsWith('data:') ||
    normalizedSrc.startsWith('blob:') ||
    isExternalUrl(normalizedSrc)
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(fill ? 'absolute inset-0 w-full h-full object-cover' : '', className)}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <Image
      src={normalizedSrc}
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
  return <SafeImageInner key={props.src} {...props} />;
}
