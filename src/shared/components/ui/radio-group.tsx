'use client';

import * as React from 'react';

import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from '@/shared/components/shadcn/radio-group';
import { cn } from '@/shared/utils';

const RadioGroup = ShadcnRadioGroup;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof ShadcnRadioGroupItem>,
  React.ComponentPropsWithoutRef<typeof ShadcnRadioGroupItem>
>(({ className, ...props }, ref) => (
  <ShadcnRadioGroupItem
    ref={ref}
    className={cn(
      'border-primary text-primary',
      'focus:ring-primary focus:ring-2 focus:ring-offset-2',
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      'hover:border-primary/80 hover:bg-primary/5',
      'disabled:border-muted-foreground/30 disabled:data-[state=checked]:bg-muted-foreground/30',
      'aspect-square h-4 w-4 rounded-full',
      'transition-colors duration-200',
      className
    )}
    {...props}
  />
));
RadioGroupItem.displayName = ShadcnRadioGroupItem.displayName;

export { RadioGroup, RadioGroupItem };
