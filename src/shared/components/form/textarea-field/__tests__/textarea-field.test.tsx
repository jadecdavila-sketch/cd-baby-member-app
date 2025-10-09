import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { TextareaField } from '../textarea-field';

describe('TextareaField', () => {
  const defaultProps = {
    id: 'test-field',
    label: 'Test Label',
  };

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<TextareaField {...defaultProps} />);

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('associates label with textarea correctly', () => {
      render(<TextareaField {...defaultProps} />);

      const label = screen.getByText('Test Label');
      const textarea = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'test-field');
      expect(textarea).toHaveAttribute('id', 'test-field');
    });

    it('renders with placeholder text', () => {
      render(<TextareaField {...defaultProps} placeholder="Enter text here" />);

      expect(
        screen.getByPlaceholderText('Enter text here')
      ).toBeInTheDocument();
    });

    it('renders with initial value', () => {
      render(<TextareaField {...defaultProps} value="Initial value" />);

      expect(screen.getByDisplayValue('Initial value')).toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('shows required indicator when required prop is true', () => {
      render(<TextareaField {...defaultProps} required />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');

      // Check for required styling (CSS after content)
      const label = screen.getByText('Test Label');
      expect(label).toHaveClass(/after:content/);
    });

    it('does not show required indicator when required prop is false', () => {
      render(<TextareaField {...defaultProps} required={false} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Tooltip Functionality', () => {
    it('renders tooltip trigger when tooltip prop is provided', () => {
      render(
        <TextareaField {...defaultProps} tooltip="This is helpful information" tooltipId="tooltip-1" />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Label'
      );
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it('does not render tooltip when tooltip prop is not provided', () => {
      render(<TextareaField {...defaultProps} />);

      const tooltipTrigger = screen.queryByLabelText(
        'More information about Test Label'
      );
      expect(tooltipTrigger).not.toBeInTheDocument();
    });

    it('tooltip trigger has proper accessibility attributes', () => {
      render(<TextareaField {...defaultProps} tooltip="Helpful tooltip" tooltipId="tooltip-1" />);

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Label'
      );
      expect(tooltipTrigger).toHaveAttribute('type', 'button');
      expect(tooltipTrigger).toHaveAttribute(
        'aria-label',
        'More information about Test Label'
      );
      expect(tooltipTrigger).toHaveAttribute('id', 'tooltip-1');
    });
  });

  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(<TextareaField {...defaultProps} error="This field is required" />);

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('associates error message with textarea via aria-describedby', () => {
      render(<TextareaField {...defaultProps} error="This field is required" />);

      const textarea = screen.getByRole('textbox');
      const errorMessage = screen.getByText('This field is required');

      expect(textarea).toHaveAttribute('aria-describedby', 'test-field-error');
      expect(errorMessage).toHaveAttribute('id', 'test-field-error');
    });

    it('sets aria-invalid to true when error is present', () => {
      render(<TextareaField {...defaultProps} error="This field is required" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies error styling to textarea', () => {
      render(<TextareaField {...defaultProps} error="This field is required" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-destructive');
      expect(textarea).toHaveClass('focus-visible:ring-destructive');
    });

    it('hides helper text when error is present', () => {
      render(
        <TextareaField
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
        <TextareaField {...defaultProps} helperText="This is helpful information" />
      );

      const helperText = screen.getByText('This is helpful information');
      expect(helperText).toBeInTheDocument();
    });

    it('associates helper text with textarea via aria-describedby', () => {
      render(
        <TextareaField {...defaultProps} helperText="This is helpful information" />
      );

      const textarea = screen.getByRole('textbox');
      const helperText = screen.getByText('This is helpful information');

      expect(textarea).toHaveAttribute('aria-describedby', 'test-field-help');
      expect(helperText).toHaveAttribute('id', 'test-field-help');
    });

    it('does not show helper text when error is present', () => {
      render(
        <TextareaField
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
    it('disables textarea when disabled prop is true', () => {
      render(<TextareaField {...defaultProps} disabled />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('passes disabled prop to textarea element', () => {
      render(<TextareaField {...defaultProps} disabled />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('disabled');
    });
  });

  describe('User Interactions', () => {
    it('allows typing in the textarea field', async () => {
      const user = userEvent.setup();
      render(<TextareaField {...defaultProps} />);

      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'Hello World');
      expect(textarea).toHaveValue('Hello World');
    });

    it('allows multiline text input', async () => {
      const user = userEvent.setup();
      render(<TextareaField {...defaultProps} />);

      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });

    it('focuses textarea when label is clicked', async () => {
      const user = userEvent.setup();
      render(<TextareaField {...defaultProps} />);

      const label = screen.getByText('Test Label');
      const textarea = screen.getByRole('textbox');

      await user.click(label);
      expect(textarea).toHaveFocus();
    });

    it('handles onChange events', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        value = e.target.value;
      };

      render(<TextareaField {...defaultProps} onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'test');

      expect(value).toBe('test');
    });

    it('prevents typing when disabled', async () => {
      const user = userEvent.setup();
      render(<TextareaField {...defaultProps} disabled value="Initial" />);

      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'should not work');
      expect(textarea).toHaveValue('Initial');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes when no error or helper text', () => {
      render(<TextareaField {...defaultProps} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toHaveAttribute('aria-describedby');
      expect(textarea).not.toHaveAttribute('aria-invalid');
    });

    it('has proper ARIA attributes with error', () => {
      render(<TextareaField {...defaultProps} error="Error message" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'test-field-error');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('has proper ARIA attributes with helper text', () => {
      render(<TextareaField {...defaultProps} helperText="Helper text" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'test-field-help');
      expect(textarea).not.toHaveAttribute('aria-invalid');
    });

    it('has proper ARIA attributes when required', () => {
      render(<TextareaField {...defaultProps} required />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
    });

    it('tooltip trigger is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<TextareaField {...defaultProps} tooltip="Tooltip content" tooltipId="tooltip-1" />);

      const tooltipTrigger = screen.getByLabelText(
        'More information about Test Label'
      );

      // Should be focusable via keyboard
      await user.tab();
      expect(tooltipTrigger).toHaveFocus();
    });
  });

  describe('Textarea Specific Properties', () => {
    it('accepts rows prop', () => {
      render(<TextareaField {...defaultProps} rows={5} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('accepts cols prop', () => {
      render(<TextareaField {...defaultProps} cols={50} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('cols', '50');
    });

    it('handles maxLength prop', async () => {
      const user = userEvent.setup();
      render(<TextareaField {...defaultProps} maxLength={10} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxlength', '10');

      await user.type(textarea, 'This text is longer than 10 characters');
      // Only first 10 characters should be in the textarea
      expect(textarea).toHaveValue('This text ');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to textarea', () => {
      render(<TextareaField {...defaultProps} className="custom-class" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
    });

    it('preserves default classes when custom className is provided', () => {
      render(<TextareaField {...defaultProps} className="custom-class" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
      expect(textarea).toHaveClass('flex');
      expect(textarea).toHaveClass('min-h-[80px]');
    });
  });

  describe('Forwarded Ref', () => {
    it('forwards ref to textarea element', () => {
      let textareaRef: HTMLTextAreaElement | null = null;

      render(
        <TextareaField
          {...defaultProps}
          ref={(ref) => {
            textareaRef = ref;
          }}
        />
      );

      expect(textareaRef).toBeInstanceOf(HTMLTextAreaElement);
      expect(textareaRef!.tagName.toLowerCase()).toBe('textarea');
    });
  });
});