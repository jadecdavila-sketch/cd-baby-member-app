'use client';

import Image from 'next/image';
import { useState } from 'react';

import { getAssetPath } from '@/shared/utils/asset-path';

import type { DSP } from '../mock-data';

interface PlatformIconProps {
  platform: DSP;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PlatformIcon({
  platform,
  size = 'md',
  className = '',
}: PlatformIconProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const sizePixels = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const colors: Record<DSP, string> = {
    spotify: '#1DB954',
    'apple-music': '#FA243C',
    tiktok: '#000000',
    'youtube-music': '#FF0000',
    'youtube-content-id': '#FF0000',
    'youtube-shorts': '#FF0000',
    instagram: '#E4405F',
    facebook: '#1877F2',
    amazon: '#FF9900',
  };

  // Simple icon representation using first letter(s) - fallback
  const iconText: Record<DSP, string> = {
    spotify: 'S',
    'apple-music': 'A',
    tiktok: 'TT',
    'youtube-music': 'YM',
    'youtube-content-id': 'YC',
    'youtube-shorts': 'YS',
    instagram: 'IG',
    facebook: 'FB',
    amazon: 'AM',
  };

  // Logo file paths
  const logoPath = getAssetPath(`/assets/platforms/${platform}.svg`);

  // If logo exists and hasn't errored, show it
  if (!hasError) {
    return (
      <div className={`${sizeClasses[size]} ${className} relative flex-shrink-0`}>
        <Image
          src={logoPath}
          alt={platform}
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="object-contain"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback to colored circle with letters
  return (
    <div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-full font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: colors[platform] }}
      title={platform}
    >
      <span className="text-[0.6em]">{iconText[platform]}</span>
    </div>
  );
}
