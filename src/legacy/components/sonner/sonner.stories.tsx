import { userEvent, within, waitFor, expect } from 'storybook/test';
import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { toast } from 'sonner';

import { Toaster } from '@/components/sonner';

/**
 * An opinionated toast component for React.
 */
const meta: Meta<typeof Toaster> = {
  title: 'ui/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    position: 'bottom-right',
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the toaster.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center space-x-2">
      <button
        onClick={() =>
          toast('Event has been created', {
            description: new Date().toLocaleString(),
            action: {
              label: 'Undo',
              onClick: action('Undo clicked'),
            },
          })
        }
      >
        Show Toast
      </button>
      <Toaster {...args} />
    </div>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Show Toast' })
    );
    await waitFor(() => expect(canvas.queryByRole('listitem')).toBeVisible());
    await userEvent.click(await canvas.findByRole('button', { name: 'Undo' }));
    await waitFor(() =>
      expect(canvas.queryByRole('listitem')).not.toBeInTheDocument()
    );
  },
};
