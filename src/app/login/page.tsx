'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getAssetPath } from '@/shared/utils/asset-path';

export default function LoginPage() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/onboarding');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex min-h-screen w-full cursor-pointer items-center justify-center bg-black"
      aria-label="Continue to onboarding"
    >
      <Image
        src={getAssetPath('/assets/login-screen.png')}
        alt="Login Screen"
        width={1920}
        height={1080}
        className="h-auto w-full max-w-full"
        priority
      />
    </button>
  );
}
