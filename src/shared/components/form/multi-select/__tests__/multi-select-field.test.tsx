import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { MultiSelectField } from '../multi-select-field';

import type { MultiSelectFieldProps } from '../multi-select-field';

// Mock the shadcn components
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
  PopoverTrigger: ({ children, asChild, ...props }: any) => (
    <div data-testid="popover-trigger" {...props}>
      {children}
    </div>
  ),
  PopoverAnchor: ({ children, ...props }: any) => (
    <div data-testid="popover-anchor" {...props}>
      {children}
    </div>
  ),
  PopoverContent: ({ children, ...props }: any) => (
    <div data-testid="popover-content" {...props}>
      {children}
    </div>
  ),
}));

// Mock Tooltip components
vi.mock('@/shared/components/shadcn/tooltip', () => ({
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  TooltipTrigger: ({ children, asChild, ...props }: any) => (
    <div data-testid="tooltip-trigger" {...props}>
      {children}
    </div>
  ),
  TooltipContent: ({ children }: any) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

// Mock Label component
vi.mock('@/shared/components/shadcn/label', () => ({
  Label: ({ children, htmlFor, className, ...props }: any) => (
    <label htmlFor={htmlFor} className={className} {...props}>
      {children}
    </label>
  ),
}));

describe('MultiSelectField', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps: MultiSelectFieldProps = {
    id: 'test-multi-select-field',
    label: 'Test Multi Select',
    options: mockOptions,
    value: [],
    onChange: () => {},
    tooltip: undefined,
    tooltipId: undefined,
  };

  let mockOnValueChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnValueChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<MultiSelectField {...defaultProps} />);

      expect(screen.getByText('Test Multi Select')).toBeInTheDocument();
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('associates label with the field correctly', () => {
      render(<MultiSelectField {...defaultProps} />);

      const label = screen.getByText('Test Multi Select');
      expect(label).toHaveAttribute('for', 'test-multi-select-field');
    });

    it('renders with placeholder text', () => {
      render(
        <MultiSelectField {...defaultProps} placeholder="Choose options" />
      );

      expect(screen.getByText('Choose options')).toBeInTheDocument();
    });

    it('renders with initial selected values', () => {
      render(<MultiSelectField {...defaultProps} value={['option1']} />);

      // Should show Option 1 as selected (appears in trigger and dropdown)
      expect(screen.getAllByText('Option 1')).toHaveLength(2);
    });

    it('renders all provided options', () => {
      render(<MultiSelectField {...defaultProps} />);

      // All options should be rendered in the dropdown
      mockOptions.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('Required Field', () => {
    it('shows required indicator when required prop is true', () => {
      render(<MultiSelectField {...defaultProps} required />);

      // Check for required styling (CSS after content)
      const label = screen.getByText('Test Multi Select');
      expect(label).toHaveClass(/after:content/);
    });

    it('does not show required indicator when required prop is false', () => {
      render(<MultiSelectField {...defaultProps} required={false} />);

      const label = screen.getByText('Test Multi Select');
      expect(label).not.toHaveClass(/after:content/);
    });
  });

  describe('Tooltip Functionality', () => {
    it('renders tooltip trigger when tooltip prop is provided', () => {
      render(
        <MultiSelectField
          {...defaultProps}
          tooltip="This is helpful information"
          tooltipId="test-tooltip"
        />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Multi Select'
      );
      expect(tooltipTrigger).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('does not render tooltip when tooltip prop is not provided', () => {
      render(<MultiSelectField {...defaultProps} />);

      const tooltipTrigger = screen.queryByLabelText(
        'More information about Test Multi Select'
      );
      expect(tooltipTrigger).not.toBeInTheDocument();
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });

    it('tooltip trigger has proper accessibility attributes', () => {
      render(
        <MultiSelectField
          {...defaultProps}
          tooltip="Helpful tooltip"
          tooltipId="test-tooltip"
        />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Multi Select'
      );
      expect(tooltipTrigger).toHaveAttribute('type', 'button');
      expect(tooltipTrigger).toHaveAttribute('id', 'test-tooltip');
      expect(tooltipTrigger).toHaveAttribute(
        'aria-label',
        'More information about Test Multi Select'
      );
    });
  });

  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <MultiSelectField {...defaultProps} error="This field is required" />
      );

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('error message has correct id attribute', () => {
      render(
        <MultiSelectField {...defaultProps} error="This field is required" />
      );

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toHaveAttribute(
        'id',
        'test-multi-select-field-error'
      );
    });

    it('applies error styling to the field container', () => {
      render(
        <MultiSelectField {...defaultProps} error="This field is required" />
      );

      // The error styling should be applied via className prop to MultiSelect
      const popover = screen.getByTestId('popover');
      const container = popover.querySelector('div');
      expect(container).toHaveClass('border-destructive');
      expect(container).toHaveClass('focus-visible:ring-destructive');
    });

    it('hides helper text when error is present', () => {
      render(
        <MultiSelectField
          {...defaultProps}
          error="This field is required"
          helperText="This should not be visible"
        />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(
        screen.queryByText('This should not be visible')
      ).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text when helperText prop is provided', () => {
      render(
        <MultiSelectField
          {...defaultProps}
          helperText="This is helpful information"
        />
      );

      const helperText = screen.getByText('This is helpful information');
      expect(helperText).toBeInTheDocument();
    });

    it('helper text has correct id attribute', () => {
      render(
        <MultiSelectField
          {...defaultProps}
          helperText="This is helpful information"
        />
      );

      const helperText = screen.getByText('This is helpful information');
      expect(helperText).toHaveAttribute('id', 'test-multi-select-field-help');
    });

    it('does not show helper text when error is present', () => {
      render(
        <MultiSelectField
          {...defaultProps}
          error="Error message"
          helperText="Helper text"
        />
      );

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('passes disabled prop to MultiSelect component', () => {
      render(<MultiSelectField {...defaultProps} disabled />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeDisabled();
    });

    it('prevents interactions when disabled', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField
          {...defaultProps}
          disabled
          onChange={mockOnValueChange}
        />
      );

      const combobox = screen.getByRole('combobox');
      await user.click(combobox);

      // Should not open dropdown or call callback
      expect(screen.getByTestId('popover')).toHaveAttribute(
        'data-open',
        'false'
      );
      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('MultiSelect Integration - User Interactions', () => {
    it('opens dropdown when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'true'
        );
      });
    });

    it('selects option when clicked', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField {...defaultProps} onChange={mockOnValueChange} />
      );

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
    });

    it('allows multiple selection', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField {...defaultProps} onChange={mockOnValueChange} />
      );

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      const option2 = screen.getByRole('option', { name: 'Option 2' });

      await user.click(option1);
      await user.click(option2);

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
      expect(mockOnValueChange).toHaveBeenCalledWith(['option1', 'option2']);
    });

    it('deselects option when clicked again', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField
          {...defaultProps}
          value={['option1']}
          onChange={mockOnValueChange}
        />
      );

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnValueChange).toHaveBeenCalledWith([]);
    });

    it('handles keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);

      const combobox = screen.getByRole('combobox');
      combobox.focus();
      expect(combobox).toHaveFocus();

      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'true'
        );
      });
    });

    it('closes dropdown with Escape key', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);

      const combobox = screen.getByRole('combobox');
      combobox.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'false'
        );
      });
    });
  });

  describe('Props Handling', () => {
    it('controls selected items with value prop', () => {
      const { rerender } = render(
        <MultiSelectField {...defaultProps} value={['option1']} />
      );

      expect(screen.getAllByText('Option 1')).toHaveLength(2);

      rerender(
        <MultiSelectField {...defaultProps} value={['option1', 'option2']} />
      );

      expect(screen.getAllByText('Option 1')).toHaveLength(2);
      expect(screen.getAllByText('Option 2')).toHaveLength(2);
    });

    it('calls onChange callback correctly', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField {...defaultProps} onChange={mockOnValueChange} />
      );

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
    });

    it('respects maxSelections limit', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField
          {...defaultProps}
          maxSelections={2}
          onChange={mockOnValueChange}
        />
      );

      const combobox = screen.getByRole('combobox');
      await user.click(combobox);

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      await user.click(screen.getByRole('option', { name: 'Option 1' }));
      await user.click(screen.getByRole('option', { name: 'Option 2' }));
      await user.click(screen.getByRole('option', { name: 'Option 3' }));

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
      expect(mockOnValueChange).toHaveBeenCalledWith(['option1', 'option2']);
      expect(mockOnValueChange).toHaveBeenCalledTimes(3);
      expect(mockOnValueChange).toHaveBeenNthCalledWith(3, [
        'option1',
        'option2',
      ]);
    });

    it('applies custom className to MultiSelect', () => {
      render(<MultiSelectField {...defaultProps} className="custom-class" />);

      const popover = screen.getByTestId('popover');
      const container = popover.querySelector('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on trigger', () => {
      render(<MultiSelectField {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('updates aria-expanded when dropdown opens', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('options have proper role and accessibility', () => {
      render(<MultiSelectField {...defaultProps} />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(mockOptions.length);

      options.forEach((option, index) => {
        expect(option).toHaveAttribute('aria-selected', 'false');
        expect(option).toHaveTextContent(mockOptions[index]!.label);
      });
    });

    it('selected options have aria-selected="true"', () => {
      render(<MultiSelectField {...defaultProps} value={['option1']} />);

      const selectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('tooltip trigger is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField
          {...defaultProps}
          tooltip="Tooltip content"
          tooltipId="test-tooltip"
        />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Multi Select'
      );

      await user.tab();
      expect(tooltipTrigger).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array gracefully', () => {
      render(<MultiSelectField {...defaultProps} options={[]} />);

      expect(screen.getByTestId('popover')).toBeInTheDocument();
      expect(screen.getByText('Test Multi Select')).toBeInTheDocument();
    });

    it('handles invalid value prop gracefully', () => {
      render(<MultiSelectField {...defaultProps} value={['nonexistent']} />);

      expect(screen.getByTestId('popover')).toBeInTheDocument();
      expect(screen.getByText('Test Multi Select')).toBeInTheDocument();
    });

    it('handles rapid selection changes', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField {...defaultProps} onChange={mockOnValueChange} />
      );

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      await user.click(screen.getByRole('option', { name: 'Option 1' }));
      await user.click(screen.getByRole('option', { name: 'Option 2' }));
      await user.click(screen.getByRole('option', { name: 'Option 1' })); // Deselect
      await user.click(screen.getByRole('option', { name: 'Option 3' }));

      expect(mockOnValueChange).toHaveBeenCalledTimes(4);
      expect(mockOnValueChange).toHaveBeenNthCalledWith(1, ['option1']);
      expect(mockOnValueChange).toHaveBeenNthCalledWith(2, [
        'option1',
        'option2',
      ]);
      expect(mockOnValueChange).toHaveBeenNthCalledWith(3, ['option2']);
      expect(mockOnValueChange).toHaveBeenNthCalledWith(4, [
        'option2',
        'option3',
      ]);
    });
  });

  describe('Display Values', () => {
    it('shows selected option labels in trigger', () => {
      render(<MultiSelectField {...defaultProps} value={['option1']} />);

      expect(screen.getAllByText('Option 1')).toHaveLength(2);
    });

    it('shows multiple selected option labels', () => {
      render(
        <MultiSelectField {...defaultProps} value={['option1', 'option2']} />
      );

      expect(screen.getAllByText('Option 1')).toHaveLength(2);
      expect(screen.getAllByText('Option 2')).toHaveLength(2);
    });

    it('shows placeholder when no selections', () => {
      render(
        <MultiSelectField
          {...defaultProps}
          value={[]}
          placeholder="Choose..."
        />
      );

      expect(screen.getByText('Choose...')).toBeInTheDocument();
    });
  });

  describe('Forwarded Ref', () => {
    it('forwards ref to container element', () => {
      let containerRef: HTMLDivElement | null = null;

      render(
        <MultiSelectField
          {...defaultProps}
          ref={(ref) => {
            containerRef = ref;
          }}
        />
      );

      expect(containerRef).toBeInstanceOf(HTMLDivElement);
    });
  });
});
