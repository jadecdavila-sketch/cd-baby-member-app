import { vi } from 'vitest';

/**
 * Mock implementation of the useIsMobile hook
 * Provides predictable mobile detection for testing
 */
export const useIsMobile = vi.fn().mockReturnValue(false); // Default to desktop for most tests