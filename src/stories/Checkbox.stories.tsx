import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { userEvent, within, expect } from 'storybook/test';

import { Checkbox } from '@/shared/components/shadcn';
import { Label } from '@/shared/components/shadcn';

const meta: Meta<typeof Checkbox> = {
  title: 'shared/components/shadcn/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A checkbox component built on Radix UI Checkbox primitive. Features smooth animations, proper accessibility, keyboard navigation, and support for indeterminate states. Perfect for forms, lists, and multi-selection interfaces.',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    onCheckedChange: {
      description: 'Callback fired when the checked state changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unchecked checkbox.
 * Shows the basic checkbox in its initial unchecked state.
 */
export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBeDisabled();

    // Click to check
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Click again to uncheck
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  },
};

/**
 * Checkbox that starts in checked state.
 * Demonstrates default checked behavior.
 */
export const DefaultChecked: Story = {
  args: {
    defaultChecked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    // Click to uncheck
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  },
};

/**
 * Disabled checkbox in unchecked state.
 * Shows how disabled checkboxes appear and behave.
 */
export const DisabledUnchecked: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    // Try to click (should not work)
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  },
};

/**
 * Disabled checkbox in checked state.
 * Shows disabled checked appearance.
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();

    // Try to click (should not work)
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  },
};

/**
 * Checkbox with label for better accessibility.
 * Demonstrates proper labeling and click target expansion.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    const labelText = canvas.getByText('I agree to the terms and conditions');

    expect(checkbox).not.toBeChecked();

    // Click the label to check the checkbox
    await userEvent.click(labelText);
    expect(checkbox).toBeChecked();

    // Click label again to uncheck
    await userEvent.click(labelText);
    expect(checkbox).not.toBeChecked();
  },
};

/**
 * Keyboard navigation and accessibility.
 * Tests keyboard interaction patterns.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1">First option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2">Second option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">Third option</Label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstCheckbox = canvas.getByLabelText('First option');
    const secondCheckbox = canvas.getByLabelText('Second option');
    const thirdCheckbox = canvas.getByLabelText('Third option');

    // Test basic presence and accessibility
    expect(firstCheckbox).toBeInTheDocument();
    expect(secondCheckbox).toBeInTheDocument();
    expect(thirdCheckbox).toBeInTheDocument();
    expect(firstCheckbox).not.toBeChecked();
    expect(secondCheckbox).not.toBeChecked();
    expect(thirdCheckbox).not.toBeChecked();

    // Test focus behavior
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).toHaveFocus();

    // Test tab navigation
    await userEvent.keyboard('{Tab}');
    expect(secondCheckbox).toHaveFocus();

    await userEvent.keyboard('{Tab}');
    expect(thirdCheckbox).toHaveFocus();

    // Test click interaction
    await userEvent.click(thirdCheckbox);
    expect(thirdCheckbox).toBeChecked();
  },
};

/**
 * Checkbox list for multiple selections.
 * Shows common usage pattern in forms and lists.
 */
export const CheckboxList: Story = {
  render: () => (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Select your interests</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-tech" defaultChecked />
          <Label htmlFor="interest-tech">Technology</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-design" />
          <Label htmlFor="interest-design">Design</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-business" />
          <Label htmlFor="interest-business">Business</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-science" defaultChecked />
          <Label htmlFor="interest-science">Science</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-arts" />
          <Label htmlFor="interest-arts">Arts & Culture</Label>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const techCheckbox = canvas.getByLabelText('Technology');
    const designCheckbox = canvas.getByLabelText('Design');
    const businessCheckbox = canvas.getByLabelText('Business');
    const scienceCheckbox = canvas.getByLabelText('Science');
    const artsCheckbox = canvas.getByLabelText('Arts & Culture');

    // Verify initial states
    expect(techCheckbox).toBeChecked();
    expect(designCheckbox).not.toBeChecked();
    expect(businessCheckbox).not.toBeChecked();
    expect(scienceCheckbox).toBeChecked();
    expect(artsCheckbox).not.toBeChecked();

    // Select Design and Business
    await userEvent.click(designCheckbox);
    await userEvent.click(businessCheckbox);

    expect(designCheckbox).toBeChecked();
    expect(businessCheckbox).toBeChecked();

    // Deselect Technology
    await userEvent.click(techCheckbox);
    expect(techCheckbox).not.toBeChecked();
  },
};

/**
 * Checkbox with additional description.
 * Shows pattern for providing context with checkboxes.
 */
export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Checkbox id="marketing-emails" className="mt-1" />
        <div>
          <Label htmlFor="marketing-emails" className="text-base font-medium">
            Marketing emails
          </Label>
          <p className="mt-1 text-sm text-gray-500">
            Receive promotional content, product updates, and special offers
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox id="security-alerts" className="mt-1" defaultChecked />
        <div>
          <Label htmlFor="security-alerts" className="text-base font-medium">
            Security alerts
          </Label>
          <p className="mt-1 text-sm text-gray-500">
            Important notifications about your account security
          </p>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const marketingCheckbox = canvas.getByLabelText('Marketing emails');
    const securityCheckbox = canvas.getByLabelText('Security alerts');

    expect(marketingCheckbox).not.toBeChecked();
    expect(securityCheckbox).toBeChecked();

    // Click the label to toggle marketing emails
    const marketingLabel = canvas.getByText('Marketing emails');
    await userEvent.click(marketingLabel);
    expect(marketingCheckbox).toBeChecked();
  },
};

/**
 * Checkbox in a form context.
 * Shows integration with form validation and submission.
 */
export const InFormContext: Story = {
  render: () => (
    <form className="max-w-md space-y-6 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Account Preferences</h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="two-factor" />
          <Label htmlFor="two-factor">Enable two-factor authentication</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="public-profile" defaultChecked />
          <Label htmlFor="public-profile">Make profile public</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="data-sharing" />
          <Label htmlFor="data-sharing">Allow data sharing for analytics</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms-required" required />
          <Label htmlFor="terms-required">
            I agree to the{' '}
            <a href="#" className="text-blue-600 underline">
              Terms of Service
            </a>{' '}
            *
          </Label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        Save Preferences
      </button>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const twoFactorCheckbox = canvas.getByLabelText(
      'Enable two-factor authentication'
    );
    const publicProfileCheckbox = canvas.getByLabelText('Make profile public');
    const dataSharingCheckbox = canvas.getByLabelText(
      'Allow data sharing for analytics'
    );
    const termsCheckbox = canvas.getByLabelText(
      /I agree to the Terms of Service/
    );

    // Verify initial states
    expect(twoFactorCheckbox).not.toBeChecked();
    expect(publicProfileCheckbox).toBeChecked();
    expect(dataSharingCheckbox).not.toBeChecked();
    expect(termsCheckbox).not.toBeChecked();

    // Enable two-factor auth and data sharing
    await userEvent.click(twoFactorCheckbox);
    await userEvent.click(dataSharingCheckbox);

    expect(twoFactorCheckbox).toBeChecked();
    expect(dataSharingCheckbox).toBeChecked();

    // Must agree to terms to submit
    await userEvent.click(termsCheckbox);
    expect(termsCheckbox).toBeChecked();
  },
};

/**
 * Custom styled checkbox.
 * Demonstrates how to apply custom styling while maintaining functionality.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="custom-green"
          className="border-green-400 data-[state=checked]:bg-green-600"
        />
        <Label htmlFor="custom-green">Green checkbox</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="custom-red"
          className="h-5 w-5 border-red-400 data-[state=checked]:bg-red-600"
        />
        <Label htmlFor="custom-red">Red larger checkbox</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="custom-purple"
          className="rounded-full border-purple-400 data-[state=checked]:bg-purple-600"
        />
        <Label htmlFor="custom-purple">Purple rounded checkbox</Label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const greenCheckbox = canvas.getByLabelText('Green checkbox');
    const redCheckbox = canvas.getByLabelText('Red larger checkbox');
    const purpleCheckbox = canvas.getByLabelText('Purple rounded checkbox');

    // Check all custom checkboxes
    await userEvent.click(greenCheckbox);
    await userEvent.click(redCheckbox);
    await userEvent.click(purpleCheckbox);

    expect(greenCheckbox).toBeChecked();
    expect(redCheckbox).toBeChecked();
    expect(purpleCheckbox).toBeChecked();
  },
};

/**
 * Controlled checkbox state.
 * Demonstrates controlled vs uncontrolled usage.
 */
export const ControlledState: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = React.useState(false);
    const [count, setCount] = React.useState(0);

    const handleCheckedChange = (isChecked: boolean) => {
      setChecked(isChecked);
      setCount((prev) => prev + 1);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controlled-checkbox"
            checked={checked}
            onCheckedChange={handleCheckedChange}
          />
          <Label htmlFor="controlled-checkbox">
            Controlled checkbox ({checked ? 'Checked' : 'Unchecked'})
          </Label>
        </div>

        <p className="text-sm text-gray-600">Changed {count} times</p>

        <button
          onClick={() => handleCheckedChange(!checked)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Toggle from outside
        </button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    const button = canvas.getByText('Toggle from outside');
    const label = canvas.getByText(/Controlled checkbox/);
    const counter = canvas.getByText(/Changed \d+ times/);

    // Initially unchecked
    expect(checkbox).not.toBeChecked();
    expect(label).toHaveTextContent('Controlled checkbox (Unchecked)');
    expect(counter).toHaveTextContent('Changed 0 times');

    // Toggle with checkbox
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(label).toHaveTextContent('Controlled checkbox (Checked)');
    expect(counter).toHaveTextContent('Changed 1 times');

    // Toggle with external button
    await userEvent.click(button);
    expect(checkbox).not.toBeChecked();
    expect(label).toHaveTextContent('Controlled checkbox (Unchecked)');
    expect(counter).toHaveTextContent('Changed 2 times');
  },
};
