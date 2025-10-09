import { vi } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';

/**
 * Mock implementation of the request interceptor
 * Provides predictable token injection behavior for testing
 */
export const requestInterceptor = vi.fn().mockImplementation(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    // Simple mock that adds a mock token
    if (!config.headers) {
      config.headers = {} as any;
    }
    config.headers.Authorization = 'Bearer MOCK_TOKEN';
    return config;
  }
);