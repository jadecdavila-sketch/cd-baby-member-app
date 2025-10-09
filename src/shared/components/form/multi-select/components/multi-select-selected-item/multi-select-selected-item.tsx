'use client';

import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/utils';

import type { MultiSelectOption } from '../../types';

export function MultiSelectSelectedItem<T = unknown>({
  option,
  onRemove,
  className,
}: {
  option: MultiSelectOption<T>;
  onRemove: (value: string) => void;
  className?: string;
}) {
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(option.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onRemove(option.value);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex h-8 shrink-0 items-center rounded-full border-0 bg-[var(--primary)] px-2 py-1 text-sm leading-6 font-bold text-black',
        className
      )}
    >
      <span className="line-clamp-1">{option.label}</span>
      <button
        id={`multi-select-selected-item-${option.value}`}
        type="button"
        className="ml-2 inline-flex h-3 w-3 items-center justify-center rounded-sm p-0 transition-colors hover:bg-black/20 focus-visible:ring-1 focus-visible:ring-(--ring) focus-visible:outline-none"
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-label={`Remove ${option.label}`}
      >
        <XIcon className="h-3 w-3 stroke-2" />
      </button>
    </div>
  );
}
