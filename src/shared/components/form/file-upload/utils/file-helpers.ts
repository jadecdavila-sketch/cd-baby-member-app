/**
 * Converts file list to accept attribute format for input element
 */
export const createAcceptString = (acceptedFileTypes: string[]): string => {
  return acceptedFileTypes.join(',');
};

/**
 * Removes duplicate files based on name and size
 */
export const removeDuplicateFiles = (files: File[]): File[] => {
  const seen = new Set<string>();
  return files.filter((file) => {
    const key = `${file.name}-${file.size}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
