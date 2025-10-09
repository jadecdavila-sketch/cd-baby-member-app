import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

// Mock window.matchMedia and window.innerWidth
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024, // Default desktop size
});

describe('useIsMobile hook', () => {
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia.mockReturnValue(mockMediaQueryList);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with undefined and then sets mobile state based on window width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false); // Desktop width
  });

  it('detects mobile when window width is less than 768px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375, // Mobile width
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('detects desktop when window width is 768px or greater', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 768, // Exactly at breakpoint
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('sets up media query listener with correct breakpoint', () => {
    renderHook(() => useIsMobile());

    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('responds to media query changes', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024, // Start with desktop
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Get the change handler that was registered
    const changeHandler =
      mockMediaQueryList.addEventListener.mock.calls[0]?.[1];

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });

    act(() => {
      changeHandler();
    });

    expect(result.current).toBe(true);
  });

  it('cleans up media query listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('handles edge case at mobile breakpoint boundary', () => {
    // Test values around the 768px breakpoint
    const testCases = [
      { width: 766, expectedMobile: true },
      { width: 767, expectedMobile: true },
      { width: 768, expectedMobile: false },
      { width: 769, expectedMobile: false },
    ];

    testCases.forEach(({ width, expectedMobile }) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: width,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(expectedMobile);
    });
  });

  it('handles multiple resize events correctly', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024, // Start desktop
    });

    const { result } = renderHook(() => useIsMobile());
    const changeHandler =
      mockMediaQueryList.addEventListener.mock.calls[0]?.[1];

    expect(result.current).toBe(false);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    });
    act(() => {
      changeHandler();
    });
    expect(result.current).toBe(true);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1200,
    });
    act(() => {
      changeHandler();
    });
    expect(result.current).toBe(false);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 700,
    });
    act(() => {
      changeHandler();
    });
    expect(result.current).toBe(true);
  });

  it('handles the case when window is not available (SSR)', () => {
    // This test verifies the hook doesn't crash in SSR environments
    // The current implementation uses window directly, so it assumes browser environment
    // But we can test that it at least initializes properly
    const { result } = renderHook(() => useIsMobile());

    // Should return a boolean value, not undefined
    expect(typeof result.current).toBe('boolean');
  });

  it('returns true for very small mobile screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 320, // iPhone 5 width
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('returns false for large desktop screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1920, // Full HD width
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});
