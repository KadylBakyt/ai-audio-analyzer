import { Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { ErrorCard } from '@/components/ErrorCard';
import { AudioUploader } from '@/features/audio/AudioUploader';
import { AudioFileCard } from '@/features/audio/AudioFileCard';
import { DemoAudioSelector } from '@/features/audio/DemoAudioSelector';
import { useAudioFile } from '@/features/audio/useAudioFile';
import { MagicButton } from '@/features/summary/MagicButton';
import { PipelineProgress } from '@/features/summary/PipelineProgress';
import { EmptyState } from '@/features/summary/EmptyState';
import { LoadingSummaries } from '@/features/summary/LoadingSummaries';
import { SummaryResults } from '@/features/summary/SummaryResults';
import { useAudioAnalysis } from '@/hooks/useAudioAnalysis';
import { AppError } from '@/utils/errors';

export function HomePage() {
  const { t } = useTranslation();
  const { audio, error: fileError, onDrop, clear, setError, selectDemo } = useAudioFile();
  const { stage, result, error: analysisError, isRunning, analyze, reset } = useAudioAnalysis();

  const displayError = analysisError ?? fileError;

  const handleAnalyze = () => {
    if (!audio) {
      setError(new AppError('no_file'));
      return;
    }
    // Use the demo scenario attached to this audio (null = random pick)
    analyze(audio.demoScenario ?? null);
  };

  const handleClearFile = () => {
    clear();
    reset();
  };

  return (
    <div className="container space-y-12 py-10 sm:py-14">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge className="mb-4 px-3 py-1">
            <Sparkles className="size-3.5" />
            {t('hero.badge')}
          </Badge>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-gradient">{t('hero.title')}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            {t('hero.subtitle')}
          </p>
        </motion.div>
      </section>

      {/* Upload / Demo Selector */}
      <section className="mx-auto max-w-2xl space-y-5">
        <AnimatePresence mode="wait">
          {audio ? (
            <AudioFileCard
              key="file"
              audio={audio}
              onRemove={handleClearFile}
              isRunning={isRunning}
            />
          ) : (
            <motion.div key="dropzone" className="space-y-5" exit={{ opacity: 0 }}>
              <AudioUploader onDrop={onDrop} disabled={isRunning} />

              {/* Horizontal separator */}
              <div className="flex items-center gap-3 px-1">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">{t('upload.or')}</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <DemoAudioSelector
                onSelect={(scenario) => {
                  setError(null);
                  reset();
                  selectDemo(scenario);
                }}
                disabled={isRunning}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {displayError && (
            <ErrorCard
              error={displayError}
              onRetry={audio ? handleAnalyze : undefined}
              onDismiss={() => {
                setError(null);
                reset();
              }}
            />
          )}
        </AnimatePresence>

        <div className="flex justify-center pt-2">
          <MagicButton onClick={handleAnalyze} loading={isRunning} disabled={!audio} />
        </div>
      </section>

      {/* Pipeline progress (shown while running) */}
      <AnimatePresence>
        {isRunning && (
          <motion.section
            key="progress"
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <PipelineProgress stage={stage} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results section */}
      <section className="mx-auto max-w-5xl">
        {isRunning ? (
          <LoadingSummaries />
        ) : result ? (
          <SummaryResults result={result} onClear={reset} />
        ) : (
          !displayError && <EmptyState />
        )}
      </section>
    </div>
  );
}
