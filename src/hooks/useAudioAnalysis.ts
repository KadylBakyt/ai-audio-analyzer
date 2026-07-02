import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AnalysisResult, DemoScenario, PipelineStage } from '@/types';
import { runDemoAnalysis } from '@/services/demo';
import { type AppError, toAppError } from '@/utils/errors';

/**
 * Orchestrates the full demo AI pipeline.
 * All analysis is simulated locally — no network requests to any AI provider.
 */
export function useAudioAnalysis() {
  const [stage, setStage] = React.useState<PipelineStage>('idle');
  const abortRef = React.useRef<AbortController | null>(null);

  const mutation = useMutation<AnalysisResult, AppError, DemoScenario | null>({
    mutationFn: async (scenario) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        return await runDemoAnalysis(scenario, setStage, controller.signal);
      } catch (err) {
        setStage('error');
        throw toAppError(err);
      }
    },
  });

  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    setStage('idle');
    mutation.reset();
  }, [mutation]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  return {
    stage,
    result: mutation.data ?? null,
    error: mutation.error ?? null,
    isRunning: mutation.isPending,
    /** Pass the demo scenario to use, or null to pick one at random. */
    analyze: mutation.mutate,
    reset,
  };
}
