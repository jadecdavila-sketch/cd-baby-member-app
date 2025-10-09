// TODO: needs mock data
import { Meta, StoryObj } from '@storybook/nextjs';
import { ReleaseNav } from './release-nav';

const meta: Meta<typeof ReleaseNav> = {
  title: 'Components/ReleaseSidebar/ReleaseNav',
  component: ReleaseNav,
  parameters: {
    layout: 'sidebar',
  },
  render: () => <div />,
};

export default meta;

type Story = StoryObj<typeof ReleaseNav>;

export const Default: Story = {
  args: { releaseID: '1234567890' },
};
