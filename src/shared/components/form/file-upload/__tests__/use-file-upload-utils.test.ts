import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useFileUploadUtils, type FileUploadUtilsOptions } from '../hooks/use-file-upload-utils';
import { removeDuplicateFiles } from '../utils';

// Mock utility functions
vi.mock('../utils');

describe('useFileUploadUtils', () => {
  const defaultOptions: FileUploadUtilsOptions = {
    multiple: false,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(removeDuplicateFiles).mockImplementation((files) => files);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('provides file management utilities', () => {
    const { result } = renderHook(() => useFileUploadUtils(defaultOptions));

    expect(result.current.removeFileFromList).toBeDefined();
    expect(result.current.replaceFileInList).toBeDefined();
    expect(result.current.clearFileList).toBeDefined();
    expect(result.current.createFileDrop).toBeDefined();
    expect(result.current.createDropRejected).toBeDefined();
  });

  it('updates utilities when options change', () => {
    const { result, rerender } = renderHook(
      ({ options }) => useFileUploadUtils(options),
      {
        initialProps: { options: defaultOptions },
      }
    );

    const newOptions: FileUploadUtilsOptions = {
      ...defaultOptions,
      multiple: true,
    };

    rerender({ options: newOptions });

    // Should still provide all utilities
    expect(result.current.removeFileFromList).toBeDefined();
    expect(result.current.createFileDrop).toBeDefined();
  });



  describe('removeFileFromList', () => {
    it('removes file at specified index', () => {
      const mockOnChange = vi.fn();
      const options: FileUploadUtilsOptions = {
        ...defaultOptions,
        onChange: mockOnChange,
      };

      const { result } = renderHook(() => useFileUploadUtils(options));

      const currentFiles = [
        new File([''], 'file1.txt'),
        new File([''], 'file2.txt'),
      ];

      act(() => {
        result.current.removeFileFromList(currentFiles, 0);
        expect(mockOnChange).toHaveBeenCalledWith([currentFiles[1]]);
      });
    });
  });

  describe('replaceFileInList', () => {
    it('replaces file at specified index', () => {
      const mockOnChange = vi.fn();
      const options: FileUploadUtilsOptions = {
        ...defaultOptions,
        onChange: mockOnChange,
      };

      const { result } = renderHook(() => useFileUploadUtils(options));

      const currentFiles = [
        new File([''], 'file1.txt'),
        new File([''], 'file2.txt'),
      ];
      const newFile = new File([''], 'replacement.txt');

      act(() => {
        const updatedFiles = result.current.replaceFileInList(currentFiles, 0, newFile);
        expect(updatedFiles[0]).toBe(newFile);
        expect(updatedFiles[1]).toBe(currentFiles[1]);
        expect(mockOnChange).toHaveBeenCalledWith(updatedFiles);
      });
    });
  });

  describe('clearFileList', () => {
    it('returns empty array', () => {
      const { result } = renderHook(() => useFileUploadUtils(defaultOptions));

      act(() => {
        const clearedFiles = result.current.clearFileList();
        expect(clearedFiles).toEqual([]);
      });
    });
  });

  describe('createFileDrop', () => {
    it('returns a drop handler function', () => {
      const { result } = renderHook(() => useFileUploadUtils(defaultOptions));

      const currentFiles: File[] = [];
      const mockOnChange = vi.fn();

      const dropHandler = result.current.createFileDrop(currentFiles, mockOnChange);

      expect(typeof dropHandler).toBe('function');
    });
  });

  describe('createDropRejected', () => {
    it('returns a drop rejected handler function', () => {
      const { result } = renderHook(() => useFileUploadUtils(defaultOptions));

      const mockOnChange = vi.fn();
      const dropRejectedHandler = result.current.createDropRejected(mockOnChange);

      expect(typeof dropRejectedHandler).toBe('function');
    });
  });
});