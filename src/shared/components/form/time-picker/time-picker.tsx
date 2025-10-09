'use client';

import * as React from 'react';
import { format } from 'date-fns';

import { cn } from '@/shared/utils';

import { Button, Popover, PopoverContent, PopoverTrigger } from '../../shadcn';

import { useTimePicker } from './use-time-picker';

export interface TimePickerProps {
  id?: string | undefined;
  value?: Date | undefined;
  onChange?: ((time: Date | undefined) => void) | undefined;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TimePicker({
  id,
  value,
  onChange,
  placeholder = '12:00 AM',
  className,
}: TimePickerProps) {
  const { time, hours, minutes, period, setHours, setMinutes, setPeriod } =
    useTimePicker({ value, onChange });

  const localId = React.useId();

  return (
    <div className={cn('relative', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id ?? localId}
            data-empty={!time || isNaN(time.getTime())}
            className="data-[empty=true]:text-muted-foreground bg-picker-background hover:bg-accent/50 flex h-[50px] w-[354px] items-center justify-between rounded-lg border-0 p-4 text-left font-normal"
          >
            {time && !isNaN(time.getTime()) ? (
              format(time, 'hh:mm a')
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
                d="M12 6V12L16 14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-popover border-border w-full p-4">
          <div className="flex flex-col space-y-4">
            <div className="text-popover-foreground mb-4 text-center text-sm font-medium">
              Select Time
            </div>

            <div className="flex items-center justify-center space-x-2">
              {/* Hours */}
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="bg-muted text-foreground focus:ring-primary rounded-md px-3 py-2 text-center focus:ring-2"
                aria-label="Select hours"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>

              <span className="text-popover-foreground font-bold">:</span>

              {/* Minutes */}
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="bg-muted text-foreground focus:ring-primary rounded-md px-3 py-2 text-center focus:ring-2"
                aria-label="Select minutes"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                  <option
                    key={minute}
                    value={minute.toString().padStart(2, '0')}
                  >
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>

              {/* AM/PM */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'AM' | 'PM')}
                className="bg-muted text-foreground focus:ring-primary rounded-md px-3 py-2 text-center focus:ring-2"
                aria-label="Select AM or PM"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <div className="text-muted-foreground mt-2 text-center text-xs">
              Selected: {time ? format(time, 'hh:mm a') : 'None'}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
