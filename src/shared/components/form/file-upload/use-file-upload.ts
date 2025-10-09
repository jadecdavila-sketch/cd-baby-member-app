'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';

import { useFileUploadUtils } from './hooks';

export interface UseFileUploadOptions {
  multiple: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  acceptedFileTypes?: string[] | undefined;
  maxFileSize?: number | undefined;
  disabled?: boolean | undefined;
}

export const useFileUpload = ({
  acceptedFileTypes,
  maxFileSize,
  multiple,
  files,
  onChange,
  disabled,
}: UseFileUploadOptions) => {
  const { removeFileFromList, createFileDrop, createDropRejected } =
    useFileUploadUtils({
      multiple,
      onChange,
    });

  // Drag state management (local UI state only)
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [isDragReject, setIsDragReject] = React.useState(false);

  // Handle file removal
  const removeFile = React.useCallback(
    (index: number) => {
      removeFileFromList(files, index);
    },
    [files, removeFileFromList]
  );

  // Create file drop handlers
  const handleFileDrop = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const dropHandler = createFileDrop(files, onChange);
      dropHandler(acceptedFiles, rejectedFiles);
    },
    [createFileDrop, files, onChange]
  );

  const handleDropRejected = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rejectedFiles: any[]) => {
      const dropRejectedHandler = createDropRejected(onChange);
      dropRejectedHandler(rejectedFiles);
    },
    [createDropRejected, onChange]
  );

  // Enhanced drop rejected handler that includes UI state management
  const enhancedHandleDropRejected = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rejectedFiles: any[]) => {
      // Call the original handler
      handleDropRejected(rejectedFiles);

      // Update UI state
      setIsDragActive(false);
      setIsDragReject(true);
      // Reset reject state after a delay
      setTimeout(() => setIsDragReject(false), 2000);
    },
    [handleDropRejected]
  );

  // Create dropzone configuration
  const dropzoneConfig = {
    accept: (acceptedFileTypes ?? []).reduce(
      (acc, type) => {
        // Handle both MIME types and extensions
        if (type.startsWith('.')) {
          acc[type] = [];
        } else {
          acc[type] = [];
        }
        return acc;
      },
      {} as Record<string, string[]>
    ),
    maxSize: maxFileSize ?? 0,
    multiple,
    disabled: disabled ?? false,
    onDrop: handleFileDrop,
    onDropRejected: enhancedHandleDropRejected,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => {
      setIsDragActive(false);
      setIsDragReject(false);
    },
    // Prevent default browser behavior
    noClick: true,
    noKeyboard: true,
    // ...(multiple && maxFiles ? { maxFiles } : {}),
  };

  const { getRootProps, getInputProps, open } = useDropzone(dropzoneConfig);

  const handleClick = () => {
    if (!disabled) {
      open();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      open();
    }
  };

  return {
    // Actions
    removeFile,
    handleClick,
    handleKeyDown,

    // Dropzone integration
    isDragActive,
    isDragReject,
    handleFileDrop,
    handleDropRejected,
    getRootProps,
    getInputProps,
  } as const;
};
