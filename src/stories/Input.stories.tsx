import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect } from 'storybook/test';

import { Input } from '@/shared/components/shadcn';

const meta: Meta<typeof Input> = {
  title: 'shared/components/shadcn/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A versatile input component built on native HTML input with consistent styling and accessibility features. Supports all standard input types with proper focus states and disabled styling.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type attribute',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text input with placeholder.
 * This is the most common usage of the Input component.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
    type: 'text',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter text here...');
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();

    // Test typing
    await userEvent.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  },
};

/**
 * Email input with validation styling.
 * Demonstrates email-specific input type.
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('you@example.com');
    expect(input).toHaveAttribute('type', 'email');

    // Test email input
    await userEvent.type(input, 'user@domain.com');
    expect(input).toHaveValue('user@domain.com');
  },
};

/**
 * Password input with hidden text.
 * Shows password type behavior.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');

    // Test password input
    await userEvent.type(input, 'secretpassword');
    expect(input).toHaveValue('secretpassword');
  },
};

/**
 * Number input with numeric validation.
 * Demonstrates number-specific input behavior.
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 100,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('0');
    expect(input).toHaveAttribute('type', 'number');

    // Test number input
    await userEvent.type(input, '42');
    expect(input).toHaveValue(42);
  },
};

/**
 * Disabled input state.
 * Shows how the input appears when disabled.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'This input is disabled',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByDisplayValue('This input is disabled');
    expect(input).toBeDisabled();

    // Try to type (should not work)
    await userEvent.type(input, 'should not work');
    expect(input).toHaveValue('This input is disabled');
  },
};

/**
 * Input with error state styling.
 * Demonstrates custom error styling with red border.
 */
export const WithError: Story = {
  args: {
    placeholder: 'This field has an error',
    className: 'border-red-500 focus:ring-red-500',
    'aria-invalid': true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('This field has an error');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    // Focus to show error ring
    await userEvent.click(input);
    expect(input).toHaveFocus();
  },
};

/**
 * Search input with search icon styling.
 * Shows search-specific input type.
 */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Search...');
    expect(input).toHaveAttribute('type', 'search');

    // Test search input
    await userEvent.type(input, 'test query');
    expect(input).toHaveValue('test query');

    // Search inputs often have clear functionality
    await userEvent.clear(input);
    expect(input).toHaveValue('');
  },
};

/**
 * Telephone input with tel type.
 * Demonstrates telephone-specific input behavior.
 */
export const Telephone: Story = {
  args: {
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('+1 (555) 123-4567');
    expect(input).toHaveAttribute('type', 'tel');

    // Test telephone input
    await userEvent.type(input, '+1234567890');
    expect(input).toHaveValue('+1234567890');
  },
};

/**
 * Focus and blur behavior demonstration.
 * Shows input focus states and keyboard navigation.
 */
export const FocusBehavior: Story = {
  args: {
    placeholder: 'Click to focus',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Click to focus');

    // Initially not focused
    expect(input).not.toHaveFocus();

    // Click to focus
    await userEvent.click(input);
    expect(input).toHaveFocus();

    // Tab to blur (if there were other focusable elements)
    await userEvent.type(input, 'focused text');
    expect(input).toHaveValue('focused text');

    // Test keyboard navigation
    await userEvent.keyboard('{Home}');
    await userEvent.keyboard('{End}');
  },
};

/**
 * Input with custom styling.
 * Demonstrates how to apply custom classes while maintaining functionality.
 */
export const CustomStyling: Story = {
  args: {
    placeholder: 'Custom styled input',
    className: 'bg-blue-50 border-blue-300 text-blue-900 placeholder-blue-400',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Custom styled input');
    expect(input).toBeInTheDocument();

    await userEvent.type(input, 'Custom styling works!');
    expect(input).toHaveValue('Custom styling works!');
  },
};
