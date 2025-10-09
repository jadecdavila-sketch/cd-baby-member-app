import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useDatePicker } from '../use-date-picker';

describe('useDatePicker hook', () => {
  it('initializes with undefined date when no value is provided', () => {
    const { result } = renderHook(() => useDatePicker({}));

    expect(result.current.date).toBeUndefined();
  });

  it('initializes with the provided initial value', () => {
    const initialDate = new Date('2023-12-25');
    const { result } = renderHook(() => useDatePicker({ value: initialDate }));

    expect(result.current.date).toBe(initialDate);
  });

  it('calls onChange when handleDateSelect is invoked', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useDatePicker({ onChange: mockOnChange }));

    const selectedDate = new Date('2023-12-25');

    act(() => {
      result.current.handleDateSelect(selectedDate);
    });

    expect(mockOnChange).toHaveBeenCalledWith(selectedDate);
    expect(result.current.date).toBe(selectedDate);
  });

  it('calls onChange with undefined when handleDateSelect is invoked with undefined', () => {
    const mockOnChange = vi.fn();
    const initialDate = new Date('2023-12-25');
    const { result } = renderHook(() => useDatePicker({
      value: initialDate,
      onChange: mockOnChange
    }));

    act(() => {
      result.current.handleDateSelect(undefined);
    });

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
    expect(result.current.date).toBeUndefined();
  });

  it('updates internal state when value prop changes', () => {
    const initialDate = new Date('2023-12-25');
    const { result, rerender } = renderHook(
      ({ value }) => useDatePicker({ value }),
      { initialProps: { value: initialDate } }
    );

    expect(result.current.date).toBe(initialDate);

    const newDate = new Date('2024-01-01');
    rerender({ value: newDate });

    expect(result.current.date).toBe(newDate);
  });

  it('updates internal state when value prop changes to undefined', () => {
    const initialDate = new Date('2023-12-25');
    const { result, rerender } = renderHook(
      ({ value }: { value?: Date | undefined }) => useDatePicker({ value }),
      { initialProps: { value: initialDate } as { value?: Date | undefined } }
    );

    expect(result.current.date).toBe(initialDate);

    rerender({ value: undefined });

    expect(result.current.date).toBeUndefined();
  });

  it('does not call onChange when value prop changes externally', () => {
    const mockOnChange = vi.fn();
    const initialDate = new Date('2023-12-25');
    const { rerender } = renderHook(
      ({ value }) => useDatePicker({ value, onChange: mockOnChange }),
      { initialProps: { value: initialDate } }
    );

    const newDate = new Date('2024-01-01');
    rerender({ value: newDate });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('maintains stable handleDateSelect function reference', () => {
    const mockOnChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useDatePicker({ onChange: mockOnChange })
    );

    const initialHandler = result.current.handleDateSelect;

    rerender();

    expect(result.current.handleDateSelect).toBe(initialHandler);
  });

  it('works without onChange callback', () => {
    const { result } = renderHook(() => useDatePicker({}));

    const selectedDate = new Date('2023-12-25');

    expect(() => {
      act(() => {
        result.current.handleDateSelect(selectedDate);
      });
    }).not.toThrow();

    expect(result.current.date).toBe(selectedDate);
  });

  it('handles multiple date selections in sequence', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() => useDatePicker({ onChange: mockOnChange }));

    const firstDate = new Date('2023-12-25');
    const secondDate = new Date('2024-01-01');

    act(() => {
      result.current.handleDateSelect(firstDate);
    });

    expect(result.current.date).toBe(firstDate);
    expect(mockOnChange).toHaveBeenCalledWith(firstDate);

    act(() => {
      result.current.handleDateSelect(secondDate);
    });

    expect(result.current.date).toBe(secondDate);
    expect(mockOnChange).toHaveBeenCalledWith(secondDate);

    act(() => {
      result.current.handleDateSelect(undefined);
    });

    expect(result.current.date).toBeUndefined();
    expect(mockOnChange).toHaveBeenCalledWith(undefined);

    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });

  it('provides expected return values', () => {
    const { result } = renderHook(() => useDatePicker({}));

    expect(result.current).toHaveProperty('date');
    expect(result.current).toHaveProperty('handleDateSelect');
    expect(typeof result.current.handleDateSelect).toBe('function');
  });

  it('handles invalid dates gracefully', () => {
    const invalidDate = new Date('invalid');

    expect(() => {
      renderHook(() => useDatePicker({ value: invalidDate }));
    }).not.toThrow();
  });

  it('maintains function stability on re-renders with same onChange', () => {
    const mockOnChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useDatePicker({ onChange: mockOnChange })
    );

    const firstHandler = result.current.handleDateSelect;

    // Re-render with same onChange function
    rerender();

    expect(result.current.handleDateSelect).toBe(firstHandler);
  });

  it('updates function reference when onChange changes', () => {
    const mockOnChange1 = vi.fn();
    const mockOnChange2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ onChange }) => useDatePicker({ onChange }),
      { initialProps: { onChange: mockOnChange1 } }
    );

    const firstHandler = result.current.handleDateSelect;

    // Re-render with different onChange function
    rerender({ onChange: mockOnChange2 });

    expect(result.current.handleDateSelect).not.toBe(firstHandler);
  });
});