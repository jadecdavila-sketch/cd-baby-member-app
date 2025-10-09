import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect, waitFor, screen } from 'storybook/test';

import { SelectField } from '@/shared/components/form/select-field';
import { SelectItem } from '@/shared/components/shadcn/select';

const meta: Meta<typeof SelectField> = {
  title: 'shared/components/form/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive select field component that combines select input, label, tooltip, and validation states. Built on top of Radix UI Select with accessibility and form integration with React Hook Form.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Required unique identifier for the field',
    },
    label: {
      control: 'text',
      description: 'Label text for the field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    tooltip: {
      control: 'text',
      description: 'Optional tooltip text for additional context',
    },
    tooltipId: {
      control: 'text',
      description: 'ID for the tooltip element',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the field',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Size variant of the select field',
    },
    value: {
      control: 'text',
      description: 'Current selected value',
    },
    onChange: {
      description: 'Callback fired when the selected value changes',
    },
    children: {
      control: false,
      description: 'SelectItem components defining the available options',
    },
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'country',
    label: 'Country',
    placeholder: 'Select a country',
    children: (
      <>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Country');
    const trigger = canvas.getByRole('combobox');

    expect(label).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Wait for component to be fully mounted
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Test opening the select
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    // Test selecting an option
    await userEvent.click(screen.getByText('United States'));

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

export const WithHelperText: Story = {
  args: {
    id: 'genre',
    label: 'Music Genre',
    placeholder: 'Choose your genre',
    helperText: 'Select the primary genre for your music',
    children: (
      <>
        <SelectItem value="rock">Rock</SelectItem>
        <SelectItem value="pop">Pop</SelectItem>
        <SelectItem value="jazz">Jazz</SelectItem>
        <SelectItem value="classical">Classical</SelectItem>
        <SelectItem value="electronic">Electronic</SelectItem>
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    id: 'category',
    label: 'Category',
    placeholder: 'Select a category',
    required: true,
    helperText: 'This field is required',
    children: (
      <>
        <SelectItem value="music">Music</SelectItem>
        <SelectItem value="podcast">Podcast</SelectItem>
        <SelectItem value="audiobook">Audiobook</SelectItem>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    id: 'payment',
    label: 'Payment Method',
    placeholder: 'Select payment method',
    error: 'Please select a valid payment method',
    children: (
      <>
        <SelectItem value="credit">Credit Card</SelectItem>
        <SelectItem value="paypal">PayPal</SelectItem>
        <SelectItem value="bank">Bank Transfer</SelectItem>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Payment Method');
    const trigger = canvas.getByRole('combobox');
    const errorMessage = canvas.getByText(
      'Please select a valid payment method'
    );

    expect(label).toBeInTheDocument();
    expect(trigger).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-invalid', 'true');

    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Test that the select still works with error state
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText(/Credit Card/)).toBeInTheDocument();
      expect(screen.getByText('PayPal')).toBeInTheDocument();
    });
  },
};

export const WithTooltip: Story = {
  args: {
    id: 'distribution',
    label: 'Distribution Platform',
    placeholder: 'Choose platforms',
    tooltip:
      'Select which streaming platforms you want to distribute your music to',
    tooltipId: 'distribution-tooltip',
    helperText: 'You can change this later in your release settings',
    children: (
      <>
        <SelectItem value="spotify">Spotify</SelectItem>
        <SelectItem value="apple">Apple Music</SelectItem>
        <SelectItem value="amazon">Amazon Music</SelectItem>
        <SelectItem value="youtube">YouTube Music</SelectItem>
        <SelectItem value="all">All Platforms</SelectItem>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-select',
    label: 'Disabled Select',
    placeholder: 'This is disabled',
    disabled: true,
    helperText: 'This field is currently disabled',
    children: (
      <>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </>
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <SelectField
        id="small-select"
        label="Small"
        placeholder="Small select"
        size="sm"
      >
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectField>

      <SelectField
        id="default-select"
        label="Default"
        placeholder="Default select"
        size="default"
      >
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectField>

      <SelectField
        id="large-select"
        label="Large"
        placeholder="Large select"
        size="lg"
      >
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectField>
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    id: 'preset-value',
    label: 'Pre-selected Genre',
    placeholder: 'Choose your genre',
    value: 'rock',
    children: (
      <>
        <SelectItem value="rock">Rock</SelectItem>
        <SelectItem value="pop">Pop</SelectItem>
        <SelectItem value="jazz">Jazz</SelectItem>
      </>
    ),
  },
};
