import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function EmptyState() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
    >
      <span className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-pink-500/15 text-primary">
        <Sparkles className="size-8" />
        <span className="absolute -inset-2 rounded-2xl bg-primary/10 blur-lg" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold">{t('empty.title')}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t('empty.subtitle')}</p>
    </motion.div>
  );
}
