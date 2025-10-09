'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Suspense } from 'react';

// this error page solution is temporary pending future releases. This will be placed within a separate module.

interface ErrorFormData {
  reportError: boolean;
}

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ErrorFormData>();

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access was denied. Please check your credentials.';
      case 'Verification':
        return 'The verification token has expired or is invalid.';
      case 'Default':
        return 'An error occurred during authentication.';
      default:
        return error ?? 'An unexpected error occurred during authentication.';
    }
  };

  const onSubmit = async (data: ErrorFormData) => {
    if (data.reportError) {
      console.log('Error reported:', {
        error,
        timestamp: new Date().toISOString(),
      });
      alert('Error report submitted. Thank you for helping us improve.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
            {error && (
              <p className="mt-2 text-xs text-red-500">Error code: {error}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/sign-in"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Try signing in again
          </Link>

          <Link
            href="/"
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Return to home
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="flex items-center space-x-2">
            <input
              {...register('reportError')}
              id="reportError"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="reportError" className="text-sm text-gray-600">
              Report this error to help us improve
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Reporting...' : 'Submit error report'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
