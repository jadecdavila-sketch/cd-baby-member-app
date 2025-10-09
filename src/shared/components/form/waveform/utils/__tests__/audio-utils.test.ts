import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { getAudioContext } from '../get-audio-context';

import {
  decodeAudioFile,
  extractChannelData,
  validateAudioFile,
  checkWebAudioSupport,
} from '../audio-utils';

vi.mock('../get-audio-context');

describe('audio-utils', () => {
  describe('validateAudioFile', () => {
    it('validates a correct MP3 file', () => {
      const file = new File([new ArrayBuffer(1024)], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('validates a correct WAV file', () => {
      const file = new File([new ArrayBuffer(1024)], 'test.wav', {
        type: 'audio/wav',
      });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('validates a correct FLAC file', () => {
      const file = new File([new ArrayBuffer(1024)], 'test.flac', {
        type: 'audio/flac',
      });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('validates a file with extension but incorrect MIME type', () => {
      const file = new File([new ArrayBuffer(1024)], 'test.mp3', {
        type: 'application/octet-stream',
      });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
    });

    it('rejects file with unsupported extension', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file format');
      expect(result.error).toContain('txt');
    });

    it('rejects file with unsupported MIME type and no valid extension', () => {
      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });

    it('rejects empty file', () => {
      const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty or corrupted');
    });

    it('rejects file smaller than 1KB', () => {
      const smallContent = 'x'.repeat(500);
      const file = new File([smallContent], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty or corrupted');
    });

    it('rejects file larger than 100MB', () => {
      // Create a mock file with size > 100MB
      const largeFile = new File([''], 'large.mp3', { type: 'audio/mpeg' });
      Object.defineProperty(largeFile, 'size', {
        value: 101 * 1024 * 1024,
      });

      const result = validateAudioFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
      expect(result.error).toContain('101.0 MB');
    });

    it('warns for large files between 50MB and 100MB', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const largeFile = new File([''], 'large.mp3', { type: 'audio/mpeg' });
      Object.defineProperty(largeFile, 'size', { value: 75 * 1024 * 1024 });

      const result = validateAudioFile(largeFile);
      expect(result.valid).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Large audio file detected')
      );

      consoleWarnSpy.mockRestore();
    });

    it('handles file without name', () => {
      const file = new File([new ArrayBuffer(1024)], '', {
        type: 'audio/mpeg',
      });

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });
  });

  describe('extractChannelData', () => {
    it('returns channel data for mono audio', () => {
      const mockBuffer = {
        numberOfChannels: 1,
        length: 4,
        getChannelData: vi
          .fn()
          .mockReturnValue(new Float32Array([0.1, 0.2, 0.3, 0.4])),
      } as unknown as AudioBuffer;

      const result = extractChannelData(mockBuffer);

      expect(result).toEqual(new Float32Array([0.1, 0.2, 0.3, 0.4]));
      expect(mockBuffer.getChannelData).toHaveBeenCalledWith(0);
    });

    it('mixes stereo channels to mono', () => {
      const leftChannel = new Float32Array([0.2, 0.4, 0.6, 0.8]);
      const rightChannel = new Float32Array([0.1, 0.3, 0.5, 0.7]);

      const mockBuffer = {
        numberOfChannels: 2,
        length: 4,
        getChannelData: vi.fn((channel: number) => {
          return channel === 0 ? leftChannel : rightChannel;
        }),
      } as unknown as AudioBuffer;

      const result = extractChannelData(mockBuffer);

      expect(result.length).toBe(4);
      expect(result[0]?.toFixed(3)).toBe(((0.2 + 0.1) / 2).toFixed(3));
      expect(result[1]?.toFixed(3)).toBe(((0.4 + 0.3) / 2).toFixed(3));
      expect(result[2]?.toFixed(3)).toBe(((0.6 + 0.5) / 2).toFixed(3));
      expect(result[3]?.toFixed(3)).toBe(((0.8 + 0.7) / 2).toFixed(3));
    });

    it('handles empty audio buffer', () => {
      const mockBuffer = {
        numberOfChannels: 1,
        length: 0,
        getChannelData: vi.fn().mockReturnValue(new Float32Array(0)),
      } as unknown as AudioBuffer;

      const result = extractChannelData(mockBuffer);

      expect(result).toEqual(new Float32Array(0));
    });
  });

  describe('decodeAudioFile', () => {
    let mockAudioContext: {
      state: string;
      decodeAudioData: ReturnType<typeof vi.fn>;
      resume: ReturnType<typeof vi.fn>;
    };
    const mockAudioBuffer = {
      duration: 180,
      sampleRate: 44100,
      numberOfChannels: 2,
    } as AudioBuffer;

    beforeEach(() => {
      mockAudioContext = {
        state: 'running',
        decodeAudioData: vi.fn().mockResolvedValue(mockAudioBuffer),
        resume: vi.fn().mockResolvedValue(undefined),
      };

      // @ts-expect-error - incomplete AudioContext// Mock AudioContext constructor
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('decodes audio file successfully', async () => {
      mockAudioContext = {
        ...mockAudioContext,
        decodeAudioData: vi.fn().mockReturnValue(mockAudioBuffer),
      };

      // @ts-expect-error - incomplete AudioContext
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);

      const file = new File([new ArrayBuffer(1024)], 'test.mp3', {
        type: 'audio/mpeg',
      });

      const result = await decodeAudioFile(file);

      expect(result.buffer).toBe(mockAudioBuffer);
      expect(result.duration).toBe(180);
      expect(result.sampleRate).toBe(44100);
      expect(result.numberOfChannels).toBe(2);
    });

    it('throws error for zero-duration audio', async () => {
      const mockAudioBuffer = {
        duration: 0,
        sampleRate: 44100,
        numberOfChannels: 2,
      } as AudioBuffer;

      mockAudioContext = {
        ...mockAudioContext,
        decodeAudioData: vi.fn().mockReturnValue(mockAudioBuffer),
      };

      // @ts-expect-error - incomplete AudioContext
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);

      const file = new File([new ArrayBuffer(0)], 'test.mp3', {
        type: 'audio/mpeg',
      });

      await expect(decodeAudioFile(file)).rejects.toThrow(
        'Audio file has zero duration'
      );
    });

    it('throws error for audio with no channels', async () => {
      const mockAudioBuffer = {
        duration: 180,
        sampleRate: 44100,
        numberOfChannels: 0,
      } as AudioBuffer;

      mockAudioContext = {
        ...mockAudioContext,
        decodeAudioData: vi.fn().mockReturnValue(mockAudioBuffer),
      };

      // @ts-expect-error - incomplete AudioContext
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);

      const file = new File([new ArrayBuffer(1024)], 'test.mp3', {
        type: 'audio/mpeg',
      });

      await expect(decodeAudioFile(file)).rejects.toThrow(
        'Audio file has no audio channels'
      );
    });

    it('throws error when decoding fails', async () => {
      mockAudioContext = {
        ...mockAudioContext,
        decodeAudioData: vi
          .fn()
          .mockRejectedValue(new Error('unable to decode')),
      };

      // @ts-expect-error - incomplete AudioContext
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);

      const file = new File(['invalid audio'], 'test.mp3', {
        type: 'audio/mpeg',
      });

      await expect(decodeAudioFile(file)).rejects.toThrow(
        'Unable to decode audio file'
      );
    });

    it('throws error for unsupported codec', async () => {
      mockAudioContext = {
        ...mockAudioContext,
        decodeAudioData: vi
          .fn()
          .mockRejectedValue(new Error('NotSupportedError')),
      };

      // @ts-expect-error - incomplete AudioContext
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);

      const file = new File([new ArrayBuffer(1024)], 'test.mp3', {
        type: 'audio/mpeg',
      });

      await expect(decodeAudioFile(file)).rejects.toThrow(
        'Audio codec not supported'
      );
    });

    it('throws timeout error when decoding takes too long', async () => {
      mockAudioContext = {
        ...mockAudioContext,
        decodeAudioData: vi.fn().mockImplementation(
          () =>
            new Promise((resolve) => {
              setTimeout(resolve, 200);
            })
        ),
      };

      // @ts-expect-error - incomplete AudioContext
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);

      const file = new File([new ArrayBuffer(1024)], 'test.mp3', {
        type: 'audio/mpeg',
      });

      await expect(decodeAudioFile(file, 100)).rejects.toThrow(
        'Audio processing timed out'
      );
    });

    it('handles unknown errors gracefully', async () => {
      mockAudioContext = {
        ...mockAudioContext,
        state: 'suspended',
        decodeAudioData: vi.fn().mockRejectedValue('Unknown error'),
      };

      // @ts-expect-error - incomplete AudioContext
      vi.mocked(getAudioContext).mockReturnValue(mockAudioContext);

      const file = new File([new ArrayBuffer(1024)], 'test.mp3', {
        type: 'audio/mpeg',
      });

      await expect(decodeAudioFile(file)).rejects.toThrow(
        'Failed to process audio file due to an unknown error'
      );
    });
  });
});
