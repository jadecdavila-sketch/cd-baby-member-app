'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { TimePicker, type TimePickerProps } from './time-picker';

export interface RhfTimePickerPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<TimePickerProps, 'value' | 'onChange'> {
  name: TName;
  control: Control<TFieldValues>;
  shouldUnregister?: boolean;
}

export type RhfTimePickerProps<
  T extends FieldValues,
  N extends FieldPath<T>,
> = RhfTimePickerPropsBase<T, N>;

const RhfTimePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  ...timePickerProps
}: RhfTimePickerProps<TFieldValues, TName>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    shouldUnregister,
  });

  return <TimePicker value={value} onChange={onChange} {...timePickerProps} />;
};

RhfTimePicker.displayName = 'RhfTimePicker';

export { RhfTimePicker };
