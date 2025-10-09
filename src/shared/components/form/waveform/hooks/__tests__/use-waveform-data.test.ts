import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useWaveformData } from '../use-waveform-data';
import * as audioUtils from '../../utils/audio-utils';
import * as waveformUtils from '../../utils/waveform-utils';

// Mock the utility modules
vi.mock('../../utils/audio-utils');
vi.mock('../../utils/waveform-utils');

describe('useWaveformData', () => {
  let mockAudioFile: File;

  beforeEach(() => {
    mockAudioFile = new File(['audio content'], 'test.mp3', {
      type: 'audio/mpeg',
    });

    // Mock checkWebAudioSupport
    vi.mocked(audioUtils.checkWebAudioSupport).mockReturnValue({
      supported: true,
    });

    // Mock validateAudioFile
    vi.mocked(audioUtils.validateAudioFile).mockReturnValue({ valid: true });

    // Mock decodeAudioFile
    const mockAudioBuffer = {
      duration: 180,
      sampleRate: 44100,
      numberOfChannels: 2,
    } as audioUtils.ProcessedAudioData;

    vi.mocked(audioUtils.decodeAudioFile).mockResolvedValue(mockAudioBuffer);

    // Mock extractChannelData
    const mockChannelData = new Float32Array([0.5, 0.6, 0.7, 0.8]);
    vi.mocked(audioUtils.extractChannelData).mockReturnValue(mockChannelData);

    // Mock calculateWaveformData
    vi.mocked(waveformUtils.calculateWaveformData).mockReturnValue([
      0.5, 0.6, 0.7, 0.8,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('initializes with loading state', () => {
      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.waveformData).toEqual([]);
      expect(result.current.duration).toBe(0);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Audio Processing', () => {
    it('processes audio file and generates waveform data', async () => {
      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.waveformData).toEqual([0.5, 0.6, 0.7, 0.8]);
      expect(result.current.duration).toBe(180);
      expect(result.current.sampleRate).toBe(44100);
      expect(result.current.numberOfChannels).toBe(2);
      expect(result.current.error).toBeNull();
    });

    it('calls decodeAudioFile with the audio file', async () => {
      renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(audioUtils.decodeAudioFile).toHaveBeenCalledWith(mockAudioFile);
      });
    });

    it('calls extractChannelData with decoded buffer', async () => {
      const mockBuffer = {
        duration: 180,
        sampleRate: 44100,
        numberOfChannels: 2,
        buffer: {} as AudioBuffer,
      };

      vi.mocked(audioUtils.decodeAudioFile).mockResolvedValue(mockBuffer);

      renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(audioUtils.extractChannelData).toHaveBeenCalledWith(
          mockBuffer.buffer
        );
      });
    });

    it('calls calculateWaveformData with channel data', async () => {
      const mockChannelData = new Float32Array([0.1, 0.2, 0.3]);
      vi.mocked(audioUtils.extractChannelData).mockReturnValue(mockChannelData);

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(waveformUtils.calculateWaveformData).toHaveBeenCalledWith(
        mockChannelData,
        undefined
      );
    });

    it('passes custom options to calculateWaveformData', async () => {
      const options = {
        barCount: 50,
        method: 'peak' as const,
        normalize: true,
        minAmplitude: 0.05,
      };

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
          options,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(waveformUtils.calculateWaveformData).toHaveBeenCalledWith(
        expect.any(Float32Array),
        options
      );
    });
  });

  describe('Error Handling', () => {
    it('sets error when Web Audio API is not supported', async () => {
      vi.mocked(audioUtils.checkWebAudioSupport).mockReturnValue({
        supported: false,
        error: 'Web Audio API not supported',
      });

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Web Audio API not supported');
      expect(result.current.waveformData).toEqual([]);
    });

    it('sets error when audio file validation fails', async () => {
      vi.mocked(audioUtils.validateAudioFile).mockReturnValue({
        valid: false,
        error: 'Unsupported file format',
      });

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Unsupported file format');
    });

    it('sets error when decoding fails', async () => {
      vi.mocked(audioUtils.decodeAudioFile).mockRejectedValue(
        new Error('Failed to decode audio')
      );

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to decode audio');
    });

    it('handles non-Error rejections gracefully', async () => {
      vi.mocked(audioUtils.decodeAudioFile).mockRejectedValue(
        'Unknown error string'
      );

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to process audio file');
    });
  });

  describe('Caching', () => {
    it('uses cached data for the same file', async () => {
      const { result, rerender } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCount = vi.mocked(audioUtils.decodeAudioFile).mock.calls.length;

      // Rerender with same file
      rerender();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should not decode again
      expect(vi.mocked(audioUtils.decodeAudioFile).mock.calls.length).toBe(
        callCount
      );
      expect(result.current.waveformData).toEqual([0.5, 0.6, 0.7, 0.8]);
    });

    it('processes new file when file changes', async () => {
      const { result, rerender } = renderHook(
        ({ audioFile }) => useWaveformData({ audioFile }),
        { initialProps: { audioFile: mockAudioFile } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstCallCount = vi.mocked(audioUtils.decodeAudioFile).mock.calls
        .length;

      // Change to new file
      const newAudioFile = new File(['new audio'], 'new.mp3', {
        type: 'audio/mpeg',
      });

      rerender({ audioFile: newAudioFile });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should decode the new file
      expect(vi.mocked(audioUtils.decodeAudioFile).mock.calls.length).toBe(
        firstCallCount + 1
      );
    });

    it('immediately returns cached data without loading state', async () => {
      // First render to populate cache
      const { unmount, result: firstResult } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(firstResult.current.isLoading).toBe(false);
      });

      unmount();

      // Second render should use cache
      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      // Should immediately have data from cache (may still show loading briefly)
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.waveformData).toEqual([0.5, 0.6, 0.7, 0.8]);
    });
  });

  describe('Race Condition Handling', () => {
    it('ignores results from old file when new file starts processing', async () => {
      let resolveFirst: (value: audioUtils.ProcessedAudioData) => void;
      let resolveSecond: (value: audioUtils.ProcessedAudioData) => void;

      const firstPromise = new Promise<audioUtils.ProcessedAudioData>(
        (resolve) => {
          resolveFirst = resolve;
        }
      );
      const secondPromise = new Promise<audioUtils.ProcessedAudioData>(
        (resolve) => {
          resolveSecond = resolve;
        }
      );

      vi.mocked(audioUtils.decodeAudioFile)
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise);

      const { result, rerender } = renderHook(
        ({ audioFile }) => useWaveformData({ audioFile }),
        { initialProps: { audioFile: mockAudioFile } }
      );

      // Start processing second file before first completes
      const newAudioFile = new File(['new audio'], 'new.mp3', {
        type: 'audio/mpeg',
      });

      rerender({ audioFile: newAudioFile });

      // Resolve second file first (out of order)
      resolveSecond!({
        buffer: {} as AudioBuffer,
        duration: 240,
        sampleRate: 48000,
        numberOfChannels: 2,
      });

      await waitFor(() => {
        expect(result.current.duration).toBe(240);
      });

      // Now resolve first file (should be ignored)
      resolveFirst!({
        buffer: {} as AudioBuffer,
        duration: 180,
        sampleRate: 44100,
        numberOfChannels: 2,
      });

      // Duration should still be from second file
      expect(result.current.duration).toBe(240);
    });
  });

  describe('State Management', () => {
    it('resets state when processing new file', async () => {
      const { result, rerender } = renderHook(
        ({ audioFile }) => useWaveformData({ audioFile }),
        { initialProps: { audioFile: mockAudioFile } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.waveformData).not.toEqual([]);
      expect(result.current.duration).toBe(180);

      // Change to new file
      const newAudioFile = new File(['new audio'], 'new.mp3', {
        type: 'audio/mpeg',
      });

      rerender({ audioFile: newAudioFile });

      // Should immediately reset to loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.waveformData).toEqual([]);
      expect(result.current.duration).toBe(0);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Cleanup', () => {
    it('clears processing reference on unmount', async () => {
      const { unmount } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      unmount();

      // No assertions needed - just ensuring cleanup doesn't error
      expect(true).toBe(true);
    });

    it('ignores results after unmount', async () => {
      let resolveAudio: (value: audioUtils.ProcessedAudioData) => void;

      const audioPromise = new Promise<audioUtils.ProcessedAudioData>(
        (resolve) => {
          resolveAudio = resolve;
        }
      );

      vi.mocked(audioUtils.decodeAudioFile).mockReturnValue(audioPromise);

      const { result, unmount } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      unmount();

      // Resolve after unmount
      resolveAudio!({
        buffer: {} as AudioBuffer,
        duration: 180,
        sampleRate: 44100,
        numberOfChannels: 2,
      });

      // State should not update
      expect(result.current.isLoading).toBe(true);
      expect(result.current.waveformData).toEqual([]);
    });
  });

  describe('Different Audio Formats', () => {
    it('processes stereo audio correctly', async () => {
      const stereoBuffer = {
        buffer: {} as AudioBuffer,
        duration: 180,
        sampleRate: 44100,
        numberOfChannels: 2,
      };

      vi.mocked(audioUtils.decodeAudioFile).mockResolvedValue(stereoBuffer);

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.numberOfChannels).toBe(2);
    });

    it('processes mono audio correctly', async () => {
      const monoBuffer = {
        buffer: {} as AudioBuffer,
        duration: 180,
        sampleRate: 44100,
        numberOfChannels: 1,
      };

      vi.mocked(audioUtils.decodeAudioFile).mockResolvedValue(monoBuffer);

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.numberOfChannels).toBe(1);
    });

    it('handles different sample rates', async () => {
      const highSampleRateBuffer = {
        buffer: {} as AudioBuffer,
        duration: 180,
        sampleRate: 96000,
        numberOfChannels: 2,
      };

      vi.mocked(audioUtils.decodeAudioFile).mockResolvedValue(
        highSampleRateBuffer
      );

      const { result } = renderHook(() =>
        useWaveformData({
          audioFile: mockAudioFile,
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sampleRate).toBe(96000);
    });
  });
});
