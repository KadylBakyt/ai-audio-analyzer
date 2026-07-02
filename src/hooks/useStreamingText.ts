import * as React from 'react';

/**
 * Progressively reveals `fullText` character-by-character after an optional
 * `delayMs`, creating a realistic AI-streaming effect.
 *
 * Duration adapts to text length so it always finishes in 1–2 seconds.
 */
export function useStreamingText(fullText: string, delayMs = 0): string {
  const [displayed, setDisplayed] = React.useState('');

  React.useEffect(() => {
    if (!fullText) {
      setDisplayed('');
      return;
    }

    let animTimer: ReturnType<typeof setTimeout> | undefined;

    const totalMs = Math.min(Math.max(fullText.length * 2.5, 900), 2000);
    const intervalMs = 18;
    const charsPerStep = Math.max(1, Math.ceil(fullText.length / (totalMs / intervalMs)));

    let cursor = 0;

    const tick = () => {
      cursor = Math.min(cursor + charsPerStep, fullText.length);
      setDisplayed(fullText.slice(0, cursor));
      if (cursor < fullText.length) {
        animTimer = setTimeout(tick, intervalMs);
      }
    };

    const startTimer = setTimeout(tick, delayMs);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(animTimer);
    };
  }, [fullText, delayMs]);

  return displayed;
}
