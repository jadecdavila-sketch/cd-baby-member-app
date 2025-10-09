'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { SelectField, type SelectFieldProps } from './select-field';

interface RhfSelectFieldPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    SelectFieldProps,
    'value' | 'onChange' | 'error' | 'defaultValue' | 'tooltip' | 'tooltipId'
  > {
  name: TName;
  control: Control<TFieldValues>;
  shouldUnregister?: boolean;
  errorMessage?: string;
}

interface RhfSelectFieldPropsWithTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfSelectFieldPropsBase<T, N> {
  tooltip: string;
  tooltipId: string;
}

interface RhfSelectFieldPropsWithOutTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfSelectFieldPropsBase<T, N> {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type RhfSelectFieldProps<
  T extends FieldValues,
  N extends FieldPath<T>,
> =
  | RhfSelectFieldPropsWithTooltip<T, N>
  | RhfSelectFieldPropsWithOutTooltip<T, N>;

const RhfSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  errorMessage,
  ...selectFieldProps
}: RhfSelectFieldProps<TFieldValues, TName>) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    shouldUnregister,
  });

  // Handle error prop correctly for exact optional property types
  const errorProp = errorMessage ?? error?.message;
  const errorProps = errorProp ? { error: errorProp } : {};

  return (
    <SelectField
      ref={ref}
      value={value || ''}
      onChange={onChange}
      {...errorProps}
      {...selectFieldProps}
    />
  );
};

RhfSelectField.displayName = 'RhfSelectField';

export { RhfSelectField };
