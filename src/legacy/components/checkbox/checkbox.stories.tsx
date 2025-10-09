import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'ui/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    id: 'checkbox-1',
    disabled: false,
  },
  render: (args) => (
    <div className="flex space-x-2">
      <Label>
        <Checkbox {...args} />
        <span>Accept terms and conditions</span>
      </Label>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the checkbox.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Find and click the checkbox
    const checkbox = await canvas.findByRole('checkbox', {
      name: 'Accept terms and conditions',
    });
    await userEvent.click(checkbox);

    // Assert its checked state directly after clicking
    expect(checkbox).toBeChecked();
    await userEvent.click(
      await canvas.findByRole('checkbox', {
        name: 'Accept terms and conditions',
      })
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('checkbox', { name: 'Accept terms and conditions' })
      ).not.toBeChecked()
    );
  },
};

/**
 * This is an example of an checkbox field with an error message.
 * For an example of how this is used with validation logic, see the `Form` component.
 */
export const WithError: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <div className="flex space-x-2">
        <Checkbox {...args} id="checkbox-2" />
        <Label htmlFor="checkbox-2">Accept terms and conditions</Label>
      </div>
      <p className="text-destructive text-sm">
        Please accept the terms and conditions to continue.
      </p>
    </div>
  ),
};
