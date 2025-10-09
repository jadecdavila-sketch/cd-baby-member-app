import { vi } from 'vitest';
import type { AxiosResponse, AxiosError } from 'axios';

/**
 * Mock implementation of response interceptors
 * Provides predictable response handling for testing
 */
export const responseSuccessInterceptor = vi.fn().mockImplementation(
  (response: AxiosResponse): AxiosResponse => {
    // Pass through success responses unchanged
    return response;
  }
);

export const responseErrorInterceptor = vi.fn().mockImplementation(
  async (error: AxiosError): Promise<never> => {
    // Mock error handling - just reject with the error
    return Promise.reject(error);
  }
);