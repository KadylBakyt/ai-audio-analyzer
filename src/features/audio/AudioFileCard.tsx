import { Clock, FileAudio, HardDrive, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { AudioFileMeta } from '@/types';
import { Button } from '@/components/ui/button';
import { WaveformVisualizer } from '@/features/summary/WaveformVisualizer';
import { DEMO_SCENARIOS } from '@/utils/constants';
import { formatBytes, formatDuration } from '@/utils/format';

interface AudioFileCardProps {
  audio: AudioFileMeta;
  onRemove: () => void;
  /** True while the demo pipeline is running. */
  isRunning?: boolean;
}

export function AudioFileCard({ audio, onRemove, isRunning }: AudioFileCardProps) {
  const { t } = useTranslation();

  const isDemo = !!audio.demoScenario;
  const demoInfo = isDemo
    ? DEMO_SCENARIOS.find((s) => s.id === audio.demoScenario)
    : undefined;
  const displayName = demoInfo ? `${demoInfo.icon} ${t(demoInfo.titleKey)}` : audio.name;
  const displaySize = demoInfo ? demoInfo.sizeLabel : formatBytes(audio.size);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4"
    >
      {/* File metadata row */}
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 text-primary text-xl">
          {isDemo ? demoInfo?.icon : <FileAudio className="size-6" />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium" title={displayName}>
            {displayName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HardDrive className="size-3.5" />
              {t('upload.size')}: {displaySize}
            </span>
            {audio.duration > 0 && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {t('upload.duration')}: {formatDuration(audio.duration)}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isRunning}
          aria-label={t('upload.remove')}
          title={t('upload.remove')}
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Waveform / audio player area */}
      <div className="mt-4">
        {isRunning ? (
          /* Animated waveform replaces the player while the pipeline runs */
          <div className="flex flex-col items-center gap-2 py-3">
            <WaveformVisualizer active className="h-12 w-full" />
          </div>
        ) : (
          /* Native audio player for both real uploads and demo WAV files */
          <audio
            controls
            src={audio.previewUrl || undefined}
            className="w-full"
            aria-label={t('upload.play')}
            preload="metadata"
          >
            <track kind="captions" />
          </audio>
        )}
      </div>
    </motion.div>
  );
}
