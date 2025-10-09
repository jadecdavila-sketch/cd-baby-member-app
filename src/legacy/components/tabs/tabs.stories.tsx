import { userEvent, within, waitFor, expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';

/**
 * A set of layered sections of content—known as tab panels—that are displayed
 * one at a time.
 */
const meta = {
  title: 'ui/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    defaultValue: 'account',
    className: 'w-96',
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the tabs.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(canvas.queryByRole('tabpanel', { name: 'Account' })).toBeVisible()
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('tabpanel', { name: 'Account' })
      ).toHaveTextContent('Make changes to your account here.')
    );
    await userEvent.click(await canvas.findByRole('tab', { name: 'Password' }));
    await waitFor(() =>
      expect(canvas.queryByRole('tabpanel', { name: 'Password' })).toBeVisible()
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('tabpanel', { name: 'Password' })
      ).toHaveTextContent('Change your password here.')
    );
    await userEvent.click(await canvas.findByRole('tab', { name: 'Account' }));
  },
};
