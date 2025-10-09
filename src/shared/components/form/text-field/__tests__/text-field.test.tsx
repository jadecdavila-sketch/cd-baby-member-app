import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { TextField } from '../text-field';

describe('TextField', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Label',
  };

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<TextField {...defaultProps} />);

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('associates label with input correctly', () => {
      render(<TextField {...defaultProps} />);

      const label = screen.getByText('Test Label');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'test-field');
      expect(input).toHaveAttribute('id', 'test-field');
    });

    it('renders with placeholder text', () => {
      render(<TextField {...defaultProps} placeholder="Enter text here" />);

      expect(
        screen.getByPlaceholderText('Enter text here')
      ).toBeInTheDocument();
    });

    it('renders with initial value', () => {
      render(<TextField {...defaultProps} value="Initial value" />);

      expect(screen.getByDisplayValue('Initial value')).toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('shows required indicator when required prop is true', () => {
      render(<TextField {...defaultProps} required />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');

      // Check for required styling (CSS after content)
      const label = screen.getByText('Test Label');
      expect(label).toHaveClass(/after:content/);
    });

    it('does not show required indicator when required prop is false', () => {
      render(<TextField {...defaultProps} required={false} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Tooltip Functionality', () => {
    it('renders tooltip trigger when tooltip prop is provided', () => {
      render(
        <TextField {...defaultProps} tooltip="This is helpful information" />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Label'
      );
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it('does not render tooltip when tooltip prop is not provided', () => {
      render(<TextField {...defaultProps} />);

      const tooltipTrigger = screen.queryByLabelText(
        'More information about Test Label'
      );
      expect(tooltipTrigger).not.toBeInTheDocument();
    });

    it('tooltip trigger has proper accessibility attributes', () => {
      render(<TextField {...defaultProps} tooltip="Helpful tooltip" />);

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Label'
      );
      expect(tooltipTrigger).toHaveAttribute('type', 'button');
      expect(tooltipTrigger).toHaveAttribute(
        'aria-label',
        'More information about Test Label'
      );
    });
  });

  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(<TextField {...defaultProps} error="This field is required" />);

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('associates error message with input via aria-describedby', () => {
      render(<TextField {...defaultProps} error="This field is required" />);

      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('This field is required');

      expect(input).toHaveAttribute('aria-describedby', 'test-field-error');
      expect(errorMessage).toHaveAttribute('id', 'test-field-error');
    });

    it('sets aria-invalid to true when error is present', () => {
      render(<TextField {...defaultProps} error="This field is required" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies error styling to input', () => {
      render(<TextField {...defaultProps} error="This field is required" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-destructive');
      expect(input).toHaveClass('focus-visible:ring-destructive');
    });

    it('hides helper text when error is present', () => {
      render(
        <TextField
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
        <TextField {...defaultProps} helperText="This is helpful information" />
      );

      const helperText = screen.getByText('This is helpful information');
      expect(helperText).toBeInTheDocument();
    });

    it('associates helper text with input via aria-describedby', () => {
      render(
        <TextField {...defaultProps} helperText="This is helpful information" />
      );

      const input = screen.getByRole('textbox');
      const helperText = screen.getByText('This is helpful information');

      expect(input).toHaveAttribute('aria-describedby', 'test-field-help');
      expect(helperText).toHaveAttribute('id', 'test-field-help');
    });

    it('does not show helper text when error is present', () => {
      render(
        <TextField
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
    it('disables input when disabled prop is true', () => {
      render(<TextField {...defaultProps} disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('passes disabled prop to input element', () => {
      render(<TextField {...defaultProps} disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('disabled');
    });
  });

  describe('User Interactions', () => {
    it('allows typing in the input field', async () => {
      const user = userEvent.setup();
      render(<TextField {...defaultProps} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('focuses input when label is clicked', async () => {
      const user = userEvent.setup();
      render(<TextField {...defaultProps} />);

      const label = screen.getByText('Test Label');
      const input = screen.getByRole('textbox');

      await user.click(label);
      expect(input).toHaveFocus();
    });

    it('handles onChange events', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        value = e.target.value;
      };

      render(<TextField {...defaultProps} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(value).toBe('test');
    });

    it('prevents typing when disabled', async () => {
      const user = userEvent.setup();
      render(<TextField {...defaultProps} disabled value="Initial" />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'should not work');
      expect(input).toHaveValue('Initial');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes when no error or helper text', () => {
      render(<TextField {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-describedby');
      expect(input).not.toHaveAttribute('aria-invalid');
    });

    it('has proper ARIA attributes with error', () => {
      render(<TextField {...defaultProps} error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-field-error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('has proper ARIA attributes with helper text', () => {
      render(<TextField {...defaultProps} helperText="Helper text" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-field-help');
      expect(input).not.toHaveAttribute('aria-invalid');
    });

    it('has proper ARIA attributes when required', () => {
      render(<TextField {...defaultProps} required />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('tooltip trigger is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<TextField {...defaultProps} tooltip="Tooltip content" />);

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Label'
      );

      // Should be focusable via keyboard
      await user.tab();
      expect(tooltipTrigger).toHaveFocus();
    });
  });

  describe('Input Types', () => {
    it('accepts different input types', () => {
      render(<TextField {...defaultProps} type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('handles password type', () => {
      render(<TextField {...defaultProps} type="password" />);

      const input = screen.getByLabelText('Test Label');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('handles number type', () => {
      render(<TextField {...defaultProps} type="number" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to input', () => {
      render(<TextField {...defaultProps} className="custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('preserves default classes when custom className is provided', () => {
      render(<TextField {...defaultProps} className="custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('flex');
      expect(input).toHaveClass('h-[55px]');
    });
  });

  describe('Forwarded Ref', () => {
    it('forwards ref to input element', () => {
      let inputRef: HTMLInputElement | null = null;

      render(
        <TextField
          {...defaultProps}
          ref={(ref) => {
            inputRef = ref;
          }}
        />
      );

      expect(inputRef).toBeInstanceOf(HTMLInputElement);
      expect(inputRef!.tagName.toLowerCase()).toBe('input');
    });
  });
});
