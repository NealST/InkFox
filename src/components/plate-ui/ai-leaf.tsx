'use client';

import { cn, withRef } from '@udecode/cn';
import { PlateLeaf } from '@udecode/plate/react';

export const AILeaf = withRef<typeof PlateLeaf>(
  ({ children, className, ...props }, ref) => {
    return (
      <PlateLeaf
        ref={ref}
        className={cn(
          className,
          'transition-all duration-200 ease-in-out'
        )}
        {...props}
      >
        {children}
      </PlateLeaf>
    );
  }
);
