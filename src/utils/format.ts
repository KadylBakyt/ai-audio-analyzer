import { READING_WPM } from './constants';

/** Human-readable file size (e.g. "3.2 MB"). */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}

/** Format seconds as mm:ss or h:mm:ss. */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '00:00';
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/** Count words in a string (unicode-aware, works for CJK by counting characters). */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // CJK characters are counted individually; other scripts split on whitespace.
  const cjk = trimmed.match(/[一-鿿㐀-䶿]/g)?.length ?? 0;
  const nonCjk = trimmed
    .replace(/[一-鿿㐀-䶿]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return cjk + nonCjk;
}

/** Count characters excluding surrounding whitespace. */
export function countChars(text: string): number {
  return [...text.trim()].length;
}

/** Estimated reading time in whole minutes (minimum 1 for non-empty text). */
export function estimateReadingMinutes(text: string): number {
  const words = countWords(text);
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / READING_WPM));
}
