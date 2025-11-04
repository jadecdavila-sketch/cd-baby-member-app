'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/shared/components/shadcn';
import { cn } from '@/shared/utils/index';

interface HeaderProps {
  className?: string;
}

// Helper function to add basePath for production
const getAssetPath = (path: string) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/cd-baby-member-app' : '';
  return `${basePath}${path}`;
};

export function Header({ className }: HeaderProps) {
  const notificationCount: number = 0;
  return (
    <header
      className={cn(
        'flex h-[92px] items-center justify-between bg-black px-6',
        className
      )}
    >
      <div className="m-auto flex w-full max-w-[1600px] justify-between">
        <Image
          src={getAssetPath('/assets/cdbaby-logo.svg')}
          alt="CD Baby"
          width={168}
          height={40}
          priority
        />

        <nav aria-label="Main navigation">
          <div className="flex items-center gap-[40px]">
            <Button
              asChild
              className="h-[35px] w-[164px] rounded-[3px] bg-white px-3 text-[12px] font-bold text-black hover:bg-gray-50"
              aria-label="Add New Release"
            >
              <Link href="#">
                Add New Release
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <rect x="5" y="0" width="2" height="12" fill="currentColor" />
                  <rect x="0" y="5" width="12" height="2" fill="currentColor" />
                </svg>
              </Link>
            </Button>

            <Link
              href="#"
              className="flex h-[44px] w-[44px] items-center justify-center rounded hover:opacity-70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
              aria-label="Search"
            >
              <Image
                src={getAssetPath('/assets/icon-search.svg')}
                alt=""
                width={24}
                height={24}
              />
            </Link>

            <Link
              href="#"
              className="relative flex h-[44px] w-[44px] items-center justify-center rounded hover:opacity-70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
              aria-label={`Notifications${
                notificationCount > 0 ? ` (${notificationCount})` : ''
              }`}
            >
              <Image
                src={getAssetPath('/assets/icon-bell.svg')}
                alt=""
                width={24}
                height={24}
              />
              {notificationCount > 0 && (
                <>
                  <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-black bg-[var(--cdbaby-pink)]" />
                  <span className="sr-only" aria-live="polite">
                    {notificationCount} new notification
                    {notificationCount !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </Link>

            <Link
              href="#"
              className="flex h-[44px] w-[44px] items-center justify-center rounded hover:opacity-70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
              aria-label="User profile"
            >
              <Image
                src={getAssetPath('/assets/icon-person.svg')}
                alt=""
                width={24}
                height={24}
              />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
