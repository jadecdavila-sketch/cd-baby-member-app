import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useMultiSelectValue } from '../use-multi-select-value';
import {
  useMultiSelectContext,
  type MultiSelectContextValue,
} from '../../../context';

// Mock the context
vi.mock('../../../context');

describe('useMultiSelectValue', () => {
  let mockRemoveValue: ReturnType<typeof vi.fn>;
  let mockContextValue: MultiSelectContextValue;

  beforeEach(() => {
    mockRemoveValue = vi.fn();

    mockContextValue = {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
      value: ['option1'],
      isOpen: false,
      setIsOpen: vi.fn(),
      toggleValue: vi.fn(),
      removeValue: mockRemoveValue,
      hasValue: vi.fn(),
      canAddMore: true,
      selectedOptions: [{ value: 'option1', label: 'Option 1' }],
      placeholder: 'Select options...',
      disabled: false,
      instanceId: 'test-id',
    };

    vi.mocked(useMultiSelectContext).mockReturnValue(mockContextValue);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('returns context values correctly', () => {
      const { result } = renderHook(() => useMultiSelectValue());

      expect(result.current.selectedOptions).toEqual([
        { value: 'option1', label: 'Option 1' },
      ]);
      expect(result.current.placeholder).toBe('Select options...');
      expect(result.current.removeValue).toBe(mockRemoveValue);
      expect(result.current.contentRef).toBeDefined();
      expect(result.current.contentRef.current).toBeNull(); // Initially null
    });

    it('reflects context changes', () => {
      const { result, rerender } = renderHook(() => useMultiSelectValue());

      expect(result.current.selectedOptions).toHaveLength(1);
      expect(result.current.placeholder).toBe('Select options...');

      // Update context

      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        selectedOptions: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        placeholder: 'Updated placeholder',
      });

      rerender();

      expect(result.current.selectedOptions).toHaveLength(2);
      expect(result.current.placeholder).toBe('Updated placeholder');
    });

    it('provides removeValue function from context', () => {
      const { result } = renderHook(() => useMultiSelectValue());

      act(() => {
        result.current.removeValue('option1');
      });

      expect(mockRemoveValue).toHaveBeenCalledWith('option1');
    });
  });

  describe('Ref Management', () => {
    it('creates a ref for content element', () => {
      const { result } = renderHook(() => useMultiSelectValue());

      expect(result.current.contentRef).toBeDefined();
      expect(typeof result.current.contentRef).toBe('object');
      expect(result.current.contentRef.current).toBeNull();
    });

    it('maintains stable ref reference across rerenders', () => {
      const { result, rerender } = renderHook(() => useMultiSelectValue());

      const firstRef = result.current.contentRef;

      rerender();

      expect(result.current.contentRef).toBe(firstRef);
    });
  });

  describe('Wheel Event Handling', () => {
    let mockElement: HTMLDivElement;
    let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
    let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
    let reactUseRefSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      mockElement = document.createElement('div');
      addEventListenerSpy = vi.spyOn(mockElement, 'addEventListener');
      removeEventListenerSpy = vi.spyOn(mockElement, 'removeEventListener');
      reactUseRefSpy = vi
        .spyOn(React, 'useRef')
        .mockReturnValue({ current: mockElement });
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
      reactUseRefSpy.mockRestore();
    });

    it('adds wheel event listener when ref is set', () => {
      const { result, rerender } = renderHook(() => useMultiSelectValue());

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'wheel',
        expect.any(Function),
        { passive: false }
      );
    });

    it('removes wheel event listener on cleanup', () => {
      const { result, unmount } = renderHook(() => useMultiSelectValue());

      act(() => {
        result.current.contentRef.current = mockElement;
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'wheel',
        expect.any(Function)
      );
    });

    it('handles wheel events to convert vertical scroll to horizontal', () => {
      const { result } = renderHook(() => useMultiSelectValue());

      act(() => {
        result.current.contentRef.current = mockElement;
      });

      // Get the wheel event handler
      const wheelHandler = addEventListenerSpy.mock
        .calls[0]?.[1] as EventListener;

      // Mock scrollLeft property
      Object.defineProperty(mockElement, 'scrollLeft', {
        value: 0,
        writable: true,
      });

      // Create mock wheel event
      const mockWheelEvent = new WheelEvent('wheel', {
        deltaY: 100,
        deltaX: 0,
      });

      const preventDefaultSpy = vi.spyOn(mockWheelEvent, 'preventDefault');

      // Trigger the wheel event
      act(() => {
        wheelHandler(mockWheelEvent);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(mockElement.scrollLeft).toBe(100);
    });

    it('ignores wheel events with no deltaY', () => {
      const { result } = renderHook(() => useMultiSelectValue());

      act(() => {
        result.current.contentRef.current = mockElement;
      });

      const wheelHandler = addEventListenerSpy.mock
        .calls[0]?.[1] as EventListener;

      Object.defineProperty(mockElement, 'scrollLeft', {
        value: 0,
        writable: true,
      });

      const mockWheelEvent = new WheelEvent('wheel', {
        deltaY: 0,
        deltaX: 50,
      });

      const preventDefaultSpy = vi.spyOn(mockWheelEvent, 'preventDefault');

      act(() => {
        wheelHandler(mockWheelEvent);
      });

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(mockElement.scrollLeft).toBe(0);
    });

    it('handles negative deltaY values', () => {
      const { result } = renderHook(() => useMultiSelectValue());

      act(() => {
        result.current.contentRef.current = mockElement;
      });

      const wheelHandler = addEventListenerSpy.mock
        .calls[0]?.[1] as EventListener;

      Object.defineProperty(mockElement, 'scrollLeft', {
        value: 100,
        writable: true,
      });

      const mockWheelEvent = new WheelEvent('wheel', {
        deltaY: -50,
      });

      act(() => {
        wheelHandler(mockWheelEvent);
      });

      expect(mockElement.scrollLeft).toBe(50);
    });

    it('does not add event listener when ref is null', () => {
      reactUseRefSpy = vi
        .spyOn(React, 'useRef')
        .mockReturnValue({ current: null });
      const { result } = renderHook(() => useMultiSelectValue());

      // Ensure ref is null
      expect(result.current.contentRef.current).toBeNull();

      // No event listener should be added
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('handles multiple wheel events in succession', () => {
      const { result, rerender } = renderHook(() => useMultiSelectValue());

      act(() => {
        result.current.contentRef.current = mockElement;
      });

      // Trigger the effect by rerendering
      rerender();

      const wheelHandler = addEventListenerSpy.mock
        .calls[0]?.[1] as EventListener;

      Object.defineProperty(mockElement, 'scrollLeft', {
        value: 0,
        writable: true,
      });

      // Multiple wheel events
      const events = [
        new WheelEvent('wheel', { deltaY: 10 }),
        new WheelEvent('wheel', { deltaY: 20 }),
        new WheelEvent('wheel', { deltaY: -5 }),
      ];

      events.forEach((event) => {
        act(() => {
          wheelHandler(event);
        });
      });

      expect(mockElement.scrollLeft).toBe(25); // 0 + 10 + 20 - 5
    });

    it('handles rapid ref changes', () => {
      const { result, rerender } = renderHook(() => useMultiSelectValue());

      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ];

      // Rapidly change refs
      elements.forEach((element) => {
        act(() => {
          result.current.contentRef.current = element;
        });
        rerender();
      });

      // Should not throw errors
      expect(result.current.contentRef.current).toBe(elements[2]);
    });
  });

  describe('Integration with Context', () => {
    it('properly extracts values from context', () => {
      const customSelectedOptions = [
        { value: 'custom1', label: 'Custom 1' },
        { value: 'custom2', label: 'Custom 2' },
      ];

      const customContextValue: MultiSelectContextValue = {
        ...mockContextValue,
        selectedOptions: customSelectedOptions,
        placeholder: 'Custom placeholder',
        removeValue: mockRemoveValue,
      };

      vi.mocked(useMultiSelectContext).mockReturnValue(customContextValue);

      const { result } = renderHook(() => useMultiSelectValue());

      expect(result.current.selectedOptions).toEqual(customSelectedOptions);
      expect(result.current.placeholder).toBe('Custom placeholder');
      expect(result.current.removeValue).toBe(mockRemoveValue);
    });

    it('handles context updates reactively', () => {
      const { result, rerender } = renderHook(() => useMultiSelectValue());

      expect(result.current.selectedOptions).toHaveLength(1);

      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        selectedOptions: [],
        placeholder: 'No selections',
      });

      rerender();

      expect(result.current.selectedOptions).toHaveLength(0);
      expect(result.current.placeholder).toBe('No selections');
    });

    it('handles undefined placeholder correctly', () => {
      const contextWithoutPlaceholder = {
        ...mockContextValue,
      };
      // Remove the placeholder property to make it undefined
      delete (contextWithoutPlaceholder as any).placeholder;

      vi.mocked(useMultiSelectContext).mockReturnValue(
        contextWithoutPlaceholder
      );

      const { result } = renderHook(() => useMultiSelectValue());

      expect(result.current.placeholder).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty selectedOptions array', () => {
      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        selectedOptions: [],
      });

      const { result } = renderHook(() => useMultiSelectValue());

      expect(result.current.selectedOptions).toEqual([]);
    });
  });

  describe('TypeScript Support', () => {
    it('handles custom option types correctly', () => {
      interface CustomOption {
        value: string;
        label: string;
        category: string;
      }

      const customOptions: CustomOption[] = [
        { value: 'opt1', label: 'Option 1', category: 'A' },
      ];

      const customContextValue = {
        ...mockContextValue,
        selectedOptions: customOptions,
      };

      vi.mocked(useMultiSelectContext).mockReturnValue(customContextValue);

      const { result } = renderHook(() => useMultiSelectValue());

      expect(result.current.selectedOptions).toHaveLength(1);
      const firstOption = result.current.selectedOptions[0] as CustomOption;
      expect(firstOption).toHaveProperty('category');
      expect(firstOption.category).toBe('A');
    });
  });
});
