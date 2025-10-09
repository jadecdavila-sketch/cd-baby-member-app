import * as React from 'react';
import { DayPicker } from 'react-day-picker';

export interface CalendarProps {
  mode?: 'single';
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
}: CalendarProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    undefined
  );

  const currentDate = selected ?? internalDate;
  const currentOnSelect = onSelect ?? setInternalDate;

  const dayPickerProps = {
    mode: mode as 'single',
    selected: currentDate,
    onSelect: currentOnSelect,
    showOutsideDays: true,
    ...(className && { className }),
  };

  return (
    <DayPicker
      {...dayPickerProps}
      classNames={{
        months: 'flex flex-col space-y-4',
        month: 'flex flex-col',
        caption: 'flex justify-center pt-1 items-center mb-4',
        caption_label: 'text-sm font-medium text-white',
        nav: 'flex justify-center space-x-4 mt-4 order-last',
        nav_button:
          'h-8 w-8 bg-gray-700 hover:bg-gray-600 p-0 text-white rounded-md',
        nav_button_previous: '',
        nav_button_next: '',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-gray-400 rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-outside)]:bg-gray-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: 'h-9 w-9 p-0 font-normal text-white hover:bg-gray-600 rounded-md cursor-pointer',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
        day_today: 'bg-gray-700 text-white',
        day_outside: 'text-gray-500 opacity-50',
        day_disabled: 'text-gray-500 opacity-50',
        day_hidden: 'invisible',
      }}
    />
  );
}
