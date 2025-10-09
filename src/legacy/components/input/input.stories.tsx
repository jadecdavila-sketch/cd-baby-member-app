import { userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Input } from '@/components/input';
import { Label } from '@/components/label';

/**
 * Displays a form input field or a component that looks like an input field.
 */
const meta = {
  title: 'ui/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    className: 'w-96',
    type: 'email',
    placeholder: 'Email',
    disabled: false,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the input field.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByPlaceholderText('Email', { exact: true })
    );
    await userEvent.type(
      await canvas.findByPlaceholderText('Email', { exact: true }),
      'test'
    );
  },
};

/**
 * Use the `disabled` prop to make the input non-interactive and appears faded,
 * indicating that input is not currently accepted.
 */
export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Use the `Label` component to includes a clear, descriptive label above or
 * alongside the input area to guide users.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <Label htmlFor="email">{args.placeholder}</Label>
      <Input {...args} id="email" />
    </div>
  ),
};

/**
 * Use a text element below the input field to provide additional instructions
 * or information to users.
 */
export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <Label htmlFor="email-2">{args.placeholder}</Label>
      <Input {...args} id="email-2" />
      <p className="text-foreground/50 text-sm">Enter your email address.</p>
    </div>
  ),
};

/**
 * Use the `Button` component to indicate that the input field can be submitted
 * or used to trigger an action.
 */
export const WithButton: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Input {...args} />
      <button
        className="bg-primary text-primary-foreground rounded px-4 py-2"
        type="submit"
      >
        Subscribe
      </button>
    </div>
  ),
};

/**
 * This is an example of an input field with an error message.
 * The label and input border colors are changed to indicate an error state.
 * For an example of how this is used with validation logic, see the `Form` component.
 */
export const WithError: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <Label htmlFor="email-3" className="text-destructive">
        {args.placeholder}
      </Label>
      <Input {...args} id="email-3" aria-invalid />
      <p className="text-destructive text-sm">Email is required.</p>
    </div>
  ),
};
