'use client';

import { Suspense } from 'react';
import Link from 'next/link';

import { useSignOutPage } from './use-sign-out-page';

function SignOut() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    confirmSignOut,
    onSubmit,
    handleFusionAuthSignOut,
    handleCancel,
  } = useSignOutPage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign out confirmation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Are you sure you want to sign out?
          </p>
        </div>

        {/* React Hook Form - Basic form for Sprint 0 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                {...register('confirmSignOut', {
                  required: 'Please confirm you want to sign out',
                })}
                id="confirmSignOut"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label
                htmlFor="confirmSignOut"
                className="ml-2 block text-sm text-gray-900"
              >
                Yes, I want to sign out of my account
              </label>
            </div>
            {errors.confirmSignOut && (
              <p className="text-sm text-red-600">
                {errors.confirmSignOut.message}
              </p>
            )}

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700"
              >
                Reason for signing out (optional)
              </label>
              <select
                {...register('reason')}
                id="reason"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              >
                <option value="">Select a reason</option>
                <option value="finished-session">Finished working</option>
                <option value="switching-accounts">Switching accounts</option>
                <option value="privacy-security">
                  Privacy/Security reasons
                </option>
                <option value="troubleshooting">Troubleshooting issues</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700"
              >
                Feedback about your session (optional)
              </label>
              <textarea
                {...register('feedback')}
                id="feedback"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Share any feedback about your experience..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-feedback-button"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Submit feedback and continue'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFusionAuthSignOut}
              disabled={!confirmSignOut}
              id="fusionauth-signout-button"
              className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                confirmSignOut
                  ? 'cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'cursor-not-allowed bg-red-300'
              }`}
            >
              Sign out with FusionAuth
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                id="cancel-signout-button"
                className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                Cancel
              </button>

              <Link
                href="/"
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                Return home
              </Link>
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This form uses React Hook Form for Sprint 0. The layout and
            components will be enhanced with custom designs later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignOutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignOut />
    </Suspense>
  );
}
