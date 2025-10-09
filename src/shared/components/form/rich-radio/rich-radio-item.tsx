'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/shared/utils/index';

interface RichRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  children: React.ReactNode;
}

const RichRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RichRadioItemProps
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      // Base styles - rectangular container
      'group border-muted-foreground/20 bg-background relative block w-full rounded-lg border-2 px-12 py-18',
      // Focus state
      'focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:outline-none',
      // Checked state - border color changes
      'data-[state=checked]:border-[var(--primary)]',
      // Disabled state
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Transitions
      'transition-all duration-200',
      className
    )}
    {...props}
  >
    {children}

    <div
      className={cn(
        'border-muted-foreground/40 bg-background absolute right-3 bottom-3 flex h-5 w-5 items-center justify-center rounded-full border-2',
        'group-data-[state=checked]:border-[var(--primary)]',
        'transition-colors duration-200'
      )}
    >
      <RadioGroupPrimitive.Indicator asChild>
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
      </RadioGroupPrimitive.Indicator>
    </div>
  </RadioGroupPrimitive.Item>
));
RichRadioItem.displayName = 'RichRadioItem';

export { RichRadioItem };
