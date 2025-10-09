import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userEvent, within, expect } from 'storybook/test';
import { z } from 'zod';

import { SwitchField } from '@/shared/components/form/switch';

const meta: Meta<typeof SwitchField> = {
  title: 'shared/components/form/SwitchField',
  component: SwitchField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A form-integrated switch component with label above, optional tooltip, helper text beside the switch, and error handling. Built for React Hook Form integration with comprehensive accessibility support and theme-aware styling.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the switch',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the switch',
    },
    helperText: {
      control: 'text',
      description: 'Optional helper text displayed beside the switch',
    },
    tooltip: {
      control: 'text',
      description: 'Optional tooltip displayed next to the label',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    onCheckedChange: {
      description: 'Callback fired when the checked state changes',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    name: {
      control: 'text',
      description: 'Form field name',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label override',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SwitchField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default switch field with label.
 * Shows the basic structure with label and switch.
 */
export const Default: Story = {
  args: {
    id: 'default-switch',
    label: 'Enable notifications',
    checked: false,
    onCheckedChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const label = canvas.getByText('Enable notifications');

    expect(switchElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
    expect(switchElement).not.toBeDisabled();

    // Click to toggle
    await userEvent.click(switchElement);
    // Note: In controlled mode, the parent would update the checked state
  },
};

/**
 * Switch field with helper text.
 * Shows additional context provided via helper text beside the switch.
 */
export const WithHelperText: Story = {
  args: {
    id: 'described-switch',
    label: 'Email notifications',
    helperText: 'Receive important updates and announcements via email',
    checked: true,
    onCheckedChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const description = canvas.getByText(
      'Receive important updates and announcements via email'
    );

    expect(switchElement).toBeChecked();
    expect(description).toBeInTheDocument();
    expect(switchElement).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('described-switch-helper')
    );
  },
};

/**
 * Switch field with tooltip.
 * Shows additional context provided via tooltip next to the label.
 */
export const WithTooltip: Story = {
  args: {
    id: 'tooltip-switch',
    label: 'Advanced Settings',
    tooltip: 'Enable this to access advanced configuration options',
    helperText: 'This will unlock additional features',
    checked: false,
    onCheckedChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const label = canvas.getByText('Advanced Settings');
    const tooltip = canvas.getByTitle(
      'Enable this to access advanced configuration options'
    );
    const helperText = canvas.getByText('This will unlock additional features');

    expect(switchElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(tooltip).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  },
};

/**
 * Interactive switch field demo.
 * Demonstrates the color change from gray to dark blue when toggled.
 * Click the switch to see the visual state change.
 */
export const InteractiveDemo: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <SwitchField {...args} checked={checked} onCheckedChange={setChecked} />
        <p className="text-muted-foreground text-sm">
          Current state:{' '}
          <strong>
            {checked ? 'Checked (Dark Blue)' : 'Unchecked (Gray)'}
          </strong>
        </p>
        <p className="text-muted-foreground text-xs">
          Click the switch to see the color change from gray to dark blue
        </p>
      </div>
    );
  },
  args: {
    id: 'interactive-switch',
    label: 'Dark Theme Mode',
    helperText: 'Switch to dark theme',
    tooltip: 'This demonstrates the color change when toggled',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const label = canvas.getByText('Dark Theme Mode');
    const currentState = canvas.getByText(/Current state:/);

    expect(switchElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(currentState).toContainHTML('Unchecked (Gray)');
    expect(switchElement).not.toBeChecked();

    // Click to toggle and verify state change
    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();
    expect(currentState).toContainHTML('Checked (Dark Blue)');

    // Click again to toggle back
    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
    expect(currentState).toContainHTML('Unchecked (Gray)');
  },
};

/**
 * Switch field with error state.
 * Demonstrates error handling and accessibility.
 */
export const WithError: Story = {
  args: {
    id: 'error-switch',
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue',
    checked: false,
    onCheckedChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const error = canvas.getByText('You must accept the terms to continue');

    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute('role', 'alert');
    expect(error).toHaveAttribute('aria-live', 'polite');
    expect(switchElement).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('error-switch-error')
    );
  },
};

/**
 * Disabled switch field.
 * Shows disabled state with appropriate styling.
 */
export const Disabled: Story = {
  args: {
    id: 'disabled-switch',
    label: 'Premium feature',
    helperText: 'Upgrade your plan to access this feature',
    checked: false,
    disabled: true,
    onCheckedChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const label = canvas.getByText('Premium feature');

    expect(switchElement).toBeDisabled();
    expect(label).toHaveClass('cursor-not-allowed', 'opacity-50');

    // Try to click (should not work)
    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  },
};

/**
 * Switch field with all features.
 * Combines description and error handling.
 */
export const Complete: Story = {
  args: {
    id: 'complete-switch',
    label: 'Two-factor authentication',
    helperText: 'Add an extra layer of security to your account',
    error: 'Please enable 2FA for enhanced security',
    checked: false,
    onCheckedChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const description = canvas.getByText(
      'Add an extra layer of security to your account'
    );
    const error = canvas.getByText('Please enable 2FA for enhanced security');

    expect(description).toBeInTheDocument();
    expect(error).toBeInTheDocument();

    const describedBy = switchElement.getAttribute('aria-describedby');
    expect(describedBy).toContain('complete-switch-helper');
    expect(describedBy).toContain('complete-switch-error');
  },
};

/**
 * React Hook Form integration example.
 * Shows how to use SwitchField with form validation.
 */
export const FormIntegration: Story = {
  render: function FormExample() {
    const schema = z.object({
      notifications: z.boolean(),
      marketing: z.boolean(),
      terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
      }),
    });

    type FormData = z.infer<typeof schema>;

    const {
      watch,
      setValue,
      formState: { errors },
      handleSubmit,
    } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        notifications: true,
        marketing: false,
        terms: false,
      },
    });

    const formData = watch();

    const onSubmit = (data: FormData) => {
      alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background space-y-6 p-6"
      >
        <h3 className="text-foreground text-lg font-semibold">
          Account Settings
        </h3>

        <div className="space-y-4">
          <SwitchField
            id="notifications"
            name="notifications"
            label="Email notifications"
            helperText="Receive important updates about your account"
            checked={formData.notifications}
            onCheckedChange={(checked) => setValue('notifications', checked)}
            error={errors.notifications}
          />

          <SwitchField
            id="marketing"
            name="marketing"
            label="Marketing emails"
            helperText="Receive promotional content and special offers"
            checked={formData.marketing}
            onCheckedChange={(checked) => setValue('marketing', checked)}
            error={errors.marketing}
          />

          <SwitchField
            id="terms"
            name="terms"
            label="Accept terms and conditions"
            helperText="I agree to the terms of service and privacy policy"
            checked={formData.terms}
            onCheckedChange={(checked) => setValue('terms', checked)}
            error={errors.terms}
          />
        </div>

        <div className="border-border flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground text-sm">
            Current values: {JSON.stringify(formData)}
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
          >
            Save Settings
          </button>
        </div>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const notificationsSwitch = canvas.getByLabelText('Email notifications');
    const marketingSwitch = canvas.getByLabelText('Marketing emails');
    const termsSwitch = canvas.getByLabelText('Accept terms and conditions');
    const submitButton = canvas.getByText('Save Settings');

    // Test initial states
    expect(notificationsSwitch).toBeChecked();
    expect(marketingSwitch).not.toBeChecked();
    expect(termsSwitch).not.toBeChecked();

    // Try to submit without accepting terms
    await userEvent.click(submitButton);

    // Should show validation error
    const errorMessage = await canvas.findByText(
      'You must accept the terms and conditions'
    );
    expect(errorMessage).toBeInTheDocument();

    // Accept terms and submit
    await userEvent.click(termsSwitch);
    await userEvent.click(submitButton);
  },
};

/**
 * Accessibility demonstration for switch fields.
 * Shows comprehensive accessibility features.
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="bg-background space-y-6 p-6">
      <h3 className="text-foreground text-lg font-semibold">
        Accessibility Features
      </h3>

      <div className="space-y-4">
        {/* Basic switch field */}
        <SwitchField
          id="basic-switch"
          label="Basic switch field"
          checked={false}
          onCheckedChange={() => {}}
        />

        {/* Switch with aria-label override */}
        <SwitchField
          id="aria-label-switch"
          label="Privacy settings"
          aria-label="Enable privacy mode for enhanced security"
          helperText="This setting controls your privacy preferences"
          checked={true}
          onCheckedChange={() => {}}
        />

        {/* Switch with external description */}
        <div>
          <SwitchField
            id="external-desc-switch"
            label="Advanced features"
            aria-describedby="external-description advanced-help"
            checked={false}
            onCheckedChange={() => {}}
          />
          <p
            id="external-description"
            className="text-muted-foreground mt-2 text-sm"
          >
            External description that is referenced by aria-describedby
          </p>
          <p id="advanced-help" className="text-muted-foreground text-xs">
            Additional help text for advanced users
          </p>
        </div>

        {/* Error state */}
        <SwitchField
          id="error-demo-switch"
          label="Required setting"
          helperText="This setting must be enabled to continue"
          error="This field is required"
          checked={false}
          onCheckedChange={() => {}}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test aria-label override
    const ariaLabelSwitch = canvas.getByLabelText(
      'Enable privacy mode for enhanced security'
    );
    expect(ariaLabelSwitch).toHaveAttribute(
      'aria-label',
      'Enable privacy mode for enhanced security'
    );

    // Test external aria-describedby
    const externalDescSwitch = canvas.getByLabelText('Advanced features');
    const describedBy = externalDescSwitch.getAttribute('aria-describedby');
    expect(describedBy).toContain('external-description');
    expect(describedBy).toContain('advanced-help');

    // Test error aria-describedby
    const errorSwitch = canvas.getByLabelText('Required setting');
    expect(errorSwitch).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('error-demo-switch-error')
    );
  },
};

/**
 * Theme variations demonstration.
 * Shows switch fields in different theme contexts.
 */
export const ThemeVariations: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Light theme */}
      <div className="rounded-lg bg-white p-6 text-black">
        <h4 className="mb-4 text-lg font-semibold">Light Theme</h4>
        <div className="space-y-4">
          <SwitchField
            id="light-enabled"
            label="Enabled switch"
            helperText="This switch is enabled and checked"
            checked={true}
            onCheckedChange={() => {}}
          />
          <SwitchField
            id="light-disabled"
            label="Disabled switch"
            helperText="This switch is disabled"
            checked={false}
            disabled
            onCheckedChange={() => {}}
          />
        </div>
      </div>

      {/* Dark theme */}
      <div className="dark rounded-lg bg-black p-6 text-white">
        <h4 className="mb-4 text-lg font-semibold text-white">Dark Theme</h4>
        <div className="space-y-4">
          <SwitchField
            id="dark-enabled"
            label="Enabled switch"
            helperText="This switch is enabled and checked"
            checked={true}
            onCheckedChange={() => {}}
          />
          <SwitchField
            id="dark-disabled"
            label="Disabled switch"
            helperText="This switch is disabled"
            checked={false}
            disabled
            onCheckedChange={() => {}}
          />
        </div>
      </div>

      {/* System theme */}
      <div className="bg-background text-foreground rounded-lg border p-6">
        <h4 className="mb-4 text-lg font-semibold">System Theme</h4>
        <div className="space-y-4">
          <SwitchField
            id="system-enabled"
            label="System theme switch"
            helperText="Uses CSS custom properties for theming"
            checked={true}
            onCheckedChange={() => {}}
          />
          <SwitchField
            id="system-error"
            label="Switch with error"
            error="Validation error message"
            checked={false}
            onCheckedChange={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get all enabled switches
    const enabledSwitches = canvas.getAllByRole('switch', {
      name: /^enabled switch$/i,
    });
    const systemSwitch = canvas.getByRole('switch', {
      name: /system theme switch/i,
    });

    // All enabled switches should be checked
    enabledSwitches.forEach((sw) => {
      expect(sw).toBeChecked();
    });
    expect(systemSwitch).toBeChecked();

    // Disabled switches should be disabled
    const disabledSwitches = canvas.getAllByRole('switch', {
      name: /^disabled switch$/i,
    });

    disabledSwitches.forEach((sw) => {
      expect(sw).toBeDisabled();
    });
  },
};

/**
 * Layout and spacing demonstration.
 * Shows different layout options and spacing.
 */
export const LayoutDemo: Story = {
  render: () => (
    <div className="bg-background space-y-8 p-6">
      <h3 className="text-foreground text-lg font-semibold">Layout Options</h3>

      {/* Compact layout */}
      <div className="space-y-2">
        <h4 className="text-base font-medium">Compact Layout</h4>
        <SwitchField
          id="compact-1"
          label="Quick toggle"
          checked={true}
          onCheckedChange={() => {}}
        />
        <SwitchField
          id="compact-2"
          label="Another quick option"
          checked={false}
          onCheckedChange={() => {}}
        />
      </div>

      {/* Spacious layout */}
      <div className="space-y-6">
        <h4 className="text-base font-medium">Spacious Layout</h4>
        <SwitchField
          id="spacious-1"
          label="Detailed setting"
          helperText="This setting has a detailed description that explains what it does and why you might want to enable it."
          checked={true}
          onCheckedChange={() => {}}
        />
        <SwitchField
          id="spacious-2"
          label="Another detailed setting"
          helperText="Another comprehensive description with helpful context for the user."
          checked={false}
          onCheckedChange={() => {}}
        />
      </div>

      {/* Card layout */}
      <div className="space-y-4">
        <h4 className="text-base font-medium">Card Layout</h4>
        <div className="border-border bg-card rounded-lg border p-4">
          <SwitchField
            id="card-1"
            label="Security setting"
            helperText="Enable enhanced security features"
            checked={true}
            onCheckedChange={() => {}}
          />
        </div>
        <div className="border-border bg-card rounded-lg border p-4">
          <SwitchField
            id="card-2"
            label="Performance setting"
            helperText="Optimize for better performance"
            checked={false}
            onCheckedChange={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that all switches are properly labeled and accessible
    const switches = canvas.getAllByRole('switch');
    expect(switches).toHaveLength(6);

    // Test specific switches
    const quickToggle = canvas.getByLabelText('Quick toggle');
    const detailedSetting = canvas.getByLabelText('Detailed setting');
    const securitySetting = canvas.getByLabelText('Security setting');

    expect(quickToggle).toBeChecked();
    expect(detailedSetting).toBeChecked();
    expect(securitySetting).toBeChecked();
  },
};
