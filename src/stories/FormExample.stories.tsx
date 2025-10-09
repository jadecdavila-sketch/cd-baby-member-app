import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';
import { userEvent, within, waitFor, expect, screen } from 'storybook/test';

import { ExampleForm } from '@/modules/example-form';

const meta: Meta<typeof ExampleForm> = {
  title: 'Examples/Form Management/React Hook Form - Zod',
  component: ExampleForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive example form demonstrating React Hook Form with Zod validation, including email validation, conditional fields, and proper error handling.',
      },
    },
  },
  argTypes: {
    onSuccess: {
      description:
        'Callback function called when form is submitted successfully',
    },
    onError: {
      description: 'Callback function called when form submission fails',
    },
    className: {
      description: 'Additional CSS classes to apply to the form card',
    },
  },
} satisfies Meta<typeof ExampleForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default form with all validation features.
 * This story demonstrates the complete form with all fields and validation rules.
 */
export const Default: Story = {
  args: {
    onSuccess: action('Form submitted successfully'),
    onError: action('Form submission error'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Test that form renders correctly
    await waitFor(() => {
      expect(canvas.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(canvas.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(canvas.getByLabelText(/phone number/i)).toBeInTheDocument();
    });
  },
};

/**
 * Form validation errors demonstration.
 * This story shows how validation errors appear when required fields are empty or invalid.
 */
export const ValidationErrors: Story = {
  args: {
    onSuccess: action('Form submitted successfully'),
    onError: action('Form submission error'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Try to submit empty form to trigger validation
    const submitButton = canvas.getByRole('button', { name: /submit form/i });
    await userEvent.click(submitButton);

    // Check that validation errors appear
    await waitFor(() => {
      expect(canvas.getByText(/name is required/i)).toBeInTheDocument();
      expect(canvas.getByText(/email is required/i)).toBeInTheDocument();
      expect(canvas.getByText(/phone number is required/i)).toBeInTheDocument();
    });

    // Test invalid email format
    const emailInput = canvas.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        canvas.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  },
};

/**
 * Newsletter subscription conditional field.
 * This story demonstrates how the newsletter preferences field appears when newsletter is checked.
 */
export const NewsletterConditional: Story = {
  args: {
    onSuccess: action('Form submitted successfully'),
    onError: action('Form submission error'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Initially newsletter preferences should not be visible
    await waitFor(() => {
      expect(
        canvas.queryByLabelText(/newsletter frequency/i)
      ).not.toBeInTheDocument();
    });

    // Check the newsletter checkbox
    const newsletterCheckbox = canvas.getByLabelText(
      /subscribe to newsletter/i
    );
    await userEvent.click(newsletterCheckbox);

    // Now newsletter preferences should be visible
    await waitFor(() => {
      expect(
        canvas.getByLabelText(/newsletter frequency/i)
      ).toBeInTheDocument();
    });

    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Select a newsletter preference
    const preferencesSelect = canvas.getByLabelText(/newsletter frequency/i);
    await userEvent.click(preferencesSelect);

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Weekly updates' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Monthly updates' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Announcements only' })
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole('option', { name: 'Weekly updates' })
    );
  },
};

/**
 * Complete form submission flow.
 * This story demonstrates a successful form submission with all required fields filled.
 */
export const SuccessfulSubmission: Story = {
  args: {
    onSuccess: action('Form submitted successfully'),
    onError: action('Form submission error'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Fill out all required fields
    await userEvent.type(canvas.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(
      canvas.getByLabelText(/email address/i),
      'john@example.com'
    );
    await userEvent.type(canvas.getByLabelText(/phone number/i), '+1234567890');

    // Select country
    const countrySelect = canvas.getByLabelText(/country/i);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(countrySelect);
    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'United States' })
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByRole('option', { name: 'United States' })
    );

    // Subscribe to newsletter and set preferences
    const newsletterCheckbox = canvas.getByLabelText(
      /subscribe to newsletter/i
    );
    await userEvent.click(newsletterCheckbox);

    await waitFor(() => {
      expect(
        canvas.getByLabelText(/newsletter frequency/i)
      ).toBeInTheDocument();
    });

    const preferencesSelect = canvas.getByLabelText(/newsletter frequency/i);
    await userEvent.click(preferencesSelect);
    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Monthly updates' })
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByRole('option', { name: 'Monthly updates' })
    );

    // Add optional message
    await userEvent.type(
      canvas.getByLabelText(/additional message/i),
      'This is a test message from the Storybook example.'
    );

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /submit form/i });
    await userEvent.click(submitButton);

    // Check that submit button shows loading state
    await waitFor(() => {
      expect(canvas.getByText(/submitting/i)).toBeInTheDocument();
    });
  },
};

/**
 * Phone number validation demonstration.
 * This story shows phone number format validation.
 */
export const PhoneValidation: Story = {
  args: {
    onSuccess: action('Form submitted successfully'),
    onError: action('Form submission error'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    const phoneInput = canvas.getByLabelText(/phone number/i);
    const submitButton = canvas.getByRole('button', { name: /submit form/i });

    // Test invalid phone format
    await userEvent.type(phoneInput, '123456789012345678901234567890');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        canvas.getByText(/please enter a valid phone number/i)
      ).toBeInTheDocument();
    });

    // Clear and enter valid phone
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '+1234567890');
  },
};

/**
 * Reset form functionality.
 * This story demonstrates the reset form functionality.
 */
export const ResetForm: Story = {
  args: {
    onSuccess: action('Form submitted successfully'),
    onError: action('Form submission error'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Fill out some fields
    await userEvent.type(canvas.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(
      canvas.getByLabelText(/email address/i),
      'john@example.com'
    );

    // Check that fields have values
    expect(canvas.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(canvas.getByDisplayValue('john@example.com')).toBeInTheDocument();

    // Click reset button
    const resetButton = canvas.getByRole('button', { name: /reset form/i });
    await userEvent.click(resetButton);

    // Check that fields are cleared
    await waitFor(() => {
      expect(canvas.queryByDisplayValue('John Doe')).not.toBeInTheDocument();
      expect(
        canvas.queryByDisplayValue('john@example.com')
      ).not.toBeInTheDocument();
    });
  },
};
