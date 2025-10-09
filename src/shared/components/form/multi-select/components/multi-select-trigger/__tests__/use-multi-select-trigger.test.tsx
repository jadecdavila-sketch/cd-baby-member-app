import * as React from 'react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useMultiSelectTrigger } from '../use-multi-select-trigger';
import {
  useMultiSelectContext,
  type MultiSelectContextValue,
} from '../../../context';

// Mock the context
vi.mock('../../../context');

describe('useMultiSelectTrigger', () => {
  let mockSetIsOpen: ReturnType<typeof vi.fn>;
  let mockContextValue: MultiSelectContextValue;

  beforeEach(() => {
    mockSetIsOpen = vi.fn();

    mockContextValue = {
      options: [],
      value: [],
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      toggleValue: vi.fn(),
      removeValue: vi.fn(),
      hasValue: vi.fn(),
      canAddMore: true,
      selectedOptions: [],
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
      const { result } = renderHook(() => useMultiSelectTrigger());

      expect(result.current.disabled).toBe(false);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.instanceId).toBe('test-id');
      expect(typeof result.current.handleKeyDown).toBe('function');
    });

    it('reflects context changes', () => {
      const { result, rerender } = renderHook(() => useMultiSelectTrigger());

      expect(result.current.disabled).toBe(false);
      expect(result.current.isOpen).toBe(false);

      // Update context

      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        disabled: true,
        isOpen: true,
      });

      rerender();

      expect(result.current.disabled).toBe(true);
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Keyboard Event Handling', () => {
    describe('Enter Key', () => {
      it('toggles open state when Enter is pressed', () => {
        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockSetIsOpen).toHaveBeenCalledWith(true);
      });

      it('closes dropdown when already open and Enter is pressed', () => {
        vi.mocked(useMultiSelectContext).mockReturnValue({
          ...mockContextValue,
          isOpen: true,
        });

        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      });

      it('does not handle Enter when disabled', () => {
        vi.mocked(useMultiSelectContext).mockReturnValue({
          ...mockContextValue,
          disabled: true,
        });

        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        expect(mockSetIsOpen).not.toHaveBeenCalled();
      });
    });

    describe('Space Key', () => {
      it('toggles open state when Space is pressed', () => {
        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: ' ',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockSetIsOpen).toHaveBeenCalledWith(true);
      });

      it('closes dropdown when already open and Space is pressed', () => {
        vi.mocked(useMultiSelectContext).mockReturnValue({
          ...mockContextValue,
          isOpen: true,
        });

        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: ' ',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      });

      it('does not handle Space when disabled', () => {
        vi.mocked(useMultiSelectContext).mockReturnValue({
          ...mockContextValue,
          disabled: true,
        });

        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: ' ',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        expect(mockSetIsOpen).not.toHaveBeenCalled();
      });
    });

    describe('Escape Key', () => {
      it('closes dropdown when Escape is pressed', () => {
        vi.mocked(useMultiSelectContext).mockReturnValue({
          ...mockContextValue,
          isOpen: true,
        });

        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: 'Escape',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockSetIsOpen).toHaveBeenCalledWith(false);
        // Escape doesn't prevent default for this action
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      });

      it('closes dropdown even when already closed', () => {
        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: 'Escape',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      });

      it('does not handle Escape when disabled', () => {
        vi.mocked(useMultiSelectContext).mockReturnValue({
          ...mockContextValue,
          disabled: true,
        });

        const { result } = renderHook(() => useMultiSelectTrigger());

        const mockEvent = {
          key: 'Escape',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
          result.current.handleKeyDown(mockEvent);
        });

        expect(mockSetIsOpen).not.toHaveBeenCalled();
      });
    });

    describe('Other Keys', () => {
      it('ignores other keys', () => {
        const { result } = renderHook(() => useMultiSelectTrigger());

        const keys = ['ArrowDown', 'ArrowUp', 'Tab', 'a', 'A', '1', 'F1'];

        keys.forEach((key) => {
          const mockEvent = {
            key,
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent;

          act(() => {
            result.current.handleKeyDown(mockEvent);
          });

          expect(mockEvent.preventDefault).not.toHaveBeenCalled();
          expect(mockSetIsOpen).not.toHaveBeenCalled();

          vi.clearAllMocks();
        });
      });
    });
  });

  describe('Callback Stability', () => {
    it('maintains handleKeyDown reference when dependencies do not change', () => {
      const { result, rerender } = renderHook(() => useMultiSelectTrigger());

      const firstHandleKeyDown = result.current.handleKeyDown;

      rerender();

      expect(result.current.handleKeyDown).toBe(firstHandleKeyDown);
    });

    it('updates handleKeyDown when disabled state changes', () => {
      const { result, rerender } = renderHook(() => useMultiSelectTrigger());

      const firstHandleKeyDown = result.current.handleKeyDown;

      // Change disabled state

      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        disabled: true,
      });

      rerender();

      expect(result.current.handleKeyDown).not.toBe(firstHandleKeyDown);
    });

    it('updates handleKeyDown when isOpen state changes', () => {
      const { result, rerender } = renderHook(() => useMultiSelectTrigger());

      const firstHandleKeyDown = result.current.handleKeyDown;

      // Change isOpen state

      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        isOpen: true,
      });

      rerender();

      expect(result.current.handleKeyDown).not.toBe(firstHandleKeyDown);
    });

    it('updates handleKeyDown when setIsOpen function changes', () => {
      const { result, rerender } = renderHook(() => useMultiSelectTrigger());

      const firstHandleKeyDown = result.current.handleKeyDown;

      // Change setIsOpen function
      const newSetIsOpen = vi.fn();

      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        setIsOpen: newSetIsOpen,
      });

      rerender();

      expect(result.current.handleKeyDown).not.toBe(firstHandleKeyDown);
    });
  });

  describe('Integration with Context', () => {
    it('properly extracts values from context', () => {
      const customContextValue: MultiSelectContextValue = {
        ...mockContextValue,
        disabled: true,
        isOpen: true,
        instanceId: 'custom-id',
      };

      vi.mocked(useMultiSelectContext).mockReturnValue(customContextValue);

      const { result } = renderHook(() => useMultiSelectTrigger());

      expect(result.current.disabled).toBe(true);
      expect(result.current.isOpen).toBe(true);
      expect(result.current.instanceId).toBe('custom-id');
    });

    it('handles context updates reactively', () => {
      const { result, rerender } = renderHook(() => useMultiSelectTrigger());

      // Initial state
      expect(result.current.disabled).toBe(false);
      expect(result.current.isOpen).toBe(false);

      // Update context with new values

      vi.mocked(useMultiSelectContext).mockReturnValue({
        ...mockContextValue,
        disabled: true,
        isOpen: true,
        instanceId: 'updated-id',
      });

      rerender();

      expect(result.current.disabled).toBe(true);
      expect(result.current.isOpen).toBe(true);
      expect(result.current.instanceId).toBe('updated-id');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid state changes', () => {
      const { result } = renderHook(() => useMultiSelectTrigger());

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent;

      // Rapid multiple calls
      act(() => {
        result.current.handleKeyDown(mockEvent);
        result.current.handleKeyDown(mockEvent);
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockSetIsOpen).toHaveBeenCalledTimes(3);
      expect(mockSetIsOpen).toHaveBeenNthCalledWith(1, true);
      expect(mockSetIsOpen).toHaveBeenNthCalledWith(2, true);
      expect(mockSetIsOpen).toHaveBeenNthCalledWith(3, true);
    });

    it('handles events with different key cases', () => {
      const { result } = renderHook(() => useMultiSelectTrigger());

      const events = [
        { key: 'enter', preventDefault: vi.fn() }, // lowercase
        { key: 'ENTER', preventDefault: vi.fn() }, // uppercase
        { key: 'escape', preventDefault: vi.fn() }, // lowercase
        { key: 'ESCAPE', preventDefault: vi.fn() }, // uppercase
      ];

      events.forEach((event) => {
        act(() => {
          // @ts-expect-error - minimum event
          result.current.handleKeyDown(event as React.KeyboardEvent);
        });

        // Should not handle these variations (only exact case matches)
        expect(event.preventDefault).not.toHaveBeenCalled();
        vi.clearAllMocks();
      });
    });
  });
});
