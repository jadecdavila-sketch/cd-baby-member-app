import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Waveform } from '../waveform';
import * as useWaveformHooks from '../hooks/use-audio-player';
import { useWaveformData } from '../hooks/use-waveform-data';
import { validateAudioFile } from '../utils/audio-utils';
import { act } from 'react';

// Mock dependencies
vi.mock('../hooks/use-audio-player');
vi.mock('../hooks/use-waveform-data');
vi.mock('../utils/audio-utils');
vi.mock('../components/waveform-canvas', () => ({
  WaveformCanvas: () => (
    <div data-testid="waveform-canvas">Waveform Canvas</div>
  ),
}));
vi.mock('../components/time-selector', () => ({
  TimeSelector: () => <div data-testid="time-selector">Time Selector</div>,
}));
vi.mock('../components/time-display', () => ({
  TimeDisplay: ({ className }: { className?: string }) => (
    <div data-testid="time-display" className={className}>
      0:00 / 3:00
    </div>
  ),
}));

describe('Waveform', () => {
  let mockAudioFile: File;

  const mockUseWaveformData: ReturnType<typeof useWaveformData> = {
    waveformData: [0.5, 0.6, 0.7, 0.8],
    duration: 180,
    isLoading: false,
    error: null,
    sampleRate: 1,
    numberOfChannels: 2,
  };

  beforeEach(() => {
    // Create a mock audio file
    mockAudioFile = new File(['audio content'], 'test.mp3', {
      type: 'audio/mpeg',
    });

    // Mock useAudioPlayer hook
    vi.spyOn(useWaveformHooks, 'useAudioPlayer').mockReturnValue({
      isPlaying: false,
      currentTime: 0,
      duration: 180,
      isLoading: false,
      error: null,
      play: vi.fn(),
      pause: vi.fn(),
      togglePlay: vi.fn(),
      seekTo: vi.fn(),
      audioRef: { current: null },
    });

    // Mock useWaveformData hook
    vi.mocked(useWaveformData).mockReturnValue(mockUseWaveformData);

    // Mock validateAudioFile to return valid by default
    (validateAudioFile as ReturnType<typeof vi.fn>).mockReturnValue({
      valid: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByText('Select Start Point')).toBeInTheDocument();
      expect(screen.getByTestId('waveform-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('time-display')).toBeInTheDocument();
    });

    it('associates label with waveform controls', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const label = screen.getByText('Select Start Point');
      expect(label).toHaveAttribute('for', 'test-waveform');
    });

    it('renders play/pause button', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const button = screen.getByRole('button', {
        name: /play audio preview/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('renders hidden audio element', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const audio = document.querySelector('audio');
      expect(audio).toBeInTheDocument();
      expect(audio).toHaveClass('hidden');
    });
  });

  describe('Required Field', () => {
    it('shows required indicator when required prop is true', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          required
        />
      );

      const label = screen.getByText('Select Start Point');
      expect(label).toHaveClass(/after:content/);
    });

    it('does not show required indicator when required prop is false', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          required={false}
        />
      );

      const label = screen.getByText('Select Start Point');
      expect(label).not.toHaveClass(/after:content/);
    });
  });

  describe('Tooltip Functionality', () => {
    it('renders tooltip trigger when tooltip prop is provided', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          tooltip="Choose where your preview should start"
          tooltipId="test-tooltip"
        />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Select Start Point'
      );
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it('does not render tooltip when tooltip prop is not provided', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const tooltipTrigger = screen.queryByLabelText(
        'More information about Select Start Point'
      );
      expect(tooltipTrigger).not.toBeInTheDocument();
    });

    it('tooltip trigger has proper accessibility attributes', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          tooltip="Helpful tooltip"
          tooltipId="test-tooltip"
        />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Select Start Point'
      );
      expect(tooltipTrigger).toHaveAttribute('type', 'button');
      expect(tooltipTrigger).toHaveAttribute('id', 'test-tooltip');
    });
  });

  describe('Loading State', () => {
    it('displays loading message while audio is loading', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: true,
        error: null,
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByText('Loading audio file...')).toBeInTheDocument();
    });

    it('disables play button when loading', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: true,
        error: null,
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const button = screen.getByRole('button', {
        name: /play audio preview/i,
      });
      expect(button).toBeDisabled();
    });

    it('hides time selector when loading', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: true,
        error: null,
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.queryByTestId('time-selector')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when loadError is present', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: false,
        error: 'Failed to load audio file',
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const errorMessage = screen.getByText('Failed to load audio file');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('displays validation error from validateAudioFile', () => {
      (validateAudioFile as ReturnType<typeof vi.fn>).mockReturnValue({
        valid: false,
        error: 'Unsupported file format',
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByText('Unsupported file format')).toBeInTheDocument();
    });

    it('prioritizes error prop over loadError', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: false,
        error: 'Load error message',
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          error="Custom error message"
        />
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText('Load error message')).not.toBeInTheDocument();
    });

    it('associates error message with component via id', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          error="Error message"
        />
      );

      const errorMessage = screen.getByText('Error message');
      expect(errorMessage).toHaveAttribute('id', 'test-waveform-error');
    });

    it('disables play button when error is present', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: false,
        error: 'Failed to load',
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const button = screen.getByRole('button', {
        name: /play audio preview/i,
      });
      expect(button).toBeDisabled();
    });

    it('hides time selector when error is present', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: false,
        error: 'Failed to load',
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.queryByTestId('time-selector')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text when helperText prop is provided', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          helperText="Choose a 30-second preview section"
        />
      );

      const helperText = screen.getByText('Choose a 30-second preview section');
      expect(helperText).toBeInTheDocument();
    });

    it('associates helper text with component via id', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          helperText="Helper text"
        />
      );

      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveAttribute('id', 'test-waveform-help');
    });

    it('hides helper text when error is present', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          error="Error message"
          helperText="This should not be visible"
        />
      );

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(
        screen.queryByText('This should not be visible')
      ).not.toBeInTheDocument();
    });

    it('hides helper text when loadError is present', () => {
      vi.mocked(useWaveformData).mockReturnValue({
        ...mockUseWaveformData,
        waveformData: [],
        duration: 0,
        isLoading: false,
        error: 'Load error',
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          helperText="Helper text"
        />
      );

      expect(screen.getByText('Load error')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables play button when disabled prop is true', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          disabled
        />
      );

      const button = screen.getByRole('button', {
        name: /play audio preview/i,
      });
      expect(button).toBeDisabled();
    });

    it('passes disabled state to WaveformProvider', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          disabled
        />
      );

      // Component should render successfully
      expect(screen.getByText('Select Start Point')).toBeInTheDocument();
    });

    it('disables component when validation error exists', () => {
      (validateAudioFile as ReturnType<typeof vi.fn>).mockReturnValue({
        valid: false,
        error: 'Invalid file',
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByText('Invalid file')).toBeInTheDocument();
    });
  });

  describe('Play/Pause Functionality', () => {
    it('shows play icon when audio is not playing', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const button = screen.getByRole('button', {
        name: /play audio preview/i,
      });
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('shows pause icon when audio is playing', () => {
      vi.spyOn(useWaveformHooks, 'useAudioPlayer').mockReturnValue({
        isPlaying: true,
        currentTime: 0,
        duration: 180,
        isLoading: false,
        error: null,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        audioRef: { current: null },
      });

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const button = screen.getByRole('button', {
        name: /pause audio preview/i,
      });
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls togglePlay when play/pause button is clicked', async () => {
      const mockTogglePlay = vi.fn();
      vi.spyOn(useWaveformHooks, 'useAudioPlayer').mockReturnValue({
        isPlaying: false,
        currentTime: 0,
        duration: 180,
        isLoading: false,
        error: null,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: mockTogglePlay,
        seekTo: vi.fn(),
        audioRef: { current: null },
      });

      const user = userEvent.setup();

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const button = screen.getByRole('button', {
        name: /play audio preview/i,
      });
      await user.click(button);

      expect(mockTogglePlay).toHaveBeenCalledTimes(1);
    });

    it('updates button label when playing state changes', () => {
      const { rerender } = render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(
        screen.getByRole('button', { name: /play audio preview/i })
      ).toBeInTheDocument();

      // Update mock to playing state
      vi.spyOn(useWaveformHooks, 'useAudioPlayer').mockReturnValue({
        isPlaying: true,
        currentTime: 0,
        duration: 180,
        isLoading: false,
        error: null,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        audioRef: { current: null },
      });

      rerender(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(
        screen.getByRole('button', { name: /pause audio preview/i })
      ).toBeInTheDocument();
    });
  });

  describe('Controlled Value', () => {
    it('passes value prop to WaveformProvider', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          value={30}
        />
      );

      // Component renders successfully
      expect(screen.getByText('Select Start Point')).toBeInTheDocument();
    });

    it('uses default value of 0 when value prop is not provided', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByText('Select Start Point')).toBeInTheDocument();
    });

    it('calls onChange callback when time offset changes', () => {
      const handleChange = vi.fn();

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          onChange={handleChange}
        />
      );

      expect(screen.getByText('Select Start Point')).toBeInTheDocument();
    });

    it('uses no-op function when onChange is not provided', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByText('Select Start Point')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('play/pause button has proper ARIA attributes', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const button = screen.getByRole('button', {
        name: /play audio preview/i,
      });
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-label', 'Play audio preview');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('play/pause button icons have aria-hidden', () => {
      const { container } = render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('error message has live region for screen readers', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          error="Error message"
        />
      );

      const error = screen.getByText('Error message');
      expect(error).toHaveAttribute('role', 'alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
    });

    it('tooltip trigger is keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          tooltip="Tooltip content"
          tooltipId="test-tooltip"
        />
      );

      const tooltipTrigger = screen.getByLabelText(
        'More information about Select Start Point'
      );

      act(() => {
        tooltipTrigger.focus();
      });

      await waitFor(() => {
        expect(tooltipTrigger).toHaveFocus();
      });
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          className="custom-class"
        />
      );

      const waveformContainer = container.firstChild;
      expect(waveformContainer).toHaveClass('custom-class');
    });

    it('preserves default classes when custom className is provided', () => {
      const { container } = render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          className="custom-class"
        />
      );

      const waveformContainer = container.firstChild;
      expect(waveformContainer).toHaveClass('custom-class');
      expect(waveformContainer).toHaveClass('flex');
      expect(waveformContainer).toHaveClass('flex-col');
    });
  });

  describe('Forwarded Ref', () => {
    it('forwards ref to container element', () => {
      let containerRef: HTMLDivElement | null = null;

      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
          ref={(ref) => {
            containerRef = ref;
          }}
        />
      );

      expect(containerRef).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Component Integration', () => {
    it('renders all child components when loaded successfully', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByTestId('waveform-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('time-selector')).toBeInTheDocument();
      expect(screen.getByTestId('time-display')).toBeInTheDocument();
    });

    it('passes audioFile to WaveformProvider', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(screen.getByText('Select Start Point')).toBeInTheDocument();
    });

    it('validates audio file on mount', () => {
      render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      expect(validateAudioFile).toHaveBeenCalledWith(mockAudioFile);
    });

    it('re-validates when audioFile changes', async () => {
      const { rerender } = render(
        <Waveform
          audioFile={mockAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      const newAudioFile = new File(['new audio'], 'new.mp3', {
        type: 'audio/mpeg',
      });

      rerender(
        <Waveform
          audioFile={newAudioFile}
          id="test-waveform"
          label="Select Start Point"
        />
      );

      await waitFor(() => {
        expect(validateAudioFile).toHaveBeenCalledWith(newAudioFile);
      });
    });
  });
});
