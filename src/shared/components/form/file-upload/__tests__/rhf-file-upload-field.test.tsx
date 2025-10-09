import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { vi } from 'vitest';

import { RhfFileUploadField } from '../rhf-file-upload-field';

const mockFiles = [
  new File(['file content 1'], 'file1.txt', { type: 'text/plain' }),
  new File(['file content 2'], 'file2.jpg', { type: 'image/jpeg' }),
];

type TestFormProps = {
  defaultValue?: File[];
  onSubmit?: () => void;
};

const TestForm = ({ defaultValue = [], onSubmit = vi.fn() }: TestFormProps) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testFiles: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RhfFileUploadField
        name="testFiles"
        control={control}
        id="test-file-upload"
        label="Test File Upload"
        FileUploadProps={{
          acceptedFileTypes: ['image/*', 'text/*'],
          maxFileSize: 5 * 1024 * 1024, // 5MB
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RhfFileUploadField', () => {
  it('renders with label and file upload area', () => {
    render(<TestForm />);

    expect(screen.getByText('Test File Upload')).toBeInTheDocument();
    // Check for the upload area with the correct aria-label
    expect(
      screen.getByRole('button', { name: /file upload area/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Drag & Drop or Click to Upload')
    ).toBeInTheDocument();
  });

  it('displays uploaded files', () => {
    render(<TestForm defaultValue={mockFiles} />);

    expect(screen.getByText('file1.txt')).toBeInTheDocument();
    expect(screen.getByText('file2.jpg')).toBeInTheDocument();
    expect(screen.getByText('Uploaded Files (2)')).toBeInTheDocument();
  });

  it('handles file removal', async () => {
    const user = userEvent.setup();
    render(<TestForm defaultValue={[mockFiles[0]!]} />);

    expect(screen.getByText('file1.txt')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', {
      name: /remove.*file1.txt/i,
    });
    await user.click(removeButton);

    expect(screen.queryByText('file1.txt')).not.toBeInTheDocument();
  });

  it('submits form with files', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm defaultValue={mockFiles} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(
      { testFiles: mockFiles },
      expect.any(Object)
    );
  });

  it('displays custom error message', () => {
    const TestFormWithCustomError = () => {
      const { control } = useForm();

      return (
        <RhfFileUploadField
          name="testFiles"
          control={control}
          id="test-file-upload"
          label="Test File Upload"
          FileUploadProps={{
            acceptedFileTypes: ['image/*'],
          }}
          errorMessage="Custom error message"
        />
      );
    };

    render(<TestFormWithCustomError />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Custom error message');
  });

  it('forwards all FileUploadField props', () => {
    const TestFormWithProps = () => {
      const { control } = useForm();

      return (
        <RhfFileUploadField
          name="testFiles"
          control={control}
          id="test-file-upload"
          label="Test File Upload"
          helperText="Upload your files here"
          required
          disabled
          FileUploadProps={{
            acceptedFileTypes: ['image/*', 'text/*'],
            maxFileSize: 2 * 1024 * 1024, // 2MB
            multiple: false,
          }}
        />
      );
    };

    render(<TestFormWithProps />);

    expect(screen.getByText('Upload your files here')).toBeInTheDocument();
    expect(screen.getByText('Test File Upload')).toHaveClass(
      "after:content-['*']"
    );

    // Check that the upload area is disabled (has tabindex -1 and disabled styling)
    const uploadArea = screen.getByRole('button', {
      name: /file upload area/i,
    });
    expect(uploadArea).toHaveAttribute('tabindex', '-1');
    expect(uploadArea).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('supports tooltip functionality', () => {
    const TestFormWithTooltip = () => {
      const { control } = useForm();

      return (
        <RhfFileUploadField
          name="testFiles"
          control={control}
          id="test-file-upload"
          label="Test File Upload"
          tooltip="This is tooltip content"
          tooltipId="file-upload-tooltip"
          FileUploadProps={{
            acceptedFileTypes: ['image/*'],
          }}
        />
      );
    };

    render(<TestFormWithTooltip />);

    expect(
      screen.getByRole('button', {
        name: /more information about test file upload/i,
      })
    ).toBeInTheDocument();
  });

  it('handles multiple file upload when enabled', () => {
    const TestFormMultiple = () => {
      const { control } = useForm();

      return (
        <RhfFileUploadField
          name="testFiles"
          control={control}
          id="test-file-upload"
          label="Test File Upload"
          FileUploadProps={{
            acceptedFileTypes: ['image/*', 'text/*'],
            multiple: true,
          }}
        />
      );
    };

    render(<TestFormMultiple />);

    // Check that the aria-label indicates multiple files are allowed
    expect(
      screen.getByRole('button', { name: /file upload area.*multiple files/i })
    ).toBeInTheDocument();
  });
});
