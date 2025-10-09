import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from 'storybook/actions';
import { userEvent, within, waitFor, expect } from 'storybook/test';

import { TimePicker } from '@/shared/components/form/time-picker';

const meta: Meta<typeof TimePicker> = {
  title: 'shared/components/Form/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A time picker component built with Radix UI Popover and custom select controls. Supports controlled and uncontrolled modes with proper accessibility features for hour, minute, and AM/PM selection.',
      },
    },
  },
  argTypes: {
    placeholder: {
      description: 'Placeholder text shown when no time is selected',
      control: { type: 'text' },
    },
    value: {
      description: 'The selected time value (controlled mode)',
    },
    onChange: {
      description: 'Callback function called when time selection changes',
    },
    className: {
      description: 'Additional CSS classes to apply to the time picker',
    },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default time picker with standard placeholder.
 * This story demonstrates the basic usage of the TimePicker component.
 */
export const Default: Story = {
  args: {
    placeholder: 'Select time',
    onChange: action('Time selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that time picker renders correctly
    await waitFor(() => {
      expect(canvas.getByRole('button')).toBeInTheDocument();
      expect(canvas.getByText('Select time')).toBeInTheDocument();
    });
  },
};

/**
 * Time picker with a pre-selected value.
 * This story shows how the component appears when a time is already selected.
 */
export const WithValue: Story = {
  args: {
    value: (() => {
      const time = new Date();
      time.setHours(14, 30, 0, 0); // 2:30 PM
      return time;
    })(),
    placeholder: 'Select time',
    onChange: action('Time changed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that the selected time is displayed
    await waitFor(() => {
      expect(canvas.getByText('02:30 PM')).toBeInTheDocument();
    });
  },
};

/**
 * Time picker with custom placeholder text.
 * This story demonstrates how to customize the placeholder for specific use cases.
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose event time',
    onChange: action('Event time selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test custom placeholder text
    await waitFor(() => {
      expect(canvas.getByText('Choose event time')).toBeInTheDocument();
    });
  },
};

/**
 * Time picker with custom styling.
 * This story demonstrates how the component can be styled with additional CSS classes.
 */
export const WithCustomStyling: Story = {
  args: {
    placeholder: 'Select appointment time',
    className: 'border-2 border-blue-500',
    onChange: action('Appointment time selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that the custom styled component renders
    await waitFor(() => {
      expect(canvas.getByText('Select appointment time')).toBeInTheDocument();
    });
  },
};

/**
 * Morning time selection example.
 * This story demonstrates a typical morning time usage.
 */
export const MorningTime: Story = {
  args: {
    value: (() => {
      const time = new Date();
      time.setHours(9, 15, 0, 0); // 9:15 AM
      return time;
    })(),
    placeholder: 'Select time',
    onChange: action('Morning time selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that the morning time is displayed
    await waitFor(() => {
      expect(canvas.getByText('09:15 AM')).toBeInTheDocument();
    });
  },
};

/**
 * Evening time selection example.
 * This story demonstrates a typical evening time usage.
 */
export const EveningTime: Story = {
  args: {
    value: (() => {
      const time = new Date();
      time.setHours(19, 45, 0, 0); // 7:45 PM
      return time;
    })(),
    placeholder: 'Select time',
    onChange: action('Evening time selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test that the evening time is displayed
    await waitFor(() => {
      expect(canvas.getByText('07:45 PM')).toBeInTheDocument();
    });
  },
};

/**
 * Interactive time selection.
 * This story demonstrates the complete time selection flow.
 */
export const InteractiveTimeSelection: Story = {
  args: {
    placeholder: 'Pick a time',
    onChange: action('Time selected'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    // Click to open the time picker
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);

    // Wait for time selector to appear
    await waitFor(() => {
      expect(canvas.getByRole('dialog')).toBeInTheDocument();
    });

    // Select hour dropdown and change to 12
    const hourSelect = canvas.getByLabelText('Select hours');
    await userEvent.selectOptions(hourSelect, '12');

    // Select minute dropdown and change to 00
    const minuteSelect = canvas.getByLabelText('Select minutes');
    await userEvent.selectOptions(minuteSelect, '00');

    // Select AM/PM dropdown and change to PM
    const periodSelect = canvas.getByLabelText('Select AM or PM');
    await userEvent.selectOptions(periodSelect, 'PM');

    // Verify the selected time is shown
    await waitFor(() => {
      expect(canvas.getByText('Selected: 12:00 PM')).toBeInTheDocument();
    });
  },
};
