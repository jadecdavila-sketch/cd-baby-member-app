'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ChevronDown, ExternalLink, HelpCircle, X } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/shared/components/shadcn/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { COLORS } from '@/shared/constants/theme';
import { getAssetPath } from '@/shared/utils/asset-path';

// Mock artist data
interface Artist {
  id: string;
  name: string;
  image?: string;
}

const MOCK_ARTISTS: Artist[] = [
  { id: '1', name: 'Your Artist Name', image: '/assets/covers/cover1.jpg' },
  { id: '2', name: 'Side Project', image: '/assets/covers/cover2.jpg' },
  { id: '3', name: 'Collaboration Act', image: '/assets/covers/cover3.jpg' },
];

// Platform configuration
interface PlatformConfig {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  features: string[];
  helpUrl: string;
  // For platforms that require manual claiming (no artist selection)
  manualClaim?: boolean;
  claimSteps?: string[];
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    logo: 'spotify-white.svg',
    color: '#1DB954',
    description: 'Spotify for Artists is designed to help artists and their teams get the most out of Spotify. Get instant access today to easily manage your artist profile, learn about your listeners, and share your feedback or questions with the Spotify team.',
    features: [
      'Manage your artist profile',
      'View real-time streaming stats',
      'Pitch songs to playlist editors',
      'Access audience insights',
    ],
    helpUrl: 'https://artists.spotify.com',
  },
  apple: {
    id: 'apple',
    name: 'Apple Music',
    logo: 'apple-music-white.svg',
    color: '#FC3C44',
    description: 'Apple Music for Artists gives you the tools to understand how fans discover and connect with your music. Track your plays across Apple Music and iTunes, explore data on your listeners, and see how your music is performing around the world.',
    features: [
      'Customize your artist page',
      'Track streaming & sales data',
      'Access listener demographics',
      'Promote your releases',
    ],
    helpUrl: 'https://artists.apple.com',
    manualClaim: true,
    claimSteps: [
      'Go to Apple Music for Artists',
      'Sign in with your Apple ID',
      'Search for your artist name and request access',
    ],
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon Music',
    logo: 'amazon-white.svg',
    color: '#00A8E1',
    description: 'Amazon Music for Artists lets you track your streaming performance, understand your listeners, and customize your artist profile on Amazon Music.',
    features: [
      'Customize your artist profile',
      'Track streaming stats',
      'Access listener insights',
      'Optimize for Alexa voice requests',
    ],
    helpUrl: 'https://artists.amazonmusic.com',
    manualClaim: true,
    claimSteps: [
      'Go to your Amazon Music account',
      'Open your settings',
      'Click the link to claim your CD Baby artist profile',
    ],
  },
  deezer: {
    id: 'deezer',
    name: 'Deezer',
    logo: 'deezer-white.svg',
    color: '#A238FF',
    description: 'Deezer for Creators provides tools for artists to understand their audience, track performance, and manage their presence on Deezer.',
    features: [
      'Manage artist profile',
      'View streaming analytics',
      'Understand your audience',
      'Promote your music',
    ],
    helpUrl: 'https://creators.deezer.com',
  },
  tidal: {
    id: 'tidal',
    name: 'TIDAL',
    logo: 'tidal-white.svg',
    color: '#000000',
    description: 'TIDAL for Artists gives you access to detailed streaming data, listener insights, and tools to manage your artist profile on TIDAL.',
    features: [
      'Customize your profile',
      'High-fidelity streaming stats',
      'Fan demographics',
      'Direct fan engagement',
    ],
    helpUrl: 'https://artists.tidal.com',
    manualClaim: true,
    claimSteps: [
      'Go to your TIDAL account',
      'Open your settings',
      'Click the link to claim your CD Baby artist profile',
    ],
  },
};

interface PlatformClaimDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformId: string;
}

export function PlatformClaimDrawer({ open, onOpenChange, platformId }: PlatformClaimDrawerProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const platform = PLATFORM_CONFIGS[platformId] ?? PLATFORM_CONFIGS['spotify']!;

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation completes
    setTimeout(() => {
      setSelectedArtist(null);
      setDropdownOpen(false);
    }, 300);
  };

  const handleGetAccess = () => {
    if (selectedArtist) {
      // Open the platform's artist portal in a new tab
      window.open(platform.helpUrl, '_blank');
      handleClose();
    }
  };

  const handleGoToPlatform = () => {
    window.open(platform.helpUrl, '_blank');
    handleClose();
  };

  // Render manual claim instructions for platforms that don't support artist selection
  const renderManualClaim = () => (
    <div className="flex flex-col h-full">
      {/* Platform Hero Header */}
      <div
        className="px-6 pt-16 pb-8 relative"
        style={{ backgroundColor: platform.color }}
      >
        {/* Logo and "for Artists" branding */}
        <div className="flex items-center gap-3 justify-center">
          <div className="relative h-12 w-12">
            <Image
              src={getAssetPath(`/assets/platforms/${platform.logo}`)}
              alt={platform.name}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="text-3xl font-bold text-white">
            for Artists
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Description */}
        <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.textGray }}>
          {platform.description}
        </p>

        {/* Features list */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: COLORS.textGray }}>
            What you get
          </p>
          <ul className="space-y-2">
            {platform.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm" style={{ color: COLORS.textWhite }}>
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: platform.color }} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* How to Claim - Step by step instructions */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: COLORS.textGray }}>
            How to claim your profile
          </p>
          <div className="space-y-3">
            {platform.claimSteps?.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-[3px]"
                style={{ backgroundColor: COLORS.bgCard }}
              >
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: platform.color, color: platform.id === 'tidal' ? COLORS.textWhite : '#000' }}
                >
                  {index + 1}
                </div>
                <p className="text-sm pt-0.5" style={{ color: COLORS.textWhite }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Help link */}
        <button
          type="button"
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
          style={{ color: platform.color }}
        >
          <HelpCircle className="h-4 w-4" />
          Need help claiming your profile?
        </button>
      </div>

      {/* Footer with Go to Platform Button */}
      <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.borderGray }}>
        <button
          type="button"
          onClick={handleGoToPlatform}
          className="w-full flex items-center justify-center gap-2 rounded-[3px] py-3 text-sm font-medium transition-all"
          style={{
            backgroundColor: platform.color,
            color: platform.id === 'tidal' ? COLORS.textWhite : '#000',
          }}
        >
          Go to {platform.name}
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderSelectArtist = () => (
    <div className="flex flex-col h-full">
      {/* Platform Hero Header */}
      <div
        className="px-6 pt-16 pb-8 relative"
        style={{ backgroundColor: platform.color }}
      >
        {/* Logo and "for Artists" branding */}
        <div className="flex items-center gap-3 justify-center">
          <div className="relative h-12 w-12">
            <Image
              src={getAssetPath(`/assets/platforms/${platform.logo}`)}
              alt={platform.name}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="text-3xl font-bold text-white">
            for Artists
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Description */}
        <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.textGray }}>
          {platform.description}
        </p>

        {/* Features list */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: COLORS.textGray }}>
            What you get
          </p>
          <ul className="space-y-2">
            {platform.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm" style={{ color: COLORS.textWhite }}>
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: platform.color }} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Artist Selection Dropdown */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.textGray }}>
            Select an artist
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-[3px] text-left transition-all"
              style={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${dropdownOpen ? platform.color : COLORS.borderGray}`,
                color: selectedArtist ? COLORS.textWhite : COLORS.textGray,
              }}
            >
              {selectedArtist ? (
                <div className="flex items-center gap-3">
                  {selectedArtist.image && (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={getAssetPath(selectedArtist.image)}
                        alt={selectedArtist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-sm font-medium">{selectedArtist.name}</span>
                </div>
              ) : (
                <span className="text-sm">Please select an artist</span>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                style={{ color: COLORS.textGray }}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-[3px] shadow-lg z-10 overflow-hidden"
                style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
              >
                {MOCK_ARTISTS.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => {
                      setSelectedArtist(artist);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                    style={{
                      backgroundColor: selectedArtist?.id === artist.id ? `${platform.color}15` : 'transparent',
                    }}
                  >
                    {artist.image && (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={getAssetPath(artist.image)}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-sm" style={{ color: COLORS.textWhite }}>
                      {artist.name}
                    </span>
                    {selectedArtist?.id === artist.id && (
                      <Check className="h-4 w-4 ml-auto" style={{ color: platform.color }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Can't find your artist link */}
        <button
          type="button"
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
          style={{ color: platform.color }}
        >
          <HelpCircle className="h-4 w-4" />
          Can&apos;t find your artist?
        </button>
      </div>

      {/* Footer with Get Access Button */}
      <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.borderGray }}>
        <button
          type="button"
          onClick={handleGetAccess}
          disabled={!selectedArtist}
          className="w-full rounded-[3px] py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: selectedArtist ? platform.color : COLORS.bgCard,
            color: platform.id === 'tidal' && selectedArtist ? COLORS.textWhite : selectedArtist ? '#000' : COLORS.textGray,
          }}
        >
          Get Access
        </button>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
        style={{ backgroundColor: COLORS.bgDark, borderColor: COLORS.borderGray }}
      >
        <VisuallyHidden>
          <SheetTitle>{platform.name} for Artists</SheetTitle>
        </VisuallyHidden>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-70 z-10"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          aria-label="Close"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {platform.manualClaim ? renderManualClaim() : renderSelectArtist()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
