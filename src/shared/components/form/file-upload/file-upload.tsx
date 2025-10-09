'use client';

import { CloudUpload } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils/index';

import { UploadedFile } from './components/uploaded-file';
import { useFileUpload } from './use-file-upload';

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop' | 'onChange'> {
  // Required props - controlled component pattern
  files: File[]; // Currently uploaded files (required for controlled component)
  onChange: (files: File[]) => void; // State update callback (required for controlled component)

  // Configuration props
  id?: string;
  title?: string; // Main heading text
  subtitle?: string; // Secondary descriptive text
  tertiaryText?: string; // tertiery descriptive text
  acceptedFileTypes?: string[]; // Array of allowed extensions ['.jpg', '.png', '.pdf']
  maxFileSize?: number; // Maximum file size in bytes
  multiple?: boolean; // Single or multiple file selection
  showFiles?: boolean; // Render the files that have been added

  // State props
  disabled?: boolean;

  // Styling
  className?: string;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      id,
      title = 'Drag & Drop or Click to Upload',
      subtitle,
      tertiaryText,
      acceptedFileTypes,
      maxFileSize,
      multiple = false,
      showFiles = true,
      disabled = false,
      files,
      onChange,
      ...props
    },
    ref
  ) => {
    const {
      removeFile,
      handleClick,
      handleKeyDown,
      isDragActive,
      isDragReject,
      getRootProps,
      getInputProps,
    } = useFileUpload({
      acceptedFileTypes,
      maxFileSize,
      multiple,
      disabled,
      files,
      onChange,
    });

    return (
      <div ref={ref} {...props}>
        {/* Upload Area */}
        <div
          {...getRootProps()}
          id={id}
          className={cn(
            'group relative flex min-h-[180px] cursor-pointer rounded-lg transition-colors',
            // Default state
            'hover:bg-accent/50 bg-form-background',
            // Drag states
            isDragActive && 'border-primary bg-primary/10',
            isDragReject && 'border-destructive bg-destructive/10',
            // Disabled state
            disabled && 'cursor-not-allowed opacity-50',
            // Focus state
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={`File upload area. ${multiple ? 'Multiple files' : 'Single file'} allowed.`}
          aria-describedby="upload-instructions"
        >
          <input {...getInputProps()} aria-hidden="true" disabled={disabled} />

          <div className="flex w-full flex-col items-center justify-center text-center">
            {/* Upload Icon */}
            <div className="mt-4 h-12 w-12">
              <CloudUpload
                className={cn(
                  'h-full w-full',
                  isDragReject ? 'text-destructive' : 'text-primary'
                )}
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              {title && (
                <h3 className="text-foreground text-xs font-semibold">
                  {title}
                </h3>
              )}

              {subtitle && (
                <p className="text-muted-foreground text-xs">{subtitle}</p>
              )}

              {tertiaryText && (
                <p className="text-bold mt-2 text-[0.625rem] text-(--primary)">
                  {tertiaryText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {showFiles && files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-foreground text-sm font-medium">
              Uploaded Files ({files.length})
            </h4>

            <div
              className="space-y-2"
              role="list"
              aria-label={`${files.length} uploaded files`}
            >
              {files.map((file, index) => (
                <UploadedFile
                  key={`${file.name}-${file.size}-${index}`}
                  file={file}
                  index={index}
                  onRemove={removeFile}
                  showPreview={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {files.length > 0 && (
            <span>
              {files.length} file{files.length > 1 ? 's' : ''} uploaded.{' '}
              {files.map((file) => file.name).join(', ')}
            </span>
          )}
        </div>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
