import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within, expect } from 'storybook/test';
import { useState } from 'react';

import {
  FileUploadField,
  FileUploadFieldProps,
  FileUploadProps,
} from '@/shared/components/form';

const meta: Meta<typeof FileUploadField> = {
  title: 'shared/components/form/FileUploadField',
  component: FileUploadField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive controlled file upload component with drag & drop and accessibility features. Supports single/multiple files with external validation.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the field',
    },
    label: {
      control: 'text',
      description: 'Label text for the file upload field',
    },
    required: {
      control: 'boolean',
      description: 'Mark field as required',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all upload interactions',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the field',
    },
    tooltip: {
      control: 'text',
      description: 'Tooltip text for help information',
    },
    tooltipId: {
      control: 'text',
      description: 'ID for the tooltip element',
    },
    FileUploadProps: {
      files: {
        control: false,
        description: 'Currently uploaded files (controlled component)',
      },
      onChange: {
        control: false,
        description: 'Callback when files change (controlled component)',
      },
      title: {
        control: 'text',
        description: 'Main heading text for upload area',
      },
      subtitle: {
        control: 'text',
        description: 'Secondary descriptive text',
      },
      tertiaryText: {
        control: 'text',
        description: 'Tertiary descriptive text',
      },
      acceptedFileTypes: {
        control: 'object',
        description: 'Array of allowed file types (extensions or MIME types)',
      },
      maxFileSize: {
        control: 'number',
        description: 'Maximum file size in bytes',
      },
      multiple: {
        control: 'boolean',
        description: 'Allow multiple file selection',
      },
      showFiles: {
        control: 'boolean',
        description: 'Show uploaded files list',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Args = Omit<Partial<FileUploadFieldProps>, 'FileUploadProps'> & {
  FileUploadProps: Partial<FileUploadProps>;
};
type Story = StoryObj<Args>;

// Controlled component template with state management
const ControlledFileUploadTemplate = (args: Args) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (newFiles: File[]) => {
    setFiles(newFiles);
    console.log(
      'Files changed:',
      newFiles.map((f) => ({ name: f.name, size: f.size }))
    );
  };

  // const handleFileAccepted = (acceptedFiles: File[]) => {
  //   console.log(
  //     'Files accepted:',
  //     acceptedFiles.map((f) => f.name)
  //   );
  // };

  // const handleFileRemoved = (index: number, removedFile: File) => {
  //   console.log(`File removed at index ${index}:`, removedFile.name);
  // };

  const defaultFileUploadFieldProps: FileUploadFieldProps = {
    id: 'file-upload',
    label: 'Upload File',
    ...args,
    FileUploadProps: {
      files,
      onChange: handleChange,
      acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      multiple: false,
      ...args.FileUploadProps,
    },
  };

  return <FileUploadField {...defaultFileUploadFieldProps} />;
};

// Basic single image upload
export const SingleImage: Story = {
  render: ControlledFileUploadTemplate,
  args: {
    id: 'profile-image',
    label: 'Upload Profile Image',
    helperText: 'Choose a clear photo for your profile',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that the upload area is rendered
    await expect(canvas.getByText('Upload Profile Image')).toBeInTheDocument();
    await expect(
      canvas.getByText('Choose a clear photo for your profile')
    ).toBeInTheDocument();

    // Check that file upload area is rendered
    await expect(
      canvas.getByRole('button', { name: /file upload area.*single file/i })
    ).toBeInTheDocument();
  },
};

// Multiple documents upload
export const MultipleDocuments: Story = {
  render: ControlledFileUploadTemplate,
  args: {
    id: 'supporting-documents',
    label: 'Upload Supporting Documents',
    FileUploadProps: {
      acceptedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
      multiple: true,
    },
    helperText: 'Select up to 5 documents that support your application',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check multiple files are allowed
    await expect(
      canvas.getByRole('button', { name: /file upload area.*multiple files/i })
    ).toBeInTheDocument();
  },
};

// Audio files for music platform
export const AudioFiles: Story = {
  render: ControlledFileUploadTemplate,
  args: {
    id: 'audio-tracks',
    label: 'Upload Your Tracks',
    FileUploadProps: {
      acceptedFileTypes: ['.mp3', '.wav', '.flac', '.aac', '.m4a'],
      maxFileSize: 50 * 1024 * 1024, // 50MB
      multiple: true,
    },
    helperText: 'Upload high-quality audio files for distribution',
  },
};

// Disabled state
export const Disabled: Story = {
  render: ControlledFileUploadTemplate,
  args: {
    id: 'disabled-upload',
    label: 'Upload Currently Disabled',
    helperText: 'File upload is temporarily unavailable',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that upload area is disabled
    const uploadArea = canvas.getByRole('button', { name: /file upload area/i });
    await expect(uploadArea).toHaveAttribute('tabindex', '-1');
  },
};

export const WithExternalValidationError: Story = {
  render: ControlledFileUploadTemplate,
  args: {
    id: 'error-demo',
    label: 'Upload with External Validation Error',
    helperText: 'This example shows external validation error handling',
    error: 'File size exceeds 5MB limit (external validation)',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check error message is displayed (from external validation)
    await expect(
      canvas.getByText('File size exceeds 5MB limit (external validation)')
    ).toBeInTheDocument();
  },
};

// Custom upload text with tooltip
export const WithCustomText: Story = {
  render: ControlledFileUploadTemplate,
  args: {
    id: 'custom-text',
    label: 'Upload with Custom Text',
    tooltip: 'This explains what kind of files are acceptable',
    tooltipId: 'custom-text-tooltip',
    helperText: 'Drag files here or click to browse',
    FileUploadProps: {
      title: 'Drop Your Music Here',
      subtitle: 'Supported formats: MP3, WAV, FLAC',
      tertiaryText: 'Maximum 100MB per file',
      acceptedFileTypes: ['.mp3', '.wav', '.flac'],
      maxFileSize: 100 * 1024 * 1024,
      multiple: true,
    },
  },
};

// Hide files list
export const HideFilesList: Story = {
  render: ControlledFileUploadTemplate,
  args: {
    id: 'no-files-display',
    label: 'Upload without File Display',
    helperText: 'Files are uploaded but not shown in the UI',
    FileUploadProps: {
      showFiles: false,
      multiple: true,
      acceptedFileTypes: ['.pdf', '.doc', '.docx'],
    },
  },
};
