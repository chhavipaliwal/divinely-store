import { Skeleton as NextSkeleton, cn } from '@nextui-org/react';

export default function Skeleton({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <NextSkeleton className={cn('rounded-md before:!duration-1000', className)}>
      {children}
    </NextSkeleton>
  );
}
