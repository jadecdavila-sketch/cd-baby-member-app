'use client';

import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/shared/components/shadcn';
import { cn } from '@/shared/utils/index';

import type { UploadedFileProps } from '../../file-upload-types';
import { formatFileSize } from '../../utils';
import { FilePreview } from '../file-preview';

const UploadedFile = React.forwardRef<HTMLDivElement, UploadedFileProps>(
  ({ file, index, onRemove, showPreview = true, className, ...props }, ref) => {
    const handleRemove = () => {
      onRemove(index);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        handleRemove();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'group border-border bg-card flex items-start gap-3 rounded-lg border p-3 transition-colors',
          'hover:bg-accent/50',
          'focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2',
          className
        )}
        role="listitem"
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* File Preview */}
        {showPreview && (
          <div className="shrink-0">
            <FilePreview file={file} size="md" />
          </div>
        )}

        {/* File Information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p
                className="text-foreground truncate text-sm font-medium"
                title={file.name}
              >
                {file.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Remove Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'text-muted-foreground hover:text-foreground h-6 w-6 p-0',
                'opacity-0 transition-opacity group-hover:opacity-100',
                'focus:opacity-100'
              )}
              onClick={handleRemove}
              aria-label={`Remove ${file.name}`}
              id={`Remove ${file.name}`}
              data-testid="remove-button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Screen reader information */}
        <div className="sr-only">
          File: {file.name}, Size: {formatFileSize(file.size)}
          {index + 1} of uploaded files. Press Delete or Backspace to remove
          this file.
        </div>
      </div>
    );
  }
);

UploadedFile.displayName = 'UploadedFile';

export { UploadedFile };
