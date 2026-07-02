/**
 * Shared application types.
 */

/** Supported summary output languages (also the app UI languages). */
export type LanguageCode = 'kk' | 'en' | 'zh' | 'ru';

/** The four-language summary payload. */
export interface MultilingualSummary {
  kazakh: string;
  english: string;
  chinese: string;
  russian: string;
}

/** Built-in demo scenario identifiers. */
export type DemoScenario = 'meeting' | 'call-center' | 'medical';

/** Metadata describing the selected audio (real upload or demo placeholder). */
export interface AudioFileMeta {
  file: File;
  name: string;
  /** Size in bytes. */
  size: number;
  /** Duration in seconds (0 when it could not be decoded). */
  duration: number;
  /** Object URL for the <audio> preview — empty string for demo placeholder files. */
  previewUrl: string;
  /** Set when this meta was created from a built-in demo scenario. */
  demoScenario?: DemoScenario;
}

/**
 * Granular pipeline stages driving both the progress UI and the
 * simulated demo workflow.
 */
export type PipelineStage =
  | 'idle'
  | 'uploading'
  | 'transcribing'
  | 'understanding'
  | 'generating'
  | 'translating'
  | 'done'
  | 'error';

/** Result of a full analysis run. */
export interface AnalysisResult {
  transcript: string;
  summary: MultilingualSummary;
  createdAt: number;
  /** Which demo scenario produced this result (undefined for "random"). */
  scenario?: DemoScenario;
}

/** Descriptor for each output language card. */
export interface LanguageDescriptor {
  code: LanguageCode;
  /** Key into MultilingualSummary. */
  summaryKey: keyof MultilingualSummary;
  label: string;
  flag: string;
}
