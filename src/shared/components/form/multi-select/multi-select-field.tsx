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

import { MultiSelect } from './multi-select';
import type { MultiSelectProps } from './types';

interface MultiSelectFieldPropsBase extends MultiSelectProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

interface MultiSelectFieldPropsWithTooltip extends MultiSelectFieldPropsBase {
  tooltip: string;
  tooltipId: string;
}

interface MultiSelectFieldPropsWithOutTooltip
  extends MultiSelectFieldPropsBase {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type MultiSelectFieldProps =
  | MultiSelectFieldPropsWithTooltip
  | MultiSelectFieldPropsWithOutTooltip;

const MultiSelectField = React.forwardRef<
  HTMLDivElement,
  MultiSelectFieldPropsWithTooltip | MultiSelectFieldPropsWithOutTooltip
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
      className,
      ...multiSelectProps
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
        <div ref={ref}>
          <MultiSelect
            {...multiSelectProps}
            className={cn(
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          />
        </div>

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
MultiSelectField.displayName = 'MultiSelectField';

export { MultiSelectField };
