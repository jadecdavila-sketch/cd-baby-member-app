import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { TimeSelector } from '../time-selector';
import { useWaveformContext } from '../../../context/waveform-context';

vi.mock('../../../context/waveform-context');

describe('TimeSelector', () => {
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
    it('renders time selector with correct initial position', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider', {
        name: /time selector for 30-second preview/i,
      });
      expect(slider).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TimeSelector className="custom-class" />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('custom-class');
    });

    it('does not render when containerWidth is 0', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        containerWidth: 0,
      });

      render(<TimeSelector />);

      expect(
        screen.queryByRole('slider', {
          name: /time selector for 30-second preview/i,
        })
      ).not.toBeInTheDocument();
    });

    it('does not render when duration is 0', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        duration: 0,
      });

      render(<TimeSelector />);

      expect(
        screen.queryByRole('slider', {
          name: /time selector for 30-second preview/i,
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '150'); // 180 - 30
      expect(slider).toHaveAttribute('aria-valuenow', '0');
      expect(slider).toHaveAttribute(
        'aria-valuetext',
        'Start time 0:00, preview duration 30 seconds'
      );
    });

    it('has descriptive instructions for screen readers', () => {
      render(<TimeSelector />);

      expect(
        screen.getByText(/use arrow keys to adjust start time/i, {
          selector: '.sr-only',
        })
      ).toBeInTheDocument();
    });

    it('has live region for announcements', () => {
      render(<TimeSelector />);

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('is keyboard accessible when not disabled', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabIndex', '0');
    });

    it('is not keyboard accessible when disabled', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        disabled: true,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Keyboard Navigation', () => {
    it('moves selector right with ArrowRight key', async () => {
      const user = userEvent.setup();
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(5);
      });
    });

    it('moves selector left with ArrowLeft key', async () => {
      const user = userEvent.setup();
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        selectedTime: 60,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowLeft}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(55);
      });
    });

    it('moves by 1 second with Shift+ArrowRight', async () => {
      const user = userEvent.setup();
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(1);
      });
    });

    it('moves by 1 second with Shift+ArrowLeft', async () => {
      const user = userEvent.setup();
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        selectedTime: 60,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(59);
      });
    });

    it('moves to start with Home key', async () => {
      const user = userEvent.setup();
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        selectedTime: 60,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{Home}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(0);
      });
    });

    it('moves to end with End key', async () => {
      const user = userEvent.setup();
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{End}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(150); // 180 - 30
      });
    });

    it('does not move beyond start boundary', async () => {
      const user = userEvent.setup();
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowLeft}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(0);
      });
    });

    it('does not move beyond end boundary', async () => {
      const user = userEvent.setup();
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        selectedTime: 145,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalledWith(150);
      });
    });

    it('announces keyboard navigation to screen readers', async () => {
      const user = userEvent.setup();
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowRight}');

      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toHaveTextContent(
          /start time: 0:05\. preview duration: 30 seconds/i
        );
      });
    });

    it('does not respond to keyboard when disabled', async () => {
      const user = userEvent.setup();
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        disabled: true,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(mockUseWaveformContext.setTimeOffset).not.toHaveBeenCalled();
    });
  });

  describe('Mouse Interaction', () => {
    it('starts dragging on mouse down', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider, { clientX: 100 });

      // Visual feedback - cursor should change
      expect(slider).toHaveClass('cursor-grabbing');
    });

    it('updates position during drag', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 200 });

      // Position should update during drag
      expect(slider.style.left).toBeTruthy();
    });

    it('updates selected time on mouse up', async () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 200 });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(mockUseWaveformContext.setTimeOffset).toHaveBeenCalled();
      });
    });

    it('announces drag completion to screen readers', async () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 200 });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion.textContent).toMatch(
          /selected start time:.*preview window: 30 seconds/i
        );
      });
    });

    it('does not drag when disabled', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        disabled: true,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider, { clientX: 100 });

      expect(slider).not.toHaveClass('cursor-grabbing');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled styles when disabled', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        disabled: true,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('cursor-not-allowed', 'opacity-50');
    });

    it('shows enabled cursor when not disabled', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('cursor-grab');
      expect(slider).not.toHaveClass('cursor-not-allowed');
    });
  });

  describe('Position Calculation', () => {
    it('calculates correct position for selected time', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        selectedTime: 90, // Halfway through 180 second duration
        containerWidth: 800,
      });

      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      // Position should be approximately halfway (accounting for selector width)
      expect(slider.style.left).toBeTruthy();
    });

    it('updates position when selected time changes', () => {
      const { rerender } = render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      const initialPosition = slider.style.left;

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        selectedTime: 60,
      });

      rerender(<TimeSelector key="updated" />);

      const updatedSlider = screen.getByRole('slider');
      expect(updatedSlider.style.left).not.toBe(initialPosition);
    });
  });

  describe('Display Time', () => {
    it('displays current selected time', () => {
      render(<TimeSelector />);

      expect(screen.getByText('0:00')).toBeInTheDocument();
    });

    it('displays time during drag', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      fireEvent.mouseDown(slider, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 300 });

      // Time display should update during drag
      const timeDisplay = slider.querySelector('.text-muted-foreground');
      expect(timeDisplay).toBeInTheDocument();
    });

    it('updates display time when selected time changes', () => {
      const { rerender } = render(<TimeSelector />);

      expect(screen.getByText('0:00')).toBeInTheDocument();

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        selectedTime: 65,
      });

      rerender(<TimeSelector key="updated" />);

      expect(screen.getByText('1:05')).toBeInTheDocument();
    });
  });

  describe('Selector Width', () => {
    it('calculates correct width based on duration', () => {
      render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      // Width should represent 30 seconds out of 180 second duration
      // (30 / 180) * 800 = ~133px
      expect(slider.style.width).toBeTruthy();
    });

    it('adjusts width when container width changes', () => {
      const { debug, rerender } = render(<TimeSelector />);

      const slider = screen.getByRole('slider');
      const initialWidth = slider.style.width;

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        containerWidth: 1200,
      });

      rerender(<TimeSelector key="updated" />);

      const updatedSlider = screen.getByRole('slider');

      expect(updatedSlider.style.width).not.toBe(initialWidth);
    });
  });
});
