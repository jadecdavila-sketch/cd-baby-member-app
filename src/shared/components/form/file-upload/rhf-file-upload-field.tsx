'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import {
  FileUploadField,
  type FileUploadFieldProps,
} from './file-upload-field';

export interface RhfFileUploadFieldPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
    FileUploadFieldProps,
    'FileUploadProps' | 'error' | 'tooltip' | 'tooltipId'
  > {
  name: TName;
  control: Control<TFieldValues>;
  shouldUnregister?: boolean;
  FileUploadProps: Omit<
    FileUploadFieldProps['FileUploadProps'],
    'files' | 'onChange'
  >;
  errorMessage?: string;
}

interface RhfFileUploadFieldPropsWithTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfFileUploadFieldPropsBase<T, N> {
  tooltip: string;
  tooltipId: string;
}

interface RhfFileUploadFieldPropsWithOutTooltip<
  T extends FieldValues,
  N extends FieldPath<T>,
> extends RhfFileUploadFieldPropsBase<T, N> {
  tooltip?: undefined;
  tooltipId?: undefined;
}

export type RhfFileUploadFieldProps<
  T extends FieldValues,
  N extends FieldPath<T>,
> =
  | RhfFileUploadFieldPropsWithTooltip<T, N>
  | RhfFileUploadFieldPropsWithOutTooltip<T, N>;

const RhfFileUploadField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  errorMessage,
  FileUploadProps,
  ...fileUploadFieldProps
}: RhfFileUploadFieldProps<TFieldValues, TName>) => {
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
    <FileUploadField
      ref={ref}
      FileUploadProps={{
        ...FileUploadProps,
        files: value || [],
        onChange,
      }}
      {...errorProps}
      {...fileUploadFieldProps}
    />
  );
};

RhfFileUploadField.displayName = 'RhfFileUploadField';

export { RhfFileUploadField };
