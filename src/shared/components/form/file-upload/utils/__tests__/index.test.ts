import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock URL global object
const mockURL = {
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn(),
};

beforeAll(() => {
  Object.defineProperty(global, 'URL', {
    value: mockURL,
    writable: true,
  });
  mockURL.createObjectURL.mockReturnValue('blob:test-url');
});

import {
  formatFileSize,
  getFileTypeInfo,
  isImageFile,
  createImagePreviewUrl,
  cleanupPreviewUrl,
  createAcceptString,
  removeDuplicateFiles,
} from '../index';

describe('utils index exports', () => {
  it('exports formatFileSize from file-size', () => {
    expect(typeof formatFileSize).toBe('function');
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('exports getFileTypeInfo from file-type', () => {
    expect(typeof getFileTypeInfo).toBe('function');
    const file = new File([''], 'test.pdf');
    const result = getFileTypeInfo(file);
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('icon');
    expect(result).toHaveProperty('color');
  });


  it('exports preview functions from file-preview', () => {
    expect(typeof isImageFile).toBe('function');
    expect(typeof createImagePreviewUrl).toBe('function');
    expect(typeof cleanupPreviewUrl).toBe('function');

    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    expect(isImageFile(imageFile)).toBe(true);

    const textFile = new File([''], 'test.txt', { type: 'text/plain' });
    expect(isImageFile(textFile)).toBe(false);
  });

  it('exports helper functions from file-helpers', () => {
    expect(typeof createAcceptString).toBe('function');
    expect(typeof removeDuplicateFiles).toBe('function');

    expect(createAcceptString(['.pdf', '.jpg'])).toBe('.pdf,.jpg');

    const files = [
      new File([''], 'file1.txt'),
      new File([''], 'file2.txt'),
    ];
    expect(removeDuplicateFiles(files)).toHaveLength(2);
  });

  it('all exported functions are properly typed', () => {
    // This test ensures TypeScript compilation works correctly
    // If exports are missing or incorrectly typed, this would fail to compile

    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const files = [file];

    // File size utilities
    const sizeString: string = formatFileSize(1024);

    // File type utilities
    const typeInfo = getFileTypeInfo(file);
    const fileType: string = typeInfo.type;
    const icon: string = typeInfo.icon;
    const color: string = typeInfo.color;


    // File preview utilities
    const isImage: boolean = isImageFile(file);
    if (isImage) {
      const previewUrl: string = createImagePreviewUrl(file);
      cleanupPreviewUrl(previewUrl);
    }

    // File helper utilities
    const acceptString: string = createAcceptString(['.pdf']);
    const uniqueFiles: File[] = removeDuplicateFiles(files);

    // Basic assertions to ensure functions return expected types
    expect(typeof sizeString).toBe('string');
    expect(typeof fileType).toBe('string');
    expect(typeof icon).toBe('string');
    expect(typeof color).toBe('string');
    expect(typeof isImage).toBe('boolean');
    expect(typeof acceptString).toBe('string');
    expect(Array.isArray(uniqueFiles)).toBe(true);
  });
});