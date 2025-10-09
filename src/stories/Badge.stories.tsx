import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, expect } from 'storybook/test';

import { Badge } from '@/shared/components/shadcn';

const meta: Meta<typeof Badge> = {
  title: 'shared/components/shadcn/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small badge component for displaying statuses, counts, or labels. Built on Radix UI primitives with customizable variants and colors. Perfect for notifications, status indicators, and categorical labels.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual variant of the badge',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge with primary styling.
 * Shows the basic appearance and behavior.
 */
export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const badge = canvas.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
  },
};

/**
 * Secondary variant for less prominent information.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const badge = canvas.getByText('Secondary');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-secondary');
  },
};

/**
 * Destructive variant for error states and critical information.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const badge = canvas.getByText('Destructive');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-destructive');
  },
};

/**
 * Outline variant for subtle, bordered appearance.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const badge = canvas.getByText('Outline');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('border');
  },
};

/**
 * Badge used as a status indicator.
 * Common pattern for showing entity status.
 */
export const StatusIndicator: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <Badge variant="outline">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-gray-400" />
        <Badge variant="outline">Inactive</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <Badge variant="destructive">Error</Badge>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const activeBadge = canvas.getByText('Active');
    const inactiveBadge = canvas.getByText('Inactive');
    const errorBadge = canvas.getByText('Error');

    expect(activeBadge).toBeInTheDocument();
    expect(inactiveBadge).toBeInTheDocument();
    expect(errorBadge).toBeInTheDocument();
  },
};

/**
 * Badge used for notification counts.
 * Shows number indicators on icons or avatars.
 */
export const NotificationCount: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 items-center justify-center p-0 text-xs"
        >
          3
        </Badge>
      </div>
      
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 h-5 w-5 items-center justify-center p-0 text-xs"
        >
          12
        </Badge>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const notification3 = canvas.getByText('3');
    const notification12 = canvas.getByText('12');

    expect(notification3).toBeInTheDocument();
    expect(notification12).toBeInTheDocument();
    expect(notification3).toHaveClass('text-xs');
  },
};

/**
 * Badges used for categorization and tags.
 * Common pattern for filtering and organization.
 */
export const Categories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Music</Badge>
      <Badge variant="secondary">Albums</Badge>
      <Badge variant="outline">Artists</Badge>
      <Badge variant="destructive">Featured</Badge>
      <Badge variant="outline">New Releases</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const musicBadge = canvas.getByText('Music');
    const albumsBadge = canvas.getByText('Albums');
    const artistsBadge = canvas.getByText('Artists');

    expect(musicBadge).toBeInTheDocument();
    expect(albumsBadge).toBeInTheDocument();
    expect(artistsBadge).toBeInTheDocument();
  },
};

/**
 * Badge with custom styling.
 * Shows how to extend the badge with additional CSS classes.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        Gradient
      </Badge>
      <Badge className="rounded-full px-4 py-1 font-bold uppercase tracking-wide">
        Rounded Full
      </Badge>
      <Badge className="border-2 border-blue-500 bg-transparent text-blue-700">
        Custom Border
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const gradientBadge = canvas.getByText('Gradient');
    const roundedBadge = canvas.getByText('Rounded Full');
    const borderBadge = canvas.getByText('Custom Border');

    expect(gradientBadge).toBeInTheDocument();
    expect(roundedBadge).toBeInTheDocument();
    expect(borderBadge).toBeInTheDocument();
  },
};

/**
 * Badges in a table or list context.
 * Shows real-world usage in data displays.
 */
export const InDataTable: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="font-medium">User Management</span>
        <Badge variant="outline">Admin</Badge>
      </div>
      
      <div className="flex items-center justify-between border-b pb-2">
        <span className="font-medium">Content Moderation</span>
        <Badge variant="default">Moderator</Badge>
      </div>
      
      <div className="flex items-center justify-between border-b pb-2">
        <span className="font-medium">Analytics</span>
        <Badge variant="secondary">Viewer</Badge>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="font-medium">Billing</span>
        <Badge variant="destructive">Suspended</Badge>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const adminBadge = canvas.getByText('Admin');
    const moderatorBadge = canvas.getByText('Moderator');
    const viewerBadge = canvas.getByText('Viewer');
    const suspendedBadge = canvas.getByText('Suspended');

    expect(adminBadge).toBeInTheDocument();
    expect(moderatorBadge).toBeInTheDocument();
    expect(viewerBadge).toBeInTheDocument();
    expect(suspendedBadge).toBeInTheDocument();
  },
};

/**
 * Interactive badges with hover states.
 * Shows badges that could be used as filter chips.
 */
export const InteractiveBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="cursor-pointer hover:bg-primary/90">
          Clickable Badge
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
          Hover Me
        </Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          Filter Chip
        </Badge>
      </div>
      
      <p className="text-sm text-gray-500">
        These badges have cursor-pointer classes and could be used as interactive filter chips.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const clickableBadge = canvas.getByText('Clickable Badge');
    const hoverBadge = canvas.getByText('Hover Me');
    const filterBadge = canvas.getByText('Filter Chip');

    expect(clickableBadge).toHaveClass('cursor-pointer');
    expect(hoverBadge).toHaveClass('cursor-pointer');
    expect(filterBadge).toHaveClass('cursor-pointer');
  },
};

/**
 * Badge sizes demonstration.
 * Shows how badges can be sized using utility classes.
 */
export const BadgeSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge className="text-xs">XS Badge</Badge>
      <Badge className="text-sm">SM Badge</Badge>
      <Badge>Default Badge</Badge>
      <Badge className="text-lg">LG Badge</Badge>
      <Badge className="px-4 py-2 text-xl">XL Badge</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const xsBadge = canvas.getByText('XS Badge');
    const smBadge = canvas.getByText('SM Badge');
    const lgBadge = canvas.getByText('LG Badge');
    const xlBadge = canvas.getByText('XL Badge');

    expect(xsBadge).toHaveClass('text-xs');
    expect(smBadge).toHaveClass('text-sm');
    expect(lgBadge).toHaveClass('text-lg');
    expect(xlBadge).toHaveClass('text-xl');
  },
};