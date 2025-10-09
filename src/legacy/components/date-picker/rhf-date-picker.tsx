'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { DatePicker, type DatePickerProps } from './date-picker';

export interface RhfDatePickerPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<DatePickerProps, 'selected' | 'onSelect'> {
  name: TName;
  control: Control<TFieldValues>;
  shouldUnregister?: boolean;
}

export type RhfDatePickerProps<T extends FieldValues, N extends FieldPath<T>> =
  RhfDatePickerPropsBase<T, N>;

const RhfDatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  ...datePickerProps
}: RhfDatePickerProps<TFieldValues, TName>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    shouldUnregister,
  });

  return (
    <DatePicker
      selected={value}
      onSelect={onChange}
      {...datePickerProps}
    />
  );
};

RhfDatePicker.displayName = 'RhfDatePicker';

export { RhfDatePicker };