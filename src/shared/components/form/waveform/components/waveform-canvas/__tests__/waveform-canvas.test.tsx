import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { WaveformCanvas } from '../waveform-canvas';
import { useWaveformContext } from '../../../context/waveform-context';

vi.mock('../../../context/waveform-context');

// Mock canvas context
const mockGetContext = vi.fn();
const mockCanvasContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  scale: vi.fn(),
  beginPath: vi.fn(),
  roundRect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 0,
};

// Mock getBoundingClientRect
const mockGetBoundingClientRect = vi.fn();

// Mock getComputedStyle
const mockGetComputedStyle = vi.fn();

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

describe('WaveformCanvas', () => {
  let mockUseWaveformContext: ReturnType<typeof useWaveformContext>;

  beforeEach(() => {
    mockUseWaveformContext = {
      duration: 180,
      selectedTime: 0,
      setTimeOffset: vi.fn(),
      containerWidth: 800,
      disabled: false,
      waveformData: [0.5, 0.6, 0.7, 0.8, 0.5, 0.4, 0.3, 0.6],
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

    // Setup canvas mocks
    mockGetContext.mockReturnValue(mockCanvasContext);
    HTMLCanvasElement.prototype.getContext = mockGetContext;

    // Setup getBoundingClientRect mock
    mockGetBoundingClientRect.mockReturnValue({
      width: 800,
      height: 42,
      top: 0,
      left: 0,
      bottom: 42,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    // Setup getComputedStyle mock
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === '--waveform-bar-background') return '#000000';
        if (prop === '--cdbaby-pink') return '#FF00FF';
        return '';
      },
    });
    global.getComputedStyle = mockGetComputedStyle as any;

    // Setup RAF mocks
    mockRequestAnimationFrame.mockImplementation((cb) => {
      setTimeout(cb, 0);
      return 1;
    });
    mockCancelAnimationFrame.mockImplementation(() => {});
    global.requestAnimationFrame = mockRequestAnimationFrame as any;
    global.cancelAnimationFrame = mockCancelAnimationFrame as any;

    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 2,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders canvas element', () => {
      render(<WaveformCanvas />);

      const canvas = screen.getByRole('button', {
        name: /audio waveform visualization/i,
      });
      expect(canvas).toBeInTheDocument();
    });

    it('applies custom className to container', () => {
      const { container } = render(<WaveformCanvas className="custom-class" />);

      const canvasContainer = container.querySelector('.custom-class');
      expect(canvasContainer).toBeInTheDocument();
    });

    it('sets canvas to default height', () => {
      const { container } = render(<WaveformCanvas />);

      const canvasContainer = container.firstChild as HTMLElement;
      expect(canvasContainer.style.height).toBe('42px');
    });

    it('applies custom height from options', () => {
      const { container } = render(<WaveformCanvas options={{ height: 60 }} />);

      const canvasContainer = container.firstChild as HTMLElement;
      expect(canvasContainer.style.height).toBe('60px');
    });
  });

  describe('Canvas Initialization', () => {
    it('gets 2d context from canvas', () => {
      render(<WaveformCanvas />);

      expect(mockGetContext).toHaveBeenCalledWith('2d');
    });

    it('sets canvas resolution based on device pixel ratio', async () => {
      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockCanvasContext.scale).toHaveBeenCalledWith(2, 2);
      });
    });

    it('registers container ref with context', () => {
      render(<WaveformCanvas />);

      expect(mockUseWaveformContext.setContainerRef).toHaveBeenCalled();
    });
  });

  describe('Waveform Drawing', () => {
    it('draws waveform bars when data is available', async () => {
      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockCanvasContext.roundRect).toHaveBeenCalled();
        expect(mockCanvasContext.fill).toHaveBeenCalled();
      });
    });

    it('uses custom waveform color from options', async () => {
      render(<WaveformCanvas options={{ waveformColor: '--custom-color' }} />);

      await waitFor(() => {
        expect(mockGetComputedStyle).toHaveBeenCalled();
      });
    });

    it('uses custom bar width from options', async () => {
      render(<WaveformCanvas options={{ barWidth: 8 }} />);

      await waitFor(() => {
        expect(mockCanvasContext.roundRect).toHaveBeenCalled();
      });
    });

    it('uses custom bar gap from options', async () => {
      render(<WaveformCanvas options={{ barGap: 4 }} />);

      await waitFor(() => {
        expect(mockCanvasContext.roundRect).toHaveBeenCalled();
      });
    });

    it('draws placeholder when no waveform data', async () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        waveformData: [],
      });

      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockCanvasContext.fillRect).toHaveBeenCalledWith(
          0,
          expect.any(Number),
          expect.any(Number),
          2
        );
      });
    });

    it('clears canvas before drawing', async () => {
      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockCanvasContext.clearRect).toHaveBeenCalled();
      });
    });
  });

  describe('Progress Indicator', () => {
    it('does not draw progress indicator when not playing', async () => {
      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
      });
    });

    it('draws progress indicator when playing', async () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        progress: 0.5,
      });

      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockRequestAnimationFrame).toHaveBeenCalled();
      });
    });

    it('draws progress line at correct position', async () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        progress: 0.5,
      });

      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockCanvasContext.moveTo).toHaveBeenCalledWith(
          expect.any(Number),
          0
        );
        expect(mockCanvasContext.lineTo).toHaveBeenCalledWith(
          expect.any(Number),
          expect.any(Number)
        );
        expect(mockCanvasContext.stroke).toHaveBeenCalled();
      });
    });

    it('updates progress indicator as progress changes', async () => {
      const { rerender } = render(<WaveformCanvas />);

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        progress: 0.75,
      });

      rerender(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockRequestAnimationFrame).toHaveBeenCalled();
      });
    });

    it('cancels animation frame on unmount', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        progress: 0.5,
      });

      const { unmount } = render(<WaveformCanvas />);

      unmount();

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Responsive Behavior', () => {
    it('updates canvas size on window resize', async () => {
      render(<WaveformCanvas />);

      // Trigger resize event
      mockGetBoundingClientRect.mockReturnValue({
        width: 1200,
        height: 42,
        top: 0,
        left: 0,
        bottom: 42,
        right: 1200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      global.dispatchEvent(new Event('resize'));

      await waitFor(() => {
        const canvas = screen.getByRole('button') as HTMLCanvasElement;
        expect(canvas.style.width).toBe('1200px');
      });
    });

    it('redraws waveform when canvas size changes', async () => {
      const { rerender } = render(<WaveformCanvas />);

      const initialCallCount = mockCanvasContext.roundRect.mock.calls.length;

      mockGetBoundingClientRect.mockReturnValue({
        width: 1200,
        height: 42,
        top: 0,
        left: 0,
        bottom: 42,
        right: 1200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      global.dispatchEvent(new Event('resize'));
      rerender(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockCanvasContext.roundRect.mock.calls.length).toBeGreaterThan(
          initialCallCount
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has descriptive aria-label', () => {
      render(<WaveformCanvas />);

      const canvas = screen.getByRole('button');
      expect(canvas).toHaveAttribute(
        'aria-label',
        'Audio waveform visualization. Click to seek to position.'
      );
    });

    it('is keyboard accessible when not disabled', () => {
      render(<WaveformCanvas />);

      const canvas = screen.getByRole('button');
      expect(canvas).toHaveAttribute('tabIndex', '0');
    });

    it('is not keyboard accessible when disabled', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        disabled: true,
      });

      render(<WaveformCanvas />);

      const canvas = screen.getByRole('button');
      expect(canvas).toHaveAttribute('tabIndex', '-1');
    });

    it('shows not-allowed cursor when disabled', () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        disabled: true,
      });

      render(<WaveformCanvas />);

      const canvas = screen.getByRole('button');
      expect(canvas).toHaveClass('cursor-not-allowed');
    });

    it('shows pointer cursor when enabled', () => {
      render(<WaveformCanvas />);

      const canvas = screen.getByRole('button');
      expect(canvas).toHaveClass('cursor-pointer');
    });
  });

  describe('Waveform Data Updates', () => {
    it('redraws when waveform data changes', async () => {
      const { rerender } = render(<WaveformCanvas />);

      const initialCallCount = mockCanvasContext.fill.mock.calls.length;

      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        waveformData: [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
      });

      rerender(<WaveformCanvas key="updated" />);

      await waitFor(() => {
        expect(mockCanvasContext.fill.mock.calls.length).toBeGreaterThan(
          initialCallCount
        );
      });
    });

    it('handles empty waveform data gracefully', async () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        waveformData: [],
      });

      render(<WaveformCanvas />);

      await waitFor(() => {
        // Should draw placeholder instead of waveform bars
        expect(mockCanvasContext.fillRect).toHaveBeenCalled();
        expect(mockCanvasContext.roundRect).not.toHaveBeenCalled();
      });
    });
  });

  describe('Performance Optimization', () => {
    it('uses RAF for smooth progress updates', async () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        progress: 0.3,
      });

      render(<WaveformCanvas />);

      await waitFor(() => {
        expect(mockRequestAnimationFrame).toHaveBeenCalled();
      });
    });

    it('skips redraw for negligible progress changes', async () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        progress: 0.5,
      });

      const { rerender } = render(<WaveformCanvas />);

      const initialCallCount = mockCanvasContext.clearRect.mock.calls.length;

      // Change progress by very small amount
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        isPlaying: true,
        progress: 0.5001,
      });

      rerender(<WaveformCanvas />);

      await waitFor(() => {
        // Should not redraw for negligible change
        expect(mockCanvasContext.clearRect.mock.calls.length).toBe(
          initialCallCount
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing canvas context gracefully', () => {
      mockGetContext.mockReturnValue(null);

      expect(() => render(<WaveformCanvas />)).not.toThrow();
    });

    it('handles zero container width', () => {
      mockGetBoundingClientRect.mockReturnValue({
        width: 0,
        height: 42,
        top: 0,
        left: 0,
        bottom: 42,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      expect(() => render(<WaveformCanvas />)).not.toThrow();
    });

    it('handles invalid waveform data values', async () => {
      vi.mocked(useWaveformContext).mockReturnValue({
        ...mockUseWaveformContext,
        waveformData: [NaN, Infinity, -Infinity, 1.5, -0.5],
      });

      expect(() => render(<WaveformCanvas />)).not.toThrow();

      await waitFor(() => {
        expect(mockCanvasContext.roundRect).toHaveBeenCalled();
      });
    });
  });
});
