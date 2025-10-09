'use client';

import * as React from 'react';

import { cn, debounce } from '@/shared/utils/index';

import { useWaveformContext } from '../../context/waveform-context';
import type { WaveformCanvasOptions } from '../../types';

interface WaveformCanvasProps {
  /** Canvas options */
  options?: Partial<WaveformCanvasOptions>;
  /** Additional CSS classes */
  className?: string;
}

const DEFAULT_OPTIONS: WaveformCanvasOptions = {
  height: 42,
  waveformColor: '--waveform-bar-background',
  barWidth: 6,
  barGap: 3,
};

export const WaveformCanvas = React.memo<WaveformCanvasProps>(
  ({ options, className }) => {
    const id = React.useId();
    const { waveformData, progress, disabled, setContainerRef, isPlaying } =
      useWaveformContext();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const canvasOptions = React.useMemo(
      () => ({
        ...DEFAULT_OPTIONS,
        ...options,
      }),
      [options]
    );

    const [canvasSize, setCanvasSize] = React.useState({
      width: 0,
      height: canvasOptions.height,
    });

    // Set container ref for provider to measure
    React.useEffect(() => {
      if (containerRef.current) {
        setContainerRef(containerRef.current);
      }
    }, [setContainerRef]);

    // Handle responsive canvas sizing with debouncing to prevent excessive recalculations
    React.useEffect(() => {
      const updateCanvasSize = () => {
        if (containerRef.current) {
          const { width: currentWidth } =
            containerRef.current.getBoundingClientRect();
          setCanvasSize({
            width: currentWidth,
            height: DEFAULT_OPTIONS.height,
          });
        }
      };

      // Debounce resize handler to improve performance during window resizing
      const handleResize = debounce(updateCanvasSize, 100);

      updateCanvasSize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Draw waveform on canvas with RAF throttling for progress updates
    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { barGap, barWidth, waveformColor } = canvasOptions;
      const { width, height } = canvasSize;

      // Set canvas resolution for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // If no data, show placeholder
      if (waveformData.length === 0) {
        ctx.fillStyle = 'var(--muted)';
        ctx.fillRect(0, height / 2 - 1, width, 2);
        return;
      }

      // Calculate bar width
      const barCount = Math.floor(width / (barWidth + barGap));

      // Get computed style for waveform color
      const fillStyle =
        getComputedStyle(canvas).getPropertyValue(waveformColor);

      // Draw waveform bars
      for (let i = 0; i < barCount; i++) {
        // Sample data for this bar
        const dataIndex = Math.floor(
          (i / barCount) * (waveformData.length - 1)
        );
        const amplitude = waveformData[dataIndex] ?? 0;

        // Calculate bar height (minimum 2px for visibility)
        const barHeight = Math.max(2, amplitude * height);

        // Calculate bar position
        const x = i * (barWidth + barGap);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = fillStyle;

        // Draw rounded bar
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        ctx.fill();
      }

      // Store waveform state for progress redraws
      const waveformState = {
        width,
        height,
        barCount,
        barGap,
        barWidth,
        fillStyle,
      };

      /**
       * RAF-based progress indicator rendering for smooth animation
       *
       * Performance optimization: Uses requestAnimationFrame to sync redraws with browser
       * paint cycles, ensuring smooth 60fps animation without unnecessary renders.
       *
       * The progress indicator only redraws when:
       * 1. Audio is playing (isPlaying === true)
       * 2. Progress value changes by more than 0.001 (0.1% threshold)
       *
       * This prevents excessive canvas redraws during playback while maintaining
       * smooth visual feedback.
       */
      let rafId: number | null = null;
      let lastProgress = -1;

      const drawProgressIndicator = () => {
        if (!isPlaying || progress <= 0 || progress > 1) {
          rafId = null;
          return;
        }

        // Only redraw if progress changed significantly (0.1% threshold prevents excessive renders)
        if (Math.abs(progress - lastProgress) < 0.001) {
          rafId = requestAnimationFrame(drawProgressIndicator);
          return;
        }

        lastProgress = progress;

        // Redraw waveform bars
        ctx.clearRect(0, 0, waveformState.width, waveformState.height);

        for (let i = 0; i < waveformState.barCount; i++) {
          const dataIndex = Math.floor(
            (i / waveformState.barCount) * (waveformData.length - 1)
          );
          const amplitude = waveformData[dataIndex] ?? 0;
          const barHeight = Math.max(2, amplitude * waveformState.height);
          const x = i * (waveformState.barWidth + waveformState.barGap);
          const y = (waveformState.height - barHeight) / 2;

          ctx.fillStyle = waveformState.fillStyle;
          ctx.beginPath();
          ctx.roundRect(
            x,
            y,
            waveformState.barWidth,
            barHeight,
            waveformState.barWidth / 2
          );
          ctx.fill();
        }

        // Draw progress line
        const progressX = progress * waveformState.width;
        const progressColor =
          getComputedStyle(canvas).getPropertyValue('--cdbaby-pink');

        ctx.strokeStyle = progressColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(progressX, 0);
        ctx.lineTo(progressX, waveformState.height);
        ctx.stroke();

        rafId = requestAnimationFrame(drawProgressIndicator);
      };

      if (isPlaying) {
        rafId = requestAnimationFrame(drawProgressIndicator);
      }

      return () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }, [waveformData, progress, canvasOptions, canvasSize, isPlaying]);

    return (
      <div
        ref={containerRef}
        className={cn('relative w-full', className)}
        style={{ height: `${canvasOptions.height}px` }}
      >
        <canvas
          id={id}
          ref={canvasRef}
          className={cn(
            'absolute h-full w-full',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
          aria-label="Audio waveform visualization. Click to seek to position."
          role="button"
          tabIndex={disabled ? -1 : 0}
        />
      </div>
    );
  }
);

WaveformCanvas.displayName = 'WaveformCanvas';
