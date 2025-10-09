'use client';

import Link from 'next/link';

interface SignOutButtonProps {
  callbackUrl?: string;
  className?: string;
}

export function SignOutButton({
  callbackUrl = '/',
  className,
}: SignOutButtonProps) {
  const href = `/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <Link
      href={href}
      className={
        className ??
        'group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none'
      }
    >
      Sign Out
    </Link>
  );
}
