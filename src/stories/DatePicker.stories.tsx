import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';
import { userEvent, within, waitFor, expect } from 'storybook/test';

import {
  DatePicker,
  DatePickerProps,
} from '@/shared/components/form/date-picker';
import { useState } from 'react';

const DatePickerStory = (props: DatePickerProps) => {
  const [value, setValue] = useState<Date | undefined>(props.value);

  const handleChange = (updatedDate?: Date) => {
    console.log(updatedDate);
    setValue(updatedDate);
  };

  return (
    <DatePicker
      {...props}
      value={value}
      onChange={props.onChange ?? handleChange}
    />
  );
};

const meta: Meta<typeof DatePicker> = {
  title: 'shared/components/Form/DatePicker',
  component: DatePickerStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A date picker component built on Radix UI Calendar primitive with shadcn/ui styling. Supports controlled and uncontrolled modes with proper accessibility features.',
      },
    },
  },
  argTypes: {
    placeholder: {
      description: 'Placeholder text shown when no date is selected',
      control: { type: 'text' },
    },
    disabled: {
      description: 'Whether the date picker is disabled',
      control: { type: 'boolean' },
    },
    value: {
      description: 'The selected date value (controlled mode)',
    },
    onChange: {
      description: 'Callback function called when date selection changes',
    },
    className: {
      description: 'Additional CSS classes to apply to the date picker',
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default date picker with standard placeholder.
 * This story demonstrates the basic usage of the DatePicker component.
 */
export const Default: Story = {
  args: {
    placeholder: 'Select date',
    onChange: action('Date selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that date picker renders correctly
    await waitFor(() => {
      expect(canvas.getByRole('button')).toBeInTheDocument();
      expect(canvas.getByText('Select date')).toBeInTheDocument();
    });
  },
};

/**
 * Date picker with a pre-selected value.
 * This story shows how the component appears when a date is already selected.
 */
export const WithValue: Story = {
  args: {
    value: new Date('2024-12-25'),
    placeholder: 'Select date',
    onChange: action('Date changed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that the selected date is displayed (format may vary)
    await waitFor(() => {
      const button = canvas.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toMatch(/2024/);
      expect(button.textContent).toMatch(/25/);
    });
  },
};

/**
 * Date picker with custom placeholder text.
 * This story demonstrates how to customize the placeholder for specific use cases.
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose your release date',
    onChange: action('Release date selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test custom placeholder text
    await waitFor(() => {
      expect(canvas.getByText('Choose your release date')).toBeInTheDocument();
    });
  },
};

/**
 * Disabled date picker.
 * This story shows how the component appears and behaves when disabled.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Date unavailable',
    onChange: action('Date selected (should not fire)'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that the button is disabled
    await waitFor(() => {
      const button = canvas.getByRole('button');
      expect(button).toBeDisabled();
      expect(canvas.getByText('Date unavailable')).toBeInTheDocument();
    });
  },
};

/**
 * Interactive date selection.
 * This story demonstrates the complete date selection flow.
 */
export const InteractiveDateSelection: Story = {
  args: {
    placeholder: 'Pick a date',
    // onChange: action('Date selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Click to open the date picker
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);

    // Wait for calendar to appear
    await waitFor(() => {
      expect(canvas.getByRole('dialog')).toBeInTheDocument();
    });

    // Select a date (assuming current month contains day 15)
    const dateButton = canvas.getByText('15'); // canvas.getByRole('gridcell', { name: '15' });
    if (dateButton && !dateButton.getAttribute('aria-disabled')) {
      await userEvent.click(dateButton);

      // Calendar should close after selection
      await waitFor(
        () => {
          expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    }
  },
};

/**
 * Calendar navigation demonstration.
 * This story shows how users can navigate between months and years.
 */
export const CalendarNavigation: Story = {
  args: {
    placeholder: 'Navigate calendar',
    onChange: action('Date selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Open the date picker
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);

    // Wait for calendar to appear
    await waitFor(() => {
      expect(canvas.getByRole('dialog')).toBeInTheDocument();
    });

    // Test month navigation
    const nextButton = canvas.getByRole('button', { name: /next month/i });
    if (nextButton) {
      await userEvent.click(nextButton);

      // Calendar should still be open with new month
      await waitFor(() => {
        expect(canvas.getByRole('dialog')).toBeInTheDocument();
      });
    }

    const prevButton = canvas.getByRole('button', { name: /previous month/i });
    if (prevButton) {
      await userEvent.click(prevButton);
    }
  },
};
