import { describe, it, expect } from 'vitest';

import {
  formatTime,
  parseTimeString,
  clamp,
  calculateTimePercentage,
  percentageToTime,
  formatDuration,
} from '../time-utils';

describe('time-utils', () => {
  describe('formatTime', () => {
    it('formats seconds less than 1 minute', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(15)).toBe('0:15');
      expect(formatTime(45)).toBe('0:45');
    });

    it('formats seconds to MM:SS for times under 1 hour', () => {
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(125)).toBe('2:05');
      expect(formatTime(3599)).toBe('59:59');
    });

    it('formats seconds to HH:MM:SS for times over 1 hour', () => {
      expect(formatTime(3600)).toBe('1:00:00');
      expect(formatTime(3661)).toBe('1:01:01');
      expect(formatTime(7200)).toBe('2:00:00');
      expect(formatTime(7325)).toBe('2:02:05');
    });

    it('pads single digit seconds and minutes with zero', () => {
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(3605)).toBe('1:00:05');
    });

    it('handles negative numbers gracefully', () => {
      expect(formatTime(-10)).toBe('0:00');
      expect(formatTime(-100)).toBe('0:00');
    });

    it('handles non-finite numbers', () => {
      expect(formatTime(Infinity)).toBe('0:00');
      expect(formatTime(-Infinity)).toBe('0:00');
      expect(formatTime(NaN)).toBe('0:00');
    });

    it('floors decimal seconds', () => {
      expect(formatTime(59.9)).toBe('0:59');
      expect(formatTime(90.7)).toBe('1:30');
      expect(formatTime(125.4)).toBe('2:05');
    });
  });

  describe('parseTimeString', () => {
    it('parses MM:SS format', () => {
      expect(parseTimeString('0:00')).toBe(0);
      expect(parseTimeString('1:30')).toBe(90);
      expect(parseTimeString('2:05')).toBe(125);
      expect(parseTimeString('59:59')).toBe(3599);
    });

    it('parses HH:MM:SS format', () => {
      expect(parseTimeString('1:00:00')).toBe(3600);
      expect(parseTimeString('1:01:01')).toBe(3661);
      expect(parseTimeString('2:00:00')).toBe(7200);
      expect(parseTimeString('2:02:05')).toBe(7325);
    });

    it('parses single digit parts', () => {
      expect(parseTimeString('1:5')).toBe(65);
      expect(parseTimeString('0:5')).toBe(5);
    });

    it('returns 0 for invalid format', () => {
      expect(parseTimeString('invalid')).toBe(0);
      expect(parseTimeString('1')).toBe(0);
      expect(parseTimeString('1:2:3:4')).toBe(0);
    });

    it('returns 0 for non-numeric values', () => {
      expect(parseTimeString('a:b')).toBe(0);
      expect(parseTimeString('1:abc')).toBe(0);
      expect(parseTimeString('1:2:c')).toBe(0);
    });

    it('returns 0 for empty string', () => {
      expect(parseTimeString('')).toBe(0);
    });

    it('handles leading zeros', () => {
      expect(parseTimeString('01:05')).toBe(65);
      expect(parseTimeString('00:30')).toBe(30);
    });
  });

  describe('clamp', () => {
    it('returns value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0.5, 0, 1)).toBe(0.5);
      expect(clamp(-5, -10, 0)).toBe(-5);
    });

    it('returns min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-0.5, 0, 1)).toBe(0);
      expect(clamp(-15, -10, 0)).toBe(-10);
    });

    it('returns max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(1.5, 0, 1)).toBe(1);
      expect(clamp(5, -10, 0)).toBe(0);
    });

    it('handles edge cases where value equals min or max', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
      expect(clamp(0, 0, 0)).toBe(0);
    });

    it('handles negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });
  });

  describe('calculateTimePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculateTimePercentage(0, 100)).toBe(0);
      expect(calculateTimePercentage(50, 100)).toBe(50);
      expect(calculateTimePercentage(100, 100)).toBe(100);
      expect(calculateTimePercentage(25, 100)).toBe(25);
    });

    it('handles fractional results', () => {
      expect(calculateTimePercentage(33, 100)).toBe(33);
      expect(calculateTimePercentage(50, 180)).toBeCloseTo(27.78, 1);
    });

    it('clamps result between 0 and 100', () => {
      expect(calculateTimePercentage(150, 100)).toBe(100);
      expect(calculateTimePercentage(-10, 100)).toBe(0);
    });

    it('returns 0 for zero duration', () => {
      expect(calculateTimePercentage(50, 0)).toBe(0);
    });

    it('returns 0 for negative duration', () => {
      expect(calculateTimePercentage(50, -100)).toBe(0);
    });

    it('returns 0 for non-finite duration', () => {
      expect(calculateTimePercentage(50, Infinity)).toBe(0);
      expect(calculateTimePercentage(50, -Infinity)).toBe(0);
      expect(calculateTimePercentage(50, NaN)).toBe(0);
    });

    it('handles current time larger than duration', () => {
      expect(calculateTimePercentage(200, 100)).toBe(100);
    });
  });

  describe('percentageToTime', () => {
    it('converts percentage to time correctly', () => {
      expect(percentageToTime(0, 100)).toBe(0);
      expect(percentageToTime(50, 100)).toBe(50);
      expect(percentageToTime(100, 100)).toBe(100);
      expect(percentageToTime(25, 100)).toBe(25);
    });

    it('handles different durations', () => {
      expect(percentageToTime(50, 180)).toBe(90);
      expect(percentageToTime(33.33, 180)).toBeCloseTo(60, 0);
      expect(percentageToTime(10, 3600)).toBe(360);
    });

    it('clamps percentage between 0 and 100', () => {
      expect(percentageToTime(150, 100)).toBe(100);
      expect(percentageToTime(-10, 100)).toBe(0);
    });

    it('returns 0 for zero duration', () => {
      expect(percentageToTime(50, 0)).toBe(0);
    });

    it('returns 0 for negative duration', () => {
      expect(percentageToTime(50, -100)).toBe(0);
    });

    it('returns 0 for non-finite duration', () => {
      expect(percentageToTime(50, Infinity)).toBe(0);
      expect(percentageToTime(50, -Infinity)).toBe(0);
      expect(percentageToTime(50, NaN)).toBe(0);
    });

    it('handles fractional percentages', () => {
      expect(percentageToTime(33.33, 180)).toBeCloseTo(60, 0);
      expect(percentageToTime(66.67, 180)).toBeCloseTo(120, 0);
    });
  });

  describe('formatDuration', () => {
    it('formats seconds only', () => {
      expect(formatDuration(0)).toBe('0 sec');
      expect(formatDuration(30)).toBe('30 sec');
      expect(formatDuration(59)).toBe('59 sec');
    });

    it('formats minutes and seconds', () => {
      expect(formatDuration(60)).toBe('1 min');
      expect(formatDuration(90)).toBe('1 min 30 sec');
      expect(formatDuration(125)).toBe('2 min 5 sec');
      expect(formatDuration(3599)).toBe('59 min 59 sec');
    });

    it('formats hours, minutes, and seconds', () => {
      expect(formatDuration(3600)).toBe('1 hour');
      expect(formatDuration(3660)).toBe('1 hour 1 min');
      expect(formatDuration(3661)).toBe('1 hour 1 min 1 sec');
      expect(formatDuration(7200)).toBe('2 hours');
      expect(formatDuration(7325)).toBe('2 hours 2 min 5 sec');
    });

    it('uses plural for hours', () => {
      expect(formatDuration(3600)).toBe('1 hour');
      expect(formatDuration(7200)).toBe('2 hours');
      expect(formatDuration(10800)).toBe('3 hours');
    });

    it('omits zero components except when duration is zero', () => {
      expect(formatDuration(3600)).toBe('1 hour');
      expect(formatDuration(60)).toBe('1 min');
      expect(formatDuration(3605)).toBe('1 hour 5 sec');
    });

    it('handles negative numbers', () => {
      expect(formatDuration(-10)).toBe('0 sec');
      expect(formatDuration(-100)).toBe('0 sec');
    });

    it('handles non-finite numbers', () => {
      expect(formatDuration(Infinity)).toBe('0 sec');
      expect(formatDuration(-Infinity)).toBe('0 sec');
      expect(formatDuration(NaN)).toBe('0 sec');
    });

    it('floors decimal seconds', () => {
      expect(formatDuration(59.9)).toBe('59 sec');
      expect(formatDuration(90.7)).toBe('1 min 30 sec');
      expect(formatDuration(125.4)).toBe('2 min 5 sec');
    });

    it('handles large durations', () => {
      expect(formatDuration(86400)).toBe('24 hours');
      expect(formatDuration(90000)).toBe('25 hours');
    });
  });
});
