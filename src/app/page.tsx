'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to analytics page for GitHub Pages demo
    router.push('/analytics');
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">CD Baby Analytics</h1>
        <p className="text-muted-foreground">
          Redirecting to analytics dashboard...
        </p>
      </div>
    </main>
  );
}
