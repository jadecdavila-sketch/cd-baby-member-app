'use client';

import * as React from 'react';

import type { MultiSelectOption } from '../types';

export interface MultiSelectContextValue<T = unknown> {
  options: MultiSelectOption<T>[];
  value: string[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleValue: (value: string) => void;
  removeValue: (value: string) => void;
  hasValue: (value: string) => boolean;
  canAddMore: boolean;
  selectedOptions: MultiSelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  instanceId: string;
}

export const MultiSelectContext =
  React.createContext<MultiSelectContextValue | null>(null);

export const useMultiSelectContext = <T = unknown,>() => {
  const context = React.useContext(
    MultiSelectContext
  ) as MultiSelectContextValue<T> | null;
  if (!context) {
    throw new Error('MultiSelect components must be used within a MultiSelect');
  }
  return context;
};
