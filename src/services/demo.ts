import type { AnalysisResult, DemoScenario, MultilingualSummary, PipelineStage } from '@/types';

/** Simulated per-stage durations in ms — total ≈ 3 s. */
const STAGE_DURATIONS: Record<Exclude<PipelineStage, 'idle' | 'done' | 'error'>, number> = {
  uploading: 420,
  transcribing: 680,
  understanding: 520,
  generating: 760,
  translating: 580,
};

const ALL_SCENARIOS: DemoScenario[] = ['meeting', 'call-center', 'medical'];

function randomScenario(): DemoScenario {
  return ALL_SCENARIOS[Math.floor(Math.random() * ALL_SCENARIOS.length)] as DemoScenario;
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); }, { once: true });
  });
}

async function loadDemoResult(scenario: DemoScenario): Promise<MultilingualSummary> {
  const url = `${import.meta.env.BASE_URL}demo/results/${scenario}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load demo result: ${scenario}`);
  return response.json() as Promise<MultilingualSummary>;
}

/** Fake transcript shown in the collapsible raw-transcript section. */
const DEMO_TRANSCRIPTS: Record<DemoScenario, string> = {
  meeting:
    'Alright everyone, let\'s get started. So, uh, Q3 numbers — I think we should kick things off with the revenue overview. Mark, you want to run us through that? Yeah sure, so overall we came in at about four point two million which is, you know, roughly twelve percent above target, which is great. Customer acquisition cost also dropped, which is... yeah that\'s been a focus for a while. And mobile MAU hit thirty four thousand which is honestly better than we projected...',
  'call-center':
    'Thank you for calling support, my name is Jessica, how can I help you today? Hi yes, I\'m calling because I was charged twice this month on my premium subscription and I\'m really not happy about it. I see that, I\'m so sorry about that. Can I get your account email? Sure it\'s leila at... yeah. OK I can see two charges of twenty nine ninety nine on September fourteenth. Let me get that sorted for you right away...',
  medical:
    'So what brings you in today? I\'ve been having these, um, palpitations? Like my heart is racing sometimes, and also when I climb stairs I get kind of out of breath. How long has this been going on? About three weeks now. Any chest pain? No, no pain. OK. And you mentioned you\'re on metformin for the diabetes? Yes, five hundred milligrams. And your father had heart issues? Yes, he had a heart attack at sixty two...',
};

/**
 * Simulate the full AI analysis pipeline.
 *
 * Each stage fires `onStage` then waits its configured duration.
 * On completion it returns a realistic `AnalysisResult` loaded from the
 * corresponding JSON file in /public/demo/results/.
 */
export async function runDemoAnalysis(
  scenario: DemoScenario | null,
  onStage: (s: PipelineStage) => void,
  signal: AbortSignal,
): Promise<AnalysisResult> {
  const chosen = scenario ?? randomScenario();

  const stages = Object.entries(STAGE_DURATIONS) as [
    Exclude<PipelineStage, 'idle' | 'done' | 'error'>,
    number,
  ][];

  for (const [stage, ms] of stages) {
    onStage(stage);
    await delay(ms, signal);
  }

  const summary = await loadDemoResult(chosen);

  onStage('done');
  return {
    transcript: DEMO_TRANSCRIPTS[chosen],
    summary,
    createdAt: Date.now(),
    scenario: chosen,
  };
}
