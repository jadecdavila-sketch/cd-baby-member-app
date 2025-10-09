// TODO: needs mock data
import { Meta, StoryObj } from '@storybook/nextjs';
import { ReleaseSidebar } from './release-sidebar';

const meta: Meta<typeof ReleaseSidebar> = {
  title: 'Components/ReleaseSidebar',
  component: ReleaseSidebar,
  render: () => <div />,
};

export default meta;

type Story = StoryObj<typeof ReleaseSidebar>;

export const Default: Story = {
  args: { releaseID: '1234567890' },
};
