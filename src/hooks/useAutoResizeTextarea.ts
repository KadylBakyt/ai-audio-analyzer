import * as React from 'react';

/**
 * Auto-resize a textarea to fit its content, capped at `maxHeight` px after
 * which it becomes scrollable.
 */
export function useAutoResizeTextarea(value: string, maxHeight = 320) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value, maxHeight]);

  return ref;
}
