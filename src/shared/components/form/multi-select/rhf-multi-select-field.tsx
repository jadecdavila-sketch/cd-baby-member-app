'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import {
  MultiSelectField,
  type MultiSelectFieldProps,
} from './multi-select-field';

export interface RhfMultiSelectFieldPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    MultiSelectFieldProps,
    'value' | 'onChange' | 'error' | 'tooltip' | 'tooltipId'
  > {
  name: TName;
  control: Control<TFieldValues>;
  shouldUnregister?: boolean;
  errorMessage?: string;
}

interface RhfMultiSelectFieldPropsWithTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfMultiSelectFieldPropsBase<T, N> {
  tooltip: string;
  tooltipId: string;
}

interface RhfMultiSelectFieldPropsWithOutTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfMultiSelectFieldPropsBase<T, N> {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type RhfMultiSelectFieldProps<
  T extends FieldValues,
  N extends FieldPath<T>,
> =
  | RhfMultiSelectFieldPropsWithTooltip<T, N>
  | RhfMultiSelectFieldPropsWithOutTooltip<T, N>;

const RhfMultiSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  errorMessage,
  ...multiSelectFieldProps
}: RhfMultiSelectFieldProps<TFieldValues, TName>) => {
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
    <MultiSelectField
      ref={ref}
      value={value || []}
      onChange={onChange}
      {...errorProps}
      {...multiSelectFieldProps}
    />
  );
};

RhfMultiSelectField.displayName = 'RhfMultiSelectField';

export { RhfMultiSelectField };
