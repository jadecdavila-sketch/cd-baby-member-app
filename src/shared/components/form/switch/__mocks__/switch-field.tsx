import * as React from 'react';

import type { SwitchFieldProps } from '../switch-field';

export const SwitchField = React.forwardRef<HTMLButtonElement, SwitchFieldProps>(
  (
    {
      id,
      checked,
      onCheckedChange,
      label,
      description,
      error,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div data-testid="mock-switch-field">
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onCheckedChange?.(!checked)}
          data-testid="mock-switch-field-switch"
          {...props}
        >
          {children}
        </button>
        <label htmlFor={id}>{label}</label>
        {description && <p>{description}</p>}
        {errorMessage && <p role="alert">{errorMessage}</p>}
      </div>
    );
  }
);

SwitchField.displayName = 'MockSwitchField';