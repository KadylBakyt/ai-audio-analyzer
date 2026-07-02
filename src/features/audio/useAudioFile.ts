import * as React from 'react';
import type { FileRejection } from 'react-dropzone';
import type { AudioFileMeta, DemoScenario } from '@/types';
import { AppError } from '@/utils/errors';
import { getAudioDuration } from '@/utils/audio';
import { DEMO_SCENARIOS, MAX_FILE_SIZE_BYTES } from '@/utils/constants';

/**
 * Manages the selected audio source: either a real uploaded file or a
 * demo placeholder. Handles validation, duration decoding and object-URL
 * lifecycle (revoked on replace/clear).
 */
export function useAudioFile() {
  const [audio, setAudio] = React.useState<AudioFileMeta | null>(null);
  const [error, setError] = React.useState<AppError | null>(null);
  const previewUrlRef = React.useRef<string | null>(null);

  const revokePreview = React.useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  const clear = React.useCallback(() => {
    revokePreview();
    setAudio(null);
    setError(null);
  }, [revokePreview]);

  /** Accept a real uploaded file. */
  const accept = React.useCallback(
    async (file: File) => {
      setError(null);
      revokePreview();

      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      const duration = await getAudioDuration(file);

      setAudio({ file, name: file.name, size: file.size, duration, previewUrl });
    },
    [revokePreview],
  );

  /** Select one of the built-in demo scenarios (no real file required). */
  const selectDemo = React.useCallback(
    (scenario: DemoScenario) => {
      setError(null);
      revokePreview(); // revoke any previous real-file preview

      const info = DEMO_SCENARIOS.find((s) => s.id === scenario)!;
      const fakeFile = new File([], `demo-${scenario}.wav`, { type: 'audio/wav' });

      setAudio({
        file: fakeFile,
        name: info.titleKey, // resolved to label in the card
        size: 0,
        duration: info.durationSeconds,
        previewUrl: `${import.meta.env.BASE_URL}demo/audio/${scenario}.wav`,
        demoScenario: scenario,
      });
    },
    [revokePreview],
  );

  /** Handler wired to react-dropzone's onDrop. */
  const onDrop = React.useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const code = rejections[0]?.errors[0]?.code;
        setError(
          new AppError(code === 'file-too-large' ? 'file_too_large' : 'unsupported_file'),
        );
        return;
      }
      const file = accepted[0];
      if (file) void accept(file);
    },
    [accept],
  );

  React.useEffect(() => revokePreview, [revokePreview]);

  return { audio, error, onDrop, clear, setError, selectDemo, maxSize: MAX_FILE_SIZE_BYTES };
}
