# Looper.AI

**Expertise, engineered.** — The decision platform for golf coaching and fitting.

## What is Looper.AI?

Looper.AI integrates three systems that don't exist today in the golf instruction industry:

1. **The Coaching Record** — Persistent, structured capture of coaching sessions with audio transcription, video, launch monitor data, prescribed drills, and outcome tracking
2. **The Coaching Intelligence Engine** — AI trained on real coaching outcomes, matching prescriptions to measured improvements
3. **The Unified Data Spine** — A structured golfer profile that persists across coaches, facilities, and years

## Demo Overview

This prototype demonstrates the full product vision through four personas:

| Persona | Route | Description |
|---------|-------|-------------|
| **Golfer** | `/golfer` | Mobile app — track improvement, review lessons, practice with purpose |
| **Coach** | `/coach` | Desktop dashboard — capture sessions, diagnose limiting factors, see what works |
| **Fitter** | `/fitter` | Desktop dashboard — fit with full context, AI-powered equipment recommendations |
| **Platform** | `/spine` | Internal view — data spine, audience engine, integration hub |

### Additional Pages

- `/vision` — 90-second animated product walkthrough (sizzle reel)
- `/narrative` — Full narrative: thesis, problem, solution, flywheel, business model
- `/thesis` — Business case with market sizing and five-year model

### Demo Walkthrough (recommended order)

1. Start at `/` to see the persona selector
2. Enter **Coach** → Today → Start a Live Session (`/coach/live`)
3. After reviewing the session, see how data flows to the **Golfer** view (`/golfer/lessons`)
4. Check the **Fitter** AI Brief (`/fitter/brief`) — powered by coaching data
5. Explore the **Data Spine** (`/spine`) to see the full integration map

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS 4** with custom design tokens
- **Recharts** for data visualizations
- **Lucide React** for icons
- Liquid Glass design system with frosted panels, ambient gradients, and scroll reveal animations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build    # TypeScript check + Vite production build
npm run preview  # Serve the production build locally
```

## Project Structure

```
src/
├── pages/          # Top-level routes (PersonaSelector, CoachingOS, SizzleReel, ThesisPage)
├── personas/       # User role layouts + pages
│   ├── coach/      # 7 coach pages + layout
│   ├── golfer/     # 5 golfer pages + mobile layout
│   ├── fitter/     # 5 fitter pages + layout
│   └── spine/      # 3 platform pages + layout
├── components/
│   ├── ui/         # Reusable primitives (Card, MetricCard, Badge, Skeleton, ErrorBoundary)
│   ├── layout/     # Shell components (DesktopShell, MobileShell, Sidebar, TopBar)
│   ├── charts/     # Data visualizations
│   ├── sizzle/     # Animated scene components for the sizzle reel
│   └── ...         # Domain-specific components
├── data/           # Static mock data (golfers, sessions, drills, integrations)
├── hooks/          # Custom hooks (useCountUp, useStaggeredReveal, useTypewriter)
└── App.tsx         # Router with lazy-loaded routes and error boundaries
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#1C2B2D` | Primary text, headers |
| Accent | `#3A9D78` | Primary green, CTAs |
| Data Blue | `#4A90D9` | Charts, data highlights |
| Warm Amber | `#D4A843` | Secondary highlights |
| Coral | `#C45C4A` | Warnings, alerts |

**Confidential** — Clickable Prototype — March 2026
