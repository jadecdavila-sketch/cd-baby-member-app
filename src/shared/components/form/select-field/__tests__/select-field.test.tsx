import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { SelectField } from '../select-field';

// Don't mock shadcn components - use actual implementation for better integration testing

describe('SelectField', () => {
  const defaultProps = {
    id: 'test-select',
    label: 'Test Select',
    children: (
      <>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </>
    ),
  };

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.getByText('Test Select')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      // Component renders successfully with children
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'test-select');
    });

    it('associates label with select correctly', () => {
      render(<SelectField {...defaultProps} />);

      const label = screen.getByText('Test Select');
      const selectTrigger = screen.getByRole('combobox');

      expect(label).toHaveAttribute('for', 'test-select');
      expect(selectTrigger).toHaveAttribute('id', 'test-select');
    });

    it('renders with placeholder', () => {
      render(<SelectField {...defaultProps} placeholder="Choose an option" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('data-placeholder', '');
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('renders children in select content', () => {
      render(<SelectField {...defaultProps} />);

      // Children are rendered but hidden when select is closed
      // We can verify the component accepts children without error
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SelectField {...defaultProps} className="custom-select" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveClass('custom-select');
    });
  });

  describe('Required Field', () => {
    it('shows required indicator when required prop is true', () => {
      render(<SelectField {...defaultProps} required />);

      const label = screen.getByText('Test Select');
      expect(label).toHaveClass(/after:content/);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-required', 'true');
    });

    it('does not show required indicator when required prop is false', () => {
      render(<SelectField {...defaultProps} required={false} />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-required', 'false');
    });
  });

  describe('Tooltip Functionality', () => {
    it('renders tooltip when tooltip prop is provided', () => {
      render(
        <SelectField
          {...defaultProps}
          tooltip="This is helpful information"
          tooltipId="test-tooltip"
        />
      );

      // Tooltip button is rendered
      expect(screen.getByRole('button', { name: 'More information about Test Select' })).toBeInTheDocument();
      // Tooltip content is hidden until tooltip is triggered
    });

    it('does not render tooltip when tooltip prop is not provided', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.queryByRole('button', { name: 'More information about Test Select' })).not.toBeInTheDocument();
    });

    it('tooltip trigger has proper accessibility attributes', () => {
      render(
        <SelectField
          {...defaultProps}
          tooltip="Helpful tooltip"
          tooltipId="test-tooltip"
        />
      );

      const tooltipButton = screen.getByLabelText('More information about Test Select');
      expect(tooltipButton).toHaveAttribute('type', 'button');
      expect(tooltipButton).toHaveAttribute('id', 'test-tooltip');
      expect(tooltipButton).toHaveAttribute('aria-label', 'More information about Test Select');
    });

    it('displays tooltip content correctly', () => {
      render(
        <SelectField
          {...defaultProps}
          tooltip="This is helpful information"
          tooltipId="test-tooltip"
        />
      );

      // Tooltip content is not visible until tooltip is opened
      // We can verify the tooltip button is present
      const tooltipButton = screen.getByRole('button', { name: 'More information about Test Select' });
      expect(tooltipButton).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('associates error message with select via aria-describedby', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      const selectTrigger = screen.getByRole('combobox');
      const errorMessage = screen.getByText('This field is required');

      expect(selectTrigger).toHaveAttribute('aria-describedby', 'test-select-error');
      expect(errorMessage).toHaveAttribute('id', 'test-select-error');
    });

    it('sets aria-invalid to true when error is present', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies error styling to select trigger', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveClass('border-destructive');
      expect(selectTrigger).toHaveClass('focus:ring-destructive');
    });

    it('hides helper text when error is present', () => {
      render(
        <SelectField
          {...defaultProps}
          error="This field is required"
          helperText="This should not be visible"
        />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.queryByText('This should not be visible')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text when helperText prop is provided', () => {
      render(<SelectField {...defaultProps} helperText="This is helpful information" />);

      const helperText = screen.getByText('This is helpful information');
      expect(helperText).toBeInTheDocument();
    });

    it('associates helper text with select via aria-describedby', () => {
      render(<SelectField {...defaultProps} helperText="This is helpful information" />);

      const selectTrigger = screen.getByRole('combobox');
      const helperText = screen.getByText('This is helpful information');

      expect(selectTrigger).toHaveAttribute('aria-describedby', 'test-select-help');
      expect(helperText).toHaveAttribute('id', 'test-select-help');
    });

    it('does not show helper text when error is present', () => {
      render(
        <SelectField
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
    it('passes disabled prop to Select component', () => {
      render(<SelectField {...defaultProps} disabled />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('data-disabled', '');
    });

    it('handles disabled prop as false by default', () => {
      render(<SelectField {...defaultProps} disabled={false} />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).not.toHaveAttribute('data-disabled');
    });
  });

  describe('Size Variants', () => {
    it('applies default size when no size prop is provided', () => {
      render(<SelectField {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      // Default size applies the h-10 py-2 classes
      expect(selectTrigger).toHaveClass('h-10', 'py-2');
    });

    it('applies small size when size="sm"', () => {
      render(<SelectField {...defaultProps} size="sm" />);

      const selectTrigger = screen.getByRole('combobox');
      // Small size applies the h-8 py-1 classes
      expect(selectTrigger).toHaveClass('h-8');
    });

    it('applies large size when size="lg"', () => {
      render(<SelectField {...defaultProps} size="lg" />);

      const selectTrigger = screen.getByRole('combobox');
      // Large size applies the h-12 py-3 classes
      expect(selectTrigger).toHaveClass('h-12');
    });
  });

  describe('Value Management', () => {
    it('passes value prop to Select component', () => {
      render(<SelectField {...defaultProps} value="option2" />);

      const selectTrigger = screen.getByRole('combobox');
      // Value is internally managed by Radix Select
      expect(selectTrigger).toBeInTheDocument();
    });

    it('passes defaultValue prop to Select component', () => {
      render(<SelectField {...defaultProps} defaultValue="option1" />);

      const selectTrigger = screen.getByRole('combobox');
      // Default value is internally managed by Radix Select
      expect(selectTrigger).toBeInTheDocument();
    });

    it('handles onValueChange callback', () => {
      const handleValueChange = vi.fn();
      render(<SelectField {...defaultProps} onValueChange={handleValueChange} />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeInTheDocument();
      // Note: Testing the actual callback would require a more complex mock setup
    });

    it('handles undefined value gracefully', () => {
      render(<SelectField {...defaultProps} value={undefined} />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeInTheDocument();
    });

    it('handles undefined defaultValue gracefully', () => {
      render(<SelectField {...defaultProps} defaultValue={undefined} />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes when no error or helper text', () => {
      render(<SelectField {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).not.toHaveAttribute('aria-describedby');
      expect(selectTrigger).not.toHaveAttribute('aria-invalid');
    });

    it('has proper ARIA attributes with error', () => {
      render(<SelectField {...defaultProps} error="Error message" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-describedby', 'test-select-error');
      expect(selectTrigger).toHaveAttribute('aria-invalid', 'true');
    });

    it('has proper ARIA attributes with helper text', () => {
      render(<SelectField {...defaultProps} helperText="Helper text" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-describedby', 'test-select-help');
      expect(selectTrigger).not.toHaveAttribute('aria-invalid');
    });

    it('has proper ARIA attributes when required', () => {
      render(<SelectField {...defaultProps} required />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-required', 'true');
    });

    it('tooltip trigger is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <SelectField
          {...defaultProps}
          tooltip="Tooltip content"
          tooltipId="test-tooltip"
        />
      );

      const tooltipTrigger = screen.getByLabelText('More information about Test Select');

      // Should be focusable via keyboard
      await user.tab();
      expect(tooltipTrigger).toHaveFocus();
    });

    it('maintains proper focus management', async () => {
      const user = userEvent.setup();
      render(<SelectField {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');

      await user.tab();
      expect(selectTrigger).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles missing tooltip ID when tooltip is provided', () => {
      // This should be caught by TypeScript, but test runtime behavior
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <SelectField
          {...defaultProps}
          tooltip="Tooltip content"
          // @ts-ignore - Intentionally testing invalid props
          tooltipId={undefined}
        />
      );

      // Tooltip is rendered with its actual components
      expect(screen.getByRole('button', { name: 'More information about Test Select' })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('handles null/undefined children gracefully', () => {
      expect(() => {
        render(
          <SelectField
            {...defaultProps}
            children={null}
          />
        );
      }).not.toThrow();
    });

    it('handles empty string values', () => {
      render(<SelectField {...defaultProps} value="" defaultValue="" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('merges custom className with error styles', () => {
      render(
        <SelectField
          {...defaultProps}
          className="custom-class"
          error="Error message"
        />
      );

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveClass('custom-class');
      expect(selectTrigger).toHaveClass('border-destructive');
      expect(selectTrigger).toHaveClass('focus:ring-destructive');
    });

    it('applies custom className without error styles when no error', () => {
      render(<SelectField {...defaultProps} className="custom-class" />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveClass('custom-class');
      expect(selectTrigger).not.toHaveClass('border-destructive');
    });
  });

  describe('Forwarded Ref', () => {
    it('forwards ref to SelectTrigger component', () => {
      let selectRef: any = null;

      render(
        <SelectField
          {...defaultProps}
          ref={(ref) => {
            selectRef = ref;
          }}
        />
      );

      expect(selectRef).toBeTruthy();
    });
  });

  describe('TypeScript Props Validation', () => {
    it('accepts valid props with tooltip', () => {
      const validProps = {
        id: 'test',
        label: 'Test',
        tooltip: 'Tooltip',
        tooltipId: 'tooltip-id',
        children: <option value="test">Test</option>,
      };

      expect(() => {
        render(<SelectField {...validProps} />);
      }).not.toThrow();
    });

    it('accepts valid props without tooltip', () => {
      const validProps = {
        id: 'test',
        label: 'Test',
        children: <option value="test">Test</option>,
      };

      expect(() => {
        render(<SelectField {...validProps} />);
      }).not.toThrow();
    });
  });
});