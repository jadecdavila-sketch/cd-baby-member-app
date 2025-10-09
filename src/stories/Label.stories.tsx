import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect } from 'storybook/test';

import { Label } from '@/shared/components/shadcn';
import { Input, Switch, Checkbox } from '@/shared/components/shadcn';

const meta: Meta<typeof Label> = {
  title: 'shared/components/shadcn/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A semantic label component built on Radix UI Label primitive. Provides proper accessibility with form controls and automatically handles disabled states. Essential for accessible forms.',
      },
    },
  },
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'The id of the form control this label is associated with',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Label text content',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic label with text content.
 * Shows the default styling and behavior.
 */
export const Default: Story = {
  args: {
    children: 'Default Label',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Default Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName.toLowerCase()).toBe('label');
  },
};

/**
 * Label associated with an input field.
 * Demonstrates proper form control association.
 */
export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="username">Username *</Label>
      <Input id="username" placeholder="Enter your username" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Username *');
    const input = canvas.getByPlaceholderText('Enter your username');

    expect(label).toHaveAttribute('for', 'username');
    expect(input).toHaveAttribute('id', 'username');

    // Clicking label should focus input
    await userEvent.click(label);
    expect(input).toHaveFocus();
  },
};

/**
 * Label with required field indicator.
 * Shows common pattern for required fields.
 */
export const RequiredField: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">
        Email Address <span className="text-red-500">*</span>
      </Label>
      <Input id="email" type="email" placeholder="you@example.com" required />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText(/Email Address/);
    const asterisk = canvas.getByText('*');
    const input = canvas.getByPlaceholderText('you@example.com');

    expect(asterisk).toBeInTheDocument();
    expect(input).toHaveAttribute('required');

    // Clicking label focuses input
    await userEvent.click(label);
    expect(input).toHaveFocus();
  },
};

/**
 * Label with disabled form control.
 * Shows how label styling adapts to disabled controls.
 */
export const WithDisabledControl: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="disabled-input">Disabled Field</Label>
      <Input id="disabled-input" placeholder="This is disabled" disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Disabled Field');
    const input = canvas.getByPlaceholderText('This is disabled');

    expect(input).toBeDisabled();

    // Clicking disabled control's label should not focus it
    await userEvent.click(label);
    expect(input).not.toHaveFocus();
  },
};

/**
 * Label with checkbox control.
 * Demonstrates label usage with checkbox inputs.
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">
        I agree to the{' '}
        <a href="#" className="text-blue-600 underline">
          terms and conditions
        </a>
      </Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    const label = canvas.getByText(/I agree to the/);

    expect(checkbox).not.toBeChecked();

    // Clicking label should toggle checkbox
    await userEvent.click(label);
    expect(checkbox).toBeChecked();

    // Clicking again should uncheck
    await userEvent.click(label);
    expect(checkbox).not.toBeChecked();
  },
};

/**
 * Label with switch control.
 * Shows label usage with toggle switches.
 */
export const WithSwitch: Story = {
  render: () => (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <Label htmlFor="notifications" className="text-base">
          Push Notifications
        </Label>
        <p className="text-sm text-gray-500">
          Receive notifications on your device
        </p>
      </div>
      <Switch id="notifications" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Push Notifications');
    const switchControl = canvas.getByRole('switch');

    expect(switchControl).not.toBeChecked();

    // Clicking label should toggle switch
    await userEvent.click(label);
    expect(switchControl).toBeChecked();
  },
};

/**
 * Label with help text.
 * Shows pattern for providing additional context.
 */
export const WithHelpText: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter password" />
      <p className="text-sm text-gray-500">
        Must be at least 8 characters with uppercase, lowercase, and numbers
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Password');
    const input = canvas.getByPlaceholderText('Enter password');
    const helpText = canvas.getByText(/Must be at least 8 characters/);

    expect(helpText).toBeInTheDocument();

    await userEvent.click(label);
    expect(input).toHaveFocus();
  },
};

/**
 * Label with error state.
 * Demonstrates error styling and messaging.
 */
export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email-error" className="text-red-700">
        Email Address
      </Label>
      <Input
        id="email-error"
        type="email"
        placeholder="you@example.com"
        className="border-red-500 focus:ring-red-500"
        aria-invalid="true"
      />
      <p className="text-sm text-red-600">Please enter a valid email address</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Email Address');
    const input = canvas.getByPlaceholderText('you@example.com');
    const errorMessage = canvas.getByText('Please enter a valid email address');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(errorMessage).toBeInTheDocument();

    await userEvent.click(label);
    expect(input).toHaveFocus();
  },
};

/**
 * Custom styled label.
 * Shows how to apply custom styling while maintaining functionality.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-2">
      <Label
        htmlFor="custom-input"
        className="text-lg font-bold tracking-wide text-purple-700 uppercase"
      >
        Custom Styled Label
      </Label>
      <Input id="custom-input" placeholder="Input with custom label" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Custom Styled Label');
    const input = canvas.getByPlaceholderText('Input with custom label');

    await userEvent.click(label);
    expect(input).toHaveFocus();
  },
};

/**
 * Multiple form fields with labels.
 * Shows a complete form section with proper labeling.
 */
export const FormSection: Story = {
  render: () => (
    <div className="space-y-6 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Personal Information</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name *</Label>
          <Input id="first-name" placeholder="John" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name *</Label>
          <Input id="last-name" placeholder="Doe" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={3}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter-signup" />
        <Label htmlFor="newsletter-signup">Subscribe to our newsletter</Label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstNameLabel = canvas.getByText('First Name *');
    const lastNameLabel = canvas.getByText('Last Name *');
    const bioLabel = canvas.getByText('Bio');
    const newsletterLabel = canvas.getByText('Subscribe to our newsletter');

    const firstNameInput = canvas.getByPlaceholderText('John');
    const lastNameInput = canvas.getByPlaceholderText('Doe');
    const bioInput = canvas.getByPlaceholderText('Tell us about yourself...');
    const checkbox = canvas.getByRole('checkbox');

    // Test all label associations
    await userEvent.click(firstNameLabel);
    expect(firstNameInput).toHaveFocus();

    await userEvent.click(lastNameLabel);
    expect(lastNameInput).toHaveFocus();

    await userEvent.click(bioLabel);
    expect(bioInput).toHaveFocus();

    await userEvent.click(newsletterLabel);
    expect(checkbox).toBeChecked();
  },
};
