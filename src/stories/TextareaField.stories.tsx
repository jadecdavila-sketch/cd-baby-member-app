import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect } from 'storybook/test';

import { TextareaField } from '@/shared/components/form';

const meta = {
  title: 'shared/components/form/TextareaField',
  component: TextareaField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive textarea field component for multiline text input that combines textarea, label, tooltip, and validation states. Built for accessibility and form integration with React Hook Form.',
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
    rows: {
      control: 'number',
      description: 'Number of visible text lines',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters allowed',
    },
  },
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof TextareaField>;

/**
 * Default textarea field with label.
 * Basic usage with label and multiline text input.
 */
export const Default: Story = {
  args: {
    id: 'default',
    label: 'Song description',
    placeholder: 'Enter song description',
    rows: 4,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Song description');
    const textarea = canvas.getByPlaceholderText('Enter song description');

    expect(label).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'default');
    expect(textarea).toHaveAttribute('id', 'default');
    expect(textarea).toHaveAttribute('rows', '4');

    // Test label association
    await userEvent.click(label);
    expect(textarea).toHaveFocus();
  },
};

/**
 * Textarea field with tooltip for additional context.
 * Shows how to provide extra information via tooltip.
 */
export const WithTooltip: Story = {
  args: {
    id: 'tooltip',
    label: 'Album description',
    tooltip:
      'Provide a detailed description of your album that will be displayed on streaming platforms',
    tooltipId: 'album-description-tooltip',
    placeholder: 'Enter album description',
    rows: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const tooltipTrigger = canvas.getByLabelText(
      'More information about Album description'
    );

    expect(tooltipTrigger).toBeInTheDocument();
    expect(tooltipTrigger).toHaveAttribute('id', 'album-description-tooltip');

    // Test tooltip interaction
    await userEvent.hover(tooltipTrigger);
    // Note: Tooltip content testing would require more complex setup
  },
};

/**
 * Textarea field with error state and message.
 * Demonstrates error handling and validation feedback.
 */
export const WithError: Story = {
  args: {
    id: 'error',
    label: 'Release notes',
    error: 'Release notes are required and must be at least 10 characters',
    placeholder: 'Enter release notes',
    rows: 4,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText('Enter release notes');
    const errorMessage = canvas.getByText(
      'Release notes are required and must be at least 10 characters'
    );

    expect(errorMessage).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'error-error');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  },
};

/**
 * Textarea field with helper text.
 * Shows how to provide instructional text.
 */
export const WithHelperText: Story = {
  args: {
    id: 'helper',
    label: 'Track credits',
    helperText: 'List all performers, writers, and producers involved in this track',
    placeholder: 'Enter track credits',
    rows: 6,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText('Enter track credits');
    const helperText = canvas.getByText(
      'List all performers, writers, and producers involved in this track'
    );

    expect(helperText).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-describedby', 'helper-help');
  },
};

/**
 * Required textarea field with asterisk indicator.
 * Shows the pattern for marking required fields.
 */
export const Required: Story = {
  args: {
    id: 'required',
    label: 'Song lyrics',
    required: true,
    placeholder: 'Enter song lyrics',
    rows: 8,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText('Enter song lyrics');
    const label = canvas.getByText('Song lyrics');

    expect(textarea).toHaveAttribute('aria-required', 'true');
    // The asterisk is added via CSS, so we check the label has the required class
    expect(label).toHaveClass(/after:content/);
  },
};

/**
 * Disabled textarea field.
 * Shows the disabled state styling and behavior.
 */
export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Generated metadata',
    disabled: true,
    value: 'This content is automatically generated and cannot be edited by users.',
    placeholder: 'Enter metadata',
    rows: 3,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByDisplayValue(
      'This content is automatically generated and cannot be edited by users.'
    );

    expect(textarea).toBeDisabled();

    // Try to type (should not work)
    await userEvent.type(textarea, 'should not work');
    expect(textarea).toHaveValue(
      'This content is automatically generated and cannot be edited by users.'
    );
  },
};

/**
 * Textarea field with character limit.
 * Shows how to handle maximum length constraints.
 */
export const WithCharacterLimit: Story = {
  args: {
    id: 'character-limit',
    label: 'Short description',
    maxLength: 100,
    helperText: 'Maximum 100 characters for streaming platform compatibility',
    placeholder: 'Enter a short description',
    rows: 3,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText('Enter a short description');

    expect(textarea).toHaveAttribute('maxlength', '100');

    // Test character limit
    await userEvent.type(
      textarea,
      'This is a very long description that exceeds the 100 character limit and should be truncated automatically'
    );

    // Should only contain first 100 characters
    expect((textarea as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(100);
  },
};

/**
 * Textarea field with multiline content.
 * Demonstrates handling of line breaks and multiline text.
 */
export const WithMultilineContent: Story = {
  args: {
    id: 'multiline',
    label: 'Album liner notes',
    defaultValue: 'First paragraph of liner notes.\n\nSecond paragraph with more details.\n\nThird paragraph with acknowledgments.',
    placeholder: 'Enter liner notes',
    rows: 6,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText('Enter liner notes');

    // Test that multiline content is preserved
    expect(textarea).toHaveValue(
      'First paragraph of liner notes.\n\nSecond paragraph with more details.\n\nThird paragraph with acknowledgments.'
    );

    // Test adding more content
    await userEvent.click(textarea);
    await userEvent.keyboard('{End}');
    await userEvent.type(textarea, '\n\nAdded content.');

    expect((textarea as HTMLTextAreaElement).value).toContain('Added content.');
  },
};

/**
 * Textarea field with all features combined.
 * Complete example with tooltip, required state, and helper text.
 */
export const Complete: Story = {
  args: {
    id: 'complete',
    label: 'Artist biography',
    tooltip: 'Provide a comprehensive biography of the artist for promotional use',
    tooltipId: 'biography-tooltip',
    required: true,
    helperText: 'This will be used for press releases and streaming platform descriptions',
    placeholder: 'Enter artist biography',
    rows: 8,
    maxLength: 500,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Artist biography');
    const textarea = canvas.getByPlaceholderText('Enter artist biography');
    const tooltipTrigger = canvas.getByLabelText(
      'More information about Artist biography'
    );
    const helperText = canvas.getByText(
      'This will be used for press releases and streaming platform descriptions'
    );

    expect(label).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
    expect(tooltipTrigger).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-required', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'complete-help');
    expect(textarea).toHaveAttribute('maxlength', '500');

    // Test typing multiline content
    await userEvent.type(
      textarea,
      'Artist Name is a talented musician from Nashville.\n\nThey have been performing for over 10 years.'
    );
    expect((textarea as HTMLTextAreaElement).value).toContain('Artist Name is a talented musician');
    expect((textarea as HTMLTextAreaElement).value).toContain('They have been performing');
  },
};

/**
 * Textarea field with error overriding helper text.
 * Shows how error messages take precedence over helper text.
 */
export const ErrorOverridesHelper: Story = {
  args: {
    id: 'error-override',
    label: 'Song description',
    error: 'Description must be at least 20 characters',
    helperText: 'This helper text should not be visible when there is an error',
    placeholder: 'Enter song description',
    value: 'Too short',
    rows: 4,
    tooltip: undefined,
    tooltipId: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText('Enter song description');
    const errorMessage = canvas.getByText(
      'Description must be at least 20 characters'
    );

    expect(errorMessage).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-describedby', 'error-override-error');

    // Helper text should not be visible
    const helperText = canvas.queryByText(
      'This helper text should not be visible when there is an error'
    );
    expect(helperText).not.toBeInTheDocument();
  },
};

/**
 * Multiple textarea fields in a form layout.
 * Shows how textarea fields work together in a complete form.
 */
export const FormLayout: Story = {
  args: {},
  render: () => (
    <div className="max-w-2xl space-y-6 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Release Content Information</h3>

      <TextareaField
        id="album-description"
        label="Album description"
        required
        tooltip="Main description for your album"
        tooltipId="album-desc-tooltip"
        placeholder="Enter album description"
        rows={4}
        maxLength={300}
      />

      <TextareaField
        id="track-listing"
        label="Track listing"
        required
        helperText="List all tracks in order, one per line"
        placeholder="1. Track Name&#10;2. Another Track&#10;3. Final Track"
        rows={6}
        tooltip={undefined}
        tooltipId={undefined}
      />

      <TextareaField
        id="credits"
        label="Album credits"
        helperText="List all contributors, producers, and personnel"
        placeholder="Producer: John Smith&#10;Engineer: Jane Doe&#10;Mastered by: Studio Name"
        rows={5}
        tooltip={undefined}
        tooltipId={undefined}
      />

      <TextareaField
        id="additional-notes"
        label="Additional notes"
        helperText="Optional internal notes for the release"
        placeholder="Enter any additional notes"
        rows={3}
        tooltip={undefined}
        tooltipId={undefined}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const albumDesc = canvas.getByPlaceholderText('Enter album description');
    const trackListing = canvas.getByPlaceholderText(/1\. Track Name/);
    const credits = canvas.getByPlaceholderText(/Producer: John Smith/);

    // Test form interaction
    await userEvent.type(
      albumDesc,
      'This is an amazing album featuring great songs.'
    );
    await userEvent.type(
      trackListing,
      '1. Opening Track\n2. Main Single\n3. Closing Song'
    );
    await userEvent.type(
      credits,
      'Producer: Test Producer\nMixed by: Test Engineer'
    );

    expect(albumDesc).toHaveValue('This is an amazing album featuring great songs.');
    expect(trackListing).toHaveValue('1. Opening Track\n2. Main Single\n3. Closing Song');
    expect(credits).toHaveValue('Producer: Test Producer\nMixed by: Test Engineer');
  },
};