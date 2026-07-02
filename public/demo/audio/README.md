# Demo Audio Files

This directory is the expected location for the built-in demo audio files.
The application works fully without them — the demo pipeline is simulated client-side.

If you want real audio playback for the demo cards, place the following files here:

| Filename | Scenario | Recommended length |
|---|---|---|
| `meeting.mp3` | Business quarterly review meeting | 5–8 minutes |
| `call-center.mp3` | Customer service billing call | 3–5 minutes |
| `medical.mp3` | Medical consultation | 6–10 minutes |

## Audio specs
- Format: MP3 or WAV
- Sample rate: 16kHz or higher (Whisper-compatible)
- Channels: mono or stereo
- Encoding: 128 kbps or better

## Notes
- Actual audio content is irrelevant for the demo — AI responses come from
  `public/demo/results/*.json` regardless of what audio file is played.
- If files are absent the audio player simply renders without a source,
  which is visually fine since the waveform animation plays during simulation.
