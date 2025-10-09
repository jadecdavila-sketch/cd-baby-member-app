import type { Meta, StoryObj } from '@storybook/nextjs';
import { HelpCircle, Info } from 'lucide-react';
import { userEvent, within, expect } from 'storybook/test';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/shadcn';

const meta: Meta<typeof Tooltip> = {
  title: 'shared/components/shadcn/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A tooltip component built on Radix UI Tooltip primitive. Provides contextual information on hover or focus. Includes proper accessibility with keyboard navigation.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic tooltip with text trigger.
 * Shows the simplest tooltip implementation.
 */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="underline">Hover me</button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByText('Hover me');
    expect(trigger).toBeInTheDocument();

    // Test hover interaction
    await userEvent.hover(trigger);
    // Note: Testing tooltip content appearance requires more complex setup
  },
};

/**
 * Tooltip with help icon trigger.
 * Common pattern for providing additional context.
 */
export const WithHelpIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Field label</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-4 w-4 items-center justify-center"
            aria-label="More information"
          >
            <HelpCircle className="text-muted-foreground hover:text-foreground h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This provides additional context about the field</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const helpIcon = canvas.getByLabelText('More information');
    expect(helpIcon).toBeInTheDocument();

    // Test keyboard accessibility
    await userEvent.tab();
    expect(helpIcon).toHaveFocus();
  },
};

/**
 * Tooltip with info icon.
 * Alternative icon style for informational tooltips.
 */
export const WithInfoIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Status</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-4 w-4 items-center justify-center"
            aria-label="Status information"
          >
            <Info className="h-4 w-4 text-blue-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your release is currently being processed</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Tooltip with longer content.
 * Shows how tooltips handle multi-line content.
 */
export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="rounded bg-blue-500 px-4 py-2 text-white">
          Distribution Policy
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>
          Your music will be distributed to all major streaming platforms
          including Spotify, Apple Music, Amazon Music, and over 100 other
          stores worldwide. Processing typically takes 1-3 business days.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Multiple tooltips in a form context.
 * Shows how tooltips work together in a form layout.
 */
export const InFormContext: Story = {
  render: () => (
    <div className="max-w-md space-y-4 rounded-lg border p-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <label htmlFor="artist-name" className="text-sm font-medium">
            Artist Name
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-4 w-4 items-center justify-center"
                aria-label="More information about Artist Name"
              >
                <HelpCircle className="text-muted-foreground hover:text-foreground h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enter the name as it should appear on streaming platforms</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <input
          id="artist-name"
          type="text"
          className="w-full rounded-md border px-3 py-2"
          placeholder="Enter artist name"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <label htmlFor="genre" className="text-sm font-medium">
            Primary Genre
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-4 w-4 items-center justify-center"
                aria-label="More information about Primary Genre"
              >
                <HelpCircle className="text-muted-foreground hover:text-foreground h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose the genre that best represents your music style</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <select id="genre" className="w-full rounded-md border px-3 py-2">
          <option value="">Select genre</option>
          <option value="pop">Pop</option>
          <option value="rock">Rock</option>
          <option value="jazz">Jazz</option>
        </select>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const artistTooltip = canvas.getByLabelText(
      'More information about Artist Name'
    );
    const genreTooltip = canvas.getByLabelText(
      'More information about Primary Genre'
    );

    expect(artistTooltip).toBeInTheDocument();
    expect(genreTooltip).toBeInTheDocument();
  },
};

/**
 * Tooltip with custom positioning.
 * Shows different positioning options for tooltips.
 */
export const CustomPositioning: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div className="text-center">
        <p className="mb-4">Top positioning</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded bg-gray-200 px-4 py-2">
              Top Tooltip
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>This tooltip appears above</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-center">
        <p className="mb-4">Bottom positioning</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded bg-gray-200 px-4 py-2">
              Bottom Tooltip
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>This tooltip appears below</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-center">
        <p className="mb-4">Left positioning</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded bg-gray-200 px-4 py-2">
              Left Tooltip
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>This tooltip appears to the left</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-center">
        <p className="mb-4">Right positioning</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded bg-gray-200 px-4 py-2">
              Right Tooltip
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>This tooltip appears to the right</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};
