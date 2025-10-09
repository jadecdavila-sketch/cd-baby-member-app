import { useState } from 'react';
import { userEvent, within, waitFor, expect, screen } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { MultiSelect } from '@/shared/components/form/multi-select';

import type { SelectOption } from '@/shared/types';

// Sample data for different scenarios
const fruitOptions: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
  { label: 'Strawberry', value: 'strawberry' },
];

const musicGenreOptions: SelectOption[] = [
  { label: 'Rock', value: 'rock' },
  { label: 'Pop', value: 'pop' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'Hip Hop', value: 'hip-hop' },
  { label: 'Electronic', value: 'electronic' },
  { label: 'Country', value: 'country' },
  { label: 'Classical', value: 'classical' },
  { label: 'Alternative', value: 'alternative' },
  { label: 'R&B', value: 'rnb' },
  { label: 'Folk', value: 'folk' },
];

const countryOptions: SelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' },
  { label: 'India', value: 'in' },
  { label: 'Mexico', value: 'mx' },
];

const optionsWithDisabled: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Disabled Option', value: 'disabled', disabled: true },
  { label: 'Option 4', value: 'option4' },
];

// Interactive wrapper component
const MultiSelectDemo = ({
  options = fruitOptions,
  initialValue = [],
  placeholder = 'Select options...',
  disabled = false,
  maxSelections,
  className,
}: {
  options?: SelectOption[];
  initialValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  maxSelections?: number;
  className?: string;
}) => {
  const [value, setValue] = useState<string[]>(initialValue);

  return (
    <div className="w-80">
      <MultiSelect
        options={options}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        disabled={disabled}
        maxSelections={maxSelections}
        className={className}
      />
      <div className="text-muted-foreground mt-4 text-sm">
        Selected: {value.length > 0 ? value.join(', ') : 'None'}
      </div>
    </div>
  );
};

const meta: Meta<typeof MultiSelectDemo> = {
  title: 'shared/components/form/MultiSelect',
  component: MultiSelectDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A multi-select component that allows users to select multiple options from a dropdown list. Built with Radix UI primitives and supports keyboard navigation, accessibility features, and customizable styling.',
      },
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options to display in the dropdown',
    },
    initialValue: {
      control: 'object',
      description: 'Initial selected values',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no options are selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the multi-select component',
    },
    maxSelections: {
      control: 'number',
      description: 'Maximum number of selections allowed',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof MultiSelectDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default multi-select with fruit options.
 * Demonstrates basic functionality with selection and deselection.
 */
export const Default: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'Select fruits...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the trigger
    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeInTheDocument();

    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    // Select multiple options
    await userEvent.click(screen.getByText('Apple'));
    await userEvent.click(screen.getByText('Banana'));

    // Check that values are displayed
    await waitFor(() => {
      expect(screen.getByText('Selected: apple, banana')).toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with initial values pre-selected.
 * Shows how the component appears with existing selections.
 */
export const WithInitialValues: Story = {
  args: {
    options: fruitOptions,
    initialValue: ['apple', 'orange'],
    placeholder: 'Select fruits...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial values are shown
    await waitFor(() => {
      expect(screen.getByText('Selected: apple, orange')).toBeInTheDocument();
    });

    // Wait for component to be fully mounted
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Open dropdown and verify selected items are checked
    const trigger = canvas.getByRole('combobox');
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    await waitFor(() => {
      const appleOption = screen.getByRole('option', { name: 'Apple' });
      const orangeOption = screen.getByRole('option', { name: 'Orange' });
      expect(appleOption).toBeInTheDocument();
      expect(orangeOption).toBeInTheDocument();
    });
  },
};

/**
 * Disabled multi-select component.
 * Shows the disabled state and prevents interaction.
 */
export const Disabled: Story = {
  args: {
    options: fruitOptions,
    disabled: true,
    placeholder: 'This multi-select is disabled',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeDisabled();

    // Try to click (should not work)
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    // Verify dropdown doesn't open
    await waitFor(() => {
      expect(canvas.queryByText('Apple')).not.toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with many options to demonstrate scrolling.
 * Uses music genres as example data.
 */
export const WithManyOptions: Story = {
  args: {
    options: musicGenreOptions,
    placeholder: 'Select music genres...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Rock')).toBeInTheDocument();
      expect(screen.getByText('Pop')).toBeInTheDocument();
    });

    // Select a few genres
    await userEvent.click(screen.getByText('Rock'));
    await userEvent.click(screen.getByText('Jazz'));
    await userEvent.click(screen.getByText('Electronic'));

    await waitFor(() => {
      expect(
        screen.getByText('Selected: rock, jazz, electronic')
      ).toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with country options.
 * Demonstrates usage with different types of data.
 */
export const CountrySelection: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select countries...',
    maxSelections: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    // Select some countries
    await userEvent.click(screen.getByText('United States'));
    await userEvent.click(screen.getByText('Canada'));
    await userEvent.click(screen.getByText('United Kingdom'));

    await waitFor(() => {
      expect(screen.getByText('Selected: us, ca, uk')).toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with error state styling.
 * Demonstrates error state with custom styling.
 */
export const WithError: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'This field has an error',
    className: 'border-red-500 focus:ring-red-500',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeInTheDocument();

    // Open and verify functionality still works
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Apple'));

    await waitFor(() => {
      expect(screen.getByText('Selected: apple')).toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with no options.
 * Shows empty state behavior.
 */
export const EmptyOptions: Story = {
  args: {
    options: [],
    placeholder: 'No options available',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText('Selected: None')).toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with custom styling.
 * Demonstrates how to customize the appearance.
 */
export const CustomStyling: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'Custom styled multi-select',
    className: 'border-2 border-blue-500 rounded-lg bg-blue-50',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    await new Promise((resolve) => setTimeout(resolve, 300));
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Strawberry'));

    await waitFor(() => {
      expect(screen.getByText('Selected: strawberry')).toBeInTheDocument();
    });
  },
};
