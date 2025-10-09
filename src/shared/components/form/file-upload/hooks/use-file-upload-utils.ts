'use client';

import * as React from 'react';

import { removeDuplicateFiles } from '../utils';

export interface FileUploadUtilsOptions {
  multiple: boolean;
  onChange: (files: File[]) => void;
}

export const useFileUploadUtils = ({
  multiple,
  onChange,
}: FileUploadUtilsOptions) => {
  // Add files to list with deduplication
  const addFilesToList = React.useCallback(
    (currentFiles: File[], newFiles: File[]) => {
      if (newFiles.length === 0) return currentFiles;

      let filesToAdd = [...newFiles];

      // Remove duplicates
      filesToAdd = removeDuplicateFiles(filesToAdd);

      let updatedFiles: File[];
      if (multiple) {
        // Add to existing files
        updatedFiles = [...currentFiles, ...filesToAdd];
      } else {
        // Replace existing file(s)
        updatedFiles = filesToAdd.slice(0, 1);
      }

      return updatedFiles;
    },
    [multiple]
  );

  // Remove a specific file
  const removeFileFromList = React.useCallback(
    (currentFiles: File[], index: number) => {
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      onChange(updatedFiles);
    },
    [onChange]
  );

  // Replace a file at a specific index
  const replaceFileInList = React.useCallback(
    (currentFiles: File[], index: number, newFile: File) => {
      if (index < 0 || index >= currentFiles.length) return currentFiles;

      const updatedFiles = [...currentFiles];
      updatedFiles[index] = newFile;

      onChange(updatedFiles);

      return updatedFiles;
    },
    [onChange]
  );

  // Clear all files
  const clearFileList = React.useCallback(() => {
    return [];
  }, []);

  // Create file drop handler
  const createFileDrop = React.useCallback(
    (currentFiles: File[], onChange: (files: File[]) => void) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acceptedFiles: File[], _rejectedFiles: any[]) => {
        // Handle accepted files
        if (acceptedFiles.length > 0) {
          const newFiles = addFilesToList(currentFiles, acceptedFiles);
          onChange(newFiles);
        }
      },
    [addFilesToList]
  );

  // Create drop rejected handler
  const createDropRejected = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_onChange: (files: File[]) => void) => (_rejectedFiles: any[]) => {
      // No validation handling - rejection is handled externally
    },
    []
  );

  return {
    // File management utilities
    // addFilesToList,
    removeFileFromList,
    replaceFileInList,
    clearFileList,

    // Dropzone integration helpers
    createFileDrop,
    createDropRejected,
  };
};
