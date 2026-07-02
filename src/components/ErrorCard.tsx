import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { errorTranslationKey, type AppError } from '@/utils/errors';

interface ErrorCardProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorCard({ error, onRetry, onDismiss }: ErrorCardProps) {
  const { t } = useTranslation();
  const message = t(errorTranslationKey(error.code));

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="glass-strong overflow-hidden rounded-xl border-destructive/40"
    >
      <div className="flex items-start gap-4 p-5">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-destructive">{t('errors.title')}</h3>
          <p className="mt-1 text-sm text-foreground/90">{message}</p>
          {error.detail && (
            <p className="mt-2 break-words rounded-md bg-muted/60 p-2 font-mono text-[11px] text-muted-foreground">
              {error.detail}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && (
              <Button size="sm" variant="destructive" onClick={onRetry}>
                <RefreshCw className="size-4" />
                {t('errors.retry')}
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                {t('errors.dismiss')}
              </Button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label={t('errors.dismiss')}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
