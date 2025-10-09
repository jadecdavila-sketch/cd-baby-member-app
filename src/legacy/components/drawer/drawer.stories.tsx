import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/drawer';

/**
 * A drawer component for React.
 */
const meta = {
  title: 'ui/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {},
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <button className="bg-primary text-primary-foreground rounded px-4 py-2">
            Submit
          </button>
          <DrawerClose>
            <button className="hover:underline">Cancel</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the drawer.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(await canvas.findByRole('button', { name: 'Open' }));
    const dialog = await canvas.findByRole('dialog', {
      name: 'Are you sure absolutely sure?',
    });
    expect(dialog).toBeInTheDocument();
    await userEvent.click(
      (await canvas.findAllByRole('button', { name: 'Cancel' }))[1]
    );
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  },
} as Story;
