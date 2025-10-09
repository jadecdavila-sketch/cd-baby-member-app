'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { queryClient } from '@/shared/services';

interface ProvidersProps {
  children: React.ReactNode;
  session?: any; // NextAuth session type
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-red-500">
          <svg
            className="h-full w-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
        <pre className="text-muted-foreground mt-2 text-sm">
          {error.message}
        </pre>
        <button
          id="error-boundary-reset"
          onClick={resetErrorBoundary}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try again
        </button>
      </div>
    </div>
  );
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Here you would send to your error tracking service
        // Example: Sentry.captureException(error);
      }}
      onReset={() => {
        // Clear any cached data or reset application state if needed
        queryClient.clear();
      }}
    >
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange={false}
            >
              {children}
              <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            </ThemeProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
