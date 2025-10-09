import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { ReactNode } from 'react';

import { getSessionStatus, signIn, signOut } from '@/shared/services';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const sessionStatus = getSessionStatus(session as Session, status);
  if (sessionStatus === 'loading') return <></>;
  if (sessionStatus === 'expired') {
    signOut();
  }
  if (sessionStatus === 'unauthenticated') {
    signIn();
  }
  // 'authenticated' / default
  return <>{children}</>;
};

export default AuthGuard;
