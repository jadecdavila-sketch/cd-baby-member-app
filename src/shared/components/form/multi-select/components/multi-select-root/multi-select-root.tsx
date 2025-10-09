'use client';

import * as React from 'react';

import { Popover } from '@/shared/components/shadcn';
import { cn } from '@/shared/utils';

import {
  MultiSelectContext,
  type MultiSelectContextValue,
} from '../../context';
import type { MultiSelectProps, UseMultiSelectOptions } from '../../types';
import { useMultiSelect } from '../../use-multi-select';

export function MultiSelectRoot<T = unknown>({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  maxSelections,
  children,
  ...props
}: MultiSelectProps<T> & { children: React.ReactNode }) {
  const instanceId = React.useId();

  const hookOptions: UseMultiSelectOptions<T> = {
    options,
    value,
    ...(onChange !== undefined ? { onChange } : {}),
    ...(maxSelections !== undefined ? { maxSelections } : {}),
  };

  const multiSelectHook = useMultiSelect<T>(hookOptions);

  // Sync external value changes
  React.useEffect(() => {
    if (
      value !== undefined &&
      JSON.stringify(value) !== JSON.stringify(multiSelectHook.value)
    ) {
      // External value change - this would need to be handled by updating the hook
      // For now, we'll let the hook manage its own state
    }
  }, [value, multiSelectHook.value]);

  const contextValue: MultiSelectContextValue<T> = {
    options,
    disabled,
    instanceId,
    ...multiSelectHook,
    ...(placeholder !== undefined ? { placeholder } : {}),
  };

  return (
    <MultiSelectContext.Provider value={contextValue}>
      <Popover
        open={multiSelectHook.isOpen}
        onOpenChange={multiSelectHook.setIsOpen}
      >
        <div className={cn('relative', className)} {...props}>
          {children}
        </div>
      </Popover>
    </MultiSelectContext.Provider>
  );
}
