import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';
import { Show } from './Utilities';

type Props = {
  className?: string;
  isTexture?: boolean;
} & ButtonProps;

export const ButtonSkew = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, className, isTexture = false, ...props }, ref) => {
    return (
      <Button className={cn('skew-button relative px-6 py-4 bg-transparent', className)} {...props} ref={ref}>
        <div className="absolute bg-primary rounded-md -skew-x-12 z-[-2] inset-0" />
        <div className="absolute bg-primary/70 shadow-inset rounded-md inset-[.0625rem] -skew-x-12 z-[-2]" />
        <Show when={isTexture}>
          <div className="bg-header-texture bg-repeat bg-left-top bg-auto absolute z-[-1] inset-0 -skew-x-12 opacity-40" />
        </Show>
        <div>{children}</div>
      </Button>
    );
  }
);
