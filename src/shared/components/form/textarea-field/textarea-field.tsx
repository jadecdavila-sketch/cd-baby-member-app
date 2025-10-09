'use client';

import { HelpCircle } from 'lucide-react';
import * as React from 'react';

import { Label } from '@/shared/components/shadcn/label';
import {
  Textarea,
  type TextareaProps,
} from '@/shared/components/shadcn/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip';
import { cn } from '@/shared/utils/index';

interface TextareaFieldPropsBase
  extends Omit<TextareaProps, 'id' | 'aria-describedby'> {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}
interface TextareaFieldPropsWithTooltip extends TextareaFieldPropsBase {
  tooltip: string;
  tooltipId: string;
}

interface TextareaFieldPropsWithOutTooltip extends TextareaFieldPropsBase {
  tooltip: undefined;
  tooltipId: undefined;
}

export type TextareaFieldProps =
  | TextareaFieldPropsWithTooltip
  | TextareaFieldPropsWithOutTooltip;

const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldPropsWithTooltip | TextareaFieldPropsWithOutTooltip
>(
  (
    {
      id,
      label,
      tooltip,
      tooltipId,
      required,
      error,
      helperText,
      disabled,
      className,
      ...textareaProps
    },
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          <Label
            htmlFor={id}
            className={cn(
              'text-right',
              required &&
                "after:text-destructive after:ml-1 after:content-['*']"
            )}
          >
            {label}
          </Label>
          {tooltip && (
            // eslint-disable-next-line custom/require-id-on-clickable
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
        <Textarea
          id={id}
          ref={ref}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-help` : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-required={required}
          disabled={disabled}
          {...textareaProps}
        />

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

        {helperText && !error && (
          <p id={`${id}-help`} className="text-muted-foreground text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
TextareaField.displayName = 'TextareaField';

export { TextareaField };
