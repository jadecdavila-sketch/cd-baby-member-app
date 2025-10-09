'use client';

import * as React from 'react';

import { PopoverContent } from '@/shared/components/shadcn';
import { cn } from '@/shared/utils';

import { useMultiSelectContext } from '../../context';

export function MultiSelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const { instanceId } = useMultiSelectContext();
  return (
    <PopoverContent
      className={cn(
        'max-h-[300px] w-[var(--radix-popover-trigger-width)] overflow-y-auto bg-[var(--background)] p-1 shadow-none',
        className
      )}
      align="start"
      sideOffset={0}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      <div
        id={`multi-select-content-${instanceId}`}
        role="listbox"
        aria-multiselectable="true"
        aria-label="Select options"
      >
        {children}
      </div>
    </PopoverContent>
  );
}
