import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { FilePreview } from '../file-preview';
import {
  createImagePreviewUrl,
  getFileTypeInfo,
  isImageFile,
} from '../../../utils';

// Mock utility functions
vi.mock('../../../utils', () => ({
  createImagePreviewUrl: vi.fn(),
  getFileTypeInfo: vi.fn(),
  isImageFile: vi.fn(),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Archive: vi.fn(() => <span data-testid="archive-icon">Archive</span>),
  File: vi.fn(() => <span data-testid="file-icon">File</span>),
  FileText: vi.fn(() => <span data-testid="filetext-icon">FileText</span>),
  Image: vi.fn(() => <span data-testid="image-icon">Image</span>),
  Music: vi.fn(() => <span data-testid="music-icon">Music</span>),
  Sheet: vi.fn(() => <span data-testid="sheet-icon">Sheet</span>),
  Video: vi.fn(() => <span data-testid="video-icon">Video</span>),
}));

// Mock URL.createObjectURL and revokeObjectURL
const mockRevokeObjectURL = vi.fn();
Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
  writable: true,
});

describe('FilePreview', () => {
  const defaultProps = {
    file: new File(['test content'], 'test.pdf', { type: 'application/pdf' }),
    size: 'md' as const,
  };

  beforeEach(() => {
    vi.mocked(getFileTypeInfo).mockReturnValue({
      type: 'pdf',
      icon: 'File',
      color: 'text-red-500',
    });

    vi.mocked(isImageFile).mockReturnValue(false);
    vi.mocked(createImagePreviewUrl).mockReturnValue('blob:test-url');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Non-image files', () => {
    beforeEach(() => {
      vi.mocked(isImageFile).mockReturnValue(false);
    });

    it('renders file type icon for non-image files', () => {
      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('file-icon')).toBeInTheDocument();
      expect(getFileTypeInfo).toHaveBeenCalledWith(defaultProps.file);
    });

    it('applies correct size classes for medium size', () => {
      render(<FilePreview {...defaultProps} size="md" />);

      const container = screen.getByTestId('file-icon').closest('div');
      expect(container).toHaveClass('h-12', 'w-12');
    });

    it('applies correct size classes for small size', () => {
      render(<FilePreview {...defaultProps} size="sm" />);

      const container = screen.getByTestId('file-icon').closest('div');
      expect(container).toHaveClass('h-8', 'w-8');
    });

    it('applies correct size classes for large size', () => {
      render(<FilePreview {...defaultProps} size="lg" />);

      const container = screen.getByTestId('file-icon').closest('div');
      expect(container).toHaveClass('h-16', 'w-16');
    });

    it('renders different icon types based on file type info', () => {
      vi.mocked(getFileTypeInfo).mockReturnValue({
        type: 'image',
        icon: 'Image',
        color: 'text-blue-500',
      });

      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('image-icon')).toBeInTheDocument();
    });

    it('renders archive icon for archive files', () => {
      vi.mocked(getFileTypeInfo).mockReturnValue({
        type: 'archive',
        icon: 'Archive',
        color: 'text-yellow-500',
      });

      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('archive-icon')).toBeInTheDocument();
    });

    it('renders music icon for audio files', () => {
      vi.mocked(getFileTypeInfo).mockReturnValue({
        type: 'audio',
        icon: 'Music',
        color: 'text-purple-500',
      });

      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('music-icon')).toBeInTheDocument();
    });

    it('renders video icon for video files', () => {
      vi.mocked(getFileTypeInfo).mockReturnValue({
        type: 'video',
        icon: 'Video',
        color: 'text-green-500',
      });

      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('video-icon')).toBeInTheDocument();
    });

    it('renders sheet icon for spreadsheet files', () => {
      vi.mocked(getFileTypeInfo).mockReturnValue({
        type: 'spreadsheet',
        icon: 'Sheet',
        color: 'text-teal-500',
      });

      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('sheet-icon')).toBeInTheDocument();
    });

    it('renders filetext icon for document files', () => {
      vi.mocked(getFileTypeInfo).mockReturnValue({
        type: 'document',
        icon: 'FileText',
        color: 'text-indigo-500',
      });

      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('filetext-icon')).toBeInTheDocument();
    });

    it('falls back to File icon for unknown icon types', () => {
      vi.mocked(getFileTypeInfo).mockReturnValue({
        type: 'other',
        icon: 'UnknownIcon',
        color: 'text-gray-500',
      });

      render(<FilePreview {...defaultProps} />);

      expect(screen.getByTestId('file-icon')).toBeInTheDocument();
    });

  });

  describe('Image files', () => {
    const imageFile = new File(['image content'], 'photo.jpg', {
      type: 'image/jpeg',
    });

    beforeEach(() => {
      vi.mocked(isImageFile).mockReturnValue(true);
      vi.mocked(createImagePreviewUrl).mockReturnValue('blob:mock-url');
    });

    it('renders image preview for image files', async () => {
      render(<FilePreview file={imageFile} size="md" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'blob:mock-url');
      expect(img).toHaveAttribute('alt', 'Preview of photo.jpg');
    });

    it('creates image preview URL on mount', async () => {
      render(<FilePreview file={imageFile} size="md" />);

      await waitFor(() => {
        expect(createImagePreviewUrl).toHaveBeenCalledWith(imageFile);
      });
    });

    it('cleans up image preview URL on unmount', async () => {
      const { unmount } = render(<FilePreview file={imageFile} size="md" />);

      await waitFor(() => {
        expect(createImagePreviewUrl).toHaveBeenCalled();
      });

      unmount();

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('handles image creation error and shows file icon', async () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      vi.mocked(createImagePreviewUrl).mockImplementation(() => {
        throw new Error('Failed to create preview');
      });

      render(<FilePreview file={imageFile} size="md" />);

      await waitFor(() => {
        expect(screen.getByTestId('file-icon')).toBeInTheDocument();
      });

      expect(consoleWarn).toHaveBeenCalledWith(
        'Failed to create image preview:',
        expect.any(Error)
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();

      consoleWarn.mockRestore();
    });

    it('handles image load error and shows file icon', async () => {
      render(<FilePreview file={imageFile} size="md" />);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      const img = screen.getByRole('img');

      // Simulate image load error
      act(() => {
        img.dispatchEvent(new Event('error'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('file-icon')).toBeInTheDocument();
      });

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('applies correct size classes to image container', async () => {
      render(<FilePreview file={imageFile} size="lg" />);

      await waitFor(() => {
        const img = screen.getByRole('img');
        const container = img.closest('div');
        expect(container).toHaveClass('h-16', 'w-16');
      });
    });

    it('applies object-cover class to image', async () => {
      render(<FilePreview file={imageFile} size="md" />);

      await waitFor(() => {
        const img = screen.getByRole('img');
        expect(img).toHaveClass('h-full', 'w-full', 'object-cover');
      });
    });
  });

  describe('Component props and styling', () => {
    it('applies custom className', () => {
      render(<FilePreview {...defaultProps} className="custom-class" />);

      const container = screen.getByTestId('file-icon').closest('div');
      expect(container).toHaveClass('custom-class');
    });

    it('applies default container styles', () => {
      render(<FilePreview {...defaultProps} />);

      const container = screen.getByTestId('file-icon').closest('div');
      expect(container).toHaveClass(
        'border-border',
        'bg-muted',
        'flex',
        'items-center',
        'justify-center',
        'rounded-md',
        'border'
      );
    });

    it('forwards ref to container div', () => {
      const ref = vi.fn();

      render(<FilePreview {...defaultProps} ref={ref} />);

      expect(ref).toHaveBeenCalled();
    });

    it('passes through additional HTML props', () => {
      render(<FilePreview {...defaultProps} data-testid="custom-preview" />);

      const container = screen.getByTestId('custom-preview');
      expect(container).toBeInTheDocument();
    });

  });

  describe('Effect cleanup', () => {
    it('does not create preview URL for non-image files', () => {
      vi.mocked(isImageFile).mockReturnValue(false);

      render(<FilePreview {...defaultProps} />);

      expect(createImagePreviewUrl).not.toHaveBeenCalled();
    });

    it('handles effect cleanup when no preview URL was created', () => {
      vi.mocked(isImageFile).mockReturnValue(true);
      vi.mocked(createImagePreviewUrl).mockImplementation(() => {
        throw new Error('Failed');
      });

      const { unmount } = render(
        <FilePreview file={new File([], 'test.jpg')} />
      );

      // Should not throw error on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('updates preview when file changes', async () => {
      const firstFile = new File(['content1'], 'first.jpg', {
        type: 'image/jpeg',
      });
      const secondFile = new File(['content2'], 'second.jpg', {
        type: 'image/jpeg',
      });

      vi.mocked(isImageFile).mockReturnValue(true);
      vi.mocked(createImagePreviewUrl)
        .mockReturnValueOnce('blob:first-url')
        .mockReturnValueOnce('blob:second-url');

      const { rerender } = render(<FilePreview file={firstFile} size="md" />);

      await waitFor(() => {
        expect(createImagePreviewUrl).toHaveBeenCalledWith(firstFile);
      });

      rerender(<FilePreview file={secondFile} size="md" />);

      await waitFor(() => {
        expect(createImagePreviewUrl).toHaveBeenCalledWith(secondFile);
      });

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:first-url');
    });
  });
});
