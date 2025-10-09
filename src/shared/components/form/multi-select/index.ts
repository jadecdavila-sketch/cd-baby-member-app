// Main component
export { MultiSelect } from './multi-select';
export { MultiSelectField } from './multi-select-field';
export {
  RhfMultiSelectField,
  type RhfMultiSelectFieldProps,
} from './rhf-multi-select-field';

// Individual components
export {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectValue,
  MultiSelectSelectedItem,
} from './components';

// Hooks
export { useMultiSelect } from './use-multi-select';

// Types
export type { MultiSelectProps, MultiSelectOption } from './types';

// Context (for advanced usage)
export { useMultiSelectContext, type MultiSelectContextValue } from './context';
