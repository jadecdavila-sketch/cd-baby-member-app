import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useDropzone } from 'react-dropzone';

import { useFileUpload, type UseFileUploadOptions } from '../use-file-upload';
import { useFileUploadUtils } from '../hooks';

// Mock react-dropzone
vi.mock('react-dropzone');

// Mock useFileUploadUtils hook
vi.mock('../hooks');

describe('useFileUpload', () => {
  let mockUseDropzone: ReturnType<typeof useDropzone>;
  let mockUseFileUploadUtils: ReturnType<typeof useFileUploadUtils>;

  const defaultOptions: UseFileUploadOptions = {
    multiple: false,
    files: [],
    onChange: vi.fn(),
    acceptedFileTypes: ['.jpg', '.png'],
    maxFileSize: 1024 * 1024,
    disabled: false,
  };

  beforeEach(() => {
    mockUseDropzone = {
      // @ts-expect-error - partial type for testing
      getRootProps: vi.fn(() => ({
        role: 'button',
        tabIndex: 0,
        'aria-label': 'File upload area',
      })),
      // @ts-expect-error - partial type for testing
      getInputProps: vi.fn(() => ({
        type: 'file',
        'aria-hidden': 'true',
      })),
      open: vi.fn(),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: [],
      fileRejections: [],
      isFocused: false,
      isFileDialogActive: false,
      // @ts-expect-error - partial type for testing
      inputRef: { current: null },
      // @ts-expect-error - partial type for testing
      rootRef: { current: null },
    };

    mockUseFileUploadUtils = {
      removeFileFromList: vi.fn(),
      createFileDrop: vi.fn(() => vi.fn()),
      createDropRejected: vi.fn(() => vi.fn()),
      replaceFileInList: vi.fn(),
      clearFileList: vi.fn(),
    };

    vi.mocked(useDropzone).mockReturnValue(mockUseDropzone);
    vi.mocked(useFileUploadUtils).mockReturnValue(mockUseFileUploadUtils);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useFileUpload(defaultOptions));

    expect(result.current.isDragActive).toBe(false);
    expect(result.current.isDragReject).toBe(false);
    expect(result.current.removeFile).toBeInstanceOf(Function);
    expect(result.current.handleClick).toBeInstanceOf(Function);
    expect(result.current.handleKeyDown).toBeInstanceOf(Function);
    expect(result.current.getRootProps).toBeInstanceOf(Function);
    expect(result.current.getInputProps).toBeInstanceOf(Function);
  });

  it('calls useFileUploadUtils with correct options', () => {
    const options = {
      ...defaultOptions,
      acceptedFileTypes: ['.pdf'],
      maxFileSize: 2000000,
      multiple: true,
    };

    renderHook(() => useFileUpload(options));

    expect(useFileUploadUtils).toHaveBeenCalledWith({
      multiple: true,
      onChange: expect.any(Function),
    });
  });

  it('configures useDropzone with correct options', () => {
    const options = {
      ...defaultOptions,
      acceptedFileTypes: ['.jpg', '.png'],
      maxFileSize: 1000000,
      multiple: true,
      disabled: true,
    };

    renderHook(() => useFileUpload(options));

    expect(useDropzone).toHaveBeenCalledWith({
      accept: {
        '.jpg': [],
        '.png': [],
      },
      maxSize: 1000000,
      multiple: true,
      disabled: true,
      onDrop: expect.any(Function),
      onDropRejected: expect.any(Function),
      onDragEnter: expect.any(Function),
      onDragLeave: expect.any(Function),
      onDropAccepted: expect.any(Function),
      noClick: true,
      noKeyboard: true,
    });
  });

  it('handles MIME types in acceptedFileTypes', () => {
    const options = {
      ...defaultOptions,
      acceptedFileTypes: ['image/jpeg', 'image/png', '.pdf'],
    };

    renderHook(() => useFileUpload(options));

    expect(useDropzone).toHaveBeenCalledWith(
      expect.objectContaining({
        accept: {
          'image/jpeg': [],
          'image/png': [],
          '.pdf': [],
        },
      })
    );
  });

  it('removes file when removeFile is called', () => {
    const testFiles = [
      new File(['test1'], 'test1.jpg'),
      new File(['test2'], 'test2.jpg'),
    ];

    const options = {
      ...defaultOptions,
      files: testFiles,
    };

    const { result } = renderHook(() => useFileUpload(options));

    act(() => {
      result.current.removeFile(0);
    });

    expect(mockUseFileUploadUtils.removeFileFromList).toHaveBeenCalledWith(
      testFiles,
      0
    );
  });

  it('handles click when not disabled', () => {
    const { result } = renderHook(() => useFileUpload(defaultOptions));

    act(() => {
      result.current.handleClick();
    });

    expect(mockUseDropzone.open).toHaveBeenCalled();
  });

  it('does not open dialog when disabled', () => {
    const options = {
      ...defaultOptions,
      disabled: true,
    };

    const { result } = renderHook(() => useFileUpload(options));

    act(() => {
      result.current.handleClick();
    });

    expect(mockUseDropzone.open).not.toHaveBeenCalled();
  });


  it('handles keyboard events (Enter)', () => {
    const { result } = renderHook(() => useFileUpload(defaultOptions));

    const mockEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockUseDropzone.open).toHaveBeenCalled();
  });

  it('handles keyboard events (Space)', () => {
    const { result } = renderHook(() => useFileUpload(defaultOptions));

    const mockEvent = {
      key: ' ',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockUseDropzone.open).toHaveBeenCalled();
  });

  it('ignores other keyboard events', () => {
    const { result } = renderHook(() => useFileUpload(defaultOptions));

    const mockEvent = {
      key: 'Tab',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockUseDropzone.open).not.toHaveBeenCalled();
  });

  it('manages drag state correctly', () => {
    const { result, rerender } = renderHook(() =>
      useFileUpload(defaultOptions)
    );

    expect(result.current.isDragActive).toBe(false);
    expect(result.current.isDragReject).toBe(false);

    // Simulate drag enter
    const dropzoneCall = vi.mocked(useDropzone).mock.calls[0]?.[0];
    act(() => {
      dropzoneCall?.onDragEnter?.({} as any);
    });

    rerender();
    expect(result.current.isDragActive).toBe(true);

    // Simulate drag leave
    act(() => {
      dropzoneCall?.onDragLeave?.({} as any);
    });

    rerender();
    expect(result.current.isDragActive).toBe(false);
  });

  it('handles drop accepted', () => {
    const { result, rerender } = renderHook(() =>
      useFileUpload(defaultOptions)
    );

    // Set up drag active state
    act(() => {
      const dropzoneCall = vi.mocked(useDropzone).mock.calls[0]?.[0];
      dropzoneCall?.onDragEnter?.({} as any);
    });

    rerender();
    expect(result.current.isDragActive).toBe(true);

    // Simulate drop accepted
    act(() => {
      const dropzoneCall = vi.mocked(useDropzone).mock.calls[0]?.[0];
      dropzoneCall?.onDropAccepted?.({} as any, {} as any);
    });

    rerender();
    expect(result.current.isDragActive).toBe(false);
    expect(result.current.isDragReject).toBe(false);
  });

  it('handles drop rejected with timeout reset', async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(() =>
      useFileUpload(defaultOptions)
    );

    // Simulate enhanced drop rejected handler being called
    const dropzoneCall = vi.mocked(useDropzone).mock.calls[0]?.[0];

    act(() => {
      dropzoneCall?.onDropRejected?.([] as any, {} as any);
    });

    rerender();
    expect(result.current.isDragActive).toBe(false);
    expect(result.current.isDragReject).toBe(true);

    // Fast forward time to trigger timeout reset
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    rerender();
    expect(result.current.isDragReject).toBe(false);

    vi.useRealTimers();
  });


  it('does not include maxFiles in dropzone config', () => {
    const options = {
      ...defaultOptions,
      multiple: true,
    };

    renderHook(() => useFileUpload(options));

    const dropzoneCall = vi.mocked(useDropzone).mock.calls[0]?.[0];
    expect(dropzoneCall).not.toHaveProperty('maxFiles');
  });

  it('handles empty acceptedFileTypes array', () => {
    const options = {
      ...defaultOptions,
      acceptedFileTypes: undefined,
    };

    renderHook(() => useFileUpload(options));

    expect(useDropzone).toHaveBeenCalledWith(
      expect.objectContaining({
        accept: {},
      })
    );
  });

  it('sets disabled state correctly', () => {
    const options = {
      ...defaultOptions,
      disabled: true,
    };

    renderHook(() => useFileUpload(options));

    expect(useDropzone).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      })
    );
  });

});
