import type { Meta, StoryObj } from '@storybook/nextjs';

import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Label } from '@/components/label';

/**
 * A set of checkable buttons—known as radio buttons—where no more than one of
 * the buttons can be checked at a time.
 */
const meta = {
  title: 'ui/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    defaultValue: 'comfortable',
    className: 'grid gap-2 grid-cols-[1rem_1fr] items-center',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the radio group.
 */
export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="default" id="r1" />
      <label htmlFor="r1">Default</label>
      <RadioGroupItem value="comfortable" id="r2" />
      <label htmlFor="r2">Comfortable</label>
      <RadioGroupItem value="compact" id="r3" />
      <label htmlFor="r3">Compact</label>
    </RadioGroup>
  ),
};

/**
 * Radio group with a label.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label>Choose a layout</Label>
      <div className="flex flex-col gap-2">
        <RadioGroup {...args} defaultValue="">
          <RadioGroupItem value="default" id="r1a" />
          <label htmlFor="r1a">Default</label>
          <RadioGroupItem value="comfortable" id="r2a" />
          <label htmlFor="r2a">Comfortable</label>
          <RadioGroupItem value="compact" id="r3a" />
          <label htmlFor="r3a">Compact</label>
        </RadioGroup>
      </div>
    </div>
  ),
};

/**
 * This is an example of a radio group with an error message.
 * The label color is changed to indicate an error state.
 * For an example of how this is used with validation logic, see the `Form` component.
 */
export const WithError: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label className="data-[error=true]:text-destructive" data-error>
        Choose a layout
      </Label>
      <div className="flex flex-col gap-2">
        <RadioGroup {...args} defaultValue="">
          <RadioGroupItem value="default" id="r1b" />
          <label htmlFor="r1b">Default</label>
          <RadioGroupItem value="comfortable" id="r2b" />
          <label htmlFor="r2b">Comfortable</label>
          <RadioGroupItem value="compact" id="r3b" />
          <label htmlFor="r3b">Compact</label>
        </RadioGroup>
        <p className="text-destructive text-sm">Please make a selection.</p>
      </div>
    </div>
  ),
};
