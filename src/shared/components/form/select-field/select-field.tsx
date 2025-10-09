'use client';

import { HelpCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils';

import { Label } from '../../shadcn/label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../../shadcn/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../shadcn/tooltip';

interface SelectFieldPropsBase {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  onChange?: (value: string) => void;
  value?: string | undefined;
  defaultValue?: string | undefined;
}

interface SelectFieldPropsWithTooltip extends SelectFieldPropsBase {
  tooltip: string;
  tooltipId: string;
}

interface SelectFieldPropsWithoutTooltip extends SelectFieldPropsBase {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type SelectFieldProps =
  | SelectFieldPropsWithTooltip
  | SelectFieldPropsWithoutTooltip;

const SelectField = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  SelectFieldPropsWithTooltip | SelectFieldPropsWithoutTooltip
>(
  (
    {
      id,
      label,
      placeholder,
      tooltip,
      tooltipId,
      required,
      error,
      helperText,
      disabled,
      children,
      size = 'default',
      className,
      onChange,
      value,
      defaultValue,
      ...selectProps
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

        <Select
          {...(value !== undefined && { value })}
          {...(defaultValue !== undefined && { defaultValue })}
          {...(onChange !== undefined && { onValueChange: onChange })}
          disabled={disabled ?? false}
          {...selectProps}
        >
          <SelectTrigger
            id={id}
            ref={ref}
            size={size}
            className={cn(
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-help` : undefined
            }
            aria-invalid={error ? true : undefined}
            aria-required={required}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>

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
SelectField.displayName = 'SelectField';

export { SelectField };
