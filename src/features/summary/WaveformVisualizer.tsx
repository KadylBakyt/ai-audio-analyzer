import * as React from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  /** Whether the waveform should animate (active processing). */
  active?: boolean;
  barCount?: number;
  className?: string;
}

/** Pre-computed stable bar parameters to avoid re-randomisation on render. */
const BARS = Array.from({ length: 40 }, (_, i) => {
  // Use deterministic pseudo-random values derived from index.
  const t = (i * 2654435761) >>> 0; // Knuth multiplicative hash
  const a = (t & 0xff) / 255;
  const b = ((t >> 8) & 0xff) / 255;
  const c = ((t >> 16) & 0xff) / 255;
  return {
    minH: 3 + a * 5,
    maxH: 14 + b * 26,
    duration: 0.35 + c * 0.45,
    delay: (i / 40) * 0.55,
  };
});

/**
 * Animated audio waveform visualiser.
 *
 * When `active` the bars bounce at independent speeds and amplitudes.
 * When idle they collapse to a flat baseline so the component can remain
 * mounted as a static graphic.
 */
export const WaveformVisualizer = React.memo(function WaveformVisualizer({
  active = false,
  barCount = 40,
  className,
}: WaveformVisualizerProps) {
  const bars = BARS.slice(0, barCount);

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-[2px] ${className ?? ''}`}
    >
      {bars.map((bar, i) => (
        <motion.span
          key={i}
          className="inline-block w-[3px] rounded-full bg-gradient-to-b from-violet-500 to-pink-500"
          style={{ originY: '50%' }}
          animate={
            active
              ? {
                  scaleY: [
                    bar.minH / bar.maxH,
                    1,
                    bar.minH / bar.maxH + 0.2,
                    1,
                    bar.minH / bar.maxH,
                  ],
                  height: bar.maxH,
                }
              : { scaleY: 0.25, height: bar.minH + 2 }
          }
          transition={
            active
              ? {
                  repeat: Infinity,
                  duration: bar.duration,
                  delay: bar.delay,
                  ease: 'easeInOut',
                }
              : { duration: 0.4, ease: 'easeOut' }
          }
        />
      ))}
    </div>
  );
});
