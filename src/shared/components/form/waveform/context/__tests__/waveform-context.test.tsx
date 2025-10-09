import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as React from 'react';

import {
  WaveformContext,
  useWaveformContext,
  type WaveformContextValue,
} from '../waveform-context';

describe('waveform-context', () => {
  describe('useWaveformContext', () => {
    it('throws error when used outside WaveformProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useWaveformContext());
      }).toThrow('Waveform components must be used within a WaveformProvider');

      consoleSpy.mockRestore();
    });

    it('returns context value when used within WaveformProvider', () => {
      const mockContextValue: WaveformContextValue = {
        audioFile: new File(['audio'], 'test.mp3', { type: 'audio/mpeg' }),
        duration: 180,
        isLoading: false,
        loadError: null,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
        waveformData: [0.5, 0.6, 0.7],
        containerWidth: 800,
        selectedTime: 0,
        disabled: false,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        setTimeOffset: vi.fn(),
        setContainerRef: vi.fn(),
        audioRef: { current: null },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={mockContextValue}>
          {children}
        </WaveformContext.Provider>
      );

      const { result } = renderHook(() => useWaveformContext(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it('provides access to all context properties', () => {
      const mockAudioFile = new File(['audio'], 'test.mp3', {
        type: 'audio/mpeg',
      });
      const mockPlay = vi.fn();
      const mockPause = vi.fn();
      const mockTogglePlay = vi.fn();
      const mockSeekTo = vi.fn();
      const mockSetTimeOffset = vi.fn();
      const mockSetContainerRef = vi.fn();
      const mockAudioRef = { current: null };

      const mockContextValue: WaveformContextValue = {
        audioFile: mockAudioFile,
        duration: 180,
        isLoading: false,
        loadError: null,
        isPlaying: false,
        currentTime: 30,
        progress: 0.1667,
        waveformData: [0.1, 0.2, 0.3, 0.4, 0.5],
        containerWidth: 1000,
        selectedTime: 10,
        disabled: false,
        play: mockPlay,
        pause: mockPause,
        togglePlay: mockTogglePlay,
        seekTo: mockSeekTo,
        setTimeOffset: mockSetTimeOffset,
        setContainerRef: mockSetContainerRef,
        audioRef: mockAudioRef,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={mockContextValue}>
          {children}
        </WaveformContext.Provider>
      );

      const { result } = renderHook(() => useWaveformContext(), { wrapper });

      // Verify all properties are accessible
      expect(result.current.audioFile).toBe(mockAudioFile);
      expect(result.current.duration).toBe(180);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.loadError).toBeNull();
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTime).toBe(30);
      expect(result.current.progress).toBe(0.1667);
      expect(result.current.waveformData).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
      expect(result.current.containerWidth).toBe(1000);
      expect(result.current.selectedTime).toBe(10);
      expect(result.current.disabled).toBe(false);
      expect(result.current.play).toBe(mockPlay);
      expect(result.current.pause).toBe(mockPause);
      expect(result.current.togglePlay).toBe(mockTogglePlay);
      expect(result.current.seekTo).toBe(mockSeekTo);
      expect(result.current.setTimeOffset).toBe(mockSetTimeOffset);
      expect(result.current.setContainerRef).toBe(mockSetContainerRef);
      expect(result.current.audioRef).toBe(mockAudioRef);
    });

    it('allows calling action functions from context', () => {
      const mockPlay = vi.fn();
      const mockPause = vi.fn();
      const mockTogglePlay = vi.fn();
      const mockSeekTo = vi.fn();
      const mockSetTimeOffset = vi.fn();
      const mockSetContainerRef = vi.fn();

      const mockContextValue: WaveformContextValue = {
        audioFile: null,
        duration: 0,
        isLoading: false,
        loadError: null,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
        waveformData: [],
        containerWidth: 0,
        selectedTime: 0,
        disabled: false,
        play: mockPlay,
        pause: mockPause,
        togglePlay: mockTogglePlay,
        seekTo: mockSeekTo,
        setTimeOffset: mockSetTimeOffset,
        setContainerRef: mockSetContainerRef,
        audioRef: { current: null },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={mockContextValue}>
          {children}
        </WaveformContext.Provider>
      );

      const { result } = renderHook(() => useWaveformContext(), { wrapper });

      // Call all action functions
      result.current.play();
      result.current.pause();
      result.current.togglePlay();
      result.current.seekTo(30);
      result.current.setTimeOffset(60);
      result.current.setContainerRef(document.createElement('div'));

      // Verify they were called
      expect(mockPlay).toHaveBeenCalledTimes(1);
      expect(mockPause).toHaveBeenCalledTimes(1);
      expect(mockTogglePlay).toHaveBeenCalledTimes(1);
      expect(mockSeekTo).toHaveBeenCalledWith(30);
      expect(mockSetTimeOffset).toHaveBeenCalledWith(60);
      expect(mockSetContainerRef).toHaveBeenCalledWith(
        expect.any(HTMLDivElement)
      );
    });
  });

  describe('WaveformContext', () => {
    it('creates context with null default value', () => {
      expect(WaveformContext._currentValue).toBeNull();
    });

    it('allows providing different context values', () => {
      const value1: WaveformContextValue = {
        audioFile: null,
        duration: 100,
        isLoading: true,
        loadError: null,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
        waveformData: [],
        containerWidth: 0,
        selectedTime: 0,
        disabled: false,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        setTimeOffset: vi.fn(),
        setContainerRef: vi.fn(),
        audioRef: { current: null },
      };

      const value2: WaveformContextValue = {
        audioFile: null,
        duration: 200,
        isLoading: false,
        loadError: null,
        isPlaying: true,
        currentTime: 50,
        progress: 0.25,
        waveformData: [0.5],
        containerWidth: 500,
        selectedTime: 25,
        disabled: true,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        setTimeOffset: vi.fn(),
        setContainerRef: vi.fn(),
        audioRef: { current: null },
      };

      const wrapper1 = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={value1}>
          {children}
        </WaveformContext.Provider>
      );

      const wrapper2 = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={value2}>
          {children}
        </WaveformContext.Provider>
      );

      const { result: result1 } = renderHook(() => useWaveformContext(), {
        wrapper: wrapper1,
      });

      const { result: result2 } = renderHook(() => useWaveformContext(), {
        wrapper: wrapper2,
      });

      expect(result1.current.duration).toBe(100);
      expect(result2.current.duration).toBe(200);
    });
  });

  describe('Context Value Types', () => {
    it('accepts null audioFile', () => {
      const mockContextValue: WaveformContextValue = {
        audioFile: null,
        duration: 0,
        isLoading: false,
        loadError: null,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
        waveformData: [],
        containerWidth: 0,
        selectedTime: 0,
        disabled: false,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        setTimeOffset: vi.fn(),
        setContainerRef: vi.fn(),
        audioRef: { current: null },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={mockContextValue}>
          {children}
        </WaveformContext.Provider>
      );

      const { result } = renderHook(() => useWaveformContext(), { wrapper });

      expect(result.current.audioFile).toBeNull();
    });

    it('accepts error state', () => {
      const mockContextValue: WaveformContextValue = {
        audioFile: null,
        duration: 0,
        isLoading: false,
        loadError: 'Failed to load audio file',
        isPlaying: false,
        currentTime: 0,
        progress: 0,
        waveformData: [],
        containerWidth: 0,
        selectedTime: 0,
        disabled: false,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        setTimeOffset: vi.fn(),
        setContainerRef: vi.fn(),
        audioRef: { current: null },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={mockContextValue}>
          {children}
        </WaveformContext.Provider>
      );

      const { result } = renderHook(() => useWaveformContext(), { wrapper });

      expect(result.current.loadError).toBe('Failed to load audio file');
    });

    it('accepts disabled state', () => {
      const mockContextValue: WaveformContextValue = {
        audioFile: null,
        duration: 0,
        isLoading: false,
        loadError: null,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
        waveformData: [],
        containerWidth: 0,
        selectedTime: 0,
        disabled: true,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        setTimeOffset: vi.fn(),
        setContainerRef: vi.fn(),
        audioRef: { current: null },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={mockContextValue}>
          {children}
        </WaveformContext.Provider>
      );

      const { result } = renderHook(() => useWaveformContext(), { wrapper });

      expect(result.current.disabled).toBe(true);
    });

    it('accepts HTMLAudioElement in audioRef', () => {
      const audioElement = document.createElement('audio');
      const mockContextValue: WaveformContextValue = {
        audioFile: null,
        duration: 0,
        isLoading: false,
        loadError: null,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
        waveformData: [],
        containerWidth: 0,
        selectedTime: 0,
        disabled: false,
        play: vi.fn(),
        pause: vi.fn(),
        togglePlay: vi.fn(),
        seekTo: vi.fn(),
        setTimeOffset: vi.fn(),
        setContainerRef: vi.fn(),
        audioRef: { current: audioElement },
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformContext.Provider value={mockContextValue}>
          {children}
        </WaveformContext.Provider>
      );

      const { result } = renderHook(() => useWaveformContext(), { wrapper });

      expect(result.current.audioRef.current).toBe(audioElement);
    });
  });
});
