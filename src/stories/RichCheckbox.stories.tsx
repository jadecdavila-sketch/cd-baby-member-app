import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { userEvent, within, expect } from 'storybook/test';
import { Music, Bell, Crown, Zap, Package, Star } from 'lucide-react';

import { RichCheckbox } from '@/shared/components/form/rich-checkbox';

const meta: Meta<typeof RichCheckbox> = {
  title: 'shared/components/form/RichCheckbox',
  component: RichCheckbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A rich checkbox component that supports icons, title/subtitle content, price display, and follows accessibility best practices. Built on top of native HTML checkbox with proper ARIA support.',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controls the checked state of the checkbox',
    },
    title: {
      control: 'text',
      description: 'Main title text for the checkbox',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle text for additional information',
    },
    price: {
      control: 'text',
      description: 'Optional price text to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox interaction',
    },
    icon: {
      control: false,
      description: 'Lucide icon or custom icon component',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when checkbox state changes',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RichCheckbox>;

// Interactive wrapper component for stories
const InteractiveRichCheckbox = (args: any) => {
  const [checked, setChecked] = useState(args.checked || false);

  return (
    <RichCheckbox
      {...args}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        args.onChange?.(e);
      }}
    />
  );
};

// Basic Stories
export const Default: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'default-checkbox',
    title: 'Basic Plan',
    checked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    const title = canvas.getByText('Basic Plan');

    expect(checkbox).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBeDisabled();

    // Test clicking to check
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Test clicking to uncheck
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  },
};

export const WithSubtitle: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'subtitle-checkbox',
    title: 'Premium Plan',
    subtitle: 'Includes advanced features and priority support',
    checked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    const title = canvas.getByText('Premium Plan');
    const subtitle = canvas.getByText('Includes advanced features and priority support');

    expect(checkbox).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Test interaction
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  },
};

export const WithPrice: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'price-checkbox',
    title: 'Professional Plan',
    price: '$29.99',
    checked: false,
  },
};

export const WithIcon: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'icon-checkbox',
    title: 'Music Distribution',
    subtitle: 'Upload and distribute your music worldwide',
    icon: Music,
    checked: false,
  },
};

export const Complete: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'complete-checkbox',
    title: 'Ultimate Plan',
    subtitle: 'Everything you need to succeed as an artist',
    price: '$59.99',
    icon: Crown,
    checked: false,
  },
};

export const Checked: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'checked-checkbox',
    title: 'Selected Plan',
    subtitle: 'This plan is currently selected',
    price: '$19.99',
    icon: Star,
    checked: true,
  },
};

export const Disabled: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'disabled-checkbox',
    title: 'Unavailable Plan',
    subtitle: 'This plan is currently unavailable',
    price: '$99.99',
    icon: Package,
    checked: false,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkbox = canvas.getByRole('checkbox');
    const title = canvas.getByText('Unavailable Plan');
    const subtitle = canvas.getByText('This plan is currently unavailable');
    const price = canvas.getByText('$99.99');

    expect(checkbox).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    // Try to click (should not work)
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  },
};

export const DisabledChecked: Story = {
  render: InteractiveRichCheckbox,
  args: {
    id: 'disabled-checked-checkbox',
    title: 'Current Plan',
    subtitle: 'Your active subscription',
    price: '$29.99',
    icon: Zap,
    checked: true,
    disabled: true,
  },
};

// Group of checkboxes story
export const MultipleOptions: Story = {
  render: () => {
    const [selectedPlans, setSelectedPlans] = useState({
      basic: false,
      premium: true,
      ultimate: false,
    });

    const handleChange =
      (plan: keyof typeof selectedPlans) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPlans((prev) => ({
          ...prev,
          [plan]: e.target.checked,
        }));
      };

    return (
      <div className="max-w-md space-y-4">
        <h3 className="mb-4 text-lg font-semibold">Choose Your Plans</h3>

        <RichCheckbox
          id="basic-plan"
          title="Basic Plan"
          subtitle="Essential music distribution features"
          price="$9.99"
          icon={Package}
          checked={selectedPlans.basic}
          onChange={handleChange('basic')}
        />

        <RichCheckbox
          id="premium-plan"
          title="Premium Plan"
          subtitle="Advanced analytics and marketing tools"
          price="$29.99"
          icon={Star}
          checked={selectedPlans.premium}
          onChange={handleChange('premium')}
        />

        <RichCheckbox
          id="ultimate-plan"
          title="Ultimate Plan"
          subtitle="Everything included plus personal support"
          price="$59.99"
          icon={Crown}
          checked={selectedPlans.ultimate}
          onChange={handleChange('ultimate')}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example showing multiple rich checkboxes used together for plan selection.',
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  render: () => {
    const [notifications, setNotifications] = useState({
      email: true,
      push: false,
      sms: false,
    });

    const handleNotificationChange =
      (type: keyof typeof notifications) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications((prev) => ({
          ...prev,
          [type]: e.target.checked,
        }));
      };

    return (
      <div className="max-w-lg space-y-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">
            Notification Preferences
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Configure how you want to receive notifications. Use Tab to navigate
            and Space to toggle.
          </p>
        </div>

        <RichCheckbox
          id="email-notifications"
          title="Email Notifications"
          subtitle="Receive updates about your releases and earnings via email"
          icon={Bell}
          checked={notifications.email}
          onChange={handleNotificationChange('email')}
        />

        <RichCheckbox
          id="push-notifications"
          title="Push Notifications"
          subtitle="Get instant alerts on your mobile device"
          icon={Zap}
          checked={notifications.push}
          onChange={handleNotificationChange('push')}
        />

        <RichCheckbox
          id="sms-notifications"
          title="SMS Notifications"
          subtitle="Important updates sent directly to your phone"
          price="$2.99/mo"
          icon={Music}
          checked={notifications.sms}
          onChange={handleNotificationChange('sms')}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features including keyboard navigation, ARIA attributes, and screen reader support.',
      },
    },
  },
};

// Different icon examples
export const IconVariations: Story = {
  render: () => {
    const [services, setServices] = useState({
      distribution: false,
      analytics: false,
      marketing: false,
    });

    const handleServiceChange =
      (service: keyof typeof services) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setServices((prev) => ({
          ...prev,
          [service]: e.target.checked,
        }));
      };

    return (
      <div className="max-w-md space-y-4">
        <h3 className="mb-4 text-lg font-semibold">Additional Services</h3>

        <RichCheckbox
          id="distribution-service"
          title="Global Distribution"
          subtitle="Distribute to Spotify, Apple Music, and more"
          icon={Music}
          checked={services.distribution}
          onChange={handleServiceChange('distribution')}
        />

        <RichCheckbox
          id="analytics-service"
          title="Advanced Analytics"
          subtitle="Detailed insights into your audience and performance"
          price="$14.99"
          icon={Zap}
          checked={services.analytics}
          onChange={handleServiceChange('analytics')}
        />

        <RichCheckbox
          id="marketing-service"
          title="Marketing Boost"
          subtitle="Promoted placement and playlist submissions"
          price="$49.99"
          icon={Star}
          checked={services.marketing}
          onChange={handleServiceChange('marketing')}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows different Lucide icons used with the RichCheckbox component.',
      },
    },
  },
};
