'use client';

import Link from 'next/link';

interface SignInButtonProps {
  callbackUrl?: string;
  className?: string;
}

export function SignInButton({
  callbackUrl = '/',
  className,
}: SignInButtonProps) {
  const href = `/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <Link
      href={href}
      className={
        className ??
        'group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
      }
    >
      Sign In
    </Link>
  );
}
