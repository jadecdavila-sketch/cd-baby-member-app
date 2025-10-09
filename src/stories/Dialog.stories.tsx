import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/shadcn';
import { within, userEvent, expect, waitFor } from 'storybook/test';

/**
 * A window overlaid on either the primary window or another dialog window,
 * rendering the content underneath inert.
 */
const meta = {
  title: 'shared/components/shadcn/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <button className="hover:underline">Cancel</button>
          <DialogClose>
            <button className="bg-primary text-primary-foreground rounded px-4 py-2">
              Continue
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the dialog.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(await canvas.findByRole('button', { name: 'Open' }));

    const dialog = await canvas.findByRole('dialog', {
      name: 'Are you absolutely sure?',
    });
    expect(dialog).toBeInTheDocument();

    await userEvent.click(
      (await canvas.findAllByRole('button', { name: 'Continue' }))[1]
    );
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  },
};
