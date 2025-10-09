import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import {
  FileUploadField,
  type FileUploadFieldProps,
} from '../file-upload-field';

// Mock FileUpload component
vi.mock('../file-upload', () => ({
  FileUpload: React.forwardRef<HTMLDivElement, any>(
    ({ files, onChange, disabled, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="file-upload-mock"
        data-props={JSON.stringify({
          ...props,
          disabled: disabled ?? false,
        })}
      >
        FileUpload Mock
        <input
          type="file"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onChange(files);
          }}
          data-testid="file-input"
        />
      </div>
    )
  ),
}));

describe('FileUploadField', () => {
  const defaultProps: FileUploadFieldProps = {
    id: 'test-file-upload',
    label: 'Upload Files',
    FileUploadProps: {
      files: [],
      onChange: vi.fn(),
      acceptedFileTypes: ['.jpg', '.png'],
      maxFileSize: 1024 * 1024,
      multiple: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props', () => {
    render(<FileUploadField {...defaultProps} />);

    expect(screen.getByText('Upload Files')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload-mock')).toBeInTheDocument();
  });

  it('renders label without required indicator by default', () => {
    render(<FileUploadField {...defaultProps} />);

    const label = screen.getByText('Upload Files');
    expect(label).not.toHaveClass("after:content-['*']");
  });

  it('renders required indicator when required is true', () => {
    render(<FileUploadField {...defaultProps} required={true} />);

    const label = screen.getByText('Upload Files');
    expect(label).toHaveClass("after:content-['*']");
  });

  it('renders tooltip when tooltip props are provided', async () => {
    const propsWithTooltip = {
      ...defaultProps,
      tooltip: 'This is helpful information',
      tooltipId: 'help-tooltip',
    };

    render(<FileUploadField {...propsWithTooltip} />);

    const tooltipTrigger = screen.getByRole('button', {
      name: /more information about upload files/i,
    });
    expect(tooltipTrigger).toBeInTheDocument();

    await userEvent.hover(tooltipTrigger);
    expect(screen.getAllByText('This is helpful information')).toHaveLength(2); // One in tooltip content, one hidden for accessibility
  });

  it('does not render tooltip when tooltip props are not provided', () => {
    render(<FileUploadField {...defaultProps} />);

    const tooltipTrigger = screen.queryByRole('button', {
      name: /more information/i,
    });
    expect(tooltipTrigger).not.toBeInTheDocument();
  });

  it('passes all FileUpload props correctly', () => {
    const props = {
      ...defaultProps,
      FileUploadProps: {
        ...defaultProps.FileUploadProps,
        acceptedFileTypes: ['.pdf', '.doc'],
        maxFileSize: 5 * 1024 * 1024,
        multiple: true,
        maxFiles: 3,
        disabled: true,
        onFileAccepted: vi.fn(),
        onFileRemoved: vi.fn(),
      },
    };

    render(<FileUploadField {...props} />);

    const fileUploadMock = screen.getByTestId('file-upload-mock');
    const passedProps = JSON.parse(
      fileUploadMock.getAttribute('data-props') || '{}'
    );

    expect(passedProps).toMatchObject({
      acceptedFileTypes: ['.pdf', '.doc'],
      maxFileSize: 5 * 1024 * 1024,
      multiple: true,
      maxFiles: 3,
      disabled: true,
    });
  });

  it('handles file changes correctly', async () => {
    const mockOnChange = vi.fn();
    const props = {
      ...defaultProps,
      FileUploadProps: {
        ...defaultProps.FileUploadProps,
        onChange: mockOnChange,
      },
    };

    render(<FileUploadField {...props} />);

    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await userEvent.upload(fileInput, file);

    expect(mockOnChange).toHaveBeenCalledWith([file]);
  });

  it('displays error message when error prop is provided', () => {
    const propsWithError = {
      ...defaultProps,
      error: 'Please select a valid file',
    };

    render(<FileUploadField {...propsWithError} />);

    expect(screen.getByText('Please select a valid file')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('combines field error with file upload errors', () => {
    const propsWithError = {
      ...defaultProps,
      error: 'Field error',
    };

    render(<FileUploadField {...propsWithError} />);

    const errorMessages = screen.getAllByRole('alert');
    expect(errorMessages).toHaveLength(1);
    expect(screen.getByText('Field error')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    const propsWithHelper = {
      ...defaultProps,
      helperText: 'Upload your best photos',
    };

    render(<FileUploadField {...propsWithHelper} />);

    expect(screen.getByText('Upload your best photos')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    const propsWithBoth = {
      ...defaultProps,
      error: 'Something went wrong',
      helperText: 'This should be hidden',
    };

    render(<FileUploadField {...propsWithBoth} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('This should be hidden')).not.toBeInTheDocument();
  });

  it('sets proper ARIA attributes on FileUpload', () => {
    const propsWithError = {
      ...defaultProps,
      error: 'Validation error',
      required: true,
    };

    render(<FileUploadField {...propsWithError} />);

    const fileUploadMock = screen.getByTestId('file-upload-mock');
    const passedProps = JSON.parse(
      fileUploadMock.getAttribute('data-props') || '{}'
    );

    expect(passedProps).toHaveProperty('aria-describedby', 'test-file-upload-error');
    expect(passedProps).toHaveProperty('aria-invalid', true);
    expect(passedProps).toHaveProperty('aria-required', true);
  });

  it('sets aria-describedby to helper text when no error', () => {
    const propsWithHelper = {
      ...defaultProps,
      helperText: 'Helper text here',
    };

    render(<FileUploadField {...propsWithHelper} />);

    const fileUploadMock = screen.getByTestId('file-upload-mock');
    const passedProps = JSON.parse(
      fileUploadMock.getAttribute('data-props') || '{}'
    );

    expect(passedProps).toHaveProperty('aria-describedby', 'test-file-upload-help');
  });

  it('sets no aria-describedby when no error or helper text', () => {
    render(<FileUploadField {...defaultProps} />);

    const fileUploadMock = screen.getByTestId('file-upload-mock');
    const passedProps = JSON.parse(
      fileUploadMock.getAttribute('data-props') || '{}'
    );

    expect(passedProps).not.toHaveProperty('aria-describedby');
  });

  it('applies custom className', () => {
    const propsWithClass = {
      ...defaultProps,
      className: 'custom-class',
    };

    render(<FileUploadField {...propsWithClass} />);

    const fieldContainer = screen.getByTestId('file-upload-mock').parentElement;
    expect(fieldContainer).toHaveClass('custom-class');
  });

  it('tooltip button has proper accessibility attributes', () => {
    const propsWithTooltip = {
      ...defaultProps,
      tooltip: 'Helpful information',
      tooltipId: 'test-tooltip',
    };

    render(<FileUploadField {...propsWithTooltip} />);

    const tooltipButton = screen.getByRole('button', {
      name: /more information about upload files/i,
    });

    expect(tooltipButton).toHaveAttribute('id', 'test-tooltip');
    expect(tooltipButton).toHaveAttribute('type', 'button');
    expect(tooltipButton).toHaveAttribute(
      'aria-label',
      'More information about Upload Files'
    );
  });

  it('forwards ref to FileUpload component', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<FileUploadField {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('file-upload-mock'));
  });

  it('handles disabled state correctly', () => {
    const propsWithDisabled = {
      ...defaultProps,
      disabled: true,
    };

    render(<FileUploadField {...propsWithDisabled} />);

    const fileUploadMock = screen.getByTestId('file-upload-mock');
    const passedProps = JSON.parse(
      fileUploadMock.getAttribute('data-props') || '{}'
    );

    expect(passedProps).toHaveProperty('disabled', true);
  });
});