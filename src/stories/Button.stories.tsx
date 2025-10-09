import type { Meta, StoryObj } from '@storybook/react';
import { Loader2, Mail, ArrowRight, Download } from 'lucide-react';

import { Button } from '@/shared/components/shadcn';

const meta = {
  title: 'shared/components/shadcn/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'navigation',
        'muted',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma-based variants

export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'Secondary Action',
  },
};

export const Navigation: Story = {
  args: {
    variant: 'navigation',
    children: 'Navigation Button',
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button (Default)',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancel',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Interactive examples
export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" />
      Send Email
    </Button>
  ),
  args: {
    variant: 'default',
  },
};

export const Loading: Story = {
  render: (args) => (
    <Button {...args}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Processing...
    </Button>
  ),
  args: {
    variant: 'default',
    disabled: true,
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <Download className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    disabled: true,
    children: 'Disabled Button',
  },
};

// Comparison showcase
export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="navigation">Navigation</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All available button color variants showcasing the Figma-based design system.',
      },
    },
  },
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium (Default)</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="navigation" size="sm">
          Small Nav
        </Button>
        <Button variant="navigation" size="md">
          Medium Nav
        </Button>
        <Button variant="navigation" size="lg">
          Large Nav
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="muted" size="sm">
          Small Muted
        </Button>
        <Button variant="muted" size="md">
          Medium Muted
        </Button>
        <Button variant="muted" size="lg">
          Large Muted
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Size variants (sm, md, lg, icon) across different color variants.',
      },
    },
  },
};

export const ThemeAwareNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="bg-background rounded-lg border p-4">
        <h3 className="text-foreground mb-4 text-lg font-medium">
          Theme-Aware Navigation Buttons
        </h3>
        <div className="flex items-center gap-4">
          <Button variant="navigation" size="sm">
            Small Nav
          </Button>
          <Button variant="navigation" size="md">
            Medium Nav
          </Button>
          <Button variant="navigation" size="lg">
            Large Nav
          </Button>
        </div>
        <p className="text-muted-foreground mt-3 text-sm">
          Navigation buttons automatically adapt to light/dark theme using CSS
          variables. They use background/foreground colors with subtle accent
          hover effects.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Navigation buttons that automatically adapt to light and dark themes using CSS variables. Toggle your system theme or Storybook theme to see the adaptive behavior.',
      },
    },
  },
};

export const InteractivePlayground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'Interactive Button',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls panel to test different combinations of variants, sizes, and states.',
      },
    },
  },
};
