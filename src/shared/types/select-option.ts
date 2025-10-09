export type SelectOption<T = unknown> = {
  label: string;
  value: string;
  subLabel?: string;
  className?: string;
  disabled?: boolean;
  meta?: T;
};
