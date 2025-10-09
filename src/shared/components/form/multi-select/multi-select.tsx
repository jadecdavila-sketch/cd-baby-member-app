'use client';

import {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectValue,
} from './components';
import type { MultiSelectProps } from './types';

export const MultiSelect = (props: MultiSelectProps) => {
  return (
    <MultiSelectRoot {...props}>
      <MultiSelectTrigger>
        <MultiSelectValue />
      </MultiSelectTrigger>
      <MultiSelectContent>
        {props.options.map((option) => (
          <MultiSelectItem key={option.value} value={option.value}>
            {option.label}
          </MultiSelectItem>
        ))}
      </MultiSelectContent>
    </MultiSelectRoot>
  );
};
