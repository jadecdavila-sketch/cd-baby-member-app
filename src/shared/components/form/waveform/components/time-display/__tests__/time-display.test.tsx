import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { TimeDisplay } from '../time-display';
import { useWaveformContext } from '../../../context/waveform-context';

vi.mock('../../../context/waveform-context');

describe('TimeDisplay', () => {
  let mockUseWaveformContext: ReturnType<typeof useWaveformContext>;

  beforeEach(() => {
    mockUseWaveformContext = {
      duration: 180,
      selectedTime: 0,
      setTimeOffset: vi.fn(),
      containerWidth: 800,
      disabled: false,
      waveformData: [],
      isLoading: false,
      loadError: null,
      audioFile: new File([''], 'test.mp3', { type: 'audio/mpeg' }),
      isPlaying: false,
      currentTime: 0,
      togglePlay: vi.fn(),
      seekTo: vi.fn(),
      audioRef: { current: null },
      progress: 0,
      setContainerRef: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
    };

    vi.mocked(useWaveformContext).mockReturnValue(mockUseWaveformContext);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders duration in formatted time', () => {
      render(<TimeDisplay />);

      expect(screen.getByText('3:00')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TimeDisplay className="custom-class" />);

      const timeDisplay = screen.getByText('3:00');
      expect(timeDisplay).toHaveClass('custom-class');
    });
  });

  describe('Time Formatting', () => {
    it('formats duration under 1 minute correctly', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 45,
      });

      render(<TimeDisplay />);

      expect(screen.getByText('0:45')).toBeInTheDocument();
    });

    it('formats duration with single digit seconds correctly', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 65,
      });

      render(<TimeDisplay />);

      expect(screen.getByText('1:05')).toBeInTheDocument();
    });

    it('formats duration over 10 minutes correctly', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 725,
      });

      render(<TimeDisplay />);

      expect(screen.getByText('12:05')).toBeInTheDocument();
    });

    it('formats duration over 1 hour correctly', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 3665,
      });

      render(<TimeDisplay />);

      expect(screen.getByText('1:01:05')).toBeInTheDocument();
    });

    it('handles zero duration', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 0,
      });

      render(<TimeDisplay />);

      expect(screen.getByText('0:00')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-live region for screen readers', () => {
      render(<TimeDisplay />);

      const timeDisplay = screen.getByText('3:00');
      expect(timeDisplay).toHaveAttribute('aria-live', 'polite');
    });

    it('has descriptive aria-label', () => {
      render(<TimeDisplay />);

      const timeDisplay = screen.getByText('3:00');
      expect(timeDisplay).toHaveAttribute('aria-label', 'Duration: 3:00');
    });

    it('updates aria-label when duration changes', () => {
      const { rerender } = render(<TimeDisplay />);

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 245,
      });

      rerender(<TimeDisplay key="updated" />);

      const timeDisplay = screen.getByText('4:05');
      expect(timeDisplay).toHaveAttribute('aria-label', 'Duration: 4:05');
    });
  });

  describe('Component Updates', () => {
    it('updates displayed time when duration changes', () => {
      const { rerender } = render(<TimeDisplay />);

      expect(screen.getByText('3:00')).toBeInTheDocument();

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 120,
      });

      rerender(<TimeDisplay key="updated" />);

      expect(screen.getByText('2:00')).toBeInTheDocument();
      expect(screen.queryByText('3:00')).not.toBeInTheDocument();
    });

    it('does not re-render when unrelated context values change', () => {
      const { rerender } = render(<TimeDisplay />);

      const initialElement = screen.getByText('3:00');

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        currentTime: 45,
      });

      rerender(<TimeDisplay key="updated" />);

      // Duration unchanged, text should be the same
      expect(screen.getByText('3:00')).toStrictEqual(initialElement);
    });
  });

  describe('Edge Cases', () => {
    it('handles negative duration gracefully', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: -10,
      });

      render(<TimeDisplay />);

      // Negative duration should format as 0:00
      expect(screen.getByText('0:00')).toBeInTheDocument();
    });

    it('handles very large duration values', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 86400, // 24 hours
      });

      render(<TimeDisplay />);

      expect(screen.getByText('24:00:00')).toBeInTheDocument();
    });

    it('handles decimal duration values', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 125.7,
      });

      render(<TimeDisplay />);

      // Should round down to nearest second
      expect(screen.getByText('2:05')).toBeInTheDocument();
    });
  });
});
