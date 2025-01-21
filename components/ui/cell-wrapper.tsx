import { cn } from '@nextui-org/react';
import React from 'react';

const CellWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between gap-2 rounded-medium bg-default/50 p-4 backdrop-blur-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CellWrapper.displayName = 'CellWrapper';

export default CellWrapper;
