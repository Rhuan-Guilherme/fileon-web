import { Skeleton } from '../ui/skeleton';

export function TeamSwitcherSkeleton() {
  return (
    <div className="flex items-center gap-2 mt-2 px-2">
      <Skeleton className="h-8 w-8 rounded-md" />
      <div className="space-y-1">
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="h-2 w-10 rounded-md" />
      </div>
    </div>
  );
}
