import * as React from 'react';

import { cn } from '@/shared/utils/index';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'bg-form-background flex h-[55px] w-full rounded-lg p-3 text-sm text-(--form-text) transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--form-text) hover:bg-(--form-background-hover) focus:bg-(--form-background-focus) focus-visible:ring-1 focus-visible:ring-(--ring) focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-(--form-background-disabled) disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
