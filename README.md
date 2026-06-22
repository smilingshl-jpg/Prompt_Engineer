# PromptStudio

PromptStudio is an AI prompt optimization workspace that helps users transform vague ideas into highly structured, optimized AI instructions.

## Core workflow

```
User prompt
  → AI analysis
  → Adaptive clarification quiz
  → Parameter optimization
  → Structured prompt construction
  → Deep optimization pass
  → Final optimized prompt
```

## Key features

- Adaptive prompt quiz
- Prompt structure builder
- Multipass AI optimization
- Parameter control panel
- Prompt history
- Preference memory
- Workflow expansion

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** (dev server & build)
- **Tailwind CSS 4**
- **lucide-react** (icons), **react-router-dom 7**
- Provider SDKs: **OpenAI**, **@anthropic-ai/sdk**, **@google/generative-ai**

## Getting started

> Requires **Node 20.19+ or 22.12+** (Vite 8). Check with `node -v`.

The runnable app lives in `frontend/`:

```bash
cd frontend
npm install
npm run dev        # Vite dev server → http://localhost:5173
```

### Available scripts (run inside `frontend/`)

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the dev server with HMR         |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Run ESLint                            |

## API keys

No `.env` file is required. Provider API keys (OpenAI, Anthropic, Gemini) are entered in the app's **Settings** panel at runtime and used directly from the browser.

> Note: Anthropic blocks browser calls by default; using the Anthropic provider from the client may require a CORS proxy.

## Project structure

```
Prompt_Engineer/
├── frontend/              # The runnable Vite + React + TS app
│   ├── index.html         # Entry HTML → /src/main.tsx
│   ├── src/
│   │   ├── main.tsx       # App bootstrap
│   │   ├── App.tsx        # Root component
│   │   ├── components/
│   │   │   ├── layout/    # Header, sidebars, center panel
│   │   │   └── tabs/      # Workspace & Models layouts
│   │   ├── hooks/         # usePromptState
│   │   └── services/      # aiService — provider API calls
│   ├── vite.config.ts, tailwind.config.js, tsconfig*.json
│   └── package.json
├── Docs/                  # PRD, architecture, features, research (reference only)
└── design/               # Wireframes, color/design specs, HTML mockups (reference only)
```

> Only `frontend/` runs. `Docs/` and `design/` are reference material and the top-level `src/layout/` files are early mockups not wired into the app.

## Design philosophy

- NotebookLM layout
- Vercel visual style
- AI workspace interaction model

## Primary goal

Build the most optimized AI prompts possible through intelligent questioning and structured prompt engineering.
