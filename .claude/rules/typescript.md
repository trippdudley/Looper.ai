---
globs: "**/*.tsx,**/*.ts"
---

# TypeScript Rules for Looper.AI

- Use strict mode
- Prefer const over let
- Explicit return types on exported functions
- Tailwind utility classes only, never inline style props
- Import lucide-react icons individually: import { ChevronRight } from 'lucide-react'
- Data values: Space Mono font class
- Body text: DM Sans font class
- No emoji characters in JSX
- PascalCase component names, files match: MetricCard.tsx exports MetricCard
- Sidebar components prefixed: SidebarInsightCard, SidebarTimeline
- Portal components prefixed: PortalDashboard, PortalRoster
