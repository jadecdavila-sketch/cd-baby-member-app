import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useTimePicker } from '../use-time-picker';

describe('useTimePicker hook', () => {
  it('initializes with undefined time when no value is provided', () => {
    const { result } = renderHook(() => useTimePicker({}));

    expect(result.current.time).toBeUndefined();
    expect(result.current.hours).toBe("12");
    expect(result.current.minutes).toBe("00");
    expect(result.current.period).toBe("AM");
  });

  it('initializes with the provided initial value', () => {
    // 2:30 PM
    const initialTime = new Date();
    initialTime.setHours(14, 30, 0, 0);

    const { result } = renderHook(() => useTimePicker({ value: initialTime }));

    expect(result.current.time).toBe(initialTime);
    expect(result.current.hours).toBe("02");
    expect(result.current.minutes).toBe("30");
    expect(result.current.period).toBe("PM");
  });

  it('handles 12 AM (midnight) correctly', () => {
    const midnight = new Date();
    midnight.setHours(0, 15, 0, 0);

    const { result } = renderHook(() => useTimePicker({ value: midnight }));

    expect(result.current.hours).toBe("12");
    expect(result.current.minutes).toBe("15");
    expect(result.current.period).toBe("AM");
  });

  it('handles 12 PM (noon) correctly', () => {
    const noon = new Date();
    noon.setHours(12, 45, 0, 0);

    const { result } = renderHook(() => useTimePicker({ value: noon }));

    expect(result.current.hours).toBe("12");
    expect(result.current.minutes).toBe("45");
    expect(result.current.period).toBe("PM");
  });

  it('calls onChange when time components change after initialization', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useTimePicker({ onChange: mockOnChange }));

    // Clear any initial calls
    mockOnChange.mockClear();

    act(() => {
      result.current.setHours("03");
    });

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
    const calledWith = mockOnChange.mock.calls[0]?.[0];
    expect(calledWith).toBeInstanceOf(Date);
    expect(calledWith.getHours()).toBe(3);
    expect(calledWith.getMinutes()).toBe(0);
  });

  it('converts PM hours correctly', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useTimePicker({ onChange: mockOnChange }));

    // Clear any initial calls
    mockOnChange.mockClear();

    act(() => {
      result.current.setHours("05");
    });

    act(() => {
      result.current.setPeriod("PM");
    });

    const calledWith = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1]?.[0];
    expect(calledWith?.getHours()).toBe(17); // 5 PM = 17:00
  });

  it('handles 12 PM to 24-hour conversion correctly', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useTimePicker({ onChange: mockOnChange }));

    // Clear any initial calls
    mockOnChange.mockClear();

    act(() => {
      result.current.setHours("12");
    });

    act(() => {
      result.current.setPeriod("PM");
    });

    const calledWith = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1]?.[0];
    expect(calledWith?.getHours()).toBe(12); // 12 PM = 12:00
  });

  it('handles 12 AM to 24-hour conversion correctly', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useTimePicker({ onChange: mockOnChange }));

    // Clear any initial calls
    mockOnChange.mockClear();

    act(() => {
      result.current.setHours("12");
    });

    act(() => {
      result.current.setPeriod("AM");
    });

    const calledWith = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1]?.[0];
    expect(calledWith?.getHours()).toBe(0); // 12 AM = 00:00
  });

  it('updates minutes correctly', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useTimePicker({ onChange: mockOnChange }));

    // Clear any initial calls
    mockOnChange.mockClear();

    act(() => {
      result.current.setMinutes("45");
    });

    const calledWith = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1]?.[0];
    expect(calledWith?.getMinutes()).toBe(45);
  });

  it('updates internal state when value prop changes', () => {
    const initialTime = new Date();
    initialTime.setHours(9, 30, 0, 0);

    const { result, rerender } = renderHook(
      ({ value }) => useTimePicker({ value }),
      { initialProps: { value: initialTime } }
    );

    expect(result.current.hours).toBe("09");
    expect(result.current.minutes).toBe("30");
    expect(result.current.period).toBe("AM");

    const newTime = new Date();
    newTime.setHours(15, 45, 0, 0);
    rerender({ value: newTime });

    expect(result.current.hours).toBe("03");
    expect(result.current.minutes).toBe("45");
    expect(result.current.period).toBe("PM");
  });

  it('updates internal state when value prop changes to undefined', () => {
    const initialTime = new Date();
    initialTime.setHours(10, 30, 0, 0);

    const { result, rerender } = renderHook(
      ({ value }: { value?: Date | undefined }) => useTimePicker({ value }),
      { initialProps: { value: initialTime } as { value?: Date | undefined } }
    );

    expect(result.current.time).toBe(initialTime);

    rerender({ value: undefined });

    expect(result.current.time).toBeUndefined();
  });

  it('maintains stable handleTimeSelect function reference', () => {
    const mockOnChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useTimePicker({ onChange: mockOnChange })
    );

    const initialHandler = result.current.handleTimeSelect;

    rerender();

    expect(result.current.handleTimeSelect).toBe(initialHandler);
  });

  it('works without onChange callback', () => {
    const { result } = renderHook(() => useTimePicker({}));

    expect(() => {
      act(() => {
        result.current.setHours("05");
      });
    }).not.toThrow();

    expect(result.current.hours).toBe("05");
  });

  it('handles multiple time component changes in sequence', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useTimePicker({ onChange: mockOnChange }));

    // Clear any initial calls
    mockOnChange.mockClear();

    act(() => {
      result.current.setHours("08");
    });

    act(() => {
      result.current.setMinutes("30");
    });

    act(() => {
      result.current.setPeriod("PM");
    });

    // Should have been called multiple times as each component changed
    expect(mockOnChange.mock.calls.length).toBeGreaterThan(0);

    const finalCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1]?.[0];
    expect(finalCall?.getHours()).toBe(20); // 8 PM = 20:00
    expect(finalCall?.getMinutes()).toBe(30);
  });

  it('provides all expected return values', () => {
    const { result } = renderHook(() => useTimePicker({}));

    expect(typeof result.current.time).toBe('undefined'); // Should be undefined when no initial value
    expect(typeof result.current.hours).toBe('string');
    expect(typeof result.current.minutes).toBe('string');
    expect(typeof result.current.period).toBe('string');
    expect(typeof result.current.setHours).toBe('function');
    expect(typeof result.current.setMinutes).toBe('function');
    expect(typeof result.current.setPeriod).toBe('function');
    expect(typeof result.current.handleTimeSelect).toBe('function');
  });

  it('pads single digit hours and minutes with leading zeros', () => {
    const time = new Date();
    time.setHours(9, 5, 0, 0); // 9:05 AM

    const { result } = renderHook(() => useTimePicker({ value: time }));

    expect(result.current.hours).toBe("09");
    expect(result.current.minutes).toBe("05");
  });

  it('handles onChange being undefined gracefully', () => {
    const { result } = renderHook(() => useTimePicker({ onChange: undefined }));

    expect(() => {
      act(() => {
        result.current.setHours("05");
      });
    }).not.toThrow();
  });

  it('handles invalid dates gracefully', () => {
    const invalidDate = new Date('invalid');

    expect(() => {
      renderHook(() => useTimePicker({ value: invalidDate }));
    }).not.toThrow();
  });

  it('does not call onChange during initialization', () => {
    const mockOnChange = vi.fn();
    const initialTime = new Date();
    initialTime.setHours(14, 30, 0, 0);

    renderHook(() => useTimePicker({ value: initialTime, onChange: mockOnChange }));

    // onChange should not be called during initialization
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('only calls onChange after initialization flag is set', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useTimePicker({ onChange: mockOnChange }));

    // Initially, onChange should not have been called during hook setup
    expect(mockOnChange).not.toHaveBeenCalled();

    // But after initialization, changing components should trigger onChange
    act(() => {
      result.current.setHours("05");
    });

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it('maintains function references across re-renders', () => {
    const mockOnChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useTimePicker({ onChange: mockOnChange })
    );

    const initialSetHours = result.current.setHours;
    const initialSetMinutes = result.current.setMinutes;
    const initialSetPeriod = result.current.setPeriod;

    rerender();

    // Function references should be stable due to useCallback
    expect(result.current.setHours).toBe(initialSetHours);
    expect(result.current.setMinutes).toBe(initialSetMinutes);
    expect(result.current.setPeriod).toBe(initialSetPeriod);
  });
});