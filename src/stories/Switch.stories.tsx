import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { userEvent, within, expect } from 'storybook/test';

import { Switch } from '@/shared/components/shadcn/switch';
import { Label } from '@/shared/components/shadcn';

const meta: Meta<typeof Switch> = {
  title: 'shared/components/form/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An accessible toggle switch component built on Radix UI Switch primitive with comprehensive theme support. Features proper ARIA attributes, keyboard navigation, focus management, and light/dark mode styling using CSS custom properties.',
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unchecked switch.
 * Shows the basic switch in its initial unchecked state.
 */
export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
    expect(switchElement).not.toBeDisabled();

    // Click to toggle
    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();

    // Click again to toggle back
    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  },
};

/**
 * Switch that starts in checked state.
 * Demonstrates default checked behavior.
 */
export const DefaultChecked: Story = {
  args: {
    defaultChecked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    expect(switchElement).toBeChecked();

    // Click to uncheck
    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  },
};

/**
 * Disabled switch in unchecked state.
 * Shows how disabled switches appear and behave.
 */
export const DisabledUnchecked: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).not.toBeChecked();

    // Try to click (should not work)
    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  },
};

/**
 * Disabled switch in checked state.
 * Shows disabled checked appearance.
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toBeChecked();

    // Try to click (should not work)
    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();
  },
};

/**
 * Interactive color change demo.
 * Shows the visual transition from gray to dark blue when toggled.
 */
export const ColorChangeDemo: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Switch
            id="color-demo"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <label htmlFor="color-demo" className="text-sm font-medium">
            Toggle to see color change
          </label>
        </div>
        <div className="text-sm space-y-1">
          <p>Current state: <strong>{checked ? 'Checked' : 'Unchecked'}</strong></p>
          <p>Track color: <strong>{checked ? 'Dark Blue (#031c9b)' : 'Gray'}</strong></p>
          <p className="text-xs text-muted-foreground">
            Click the switch to see the visual feedback
          </p>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const stateText = canvas.getByText(/Current state:/);

    expect(switchElement).not.toBeChecked();
    expect(stateText).toContainHTML('Unchecked');

    // Click to toggle
    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();
    expect(stateText).toContainHTML('Checked');

    // Click to toggle back
    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
    expect(stateText).toContainHTML('Unchecked');
  },
};

/**
 * Switch with label for better accessibility.
 * Demonstrates proper labeling and click target expansion.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const label = canvas.getByLabelText('Enable notifications');

    expect(switchElement).toBe(label);
    expect(switchElement).not.toBeChecked();

    // Click the label to toggle the switch
    const labelElement = canvas.getByText('Enable notifications');
    await userEvent.click(labelElement);

    expect(switchElement).toBeChecked();
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
        <Switch id="switch1" />
        <Label htmlFor="switch1">First switch</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="switch2" />
        <Label htmlFor="switch2">Second switch</Label>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const firstSwitch = canvas.getByLabelText('First switch');
    const secondSwitch = canvas.getByLabelText('Second switch');

    // Test basic presence and accessibility
    expect(firstSwitch).toBeInTheDocument();
    expect(secondSwitch).toBeInTheDocument();
    expect(firstSwitch).not.toBeChecked();
    expect(secondSwitch).not.toBeChecked();

    // Test focus behavior
    await userEvent.click(firstSwitch);
    expect(firstSwitch).toHaveFocus();

    // Test tab navigation
    await userEvent.keyboard('{Tab}');
    expect(secondSwitch).toHaveFocus();

    // Test click interaction
    await userEvent.click(secondSwitch);
    expect(secondSwitch).toBeChecked();
  },
};

/**
 * Switch in a settings panel context.
 * Shows common usage pattern in settings forms with proper theme support.
 */
export const SettingsPanel: Story = {
  render: () => (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold text-card-foreground">Notification Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label
              htmlFor="email-notifications"
              className="text-sm font-medium text-card-foreground"
            >
              Email notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch id="email-notifications" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="push-notifications" className="text-sm font-medium text-card-foreground">
              Push notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications on your devices
            </p>
          </div>
          <Switch id="push-notifications" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="marketing-emails" className="text-sm font-medium text-card-foreground">
              Marketing emails
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive promotional content and updates
            </p>
          </div>
          <Switch id="marketing-emails" disabled />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailSwitch = canvas.getByLabelText('Email notifications');
    const pushSwitch = canvas.getByLabelText('Push notifications');
    const marketingSwitch = canvas.getByLabelText('Marketing emails');

    // Email should start checked
    expect(emailSwitch).toBeChecked();

    // Push should start unchecked
    expect(pushSwitch).not.toBeChecked();

    // Marketing should be disabled
    expect(marketingSwitch).toBeDisabled();

    // Toggle push notifications
    await userEvent.click(pushSwitch);
    expect(pushSwitch).toBeChecked();

    // Try to toggle marketing (should not work)
    await userEvent.click(marketingSwitch);
    expect(marketingSwitch).not.toBeChecked();
  },
};

/**
 * Custom styled switch.
 * Demonstrates how to apply custom styling.
 */
export const CustomStyling: Story = {
  args: {
    className:
      'data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-200',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    expect(switchElement).not.toBeChecked();

    // Toggle to see the custom green color
    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();

    // Toggle back to see custom red color
    await userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  },
};

/**
 * Switch with controlled state.
 * Demonstrates controlled vs uncontrolled usage.
 */
export const ControlledState: Story = {
  render: function ControlledSwitch() {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="controlled-switch"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Label htmlFor="controlled-switch">
            Controlled switch ({checked ? 'On' : 'Off'})
          </Label>
        </div>

        <button
          onClick={() => setChecked(!checked)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Toggle from outside
        </button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const switchElement = canvas.getByRole('switch');
    const button = canvas.getByText('Toggle from outside');
    const label = canvas.getByText(/Controlled switch/);

    // Initially off
    expect(switchElement).not.toBeChecked();
    expect(label).toHaveTextContent('Controlled switch (Off)');

    // Toggle with switch
    await userEvent.click(switchElement);
    expect(switchElement).toBeChecked();
    expect(label).toHaveTextContent('Controlled switch (On)');

    // Toggle with external button
    await userEvent.click(button);
    expect(switchElement).not.toBeChecked();
    expect(label).toHaveTextContent('Controlled switch (Off)');
  },
};

/**
 * Accessibility demonstration.
 * Shows comprehensive accessibility features including ARIA attributes.
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6 bg-background p-6">
      <h3 className="text-lg font-semibold text-foreground">Accessibility Features</h3>

      <div className="space-y-4">
        {/* Switch with aria-label */}
        <div className="flex items-center space-x-3">
          <Switch id="aria-label-switch" aria-label="Enable dark mode" />
          <span className="text-sm text-muted-foreground">
            Switch with aria-label (no visible label)
          </span>
        </div>

        {/* Switch with aria-describedby */}
        <div className="flex items-center space-x-3">
          <Switch
            id="described-switch"
            aria-describedby="switch-description"
          />
          <Label htmlFor="described-switch" className="text-sm font-medium">
            Premium features
          </Label>
        </div>
        <p id="switch-description" className="text-sm text-muted-foreground">
          Enable premium features including advanced analytics and priority support
        </p>

        {/* Switch with complex labeling */}
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="complex-switch" className="text-sm font-medium">
                Two-factor authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              id="complex-switch"
              aria-describedby="complex-switch-help"
            />
          </div>
          <p
            id="complex-switch-help"
            className="mt-2 text-xs text-muted-foreground"
          >
            When enabled, you'll need your phone to sign in
          </p>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test aria-label switch
    const ariaLabelSwitch = canvas.getByLabelText('Enable dark mode');
    expect(ariaLabelSwitch).toBeInTheDocument();
    expect(ariaLabelSwitch).toHaveAttribute('aria-label', 'Enable dark mode');

    // Test aria-describedby switch
    const describedSwitch = canvas.getByLabelText('Premium features');
    expect(describedSwitch).toHaveAttribute('aria-describedby', 'switch-description');

    // Test complex switch
    const complexSwitch = canvas.getByLabelText('Two-factor authentication');
    expect(complexSwitch).toHaveAttribute('aria-describedby', 'complex-switch-help');

    // Test keyboard navigation
    await userEvent.tab();
    expect(ariaLabelSwitch).toHaveFocus();

    await userEvent.keyboard(' ');
    expect(ariaLabelSwitch).toBeChecked();
  },
};

/**
 * Theme demonstration.
 * Shows switch behavior in light and dark themes.
 */
export const ThemeDemo: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Light theme simulation */}
      <div className="rounded-lg bg-white p-6 text-black">
        <h4 className="mb-4 text-lg font-semibold">Light Theme</h4>
        <div className="flex items-center space-x-3">
          <Switch id="light-switch" defaultChecked />
          <Label htmlFor="light-switch">Sample switch in light mode</Label>
        </div>
      </div>

      {/* Dark theme simulation */}
      <div className="dark rounded-lg bg-black p-6 text-white">
        <h4 className="mb-4 text-lg font-semibold">Dark Theme</h4>
        <div className="flex items-center space-x-3">
          <Switch id="dark-switch" defaultChecked />
          <Label htmlFor="dark-switch" className="text-white">
            Sample switch in dark mode
          </Label>
        </div>
      </div>

      {/* System theme */}
      <div className="bg-background text-foreground rounded-lg border p-6">
        <h4 className="mb-4 text-lg font-semibold">System Theme</h4>
        <div className="flex items-center space-x-3">
          <Switch id="system-switch" defaultChecked />
          <Label htmlFor="system-switch">
            Switch using system theme variables
          </Label>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const lightSwitch = canvas.getByLabelText('Sample switch in light mode');
    const darkSwitch = canvas.getByLabelText('Sample switch in dark mode');
    const systemSwitch = canvas.getByLabelText('Switch using system theme variables');

    // All switches should be checked by default
    expect(lightSwitch).toBeChecked();
    expect(darkSwitch).toBeChecked();
    expect(systemSwitch).toBeChecked();

    // Test that they can be toggled
    await userEvent.click(lightSwitch);
    expect(lightSwitch).not.toBeChecked();

    await userEvent.click(darkSwitch);
    expect(darkSwitch).not.toBeChecked();
  },
};

/**
 * Replicates the design from the screenshot.
 * Shows switch with right-aligned label matching the provided design.
 */
export const DesignReplication: Story = {
  render: () => (
    <div className="bg-background text-foreground space-y-6 p-6">
      <h3 className="text-lg font-semibold">Design Replication</h3>

      {/* Main question */}
      <div className="space-y-4">
        <h4 className="text-base">Do you have your own ISRC for this track?</h4>

        {/* Switch with label matching screenshot */}
        <div className="flex items-center space-x-3">
          <Switch id="isrc-switch" />
          <Label htmlFor="isrc-switch" className="text-sm">
            No Assign one for me
          </Label>
        </div>
      </div>

      {/* Additional examples */}
      <div className="space-y-4 border-t border-border pt-6">
        <h4 className="text-base">Additional Examples</h4>

        <div className="flex items-center space-x-3">
          <Switch id="example-1" defaultChecked />
          <Label htmlFor="example-1" className="text-sm">
            Enable automatic release
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Switch id="example-2" />
          <Label htmlFor="example-2" className="text-sm">
            Include in artist profile
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Switch id="example-3" disabled />
          <Label htmlFor="example-3" className="text-sm opacity-50">
            Premium feature (disabled)
          </Label>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const isrcSwitch = canvas.getByLabelText('No Assign one for me');
    const autoSwitch = canvas.getByLabelText('Enable automatic release');
    const profileSwitch = canvas.getByLabelText('Include in artist profile');
    const premiumSwitch = canvas.getByLabelText('Premium feature (disabled)');

    // Test initial states
    expect(isrcSwitch).not.toBeChecked();
    expect(autoSwitch).toBeChecked();
    expect(profileSwitch).not.toBeChecked();
    expect(premiumSwitch).toBeDisabled();

    // Test interactions
    await userEvent.click(isrcSwitch);
    expect(isrcSwitch).toBeChecked();

    await userEvent.click(profileSwitch);
    expect(profileSwitch).toBeChecked();

    // Disabled switch should not respond
    await userEvent.click(premiumSwitch);
    expect(premiumSwitch).not.toBeChecked();
  },
};
