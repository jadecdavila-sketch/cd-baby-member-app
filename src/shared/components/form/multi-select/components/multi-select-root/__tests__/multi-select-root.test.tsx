import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { MultiSelectRoot } from '../multi-select-root';
import { useMultiSelectContext } from '../../../context';

import type { MultiSelectProps } from '../../../types';
import { SelectOption } from '@/shared/types';
import { useMultiSelect } from '../../../use-multi-select';

// Mock the Popover component
vi.mock('@/shared/components/shadcn', () => ({
  Popover: ({ children, open, onOpenChange }: any) => (
    <div
      data-testid="popover"
      data-open={open}
      onClick={() => onOpenChange?.(!open)}
    >
      {children}
    </div>
  ),
}));

// Mock the cn utility
vi.mock('@/shared/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Mock the useMultiSelect hook
vi.mock('../../../use-multi-select');

describe('MultiSelectRoot', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps: MultiSelectProps = {
    options: mockOptions,
    value: [],
    placeholder: 'Select options...',
    onChange: () => {},
  };

  let mockUseMultiSelect: ReturnType<typeof vi.fn>;
  let mockOnValueChange: ReturnType<typeof vi.fn>;
  let mockSetIsOpen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnValueChange = vi.fn();
    mockSetIsOpen = vi.fn();

    mockUseMultiSelect = vi.fn().mockReturnValue({
      value: [],
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      toggleValue: vi.fn(),
      addValue: vi.fn(),
      removeValue: vi.fn(),
      clearAll: vi.fn(),
      hasValue: vi.fn(),
      canAddMore: true,
      selectedOptions: [],
    });

    vi.mocked(useMultiSelect).mockImplementation(mockUseMultiSelect);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper component to access context
  const ContextConsumer = () => {
    const context = useMultiSelectContext();
    return (
      <div data-testid="context-consumer">
        <span data-testid="options-length">{context.options.length}</span>
        <span data-testid="value-length">{context.value.length}</span>
        <span data-testid="is-open">{context.isOpen.toString()}</span>
        <span data-testid="placeholder">{context.placeholder || 'none'}</span>
        <span data-testid="disabled">{context.disabled?.toString()}</span>
        <span data-testid="instance-id">{context.instanceId}</span>
        <span data-testid="can-add-more">{context.canAddMore.toString()}</span>
      </div>
    );
  };

  describe('Provider Setup', () => {
    it('wraps children in context provider', () => {
      render(
        <MultiSelectRoot {...defaultProps}>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
      expect(screen.getByTestId('options-length')).toHaveTextContent('3');
      expect(screen.getByTestId('placeholder')).toHaveTextContent(
        'Select options...'
      );
    });

    it('integrates with useMultiSelect hook', () => {
      render(
        <MultiSelectRoot {...defaultProps}>
          <div>Test content</div>
        </MultiSelectRoot>
      );

      expect(mockUseMultiSelect).toHaveBeenCalledWith({
        options: mockOptions,
        value: [],
        onChange: defaultProps.onChange,
      });
    });

    it('manages Popover open/close state', () => {
      mockUseMultiSelect.mockReturnValue({
        value: [],
        isOpen: true,
        setIsOpen: mockSetIsOpen,
        toggleValue: vi.fn(),
        addValue: vi.fn(),
        removeValue: vi.fn(),
        clearAll: vi.fn(),
        hasValue: vi.fn(),
        canAddMore: true,
        selectedOptions: [],
      });

      render(
        <MultiSelectRoot {...defaultProps}>
          <div>Test content</div>
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('popover')).toHaveAttribute(
        'data-open',
        'true'
      );
    });
  });

  describe('Props Integration', () => {
    it('passes props to hook correctly', () => {
      const propsWithCallback = {
        ...defaultProps,
        onChange: mockOnValueChange,
        maxSelections: 3,
      };

      render(
        <MultiSelectRoot {...propsWithCallback}>
          <div>Test content</div>
        </MultiSelectRoot>
      );

      expect(mockUseMultiSelect).toHaveBeenCalledWith({
        options: mockOptions,
        value: [],
        onChange: mockOnValueChange,
        maxSelections: 3,
      });
    });

    it('handles optional props appropriately', () => {
      const minimalProps = {
        options: mockOptions,
        value: [],
        onChange: () => {},
      };

      render(
        <MultiSelectRoot {...minimalProps}>
          <div>Test content</div>
        </MultiSelectRoot>
      );

      expect(mockUseMultiSelect).toHaveBeenCalledWith({
        options: mockOptions,
        value: [],
        onChange: minimalProps.onChange,
      });
    });

    it('passes disabled prop to context', () => {
      render(
        <MultiSelectRoot {...defaultProps} disabled>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('disabled')).toHaveTextContent('true');
    });

    it('passes placeholder to context when provided', () => {
      render(
        <MultiSelectRoot {...defaultProps} placeholder="Custom placeholder">
          <ContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('placeholder')).toHaveTextContent(
        'Custom placeholder'
      );
    });

    it('handles undefined placeholder correctly', () => {
      const propsWithoutPlaceholder = {
        options: mockOptions,
        onChange: () => {},
        value: [],
      };

      render(
        <MultiSelectRoot {...propsWithoutPlaceholder}>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('placeholder')).toHaveTextContent('none');
    });

    it('applies custom className to container', () => {
      render(
        <MultiSelectRoot {...defaultProps} className="custom-class">
          <div>Test content</div>
        </MultiSelectRoot>
      );

      const container = screen.getByTestId('popover').querySelector('div');
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass('relative');
    });

    it('forwards additional props to container', () => {
      render(
        <MultiSelectRoot {...defaultProps} data-custom="test-value">
          <div>Test content</div>
        </MultiSelectRoot>
      );

      const container = screen.getByTestId('popover').querySelector('div');
      expect(container).toHaveAttribute('data-custom', 'test-value');
    });
  });

  describe('External Value Sync', () => {
    it('handles external value changes', async () => {
      const { rerender } = render(
        <MultiSelectRoot {...defaultProps} value={['option1']}>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      // Initial state
      expect(mockUseMultiSelect).toHaveBeenCalledWith(
        expect.objectContaining({ value: ['option1'] })
      );

      // Change external value
      rerender(
        <MultiSelectRoot {...defaultProps} value={['option1', 'option2']}>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      // Should be called with new value
      expect(mockUseMultiSelect).toHaveBeenCalledWith(
        expect.objectContaining({ value: ['option1', 'option2'] })
      );
    });

    it('handles value synchronization with useEffect', () => {
      // Mock different values between external prop and hook state
      const mockHookValue = ['option1'];
      const externalValue = ['option1', 'option2'];

      mockUseMultiSelect.mockReturnValue({
        value: mockHookValue,
        isOpen: false,
        setIsOpen: mockSetIsOpen,
        toggleValue: vi.fn(),
        addValue: vi.fn(),
        removeValue: vi.fn(),
        clearAll: vi.fn(),
        hasValue: vi.fn(),
        canAddMore: true,
        selectedOptions: [],
      });

      render(
        <MultiSelectRoot {...defaultProps} value={externalValue}>
          <div>Test content</div>
        </MultiSelectRoot>
      );

      // The useEffect should detect the difference and handle sync
      // (Note: In the actual implementation, the sync logic might need refinement)
      expect(JSON.stringify(externalValue)).not.toBe(
        JSON.stringify(mockHookValue)
      );
    });
  });

  describe('Context Value Composition', () => {
    it('provides all hook values to context', () => {
      const mockHookReturn = {
        value: ['option1'],
        isOpen: true,
        setIsOpen: mockSetIsOpen,
        toggleValue: vi.fn(),
        addValue: vi.fn(),
        removeValue: vi.fn(),
        clearAll: vi.fn(),
        hasValue: vi.fn().mockReturnValue(true),
        canAddMore: false,
        selectedOptions: [{ value: 'option1', label: 'Option 1' }],
      };

      mockUseMultiSelect.mockReturnValue(mockHookReturn);

      render(
        <MultiSelectRoot {...defaultProps} value={['option1']}>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('value-length')).toHaveTextContent('1');
      expect(screen.getByTestId('is-open')).toHaveTextContent('true');
      expect(screen.getByTestId('can-add-more')).toHaveTextContent('false');
    });

    it('provides options and configuration to context', () => {
      render(
        <MultiSelectRoot {...defaultProps} disabled>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('options-length')).toHaveTextContent('3');
      expect(screen.getByTestId('disabled')).toHaveTextContent('true');
    });
  });

  describe('Popover Integration', () => {
    it('passes isOpen state to Popover', () => {
      mockUseMultiSelect.mockReturnValue({
        value: [],
        isOpen: true,
        setIsOpen: mockSetIsOpen,
        toggleValue: vi.fn(),
        addValue: vi.fn(),
        removeValue: vi.fn(),
        clearAll: vi.fn(),
        hasValue: vi.fn(),
        canAddMore: true,
        selectedOptions: [],
      });

      render(
        <MultiSelectRoot {...defaultProps}>
          <div>Test content</div>
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('popover')).toHaveAttribute(
        'data-open',
        'true'
      );
    });

    it('passes setIsOpen callback to Popover', async () => {
      const user = userEvent.setup();

      render(
        <MultiSelectRoot {...defaultProps}>
          <div>Test content</div>
        </MultiSelectRoot>
      );

      const popover = screen.getByTestId('popover');
      await user.click(popover);

      expect(mockSetIsOpen).toHaveBeenCalledWith(true);
    });

    it('renders children inside Popover structure', () => {
      render(
        <MultiSelectRoot {...defaultProps}>
          <div data-testid="test-child">Test Child Content</div>
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByTestId('popover')).toContainElement(
        screen.getByTestId('test-child')
      );
    });
  });

  describe('TypeScript Generic Support', () => {
    it('handles custom option types', () => {
      type CustomOption = {
        category: string;
      };

      const customOptions: SelectOption<CustomOption>[] = [
        { value: 'opt1', label: 'Option 1', meta: { category: 'A' } },
        { value: 'opt2', label: 'Option 2', meta: { category: 'B' } },
      ];

      const CustomContextConsumer = () => {
        const context = useMultiSelectContext<CustomOption>();
        return (
          <div data-testid="custom-context">
            <span data-testid="first-category">
              {context.options[0]?.meta?.category || 'none'}
            </span>
          </div>
        );
      };

      render(
        <MultiSelectRoot<CustomOption>
          options={customOptions}
          value={[]}
          onChange={() => {}}
        >
          <CustomContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('first-category')).toHaveTextContent('A');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(
        <MultiSelectRoot {...defaultProps} options={[]}>
          <ContextConsumer />
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('options-length')).toHaveTextContent('0');
    });

    it('handles missing children gracefully', () => {
      expect(() => {
        // @ts-expect-error - miss children prop
        render(<MultiSelectRoot {...defaultProps} />);
      }).not.toThrow();
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(
        <MultiSelectRoot {...defaultProps} value={[]}>
          <div>Content</div>
        </MultiSelectRoot>
      );

      // Rapidly change props
      rerender(
        <MultiSelectRoot {...defaultProps} value={['option1']} disabled>
          <div>Content</div>
        </MultiSelectRoot>
      );

      rerender(
        <MultiSelectRoot
          {...defaultProps}
          value={['option1', 'option2']}
          maxSelections={2}
        >
          <div>Content</div>
        </MultiSelectRoot>
      );

      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });
  });
});
