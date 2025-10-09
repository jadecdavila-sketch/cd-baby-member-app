/**
 * Checks if a file is an image that can be previewed
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/') && !file.type.includes('svg'); // Exclude SVG for security
};

/**
 * Creates a preview URL for an image file
 */
export const createImagePreviewUrl = (file: File): string => {
  if (!isImageFile(file)) {
    throw new Error('File is not a valid image for preview');
  }
  return URL.createObjectURL(file);
};

/**
 * Cleans up a preview URL to prevent memory leaks
 */
export const cleanupPreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};
