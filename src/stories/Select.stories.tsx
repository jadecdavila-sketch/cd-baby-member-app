import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, waitFor, expect, screen } from 'storybook/test';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn';

// Helper component for consistent demo select
const DemoSelect = ({
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
  size = 'default',
}: {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}) => (
  <Select disabled={disabled}>
    <SelectTrigger id="demo-select" className={className} size={size}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Vegetables</SelectLabel>
        <SelectItem value="carrot">Carrot</SelectItem>
        <SelectItem value="broccoli">Broccoli</SelectItem>
        <SelectItem value="spinach">Spinach</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

const meta: Meta<typeof DemoSelect> = {
  title: 'shared/components/shadcn/Select',
  component: DemoSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A feature-rich select component built on Radix UI Select primitive. Supports grouping, separators, custom styling, and full keyboard navigation. Includes proper accessibility features and smooth animations.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the trigger',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size variant of the select trigger',
    },
  },
} satisfies Meta<typeof DemoSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default select with grouped options.
 * This demonstrates the basic usage with grouped options and separators.
 */
export const Default: Story = {
  args: {
    placeholder: 'Select a fruit or vegetable...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the select trigger
    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);

    // Wait for content to appear and verify options are visible
    await waitFor(() => {
      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Vegetables')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Carrot')).toBeInTheDocument();
    });

    // Select an option
    await userEvent.click(screen.getByText('Apple'));

    // Verify selection
    await waitFor(() => {
      expect(trigger).toHaveTextContent('Apple');
    });
  },
};

/**
 * Select with keyboard navigation.
 * Demonstrates keyboard accessibility and navigation.
 */
export const KeyboardNavigation: Story = {
  args: {
    placeholder: 'Use keyboard to navigate...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');

    // Focus the trigger
    await userEvent.click(trigger);

    // Use keyboard to open
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    // Navigate with arrow keys
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}'); // Should highlight Banana

    // Select with Enter
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Banana');
    });
  },
};

/**
 * Disabled select state.
 * Shows how the select appears and behaves when disabled.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'This select is disabled',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeDisabled();

    // Try to click (should not work)
    await userEvent.click(trigger);

    // Verify it doesn't open
    await waitFor(() => {
      expect(canvas.queryByText('Apple')).not.toBeInTheDocument();
    });
  },
};

/**
 * Select with error state styling.
 * Demonstrates custom error styling with red border.
 */
export const WithError: Story = {
  args: {
    placeholder: 'This field has an error',
    className: 'border-red-500 focus:ring-red-500',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeInTheDocument();

    // Focus to show error styling
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    // Select an item to verify functionality still works
    await userEvent.click(screen.getByText('Orange'));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Orange');
    });
  },
};

/**
 * Simple select without groups.
 * Shows a simpler select configuration without grouping.
 */
export const Simple: Story = {
  render: () => (
    <Select>
      <SelectTrigger id="simple-select">
        <SelectValue placeholder="Choose a color..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="red">Red</SelectItem>
        <SelectItem value="green">Green</SelectItem>
        <SelectItem value="blue">Blue</SelectItem>
        <SelectItem value="yellow">Yellow</SelectItem>
        <SelectItem value="purple">Purple</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      // Verify no group labels
      expect(canvas.queryByText('Fruits')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Blue'));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Blue');
    });
  },
};

/**
 * Select with long list of options.
 * Demonstrates scrolling behavior with many options.
 */
export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger id="country-select">
        <SelectValue placeholder="Select a country..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="mx">Mexico</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="jp">Japan</SelectItem>
        <SelectItem value="kr">South Korea</SelectItem>
        <SelectItem value="cn">China</SelectItem>
        <SelectItem value="in">India</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="br">Brazil</SelectItem>
        <SelectItem value="ar">Argentina</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    // Test scrolling by selecting an item further down
    await userEvent.click(screen.getByText('Japan'));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Japan');
    });
  },
};

/**
 * Select with custom width and positioning.
 * Demonstrates different sizing and layout options.
 */
export const CustomSizing: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger id="custom-width-select" className="w-full">
          <SelectValue placeholder="Full width select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2 with longer text</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Option 2 with longer text')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Option 2 with longer text'));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Option 2 with longer text');
    });
  },
};

/**
 * Select escape and outside click behavior.
 * Tests closing mechanisms and focus management.
 */
export const ClosingBehavior: Story = {
  args: {
    placeholder: 'Test closing behavior...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');

    // Wait for component to be fully mounted and CSS transitions to complete
    await waitFor(
      async () => {
        const styles = window.getComputedStyle(trigger);
        expect(styles.pointerEvents).not.toBe('none');
      },
      { timeout: 2000 }
    );

    // Open select
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    // Close with Escape key
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(canvas.queryByText('Apple')).not.toBeInTheDocument();
    });

    // Open again
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    // Close by clicking outside (click trigger again)
    // Dispatch a mousedown event to simulate clicking outside
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    await waitFor(() => {
      expect(canvas.queryByText('Apple')).not.toBeInTheDocument();
    });
  },
};

/**
 * Small size variant.
 * Demonstrates the compact select size for dense layouts.
 */
export const SmallSize: Story = {
  args: {
    placeholder: 'Small select...',
    size: 'sm',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Apple'));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Apple');
    });
  },
};

/**
 * Large size variant.
 * Demonstrates the large select size for prominent form elements.
 */
export const LargeSize: Story = {
  args: {
    placeholder: 'Large select...',
    size: 'lg',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole('combobox');
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Banana'));

    await waitFor(() => {
      expect(trigger).toHaveTextContent('Banana');
    });
  },
};

/**
 * Size comparison showcase.
 * Shows all three size variants side by side.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="size-small-select"
          className="mb-2 block text-sm font-medium"
        >
          Small
        </label>
        <Select>
          <SelectTrigger id="size-small-select" size="sm">
            <SelectValue placeholder="Small select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small1">Small Option 1</SelectItem>
            <SelectItem value="small2">Small Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="size-default-select"
          className="mb-2 block text-sm font-medium"
        >
          Default
        </label>
        <Select>
          <SelectTrigger id="size-default-select" size="default">
            <SelectValue placeholder="Default select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default1">Default Option 1</SelectItem>
            <SelectItem value="default2">Default Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="size-large-select"
          className="mb-2 block text-sm font-medium"
        >
          Large
        </label>
        <Select>
          <SelectTrigger id="size-large-select" size="lg">
            <SelectValue placeholder="Large select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="large1">Large Option 1</SelectItem>
            <SelectItem value="large2">Large Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test small select trigger by label
    const smallTrigger = canvas.getByLabelText('Small');
    expect(smallTrigger).toBeInTheDocument();

    // Test default select trigger by label
    const defaultTrigger = canvas.getByLabelText('Default');
    expect(defaultTrigger).toBeInTheDocument();

    // Test large select by label
    const largeTrigger = canvas.getByLabelText('Large');
    expect(largeTrigger).toBeInTheDocument();
  },
};
