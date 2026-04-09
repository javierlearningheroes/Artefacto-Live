# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IA Heroes - Semana de Lanzamiento** is an interactive educational/marketing web application for [Learning Heroes](https://programas.learningheroes.com/ia-heroes/). It showcases generative AI capabilities across a multi-day experience targeting Spanish-speaking entrepreneurs and business professionals (40-60 age range).

Originally created in [Google AI Studio](https://ai.studio/apps/fd0e1c54-f751-4805-8bce-3733554da1e8) and uses the Google Gemini API for all AI features. Deployed on Vercel.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build via Vite
npm run preview      # Preview production build
```

No test, lint, or formatting commands are configured.

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key. Set in `.env.local`. Vite exposes it as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY` via `vite.config.ts` `define` block. |

## Architecture

### Routing

Client-side routing via `useState<AppRoute>` in `App.tsx` — no router library. The `AppRoute` enum in `types.ts` defines: `HOME`, `DAY_1`, `DAY_2`, `DAY_3`, `DAY_4`, `AGENTS`. Day 3 is **not** a page — it redirects to an external HubSpot URL and returns to HOME.

### App Wrapper

`App.tsx` wraps everything in `AdminProvider` (context) and renders a `BackgroundGradient` animation behind all content. Vercel Analytics and SpeedInsights are included at the app root.

### Unlock System (`utils/unlockSystem.ts`)

Days are time-gated via `UNLOCK_SCHEDULE` — each day has a specific Madrid-timezone unlock time. The `isDayUnlocked()` function checks the schedule. An **admin bypass** exists: append `?admin=LH2026pro` to the URL to unlock all days for the session (persisted in sessionStorage).

### Tracking System (`services/trackingService.ts`)

Tracks user interactions per section (slide views, card flips, image generations, etc.) and triggers CTA popups when thresholds are met. Pushes events to GTM dataLayer. Counts stored in sessionStorage. An `AdminPanel` component (visible only to admins) shows live interaction counts.

### AI Service Layer (`services/geminiService.ts`)

All Gemini API calls are centralized here. Uses `getEnvClient()` which reads `process.env.API_KEY`. Key functions:

| Function | Model | Purpose |
|---|---|---|
| `enhancePrompt()` | `gemini-2.5-flash` | Improves user prompts for image/video generation |
| `enhanceAgentPrompt()` | `gemini-2.5-flash` | Generates system prompts from role/context/instruction |
| `generateImage()` | `gemini-2.5-flash` | Generates images from text prompts |
| `generateVideo()` | `veo-3.1-fast-generate-preview` | Generates videos with polling loop |
| `sendConsultantMessage()` | `gemini-2.5-flash` | Multi-turn career consultant chat |
| `analyzeBusiness()` | `gemini-2.5-flash` | Business analysis with Google Search grounding |

### Shared Components

- **`Layout`** — wraps every page. Sticky promo banner, optional back button + title header, footer.
- **`CTAModal`** — promotional modal triggered after interaction thresholds. Links to the campaign URL.
- **`BackgroundGradient`** — animated gradient background rendered behind all pages.
- **`AdminPanel`** — floating debug panel (admin-only) showing interaction counts and CTA states.

### Page Components

- **`Home`** — Landing page with day navigation cards. Respects unlock schedule.
- **`Day1`** (~1138 lines) — Multi-slide presentation with flip cards, recharts, token predictor demo, prompt engineering techniques. All slide data is inlined.
- **`Day2`** — Image and video generation studio with prompt enhancement.
- **`Day4`** — Business URL analysis. Gemini analyzes with search grounding, returns AI agent proposals.
- **`AgentCatalog`** — Browsable catalog of pre-built AI agent templates with categories (work/personal), difficulty levels, and copyable system prompts. Data in `agentCatalogData.ts` and `agentMenuData.ts`.

### Data Files

- **`agentCatalogData.ts`** — Full agent catalog with system prompts, tags, difficulty, use cases.
- **`agentMenuData.ts`** — Lighter agent templates for the Day 4 menu (work + personal categories).
- **`constants.ts`** — Brand colors (`COLORS`), `IA_HEROES_CONTEXT` (course description injected into AI prompts), and system prompt templates.

## Conventions

### Language
- All UI text, comments, prompts, and content are in **Spanish**.
- Variable names, component names, and code structure use **English**.

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not CDN). Imported in `styles.css` with `@import "tailwindcss"`.
- Custom animations (gradient, flip cards, float) defined in `styles.css` and `index.html` `<style>` block.
- Brand colors in `constants.ts` as `COLORS`: primary `#243F4C` (dark teal), accent `#FF2878` (pink).
- Responsive design via Tailwind's `md:` breakpoint.

### Component Patterns
- Functional components with `React.FC<Props>` typing.
- State via `useState` and `useRef` — no external state library.
- Each day component manages its own loading, error, and CTA modal state.
- `AdminContext` is the only React context — provides `isAdmin` boolean globally.

### AI Integration
- All AI interactions go through `services/geminiService.ts` — never call the Gemini SDK directly from components.
- System prompts stored as template literals in `constants.ts`.
- `IA_HEROES_CONTEXT` contains the full course description and is injected into prompts as knowledge base context.

## Key URLs

- **Campaign CTA**: `https://live.learningheroes.com/iah-artefact`
- **Day 3 redirect**: `https://programas.learningheroes.com/ia-heroes/reserva-llamada?utm_campaign=IAH14&utm_source=Live&utm_medium=artefacto&utm_content=day3`
- **GTM Container**: `GTM-T9Z4CT8B`

## Deployment

Vercel with `vercel.json`: framework `vite`, build command `npm run build`, output `dist`.
