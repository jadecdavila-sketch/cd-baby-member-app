'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { TextareaField, type TextareaFieldProps } from './textarea-field';

export interface RhfTextareaFieldPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    TextareaFieldProps,
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

interface RhfTextareaFieldPropsWithTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfTextareaFieldPropsBase<T, N> {
  tooltip: string;
  tooltipId: string;
}

interface RhfTextareaFieldPropsWithOutTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfTextareaFieldPropsBase<T, N> {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type RhfTextareaFieldProps<
  T extends FieldValues,
  N extends FieldPath<T>,
> =
  | RhfTextareaFieldPropsWithTooltip<T, N>
  | RhfTextareaFieldPropsWithOutTooltip<T, N>;

const RhfTextareaField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  errorMessage,
  ...textareaFieldProps
}: RhfTextareaFieldProps<TFieldValues, TName>) => {
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
    <TextareaField
      ref={ref}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      {...errorProps}
      {...textareaFieldProps}
    />
  );
};

RhfTextareaField.displayName = 'RhfTextareaField';

export { RhfTextareaField };
