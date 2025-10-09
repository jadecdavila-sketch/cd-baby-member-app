'use client';

import { useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';

import { SignInButton } from '@/app/auth/sign-in/components/sign-in-button/sign-in-button';
import { SignOutButton } from '@/app/auth/sign-out/components/sign-out-button/sign-out-button';
import { DatePicker } from '@/shared/components/form/date-picker/date-picker';
import { TimePicker } from '@/shared/components/form/time-picker/time-picker';

function HomeContent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <main className="mx-auto max-w-7xl flex-1 p-8" style={{ width: 320 }}>
      {session ? (
        <div className="space-y-4">
          <p>Signed in as: {session.user?.email}</p>
          <SignOutButton />
        </div>
      ) : (
        <div className="space-y-4">
          <p>Your music distribution platform.</p>
          <SignInButton />
          <DatePicker placeholder="Select a date" />
          <TimePicker placeholder="12.00am" />
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}
