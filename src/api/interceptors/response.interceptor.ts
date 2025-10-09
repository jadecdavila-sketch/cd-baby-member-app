import { AxiosResponse, AxiosError } from 'axios';

// Track logout state to prevent multiple simultaneous logout calls
let isLoggingOut = false;

/**
 * Response interceptor that handles authentication failures
 * @param response - Successful response (passed through unchanged)
 * @returns The original response
 */
export const responseSuccessInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  return response;
};

/**
 * Response error interceptor that handles authentication failures
 * @param error - Axios error object
 * @returns Rejected promise with the error
 */
export const responseErrorInterceptor = async (
  error: AxiosError
): Promise<never> => {
  const { response } = error;

  // Check for authentication failure status codes
  if (response?.status === 401 || response?.status === 403) {
    console.warn(
      `Authentication failure detected (${response.status}), logging out user`
    );

    await handleAuthFailure();
  }

  // Always reject the promise to maintain error flow
  return Promise.reject(error);
};

/**
 * Handles authentication failure by logging out the user
 * Prevents multiple simultaneous logout calls
 */
async function handleAuthFailure(): Promise<void> {
  // Prevent multiple logout calls
  if (isLoggingOut) {
    console.log('Logout already in progress, skipping...');
    return;
  }

  isLoggingOut = true;

  try {
    // Redirect
    // Note: logoutRedirect doesn't return as it redirects the page
  } catch (error) {
    console.error('Logout failed:', error);
    // Reset flag if logout fails so it can be retried
    isLoggingOut = false;
  }
}
