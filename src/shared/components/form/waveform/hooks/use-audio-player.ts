'use client';

import * as React from 'react';

export interface UseAudioPlayerProps {
  /** The audio file to play */
  audioFile: File;
  /** Whether playback is disabled */
  disabled: boolean;
  /** Callback when playback time updates */
  onTimeUpdate?: (currentTime: number) => void;
  /** External time offset to sync audio position (controlled value) */
  externalTimeOffset?: number;
  /** Duration to loop within (in seconds) */
  loopDuration?: number;
}

/**
 * Custom hook for managing HTML5 Audio playback with loop control
 *
 * Provides complete audio playback functionality including:
 * - File loading and cleanup
 * - Play/pause controls
 * - Time synchronization with external offset
 * - Automatic looping within specified duration window
 * - Error handling and loading states
 *
 * @param props - Hook configuration
 * @param props.audioFile - The audio file to play
 * @param props.disabled - Whether playback is disabled
 * @param props.onTimeUpdate - Optional callback when playback time updates
 * @param props.externalTimeOffset - External time offset to sync audio position (controlled)
 * @param props.loopDuration - Duration to loop within (in seconds, e.g., 30 for 30-second loop)
 * @returns Audio player state and control functions
 *
 * @example
 * ```tsx
 * const { isPlaying, togglePlay, seekTo, duration } = useAudioPlayer({
 *   audioFile: myFile,
 *   disabled: false,
 *   externalTimeOffset: startTime,
 *   loopDuration: 30
 * });
 * ```
 */
export const useAudioPlayer = ({
  audioFile,
  disabled,
  onTimeUpdate,
  externalTimeOffset,
  loopDuration,
}: UseAudioPlayerProps) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Track the current file URL to clean it up properly
  const currentUrlRef = React.useRef<string | null>(null);

  // Create audio element and load file
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset state
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // Clean up previous URL if exists
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    // Create object URL for the audio file
    const url = URL.createObjectURL(audioFile);
    currentUrlRef.current = url;
    audio.src = url;

    // Preload metadata
    audio.preload = 'metadata';
    audio.load();

    return () => {
      // Cleanup
      audio.pause();
      audio.src = '';
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
    };
  }, [audioFile]);

  // Handle audio events
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);

      // Loop audio within the specified duration window
      if (loopDuration && externalTimeOffset !== undefined && !disabled) {
        const loopEndTime = externalTimeOffset + loopDuration;

        // If playback exceeds the loop boundary, seek back to start
        if (time >= loopEndTime) {
          // Clamp loop end to not exceed total duration
          const clampedEnd = Math.min(loopEndTime, audio.duration);

          // Only loop if we've actually reached the end
          if (time >= clampedEnd) {
            audio.currentTime = externalTimeOffset;
          }
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = () => {
      setError('Failed to load audio file');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // Attach event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      // Remove event listeners
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onTimeUpdate, loopDuration, externalTimeOffset, disabled]);

  // Play function
  const play = React.useCallback(async () => {
    if (disabled || !audioRef.current || isLoading || error) return;

    try {
      await audioRef.current.play();
    } catch (err) {
      console.error('Failed to play audio:', err);
      setError('Failed to play audio');
      setIsPlaying(false);
    }
  }, [disabled, isLoading, error]);

  // Pause function
  const pause = React.useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
  }, []);

  // Toggle play/pause
  const togglePlay = React.useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  // Seek to time
  const seekTo = React.useCallback(
    (time: number) => {
      if (!audioRef.current || disabled || isLoading) return;

      // Clamp time to valid range
      const clampedTime = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    },
    [disabled, isLoading, duration]
  );

  // Sync audio position with external time offset changes
  React.useEffect(() => {
    // Skip if no external time offset provided
    if (externalTimeOffset === undefined) return;

    // Skip if audio is not ready
    if (isLoading || error || !audioRef.current || duration === 0) return;

    // Skip if disabled
    if (disabled) return;

    // Calculate difference between external offset and current time
    // const timeDifference = Math.abs(externalTimeOffset - currentTime);

    // Only seek if difference is significant (> 0.5 seconds)
    // This prevents feedback loops and unnecessary seeks
    // const SEEK_THRESHOLD = 0.5;
    // if (timeDifference > SEEK_THRESHOLD) {
    seekTo(externalTimeOffset);
    // }
  }, [
    externalTimeOffset,
    // currentTime,
    isLoading,
    error,
    disabled,
    duration,
    seekTo,
  ]);

  // useTraceUpdate({
  //   isPlaying,
  //   currentTime,
  //   duration,
  //   isLoading,
  //   error,
  //   play,
  //   pause,
  //   togglePlay,
  //   seekTo,
  //   audioRef,
  // });

  return {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    play,
    pause,
    togglePlay,
    seekTo,
    audioRef,
  } as const;
};
