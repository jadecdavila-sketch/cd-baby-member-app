'use client';

import * as React from 'react';

import { cn } from '@/shared/utils';

import { useMultiSelectContext } from '../../context';
import { MultiSelectSelectedItem } from '../multi-select-selected-item';

import { useMultiSelectValue } from './use-multi-select-value';

export function MultiSelectValue({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { selectedOptions, placeholder, removeValue, contentRef } =
    useMultiSelectValue();
  const { instanceId } = useMultiSelectContext();

  return (
    <div
      ref={contentRef}
      className="scrollbar-hidden flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
    >
      {selectedOptions.length === 0 && (
        <span
          data-slot="multi-select-placeholder"
          className={cn('flex-1 text-(--form-text) opacity-50', className)}
          {...props}
        >
          {placeholder ?? 'Select options'}
        </span>
      )}
      {selectedOptions.length > 0 && (
        <div
          id={`multi-select-selected-items-${instanceId}`}
          data-testid="multi-select-selected-items"
          data-slot="multi-select-value"
          className={cn(className, 'flex gap-2')}
          {...props}
        >
          {selectedOptions.map((option) => (
            <MultiSelectSelectedItem
              key={option.value}
              option={option}
              onRemove={removeValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}
