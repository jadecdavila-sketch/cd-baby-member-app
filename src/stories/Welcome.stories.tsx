import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, expect } from 'storybook/test';

const Welcome = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to CDBaby Platform
      </h1>
      <p className="text-gray-600">
        This is a simple story to get Storybook tests running.
      </p>
    </div>
  );
};

const meta = {
  title: 'examples/Welcome',
  component: Welcome,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple welcome component demonstrating basic Storybook setup and CDBaby Platform branding. Used as an example for testing Storybook configuration.',
      },
    },
  },
} satisfies Meta<typeof Welcome>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const heading = canvas.getByText('Welcome to CDBaby Platform');
    const description = canvas.getByText('This is a simple story to get Storybook tests running.');

    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  },
};