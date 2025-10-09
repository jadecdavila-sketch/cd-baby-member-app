'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

import { UseMultiSelectOptions } from './types';

export const useMultiSelect = <T = unknown>({
  value,
  onChange,
  maxSelections,
  options,
}: UseMultiSelectOptions<T>) => {
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [isOpen, setIsOpen] = useState(false);

  const toggleValue = useCallback(
    (toggledValue: string) => {
      const updatedValues = localValue.includes(toggledValue)
        ? localValue.filter((v) => v !== toggledValue)
        : maxSelections !== undefined &&
            maxSelections !== null &&
            localValue.length >= maxSelections
          ? localValue
          : [...localValue, toggledValue];

      setLocalValue(updatedValues);
      onChange?.(updatedValues);
    },
    [localValue, maxSelections, onChange]
  );

  const addValue = useCallback(
    (addedValue: string) => {
      if (
        !localValue.includes(addedValue) &&
        (maxSelections === undefined ||
          maxSelections === null ||
          localValue.length < maxSelections)
      ) {
        const newValues = [...localValue, addedValue];
        setLocalValue(newValues);
        onChange?.(newValues);
      }
    },
    [localValue, maxSelections, onChange]
  );

  const removeValue = useCallback(
    (removedValue: string) => {
      const newValues = localValue.filter((v) => v !== removedValue);
      setLocalValue(newValues);
      onChange?.(newValues);
    },
    [localValue, onChange]
  );

  const clearAll = useCallback(() => {
    setLocalValue([]);
    onChange?.([]);
  }, [onChange]);

  const hasValue = useCallback(
    (currentValue: string) => localValue.includes(currentValue),
    [localValue]
  );

  const canAddMore = useMemo(
    () =>
      maxSelections === undefined ||
      maxSelections === null ||
      localValue.length < maxSelections,
    [maxSelections, localValue.length]
  );

  const selectedOptions = useMemo(
    () => options.filter((option) => localValue.includes(option.value)),
    [options, localValue]
  );

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return {
    value: localValue,
    isOpen,
    setIsOpen,
    toggleValue,
    addValue,
    removeValue,
    clearAll,
    hasValue,
    canAddMore,
    selectedOptions,
  };
};
