'use client';

import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils/index';

export interface RichCheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'children' | 'type' | 'checked' | 'onChange'
  > {
  id: string;

  // Controlled component props
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Content structure
  title: string;
  subtitle?: string;
  price?: string;

  // Icon support - before content
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;

  // Layout and styling
  className?: string;
  disabled?: boolean;
}

// Main RichCheckbox component
const RichCheckbox = React.forwardRef<HTMLInputElement, RichCheckboxProps>(
  (
    {
      id,
      checked,
      onChange,
      title,
      subtitle,
      price,
      icon: Icon,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      className,
      disabled = false,
      ...inputProps
    },
    ref
  ) => {
    // Generate IDs for accessibility
    const titleId = `${id}-title`;
    const descriptionId = subtitle ? `${id}-description` : undefined;

    return (
      <fieldset
        className={cn(
          'hover:bg-accent/50 bg-form-background rounded-md border-0 disabled:cursor-not-allowed disabled:opacity-50',
          'dark:bg-[#262626]',
          className
        )}
        disabled={disabled}
      >
        {/* Visual label container */}
        <label
          htmlFor={id}
          className={cn(
            'flex items-center p-3',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {/* Hidden input for form integration and accessibility */}
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="sr-only"
            checked={checked}
            onChange={onChange}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? undefined : titleId}
            aria-describedby={ariaDescribedBy ?? descriptionId}
            disabled={disabled}
            {...inputProps}
          />
          {/* Icon before content */}
          {Icon && (
            <div className="text-muted-foreground mr-4 h-[60px] w-[60px] flex-shrink-0">
              <Icon className="h-full w-full" />
            </div>
          )}

          {/* Content area */}
          <div className="mr-10 min-w-0 flex-1">
            <div id={titleId} className="text-foreground text-xs font-semibold">
              {title}
            </div>
            {subtitle && (
              <div
                id={descriptionId}
                className="text-foreground mt-1 text-xs dark:text-[#C6C6C6]"
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Price display */}
          {price && (
            <div className="text-foreground mr-6 text-xs font-bold">
              {price}
            </div>
          )}

          {/* Theme-compatible checkbox visual */}
          <div
            className="relative mr-6 h-7 w-7 flex-shrink-0"
            data-testid="checkbox-visual"
          >
            <div
              className={cn(
                'h-full w-full rounded-full border-2 border-[#AFAFAF]',
                'light:bg-background dark:bg-[#262626]',
                `${disabled && 'border-muted cursor-not-allowed opacity-50'}`
              )}
            >
              {checked && !disabled && (
                <div className="bg-primary m-1 h-4 w-4 rounded-full" />
              )}
            </div>
          </div>
        </label>
      </fieldset>
    );
  }
);
RichCheckbox.displayName = 'RichCheckbox';

export { RichCheckbox };
