'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Disc3, Music, Package, Rocket, Tag, X } from 'lucide-react';

import { Header } from '@/modules/header/header';
import { COLORS } from '@/shared/constants/theme';

import { CheckoutStep } from '../components/checkout-step';
import { ConfirmationStep } from '../components/confirmation-step';

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
  bundle: {
    title: 'Bundle',
    subtitle: 'Multiple releases',
    icon: Package,
    price: 19.99,
  },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const releaseType = searchParams.get('releaseType') as 'album' | 'single' | 'bundle' | null;
  const hasBoost = searchParams.get('boost') === 'true';
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';

  const [step, setStep] = useState<'checkout' | 'confirmation'>('checkout');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [showDiscountField, setShowDiscountField] = useState(false);

  // Generate order ID
  const [orderId] = useState(
    () =>
      `CDB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  const releaseInfo = releaseType ? RELEASE_TYPE_INFO[releaseType] : null;
  const basePrice = releaseInfo?.price ?? 0;
  const boostPrice = hasBoost ? 39.99 : 0;
  const subtotal = basePrice + boostPrice;
  const discountAmount = appliedDiscount?.amount ?? 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.push('/onboarding/release-type');
  };

  const handleApplyDiscount = () => {
    setDiscountError('');

    // Simulate discount code validation
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setDiscountError('Please enter a discount code');
      return;
    }

    // Example valid codes for demo
    if (code === 'WELCOME10') {
      setAppliedDiscount({ code, amount: basePrice * 0.1 });
      setDiscountCode('');
    } else if (code === 'SAVE5') {
      setAppliedDiscount({ code, amount: 5 });
      setDiscountCode('');
    } else {
      setDiscountError('Invalid discount code');
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError('');
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
              onClick={() => router.push('/onboarding')}
              className="mt-4 text-sm"
              style={{ color: COLORS.primary }}
            >
              Go back to start
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
      <div className="p-6">
        {step === 'checkout' && (
          <div className="mx-auto max-w-5xl">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 mb-6"
              style={{ color: COLORS.textGray }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {/* Header */}
            <h1
              className="text-3xl font-bold font-[var(--font-test-national-2-narrow)] uppercase tracking-wide mb-8"
              style={{ color: COLORS.textWhite }}
            >
              Checkout
            </h1>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Payment */}
              <div className="space-y-6">
                <CheckoutStep
                  total={total}
                  onSubmit={() => setStep('confirmation')}
                />

                {/* Cancel Button */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: COLORS.textGray }}
                  >
                    Cancel Purchase
                  </button>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:order-last">
                <div
                  className="rounded-[3px] border p-6 space-y-4 lg:sticky lg:top-6"
                  style={{ borderColor: COLORS.borderGray, backgroundColor: COLORS.bgCard }}
                >
                  <h2 className="text-sm font-medium uppercase tracking-wide" style={{ color: COLORS.textGray }}>
                    Order Summary
                  </h2>

                  {/* Product */}
                  <div className="py-4 border-t border-b space-y-4" style={{ borderColor: COLORS.borderGray }}>
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${COLORS.primary}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: COLORS.primary }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: COLORS.textWhite }}>
                          {releaseInfo.title} Distribution
                        </p>
                        <p className="text-sm" style={{ color: COLORS.textGray }}>
                          {releaseInfo.subtitle}
                        </p>
                      </div>
                      <p className="font-medium" style={{ color: COLORS.textWhite }}>
                        ${basePrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Boost Add-on */}
                    {hasBoost && (
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: '#F9D84E20' }}
                        >
                          <Rocket className="h-6 w-6" style={{ color: '#F9D84E' }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: COLORS.textWhite }}>
                            Boost
                          </p>
                          <p className="text-sm" style={{ color: COLORS.textGray }}>
                            Premium promotion
                          </p>
                        </div>
                        <p className="font-medium" style={{ color: '#F9D84E' }}>
                          ${boostPrice.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Discount Code */}
                  <div className="space-y-2">
                    {appliedDiscount ? (
                      <div
                        className="flex items-center justify-between rounded-[3px] border px-4 py-3"
                        style={{ borderColor: COLORS.success, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" style={{ color: COLORS.success }} />
                          <span className="text-sm font-medium" style={{ color: COLORS.success }}>
                            {appliedDiscount.code}
                          </span>
                          <span className="text-sm" style={{ color: COLORS.textGray }}>
                            (-${appliedDiscount.amount.toFixed(2)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveDiscount}
                          className="p-1 transition-opacity hover:opacity-70"
                          aria-label="Remove discount"
                        >
                          <X className="h-4 w-4" style={{ color: COLORS.textGray }} />
                        </button>
                      </div>
                    ) : showDiscountField ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="discount-code"
                            value={discountCode}
                            onChange={(e) => {
                              setDiscountCode(e.target.value);
                              setDiscountError('');
                            }}
                            placeholder="Enter code"
                            className="flex-1 rounded-[3px] border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                            style={{
                              backgroundColor: COLORS.bgInput,
                              borderColor: discountError ? '#ef4444' : COLORS.borderGray,
                              color: COLORS.textWhite,
                            }}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleApplyDiscount}
                            className="rounded-[3px] px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                            style={{ backgroundColor: COLORS.borderGray, color: COLORS.textWhite }}
                          >
                            Apply
                          </button>
                        </div>
                        {discountError && (
                          <p className="text-xs" style={{ color: '#ef4444' }}>
                            {discountError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDiscountField(true)}
                        className="text-sm transition-opacity hover:opacity-70"
                        style={{ color: COLORS.textGray }}
                      >
                        Have a discount code?
                      </button>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: COLORS.textGray }}>Subtotal</span>
                      <span style={{ color: COLORS.textWhite }}>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: COLORS.success }}>Discount</span>
                        <span style={{ color: COLORS.success }}>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t" style={{ borderColor: COLORS.borderGray }}>
                      <span className="font-medium" style={{ color: COLORS.textWhite }}>Total</span>
                      <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <ConfirmationStep
                firstName={firstName}
                releaseType={releaseType}
                orderId={orderId}
                total={total}
                onGoToAccountSetup={() => router.push('/home')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: COLORS.bgDark }} />}>
      <CheckoutContent />
    </Suspense>
  );
}
