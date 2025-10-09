'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { TextField, type TextFieldProps } from './text-field';

export interface RhfTextFieldPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    TextFieldProps,
    | 'value'
    | 'onChange'
    | 'error'
    | 'name'
    | 'defaultValue'
    | 'tooltip'
    | 'tooltipId'
  > {
  name: TName;
  control: Control<TFieldValues>;
  shouldUnregister?: boolean;
  errorMessage?: string;
}

interface RhfTextFieldPropsWithTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfTextFieldPropsBase<T, N> {
  tooltip: string;
  tooltipId: string;
}

interface RhfTextFieldPropsWithOutTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfTextFieldPropsBase<T, N> {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type RhfTextFieldProps<T extends FieldValues, N extends FieldPath<T>> =
  | RhfTextFieldPropsWithTooltip<T, N>
  | RhfTextFieldPropsWithOutTooltip<T, N>;

const RhfTextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  errorMessage,
  ...textFieldProps
}: RhfTextFieldProps<TFieldValues, TName>) => {
  const {
    field: { onChange, onBlur, value, ref },
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
    <TextField
      ref={ref}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      {...errorProps}
      {...textFieldProps}
    />
  );
};

RhfTextField.displayName = 'RhfTextField';

export { RhfTextField };
