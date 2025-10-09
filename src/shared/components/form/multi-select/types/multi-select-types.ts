import type { SelectOption } from '@/shared/types';

export type MultiSelectOption<T = unknown> = SelectOption<T>;

export interface MultiSelectProps<T = unknown> {
  options: MultiSelectOption<T>[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxSelections?: number;
}

export interface UseMultiSelectOptions<T = unknown> {
  value: string[];
  options: MultiSelectOption<T>[];
  onChange?: (value: string[]) => void;
  maxSelections?: number;
}
