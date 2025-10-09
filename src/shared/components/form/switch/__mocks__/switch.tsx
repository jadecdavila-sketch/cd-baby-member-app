import * as React from 'react';

import type { SwitchProps } from '../switch';

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ id, checked, onCheckedChange, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        data-testid="mock-switch"
        {...props}
      >
        {children}
      </button>
    );
  }
);

Switch.displayName = 'MockSwitch';