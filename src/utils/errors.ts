/**
 * Minimal error types used in demo mode.
 * Only file-validation errors remain — no API key or network errors.
 */
export type AppErrorCode =
  | 'unsupported_file'
  | 'file_too_large'
  | 'no_file'
  | 'demo_load_failed'
  | 'unknown';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly detail?: string;

  constructor(code: AppErrorCode, detail?: string) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.detail = detail;
  }
}

export function errorTranslationKey(code: AppErrorCode): string {
  return `errors.${code}`;
}

export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof DOMException && err.name === 'AbortError') {
    return new AppError('unknown', 'Cancelled');
  }
  if (err instanceof Error) return new AppError('unknown', err.message);
  return new AppError('unknown');
}
