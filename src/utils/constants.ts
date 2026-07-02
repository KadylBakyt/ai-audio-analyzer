import type { DemoScenario, LanguageDescriptor } from '@/types';

/** Maximum audio file size accepted by the uploader (display-only in demo mode). */
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

/** Accepted audio mime types + extensions for react-dropzone. */
export const ACCEPTED_AUDIO_MIME: Record<string, string[]> = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-wav': ['.wav'],
  'audio/mp4': ['.m4a'],
  'audio/x-m4a': ['.m4a'],
  'audio/aac': ['.aac'],
  'audio/ogg': ['.ogg'],
  'audio/flac': ['.flac'],
  'audio/x-flac': ['.flac'],
};

export const ACCEPTED_EXTENSIONS = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'] as const;

/** localStorage keys. */
export const STORAGE_KEYS = {
  theme: 'aiaa:theme',
  language: 'aiaa:language',
} as const;

/** Ordered descriptors driving the four output cards. */
export const OUTPUT_LANGUAGES: readonly LanguageDescriptor[] = [
  { code: 'kk', summaryKey: 'kazakh', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', summaryKey: 'english', label: 'English', flag: '🇺🇸' },
  { code: 'zh', summaryKey: 'chinese', label: '中文', flag: '🇨🇳' },
  { code: 'ru', summaryKey: 'russian', label: 'Русский', flag: '🇷🇺' },
] as const;

/** Words-per-minute used for reading-time estimates. */
export const READING_WPM = 200;

/** Metadata for the built-in demo audio scenarios. */
export const DEMO_SCENARIOS: {
  id: DemoScenario;
  icon: string;
  titleKey: string;
  subtitleKey: string;
  durationLabel: string;
  sizeLabel: string;
  durationSeconds: number;
}[] = [
  {
    id: 'meeting',
    icon: '🏢',
    titleKey: 'demo.meeting.title',
    subtitleKey: 'demo.meeting.subtitle',
    durationLabel: '5:32',
    sizeLabel: '7.6 MB',
    durationSeconds: 332,
  },
  {
    id: 'call-center',
    icon: '📞',
    titleKey: 'demo.callCenter.title',
    subtitleKey: 'demo.callCenter.subtitle',
    durationLabel: '3:47',
    sizeLabel: '5.2 MB',
    durationSeconds: 227,
  },
  {
    id: 'medical',
    icon: '🏥',
    titleKey: 'demo.medical.title',
    subtitleKey: 'demo.medical.subtitle',
    durationLabel: '8:15',
    sizeLabel: '11.3 MB',
    durationSeconds: 495,
  },
];
