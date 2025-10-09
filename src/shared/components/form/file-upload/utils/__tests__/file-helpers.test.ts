import { describe, it, expect } from 'vitest';

import {
  createAcceptString,
  removeDuplicateFiles,
} from '../file-helpers';


describe('createAcceptString', () => {
  it('creates accept string from single file type', () => {
    const result = createAcceptString(['.jpg']);
    expect(result).toBe('.jpg');
  });

  it('creates accept string from multiple file types', () => {
    const result = createAcceptString(['.jpg', '.png', '.gif']);
    expect(result).toBe('.jpg,.png,.gif');
  });

  it('creates accept string with MIME types', () => {
    const result = createAcceptString(['image/*', 'application/pdf']);
    expect(result).toBe('image/*,application/pdf');
  });

  it('handles empty array', () => {
    const result = createAcceptString([]);
    expect(result).toBe('');
  });
});

describe('removeDuplicateFiles', () => {

  it('removes duplicate files based on name and size', () => {
    // Mock File constructor to control size
    const originalFile = File;
    global.File = class extends originalFile {
      constructor(
        fileBits: BlobPart[],
        fileName: string,
        options?: FilePropertyBag
      ) {
        super(fileBits, fileName, options);
        // Override size property
        Object.defineProperty(this, 'size', {
          value: fileName.includes('large') ? 2000 : 1000,
          writable: false,
        });
      }
    } as any;

    const files = [
      new File([''], 'file1.txt'),
      new File([''], 'file2.txt'),
      new File([''], 'file1.txt'), // Duplicate name and size
      new File([''], 'file3-large.txt'),
    ];

    const result = removeDuplicateFiles(files);

    expect(result).toHaveLength(3);
    expect(result[0]?.name).toBe('file1.txt');
    expect(result[1]?.name).toBe('file2.txt');
    expect(result[2]?.name).toBe('file3-large.txt');

    // Restore original File constructor
    global.File = originalFile;
  });

  it('keeps files with same name but different size', () => {
    const originalFile = File;
    global.File = class extends originalFile {
      constructor(
        fileBits: BlobPart[],
        fileName: string,
        options?: FilePropertyBag
      ) {
        super(fileBits, fileName, options);
        Object.defineProperty(this, 'size', {
          value: fileName.includes('v2') ? 2000 : 1000,
          writable: false,
        });
      }
    } as any;

    const files = [
      new File([''], 'document.txt'),
      new File([''], 'document-v2.txt'), // Same name but different size
    ];

    const result = removeDuplicateFiles(files);

    expect(result).toHaveLength(2);

    global.File = originalFile;
  });

  it('returns empty array when given empty array', () => {
    const result = removeDuplicateFiles([]);
    expect(result).toEqual([]);
  });

  it('returns same array when no duplicates exist', () => {
    const originalFile = File;
    global.File = class extends originalFile {
      constructor(
        fileBits: BlobPart[],
        fileName: string,
        options?: FilePropertyBag
      ) {
        super(fileBits, fileName, options);
        Object.defineProperty(this, 'size', {
          value: 1000,
          writable: false,
        });
      }
    } as any;

    const files = [
      new File([''], 'file1.txt'),
      new File([''], 'file2.txt'),
      new File([''], 'file3.txt'),
    ];

    const result = removeDuplicateFiles(files);

    expect(result).toHaveLength(3);
    expect(result).toEqual(files);

    global.File = originalFile;
  });
});
