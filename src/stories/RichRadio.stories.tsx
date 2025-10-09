import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect } from 'storybook/test';

import { RadioGroup } from '@/shared/components/shadcn/radio-group';
import { RichRadioItem } from '@/shared/components/form/rich-radio/rich-radio-item';

const meta: Meta<typeof RadioGroup> = {
  title: 'shared/components/shadcn/RichRadio',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Rich radio buttons with custom content layout. Rectangular containers that can hold any content and show selection via border color.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/**
 * Basic rich radio buttons with custom content.
 * Shows rectangular containers that can hold images, text, and complex layouts.
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="express">
      <div className="flex flex-row space-x-4">
        <RichRadioItem value="standard">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-xl">🚀</span>
            </div>
            <div className="w-1/2">
              <div className="font-semibold">Standard Release</div>
              <div className="text-muted-foreground text-sm">
                We'll review your music before sending to partners (3-5 business
                days)
              </div>
            </div>
          </div>
        </RichRadioItem>

        <RichRadioItem value="express">
          <div className="flex items-start space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <div className="font-semibold">Express Release</div>
              <div className="text-muted-foreground text-sm">
                We'll send your music to our partners after a quick review
                (usually 1-3 business days)
              </div>
            </div>
          </div>
        </RichRadioItem>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const standardOption = canvas.getByRole('radio', {
      name: /Standard Release/i,
    });
    const expressOption = canvas.getByRole('radio', {
      name: /Express Release/i,
    });

    expect(expressOption).toBeChecked();

    await userEvent.click(standardOption);
    expect(standardOption).toBeChecked();
    expect(expressOption).not.toBeChecked();
  },
};

/**
 * Rich radio buttons with pricing information.
 * Shows how to include additional elements like pricing.
 */
export const WithPricing: Story = {
  render: () => (
    <RadioGroup defaultValue="pro">
      <div className="space-y-4">
        <RichRadioItem value="basic">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl">💼</span>
              </div>
              <div>
                <div className="font-semibold">Basic Plan</div>
                <div className="text-muted-foreground text-sm">
                  Perfect for individual artists
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">$9.99</div>
              <div className="text-muted-foreground text-xs">per release</div>
            </div>
          </div>
        </RichRadioItem>

        <RichRadioItem value="pro">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <div className="font-semibold">Pro Plan</div>
                <div className="text-muted-foreground text-sm">
                  For serious artists and labels
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">$29.99</div>
              <div className="text-muted-foreground text-xs">per release</div>
            </div>
          </div>
        </RichRadioItem>
      </div>
    </RadioGroup>
  ),
};

/**
 * Disabled rich radio button state.
 * Shows how disabled items appear and behave.
 */
export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="available">
      <div className="space-y-4">
        <RichRadioItem value="available">
          <div className="flex items-start space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <div className="font-semibold">Available Option</div>
              <div className="text-muted-foreground text-sm">
                This option is selectable
              </div>
            </div>
          </div>
        </RichRadioItem>

        <RichRadioItem value="unavailable" disabled>
          <div className="flex items-start space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl">🚫</span>
            </div>
            <div>
              <div className="font-semibold">Unavailable Option</div>
              <div className="text-muted-foreground text-sm">
                This option is currently disabled
              </div>
            </div>
          </div>
        </RichRadioItem>
      </div>
    </RadioGroup>
  ),
};
