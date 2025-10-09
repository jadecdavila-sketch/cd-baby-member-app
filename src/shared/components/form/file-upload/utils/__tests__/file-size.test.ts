import { describe, it, expect } from 'vitest';

import { formatFileSize } from '../file-size';

describe('formatFileSize', () => {
  it('formats zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats bytes (less than 1 KB)', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(2048)).toBe('2 KB');
    expect(formatFileSize(1024 * 1023)).toBe('1023 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    expect(formatFileSize(1024 * 1024 * 1023)).toBe('1023 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    expect(formatFileSize(1024 * 1024 * 1024 * 1023)).toBe('1023 GB');
  });

  it('formats terabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    expect(formatFileSize(1024 * 1024 * 1024 * 1024 * 2.5)).toBe('2.5 TB');
  });

  it('rounds to one decimal place', () => {
    expect(formatFileSize(1024 + 51)).toBe('1 KB'); // 1075 bytes
    expect(formatFileSize(1024 + 512)).toBe('1.5 KB'); // 1536 bytes
    expect(formatFileSize(1024 * 1024 + 1024 * 512)).toBe('1.5 MB');
  });

  it('handles very small decimal values correctly', () => {
    expect(formatFileSize(1024 + 1)).toBe('1 KB'); // 1025 bytes should round to 1 KB
    expect(formatFileSize(1024 + 102)).toBe('1.1 KB'); // 1126 bytes should be 1.1 KB
  });

  it('handles edge cases for rounding', () => {
    expect(formatFileSize(1024 * 1024 + 1024 * 102)).toBe('1.1 MB'); // Should round to 1.1 MB
    expect(formatFileSize(1024 * 1024 * 1024 + 1024 * 1024 * 102)).toBe('1.1 GB'); // Should round to 1.1 GB
  });
});