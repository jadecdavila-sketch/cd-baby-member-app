'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Check, Copy, Link as LinkIcon, Music, Rocket, Save, X } from 'lucide-react';

import {
  Sheet,
  SheetContent,
} from '@/shared/components/shadcn/sheet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/shadcn/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { COLORS } from '@/shared/constants/theme';
import { getAssetPath } from '@/shared/utils/asset-path';

import { CheckoutStep } from '@/app/onboarding/components/checkout-step';

// Mock releases data (same structure as dashboard)
interface Release {
  id: string;
  title: string;
  artist: string;
  type: 'single' | 'album';
  status: 'delivered';
  coverArt?: string;
  upc: string;
}

const ELIGIBLE_RELEASES: Release[] = [
  {
    id: '1',
    title: 'Electric Sunset',
    artist: 'Your Artist Name',
    type: 'single',
    status: 'delivered',
    coverArt: '/assets/covers/cover3.jpg',
    upc: '859785826371',
  },
  {
    id: '2',
    title: 'Night Rider EP',
    artist: 'Your Artist Name',
    type: 'album',
    status: 'delivered',
    coverArt: '/assets/covers/cover4.jpg',
    upc: '859785826388',
  },
  {
    id: '3',
    title: 'Starlight',
    artist: 'Your Artist Name',
    type: 'single',
    status: 'delivered',
    coverArt: '/assets/covers/cover1.jpg',
    upc: '859785826395',
  },
  {
    id: '4',
    title: 'Midnight Dreams',
    artist: 'Your Artist Name',
    type: 'album',
    status: 'delivered',
    coverArt: '/assets/covers/cover2.jpg',
    upc: '859785826402',
  },
];

type ToolType = 'hearnow' | 'boost' | 'presave';
type DrawerStep = 'select-release' | 'checkout' | 'confirmation';

interface ToolDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolType: ToolType;
}

const TOOL_INFO = {
  hearnow: {
    name: 'HearNow',
    description: 'Create a shareable page with all your streaming links in one place.',
    icon: LinkIcon,
    price: 9.99,
    color: COLORS.primary,
  },
  boost: {
    name: 'Boost',
    description: 'Get premium promotion to land playlists and reach new fans.',
    icon: Rocket,
    price: 39.99,
    color: '#F9D84E',
  },
  presave: {
    name: 'Spotify Pre-Save',
    description: 'Let fans save your release before it drops.',
    icon: Save,
    price: 0,
    color: '#1DB954',
  },
};

export function ToolDrawer({ open, onOpenChange, toolType }: ToolDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('select-release');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [upcCopied, setUpcCopied] = useState(false);
  const [upcModalOpen, setUpcModalOpen] = useState(false);

  const toolInfo = TOOL_INFO[toolType];
  const Icon = toolInfo.icon;

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation completes
    setTimeout(() => {
      setStep('select-release');
      setSelectedRelease(null);
      setUpcCopied(false);
      setUpcModalOpen(false);
    }, 300);
  };

  const handleReleaseSelect = (release: Release) => {
    setSelectedRelease(release);
  };

  const handleContinue = () => {
    if (selectedRelease) {
      // For HearNow, redirect to external preview page
      if (toolType === 'hearnow') {
        window.open(`https://hearnow.com/create?release=${selectedRelease.id}`, '_blank');
        handleClose();
      } else if (toolType === 'presave') {
        // For Pre-Save, show UPC info modal first
        setUpcModalOpen(true);
      } else {
        setStep('checkout');
      }
    }
  };

  const handleCopyUpc = async () => {
    if (selectedRelease) {
      await navigator.clipboard.writeText(selectedRelease.upc);
      setUpcCopied(true);
      setTimeout(() => setUpcCopied(false), 2000);
    }
  };

  const handleContinueToShowCo = () => {
    if (selectedRelease) {
      window.open(`https://show.co/presave?release=${selectedRelease.id}`, '_blank');
      setUpcModalOpen(false);
      handleClose();
    }
  };

  const handleBackToReleases = () => {
    setStep('select-release');
  };

  const handleCheckoutComplete = () => {
    setStep('confirmation');
  };

  const renderSelectRelease = () => (
    <div className="flex flex-col h-full">
      {/* Header with Tool Info */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${toolInfo.color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color: toolInfo.color }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: COLORS.textWhite }}>
              {toolInfo.name}
            </h2>
            <p className="text-sm" style={{ color: COLORS.textGray }}>
              {toolInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Release List */}
      <div className="flex-1 overflow-y-auto px-6">
        <p className="text-sm font-medium uppercase tracking-wide mb-3" style={{ color: COLORS.textGray }}>
          Select a release
        </p>
        <div className="space-y-2">
          {ELIGIBLE_RELEASES.map((release) => {
            const isSelected = selectedRelease?.id === release.id;
            return (
              <button
                key={release.id}
                type="button"
                onClick={() => handleReleaseSelect(release)}
                className="w-full flex items-center gap-3 p-3 rounded-[3px] transition-all text-left"
                style={{
                  backgroundColor: isSelected ? `${COLORS.primary}15` : COLORS.bgCard,
                  border: `1px solid ${isSelected ? COLORS.primary : COLORS.borderGray}`,
                }}
              >
                {/* Cover Art - Small */}
                <div className="relative h-12 w-12 flex-shrink-0 rounded-[3px] overflow-hidden">
                  {release.coverArt ? (
                    <Image
                      src={getAssetPath(release.coverArt)}
                      alt={release.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${COLORS.primary}20` }}
                    >
                      <Music className="h-6 w-6" style={{ color: COLORS.primary }} />
                    </div>
                  )}
                </div>

                {/* Release Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: COLORS.textWhite }}>
                    {release.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: COLORS.textGray }}>
                    {release.artist} • {release.type === 'album' ? 'Album' : 'Single'}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: isSelected ? COLORS.primary : 'transparent',
                    border: `2px solid ${isSelected ? COLORS.primary : COLORS.borderGray}`,
                  }}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer with Continue Button */}
      <div className="px-6 py-4 border-t" style={{ borderColor: COLORS.borderGray }}>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedRelease}
          className="w-full rounded-[3px] py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: selectedRelease ? COLORS.primary : COLORS.bgCard,
            color: COLORS.textWhite,
          }}
        >
          {toolType === 'hearnow'
            ? 'Preview your page on HearNow'
            : toolType === 'presave'
              ? 'Set up Pre-Save'
              : 'Continue'}
        </button>
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="flex flex-col h-full">
      {/* Header with Back Button */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: COLORS.borderGray }}>
        <button
          type="button"
          onClick={handleBackToReleases}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 mb-4"
          style={{ color: COLORS.textGray }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h2 className="text-lg font-semibold" style={{ color: COLORS.textWhite }}>
          Checkout
        </h2>
      </div>

      {/* Checkout Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Selected Release Summary */}
        {selectedRelease && (
          <div
            className="flex items-center gap-3 p-3 rounded-[3px] mb-6"
            style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
          >
            <div className="relative h-12 w-12 flex-shrink-0 rounded-[3px] overflow-hidden">
              {selectedRelease.coverArt ? (
                <Image
                  src={getAssetPath(selectedRelease.coverArt)}
                  alt={selectedRelease.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.primary}20` }}
                >
                  <Music className="h-6 w-6" style={{ color: COLORS.primary }} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm" style={{ color: COLORS.textWhite }}>
                {selectedRelease.title}
              </p>
              <p className="text-xs" style={{ color: COLORS.textGray }}>
                {toolInfo.name} for {selectedRelease.type === 'album' ? 'Album' : 'Single'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold" style={{ color: toolInfo.price === 0 ? COLORS.success : COLORS.textWhite }}>
                {toolInfo.price === 0 ? 'Free' : `$${toolInfo.price.toFixed(2)}`}
              </p>
            </div>
          </div>
        )}

        {/* Checkout Form */}
        <CheckoutStep total={toolInfo.price} onSubmit={handleCheckoutComplete} />
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex flex-col h-full items-center justify-center px-6 py-8">
      {/* Success Icon */}
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full mb-6"
        style={{ backgroundColor: `${COLORS.success}20` }}
      >
        <Check className="h-10 w-10" style={{ color: COLORS.success }} />
      </div>

      {/* Success Message */}
      <h2 className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.textWhite }}>
        Purchase Complete!
      </h2>
      <p className="text-sm text-center mb-6" style={{ color: COLORS.textGray }}>
        {toolInfo.name} has been added to &quot;{selectedRelease?.title}&quot;.
      </p>

      {/* Selected Release */}
      {selectedRelease && (
        <div
          className="flex items-center gap-3 p-4 rounded-[3px] mb-6 w-full max-w-xs"
          style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
        >
          <div className="relative h-14 w-14 flex-shrink-0 rounded-[3px] overflow-hidden">
            {selectedRelease.coverArt ? (
              <Image
                src={getAssetPath(selectedRelease.coverArt)}
                alt={selectedRelease.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.primary}20` }}
              >
                <Music className="h-7 w-7" style={{ color: COLORS.primary }} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium" style={{ color: COLORS.textWhite }}>
              {selectedRelease.title}
            </p>
            <p className="text-sm" style={{ color: COLORS.textGray }}>
              {selectedRelease.artist}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-3">
        <button
          type="button"
          onClick={handleClose}
          className="w-full rounded-[3px] py-3 text-sm font-medium transition-all"
          style={{ backgroundColor: COLORS.primary, color: COLORS.textWhite }}
        >
          Done
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
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-70 z-10"
          style={{ backgroundColor: COLORS.bgCard }}
          aria-label="Close"
        >
          <X className="h-4 w-4" style={{ color: COLORS.textGray }} />
        </button>

        {/* Content based on step */}
        <div className="flex-1 overflow-hidden">
          {step === 'select-release' && renderSelectRelease()}
          {step === 'checkout' && renderCheckout()}
          {step === 'confirmation' && renderConfirmation()}
        </div>
      </SheetContent>

      {/* UPC Info Modal */}
      <Dialog open={upcModalOpen} onOpenChange={setUpcModalOpen}>
        <DialogContent
          className="sm:max-w-md p-0 overflow-hidden"
          style={{ backgroundColor: COLORS.bgDark, borderColor: COLORS.borderGray }}
        >
          <VisuallyHidden>
            <DialogTitle>UPC Code for Pre-Save</DialogTitle>
          </VisuallyHidden>

          <div className="p-6">
            {/* Header */}
            <h2 className="text-lg font-semibold mb-2" style={{ color: COLORS.textWhite }}>
              Before You Go
            </h2>
            <p className="text-sm mb-6" style={{ color: COLORS.textGray }}>
              You&apos;ll need your <strong style={{ color: COLORS.textWhite }}>UPC code</strong> to set up your Spotify Pre-Save on Show.co. Here it is:
            </p>

            {/* Selected Release with UPC */}
            {selectedRelease && (
              <div
                className="p-4 rounded-[3px] mb-6"
                style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.borderGray}` }}
              >
                {/* Release Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-[3px] overflow-hidden">
                    {selectedRelease.coverArt ? (
                      <Image
                        src={getAssetPath(selectedRelease.coverArt)}
                        alt={selectedRelease.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: `${COLORS.primary}20` }}
                      >
                        <Music className="h-6 w-6" style={{ color: COLORS.primary }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: COLORS.textWhite }}>
                      {selectedRelease.title}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.textGray }}>
                      {selectedRelease.artist}
                    </p>
                  </div>
                </div>

                {/* UPC Code with Copy Button */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 px-4 py-3 rounded-[3px] font-mono text-lg tracking-wider"
                    style={{ backgroundColor: COLORS.bgDark, color: COLORS.textWhite }}
                  >
                    {selectedRelease.upc}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpc}
                    className="flex items-center gap-2 px-4 py-3 rounded-[3px] text-sm font-medium transition-all"
                    style={{
                      backgroundColor: upcCopied ? COLORS.success : COLORS.primary,
                      color: COLORS.textWhite,
                    }}
                  >
                    {upcCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinueToShowCo}
              className="w-full rounded-[3px] py-3 text-sm font-medium transition-all"
              style={{ backgroundColor: '#1DB954', color: COLORS.textWhite }}
            >
              Continue to Show.co
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
