import { Skeleton } from '@/components/ui/skeleton';
import { OUTPUT_LANGUAGES } from '@/utils/constants';

/** Skeleton grid shown while summaries are being generated. */
export function LoadingSummaries() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {OUTPUT_LANGUAGES.map((lang) => (
        <div key={lang.code} className="glass space-y-4 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <div className="flex gap-2">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[92%]" />
            <Skeleton className="h-3 w-[97%]" />
            <Skeleton className="h-3 w-[80%]" />
            <Skeleton className="h-3 w-[88%]" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      ))}
    </div>
  );
}
