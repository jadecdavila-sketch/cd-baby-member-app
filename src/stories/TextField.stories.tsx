import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect } from 'storybook/test';

import { TextField } from '@/shared/components/form';

const meta: Meta<typeof TextField> = {
  title: 'shared/components/form/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive text field component that combines input, label, tooltip, and validation states. Built for accessibility and form integration with React Hook Form.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Required unique identifier for the field',
    },
    label: {
      control: 'text',
      description: 'Label text for the field',
    },
    tooltip: {
      control: 'text',
      description: 'Optional tooltip text for additional context',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the field',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text field with label.
 * Basic usage with label and input field.
 */
export const Default: Story = {
  args: {
    id: 'default',
    label: 'Artist name',
    placeholder: 'Enter artist name',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Artist name');
    const input = canvas.getByPlaceholderText('Enter artist name');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'default');
    expect(input).toHaveAttribute('id', 'default');

    // Test label association
    await userEvent.click(label);
    expect(input).toHaveFocus();
  },
};

/**
 * Text field with tooltip for additional context.
 * Shows how to provide extra information via tooltip.
 */
export const WithTooltip: Story = {
  args: {
    id: 'tooltip',
    label: 'Artist name',
    tooltip:
      'Enter the performing artist name as it should appear on your release',
    placeholder: 'Enter artist name',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const tooltipTrigger = canvas.getByLabelText(
      'More information about Artist name'
    );

    expect(tooltipTrigger).toBeInTheDocument();

    // Test tooltip interaction
    await userEvent.hover(tooltipTrigger);
    // Note: Tooltip content testing would require more complex setup
  },
};

/**
 * Text field with error state and message.
 * Demonstrates error handling and validation feedback.
 */
export const WithError: Story = {
  args: {
    id: 'error',
    label: 'Artist name',
    error: 'Artist name is required',
    placeholder: 'Enter artist name',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter artist name');
    const errorMessage = canvas.getByText('Artist name is required');

    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'error-error');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  },
};

/**
 * Text field with helper text.
 * Shows how to provide instructional text.
 */
export const WithHelperText: Story = {
  args: {
    id: 'helper',
    label: 'Artist name',
    helperText: 'This will appear on your release and all streaming platforms',
    placeholder: 'Enter artist name',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter artist name');
    const helperText = canvas.getByText(
      'This will appear on your release and all streaming platforms'
    );

    expect(helperText).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', 'helper-help');
  },
};

/**
 * Required text field with asterisk indicator.
 * Shows the pattern for marking required fields.
 */
export const Required: Story = {
  args: {
    id: 'required',
    label: 'Artist name',
    required: true,
    placeholder: 'Enter artist name',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter artist name');
    const label = canvas.getByText('Artist name');

    expect(input).toHaveAttribute('aria-required', 'true');
    // The asterisk is added via CSS, so we check the label has the required class
    expect(label).toHaveClass(/after:content/);
  },
};

/**
 * Disabled text field.
 * Shows the disabled state styling and behavior.
 */
export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Artist name',
    disabled: true,
    value: 'Cannot edit this field',
    placeholder: 'Enter artist name',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByDisplayValue('Cannot edit this field');

    expect(input).toBeDisabled();

    // Try to type (should not work)
    await userEvent.type(input, 'should not work');
    expect(input).toHaveValue('Cannot edit this field');
  },
};

/**
 * Text field with all features combined.
 * Complete example with tooltip, required state, and helper text.
 */
export const Complete: Story = {
  args: {
    id: 'complete',
    label: 'Album title',
    tooltip: 'The main title of your album or EP release',
    required: true,
    helperText: 'Make sure this matches exactly how you want it displayed',
    placeholder: 'Enter album title',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Album title');
    const input = canvas.getByPlaceholderText('Enter album title');
    const tooltipTrigger = canvas.getByLabelText(
      'More information about Album title'
    );
    const helperText = canvas.getByText(
      'Make sure this matches exactly how you want it displayed'
    );

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(tooltipTrigger).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'complete-help');

    // Test typing
    await userEvent.type(input, 'My Awesome Album');
    expect(input).toHaveValue('My Awesome Album');
  },
};

/**
 * Text field with error overriding helper text.
 * Shows how error messages take precedence over helper text.
 */
export const ErrorOverridesHelper: Story = {
  args: {
    id: 'error-override',
    label: 'Song title',
    error: 'Song title must be at least 3 characters',
    helperText: 'This helper text should not be visible when there is an error',
    placeholder: 'Enter song title',
    value: 'AB',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText('Enter song title');
    const errorMessage = canvas.getByText(
      'Song title must be at least 3 characters'
    );

    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', 'error-override-error');

    // Helper text should not be visible
    const helperText = canvas.queryByText(
      'This helper text should not be visible when there is an error'
    );
    expect(helperText).not.toBeInTheDocument();
  },
};

/**
 * Multiple text fields in a form layout.
 * Shows how text fields work together in a complete form.
 */
export const FormLayout: Story = {
  render: () => (
    <div className="max-w-md space-y-6 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Release Information</h3>

      <TextField
        id="artist-name"
        label="Artist name"
        required
        tooltip="The performing artist name"
        placeholder="Enter artist name"
      />

      <TextField
        id="album-title"
        label="Album title"
        required
        helperText="The main title of your release"
        placeholder="Enter album title"
      />

      <TextField id="release-date" label="Release date" type="date" />

      <TextField
        id="catalog-number"
        label="Catalog number"
        helperText="Optional internal catalog reference"
        placeholder="CAT-001"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const artistInput = canvas.getByPlaceholderText('Enter artist name');
    const albumInput = canvas.getByPlaceholderText('Enter album title');
    const catalogInput = canvas.getByPlaceholderText('CAT-001');

    // Test form interaction
    await userEvent.type(artistInput, 'Test Artist');
    await userEvent.type(albumInput, 'Test Album');
    await userEvent.type(catalogInput, 'CAT-123');

    expect(artistInput).toHaveValue('Test Artist');
    expect(albumInput).toHaveValue('Test Album');
    expect(catalogInput).toHaveValue('CAT-123');
  },
};
