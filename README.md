# 🎧 AI Audio Analyzer — Portfolio Demo

<img width="1899" height="851" alt="Screenshot from 2026-07-02 13-17-37" src="https://github.com/user-attachments/assets/3be6295f-4aa8-4d46-8a45-e8fce7b1c58d" />

> **No API key. No account. No backend. Just open it and it works.**

Upload an audio file (or pick one of three built-in scenarios), press **✨ Analyze with AI**, and watch a polished AI pipeline animate through six stages — then receive clean, professional summaries in **four languages simultaneously**: Kazakh, English, Chinese (Simplified) and Russian.

All AI responses are **simulated locally** with realistic content and timing. The app is indistinguishable from a live AI product and is designed to give recruiters and clients a complete, friction-free experience.

---

## ✨ What makes it feel real

| Feature | Detail |
|---|---|
| **6-stage pipeline animation** | Uploading → Transcribing → Understanding → Generating → Translating → Done |
| **Animated waveform** | Audio bars pulse in sync with the pipeline during processing |
| **Streaming text output** | Each summary card types itself in, staggered across 4 cards |
| **Success notification** | Auto-dismissing green banner when analysis completes |
| **3 built-in demo scenarios** | Business Meeting, Call Center, Medical Consultation |
| **Professional demo content** | Realistic multilingual summaries — no Lorem Ipsum |
| **4-language UI** | Қазақша (default), English, 中文, Русский via i18next |
| **Dark / Light mode** | System-aware, persisted in localStorage |
| **Export** | Copy, Download TXT / JSON / Markdown |
| **Full accessibility** | ARIA labels, keyboard nav, focus states, WCAG AA |

---

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173). No configuration needed.

---

## 🎭 Demo Mode explained

This is a **portfolio demo application**. When the user clicks *Analyze with AI*:

1. The app does **not** call any external API.
2. A 6-stage animated pipeline runs for ~3 seconds.
3. A pre-written, professionally crafted result is loaded from
   `public/demo/results/{scenario}.json`.
4. The result streams into four language cards simultaneously.

**If the user uploads their own audio file**, a random demo result is shown (the file is never read or sent anywhere). **If the user picks a built-in demo scenario**, the matching result is shown.

This approach makes it impossible for a recruiter or client to encounter a broken state due to API limits, network issues or missing credentials.

---

## 📁 Demo content

| File | Scenario |
|---|---|
| `public/demo/results/meeting.json` | Business quarterly review — revenue, roadmap, action items |
| `public/demo/results/call-center.json` | Customer service call — duplicate billing, refund resolution |
| `public/demo/results/medical.json` | Cardiology consultation — symptoms, ECG, prescriptions |

Each JSON contains `kazakh`, `english`, `chinese`, and `russian` keys with fully written professional summaries.

---

## 🧱 Tech stack

React 19 · Vite 6 · TypeScript (strict) · TailwindCSS · shadcn/ui · Framer Motion · TanStack React Query · React Dropzone · i18next · lucide-react

---

## 📁 Project structure

```
src/
  app/              # App shell, providers, HomePage
  components/       # Shared UI: Navbar, ErrorCard, ThemeToggle, AuroraBackground
    ui/             # shadcn/ui primitives
  features/
    audio/          # Uploader, file card, demo selector, file hook
    summary/        # Magic button, pipeline, waveform, cards, results, empty/loading
    language/       # Language switcher
  hooks/            # useAudioAnalysis, useStreamingText, useTheme, useCopyToClipboard…
  services/         # demo.ts — simulated pipeline (no network requests)
  utils/            # cn, format, download, errors, constants, audio
  types/            # Shared TypeScript types
  i18n/             # i18next configuration
public/
  locales/          # kk / en / zh / ru translation JSON files
  demo/
    results/        # Pre-written multilingual summary JSON files
    audio/          # Optional: place real .mp3 files here for audio playback
```

---

## 🌍 Adding real AI (for production)

The demo pipeline lives entirely in `src/services/demo.ts`. To connect a real AI backend:

1. Restore a `src/services/openai.ts` (or any provider) that calls
   - `POST /audio/transcriptions` (Whisper or equivalent) for speech-to-text
   - `POST /chat/completions` with a structured prompt for multilingual summarisation
2. Update `src/hooks/useAudioAnalysis.ts` to call your real service instead of `runDemoAnalysis`.
3. Add an API-key settings page (the deleted `src/features/settings/` is a good starting point).
4. Set `VITE_OPENAI_API_KEY` in `.env.local` or via Cloudflare Pages environment variables.

The rest of the UI — pipeline progress, waveform, streaming cards, downloads — requires no changes.

---

## ☁️ Deployment (Cloudflare Pages)

### Dashboard

1. Push to GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
3. Framework preset: **Vite** · Build command: `npm run build` · Output: `dist`
4. Deploy. No environment variables required for demo mode.

### GitHub Actions (included)

The `.github/workflows/deploy.yml` workflow type-checks, builds and deploys on every push to `main`. Add these repository secrets:

| Secret | Source |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Edit Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard overview URL |

---

## 🛠 Other scripts

```bash
npm run build      # TypeScript check + production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run format     # Prettier
```

---

## 📄 License

MIT — use freely as a portfolio template or starting point for a real AI SaaS product.
