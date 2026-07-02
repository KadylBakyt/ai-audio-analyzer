import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

interface MagicButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function MagicButton({ onClick, loading, disabled }: MagicButtonProps) {
  const { t } = useTranslation();
  const isDisabled = disabled || loading;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : { scale: 1.03 }}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        aria-busy={loading}
        className={cn(
          'group relative inline-flex h-16 min-w-[280px] items-center justify-center gap-3 overflow-hidden rounded-2xl px-10 text-lg font-bold text-white shadow-2xl transition-all',
          'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-300% animate-gradient-x',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40',
          isDisabled && 'cursor-not-allowed opacity-70',
        )}
      >
        {/* Glow halo */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 opacity-60 blur-xl animate-glow group-disabled:opacity-30"
        />
        <span className="relative flex items-center gap-3">
          {loading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <Sparkles className="size-6" />
          )}
          {loading ? t('magic.analyzing') : t('magic.analyze')}
        </span>
      </motion.button>
      <p className="max-w-md text-center text-xs text-muted-foreground">{t('magic.hint')}</p>
    </div>
  );
}
