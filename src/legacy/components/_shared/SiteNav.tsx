'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '../button';
import {
  getSessionStatus,
  signIn,
  signOut,
} from '@/legacy/services/authService';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import { HomeIcon } from 'lucide-react';

export default function SiteNav() {
  const { data: session, status } = useSession();
  const sessionStatus = getSessionStatus(session, status);
  const pathname = usePathname();

  let authButton = <Button onClick={signIn}>Sign In</Button>;

  // TODO: better ui to show loading state for auth button
  if (sessionStatus === 'loading') {
    authButton = <Button>Loading...</Button>;
  }
  if (sessionStatus === 'authenticated') {
    authButton = <Button onClick={() => signOut(pathname)}>Sign Out</Button>;
  }
  if (sessionStatus === 'expired') {
    signOut(pathname);
  }

  return (
    <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b p-3.5">
      <Link href="/">
        <HomeIcon />
      </Link>
      <div className="flex items-center gap-4">
        {authButton}
        <ModeToggle />
      </div>
    </div>
  );
}
