'use client';

import * as React from 'react';

import { useWaveform } from '../use-waveform';

import { WaveformContext, type WaveformContextValue } from './waveform-context';

export interface WaveformProviderProps {
  /** The audio file to visualize */
  audioFile: File;
  /** Current time offset in seconds (controlled value) */
  value: number;
  /** Callback when time offset changes */
  onChange: (value: number) => void;
  /** Whether the component is disabled */
  disabled?: boolean | undefined;
  /** Children to render within the provider */
  children: React.ReactNode;
}

export const WaveformProvider: React.FC<WaveformProviderProps> = ({
  audioFile,
  value,
  onChange,
  disabled = false,
  children,
}) => {
  // Use the custom hook to manage all waveform logic
  const waveformState = useWaveform({
    audioFile,
    value,
    onChange,
    disabled,
  });

  // Memoize context value to prevent unnecessary re-renders
  // Functions are already memoized in use-waveform hook with useCallback
  const contextValue: WaveformContextValue = React.useMemo(
    () => ({
      audioFile: waveformState.audioFile,
      duration: waveformState.duration,
      isLoading: waveformState.isLoading,
      loadError: waveformState.loadError,
      isPlaying: waveformState.isPlaying,
      currentTime: waveformState.currentTime,
      progress: waveformState.progress,
      waveformData: waveformState.waveformData,
      containerWidth: waveformState.containerWidth,
      selectedTime: waveformState.selectedTime,
      disabled: waveformState.disabled,
      play: waveformState.play,
      pause: waveformState.pause,
      togglePlay: waveformState.togglePlay,
      seekTo: waveformState.seekTo,
      setTimeOffset: waveformState.setTimeOffset,
      setContainerRef: waveformState.setContainerRef,
      audioRef: waveformState.audioRef,
    }),
    [
      waveformState.audioFile,
      waveformState.duration,
      waveformState.isLoading,
      waveformState.loadError,
      waveformState.isPlaying,
      waveformState.currentTime,
      waveformState.progress,
      waveformState.waveformData,
      waveformState.containerWidth,
      waveformState.selectedTime,
      waveformState.disabled,
      waveformState.play,
      waveformState.pause,
      waveformState.togglePlay,
      waveformState.seekTo,
      waveformState.setTimeOffset,
      waveformState.setContainerRef,
      waveformState.audioRef,
    ]
  );

  return (
    <WaveformContext.Provider value={contextValue}>
      {children}
    </WaveformContext.Provider>
  );
};

WaveformProvider.displayName = 'WaveformProvider';
