/**
 * Generates three short, distinct WAV audio samples for the built-in demo scenarios.
 * Each file is ~5 seconds, 22 050 Hz, mono, 16-bit PCM.
 * Run once: node scripts/generate-demo-audio.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/demo/audio');
mkdirSync(OUT_DIR, { recursive: true });

const SAMPLE_RATE = 22050;
const DURATION = 5; // seconds
const NUM_SAMPLES = SAMPLE_RATE * DURATION;

/** Write a 16-bit mono PCM WAV file. */
function writeWav(filename, samples) {
  const dataBytes = samples.length * 2;
  const buf = Buffer.alloc(44 + dataBytes);

  // RIFF header
  buf.write('RIFF', 0, 'ascii');
  buf.writeUInt32LE(36 + dataBytes, 4);
  buf.write('WAVE', 8, 'ascii');

  // fmt  chunk
  buf.write('fmt ', 12, 'ascii');
  buf.writeUInt32LE(16, 16);           // chunk size
  buf.writeUInt16LE(1, 20);            // PCM format
  buf.writeUInt16LE(1, 22);            // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32);            // block align
  buf.writeUInt16LE(16, 34);           // bits per sample

  // data chunk
  buf.write('data', 36, 'ascii');
  buf.writeUInt32LE(dataBytes, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  writeFileSync(filename, buf);
  console.log(`✓ ${filename}  (${(buf.length / 1024).toFixed(1)} KB)`);
}

/** Smooth fade-in / fade-out envelope. */
function envelope(i, total, fadeIn = 0.06, fadeOut = 0.06) {
  const t = i / total;
  const up = Math.min(t / fadeIn, 1);
  const down = Math.min((1 - t) / fadeOut, 1);
  return Math.min(up, down);
}

/** Simple seeded pseudo-random (LCG) so the noise is deterministic. */
function makePrng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return (s / 0xffffffff) * 2 - 1; // [-1, 1]
  };
}

// ─── meeting.wav ─────────────────────────────────────────────────────────────
// Conference-room feel: multiple overlapping voices at speech frequencies,
// with a slow "talking rhythm" amplitude envelope on each layer.
{
  const rand = makePrng(0xdeadbeef);
  const voices = [
    { freq: 180, phase: 0.00, modRate: 3.1, modDepth: 0.6 },
    { freq: 230, phase: 0.80, modRate: 2.7, modDepth: 0.5 },
    { freq: 290, phase: 1.57, modRate: 3.4, modDepth: 0.7 },
    { freq: 370, phase: 0.42, modRate: 2.4, modDepth: 0.4 },
    { freq: 150, phase: 2.10, modRate: 1.9, modDepth: 0.55 },
  ];
  const samples = new Float32Array(NUM_SAMPLES);
  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    for (const v of voices) {
      const mod = 0.5 + v.modDepth * 0.5 * Math.sin(2 * Math.PI * v.modRate * t + v.phase);
      s += mod * Math.sin(2 * Math.PI * v.freq * t + v.phase);
    }
    s /= voices.length;
    s += rand() * 0.04; // room noise floor
    samples[i] = envelope(i, NUM_SAMPLES) * s * 0.55;
  }
  writeWav(join(OUT_DIR, 'meeting.wav'), samples);
}

// ─── call-center.wav ─────────────────────────────────────────────────────────
// Telephone quality: narrow bandwidth (300–3400 Hz), single dominant voice
// with speech-rhythm pulsing and a faint telephone crackle.
{
  const rand = makePrng(0xcafebabe);
  const freqs = [280, 420, 560, 840, 1120];
  const samples = new Float32Array(NUM_SAMPLES);

  // IIR bandpass approximation (one-pole highpass + one-pole lowpass)
  let lpState = 0;
  let hpState = 0;
  const lpAlpha = Math.exp(-2 * Math.PI * 3400 / SAMPLE_RATE);
  const hpAlpha = Math.exp(-2 * Math.PI * 300 / SAMPLE_RATE);

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Speech rhythm: ~3 syllables/sec
    const speechMod = 0.3 + 0.7 * Math.max(0, Math.sin(2 * Math.PI * 3.2 * t)) ** 2;
    let s = 0;
    for (const f of freqs) {
      s += Math.sin(2 * Math.PI * f * t) / freqs.length;
    }
    s = speechMod * s + rand() * 0.06;

    // Telephone bandpass filter
    lpState = lpAlpha * lpState + (1 - lpAlpha) * s;
    hpState = hpAlpha * hpState + (1 - hpAlpha) * lpState;
    const filtered = lpState - hpState;

    samples[i] = envelope(i, NUM_SAMPLES) * filtered * 0.7;
  }
  writeWav(join(OUT_DIR, 'call-center.wav'), samples);
}

// ─── medical.wav ─────────────────────────────────────────────────────────────
// Calm consultation: clean, low-noise, one clear voice at a measured pace
// with a very soft room tone underneath.
{
  const rand = makePrng(0x1234abcd);
  const voiceFreq = 200;
  const harmonics = [1, 2, 3, 4];
  const harmonicWeights = [1.0, 0.45, 0.20, 0.08];

  const samples = new Float32Array(NUM_SAMPLES);
  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    // Gentle speech pacing: 2 syllables/sec with smooth curve
    const pace = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 2.0 * t - Math.PI / 2));
    let s = 0;
    for (let h = 0; h < harmonics.length; h++) {
      s += harmonicWeights[h] * Math.sin(2 * Math.PI * voiceFreq * harmonics[h] * t);
    }
    const total = harmonicWeights.reduce((a, b) => a + b, 0);
    s /= total;
    s = pace * s + rand() * 0.015;
    samples[i] = envelope(i, NUM_SAMPLES, 0.1, 0.1) * s * 0.6;
  }
  writeWav(join(OUT_DIR, 'medical.wav'), samples);
}

console.log('\n✅ All demo audio files generated in public/demo/audio/');
