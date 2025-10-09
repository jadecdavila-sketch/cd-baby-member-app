import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { isImageFile, createImagePreviewUrl, cleanupPreviewUrl } from '../file-preview';

// Mock URL global object
const mockURL = {
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn(),
};

Object.defineProperty(global, 'URL', {
  value: mockURL,
  writable: true,
});

describe('isImageFile', () => {
  const createMockFile = (name: string, type: string): File => {
    return new File([''], name, { type });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns true for image MIME types', () => {
    const imageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff',
    ];

    imageTypes.forEach(type => {
      const file = createMockFile('image.jpg', type);
      expect(isImageFile(file)).toBe(true);
    });
  });

  it('returns false for SVG files (security exclusion)', () => {
    const file = createMockFile('image.svg', 'image/svg+xml');
    expect(isImageFile(file)).toBe(false);
  });

  it('returns false for non-image MIME types', () => {
    const nonImageTypes = [
      'text/plain',
      'application/pdf',
      'audio/mp3',
      'video/mp4',
      'application/json',
    ];

    nonImageTypes.forEach(type => {
      const file = createMockFile('file.txt', type);
      expect(isImageFile(file)).toBe(false);
    });
  });

  it('returns false for empty MIME type', () => {
    const file = createMockFile('image.jpg', '');
    expect(isImageFile(file)).toBe(false);
  });

  it('handles mixed case in MIME types', () => {
    const file = createMockFile('image.jpg', 'IMAGE/JPEG');
    expect(isImageFile(file)).toBe(true); // File constructor normalizes MIME type to lowercase
  });

  it('excludes SVG with different case variations', () => {
    const svgVariations = [
      'image/svg+xml',
      'image/svg',
      'image/SVG+XML',
    ];

    svgVariations.forEach(type => {
      const file = createMockFile('image.svg', type);
      expect(isImageFile(file)).toBe(false);
    });
  });
});

describe('createImagePreviewUrl', () => {
  const createMockFile = (name: string, type: string): File => {
    return new File([''], name, { type });
  };

  beforeEach(() => {
    mockURL.createObjectURL.mockReturnValue('blob:mock-url-12345');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates preview URL for valid image files', () => {
    const file = createMockFile('image.jpg', 'image/jpeg');
    const result = createImagePreviewUrl(file);

    expect(result).toBe('blob:mock-url-12345');
    expect(mockURL.createObjectURL).toHaveBeenCalledWith(file);
    expect(mockURL.createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('throws error for non-image files', () => {
    const file = createMockFile('document.pdf', 'application/pdf');

    expect(() => createImagePreviewUrl(file)).toThrow('File is not a valid image for preview');
    expect(mockURL.createObjectURL).not.toHaveBeenCalled();
  });

  it('throws error for SVG files', () => {
    const file = createMockFile('image.svg', 'image/svg+xml');

    expect(() => createImagePreviewUrl(file)).toThrow('File is not a valid image for preview');
    expect(mockURL.createObjectURL).not.toHaveBeenCalled();
  });

  it('uses isImageFile validation internally', () => {
    const file = createMockFile('text.txt', 'text/plain');

    expect(() => createImagePreviewUrl(file)).toThrow('File is not a valid image for preview');
  });

  it('passes through URL.createObjectURL return value', () => {
    const expectedUrl = 'blob:different-mock-url-67890';
    mockURL.createObjectURL.mockReturnValue(expectedUrl);

    const file = createMockFile('image.png', 'image/png');
    const result = createImagePreviewUrl(file);

    expect(result).toBe(expectedUrl);
  });
});

describe('cleanupPreviewUrl', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls URL.revokeObjectURL with provided URL', () => {
    const testUrl = 'blob:mock-url-12345';
    cleanupPreviewUrl(testUrl);

    expect(mockURL.revokeObjectURL).toHaveBeenCalledWith(testUrl);
    expect(mockURL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('handles empty string URL', () => {
    cleanupPreviewUrl('');

    expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('');
    expect(mockURL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('handles various URL formats', () => {
    const urls = [
      'blob:mock-url-12345',
      'blob:http://localhost:3000/abcd-1234',
      'data:image/jpeg;base64,/9j/4AAQSkZ...',
      'invalid-url',
    ];

    urls.forEach(url => {
      cleanupPreviewUrl(url);
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith(url);
    });

    expect(mockURL.revokeObjectURL).toHaveBeenCalledTimes(urls.length);
  });
});

describe('integration between preview functions', () => {
  const createMockFile = (name: string, type: string): File => {
    return new File([''], name, { type });
  };

  beforeEach(() => {
    mockURL.createObjectURL.mockReturnValue('blob:integration-test-url');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('can create and cleanup preview URL for same file', () => {
    const file = createMockFile('photo.jpg', 'image/jpeg');

    // Create preview URL
    const previewUrl = createImagePreviewUrl(file);
    expect(previewUrl).toBe('blob:integration-test-url');
    expect(mockURL.createObjectURL).toHaveBeenCalledWith(file);

    // Cleanup the URL
    cleanupPreviewUrl(previewUrl);
    expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('blob:integration-test-url');
  });

  it('validates image file before creating URL in workflow', () => {
    const imageFile = createMockFile('image.png', 'image/png');
    const textFile = createMockFile('text.txt', 'text/plain');

    // Valid image should work
    expect(isImageFile(imageFile)).toBe(true);
    expect(() => createImagePreviewUrl(imageFile)).not.toThrow();

    // Invalid file should fail
    expect(isImageFile(textFile)).toBe(false);
    expect(() => createImagePreviewUrl(textFile)).toThrow();
  });
});