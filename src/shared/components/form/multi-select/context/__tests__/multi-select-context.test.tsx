import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  MultiSelectContext,
  useMultiSelectContext,
  type MultiSelectContextValue,
} from '../multi-select-context';
import { SelectOption } from '@/shared/types';

describe('MultiSelectContext', () => {
  const mockContextValue: MultiSelectContextValue = {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
    value: ['option1'],
    isOpen: false,
    setIsOpen: vi.fn(),
    toggleValue: vi.fn(),
    removeValue: vi.fn(),
    hasValue: vi.fn(),
    canAddMore: true,
    selectedOptions: [{ value: 'option1', label: 'Option 1' }],
    placeholder: 'Select options...',
    disabled: false,
    instanceId: 'test-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider Functionality', () => {
    it('provides context values to children', () => {
      const TestComponent = () => {
        const context = useMultiSelectContext();
        return (
          <div data-testid="context-consumer">
            <span data-testid="options-count">{context.options.length}</span>
            <span data-testid="value-count">{context.value.length}</span>
            <span data-testid="is-open">{context.isOpen.toString()}</span>
            <span data-testid="can-add-more">
              {context.canAddMore.toString()}
            </span>
            <span data-testid="placeholder">{context.placeholder}</span>
            <span data-testid="disabled">{context.disabled?.toString()}</span>
            <span data-testid="instance-id">{context.instanceId}</span>
          </div>
        );
      };

      render(
        <MultiSelectContext.Provider value={mockContextValue}>
          <TestComponent />
        </MultiSelectContext.Provider>
      );

      expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
      expect(screen.getByTestId('options-count')).toHaveTextContent('2');
      expect(screen.getByTestId('value-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-open')).toHaveTextContent('false');
      expect(screen.getByTestId('can-add-more')).toHaveTextContent('true');
      expect(screen.getByTestId('placeholder')).toHaveTextContent(
        'Select options...'
      );
      expect(screen.getByTestId('disabled')).toHaveTextContent('false');
      expect(screen.getByTestId('instance-id')).toHaveTextContent('test-id');
    });

    it('throws error when used outside provider', () => {
      const TestComponent = () => {
        useMultiSelectContext();
        return <div>Should not render</div>;
      };

      // Capture console.error to prevent test output noise
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'MultiSelect components must be used within a MultiSelect'
      );

      consoleSpy.mockRestore();
    });

    it('updates context when values change', () => {
      const TestComponent = () => {
        const context = useMultiSelectContext();
        return (
          <div data-testid="context-consumer">
            <span data-testid="value">{JSON.stringify(context.value)}</span>
            <span data-testid="is-open">{context.isOpen.toString()}</span>
          </div>
        );
      };

      const { rerender } = render(
        <MultiSelectContext.Provider value={mockContextValue}>
          <TestComponent />
        </MultiSelectContext.Provider>
      );

      expect(screen.getByTestId('value')).toHaveTextContent('["option1"]');
      expect(screen.getByTestId('is-open')).toHaveTextContent('false');

      const updatedContextValue = {
        ...mockContextValue,
        value: ['option1', 'option2'],
        isOpen: true,
      };

      rerender(
        <MultiSelectContext.Provider value={updatedContextValue}>
          <TestComponent />
        </MultiSelectContext.Provider>
      );

      expect(screen.getByTestId('value')).toHaveTextContent(
        '["option1","option2"]'
      );
      expect(screen.getByTestId('is-open')).toHaveTextContent('true');
    });

    it('provides function methods correctly', () => {
      const TestComponent = () => {
        const context = useMultiSelectContext();

        React.useEffect(() => {
          // Test that functions can be called
          context.setIsOpen(true);
          context.toggleValue('option1');
          context.removeValue('option1');
          context.hasValue('option1');
        }, [context]);

        return <div data-testid="context-consumer">Functions available</div>;
      };

      render(
        <MultiSelectContext.Provider value={mockContextValue}>
          <TestComponent />
        </MultiSelectContext.Provider>
      );

      expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
      expect(mockContextValue.setIsOpen).toHaveBeenCalledWith(true);
      expect(mockContextValue.toggleValue).toHaveBeenCalledWith('option1');
      expect(mockContextValue.removeValue).toHaveBeenCalledWith('option1');
      expect(mockContextValue.hasValue).toHaveBeenCalledWith('option1');
    });
  });

  describe('Hook Integration', () => {
    it('useMultiSelectContext returns correct values', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MultiSelectContext.Provider value={mockContextValue}>
          {children}
        </MultiSelectContext.Provider>
      );

      const { result } = renderHook(() => useMultiSelectContext(), { wrapper });

      expect(result.current.options).toEqual(mockContextValue.options);
      expect(result.current.value).toEqual(mockContextValue.value);
      expect(result.current.isOpen).toBe(mockContextValue.isOpen);
      expect(result.current.canAddMore).toBe(mockContextValue.canAddMore);
      expect(result.current.selectedOptions).toEqual(
        mockContextValue.selectedOptions
      );
      expect(result.current.placeholder).toBe(mockContextValue.placeholder);
      expect(result.current.disabled).toBe(mockContextValue.disabled);
      expect(result.current.instanceId).toBe(mockContextValue.instanceId);
    });

    it('useMultiSelectContext returns correct function references', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MultiSelectContext.Provider value={mockContextValue}>
          {children}
        </MultiSelectContext.Provider>
      );

      const { result } = renderHook(() => useMultiSelectContext(), { wrapper });

      expect(result.current.setIsOpen).toBe(mockContextValue.setIsOpen);
      expect(result.current.toggleValue).toBe(mockContextValue.toggleValue);
      expect(result.current.removeValue).toBe(mockContextValue.removeValue);
      expect(result.current.hasValue).toBe(mockContextValue.hasValue);
    });

    it('context updates propagate to consumers', () => {
      let currentContextValue = mockContextValue;

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MultiSelectContext.Provider value={currentContextValue}>
          {children}
        </MultiSelectContext.Provider>
      );

      const { result, rerender } = renderHook(() => useMultiSelectContext(), {
        wrapper,
      });

      expect(result.current.value).toEqual(['option1']);
      expect(result.current.isOpen).toBe(false);

      currentContextValue = {
        ...mockContextValue,
        value: ['option1', 'option2'],
        isOpen: true,
      };

      rerender();

      expect(result.current.value).toEqual(['option1', 'option2']);
      expect(result.current.isOpen).toBe(true);
    });

    it('handles TypeScript generic types correctly', () => {
      type CustomOption = {
        category: string;
      };

      const customContextValue: MultiSelectContextValue<CustomOption> = {
        ...mockContextValue,
        options: [
          {
            value: 'option1',
            label: 'Option 1',
            meta: { category: 'Category A' },
          },
          {
            value: 'option2',
            label: 'Option 2',
            meta: { category: 'Category B' },
          },
        ],
        selectedOptions: [
          {
            value: 'option1',
            label: 'Option 1',
            meta: { category: 'Category A' },
          },
        ],
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MultiSelectContext.Provider value={customContextValue}>
          {children}
        </MultiSelectContext.Provider>
      );

      const { result } = renderHook(
        () => useMultiSelectContext<CustomOption>(),
        { wrapper }
      );

      expect(result.current.options[0]?.meta?.category).toBe('Category A');
      expect(result.current.selectedOptions[0]?.meta?.category).toBe(
        'Category A'
      );
    });
  });

  describe('Error Handling', () => {
    it('throws specific error message when context is null', () => {
      const TestComponent = () => {
        useMultiSelectContext();
        return null;
      };

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'MultiSelect components must be used within a MultiSelect'
      );

      consoleSpy.mockRestore();
    });

    it('throws error when context provider value is null', () => {
      const TestComponent = () => {
        useMultiSelectContext();
        return null;
      };

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <MultiSelectContext.Provider value={null}>
            <TestComponent />
          </MultiSelectContext.Provider>
        )
      ).toThrow('MultiSelect components must be used within a MultiSelect');

      consoleSpy.mockRestore();
    });
  });

  describe('Context Value Completeness', () => {
    it('provides all required context properties', () => {
      const TestComponent = () => {
        const context = useMultiSelectContext();

        // Test that all expected properties exist
        const requiredProps = [
          'options',
          'value',
          'isOpen',
          'setIsOpen',
          'toggleValue',
          'removeValue',
          'hasValue',
          'canAddMore',
          'selectedOptions',
          'instanceId',
        ];

        const optionalProps = ['placeholder', 'disabled'];

        requiredProps.forEach((prop) => {
          expect(context).toHaveProperty(prop);
        });

        optionalProps.forEach((prop) => {
          expect(context).toHaveProperty(prop);
        });

        return <div data-testid="complete">All properties available</div>;
      };

      render(
        <MultiSelectContext.Provider value={mockContextValue}>
          <TestComponent />
        </MultiSelectContext.Provider>
      );

      expect(screen.getByTestId('complete')).toBeInTheDocument();
    });

    it('handles optional properties correctly', () => {
      const contextWithoutOptionals: MultiSelectContextValue = {
        options: mockContextValue.options,
        value: mockContextValue.value,
        isOpen: mockContextValue.isOpen,
        setIsOpen: mockContextValue.setIsOpen,
        toggleValue: mockContextValue.toggleValue,
        removeValue: mockContextValue.removeValue,
        hasValue: mockContextValue.hasValue,
        canAddMore: mockContextValue.canAddMore,
        selectedOptions: mockContextValue.selectedOptions,
        instanceId: mockContextValue.instanceId,
        // placeholder and disabled are undefined
      };

      const TestComponent = () => {
        const context = useMultiSelectContext();
        return (
          <div data-testid="context-consumer">
            <span data-testid="placeholder">
              {context.placeholder || 'undefined'}
            </span>
            <span data-testid="disabled">
              {String(context.disabled || false)}
            </span>
          </div>
        );
      };

      render(
        <MultiSelectContext.Provider value={contextWithoutOptionals}>
          <TestComponent />
        </MultiSelectContext.Provider>
      );

      expect(screen.getByTestId('placeholder')).toHaveTextContent('undefined');
      expect(screen.getByTestId('disabled')).toHaveTextContent('false');
    });
  });
});
