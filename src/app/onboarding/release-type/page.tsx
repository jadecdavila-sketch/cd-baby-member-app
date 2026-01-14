'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Disc3, Music, Package } from 'lucide-react';

import { Header } from '@/modules/header/header';
import { COLORS } from '@/shared/constants/theme';

const RELEASE_TYPES = [
  {
    id: 'single',
    icon: Music,
    title: 'Single',
    subtitle: '1 track',
    price: '$9.99',
    description:
      'Perfect for releasing one song at a time. Singles are great for building momentum, testing new sounds, or dropping tracks between larger releases.',
  },
  {
    id: 'album',
    icon: Disc3,
    title: 'Album',
    subtitle: '2+ tracks',
    price: '$14.99',
    description:
      'Release a collection of songs as a cohesive project. Albums allow you to tell a bigger story and give fans more music to enjoy in one package.',
  },
  {
    id: 'bundle',
    icon: Package,
    title: 'Bundle',
    subtitle: 'Multiple releases at a discount',
    price: '$19.99',
    description:
      'Plan ahead and save money by purchasing multiple release credits upfront. Ideal for artists who release music frequently throughout the year.',
  },
];

function ReleaseTypeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      router.push(
        `/onboarding/checkout?releaseType=${selectedType}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

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
                <button
                  key={releaseType.id}
                  type="button"
                  onClick={() => setSelectedType(releaseType.id)}
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
                        <div>
                          <h3
                            className="text-lg font-semibold"
                            style={{ color: COLORS.textWhite }}
                          >
                            {releaseType.title}
                          </h3>
                          <p className="text-sm" style={{ color: COLORS.textGray }}>
                            {releaseType.subtitle}
                          </p>
                        </div>
                        <span
                          className="text-lg font-bold"
                          style={{ color: COLORS.primary }}
                        >
                          {releaseType.price}
                        </span>
                      </div>
                      <p
                        className="mt-3 text-sm leading-relaxed"
                        style={{ color: COLORS.textGray }}
                      >
                        {releaseType.description}
                      </p>
                    </div>
                  </div>
                </button>
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
            Continue
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
