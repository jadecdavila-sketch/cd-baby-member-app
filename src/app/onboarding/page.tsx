'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/modules/header/header';
import { COLORS } from '@/shared/constants/theme';

import { InfoStep } from './components/info-step';

export default function OnboardingPage() {
  const router = useRouter();

  // Info step state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bgDark }}>
      <Header minimal />
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <InfoStep
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
            onGoToDashboard={() => router.push('/home')}
          />
        </div>
      </div>
    </div>
  );
}
