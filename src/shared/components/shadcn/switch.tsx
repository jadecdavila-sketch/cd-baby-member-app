'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/shared/utils/index';

export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    'name'
  > {
  id?: string;
  name?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, id, name, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Base track styling
      'switch-root peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
      'focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      // Disabled state
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Track background states using CSS custom properties
      'bg-switch-track',
      'disabled:bg-switch-track-disabled',
      // Focus ring color
      'focus-visible:ring-[color:var(--switch-focus-ring)]',
      className
    )}
    id={id}
    name={name}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // Base thumb styling
        'pointer-events-none block h-5 w-5 rounded-full shadow-[color:var(--switch-thumb-shadow)] transition-transform',
        // Thumb background using CSS custom properties
        'bg-switch-thumb disabled:bg-switch-thumb-disabled',
        // Position transitions
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
