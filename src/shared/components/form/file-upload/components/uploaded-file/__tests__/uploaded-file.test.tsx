import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { UploadedFile } from '../uploaded-file';
import { formatFileSize } from '../../../utils';
import { FilePreview } from '../../file-preview';

// Mock dependencies
vi.mock('../../../utils', () => ({
  formatFileSize: vi.fn(),
}));

vi.mock('../../file-preview', () => ({
  FilePreview: vi.fn(({ file }) => (
    <div data-testid="file-preview">Preview for {file.name}</div>
  )),
}));

// Mock Button component
vi.mock('@/shared/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, 'aria-label': ariaLabel, ...props }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      data-testid="remove-button"
      {...props}
    >
      {children}
    </button>
  )),
}));

// Mock X icon
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">×</span>,
}));

describe('UploadedFile', () => {
  const defaultProps = {
    file: new File(['test content'], 'test-document.pdf', {
      type: 'application/pdf',
    }),
    index: 0,
    onRemove: vi.fn(),
    showPreview: true,
  };

  beforeEach(() => {
    vi.mocked(formatFileSize).mockReturnValue('1.2 MB');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders file information correctly', () => {
    render(<UploadedFile {...defaultProps} />);

    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.2 MB')).toBeInTheDocument();
    expect(formatFileSize).toHaveBeenCalledWith(defaultProps.file.size);
  });

  it('renders file name with title attribute for truncation tooltip', () => {
    render(<UploadedFile {...defaultProps} />);

    const fileName = screen.getByText('test-document.pdf');
    expect(fileName).toHaveAttribute('title', 'test-document.pdf');
  });

  it('renders file preview when showPreview is true', () => {
    render(<UploadedFile {...defaultProps} showPreview={true} />);

    expect(screen.getByTestId('file-preview')).toBeInTheDocument();
    expect(FilePreview).toHaveBeenCalledWith(
      {
        file: defaultProps.file,
        size: 'md',
      },
      undefined
    );
  });

  it('does not render file preview when showPreview is false', () => {
    render(<UploadedFile {...defaultProps} showPreview={false} />);

    expect(screen.queryByTestId('file-preview')).not.toBeInTheDocument();
    expect(FilePreview).not.toHaveBeenCalled();
  });

  it('renders remove button with correct aria-label', () => {
    render(<UploadedFile {...defaultProps} />);

    const removeButton = screen.getByTestId('remove-button');
    expect(removeButton).toHaveAttribute(
      'aria-label',
      'Remove test-document.pdf'
    );
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('calls onRemove with correct index when remove button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnRemove = vi.fn();

    render(
      <UploadedFile {...defaultProps} index={2} onRemove={mockOnRemove} />
    );

    const removeButton = screen.getByTestId('remove-button');
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(2);
  });

  it('calls onRemove when Delete key is pressed', () => {
    const mockOnRemove = vi.fn();

    render(
      <UploadedFile {...defaultProps} index={1} onRemove={mockOnRemove} />
    );

    const container = screen.getByRole('listitem');
    fireEvent.keyDown(container, { key: 'Delete' });

    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  it('calls onRemove when Backspace key is pressed', () => {
    const mockOnRemove = vi.fn();

    render(
      <UploadedFile {...defaultProps} index={3} onRemove={mockOnRemove} />
    );

    const container = screen.getByRole('listitem');
    fireEvent.keyDown(container, { key: 'Backspace' });

    expect(mockOnRemove).toHaveBeenCalledWith(3);
  });

  it('does not call onRemove for other keyboard keys', () => {
    const mockOnRemove = vi.fn();

    render(<UploadedFile {...defaultProps} onRemove={mockOnRemove} />);

    const container = screen.getByRole('listitem');
    fireEvent.keyDown(container, { key: 'Enter' });
    fireEvent.keyDown(container, { key: 'Space' });
    fireEvent.keyDown(container, { key: 'Tab' });

    expect(mockOnRemove).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<UploadedFile {...defaultProps} />);

    const container = screen.getByRole('listitem');
    expect(container).toBeInTheDocument();
  });

  it('provides screen reader information', () => {
    render(<UploadedFile {...defaultProps} index={2} />);

    const screenReaderContainer = screen.getByText((content, element) => {
      return !!(
        element?.classList.contains('sr-only') &&
        content.includes('File: test-document.pdf') &&
        content.includes('Size: 1.2 MB') &&
        content.includes('3 of uploaded files')
      );
    });

    expect(screenReaderContainer).toHaveClass('sr-only');
  });

  it('applies default CSS classes', () => {
    render(<UploadedFile {...defaultProps} />);

    const container = screen.getByRole('listitem');
    expect(container).toHaveClass(
      'group',
      'border-border',
      'bg-card',
      'flex',
      'items-start',
      'gap-3',
      'rounded-lg',
      'border',
      'p-3',
      'transition-colors',
      'hover:bg-accent/50',
      'focus-within:ring-ring',
      'focus-within:ring-2',
      'focus-within:ring-offset-2'
    );
  });

  it('applies custom className when provided', () => {
    render(<UploadedFile {...defaultProps} className="custom-class" />);

    const container = screen.getByRole('listitem');
    expect(container).toHaveClass('custom-class');
  });

  it('forwards ref to the container div', () => {
    const ref = vi.fn();

    render(<UploadedFile {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('passes through additional HTML props', () => {
    render(
      <UploadedFile {...defaultProps} data-testid="custom-uploaded-file" />
    );

    const container = screen.getByTestId('custom-uploaded-file');
    expect(container).toBeInTheDocument();
  });

  it('displays correct file information for different file types', () => {
    const imageFile = new File(['image content'], 'photo.jpg', {
      type: 'image/jpeg',
    });
    vi.mocked(formatFileSize).mockReturnValue('2.5 MB');

    render(<UploadedFile {...defaultProps} file={imageFile} />);

    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
    expect(screen.getByText('2.5 MB')).toBeInTheDocument();
    expect(formatFileSize).toHaveBeenCalledWith(imageFile.size);
  });

  it('handles long file names with proper truncation', () => {
    const longFileName =
      'this-is-a-very-long-file-name-that-should-be-truncated-properly.pdf';
    const fileWithLongName = new File(['test'], longFileName, {
      type: 'application/pdf',
    });

    render(<UploadedFile {...defaultProps} file={fileWithLongName} />);

    const fileName = screen.getByText(longFileName);
    expect(fileName).toHaveClass('truncate');
    expect(fileName).toHaveAttribute('title', longFileName);
  });

  it('remove button has proper styling classes', () => {
    render(<UploadedFile {...defaultProps} />);

    const removeButton = screen.getByTestId('remove-button');
    expect(removeButton).toHaveClass(
      'text-muted-foreground',
      'hover:text-foreground',
      'h-6',
      'w-6',
      'p-0',
      'opacity-0',
      'transition-opacity',
      'group-hover:opacity-100',
      'focus:opacity-100'
    );
  });

  it('file name has proper styling classes', () => {
    render(<UploadedFile {...defaultProps} />);

    const fileName = screen.getByText('test-document.pdf');
    expect(fileName).toHaveClass(
      'text-foreground',
      'truncate',
      'text-sm',
      'font-medium'
    );
  });

  it('file size has proper styling classes', () => {
    render(<UploadedFile {...defaultProps} />);

    const fileSize = screen.getByText('1.2 MB');
    expect(fileSize).toHaveClass('text-muted-foreground', 'text-xs');
  });
});
