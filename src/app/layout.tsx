import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';

import { Header } from '@/modules/header';
import { SidebarNav } from '@/shared/components/sidebar-nav';

import './globals.css';

const testNational2 = localFont({
  src: [
    {
      path: '../../public/fonts/test-national-2-light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/test-national-2-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/test-national-2-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-test-national-2',
  display: 'swap',
});

const testNational2Narrow = localFont({
  src: [
    {
      path: '../../public/fonts/test-national-2-narrow-light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/test-national-2-narrow-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/test-national-2-narrow-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-test-national-2-narrow',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CDBaby Analytics',
  description:
    'Your creative command center – insights, trends, and next steps',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${testNational2.variable} ${testNational2Narrow.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Sidebar Navigation */}
          <SidebarNav />

          {/* Main app container with left padding for sidebar */}
          <div className="flex min-h-screen flex-col" style={{ paddingLeft: '70px' }}>
            {/* Header */}
            <Header />

            {/* Main content */}
            {children}

            {/* Footer */}
            <footer className="bg-muted text-muted-foreground mt-auto p-4">
              <div className="mx-auto max-w-7xl text-center text-sm">
                © 2025 CDBaby Platform. All rights reserved.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
