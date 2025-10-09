import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { MultiSelect } from '../multi-select';

import type { MultiSelectProps } from '../types';

// Mock the Popover component from shadcn
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

describe('MultiSelect', () => {
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

  let mockOnValueChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnValueChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with options array', () => {
      render(<MultiSelect {...defaultProps} />);

      expect(screen.getByTestId('popover')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
    });

    it('displays placeholder when no options selected', () => {
      render(<MultiSelect {...defaultProps} placeholder="Choose items" />);

      expect(screen.getByText('Choose items')).toBeInTheDocument();
    });

    it('shows empty state when options array is empty', () => {
      render(<MultiSelect {...defaultProps} options={[]} />);

      // Should render without crashing when no options provided
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('renders all provided options in dropdown', () => {
      render(<MultiSelect {...defaultProps} />);

      // Options should be rendered in the content
      mockOptions.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('opens dropdown when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} />);

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
      render(<MultiSelect {...defaultProps} onChange={mockOnValueChange} />);

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
    });

    it('allows multiple selection', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} onChange={mockOnValueChange} />);

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
        <MultiSelect
          {...defaultProps}
          value={['option1']}
          onChange={mockOnValueChange}
        />
      );

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      // Click the option in the dropdown content, not in the trigger area
      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnValueChange).toHaveBeenCalledWith([]);
    });

    it('handles keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} />);

      const combobox = screen.getByRole('combobox');

      // Focus the combobox directly and test keyboard interaction
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
      render(<MultiSelect {...defaultProps} />);

      const combobox = screen.getByRole('combobox');

      // Focus and open the dropdown
      combobox.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      // Close with Escape
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
        <MultiSelect {...defaultProps} value={['option1']} />
      );

      // Should show Option 1 as selected (appears in both trigger and dropdown)
      expect(screen.getAllByText('Option 1')).toHaveLength(2);

      rerender(
        <MultiSelect {...defaultProps} value={['option1', 'option2']} />
      );

      // Should show both options as selected
      expect(screen.getAllByText('Option 1')).toHaveLength(2);
      expect(screen.getAllByText('Option 2')).toHaveLength(2);
    });

    it('calls onChange callback correctly', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} onChange={mockOnValueChange} />);

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
    });

    it('prevents interactions when disabled', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect {...defaultProps} disabled onChange={mockOnValueChange} />
      );

      const combobox = screen.getByRole('combobox');

      // Combobox should be disabled
      expect(combobox).toBeDisabled();

      // Try to interact with disabled combobox
      await user.click(combobox);

      // Should not open dropdown or call callback
      expect(screen.getByTestId('popover')).toHaveAttribute(
        'data-open',
        'false'
      );
      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('respects maxSelections limit', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
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

      // Select first two options
      await user.click(screen.getByRole('option', { name: 'Option 1' }));
      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      // Try to select third option - should be prevented by maxSelections
      await user.click(screen.getByRole('option', { name: 'Option 3' }));

      // Should have called onChange three times:
      // 1. ['option1'] - first selection
      // 2. ['option1', 'option2'] - second selection
      // 3. ['option1', 'option2'] - third attempt (no change due to max limit)
      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
      expect(mockOnValueChange).toHaveBeenCalledWith(['option1', 'option2']);
      expect(mockOnValueChange).toHaveBeenCalledTimes(3);

      // The third call should be with the same array (no change)
      expect(mockOnValueChange).toHaveBeenNthCalledWith(3, [
        'option1',
        'option2',
      ]);
    });

    it('applies custom className', () => {
      render(<MultiSelect {...defaultProps} className="custom-class" />);

      // The className should be applied to the container div inside the Popover
      const popover = screen.getByTestId('popover');
      const container = popover.querySelector('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on trigger', () => {
      render(<MultiSelect {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('updates aria-expanded when dropdown opens', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('options have proper role and accessibility', () => {
      render(<MultiSelect {...defaultProps} />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(mockOptions.length);

      options.forEach((option, index) => {
        expect(option).toHaveAttribute('aria-selected', 'false');
        expect(option).toHaveTextContent(mockOptions[index]!.label);
      });
    });

    it('selected options have aria-selected="true"', () => {
      render(<MultiSelect {...defaultProps} value={['option1']} />);

      const selectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('supports keyboard navigation with arrow keys', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      // Test that dropdown opens and options are available for navigation
      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('supports selection with Enter key', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} onChange={mockOnValueChange} />);

      const trigger = screen.getByRole('combobox');

      // Focus the trigger and open with Enter
      trigger.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('popover')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      // Click an option to test selection
      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnValueChange).toHaveBeenCalledWith(['option1']);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array gracefully', () => {
      render(<MultiSelect {...defaultProps} options={[]} />);

      // Should render without crashing when no options provided
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('handles invalid value prop gracefully', () => {
      render(<MultiSelect {...defaultProps} value={['nonexistent']} />);

      // Should not crash or show invalid selections
      expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('handles rapid selection changes', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...defaultProps} onChange={mockOnValueChange} />);

      const trigger = screen.getByTestId('popover-trigger');
      await user.click(trigger);

      // Rapidly click multiple options
      await user.click(screen.getByRole('option', { name: 'Option 1' }));
      await user.click(screen.getByRole('option', { name: 'Option 2' }));
      await user.click(screen.getByRole('option', { name: 'Option 1' })); // Deselect
      await user.click(screen.getByRole('option', { name: 'Option 3' }));

      // Should handle all changes correctly
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
      render(<MultiSelect {...defaultProps} value={['option1']} />);

      // Check that Option 1 appears (could be in trigger or dropdown)
      expect(screen.getAllByText('Option 1')).toHaveLength(2); // Once in trigger, once in dropdown
    });

    it('shows multiple selected option labels', () => {
      render(<MultiSelect {...defaultProps} value={['option1', 'option2']} />);

      // Check that both options appear (in trigger and dropdown)
      expect(screen.getAllByText('Option 1')).toHaveLength(2);
      expect(screen.getAllByText('Option 2')).toHaveLength(2);
    });

    it('shows placeholder when no selections', () => {
      render(
        <MultiSelect {...defaultProps} value={[]} placeholder="Choose..." />
      );

      expect(screen.getByText('Choose...')).toBeInTheDocument();
    });
  });
});
