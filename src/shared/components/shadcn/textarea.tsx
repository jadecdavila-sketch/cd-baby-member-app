import * as React from 'react';

import { cn } from '@/shared/utils/index';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full resize-none rounded-lg bg-(--form-background) p-3 text-sm text-(--form-text) transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--form-text) hover:bg-(--form-background-hover) focus:bg-(--form-background-focus) focus-visible:ring-1 focus-visible:ring-(--ring) focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-(--form-background-disabled) disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
