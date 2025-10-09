'use client';

import { HelpCircle } from 'lucide-react';
import * as React from 'react';

import { Label } from '@/shared/components/shadcn/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip';
import { cn } from '@/shared/utils/index';

import { FileUpload, type FileUploadProps } from './file-upload';

// FileUploadField wrapper props (similar to TextField pattern)
interface FileUploadFieldPropsBase {
  id: string;
  label: string;
  FileUploadProps: FileUploadProps;
  className?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

interface FileUploadFieldPropsWithTooltip extends FileUploadFieldPropsBase {
  tooltip: string;
  tooltipId: string;
}

interface FileUploadFieldPropsWithoutTooltip extends FileUploadFieldPropsBase {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type FileUploadFieldProps =
  | FileUploadFieldPropsWithTooltip
  | FileUploadFieldPropsWithoutTooltip;

const FileUploadField = React.forwardRef<HTMLDivElement, FileUploadFieldProps>(
  (
    {
      id,
      label,
      tooltip,
      tooltipId,
      className,
      required,
      error,
      helperText,
      disabled,
      FileUploadProps,
    },
    ref
  ) => {
    return (
      <div className={cn('flex flex-col space-y-2', className)}>
        {/* Label with tooltip */}
        <div className="flex items-center gap-2">
          <Label
            htmlFor={id}
            className={cn(
              'text-sm font-medium',
              required &&
                "after:text-destructive after:ml-1 after:content-['*']"
            )}
          >
            {label}
          </Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  id={tooltipId}
                  type="button"
                  className="inline-flex h-[14px] w-[14px] items-center justify-center"
                  aria-label={`More information about ${label}`}
                >
                  <HelpCircle className="text-muted-foreground hover:text-foreground h-[14px] w-[14px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* File Upload Component */}
        <FileUpload
          ref={ref}
          disabled={disabled ?? false}
          {...FileUploadProps}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-help` : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-required={required}
        />

        {/* Error Message */}
        {error && (
          <p
            id={`${id}-error`}
            className="text-destructive text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${id}-help`} className="text-muted-foreground text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUploadField.displayName = 'FileUploadField';

export { FileUploadField };
