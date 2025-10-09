'use client';

import AuthGuard from '@/app/_utils/AuthGuard';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getSessionStatus, signOut } from '@/legacy/services/authService';

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Setting up session expiration check...');
    const interval = setInterval(() => {
      const statusResult = getSessionStatus(session, status);
      if (statusResult === 'expired') {
        signOut();
      }
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, [session, status]);

  return <AuthGuard>{children}</AuthGuard>;
}
