'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { PopoverTrigger, PopoverAnchor } from '@/shared/components/shadcn';
import { cn } from '@/shared/utils';

import { useMultiSelectTrigger } from './use-multi-select-trigger';

export function MultiSelectTrigger({
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { disabled, isOpen, handleKeyDown, instanceId } =
    useMultiSelectTrigger();

  return (
    <PopoverAnchor>
      <div
        {...{
          className: cn(
            'flex h-[55px] w-full items-center justify-between gap-2 rounded-lg bg-form-background p-3 text-sm text-(--form-text) transition-colors hover:bg-(--form-background-hover) focus:bg-(--form-background-focus) focus-visible:ring-1 focus-visible:ring-(--ring) focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-(--form-background-disabled) disabled:opacity-50 placeholder:text-(--form-text)',
            props.className
          ),
          ...props,
        }}
      >
        <div className="flex w-full">
          {children}

          <PopoverTrigger asChild>
            <button
              disabled={disabled}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={`multi-select-content-${instanceId}`}
              aria-describedby={`multi-select-selected-items-${instanceId}`}
              role="combobox"
              onKeyDown={handleKeyDown}
              className="ml-2 shrink-0"
            >
              <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
        </div>
      </div>
    </PopoverAnchor>
  );
}
