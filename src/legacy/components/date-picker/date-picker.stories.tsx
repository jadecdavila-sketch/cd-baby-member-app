import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { DatePicker } from '@/components/date-picker';
import { addDays } from 'date-fns';

/**
 * A dat field component that allows users to enter and edit date.
 */
const meta: Meta<typeof DatePicker> = {
  title: 'ui/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    onSelect: action('onSelect'),
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

/**
 * The default form of the date picker.
 */
export const Default: Story = {};

/**
 * DatePicker with a specific initial date
 */
export const WithInitialDate: Story = {
  args: {
    selected: new Date(2025, 4, 21), // May 21, 2025
  },
};

/**
 * DatePicker with a range of dates disabled (all days before today)
 */
export const DisabledRange: Story = {
  args: {
    disabled: { before: new Date() },
  },
};

/**
 * DatePicker with specific dates disabled (four days starting from tomorrow)
 */
export const DisabledSpecific: Story = {
  args: {
    disabled: [
      addDays(new Date(), 1),
      addDays(new Date(), 2),
      addDays(new Date(), 3),
      addDays(new Date(), 4),
    ],
  },
};

/**
 * DatePicker with disabled popover (input disabled) and initial date
 */
export const DisabledPopover: Story = {
  args: {
    selected: new Date(2025, 4, 21), // May 21, 2025
    popoverDisabled: true,
  },
};
