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
    '7digital': '#2D2D2D',
    amazon: '#FF9900',
    ami: '#6366F1',
    anghami: '#8B5CF6',
    'apple-music': '#FA243C',
    'audible-magic': '#4F46E5',
    awa: '#FC6838',
    bmat: '#00B4D8',
    boomplay: '#E21B22',
    deezer: '#A238FF',
    facebook: '#1877F2',
    fuga: '#FF4081',
    hungama: '#00C853',
    iheartradio: '#C6002B',
    imusica: '#1E88E5',
    inprodicon: '#6B7280',
    instagram: '#E4405F',
    jaxsta: '#FFD700',
    kdigital: '#3B82F6',
    kkbox: '#09ABEA',
    kuack: '#10B981',
    lissen: '#8B5CF6',
    netease: '#C20C0C',
    nuuday: '#0EA5E9',
    pandora: '#224099',
    peloton: '#DF2020',
    qobuz: '#0170EB',
    saavn: '#2BC5B4',
    'slacker-radio': '#00BCD4',
    soundexchange: '#1A1A1A',
    spotify: '#1DB954',
    synchtank: '#6366F1',
    tencent: '#1FC87E',
    'the-mlc': '#374151',
    tidal: '#000000',
    tiktok: '#000000',
    trebel: '#FF6B35',
    'tuned-global': '#14B8A6',
    'youtube-content-id': '#FF0000',
    'youtube-music': '#FF0000',
    'youtube-shorts': '#FF0000',
  };

  // Simple icon representation using first letter(s) - fallback
  const iconText: Record<DSP, string> = {
    '7digital': '7D',
    amazon: 'AM',
    ami: 'AMI',
    anghami: 'AN',
    'apple-music': 'AP',
    'audible-magic': 'AU',
    awa: 'AWA',
    bmat: 'BM',
    boomplay: 'BP',
    deezer: 'DZ',
    facebook: 'FB',
    fuga: 'FU',
    hungama: 'HU',
    iheartradio: 'IH',
    imusica: 'IM',
    inprodicon: 'IP',
    instagram: 'IG',
    jaxsta: 'JX',
    kdigital: 'KD',
    kkbox: 'KK',
    kuack: 'KU',
    lissen: 'LI',
    netease: 'NE',
    nuuday: 'NU',
    pandora: 'PA',
    peloton: 'PE',
    qobuz: 'QO',
    saavn: 'SA',
    'slacker-radio': 'SL',
    soundexchange: 'SE',
    spotify: 'SP',
    synchtank: 'SY',
    tencent: 'TM',
    'the-mlc': 'MLC',
    tidal: 'TI',
    tiktok: 'TT',
    trebel: 'TR',
    'tuned-global': 'TG',
    'youtube-content-id': 'YC',
    'youtube-music': 'YM',
    'youtube-shorts': 'YS',
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
