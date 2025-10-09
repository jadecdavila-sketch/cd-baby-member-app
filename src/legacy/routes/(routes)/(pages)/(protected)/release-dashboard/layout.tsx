'use client';

import ReleaseProvider from '@/app/_providers/ReleaseProvider';
import { ReleaseMobileSidebarTrigger } from '@/components/release-sidebar';

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReleaseProvider>
      <ReleaseMobileSidebarTrigger />
      {children}
    </ReleaseProvider>
  );
}
