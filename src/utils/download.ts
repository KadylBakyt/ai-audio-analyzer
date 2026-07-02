import type { AnalysisResult } from '@/types';
import { OUTPUT_LANGUAGES } from './constants';

/** Trigger a client-side file download for the given text content. */
export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on next tick so the download has a chance to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

export function downloadAsText(result: AnalysisResult): void {
  const sections = OUTPUT_LANGUAGES.map(
    (lang) => `## ${lang.flag} ${lang.label}\n\n${result.summary[lang.summaryKey]}\n`,
  ).join('\n----------------------------------------\n\n');
  const content = `AI Audio Analyzer — Multilingual Summary\nGenerated: ${new Date(
    result.createdAt,
  ).toLocaleString()}\n\n${sections}`;
  downloadFile(`summary-${timestamp()}.txt`, content, 'text/plain');
}

export function downloadAsJson(result: AnalysisResult): void {
  const content = JSON.stringify(
    { generatedAt: new Date(result.createdAt).toISOString(), summary: result.summary },
    null,
    2,
  );
  downloadFile(`summary-${timestamp()}.json`, content, 'application/json');
}

export function downloadAsMarkdown(result: AnalysisResult): void {
  const sections = OUTPUT_LANGUAGES.map(
    (lang) => `### ${lang.flag} ${lang.label}\n\n${result.summary[lang.summaryKey]}\n`,
  ).join('\n');
  const content = `# AI Audio Analyzer — Multilingual Summary\n\n> Generated: ${new Date(
    result.createdAt,
  ).toLocaleString()}\n\n${sections}`;
  downloadFile(`summary-${timestamp()}.md`, content, 'text/markdown');
}
