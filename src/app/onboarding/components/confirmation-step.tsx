'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Check } from 'lucide-react';

import { getAssetPath } from '@/shared/utils/asset-path';
import { COLORS } from '@/shared/constants/theme';

interface ConfirmationStepProps {
  firstName: string;
  releaseType: 'album' | 'single';
  orderId: string;
  total: number;
  onGoToAccountSetup: () => void;
}

export function ConfirmationStep({
  firstName,
  releaseType,
  orderId,
  total,
  onGoToAccountSetup,
}: ConfirmationStepProps) {
  const [flowStep, setFlowStep] = useState<'confirmation' | 'release' | 'congrats'>('confirmation');

  if (flowStep === 'congrats') {
    return (
      <button
        type="button"
        onClick={onGoToAccountSetup}
        className="fixed inset-0 z-50 cursor-pointer flex items-center justify-center bg-black"
      >
        <Image
          src={getAssetPath('/assets/Congrats screen - Dark Mode.png')}
          alt="Congratulations"
          fill
          className="object-contain"
        />
      </button>
    );
  }

  if (flowStep === 'release') {
    return (
      <button
        type="button"
        onClick={() => setFlowStep('congrats')}
        className="fixed inset-0 z-50 cursor-pointer flex items-center justify-center bg-black"
      >
        <Image
          src={getAssetPath('/assets/Step 1_Album Info - Dark Mode.png')}
          alt="Album Info step"
          fill
          className="object-contain"
        />
      </button>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: COLORS.success }}
      >
        <Check className="h-8 w-8 text-white" />
      </div>

      <div>
        <h1
          className="text-3xl font-bold font-[var(--font-test-national-2-narrow)] uppercase tracking-wide"
          style={{ color: COLORS.textWhite }}
        >
          Purchase Complete!
        </h1>
        <p className="mt-2 text-sm" style={{ color: COLORS.textGray }}>
          Thank you for your purchase, {firstName}!
        </p>
      </div>

      <div
        className="rounded-[3px] border p-6 space-y-4"
        style={{ borderColor: COLORS.borderGray, backgroundColor: COLORS.bgCard }}
      >
        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: COLORS.textGray }}>
            Order ID
          </p>
          <p className="text-lg font-mono font-medium mt-1" style={{ color: COLORS.primary }}>
            {orderId}
          </p>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: COLORS.borderGray }}>
          <div className="flex justify-between text-sm" style={{ color: COLORS.textGray }}>
            <span>{releaseType === 'album' ? 'Album' : 'Single'} Distribution</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <p className="text-sm" style={{ color: COLORS.textGray }}>
        A confirmation email has been sent to your registered email address.
      </p>

      <button
        type="button"
        onClick={() => setFlowStep('release')}
        className="w-full rounded-[3px] py-3 text-sm font-medium transition-all"
        style={{
          backgroundColor: COLORS.primary,
          color: COLORS.textWhite,
        }}
      >
        Start My Release
      </button>
    </div>
  );
}
