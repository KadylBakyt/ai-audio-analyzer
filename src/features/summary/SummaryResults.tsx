import * as React from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  FileJson,
  FileText,
  FileType,
  Trash2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { SummaryCard } from './SummaryCard';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { OUTPUT_LANGUAGES } from '@/utils/constants';
import { downloadAsJson, downloadAsMarkdown, downloadAsText } from '@/utils/download';

interface SummaryResultsProps {
  result: AnalysisResult;
  onClear: () => void;
}

/** Auto-dismissing success banner shown for 4 seconds when results first arrive. */
function SuccessBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="size-5 shrink-0" />
          <span className="flex-1">{t('results.successBanner')}</span>
          <button
            onClick={() => setVisible(false)}
            aria-label={t('errors.dismiss')}
            className="rounded-md p-1 transition-colors hover:bg-emerald-500/20"
          >
            <X className="size-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SummaryResults({ result, onClear }: SummaryResultsProps) {
  const { t, i18n } = useTranslation();
  const { copied, copy } = useCopyToClipboard();
  const [showTranscript, setShowTranscript] = React.useState(false);

  const createdAt = new Date(result.createdAt).toLocaleTimeString(i18n.resolvedLanguage, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyAll = () => {
    const combined = OUTPUT_LANGUAGES.map(
      (lang) => `${lang.flag} ${lang.label}\n${result.summary[lang.summaryKey]}`,
    ).join('\n\n');
    void copy(combined);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-labelledby="results-heading"
      className="space-y-5"
    >
      {/* Success banner */}
      <SuccessBanner key={result.createdAt} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="results-heading" className="text-xl font-bold sm:text-2xl">
            {t('results.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('results.subtitle', { time: createdAt })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={copyAll}>
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
            {t('results.copyAll')}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => downloadAsText(result)}>
            <FileText className="size-4" />
            {t('results.downloadTxt')}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => downloadAsJson(result)}>
            <FileJson className="size-4" />
            {t('results.downloadJson')}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => downloadAsMarkdown(result)}>
            <FileType className="size-4" />
            {t('results.downloadMd')}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="size-4" />
            {t('results.clear')}
          </Button>
        </div>
      </div>

      {/* Four language cards with staggered streaming */}
      <div className="grid gap-4 sm:grid-cols-2">
        {OUTPUT_LANGUAGES.map((lang, index) => (
          <SummaryCard
            key={lang.code}
            language={lang}
            text={result.summary[lang.summaryKey]}
            streamDelay={index * 280}
          />
        ))}
      </div>

      {/* Collapsible raw transcript */}
      <div className="glass overflow-hidden rounded-xl">
        <button
          onClick={() => setShowTranscript((v) => !v)}
          aria-expanded={showTranscript}
          className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-accent/40"
        >
          <span>
            {showTranscript ? t('results.transcriptHide') : t('results.transcriptToggle')}
          </span>
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${showTranscript ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {showTranscript && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <p className="scrollbar-thin max-h-72 overflow-y-auto whitespace-pre-wrap border-t px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {result.transcript}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
