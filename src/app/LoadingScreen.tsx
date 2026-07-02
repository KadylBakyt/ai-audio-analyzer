import { Loader2 } from 'lucide-react';

/** Full-screen fallback shown while i18n resources / lazy chunks load. */
export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}
