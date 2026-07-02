import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { FileRejection } from 'react-dropzone';
import { cn } from '@/utils/cn';
import { ACCEPTED_AUDIO_MIME, MAX_FILE_SIZE_BYTES } from '@/utils/constants';

interface AudioUploaderProps {
  onDrop: (accepted: File[], rejections: FileRejection[]) => void;
  disabled?: boolean;
}

export function AudioUploader({ onDrop, disabled }: AudioUploaderProps) {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_AUDIO_MIME,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all sm:p-14',
        isDragActive
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border hover:border-primary/50 hover:bg-accent/40',
        disabled && 'pointer-events-none opacity-60',
      )}
    >
      <input {...getInputProps()} aria-label={t('upload.title')} />

      <motion.span
        animate={isDragActive ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
        className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-pink-500/15 text-primary"
      >
        <UploadCloud className="size-8" />
      </motion.span>

      <p className="mt-5 text-base font-semibold">
        {isDragActive ? t('upload.dragActive') : t('upload.dragInactive')}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {t('upload.or')}{' '}
        <button
          type="button"
          onClick={open}
          disabled={disabled}
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {t('upload.browse')}
        </button>
      </p>

      <p className="mt-4 text-xs text-muted-foreground">{t('upload.supported')}</p>
    </div>
  );
}
