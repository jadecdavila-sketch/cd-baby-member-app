'use client';

import * as React from 'react';
import type { FieldError } from 'react-hook-form';

import { cn } from '@/shared/utils/index';
import { Switch } from '@/shared/components/shadcn/switch';

export interface SwitchFieldProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Switch>,
    'children' | 'checked' | 'onCheckedChange'
  > {
  id: string;

  // Controlled component props
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;

  // Content structure
  label: string;
  helperText?: string;
  tooltip?: string;

  // Form integration
  error?: FieldError | string;
  name?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;

  // Layout and styling
  className?: string;
  disabled?: boolean;
}

const SwitchField = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchFieldProps
>(
  (
    {
      id,
      checked,
      onCheckedChange,
      label,
      helperText,
      tooltip,
      error,
      name,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      className,
      disabled = false,
      ...switchProps
    },
    ref
  ) => {
    // Generate IDs for accessibility
    const labelId = `${id}-label`;
    const helperTextId = helperText ? `${id}-helper` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    // Combine aria-describedby with generated IDs
    const describedBy =
      [ariaDescribedBy, helperTextId, errorId].filter(Boolean).join(' ') ||
      undefined;

    // Extract error message
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={cn('space-y-2', className)}>
        {/* Label with optional tooltip */}
        <div className="flex items-center gap-2">
          <label
            id={labelId}
            htmlFor={id}
            className={cn(
              'text-foreground text-sm leading-none font-medium',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            )}
          >
            {label}
          </label>
          {tooltip && (
            <span
              className="text-muted-foreground text-xs"
              title={tooltip}
              aria-label={tooltip}
            >
              ⓘ
            </span>
          )}
        </div>

        {/* Switch and helper text container */}
        <div className="flex items-center gap-3">
          <Switch
            ref={ref}
            id={id}
            {...(name ? { name } : {})}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
            {...(ariaLabel ? {} : { 'aria-labelledby': labelId })}
            {...(describedBy ? { 'aria-describedby': describedBy } : {})}
            {...switchProps}
          />

          {/* Helper text beside switch */}
          {helperText && (
            <p
              id={helperTextId}
              className={cn(
                'text-muted-foreground text-sm',
                disabled && 'opacity-50'
              )}
            >
              {helperText}
            </p>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <p
            id={errorId}
            className="text-destructive text-sm font-medium"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
SwitchField.displayName = 'SwitchField';

export { SwitchField };
