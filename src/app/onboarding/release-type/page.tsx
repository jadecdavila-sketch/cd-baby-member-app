'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Check, Disc3, Music } from 'lucide-react';

import { Header } from '@/modules/header/header';
import { COLORS } from '@/shared/constants/theme';
import { getAssetPath } from '@/shared/utils/asset-path';

const RELEASE_TYPES = [
  {
    id: 'single',
    icon: Music,
    title: 'Single',
    subtitle: '1 track',
    price: 9.99,
    description:
      'Perfect for releasing one song at a time. Singles are great for building momentum, testing new sounds, or dropping tracks between larger releases.',
  },
  {
    id: 'album',
    icon: Disc3,
    title: 'Album',
    subtitle: '2+ tracks',
    price: 14.99,
    description:
      'Release a collection of songs as a cohesive project. Albums allow you to tell a bigger story and give fans more music to enjoy in one package.',
  },
];

function ReleaseTypeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [boostSelected, setBoostSelected] = useState(false);

  const handleContinue = () => {
    if (selectedType) {
      router.push(
        `/onboarding/checkout?releaseType=${selectedType}&boost=${boostSelected}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const selectedRelease = RELEASE_TYPES.find((r) => r.id === selectedType);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bgDark }}>
      <Header minimal />
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-8">
          {/* Back button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: COLORS.textGray }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Header */}
          <div className="text-center">
            <h1
              className="text-3xl font-bold font-[var(--font-test-national-2-narrow)] uppercase tracking-wide"
              style={{ color: COLORS.textWhite }}
            >
              Choose Your Release Type
            </h1>
            <p className="mt-2 text-sm" style={{ color: COLORS.textGray }}>
              Select the type of release that best fits your music
            </p>
          </div>

          {/* Release Type Options */}
          <div className="space-y-4">
            {RELEASE_TYPES.map((releaseType) => {
              const Icon = releaseType.icon;
              const isSelected = selectedType === releaseType.id;
              return (
                <div key={releaseType.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedType === releaseType.id) {
                        // Deselect if clicking the same option
                        setSelectedType(null);
                        setBoostSelected(false);
                      } else {
                        // Select new option and reset boost
                        setSelectedType(releaseType.id);
                        setBoostSelected(false);
                      }
                    }}
                    className="w-full rounded-[3px] border p-6 text-left transition-all"
                    style={{
                      borderColor: isSelected ? COLORS.primary : COLORS.borderGray,
                      backgroundColor: isSelected ? 'rgba(82, 188, 214, 0.1)' : 'transparent',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${COLORS.primary}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: COLORS.primary }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: COLORS.textWhite }}
                            >
                              {releaseType.title}
                            </h3>
                            {isSelected && (
                              <div
                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                style={{ backgroundColor: COLORS.primary }}
                              >
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span
                            className="text-lg font-bold"
                            style={{ color: COLORS.primary }}
                          >
                            ${releaseType.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: COLORS.textGray }}>
                          {releaseType.subtitle}
                        </p>
                        <p
                          className="mt-3 text-sm leading-relaxed"
                          style={{ color: COLORS.textGray }}
                        >
                          {releaseType.description}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Boost Add-on - appears under selected release type */}
                  {isSelected && (
                    <div className="mt-4 ml-4 pl-4 border-l-2" style={{ borderColor: COLORS.primary }}>
                      <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: COLORS.textGray }}>
                        Supercharge your release
                      </p>
                      <button
                        type="button"
                        onClick={() => setBoostSelected(!boostSelected)}
                        className="w-full rounded-[3px] overflow-hidden text-left transition-all"
                        style={{
                          border: boostSelected ? '2px solid #F9D84E' : `1px solid ${COLORS.borderGray}`,
                        }}
                      >
                        <div className="flex">
                          {/* Yellow left panel with BOOST logo */}
                          <div
                            className="flex-shrink-0 w-[100px] flex items-center justify-center p-3"
                            style={{ backgroundColor: '#F9D84E' }}
                          >
                            <Image
                              src={getAssetPath('/assets/BOOST.png')}
                              alt="Boost"
                              width={80}
                              height={48}
                              className="object-contain"
                            />
                          </div>
                          {/* Content */}
                          <div className="flex-1 p-4" style={{ backgroundColor: COLORS.bgCard }}>
                            <div className="flex items-start justify-between">
                              <div>
                                <h3
                                  className="text-base font-bold uppercase tracking-wide"
                                  style={{ color: COLORS.textWhite }}
                                >
                                  Get Heard. Get Noticed.
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed" style={{ color: COLORS.textGray }}>
                                  Premium promotion to help you land playlists, grow streams, and reach new fans.
                                </p>
                              </div>
                              <span
                                className="text-base font-bold flex-shrink-0 ml-3"
                                style={{ color: '#F9D84E' }}
                              >
                                +$39.99
                              </span>
                            </div>
                            {boostSelected && (
                              <div className="mt-2 flex items-center gap-2">
                                <div
                                  className="flex h-4 w-4 items-center justify-center rounded-full"
                                  style={{ backgroundColor: '#F9D84E' }}
                                >
                                  <svg className="h-2.5 w-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium" style={{ color: '#F9D84E' }}>Added to your release</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <button
            type="button"
            id="continue-to-checkout-button"
            onClick={handleContinue}
            disabled={!selectedType}
            className="w-full rounded-[3px] py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: selectedType ? COLORS.primary : COLORS.bgCard,
              color: COLORS.textWhite,
            }}
          >
            {selectedType
              ? boostSelected
                ? `Continue with Boost • $${(selectedRelease!.price + 39.99).toFixed(2)}`
                : `Continue • $${selectedRelease!.price.toFixed(2)}`
              : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReleaseTypePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: COLORS.bgDark }} />}>
      <ReleaseTypeContent />
    </Suspense>
  );
}
