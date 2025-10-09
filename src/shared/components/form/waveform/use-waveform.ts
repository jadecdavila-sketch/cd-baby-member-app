'use client';

import * as React from 'react';

import { useAudioPlayer } from './hooks/use-audio-player';
import { useWaveformData } from './hooks/use-waveform-data';
import { SELECTOR_DURATION } from './constants';

interface UseWaveformProps {
  /** The audio file to visualize */
  audioFile: File;
  /** Current time offset in seconds (controlled value) */
  value: number;
  /** Callback when time offset changes */
  onChange: (value: number) => void;
  /** Whether the component is disabled */
  disabled: boolean;
}

/**
 * Custom hook for managing waveform component state and logic
 *
 * Coordinates audio playback, waveform visualization, and time selection.
 * Combines Web Audio API processing with HTML5 Audio playback, managing
 * container dimensions and synchronizing all component state.
 *
 * @param props - Hook configuration
 * @param props.audioFile - The audio file to process and visualize
 * @param props.value - Current time offset in seconds (controlled)
 * @param props.onChange - Callback when time offset changes
 * @param props.disabled - Whether the component is disabled
 * @returns Waveform state and control functions
 *
 * @example
 * ```tsx
 * const waveformState = useWaveform({
 *   audioFile: myAudioFile,
 *   value: 0,
 *   onChange: (time) => setStartTime(time),
 *   disabled: false
 * });
 * ```
 */
export const useWaveform = ({
  audioFile,
  value,
  onChange,
  disabled,
}: UseWaveformProps) => {
  // Container dimensions
  const [containerWidth, setContainerWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const options = React.useRef({
    barCount: 100,
    method: 'rms' as const,
    normalize: true,
    minAmplitude: 0.02,
  });

  // Process audio file and generate waveform data using Web Audio API
  const {
    waveformData,
    duration: waveformDuration,
    isLoading: waveformLoading,
    error: waveformError,
  } = useWaveformData({
    audioFile,
    options: options.current,
  });

  // HTML5 Audio player for playback control
  const {
    isPlaying,
    currentTime,
    duration: audioDuration,
    isLoading: audioLoading,
    error: audioError,
    play,
    pause,
    togglePlay,
    seekTo,
    audioRef,
  } = useAudioPlayer({
    audioFile,
    disabled,
    externalTimeOffset: value,
    loopDuration: SELECTOR_DURATION,
  });

  // Use waveform duration as primary (more accurate from Web Audio API)
  // Fall back to audio duration if waveform hasn't loaded yet
  const duration = waveformDuration > 0 ? waveformDuration : audioDuration;
  const isLoading = waveformLoading || audioLoading;
  const loadError = waveformError ?? audioError;

  // Measure canvas container width using ResizeObserver
  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setContainerWidth(width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate progress for visualization
  const progress = duration > 0 ? currentTime / duration : 0;

  const setTimeOffset = React.useCallback(
    (time: number) => {
      onChange(time);
    },
    [onChange]
  );

  const setContainerRefCallback = React.useCallback(
    (ref: HTMLDivElement | null) => {
      containerRef.current = ref;
    },
    []
  );

  return {
    // Audio state
    audioFile,
    duration,
    isLoading,
    loadError,

    // Playback state
    isPlaying,
    currentTime,
    progress,

    // Waveform data
    waveformData,

    // Container dimensions
    containerWidth,

    // Selector state
    selectedTime: value,
    disabled,

    // Actions
    play,
    pause,
    togglePlay,
    seekTo,
    setTimeOffset,
    setContainerRef: setContainerRefCallback,

    // Audio element ref for potential external use
    audioRef,
  };
};
