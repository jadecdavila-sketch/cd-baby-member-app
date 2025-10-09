import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';

import { useAudioPlayer, UseAudioPlayerProps } from '../use-audio-player';

describe('useAudioPlayer', () => {
  let mockAudioFile: File;
  let mockAudioElement: HTMLAudioElement;

  beforeEach(() => {
    mockAudioFile = new File(['audio content'], 'test.mp3', {
      type: 'audio/mpeg',
    });

    // Mock HTMLAudioElement
    mockAudioElement = document.createElement('audio') as HTMLAudioElement;
    Object.defineProperty(mockAudioElement, 'duration', {
      value: 180,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockAudioElement, 'currentTime', {
      value: 0,
      writable: true,
      configurable: true,
    });

    // Mock audio methods
    mockAudioElement.play = vi.fn().mockResolvedValue(undefined);
    mockAudioElement.pause = vi.fn();
    mockAudioElement.load = vi.fn();

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper to render hook with audio element assigned
  const renderHookWithAudio = <T>(
    propsOrCallback: UseAudioPlayerProps | ((props: T) => UseAudioPlayerProps),
    options?: { initialProps?: T }
  ) => {
    // Wrapper to assign audio ref immediately during render
    const wrapperCallback =
      typeof propsOrCallback === 'function'
        ? (props: T) => {
            const hookResult = (
              propsOrCallback as (props: T) => UseAudioPlayerProps
            )(props);
            const result = useAudioPlayer(hookResult);
            // Assign audio element on first render if not already assigned
            if (result.audioRef.current === null) {
              (
                result.audioRef as React.MutableRefObject<HTMLAudioElement>
              ).current = mockAudioElement;
            }
            return result;
          }
        : () => {
            const result = useAudioPlayer(
              propsOrCallback as UseAudioPlayerProps
            );
            // Assign audio element on first render if not already assigned
            if (result.audioRef.current === null) {
              (
                result.audioRef as React.MutableRefObject<HTMLAudioElement>
              ).current = mockAudioElement;
            }
            return result;
          };

    return renderHook(wrapperCallback, options);
  };

  describe('Initialization', () => {
    it('initializes with default state', () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('creates object URL for audio file', () => {
      renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      expect(URL.createObjectURL).toHaveBeenCalledWith(mockAudioFile);
    });

    it('sets audio ref with HTMLAudioElement', () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      expect(result.current.audioRef).toBeDefined();
      expect(result.current.audioRef.current).toBeInstanceOf(HTMLAudioElement);
    });
  });

  describe('Loading States', () => {
    it('sets isLoading to false after metadata is loaded', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      expect(result.current.isLoading).toBe(true);

      // Trigger loadedmetadata event
      const audio = result.current.audioRef.current!;
      act(() => {
        audio.dispatchEvent(new Event('loadedmetadata'));
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('sets duration after metadata is loaded', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Trigger loadedmetadata event
      const audio = result.current.audioRef.current!;
      act(() => {
        Object.defineProperty(audio, 'duration', { value: 240 });
        audio.dispatchEvent(new Event('loadedmetadata'));
      });

      await waitFor(() => {
        expect(result.current.duration).toBe(240);
      });
    });

    it('sets isLoading to false when audio can play', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      const audio = result.current.audioRef.current!;
      act(() => {
        audio.dispatchEvent(new Event('canplay'));
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('sets error when audio fails to load', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      const audio = result.current.audioRef.current!;
      act(() => {
        audio.dispatchEvent(new Event('error'));
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load audio file');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isPlaying).toBe(false);
      });
    });

    it('sets error when play fails', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Setup audio to be ready
      act(() => {
        const audio = result.current.audioRef.current!;
        audio.dispatchEvent(new Event('loadedmetadata'));
      });

      // Mock play to reject
      const mockPlay = vi.fn().mockRejectedValue(new Error('Play failed'));
      result.current.audioRef.current!.play = mockPlay;

      await act(async () => {
        await result.current.play();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to play audio');
        expect(result.current.isPlaying).toBe(false);
      });
    });
  });

  describe('Playback Controls', () => {
    it('starts playback when play is called', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Setup audio to be ready
      act(() => {
        const audio = result.current.audioRef.current!;
        audio.dispatchEvent(new Event('loadedmetadata'));
        audio.dispatchEvent(new Event('canplay'));
      });

      await act(async () => {
        await result.current.play();
      });

      expect(result.current.audioRef.current!.play).toHaveBeenCalled();
    });

    it('does not play when disabled', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: true,
      });

      await act(async () => {
        await result.current.play();
      });

      expect(result.current.audioRef.current!.play).not.toHaveBeenCalled();
    });

    it('does not play when loading', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Keep in loading state
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await result.current.play();
      });

      expect(result.current.audioRef.current!.play).not.toHaveBeenCalled();
    });

    it('does not play when there is an error', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Trigger error
      const audio = result.current.audioRef.current!;
      act(() => {
        audio.dispatchEvent(new Event('error'));
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      await act(async () => {
        await result.current.play();
      });

      expect(result.current.audioRef.current!.play).not.toHaveBeenCalled();
    });

    it('pauses playback when pause is called', () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      act(() => {
        result.current.pause();
      });

      expect(result.current.audioRef.current!.pause).toHaveBeenCalled();
    });

    it('toggles play/pause correctly', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Setup audio to be ready
      act(() => {
        const audio = result.current.audioRef.current!;
        audio.dispatchEvent(new Event('loadedmetadata'));
        audio.dispatchEvent(new Event('canplay'));
      });

      // First toggle should play
      await act(async () => {
        await result.current.togglePlay();
      });

      expect(result.current.audioRef.current!.play).toHaveBeenCalled();

      // Set playing state
      const audio = result.current.audioRef.current!;
      act(() => {
        audio.dispatchEvent(new Event('play'));
      });

      await waitFor(() => {
        expect(result.current.isPlaying).toBe(true);
      });

      // Second toggle should pause
      await act(async () => {
        await result.current.togglePlay();
      });

      expect(result.current.audioRef.current!.pause).toHaveBeenCalled();
    });
  });

  describe('Seeking', () => {
    it('seeks to specified time', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Setup audio to be ready
      act(() => {
        const audio = result.current.audioRef.current!;
        Object.defineProperty(audio, 'duration', { value: 180 });
        audio.dispatchEvent(new Event('loadedmetadata'));
        audio.dispatchEvent(new Event('canplay'));
      });

      act(() => {
        result.current.seekTo(30);
      });

      expect(result.current.audioRef.current!.currentTime).toBe(30);
    });

    it('clamps seek time to valid range', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // Setup audio to be ready
      act(() => {
        const audio = result.current.audioRef.current!;
        Object.defineProperty(audio, 'duration', { value: 180 });
        audio.dispatchEvent(new Event('loadedmetadata'));
        audio.dispatchEvent(new Event('canplay'));
      });

      // Seek beyond duration
      act(() => {
        result.current.seekTo(200);
      });

      expect(result.current.audioRef.current!.currentTime).toBe(180);

      // Seek below zero
      act(() => {
        result.current.seekTo(-10);
      });

      expect(result.current.audioRef.current!.currentTime).toBe(0);
    });

    it('does not seek when disabled', () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: true,
      });

      const initialTime = result.current.audioRef.current!.currentTime;

      act(() => {
        result.current.seekTo(30);
      });

      expect(result.current.audioRef.current!.currentTime).toBe(initialTime);
    });

    it('does not seek when loading', () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      const initialTime = result.current.audioRef.current!.currentTime;

      act(() => {
        result.current.seekTo(30);
      });

      expect(result.current.audioRef.current!.currentTime).toBe(initialTime);
    });
  });

  describe('Time Updates', () => {
    it('updates currentTime on timeupdate event', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      const audio = result.current.audioRef.current!;
      act(() => {
        Object.defineProperty(audio, 'currentTime', {
          value: 45,
          writable: true,
        });
        audio.dispatchEvent(new Event('timeupdate'));
      });

      await waitFor(() => {
        expect(result.current.currentTime).toBe(45);
      });
    });

    it('calls onTimeUpdate callback when time updates', async () => {
      const onTimeUpdate = vi.fn();

      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
        onTimeUpdate,
      });

      const audio = result.current.audioRef.current!;
      act(() => {
        Object.defineProperty(audio, 'currentTime', {
          value: 30,
          writable: true,
        });
        audio.dispatchEvent(new Event('timeupdate'));
      });

      await waitFor(() => {
        expect(onTimeUpdate).toHaveBeenCalledWith(30);
      });
    });
  });

  describe('Looping', () => {
    it('loops within specified duration window', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
        externalTimeOffset: 60,
        loopDuration: 30,
      });

      // Setup audio
      act(() => {
        const audio = result.current.audioRef.current!;
        Object.defineProperty(audio, 'duration', { value: 180 });
        audio.dispatchEvent(new Event('loadedmetadata'));
      });

      // Simulate reaching loop end
      const audio = result.current.audioRef.current!;
      act(() => {
        Object.defineProperty(audio, 'currentTime', {
          value: 90,
          writable: true,
        });
        audio.dispatchEvent(new Event('timeupdate'));
      });

      await waitFor(() => {
        // Should loop back to start offset
        expect(result.current.audioRef.current!.currentTime).toBe(60);
      });
    });

    it('does not loop when disabled', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: true,
        externalTimeOffset: 60,
        loopDuration: 30,
      });

      act(() => {
        const audio = result.current.audioRef.current!;
        Object.defineProperty(audio, 'duration', { value: 180 });
        Object.defineProperty(audio, 'currentTime', {
          value: 90,
          writable: true,
        });
        audio.dispatchEvent(new Event('timeupdate'));
      });

      // Should not loop back
      expect(result.current.audioRef.current!.currentTime).toBe(90);
    });
  });

  describe('External Time Offset Sync', () => {
    it('syncs to external time offset when changed', async () => {
      const { result, rerender } = renderHookWithAudio(
        (props: {
          externalTimeOffset: number;
          audioFile: File;
          disabled: boolean;
        }) => ({
          audioFile: props.audioFile,
          disabled: props.disabled,
          externalTimeOffset: props.externalTimeOffset,
        }),
        {
          initialProps: {
            externalTimeOffset: 0,
            audioFile: mockAudioFile,
            disabled: false,
          },
        }
      );

      // Setup audio to be ready
      act(() => {
        const audio = result.current.audioRef.current!;
        Object.defineProperty(audio, 'duration', { value: 180 });
        audio.dispatchEvent(new Event('loadedmetadata'));
        audio.dispatchEvent(new Event('canplay'));
      });

      // Change external offset
      rerender({
        externalTimeOffset: 60,
        audioFile: mockAudioFile,
        disabled: false,
      });

      await waitFor(() => {
        expect(result.current.audioRef.current!.currentTime).toBe(60);
      });
    });

    it('does not sync when audio is loading', () => {
      const { result, rerender } = renderHookWithAudio(
        ({ externalTimeOffset }: { externalTimeOffset: number }) => ({
          audioFile: mockAudioFile,
          disabled: false,
          externalTimeOffset,
        }),
        { initialProps: { externalTimeOffset: 0 } }
      );

      const initialTime = result.current.audioRef.current!.currentTime;

      rerender({ externalTimeOffset: 60 });

      expect(result.current.audioRef.current!.currentTime).toBe(initialTime);
    });
  });

  describe('Playback State Events', () => {
    it('sets isPlaying to true on play event', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      const audio = result.current.audioRef.current!;
      act(() => {
        audio.dispatchEvent(new Event('play'));
      });

      await waitFor(() => {
        expect(result.current.isPlaying).toBe(true);
      });
    });

    it('sets isPlaying to false on pause event', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      // First set playing
      const audio = result.current.audioRef.current!;
      act(() => {
        audio.dispatchEvent(new Event('play'));
      });

      await waitFor(() => {
        expect(result.current.isPlaying).toBe(true);
      });

      // Then pause
      act(() => {
        const audio = result.current.audioRef.current!;
        audio.dispatchEvent(new Event('pause'));
      });

      await waitFor(() => {
        expect(result.current.isPlaying).toBe(false);
      });
    });

    it('resets on ended event', async () => {
      const { result } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      const audio = result.current.audioRef.current!;
      act(() => {
        Object.defineProperty(audio, 'currentTime', {
          value: 180,
          writable: true,
        });
        audio.dispatchEvent(new Event('ended'));
      });

      await waitFor(() => {
        expect(result.current.isPlaying).toBe(false);
        expect(result.current.currentTime).toBe(0);
        expect(result.current.audioRef.current!.currentTime).toBe(0);
      });
    });
  });

  describe('Cleanup', () => {
    it('revokes object URL on unmount', () => {
      const { unmount } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      unmount();

      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('pauses audio on unmount', () => {
      const { result, unmount } = renderHookWithAudio({
        audioFile: mockAudioFile,
        disabled: false,
      });

      const pauseSpy = vi.spyOn(result.current.audioRef.current!, 'pause');

      unmount();

      expect(pauseSpy).toHaveBeenCalled();
    });

    it('resets state when audio file changes', async () => {
      const { result, rerender } = renderHookWithAudio(
        ({ audioFile }: { audioFile: File }) => ({
          audioFile,
          disabled: false,
        }),
        { initialProps: { audioFile: mockAudioFile } }
      );

      // Set some state
      act(() => {
        const audio = result.current.audioRef.current!;
        audio.dispatchEvent(new Event('loadedmetadata'));
        audio.dispatchEvent(new Event('play'));
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isPlaying).toBe(true);
      });

      // Change audio file
      const newAudioFile = new File(['new audio'], 'new.mp3', {
        type: 'audio/mpeg',
      });

      rerender({ audioFile: newAudioFile });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isPlaying).toBe(false);
        expect(result.current.currentTime).toBe(0);
      });
    });
  });
});
