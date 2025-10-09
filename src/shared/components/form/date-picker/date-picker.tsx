'use client';

import * as React from 'react';
import { format } from 'date-fns';

import { cn } from '@/shared/utils';

import {
  Button,
  Calendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../../shadcn';

import { useDatePicker } from './use-date-picker';

export interface DatePickerProps {
  id?: string | undefined;
  value?: Date | undefined;
  onChange?: ((date: Date | undefined) => void) | undefined;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select a date',
  className,
  disabled = false,
}: DatePickerProps) {
  const { isOpen, onOpenChange, date, handleDateSelect } = useDatePicker({
    value,
    onChange,
  });

  const localId = React.useId();

  return (
    <div className={cn('relative', className)}>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id ?? localId}
            data-empty={!date || isNaN(date.getTime())}
            disabled={disabled}
            className="data-[empty=true]:text-muted-foreground bg-picker-background hover:bg-accent/50 flex h-[50px] w-[354px] items-center justify-between rounded-lg border-0 p-4 text-left font-normal"
          >
            {date && !isNaN(date.getTime()) ? (
              format(date, 'MM/dd/yyyy')
            ) : (
              <span> {placeholder} </span>
            )}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.619 10.7301H4.38136V19.6188H19.619V10.7301Z"
                fill="white"
              />
              <path
                d="M16.2344 6.07417V4.3811H14.9646V6.07417H9.03727V4.3811H7.76749V6.07417H4.38135V9.46032H19.619V6.07417H16.2344Z"
                fill="white"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-popover border-border w-full p-4">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
