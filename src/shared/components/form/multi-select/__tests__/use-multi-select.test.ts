import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useMultiSelect } from '../use-multi-select';

import type { UseMultiSelectOptions } from '../types';

describe('useMultiSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  let mockOnValueChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnValueChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('initializes with provided value', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1'],
        options: mockOptions,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.value).toEqual(['option1']);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.canAddMore).toBe(true);
    });

    it('initializes with empty value', () => {
      const options: UseMultiSelectOptions = {
        value: [],
        options: mockOptions,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.value).toEqual([]);
      expect(result.current.selectedOptions).toEqual([]);
    });
  });

  describe('Core Methods', () => {
    it('toggleValue adds new item', () => {
      const options: UseMultiSelectOptions = {
        value: [],
        options: mockOptions,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.toggleValue('option1');
      });

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
    });

    it('toggleValue removes existing item', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1'],
        options: mockOptions,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.toggleValue('option1');
      });

      expect(mockOnValueChange).toHaveBeenCalledWith([]);
    });

    it('addValue adds new item when not present', () => {
      const options: UseMultiSelectOptions = {
        value: [],
        options: mockOptions,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.addValue('option1');
      });

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
    });

    it('addValue does not add duplicate items', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1'],
        options: mockOptions,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.addValue('option1');
      });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('removeValue removes existing item', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1', 'option2'],
        options: mockOptions,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.removeValue('option1');
      });

      expect(mockOnValueChange).toHaveBeenCalledWith(['option2']);
    });

    it('clearAll empties selection', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1', 'option2'],
        options: mockOptions,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.clearAll();
      });

      expect(mockOnValueChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Utility Methods', () => {
    it('hasValue returns correct boolean', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1'],
        options: mockOptions,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.hasValue('option1')).toBe(true);
      expect(result.current.hasValue('option2')).toBe(false);
    });

    it('selectedOptions returns correct filtered options', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1', 'option3'],
        options: mockOptions,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.selectedOptions).toEqual([
        { value: 'option1', label: 'Option 1' },
        { value: 'option3', label: 'Option 3' },
      ]);
    });
  });

  describe('Max Selections', () => {
    it('canAddMore returns false when at limit', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1', 'option2'],
        options: mockOptions,
        maxSelections: 2,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.canAddMore).toBe(false);
    });

    it('canAddMore returns true when under limit', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1'],
        options: mockOptions,
        maxSelections: 2,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.canAddMore).toBe(true);
    });

    it('addValue respects maxSelections limit', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1'],
        options: mockOptions,
        maxSelections: 1,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.addValue('option2');
      });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('toggleValue respects maxSelections when adding', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1', 'option2'],
        options: mockOptions,
        maxSelections: 2,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.toggleValue('option3');
      });

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1', 'option2']);
    });

    it('toggleValue allows removing when at limit', () => {
      const options: UseMultiSelectOptions = {
        value: ['option1', 'option2'],
        options: mockOptions,
        maxSelections: 2,
        onChange: mockOnValueChange,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      act(() => {
        result.current.toggleValue('option1');
      });

      expect(mockOnValueChange).toHaveBeenCalledWith(['option2']);
    });
  });

  describe('State Management', () => {
    it('manages isOpen state correctly', () => {
      const options: UseMultiSelectOptions = {
        value: [],
        options: mockOptions,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      const options: UseMultiSelectOptions = {
        value: [],
        options: [],
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.selectedOptions).toEqual([]);
      expect(result.current.canAddMore).toBe(true);
    });

    it('handles maxSelections of 0', () => {
      const options: UseMultiSelectOptions = {
        value: [],
        options: mockOptions,
        maxSelections: 0,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(result.current.canAddMore).toBe(false);
    });

    it('handles undefined onChange', () => {
      const options: UseMultiSelectOptions = {
        value: [],
        options: mockOptions,
      };

      const { result } = renderHook(() => useMultiSelect(options));

      expect(() => {
        act(() => {
          result.current.addValue('option1');
        });
      }).not.toThrow();
    });
  });
});
