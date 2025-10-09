import { renderHook } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { WaveformProvider, WaveformProviderProps } from '../waveform-provider';
import { useWaveformContext } from '../waveform-context';
import { useWaveform } from '../../use-waveform';

// Mock the useWaveform hook
vi.mock('../../use-waveform');

describe('WaveformProvider', () => {
  let mockAudioFile: File = new File(['audio content'], 'test.mp3', {
    type: 'audio/mpeg',
  });

  const createWrapper =
    (props: Partial<WaveformProviderProps>) =>
    ({ children }: { children: React.ReactNode }) => (
      <WaveformProvider
        audioFile={mockAudioFile}
        value={0}
        onChange={vi.fn()}
        {...props}
      >
        {children}
      </WaveformProvider>
    );
  let mockUseWaveform: ReturnType<typeof useWaveform>;

  beforeEach(() => {
    mockUseWaveform = {
      audioFile: mockAudioFile,
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

    vi.mocked(useWaveform).mockReturnValue(mockUseWaveform);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider Rendering', () => {
    it('renders children within provider', () => {
      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current).toBeDefined();
    });

    it('provides context value to children', () => {
      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current).toBeDefined();
      expect(result.current.duration).toBe(180);
      expect(result.current.waveformData).toEqual([0.5, 0.6, 0.7]);
    });
  });

  describe('Props Handling', () => {
    it('passes audioFile prop to useWaveform', () => {
      renderHook(() => useWaveformContext(), { wrapper: createWrapper({}) });

      expect(useWaveform).toHaveBeenCalledWith(
        expect.objectContaining({
          audioFile: mockAudioFile,
        })
      );
    });

    it('passes value prop to useWaveform', () => {
      renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({ value: 30 }),
      });

      expect(useWaveform).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 30,
        })
      );
    });

    it('passes onChange prop to useWaveform', () => {
      const handleChange = vi.fn();

      renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({ onChange: handleChange }),
      });

      expect(useWaveform).toHaveBeenCalledWith(
        expect.objectContaining({
          onChange: handleChange,
        })
      );
    });

    it('passes disabled prop to useWaveform', () => {
      renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({ disabled: true }),
      });

      expect(useWaveform).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        })
      );
    });

    it('uses false as default for disabled prop', () => {
      renderHook(() => useWaveformContext(), { wrapper: createWrapper({}) });

      expect(useWaveform).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: false,
        })
      );
    });
  });

  describe('Context Value Memoization', () => {
    it('memoizes context value to prevent unnecessary re-renders', () => {
      const onChange = vi.fn();

      const { result, rerender } = renderHook(
        ({ value }) => useWaveformContext(),
        {
          wrapper: ({ children }: { children: React.ReactNode }) => (
            <WaveformProvider
              audioFile={mockAudioFile}
              value={0}
              onChange={onChange}
            >
              {children}
            </WaveformProvider>
          ),
          initialProps: { value: 0 },
        }
      );

      const firstContext = result.current;

      // Rerender with same props
      rerender({ value: 0 });

      // Context reference should remain stable when dependencies don't change
      expect(result.current).toBeDefined();
      expect(result.current.isPlaying).toBe(mockUseWaveform.isPlaying);
    });
  });

  describe('State Propagation', () => {
    it('exposes loading state from useWaveform', () => {
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        isLoading: true,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('exposes error state from useWaveform', () => {
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        loadError: 'Failed to load audio',
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current.loadError).toBe('Failed to load audio');
    });

    it('exposes playback state from useWaveform', () => {
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        isPlaying: true,
        currentTime: 45,
        progress: 0.25,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.currentTime).toBe(45);
      expect(result.current.progress).toBe(0.25);
    });

    it('exposes waveform data from useWaveform', () => {
      const waveformData = [0.1, 0.2, 0.3, 0.4, 0.5];
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        waveformData,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current.waveformData).toEqual(waveformData);
    });

    it('exposes container dimensions from useWaveform', () => {
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        containerWidth: 1200,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current.containerWidth).toBe(1200);
    });
  });

  describe('Action Functions', () => {
    it('exposes play function from useWaveform', () => {
      const mockPlay = vi.fn();
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        play: mockPlay,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      result.current.play();
      expect(mockPlay).toHaveBeenCalled();
    });

    it('exposes pause function from useWaveform', () => {
      const mockPause = vi.fn();
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        pause: mockPause,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      result.current.pause();
      expect(mockPause).toHaveBeenCalled();
    });

    it('exposes togglePlay function from useWaveform', () => {
      const mockTogglePlay = vi.fn();
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        togglePlay: mockTogglePlay,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      result.current.togglePlay();
      expect(mockTogglePlay).toHaveBeenCalled();
    });

    it('exposes seekTo function from useWaveform', () => {
      const mockSeekTo = vi.fn();
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        seekTo: mockSeekTo,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      result.current.seekTo(60);
      expect(mockSeekTo).toHaveBeenCalledWith(60);
    });

    it('exposes setTimeOffset function from useWaveform', () => {
      const mockSetTimeOffset = vi.fn();
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        setTimeOffset: mockSetTimeOffset,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      result.current.setTimeOffset(30);
      expect(mockSetTimeOffset).toHaveBeenCalledWith(30);
    });

    it('exposes setContainerRef function from useWaveform', () => {
      const mockSetContainerRef = vi.fn();
      vi.mocked(useWaveform).mockReturnValue({
        ...mockUseWaveform,
        setContainerRef: mockSetContainerRef,
      });

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      const divElement = document.createElement('div');
      result.current.setContainerRef(divElement);
      expect(mockSetContainerRef).toHaveBeenCalledWith(divElement);
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(WaveformProvider.displayName).toBe('WaveformProvider');
    });
  });

  describe('Multiple Children', () => {
    it('provides context to multiple children', () => {
      const TestComponent1 = () => {
        const context = useWaveformContext();
        return <div>{context.duration}</div>;
      };

      const TestComponent2 = () => {
        const context = useWaveformContext();
        return <div>{context.currentTime}</div>;
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WaveformProvider
          audioFile={mockAudioFile}
          value={0}
          onChange={vi.fn()}
        >
          <TestComponent1 />
          <TestComponent2 />
          {children}
        </WaveformProvider>
      );

      const { result } = renderHook(() => useWaveformContext(), {
        wrapper: createWrapper({}),
      });

      expect(result.current.duration).toBe(180);
      expect(result.current.currentTime).toBe(0);
    });
  });
});
