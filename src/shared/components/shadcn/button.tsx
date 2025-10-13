import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/utils/index';

const buttonVariants = cva(
  'flex items-center w-full justify-center gap-2 whitespace-nowrap text-sm font-bold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-[3px] cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        navigation:
          'after:ml-4 after:inline-block after:h-2 after:border-t-[4px] after:border-t-transparent after:border-b-[4px] after:border-b-transparent after:border-l-[8px] after:border-l-black bg-background text-foreground border border-border hover:bg-accent/10 dark:hover:bg-accent/20',
        muted: 'bg-gray-400 text-foreground hover:bg-gray-500',
      },
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-3',
        md: 'h-12 px-4 py-2 [&_svg]:size-4',
        lg: 'h-14 px-8 [&_svg]:size-4',
        icon: 'h-9 w-9 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
