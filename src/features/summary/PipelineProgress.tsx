import {
  BrainCircuit,
  Check,
  Globe,
  Languages,
  Loader2,
  ScrollText,
  UploadCloud,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { PipelineStage } from '@/types';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PipelineProgressProps {
  stage: PipelineStage;
}

type ActiveStage = Exclude<PipelineStage, 'idle' | 'done' | 'error'>;

const STEPS: { stage: ActiveStage; labelKey: string; icon: LucideIcon }[] = [
  { stage: 'uploading', labelKey: 'pipeline.steps.uploading', icon: UploadCloud },
  { stage: 'transcribing', labelKey: 'pipeline.steps.transcribing', icon: ScrollText },
  { stage: 'understanding', labelKey: 'pipeline.steps.understanding', icon: BrainCircuit },
  { stage: 'generating', labelKey: 'pipeline.steps.generating', icon: Globe },
  { stage: 'translating', labelKey: 'pipeline.steps.translating', icon: Languages },
];

const STAGE_ORDER: PipelineStage[] = [
  'uploading',
  'transcribing',
  'understanding',
  'generating',
  'translating',
];

function stageIndex(stage: PipelineStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  if (stage === 'done') return STAGE_ORDER.length; // all complete
  return idx === -1 ? -1 : idx;
}

/** Caption text shown below the stepper for the current stage. */
const STAGE_CAPTION_KEYS: Partial<Record<PipelineStage, string>> = {
  uploading: 'pipeline.captions.uploading',
  transcribing: 'pipeline.captions.transcribing',
  understanding: 'pipeline.captions.understanding',
  generating: 'pipeline.captions.generating',
  translating: 'pipeline.captions.translating',
};

export function PipelineProgress({ stage }: PipelineProgressProps) {
  const { t } = useTranslation();
  const current = stageIndex(stage);
  const captionKey = STAGE_CAPTION_KEYS[stage] ?? 'pipeline.captions.uploading';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6"
      role="status"
      aria-live="polite"
      aria-label={t(captionKey)}
    >
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const Icon = step.icon;

          return (
            <li
              key={step.stage}
              className="flex flex-1 flex-col items-center gap-2 text-center"
              aria-current={active ? 'step' : undefined}
            >
              <div className="flex w-full items-center">
                {index > 0 && (
                  <motion.span
                    className="h-0.5 flex-1 rounded-full"
                    animate={{ backgroundColor: done || active ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                <motion.span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    done && 'border-primary bg-primary text-primary-foreground',
                    active && 'border-primary bg-primary/10 text-primary',
                    !done && !active && 'border-border text-muted-foreground',
                  )}
                  animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ repeat: active ? Infinity : 0, duration: 1.4, ease: 'easeInOut' }}
                >
                  {done ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <Check className="size-4" />
                    </motion.span>
                  ) : active ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </motion.span>

                {index < STEPS.length - 1 && (
                  <motion.span
                    className="h-0.5 flex-1 rounded-full"
                    animate={{ backgroundColor: done ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>

              <span
                className={cn(
                  'hidden text-[10px] font-medium sm:block sm:text-[11px]',
                  active || done ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {t(step.labelKey)}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Animated caption */}
      <motion.p
        key={captionKey}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 text-center text-sm font-medium text-muted-foreground"
      >
        {t(captionKey)}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="ml-0.5 inline-block"
        >
          …
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
