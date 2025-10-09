import * as React from 'react';

import { useDialog } from '@/shared/hooks';

export interface UseDatePickerProps {
  value?: Date | undefined;
  onChange?: ((date: Date | undefined) => void) | undefined;
}

export function useDatePicker({ value, onChange }: UseDatePickerProps) {
  const { isOpen, close, onOpenChange } = useDialog();
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      onChange?.(selectedDate);
      close();
    },
    [close, onChange]
  );

  // Sync with external value changes
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return {
    isOpen,
    onOpenChange,
    date,
    handleDateSelect,
  };
}
