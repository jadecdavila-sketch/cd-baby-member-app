import * as React from 'react';

export interface UseTimePickerProps {
  value?: Date | undefined;
  onChange?: ((time: Date | undefined) => void) | undefined;
}

export function useTimePicker({ value, onChange }: UseTimePickerProps) {
  const [time, setTime] = React.useState<Date | undefined>(value);
  const [hours, setHours] = React.useState<string>('12');
  const [minutes, setMinutes] = React.useState<string>('00');
  const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');
  const [initialized, setInitialized] = React.useState<boolean>(false);

  const handleTimeSelect = React.useCallback(
    (selectedTime: Date | undefined) => {
      setTime(selectedTime);
      onChange?.(selectedTime);
    },
    [onChange]
  );

  // Sync with external value changes
  React.useEffect(() => {
    setTime(value);
    if (value) {
      const hours24 = value.getHours();
      const minutes = value.getMinutes();
      const isPM = hours24 >= 12;
      const hours12 = hours24 % 12 || 12;

      setHours(hours12.toString().padStart(2, '0'));
      setMinutes(minutes.toString().padStart(2, '0'));
      setPeriod(isPM ? 'PM' : 'AM');
    }
    setInitialized(true);
  }, [value]);

  const handleHoursChange = React.useCallback(
    (newHours: string) => {
      setHours(newHours);

      // Only update time if we have been initialized and have values
      if (initialized) {
        const hours24 =
          period === 'PM' && parseInt(newHours) !== 12
            ? parseInt(newHours) + 12
            : period === 'AM' && parseInt(newHours) === 12
              ? 0
              : parseInt(newHours);

        const newTime = new Date();
        newTime.setHours(hours24, parseInt(minutes), 0, 0);
        setTime(newTime);
        onChange?.(newTime);
      }
    },
    [period, minutes, onChange, initialized]
  );

  const handleMinutesChange = React.useCallback(
    (newMinutes: string) => {
      setMinutes(newMinutes);

      if (initialized) {
        const hours24 =
          period === 'PM' && parseInt(hours) !== 12
            ? parseInt(hours) + 12
            : period === 'AM' && parseInt(hours) === 12
              ? 0
              : parseInt(hours);

        const newTime = new Date();
        newTime.setHours(hours24, parseInt(newMinutes), 0, 0);
        setTime(newTime);
        onChange?.(newTime);
      }
    },
    [hours, period, onChange, initialized]
  );

  const handlePeriodChange = React.useCallback(
    (newPeriod: 'AM' | 'PM') => {
      setPeriod(newPeriod);

      if (initialized) {
        const hours24 =
          newPeriod === 'PM' && parseInt(hours) !== 12
            ? parseInt(hours) + 12
            : newPeriod === 'AM' && parseInt(hours) === 12
              ? 0
              : parseInt(hours);

        const newTime = new Date();
        newTime.setHours(hours24, parseInt(minutes), 0, 0);
        setTime(newTime);
        onChange?.(newTime);
      }
    },
    [hours, minutes, onChange, initialized]
  );

  return {
    time,
    hours,
    minutes,
    period,
    setHours: handleHoursChange,
    setMinutes: handleMinutesChange,
    setPeriod: handlePeriodChange,
    handleTimeSelect,
  };
}
