import { cn } from '@/utils/cn';

/** Shimmering skeleton placeholder used for loading states. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-muted/60',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
