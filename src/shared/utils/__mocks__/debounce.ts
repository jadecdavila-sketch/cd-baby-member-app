import { vi } from 'vitest';

/**
 * Mock implementation of the debounce utility function
 * Provides synchronous execution for predictable testing
 */
export const debounce = vi.fn((fn) => {
  fn();
});
