import * as React from 'react';
import { Check, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { LanguageDescriptor } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';
import { useStreamingText } from '@/hooks/useStreamingText';
import { countChars, countWords, estimateReadingMinutes } from '@/utils/format';
import { cn } from '@/utils/cn';

interface SummaryCardProps {
  language: LanguageDescriptor;
  text: string;
  /** Delay in ms before the streaming animation begins (for stagger effect). */
  streamDelay?: number;
}

export function SummaryCard({ language, text, streamDelay = 0 }: SummaryCardProps) {
  const { t } = useTranslation();
  const { copied, copy } = useCopyToClipboard();
  const [expanded, setExpanded] = React.useState(false);
  const maxHeight = expanded ? 900 : 240;

  const displayText = useStreamingText(text, streamDelay);
  const textareaRef = useAutoResizeTextarea(displayText, maxHeight);

  const isStreaming = displayText.length < text.length;

  const stats = React.useMemo(
    () => ({
      words: countWords(text),
      chars: countChars(text),
      minutes: estimateReadingMinutes(text),
    }),
    [text],
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: streamDelay / 1000 * 0.5 }}
      className="glass flex flex-col rounded-xl p-5"
    >
      <header className="flex items-center justify-between gap-2">
        <Badge className="gap-1.5 px-3 py-1 text-sm">
          <span className="text-base leading-none">{language.flag}</span>
          {language.label}
        </Badge>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => void copy(text)}
                aria-label={copied ? t('results.copied') : t('results.copy')}
                disabled={isStreaming}
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? t('results.copied') : t('results.copy')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? t('results.collapse') : t('results.expand')}
                aria-expanded={expanded}
                disabled={isStreaming}
              >
                {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {expanded ? t('results.collapse') : t('results.expand')}
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      <Textarea
        ref={textareaRef}
        value={displayText}
        readOnly
        dir={language.code === 'zh' ? 'ltr' : 'auto'}
        lang={language.code}
        aria-label={language.label}
        aria-busy={isStreaming}
        className={cn(
          'scrollbar-thin mt-4 resize-none border-0 bg-transparent px-0 leading-relaxed shadow-none focus-visible:ring-0',
        )}
      />

      {/* Streaming cursor */}
      {isStreaming && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.65 }}
          className="mt-1 inline-block h-4 w-0.5 rounded-full bg-primary align-middle"
          aria-hidden
        />
      )}

      <footer className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-[11px] text-muted-foreground">
        <span>{t('results.words', { count: stats.words })}</span>
        <span>{t('results.chars', { count: stats.chars })}</span>
        <span>{t('results.readingTime', { count: stats.minutes })}</span>
      </footer>
    </motion.article>
  );
}
