'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { COLORS } from '@/shared/constants/theme';

import { AccountSetupStep } from './components/account-setup-step';
import { CheckoutStep } from './components/checkout-step';
import { ConfirmationStep } from './components/confirmation-step';
import { InfoStep } from './components/info-step';

type Step = 'info' | 'checkout' | 'confirmation' | 'account-setup';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('info');

  // Info step state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [releaseType, setReleaseType] = useState<'album' | 'single' | 'not-ready' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Order state
  const [orderId] = useState(
    () =>
      `CDB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  const basePrice = releaseType === 'album' ? 29.99 : 9.99;

  // Account setup step has its own full-width layout
  if (step === 'account-setup') {
    return <AccountSetupStep firstName={firstName} onComplete={() => router.push('/')} />;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ backgroundColor: COLORS.bgDark }}
    >
      <div className="w-full max-w-md space-y-8">
        {step === 'info' && (
          <InfoStep
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            releaseType={releaseType}
            setReleaseType={setReleaseType}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
            onSubmit={() => {
              if (releaseType === 'not-ready') {
                setStep('account-setup');
              } else {
                setStep('checkout');
              }
            }}
          />
        )}

        {step === 'checkout' && releaseType && releaseType !== 'not-ready' && (
          <CheckoutStep releaseType={releaseType} onSubmit={() => setStep('confirmation')} />
        )}

        {step === 'confirmation' && releaseType && releaseType !== 'not-ready' && (
          <ConfirmationStep
            firstName={firstName}
            releaseType={releaseType}
            orderId={orderId}
            total={basePrice}
            onGoToAccountSetup={() => setStep('account-setup')}
          />
        )}
      </div>
    </div>
  );
}
