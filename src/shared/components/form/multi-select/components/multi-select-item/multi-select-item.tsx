'use client';

import { CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils';

import { useMultiSelectContext } from '../../context';

export function MultiSelectItem({
  className,
  children,
  value,
  disabled: itemDisabled = false,
  ...props
}: React.ComponentProps<'button'> & {
  value: string;
  disabled?: boolean;
}) {
  const {
    toggleValue,
    hasValue,
    canAddMore,
    disabled: selectDisabled,
  } = useMultiSelectContext();
  const isSelected = hasValue(value);
  const isDisabled =
    selectDisabled ?? itemDisabled ?? (!canAddMore && !isSelected);

  const onClick = () => {
    return !isDisabled && toggleValue(value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleValue(value);
    }
  };

  return (
    <button
      data-slot="multi-select-item"
      id={`multi-select-item-${value}`}
      role="option"
      aria-selected={isSelected}
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-lg py-2 pr-8 pl-3 text-sm text-(--form-text) transition-colors outline-none select-none hover:bg-(--form-background-hover) focus:bg-(--form-background-focus) data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        isDisabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={onClick}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={onKeyDown}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
      <span className="line-clamp-1">{children}</span>
    </button>
  );
}
