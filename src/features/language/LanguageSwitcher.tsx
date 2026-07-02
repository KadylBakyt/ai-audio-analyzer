import * as React from 'react';
import { Check, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import type { LanguageCode } from '@/types';

interface Option {
  code: LanguageCode;
  label: string;
  flag: string;
}

const OPTIONS: Option[] = [
  { code: 'kk', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.code === i18n.resolvedLanguage) ?? OPTIONS[0]!;

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (code: LanguageCode) => {
    void i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('nav.language')}
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{current.flag}</span>
        <span className="hidden md:inline">{current.label}</span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="glass-strong absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl p-1"
          >
            {OPTIONS.map((option) => {
              const active = option.code === current.code;
              return (
                <li key={option.code} role="none">
                  <button
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => select(option.code)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                      active ? 'bg-primary/15 text-primary' : 'hover:bg-accent',
                    )}
                  >
                    <span className="text-base">{option.flag}</span>
                    <span className="flex-1 text-left">{option.label}</span>
                    {active && <Check className="size-4" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
