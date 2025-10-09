'use client';

import { Button } from '@/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateAfter, DateBefore } from 'react-day-picker';

export interface DatePickerProps {
  popoverDisabled?: boolean;
  disabled?: Date[] | DateBefore | DateAfter;
  onSelect?: (date: Date | undefined) => void;
  selected?: Date;
  buttonClassName?: string;
  calendarClassName?: string;
}

function DatePicker(props: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>();

  const {
    popoverDisabled,
    disabled,
    onSelect,
    selected,
    buttonClassName,
    calendarClassName,
  } = props;

  React.useEffect(() => {
    if (selected) {
      setDate(selected);
    }
  }, [selected]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (onSelect) {
      onSelect(selectedDate);
    }
    setDate(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled={popoverDisabled}>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            buttonClassName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          autoFocus
          disabled={disabled}
          className={calendarClassName}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
