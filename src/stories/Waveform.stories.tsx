import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useCallback, useEffect, useState } from 'react';

import { Waveform } from '../shared/components/form/waveform';

import audioFileUrl from './assets/audio-sample.mp3';

const meta: Meta<typeof Waveform> = {
  title: 'shared/components/form/Waveform',
  component: Waveform,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A controlled form input component for audio waveform visualization with time offset selection. Features play/pause controls, real-time waveform rendering using Web Audio API, 30-second selector, and keyboard navigation. Supports MP3, WAV, FLAC, AAC, OGG, and WebM formats up to 100MB.',
      },
    },
  },
  argTypes: {
    audioFile: {
      control: false,
      description: 'Audio file to visualize',
    },
    value: {
      control: 'number',
      description: 'Current time offset in seconds',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback when time offset changes',
    },
    label: {
      control: 'text',
      description: 'Label for the waveform component',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display',
    },
  },
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof Waveform>;

// Load real audio file from assets
const loadAudioFile = async (): Promise<File> => {
  const response = await fetch(audioFileUrl);
  const blob = await response.blob();
  return new File([blob], 'audio-sample.mp3', { type: 'audio/mpeg' });
};

// Wrapper component to handle async audio file loading
const WaveformWithAudioFile = (props: any) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    loadAudioFile().then(setAudioFile);
  }, []);

  const handleChange = useCallback((updatedValue: number) => {
    setValue(updatedValue);
  }, []);

  if (!audioFile) {
    return <div>Loading audio file...</div>;
  }

  return (
    <Waveform
      {...props}
      audioFile={audioFile}
      value={value}
      onChange={handleChange}
    />
  );
};

/**
 * Default waveform component with real audio file
 * Demonstrates Web Audio API integration with automatic waveform generation
 */
export const Default: Story = {
  render: WaveformWithAudioFile,
  args: {
    id: 'waveform-default',
    label: 'Select Start Time',
    value: 0,
    helperText:
      'Real waveform generated using Web Audio API - Use the selector to choose a 30-second segment',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for audio to load and process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if the label is rendered
    const label = canvas.getByText('Select Start Time');
    expect(label).toBeInTheDocument();

    // Check if waveform canvas is rendered
    const waveformCanvas = canvas.getByLabelText(
      /Audio waveform visualization/i
    );
    expect(waveformCanvas).toBeInTheDocument();
  },
};

/**
 * Waveform component with tooltip
 */
export const WithTooltip: Story = {
  render: WaveformWithAudioFile,
  args: {
    id: 'waveform-tooltip',
    label: 'Select Start Time',
    value: 15,
    tooltip: 'Choose the starting point for your 30-second audio preview',
    tooltipId: 'waveform-tooltip-trigger',
    helperText: 'Drag the selector or use arrow keys to adjust',
  },
};

/**
 * Required waveform field
 */
export const Required: Story = {
  render: WaveformWithAudioFile,
  args: {
    id: 'waveform-required',
    label: 'Select Start Time',
    value: 0,
    required: true,
    helperText: 'This field is required',
  },
};

/**
 * Waveform with error state
 */
export const WithError: Story = {
  render: WaveformWithAudioFile,
  args: {
    id: 'waveform-error',
    label: 'Select Start Time',
    value: 0,
    error: 'Start time must be within the first 90 seconds',
  },
};

/**
 * Disabled waveform component
 */
export const Disabled: Story = {
  render: WaveformWithAudioFile,
  args: {
    id: 'waveform-disabled',
    label: 'Select Start Time',
    value: 30,
    disabled: true,
    helperText: 'This field is currently disabled',
  },
};

/**
 * Interactive waveform with controlled state
 */
const InteractiveWrapper = (props: any) => {
  const [value, setValue] = useState(props.value ?? 0);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    loadAudioFile().then(setAudioFile);
  }, []);

  if (!audioFile) {
    return <div>Loading audio file...</div>;
  }

  return (
    <div className="space-y-4">
      <Waveform
        {...props}
        audioFile={audioFile}
        value={value}
        onChange={setValue}
      />
      <div className="text-muted-foreground text-sm">
        Selected time offset: {value} seconds
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: InteractiveWrapper,
  args: {
    id: 'waveform-interactive',
    label: 'Select Start Time',
    value: 0,
    helperText: 'Try dragging the selector or using arrow keys',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for audio to load
    await waitFor(
      async () => {
        const slider = canvas.getByRole('slider', {
          name: /time selector/i,
        });
        expect(slider).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const slider = canvas.getByRole('slider', { name: /time selector/i });

    // Verify initial ARIA attributes
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuenow', '0');

    // Test keyboard navigation - ArrowRight (5 second increment)
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');

    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuenow', '5');
    });

    // Test Shift + ArrowRight (1 second increment)
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');

    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuenow', '6');
    });

    // Test ArrowLeft (5 second decrement)
    await userEvent.keyboard('{ArrowLeft}');

    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuenow', '1');
    });

    // Test Home key (jump to start)
    await userEvent.keyboard('{Home}');

    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    // Test aria-valuetext updates
    expect(slider).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('Start time')
    );
    expect(slider).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('30 seconds')
    );
  },
};

/**
 * Complete example with all features
 */
export const Complete: Story = {
  render: InteractiveWrapper,
  args: {
    id: 'waveform-complete',
    label: 'Audio Preview Start Time',
    value: 0,
    required: true,
    tooltip: 'Select where your 30-second preview should start',
    tooltipId: 'waveform-complete-tooltip',
    helperText:
      'Drag the selector, use arrow keys (←→ for 5s, Shift+←→ for 1s), or Home/End keys',
  },
};
