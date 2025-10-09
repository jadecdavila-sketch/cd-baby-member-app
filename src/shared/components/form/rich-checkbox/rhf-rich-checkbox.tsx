'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { RichCheckbox, type RichCheckboxProps } from './rich-checkbox';

export interface RhfRichCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<RichCheckboxProps, 'checked' | 'onChange'> {
  name: TName;
  control: Control<TFieldValues>;
  shouldUnregister?: boolean;
}

const RhfRichCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  shouldUnregister = false,
  ...richCheckboxProps
}: RhfRichCheckboxProps<TFieldValues, TName>) => {
  const {
    field: { onChange, value, ref },
  } = useController({
    name,
    control,
    shouldUnregister,
  });

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange]
  );

  return (
    <RichCheckbox
      ref={ref}
      checked={Boolean(value)}
      onChange={handleChange}
      {...richCheckboxProps}
    />
  );
};

RhfRichCheckbox.displayName = 'RhfRichCheckbox';

export { RhfRichCheckbox };
