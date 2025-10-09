'use client';

import * as React from 'react';

import type { WaveformOptions } from '../utils/waveform-utils';
import {
  checkWebAudioSupport,
  decodeAudioFile,
  extractChannelData,
  validateAudioFile,
} from '../utils/audio-utils';
import { calculateWaveformData } from '../utils/waveform-utils';

// Waveform data cache to avoid reprocessing the same file
interface WaveformCache {
  file: File;
  data: number[];
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
}

const getCacheKey = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`;
};

const isSameFile = (file1: File, file2: File): boolean => {
  return getCacheKey(file1) === getCacheKey(file2);
};

interface UseWaveformDataProps {
  /** The audio file to process */
  audioFile: File;
  /** Waveform generation options */
  options?: WaveformOptions;
}

interface UseWaveformDataReturn {
  /** Normalized waveform data (0-1 range) */
  waveformData: number[];
  /** Audio duration in seconds */
  duration: number;
  /** Sample rate of the audio */
  sampleRate: number;
  /** Number of channels in the audio */
  numberOfChannels: number;
  /** Whether waveform is being processed */
  isLoading: boolean;
  /** Error message if processing fails */
  error: string | null;
}

/**
 * Hook to process audio file and generate waveform data using Web Audio API
 *
 * Decodes audio files, extracts channel data, and calculates normalized waveform
 * amplitude values for visualization. Includes caching to prevent reprocessing
 * the same file, and handles race conditions when files change rapidly.
 *
 * @param props - Hook configuration
 * @param props.audioFile - The audio file to process
 * @param props.options - Waveform generation options (bar count, method, normalization)
 * @returns Waveform data, audio metadata, loading state, and errors
 *
 * @example
 * ```tsx
 * const { waveformData, duration, isLoading, error } = useWaveformData({
 *   audioFile: myFile,
 *   options: { barCount: 100, method: 'rms', normalize: true }
 * });
 * ```
 */
export const useWaveformData = ({
  audioFile,
  options,
}: UseWaveformDataProps): UseWaveformDataReturn => {
  const [waveformData, setWaveformData] = React.useState<number[]>([]);
  const [duration, setDuration] = React.useState(0);
  const [sampleRate, setSampleRate] = React.useState(0);
  const [numberOfChannels, setNumberOfChannels] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Track the current file being processed to avoid race conditions
  const processingFileRef = React.useRef<File | null>(null);

  const waveformCache = React.useRef<WaveformCache | null>(null);

  React.useEffect(() => {
    // Check cache first
    if (
      waveformCache.current &&
      isSameFile(waveformCache.current.file, audioFile)
    ) {
      setWaveformData(waveformCache.current.data);
      setDuration(waveformCache.current.duration);
      setSampleRate(waveformCache.current.sampleRate);
      setNumberOfChannels(waveformCache.current.numberOfChannels);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Reset state when file changes
    setIsLoading(true);
    setError(null);
    setWaveformData([]);
    setDuration(0);
    setSampleRate(0);
    setNumberOfChannels(0);
    // Store current file reference
    processingFileRef.current = audioFile;
    const processAudioFile = async () => {
      try {
        // Check Web Audio API support
        const supportCheck = checkWebAudioSupport();
        if (!supportCheck.supported) {
          throw new Error(supportCheck.error);
        }
        // Validate audio file
        const validation = validateAudioFile(audioFile);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        // Decode audio file
        const processedAudio = await decodeAudioFile(audioFile);
        // Check if this is still the current file (avoid race condition)
        if (processingFileRef.current !== audioFile) {
          return; // A new file started processing, abandon this one
        }
        // Extract channel data
        const channelData = extractChannelData(processedAudio.buffer);
        // Calculate waveform data
        const waveform = calculateWaveformData(channelData, options);
        // Update state only if still processing the same file
        if (processingFileRef.current === audioFile) {
          // Cache the results
          waveformCache.current = {
            file: audioFile,
            data: waveform,
            duration: processedAudio.duration,
            sampleRate: processedAudio.sampleRate,
            numberOfChannels: processedAudio.numberOfChannels,
          };

          setWaveformData(waveform);
          setDuration(processedAudio.duration);
          setSampleRate(processedAudio.sampleRate);
          setNumberOfChannels(processedAudio.numberOfChannels);
          setIsLoading(false);
        }
      } catch (err) {
        // Only update error if still processing the same file
        if (processingFileRef.current === audioFile) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to process audio file';
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };
    processAudioFile();

    // Cleanup function
    return () => {
      // Clear the processing reference
      if (processingFileRef.current === audioFile) {
        processingFileRef.current = null;
      }
    };
  }, [audioFile, options]);

  return {
    waveformData,
    duration,
    sampleRate,
    numberOfChannels,
    isLoading,
    error,
  };
};
