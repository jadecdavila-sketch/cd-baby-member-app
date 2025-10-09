import { describe, it, expect } from 'vitest';

import {
  calculateWaveformData,
  generatePlaceholderWaveform,
  smoothWaveform,
} from '../waveform-utils';

describe('waveform-utils', () => {
  describe('calculateWaveformData', () => {
    it('calculates waveform data with default options', () => {
      const channelData = new Float32Array([
        0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8,
      ]);

      const result = calculateWaveformData(channelData);

      expect(result).toHaveLength(100);
      expect(result.every((value) => value >= 0 && value <= 1)).toBe(true);
    });

    it('calculates waveform with custom bar count', () => {
      const channelData = new Float32Array(Array(1000).fill(0.5));

      const result = calculateWaveformData(channelData, { barCount: 50 });

      expect(result).toHaveLength(50);
    });

    it('calculates waveform using RMS method', () => {
      const channelData = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

      const result = calculateWaveformData(channelData, {
        barCount: 2,
        method: 'rms',
        normalize: true,
      });

      expect(result).toHaveLength(2);
      // First bar should have higher RMS than second
      expect(result[0]).toBeGreaterThan(result[1]!);
    });

    it('calculates waveform using peak method', () => {
      const channelData = new Float32Array([0.5, 1.0, 0.5, 0.2, 0.8, 0.3]);

      const result = calculateWaveformData(channelData, {
        barCount: 2,
        method: 'peak',
        normalize: true,
      });

      expect(result).toHaveLength(2);
      // First bar contains peak of 1.0
      expect(result[0]).toBe(1);
    });

    it('normalizes waveform data to 0-1 range', () => {
      const channelData = new Float32Array([2, 4, 6, 8]);

      const result = calculateWaveformData(channelData, {
        barCount: 4,
        normalize: true,
      });

      expect(result.every((value) => value >= 0 && value <= 1)).toBe(true);
      expect(Math.max(...result)).toBe(1);
    });

    it('applies minimum amplitude threshold', () => {
      const channelData = new Float32Array(Array(100).fill(0));

      const result = calculateWaveformData(channelData, {
        barCount: 10,
        normalize: true,
        minAmplitude: 0.05,
      });

      expect(result.every((value) => value >= 0.05)).toBe(true);
    });

    it('handles empty channel data', () => {
      const channelData = new Float32Array([]);

      const result = calculateWaveformData(channelData, {
        barCount: 10,
        minAmplitude: 0.02,
      });

      expect(result).toHaveLength(10);
      expect(result.every((value) => value === 0.02)).toBe(true);
    });

    it('handles silent audio (all zeros)', () => {
      const channelData = new Float32Array(Array(100).fill(0));

      const result = calculateWaveformData(channelData, {
        barCount: 10,
        normalize: true,
        minAmplitude: 0.02,
      });

      expect(result.every((value) => value === 0.02)).toBe(true);
    });

    it('handles very loud audio (values > 1)', () => {
      const channelData = new Float32Array([2, 3, 4, 5]);

      const result = calculateWaveformData(channelData, {
        barCount: 4,
        normalize: true,
      });

      expect(result.every((value) => value >= 0 && value <= 1)).toBe(true);
    });

    it('works without normalization', () => {
      const channelData = new Float32Array([0.5, 0.5, 0.5, 0.5]);

      const result = calculateWaveformData(channelData, {
        barCount: 2,
        normalize: false,
      });

      expect(result.every((value) => value >= 0.5)).toBe(true);
    });

    it('handles channel data shorter than bar count', () => {
      const channelData = new Float32Array([0.5, 0.6, 0.7]);

      const result = calculateWaveformData(channelData, { barCount: 10 });

      expect(result).toHaveLength(10);
    });

    it('distributes samples evenly across bars', () => {
      const channelData = new Float32Array(Array(100).fill(0.5));

      const result = calculateWaveformData(channelData, { barCount: 10 });

      // All bars should have similar values for uniform input
      const variance =
        result.reduce((sum, val) => sum + Math.abs(val - result[0]!), 0) /
        result.length;
      expect(variance).toBeLessThan(0.1);
    });

    it('preserves relative amplitudes when normalized', () => {
      const channelData = new Float32Array([
        0.1, 0.1, 0.5, 0.5, 1.0, 1.0, 0.2, 0.2,
      ]);

      const result = calculateWaveformData(channelData, {
        barCount: 4,
        method: 'peak',
        normalize: true,
      });

      expect(result[0]).toBeLessThan(result[1]!);
      expect(result[1]).toBeLessThan(result[2]!);
      expect(result[2]).toBeGreaterThan(result[3]!);
    });

    it('applies custom minimum amplitude correctly', () => {
      const channelData = new Float32Array([0.01, 0.02, 0.03, 0.04]);

      const result = calculateWaveformData(channelData, {
        barCount: 4,
        normalize: true,
        minAmplitude: 0.1,
      });

      expect(result.every((value) => value >= 0.1)).toBe(true);
    });
  });

  describe('generatePlaceholderWaveform', () => {
    it('generates placeholder waveform with default bar count', () => {
      const result = generatePlaceholderWaveform();

      expect(result).toHaveLength(100);
      expect(result.every((value) => value >= 0.2 && value <= 1)).toBe(true);
    });

    it('generates placeholder waveform with custom bar count', () => {
      const result = generatePlaceholderWaveform(50);

      expect(result).toHaveLength(50);
    });

    it('generates random values in expected range', () => {
      const result = generatePlaceholderWaveform(10);

      expect(result.every((value) => value >= 0.2 && value <= 1)).toBe(true);
    });

    it('generates different values on each call', () => {
      const result1 = generatePlaceholderWaveform(10);
      const result2 = generatePlaceholderWaveform(10);

      // Results should be different (statistically very unlikely to be identical)
      expect(result1).not.toEqual(result2);
    });

    it('handles edge case of zero bars', () => {
      const result = generatePlaceholderWaveform(0);

      expect(result).toHaveLength(0);
    });

    it('handles large bar counts', () => {
      const result = generatePlaceholderWaveform(1000);

      expect(result).toHaveLength(1000);
      expect(result.every((value) => value >= 0.2 && value <= 1)).toBe(true);
    });
  });

  describe('smoothWaveform', () => {
    it('smooths waveform data with default window size', () => {
      const data = [1, 0, 1, 0, 1, 0, 1];

      const result = smoothWaveform(data);

      expect(result).toHaveLength(data.length);
      // Values should be averaged with neighbors
      expect(result[1]).toBeGreaterThan(0);
      expect(result[1]).toBeLessThan(1);
    });

    it('smooths waveform with custom window size', () => {
      const data = [0, 0, 10, 0, 0];

      const result = smoothWaveform(data, 5);

      // Middle value should be averaged with all neighbors
      expect(result[2]).toBe(2); // (0 + 0 + 10 + 0 + 0) / 5
    });

    it('handles window size of 1 (no smoothing)', () => {
      const data = [1, 2, 3, 4, 5];

      const result = smoothWaveform(data, 1);

      expect(result).toEqual(data);
    });

    it('handles edge values correctly', () => {
      const data = [10, 5, 5, 5, 10];

      const result = smoothWaveform(data, 3);

      // First value should be averaged with itself and next value
      expect(result[0]).toBeCloseTo((10 + 5) / 2, 1);
      // Last value should be averaged with itself and previous value
      expect(result[4]).toBeCloseTo((5 + 10) / 2, 1);
    });

    it('handles empty array', () => {
      const data: number[] = [];

      const result = smoothWaveform(data, 3);

      expect(result).toEqual([]);
    });

    it('handles single element array', () => {
      const data = [5];

      const result = smoothWaveform(data, 3);

      expect(result).toEqual([5]);
    });

    it('smooths spiky data', () => {
      const data = [1, 1, 10, 1, 1];

      const result = smoothWaveform(data, 3);

      // Middle spike should be reduced
      expect(result[2]).toBeLessThan(10);
      expect(result[2]).toBeGreaterThan(1);
    });

    it('preserves overall data shape', () => {
      const data = [0, 1, 2, 3, 4, 5];

      const result = smoothWaveform(data, 3);

      // Should still be increasing
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]!);
      }
    });

    it('handles window size larger than data length', () => {
      const data = [1, 2, 3];

      const result = smoothWaveform(data, 10);

      // All values should converge toward the average
      const average = (1 + 2 + 3) / 3;
      result.forEach((value) => {
        expect(value).toBeCloseTo(average, 1);
      });
    });

    it('handles fractional values', () => {
      const data = [0.5, 0.6, 0.7, 0.8, 0.9];

      const result = smoothWaveform(data, 3);

      expect(result).toHaveLength(data.length);
      expect(result.every((value) => value >= 0.5 && value <= 0.9)).toBe(true);
    });
  });
});
