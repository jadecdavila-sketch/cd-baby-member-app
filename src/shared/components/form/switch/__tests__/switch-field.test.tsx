import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SwitchField } from '../switch-field';

describe('SwitchField', () => {
  const defaultProps = {
    id: 'test-switch',
    label: 'Test Switch',
    checked: false,
    onCheckedChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders switch with label', () => {
      render(<SwitchField {...defaultProps} />);

      const switchElement = screen.getByRole('switch');
      const label = screen.getByText('Test Switch');

      expect(switchElement).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test-switch');
    });

    it('renders with helper text', () => {
      render(
        <SwitchField
          {...defaultProps}
          helperText="This is a test helper text"
        />
      );

      const helperText = screen.getByText('This is a test helper text');
      expect(helperText).toBeInTheDocument();
    });

    it('renders with tooltip', () => {
      render(
        <SwitchField
          {...defaultProps}
          tooltip="This is a tooltip"
        />
      );

      const tooltip = screen.getByTitle('This is a tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('aria-label', 'This is a tooltip');
    });

    it('renders with error message', () => {
      render(
        <SwitchField
          {...defaultProps}
          error="This field is required"
        />
      );

      const error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();
      expect(error).toHaveAttribute('role', 'alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
    });

    it('renders with FieldError object', () => {
      const fieldError = {
        type: 'required',
        message: 'Field is required',
      };

      render(<SwitchField {...defaultProps} error={fieldError} />);

      const error = screen.getByText('Field is required');
      expect(error).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SwitchField {...defaultProps} className="custom-wrapper" />);

      const wrapper = screen.getByText('Test Switch').closest('.custom-wrapper');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('properly associates label with switch', () => {
      render(<SwitchField {...defaultProps} />);

      const switchElement = screen.getByRole('switch');
      const label = screen.getByText('Test Switch');

      expect(switchElement).toHaveAttribute('aria-labelledby', 'test-switch-label');
      expect(label).toHaveAttribute('id', 'test-switch-label');
    });

    it('associates helper text with switch via aria-describedby', () => {
      render(
        <SwitchField
          {...defaultProps}
          helperText="This is a helper text"
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-describedby', expect.stringContaining('test-switch-helper'));
    });

    it('associates error with switch via aria-describedby', () => {
      render(
        <SwitchField
          {...defaultProps}
          error="This is an error"
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-describedby', expect.stringContaining('test-switch-error'));
    });

    it('combines multiple aria-describedby references', () => {
      render(
        <SwitchField
          {...defaultProps}
          helperText="Helper text"
          error="Error text"
          aria-describedby="external-helper"
        />
      );

      const switchElement = screen.getByRole('switch');
      const describedBy = switchElement.getAttribute('aria-describedby');

      expect(describedBy).toContain('external-helper');
      expect(describedBy).toContain('test-switch-helper');
      expect(describedBy).toContain('test-switch-error');
    });

    it('supports aria-label override', () => {
      render(
        <SwitchField
          {...defaultProps}
          aria-label="Custom aria label"
        />
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-label', 'Custom aria label');
      expect(switchElement).not.toHaveAttribute('aria-labelledby');
    });

    it('label is clickable and toggles switch', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(
        <SwitchField
          {...defaultProps}
          onCheckedChange={onCheckedChange}
        />
      );

      const label = screen.getByText('Test Switch');
      await user.click(label);

      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Disabled State', () => {
    it('disables switch and applies disabled styling', () => {
      render(<SwitchField {...defaultProps} disabled />);

      const switchElement = screen.getByRole('switch');
      const label = screen.getByText('Test Switch');

      expect(switchElement).toBeDisabled();
      expect(label).toHaveClass('cursor-not-allowed', 'opacity-50');
    });

    it('disables helper text when disabled', () => {
      render(
        <SwitchField
          {...defaultProps}
          disabled
          helperText="Helper text"
        />
      );

      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveClass('opacity-50');
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(
        <SwitchField
          {...defaultProps}
          disabled
          onCheckedChange={onCheckedChange}
        />
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('label click does not toggle when disabled', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(
        <SwitchField
          {...defaultProps}
          disabled
          onCheckedChange={onCheckedChange}
        />
      );

      const label = screen.getByText('Test Switch');
      await user.click(label);

      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('Form Integration', () => {
    it('accepts name prop for form integration', () => {
      // Note: Switch elements are buttons and don't have name attributes
      // The name prop is available for form integration purposes
      render(<SwitchField {...defaultProps} name="notifications" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement.tagName).toBe('BUTTON');
    });

    it('passes through form-related props', () => {
      render(
        <SwitchField
          {...defaultProps}
          name="test-field"
          data-testid="form-switch"
        />
      );

      const switchElement = screen.getByRole('switch');
      // Verify it's a button element (not an input)
      expect(switchElement.tagName).toBe('BUTTON');
      // Custom attributes should be passed through
      expect(switchElement).toHaveAttribute('data-testid', 'form-switch');
    });
  });

  describe('State Management', () => {
    it('calls onCheckedChange with correct value when toggled', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(
        <SwitchField
          {...defaultProps}
          checked={false}
          onCheckedChange={onCheckedChange}
        />
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('reflects checked state in switch', () => {
      const { rerender } = render(
        <SwitchField {...defaultProps} checked={false} />
      );

      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      rerender(<SwitchField {...defaultProps} checked={true} />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(
        <SwitchField
          {...defaultProps}
          onCheckedChange={onCheckedChange}
        />
      );

      const switchElement = screen.getByRole('switch');

      await user.tab();
      expect(switchElement).toHaveFocus();

      await user.keyboard(' ');
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('supports Enter key', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();

      render(
        <SwitchField
          {...defaultProps}
          onCheckedChange={onCheckedChange}
        />
      );

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      await user.keyboard('{Enter}');
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Error Handling', () => {
    it('displays error message with proper styling', () => {
      render(
        <SwitchField
          {...defaultProps}
          error="Validation error"
        />
      );

      const error = screen.getByText('Validation error');
      expect(error).toHaveClass('text-destructive', 'text-sm', 'font-medium');
    });

    it('error has proper accessibility attributes', () => {
      render(
        <SwitchField
          {...defaultProps}
          error="Validation error"
        />
      );

      const error = screen.getByText('Validation error');
      expect(error).toHaveAttribute('id', 'test-switch-error');
      expect(error).toHaveAttribute('role', 'alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Layout and Styling', () => {
    it('applies correct spacing classes', () => {
      render(<SwitchField {...defaultProps} helperText="Test helper text" />);

      // Find the root wrapper div that contains all elements
      const rootWrapper = screen.getByText('Test Switch').closest('[class*="space-y"]');
      expect(rootWrapper).toHaveClass('space-y-2');
    });

    it('renders label above switch with helper text beside', () => {
      render(<SwitchField {...defaultProps} helperText="Helper text beside switch" />);

      const label = screen.getByText('Test Switch');
      const switchElement = screen.getByRole('switch');
      const helperText = screen.getByText('Helper text beside switch');

      // Check that elements exist and are properly connected
      expect(label).toBeInTheDocument();
      expect(switchElement).toBeInTheDocument();
      expect(helperText).toBeInTheDocument();

      // Check ARIA associations
      expect(switchElement).toHaveAttribute('aria-describedby', expect.stringContaining('test-switch-helper'));
      expect(helperText).toHaveAttribute('id', 'test-switch-helper');

      // Check that the switch and helper text are in a flex container with correct spacing
      const switchContainer = switchElement.parentElement;
      expect(switchContainer).toHaveClass('flex', 'items-center', 'gap-3');
    });

    it('label has correct styling', () => {
      render(<SwitchField {...defaultProps} />);

      const label = screen.getByText('Test Switch');
      expect(label).toHaveClass(
        'text-foreground',
        'text-sm',
        'font-medium',
        'leading-none',
        'cursor-pointer'
      );
    });

    it('helper text has correct styling', () => {
      render(
        <SwitchField
          {...defaultProps}
          helperText="Test helper text"
        />
      );

      const helperText = screen.getByText('Test helper text');
      expect(helperText).toHaveClass('text-muted-foreground', 'text-sm');
    });

    it('switch has correct CSS classes for color changes', () => {
      render(<SwitchField {...defaultProps} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('switch-root', 'bg-switch-track');
    });

    it('switch data attributes change when toggled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const { rerender } = render(
        <SwitchField
          {...defaultProps}
          checked={false}
          onCheckedChange={handleChange}
        />
      );

      const switchElement = screen.getByRole('switch');

      // Initially unchecked
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
      expect(switchElement).not.toBeChecked();

      // Click to toggle
      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);

      // Re-render with checked state
      rerender(
        <SwitchField
          {...defaultProps}
          checked={true}
          onCheckedChange={handleChange}
        />
      );

      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toBeChecked();
    });
  });
});