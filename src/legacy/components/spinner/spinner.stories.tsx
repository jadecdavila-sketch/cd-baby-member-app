import type { Meta, StoryObj } from '@storybook/nextjs';
import { Spinner } from '@/components/spinner';
const meta = {
  title: 'ui/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const small: Story = {
  args: {
    size: 'small',
  },
};

export const medium: Story = {
  args: {
    size: 'medium',
  },
};

export const large: Story = {
  args: {
    size: 'large',
  },
};
