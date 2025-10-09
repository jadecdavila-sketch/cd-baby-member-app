import { renderHook, act } from '@testing-library/react';
import { useBoolean } from '../use-boolean';

describe('useBoolean hook', () => {
  it('initializes with the provided initial value (true)', () => {
    const { result } = renderHook(() => useBoolean(true));

    expect(result.current[0]).toBe(true);
  });

  it('initializes with the provided initial value (false)', () => {
    const { result } = renderHook(() => useBoolean(false));

    expect(result.current[0]).toBe(false);
  });

  it('provides setTrue function that sets value to true', () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current[1](); // setTrue
    });

    expect(result.current[0]).toBe(true);
  });

  it('provides setFalse function that sets value to false', () => {
    const { result } = renderHook(() => useBoolean(true));

    act(() => {
      result.current[2](); // setFalse
    });

    expect(result.current[0]).toBe(false);
  });

  it('provides setToggle function that toggles the value', () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current[3](); // setToggle
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[3](); // setToggle
    });

    expect(result.current[0]).toBe(false);
  });

  it('provides setValue function that sets specific boolean value', () => {
    const { result } = renderHook(() => useBoolean(false));

    act(() => {
      result.current[4](true); // setValue
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[4](false); // setValue
    });

    expect(result.current[0]).toBe(false);
  });

  it('returns stable function references on re-renders', () => {
    const { result, rerender } = renderHook(() => useBoolean(false));
    const initialFunctions = [
      result.current[1], // setTrue
      result.current[2], // setFalse
      result.current[3], // setToggle
      result.current[4], // setValue
    ];

    rerender();

    expect(result.current[1]).toBe(initialFunctions[0]); // setTrue
    expect(result.current[2]).toBe(initialFunctions[1]); // setFalse
    expect(result.current[3]).toBe(initialFunctions[2]); // setToggle
    expect(result.current[4]).toBe(initialFunctions[3]); // setValue
  });

  it('returns array with correct structure and types', () => {
    const { result } = renderHook(() => useBoolean(true));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(5);

    expect(typeof result.current[0]).toBe('boolean'); // value
    expect(typeof result.current[1]).toBe('function'); // setTrue
    expect(typeof result.current[2]).toBe('function'); // setFalse
    expect(typeof result.current[3]).toBe('function'); // setToggle
    expect(typeof result.current[4]).toBe('function'); // setValue
  });

  it('handles multiple operations in sequence', () => {
    const { result } = renderHook(() => useBoolean(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](); // setTrue
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[3](); // setToggle
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[4](true); // setValue(true)
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[2](); // setFalse
    });
    expect(result.current[0]).toBe(false);
  });

  it('works correctly when starting with true and performing operations', () => {
    const { result } = renderHook(() => useBoolean(true));

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](); // setTrue (should remain true)
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[3](); // setToggle
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[3](); // setToggle back
    });
    expect(result.current[0]).toBe(true);
  });
});
