# CLAUDE.md

## Project Overview

**IA Heroes - Semana de Lanzamiento** is an interactive educational/marketing web application built for [Learning Heroes](https://programas.learningheroes.com/ia-heroes/). It showcases generative AI capabilities across a 4-day experience targeting entrepreneurs and business professionals (40-60 age range, Spanish-speaking).

The app was originally created in [Google AI Studio](https://ai.studio/apps/fd0e1c54-f751-4805-8bce-3733554da1e8) and uses the Google Gemini API for all AI features.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build tool**: Vite 6
- **Styling**: Tailwind CSS (loaded via CDN `<script>` tag in `index.html`, no local config)
- **AI SDK**: `@google/genai` (Google Gemini)
- **Icons**: `lucide-react`
- **Charts**: `recharts`
- **Markdown**: `react-markdown`

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build via Vite
npm run preview      # Preview production build
```

There are no test, lint, or formatting commands configured.

## Project Structure

```
/
├── index.html           # Entry HTML (Tailwind CDN, importmap, meta tags, GTM)
├── index.tsx            # React entry point (renders <App /> into #root)
├── App.tsx              # Root component with client-side routing via useState
├── types.ts             # Shared TypeScript interfaces and enums
├── constants.ts         # Theme colors, IA Heroes course content, AI system prompts
├── components/
│   ├── Layout.tsx       # Shared layout: sticky promo banner, header, footer
│   ├── CTAModal.tsx     # Reusable CTA modal that links to campaign URL
│   ├── Home.tsx         # Landing page with day navigation cards
│   ├── Day1.tsx         # Day 1: AI fundamentals (slides, charts, interactive content)
│   ├── Day2.tsx         # Day 2: Creative studio (image/video generation)
│   ├── Day3.tsx         # Day 3: AI career consultant chatbot
│   └── Day4.tsx         # Day 4: Business analysis with AI agents
├── services/
│   └── geminiService.ts # All Gemini API calls (text, image, video, chat, search)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Important:** `geminiService.ts` currently sits at root level, but components import it as `../services/geminiService` and the file itself imports `../constants`. These paths only resolve correctly if the file is inside a `services/` subdirectory. To fix local builds, move it to `services/geminiService.ts`. The `@/*` path alias maps to the project root.

## Architecture

### Routing

Client-side routing is implemented via `useState<AppRoute>` in `App.tsx` — there is no router library. The `AppRoute` enum (`types.ts`) defines: `HOME`, `DAY_1`, `DAY_2`, `DAY_3`, `DAY_4`. Each page component receives `setRoute` as a prop to navigate.

### AI Service Layer (`geminiService.ts`)

All Gemini API calls are centralized here. Two client patterns exist:
- **`getEnvClient()`** — uses `process.env.API_KEY` (injected by Vite from `GEMINI_API_KEY` in `.env.local`). Used for standard-tier models.
- **`getUserClient()`** — for premium models (Veo video). Checks `window.aistudio.hasSelectedApiKey()` for the AI Studio environment.

Functions:
| Function | Model | Purpose |
|---|---|---|
| `enhancePrompt()` | `gemini-3-flash-preview` | Improves user prompts for image/video generation |
| `generateImage()` | `gemini-2.5-flash-image` | Generates images from text prompts |
| `generateVideo()` | `veo-3.1-fast-generate-preview` | Generates videos with polling loop |
| `sendConsultantMessage()` | `gemini-3-flash-preview` | Multi-turn career consultant chat |
| `analyzeBusiness()` | `gemini-3-flash-preview` | Business analysis with Google Search grounding |

### Shared Components

- **`Layout`** — wraps every page. Includes a sticky pink promo banner at top, optional back button + title header, and footer. All day pages use `<Layout title="..." onBack={...}>`.
- **`CTAModal`** — a promotional modal that appears after key interactions (image generation, chat response, business analysis). Links to the campaign URL `https://live.learningheroes.com/iah-artefact`.

### Day Pages

- **Day1** (~1138 lines) — The largest component. Contains a multi-slide presentation with interactive elements: flip cards, technology investment charts (recharts), a token predictor demo, prompt engineering techniques, and AI agent examples. All content is hardcoded as data arrays within the component.
- **Day2** — Image and video generation studio. Toggle between Flash (image) and Veo (video) modes. Includes prompt enhancement via AI.
- **Day3** — Chat interface with an AI career consultant. Uses multi-turn conversation history. Renders messages with `react-markdown`.
- **Day4** — Business URL analysis. Submits a URL, Gemini analyzes it with search grounding, returns AI agent proposals with copyable system prompts.

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key. Set in `.env.local` file. Vite exposes it as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`. |

## Conventions

### Language
- All UI text, comments, prompts, and content are in **Spanish**.
- Variable names, component names, and code structure use **English**.

### Styling
- All styling uses **Tailwind CSS utility classes** inline — there are no CSS files or CSS modules.
- Brand colors are defined in `constants.ts` as `COLORS`: primary `#243F4C` (dark blue/teal), accent `#FF2878` (pink/magenta).
- Responsive design uses Tailwind's `md:` breakpoint prefix throughout.

### Component Patterns
- Functional components with `React.FC<Props>` typing.
- State management via `useState` and `useRef` (no external state library).
- Props interfaces defined immediately above each component (e.g., `Day2Props`, `Day3Props`).
- Each day component manages its own local state including loading, error, and CTA modal visibility.

### TypeScript
- Target: ES2022, JSX: `react-jsx`.
- `noEmit: true` — TypeScript is used only for type checking; Vite handles transpilation.
- `@ts-ignore` comments are used for `window.aistudio` API calls (AI Studio injected globals).

### AI Integration
- All AI interactions go through `geminiService.ts` — never call the Gemini SDK directly from components.
- System prompts are stored as template literals in `constants.ts`.
- The `IA_HEROES_CONTEXT` constant contains the full course description and is injected into AI prompts as knowledge base context.

## Key URLs

- **Campaign CTA**: `https://live.learningheroes.com/iah-artefact` (used in Layout banner, CTAModal, Home page)
- **AI Studio App**: `https://ai.studio/apps/fd0e1c54-f751-4805-8bce-3733554da1e8`
- **OG Image**: `https://storage.googleapis.com/kisunexpublic/og%20LH.png`

## Known Considerations

- `Day1.tsx` is very large (~1138 lines) with all slide data inlined. If refactoring, consider extracting slide data into a separate data file.
- **Broken import paths:** `geminiService.ts` is at root but all imports reference it at `services/geminiService`. The file needs to be moved to `services/geminiService.ts` for local development to work. This is an artifact of the AI Studio export.
- No tests, linting, or CI pipeline exist. Consider adding these if the project grows.
- The `index.html` includes an import map for ESM CDN fallbacks alongside the Vite dev server — this is standard for AI Studio exported apps.
