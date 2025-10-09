import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect } from 'storybook/test';

import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/shadcn';

const meta: Meta<typeof RadioGroup> = {
  title: 'shared/components/shadcn/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A set of checkable buttons—known as radio buttons—where only one button can be checked at a time. Built on Radix UI Radio Group primitive with full accessibility support.',
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The value of the radio item that should be checked when initially rendered',
    },
    value: {
      control: 'text',
      description: 'The controlled value of the radio item to check',
    },
    onValueChange: {
      action: 'valueChanged',
      description: 'Event handler called when the value changes',
    },
    disabled: {
      control: 'boolean',
      description: 'When true, prevents the user from interacting with the radio group',
    },
    required: {
      control: 'boolean',
      description: 'When true, indicates that the user must check a radio item before the owning form can be submitted',
    },
    name: {
      control: 'text',
      description: 'The name of the group, used when submitting a form',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the radio group',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic radio group with default options.
 * Shows the default styling and behavior.
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const option1 = canvas.getByLabelText('Option 1');
    const option2 = canvas.getByLabelText('Option 2');
    const option3 = canvas.getByLabelText('Option 3');

    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();
    expect(option3).not.toBeChecked();

    // Select option 2
    await userEvent.click(option2);
    expect(option2).toBeChecked();
    expect(option1).not.toBeChecked();
  },
};

/**
 * Disabled radio group.
 * Shows how radio buttons behave when disabled.
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <RadioGroup defaultValue="option-1" disabled>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-1" id="disabled-option-1" />
          <Label htmlFor="disabled-option-1">Option 1 (Disabled Group)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-2" id="disabled-option-2" />
          <Label htmlFor="disabled-option-2">Option 2 (Disabled Group)</Label>
        </div>
      </RadioGroup>

      <RadioGroup defaultValue="option-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-1" id="individual-option-1" />
          <Label htmlFor="individual-option-1">Option 1 (Enabled)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-2" id="individual-option-2" disabled />
          <Label htmlFor="individual-option-2">Option 2 (Disabled Item)</Label>
        </div>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledOption1 = canvas.getByLabelText('Option 1 (Disabled Group)');
    const disabledOption2 = canvas.getByLabelText('Option 2 (Disabled Group)');
    const enabledOption = canvas.getByLabelText('Option 1 (Enabled)');
    const disabledIndividual = canvas.getByLabelText('Option 2 (Disabled Item)');

    expect(disabledOption1).toBeDisabled();
    expect(disabledOption2).toBeDisabled();
    expect(disabledIndividual).toBeDisabled();
    expect(enabledOption).not.toBeDisabled();

    // Try to click disabled options
    await userEvent.click(disabledOption2);
    expect(disabledOption1).toBeChecked(); // Should remain on option 1

    // Click enabled option should work
    await userEvent.click(enabledOption);
    expect(enabledOption).toBeChecked();
  },
};

/**
 * Radio group with labels and descriptions.
 * Shows pattern for providing additional context with each option.
 */
export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="basic">
      <div className="flex items-start space-x-3">
        <RadioGroupItem value="basic" id="basic-plan" />
        <div className="grid gap-1.5">
          <Label htmlFor="basic-plan" className="text-base">
            Basic Plan
          </Label>
          <p className="text-sm text-muted-foreground">
            Perfect for individuals getting started
          </p>
          <span className="text-sm font-medium">$9/month</span>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <RadioGroupItem value="pro" id="pro-plan" />
        <div className="grid gap-1.5">
          <Label htmlFor="pro-plan" className="text-base">
            Professional Plan
          </Label>
          <p className="text-sm text-muted-foreground">
            Best for small teams and businesses
          </p>
          <span className="text-sm font-medium">$29/month</span>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <RadioGroupItem value="enterprise" id="enterprise-plan" />
        <div className="grid gap-1.5">
          <Label htmlFor="enterprise-plan" className="text-base">
            Enterprise Plan
          </Label>
          <p className="text-sm text-muted-foreground">
            For large organizations with advanced needs
          </p>
          <span className="text-sm font-medium">$99/month</span>
        </div>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const basicPlan = canvas.getByLabelText('Basic Plan');
    const proPlan = canvas.getByLabelText('Professional Plan');
    const enterprisePlan = canvas.getByLabelText('Enterprise Plan');

    expect(basicPlan).toBeChecked();

    await userEvent.click(proPlan);
    expect(proPlan).toBeChecked();
    expect(basicPlan).not.toBeChecked();
  },
};

/**
 * Horizontal orientation radio group.
 * Shows radio buttons arranged horizontally.
 */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="left" orientation="horizontal" className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="left" id="left-align" />
        <Label htmlFor="left-align">Left</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="center" id="center-align" />
        <Label htmlFor="center-align">Center</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="right" id="right-align" />
        <Label htmlFor="right-align">Right</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const leftOption = canvas.getByLabelText('Left');
    const centerOption = canvas.getByLabelText('Center');
    const rightOption = canvas.getByLabelText('Right');

    expect(leftOption).toBeChecked();

    await userEvent.click(centerOption);
    expect(centerOption).toBeChecked();
  },
};

/**
 * Radio group with error state.
 * Demonstrates error styling and validation pattern.
 */
export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <RadioGroup defaultValue="" required>
        <legend className="text-sm font-medium text-red-600 mb-2">
          Please select an option *
        </legend>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-1" id="error-option-1" />
          <Label htmlFor="error-option-1" className="text-red-700">
            Option 1
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-2" id="error-option-2" />
          <Label htmlFor="error-option-2" className="text-red-700">
            Option 2
          </Label>
        </div>
      </RadioGroup>
      <p className="text-sm text-red-600">This field is required</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const option1 = canvas.getByLabelText('Option 1');
    const option2 = canvas.getByLabelText('Option 2');
    const errorMessage = canvas.getByText('This field is required');

    expect(errorMessage).toBeInTheDocument();

    // Selecting an option should "resolve" the error
    await userEvent.click(option1);
    expect(option1).toBeChecked();
  },
};

/**
 * Radio group in a form context.
 * Shows complete form usage with proper labeling and structure.
 */
export const InForm: Story = {
  render: () => (
    <form className="space-y-6 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Account Settings</h3>

      <div className="space-y-4">
        <div>
          <legend className="text-sm font-medium mb-3">Communication Preferences</legend>
          <RadioGroup defaultValue="email">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="comm-email" />
              <Label htmlFor="comm-email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="comm-sms" />
              <Label htmlFor="comm-sms">SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="comm-both" />
              <Label htmlFor="comm-both">Both</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="comm-none" />
              <Label htmlFor="comm-none">None</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <legend className="text-sm font-medium mb-3">Privacy Settings</legend>
          <RadioGroup defaultValue="public">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="privacy-public" />
              <Label htmlFor="privacy-public">Public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friends" id="privacy-friends" />
              <Label htmlFor="privacy-friends">Friends Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="privacy-private" />
              <Label htmlFor="privacy-private">Private</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailOption = canvas.getByLabelText('Email');
    const smsOption = canvas.getByLabelText('SMS');
    const publicOption = canvas.getByLabelText('Public');
    const privateOption = canvas.getByLabelText('Private');

    expect(emailOption).toBeChecked();
    expect(publicOption).toBeChecked();

    await userEvent.click(smsOption);
    expect(smsOption).toBeChecked();

    await userEvent.click(privateOption);
    expect(privateOption).toBeChecked();
  },
};

/**
 * Custom styled radio group.
 * Shows how to apply custom styling while maintaining functionality.
 */
export const CustomStyling: Story = {
  render: () => (
    <RadioGroup defaultValue="fancy-1" className="space-y-3">
      <div className="flex items-center space-x-3 rounded-lg border-2 border-purple-200 p-3 hover:border-purple-400">
        <RadioGroupItem 
          value="fancy-1" 
          id="fancy-1" 
          className="text-purple-600 border-2 border-purple-300 h-5 w-5"
        />
        <Label htmlFor="fancy-1" className="text-purple-700 font-bold text-lg">
          Fancy Option 1
        </Label>
      </div>
      
      <div className="flex items-center space-x-3 rounded-lg border-2 border-blue-200 p-3 hover:border-blue-400">
        <RadioGroupItem 
          value="fancy-2" 
          id="fancy-2" 
          className="text-blue-600 border-2 border-blue-300 h-5 w-5"
        />
        <Label htmlFor="fancy-2" className="text-blue-700 font-bold text-lg">
          Fancy Option 2
        </Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const fancy1 = canvas.getByLabelText('Fancy Option 1');
    const fancy2 = canvas.getByLabelText('Fancy Option 2');

    expect(fancy1).toBeChecked();

    await userEvent.click(fancy2);
    expect(fancy2).toBeChecked();
  },
};