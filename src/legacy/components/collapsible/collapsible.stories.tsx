import { userEvent, within, waitFor, expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Info } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/collapsible';

/**
 * An interactive component which expands/collapses a panel.
 */
const meta = {
  title: 'ui/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    className: 'w-96',
    disabled: false,
  },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger className="flex gap-2">
        <h3 className="font-semibold">Can I use this in my project?</h3>
        <Info className="size-6" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        Yes. Free to use for personal and commercial projects. No attribution
        required.
      </CollapsibleContent>
    </Collapsible>
  ),
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the collapsible.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Can I use this in my project?',
      })
    );
    await waitFor(() =>
      expect(
        canvas.queryByText(
          'Yes. Free to use for personal and commercial projects. No attribution required.',
          { exact: true }
        )
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        canvas.queryByText(
          'Yes. Free to use for personal and commercial projects. No attribution required.',
          { exact: true }
        )
      ).toBeVisible()
    );
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Can I use this in my project?',
      })
    );
    await waitFor(() =>
      expect(
        canvas.queryByText(
          'Yes. Free to use for personal and commercial projects. No attribution required.',
          { exact: true }
        )
      ).not.toBeInTheDocument()
    );
  },
};

/**
 * Use the `disabled` prop to disable the interaction.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
