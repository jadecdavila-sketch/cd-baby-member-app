import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { FileUpload } from '../file-upload';
import { useFileUpload } from '../use-file-upload';

// Mock the useFileUpload hook
vi.mock('../use-file-upload');

// Mock UploadedFile component
vi.mock('../components/uploaded-file', () => ({
  UploadedFile: ({
    file,
    onRemove,
    index,
  }: {
    file: File;
    onRemove: (index: number) => void;
    index: number;
  }) => (
    <div data-testid="uploaded-file">
      <span>{file.name}</span>
      <button onClick={() => onRemove(index)}>Remove</button>
    </div>
  ),
}));

describe('FileUpload', () => {
  let mockUseFileUpload: ReturnType<typeof useFileUpload>;

  const defaultProps = {
    files: [] as File[],
    onChange: vi.fn(),
    acceptedFileTypes: ['.jpg', '.png'],
    maxFileSize: 1024 * 1024, // 1MB
    multiple: false,
  };

  beforeEach(() => {
    mockUseFileUpload = {
      removeFile: vi.fn(),
      handleClick: vi.fn(),
      handleKeyDown: vi.fn(),
      isDragActive: false,
      isDragReject: false,
      // @ts-expect-error - partial type for testing
      getRootProps: () => ({
        role: 'button',
        tabIndex: 0,
        'aria-label': 'File upload area. Single file allowed.',
        'aria-describedby': 'upload-instructions',
      }),
      // @ts-expect-error - partial type for testing
      getInputProps: () => ({
        type: 'file',
        'aria-hidden': 'true',
      }),
    };

    vi.mocked(useFileUpload).mockReturnValue(mockUseFileUpload);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default title when no title provided', () => {
    render(<FileUpload {...defaultProps} />);

    expect(
      screen.getByText('Drag & Drop or Click to Upload')
    ).toBeInTheDocument();
  });

  it('renders custom title and subtitle', () => {
    render(
      <FileUpload
        {...defaultProps}
        title="Upload Image"
        subtitle="Select an image file"
      />
    );

    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText('Select an image file')).toBeInTheDocument();
  });

  it('calls useFileUpload hook with correct options', () => {
    const props = {
      ...defaultProps,
      acceptedFileTypes: ['.pdf'],
      maxFileSize: 2000000,
      multiple: true,
      disabled: true,
    };

    render(<FileUpload {...props} />);

    expect(useFileUpload).toHaveBeenCalledWith({
      acceptedFileTypes: ['.pdf'],
      maxFileSize: 2000000,
      multiple: true,
      files: [],
      onChange: expect.any(Function),
      disabled: true,
    });
  });

  it('displays uploaded files when files provided', () => {
    const testFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    render(<FileUpload {...defaultProps} files={[testFile]} />);

    expect(screen.getByText('Uploaded Files (1)')).toBeInTheDocument();
    expect(screen.getByTestId('uploaded-file')).toBeInTheDocument();
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });

  it('displays multiple uploaded files', () => {
    const testFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.png', { type: 'image/png' }),
    ];

    render(<FileUpload {...defaultProps} files={testFiles} />);

    expect(screen.getByText('Uploaded Files (2)')).toBeInTheDocument();
    expect(screen.getAllByTestId('uploaded-file')).toHaveLength(2);
    expect(screen.getByText('test1.jpg')).toBeInTheDocument();
    expect(screen.getByText('test2.png')).toBeInTheDocument();
  });

  it('hides uploaded files when showFiles is false', () => {
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <FileUpload {...defaultProps} files={[testFile]} showFiles={false} />
    );

    expect(screen.queryByText('Uploaded Files')).not.toBeInTheDocument();
    expect(screen.queryByTestId('uploaded-file')).not.toBeInTheDocument();
  });

  it('calls removeFile when uploaded file remove button is clicked', async () => {
    const user = userEvent.setup();
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(<FileUpload {...defaultProps} files={[testFile]} />);

    const removeButton = screen.getByRole('button', { name: 'Remove' });
    await user.click(removeButton);

    expect(mockUseFileUpload.removeFile).toHaveBeenCalledWith(0);
  });

  it('applies drag active styling', () => {
    vi.mocked(useFileUpload).mockReturnValue({
      ...mockUseFileUpload,
      isDragActive: true,
    });

    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen.getByRole('button');
    expect(uploadArea).toHaveClass('border-primary', 'bg-primary/10');
  });

  it('applies drag reject styling', () => {
    vi.mocked(useFileUpload).mockReturnValue({
      ...mockUseFileUpload,
      isDragReject: true,
    });

    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen.getByRole('button');
    expect(uploadArea).toHaveClass('border-destructive', 'bg-destructive/10');
  });

  it('applies disabled styling', () => {
    render(<FileUpload {...defaultProps} disabled={true} />);

    const uploadArea = screen.getByRole('button');
    expect(uploadArea).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();

    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen.getByRole('button');
    await user.click(uploadArea);

    expect(mockUseFileUpload.handleClick).toHaveBeenCalled();
  });

  it('handles keyboard events', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen.getByRole('button');
    fireEvent.keyDown(uploadArea, { key: 'Enter' });

    expect(mockUseFileUpload.handleKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'Enter' })
    );
  });

  it('provides proper accessibility attributes', () => {
    render(<FileUpload {...defaultProps} multiple={true} />);

    const uploadArea = screen.getByRole('button');
    expect(uploadArea).toHaveAttribute(
      'aria-label',
      'File upload area. Multiple files allowed.'
    );
    expect(uploadArea).toHaveAttribute(
      'aria-describedby',
      'upload-instructions'
    );
    expect(uploadArea).toHaveAttribute('tabIndex', '0');
  });

  it('announces file uploads to screen readers', () => {
    const testFiles = [
      new File(['test1'], 'document.pdf', { type: 'application/pdf' }),
      new File(['test2'], 'image.jpg', { type: 'image/jpeg' }),
    ];

    render(<FileUpload {...defaultProps} files={testFiles} />);

    const announcement = screen.getByText(
      '2 files uploaded. document.pdf, image.jpg'
    );
    const srContainer = announcement.closest('.sr-only');
    expect(srContainer).toHaveClass('sr-only');
    expect(srContainer).toHaveAttribute('aria-live', 'polite');
    expect(srContainer).toHaveAttribute('aria-atomic', 'true');
  });
});
