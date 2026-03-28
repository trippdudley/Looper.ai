---
globs: "**/*.tsx,**/*.ts"
---

# TypeScript Rules for Looper.AI

## Universal
- Use strict mode
- Prefer const over let
- Explicit return types on exported functions
- No emoji characters in JSX or React Native JSX
- PascalCase component names, files match: MetricCard.tsx exports MetricCard

## Web App (src/)
- Coach Portal + Lesson Sidebar: Tailwind utility classes preferred
- Player Portal (`src/personas/player/`): uses inline style tokens (`C`, `F`, `S` from `data/tokens.ts`) — this is intentional and matches the WHOOP-inspired dark mode design system. Do not convert to Tailwind.
- Import lucide-react icons individually: `import { ChevronRight } from 'lucide-react'`
- Data values: Space Mono font class
- Body text: DM Sans font class
- Sidebar components prefixed: SidebarInsightCard, SidebarTimeline
- Portal components prefixed: PortalDashboard, PortalRoster

## Coach App (packages/coach-app/)
- Styling: React Native `StyleSheet.create()` — NOT Tailwind class strings in JSX
- NativeWind is available but use StyleSheet for consistency with existing screens
- All styles in StyleSheet.create() at bottom of file, referenced as `styles.xxx`
- Font families: `fontFamily: 'DMSans'` for body/UI, `fontFamily: 'SpaceMono'` for data/metrics
- Colors from design tokens — use the dark mode palette constants:
  - bg: `#0C1117`, surface: `#151D28`, surfaceAlt: `#1E2A36`
  - accent: `#10B981`, border: `#2A3A4A`
  - text primary: `#E8ECF1`, secondary: `#8B99A8`, tertiary: `#5E6E7E`
- No lucide-react in React Native (different rendering) — use inline SVG via react-native-svg or simple geometric views
- Expo Router navigation: `useRouter()` for programmatic nav, `useLocalSearchParams()` for params
- `async function handleX(): Promise<void>` pattern for all event handlers that do async work
- Never use `any` — prefer `unknown` with type guards

## Shared Package (packages/shared/)
- Pure TypeScript — no React, no RN, no browser APIs
- Types only export from `src/types/index.ts`
- Utilities in `src/utils/` — pure functions, no side effects
- Import in coach app: `import { ... } from '@looper/shared'`
- Import in web app: `import { ... } from '../../packages/shared/src'` (or configure path alias)

## Supabase / Database
- Always use `.eq()` not `.filter()` for exact matches
- Always handle `error` from Supabase calls — log or surface to user
- RLS is always on — never write queries that rely on admin bypass
- Use typed Database interface from `services/supabase.ts`

# currentDate
Today's date is 2026-03-26.
