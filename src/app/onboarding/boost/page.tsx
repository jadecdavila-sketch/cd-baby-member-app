'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Check, Disc3, Music } from 'lucide-react';

import { Header } from '@/modules/header/header';
import { COLORS } from '@/shared/constants/theme';
import { getAssetPath } from '@/shared/utils/asset-path';

const RELEASE_TYPE_INFO = {
  single: {
    title: 'Single',
    subtitle: '1 track',
    icon: Music,
    price: 9.99,
  },
  album: {
    title: 'Album',
    subtitle: '2+ tracks',
    icon: Disc3,
    price: 14.99,
  },
};

function BoostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const releaseType = searchParams.get('releaseType') as 'album' | 'single' | null;
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const [boostSelected, setBoostSelected] = useState(false);

  const releaseInfo = releaseType ? RELEASE_TYPE_INFO[releaseType] : null;

  const handleContinue = () => {
    router.push(
      `/onboarding/checkout?releaseType=${releaseType}&boost=${boostSelected}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
    );
  };

  const handleBack = () => {
    router.back();
  };

  // Redirect if no release type
  if (!releaseType || !releaseInfo) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: COLORS.bgDark }}>
        <Header minimal />
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <p style={{ color: COLORS.textWhite }}>No release type selected.</p>
            <button
              type="button"
              onClick={() => router.push('/onboarding/release-type')}
              className="mt-4 text-sm"
              style={{ color: COLORS.primary }}
            >
              Go back to release selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = releaseInfo.icon;

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
              Supercharge Your Release
            </h1>
            <p className="mt-2 text-sm" style={{ color: COLORS.textGray }}>
              Add Boost to maximize your reach
            </p>
          </div>

          {/* Selected Release Type */}
          <div
            className="rounded-[3px] border p-4"
            style={{
              borderColor: COLORS.primary,
              backgroundColor: 'rgba(82, 188, 214, 0.1)',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${COLORS.primary}20` }}
              >
                <Icon className="h-6 w-6" style={{ color: COLORS.primary }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold" style={{ color: COLORS.textWhite }}>
                    {releaseInfo.title} Distribution
                  </h3>
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
                <p className="text-sm" style={{ color: COLORS.textGray }}>
                  {releaseInfo.subtitle} • ${releaseInfo.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Boost Add-on */}
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
                className="flex-shrink-0 w-[140px] flex items-center justify-center p-4"
                style={{ backgroundColor: '#F9D84E' }}
              >
                <Image
                  src={getAssetPath('/assets/BOOST.png')}
                  alt="Boost"
                  width={100}
                  height={60}
                  className="object-contain"
                />
              </div>
              {/* Content */}
              <div className="flex-1 p-6" style={{ backgroundColor: COLORS.bgCard }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="text-lg font-bold uppercase tracking-wide"
                      style={{ color: COLORS.textWhite }}
                    >
                      Get Heard. Get Noticed.
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: COLORS.textGray }}>
                      With <span className="font-semibold" style={{ color: COLORS.textWhite }}>Boost</span>, your music gets premium promotion to help you land playlists, grow streams, and reach new fans.
                    </p>
                  </div>
                  <span
                    className="text-lg font-bold flex-shrink-0 ml-4"
                    style={{ color: '#F9D84E' }}
                  >
                    +$39.99
                  </span>
                </div>
                {boostSelected && (
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: '#F9D84E' }}
                    >
                      <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#F9D84E' }}>Added to your release</span>
                  </div>
                )}
              </div>
            </div>
          </button>

          {/* Skip option */}
          {!boostSelected && (
            <p className="text-center text-sm" style={{ color: COLORS.textGray }}>
              Not interested? No problem—you can always add Boost later.
            </p>
          )}

          {/* Continue Button */}
          <button
            type="button"
            id="continue-to-checkout-button"
            onClick={handleContinue}
            className="w-full rounded-[3px] py-3 text-sm font-medium transition-all"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.textWhite,
            }}
          >
            {boostSelected ? 'Continue with Boost' : 'Continue without Boost'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BoostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: COLORS.bgDark }} />}>
      <BoostContent />
    </Suspense>
  );
}
