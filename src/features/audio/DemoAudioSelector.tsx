import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { DemoScenario } from '@/types';
import { DEMO_SCENARIOS } from '@/utils/constants';
import { cn } from '@/utils/cn';

interface DemoAudioSelectorProps {
  onSelect: (scenario: DemoScenario) => void;
  selected?: DemoScenario;
  disabled?: boolean;
}

/**
 * Horizontal card row letting the user pick a built-in demo audio scenario.
 * Selecting one instantly creates a fake AudioFileMeta so the rest of the
 * pipeline works identically to a real uploaded file.
 */
export function DemoAudioSelector({ onSelect, selected, disabled }: DemoAudioSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {t('demo.orTryDemo')}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {DEMO_SCENARIOS.map((scenario, i) => {
          const isSelected = selected === scenario.id;
          return (
            <motion.button
              key={scenario.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(scenario.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={disabled ? undefined : { scale: 1.03 }}
              whileTap={disabled ? undefined : { scale: 0.97 }}
              className={cn(
                'group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4',
                isSelected
                  ? 'border-primary/60 bg-primary/10 text-primary shadow-sm'
                  : 'border-border bg-card/60 text-foreground hover:border-primary/30 hover:bg-accent/50',
                disabled && 'cursor-not-allowed opacity-50',
              )}
              aria-pressed={isSelected}
              aria-label={`${t(scenario.titleKey)} — ${scenario.durationLabel}`}
            >
              <span className="text-2xl leading-none sm:text-3xl">{scenario.icon}</span>
              <span className="text-[11px] font-semibold leading-tight sm:text-xs">
                {t(scenario.titleKey)}
              </span>
              <span className="text-[10px] text-muted-foreground">{scenario.durationLabel}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
