# Looper.AI Design Principles

## Brand Purpose
Looper.AI is an AI-native coaching copilot for golf practitioners. Memory enables intelligence: a persistent record that builds itself through ambient capture powers a copilot that thinks alongside coaches in real time and helps players improve between lessons. The brand exists to help serious practitioners scale their expertise — not by replacing their judgment, but by giving them a thinking partner that keeps up.

## Positioning
- **Category:** AI-native coaching intelligence for golf
- **Role:** The coaching copilot
- **Thesis:** Memory enables intelligence. Record → Intelligence → Compounding insight.
- **Tagline:** Expertise, engineered.

## Core Strategic Principles

### 1. Build for practitioners, not spectators
The primary audience is academy directors and elite instructors. Every design choice should respect their intelligence, their skepticism, and their need for tools that work in real lesson environments.

### 2. Precision over hype
Looper.AI should never look or sound like a generic AI startup. Avoid visual or verbal cues that imply black-box magic. Favor clarity, calibration, and technical honesty.

### 3. Think alongside, don't replace
The product does not replace the practitioner. It thinks alongside them — processing data, detecting patterns, surfacing insights, and suggesting next steps with visible reasoning. The coach is always in control. The AI earns trust by showing its work.

### 4. Show reasoning, not just results
The interface and identity should reinforce that Looper.AI is a thinking partner, not a black box. The AI's reasoning is visible — streaming text, evolving confidence, phase detection — so the coach can see how it arrives at conclusions.

### 5. Treat uncertainty as a feature
Uncertainty is honest. The brand should favor confidence ranges, tolerance bands, and probability-informed language over false precision. Confidence starts low and visibly grows as data accumulates. The coach watches the AI earn its conclusions.

## Product Architecture

### Two Portals. Two Personas. One Intelligence.

**Coach Experience — Two Form Factors:**

1. **Coach Portal** (full web app, desktop-first, full-width): The between-lesson command center. Dashboard with upcoming lessons and player status. Player roster with longitudinal progress. Session history searchable by player, date, or topic. Practice plan builder. Program design tools. Post-session detailed view with full lesson record expanded by phase, editable by coach.

2. **Lesson Sidebar** (narrow web app, 420-480px, dark mode): The in-lesson copilot. Shares the coach's monitor with TrackMan Performance Studio via Windows snap layout (~75/25 split on 1920x1080). Contains the live lesson timeline with auto-detected phases, visible AI reasoning, ambient insight cards, and drill suggestions. The coach glances at this between shots — not studies it.

**Player Experience — One Form Factor:**

- **Player Portal** (mobile-first Progressive Web App, 480px): Dashboard, Practice, Rounds, My Journey. The timeline is the data model — My Journey is the full chronological record, other tabs are filtered lenses. "Ask Looper" chat overlay for questions between lessons. Session recaps in plain language.

### The Live Lesson Timeline

The signature interaction pattern, rendered within the Lesson Sidebar. Four phases auto-detected from audio context and data flow — no manual triggers:

- **Catch-up** (~first 5 min): AI surfaces context from the persistent record
- **Diagnosis** (~next 15 min): AI processes launch monitor data, identifies patterns, flags limiting factors with evolving confidence
- **Intervention** (~next 20 min): AI catalogs drills and cues, tracks response data, suggests alternatives
- **Review** (~final minutes): AI assembles session summary, drafts practice plan

Vertical timeline (sidebar width constraint). Current phase expanded, past phases collapsed, future phases muted.

### Two Modes

- **Ambient mode** (during lesson, in sidebar): Compact, glanceable, max 2-3 insight cards visible. The coach is coaching, not reading a screen.
- **Detailed mode** (after lesson, in Coach Portal): Full structured record expanded by phase, complete data, editable by coach.

## Visual Identity

### Color System

**Light mode (primary — default for Coach Portal and Player Portal)**
- Background: #F6F7F9 (page), #FFFFFF (cards), #F0F2F5 (nested cards)
- Borders: #DFE2E7 (primary), #ECEEF2 (subtle)
- Text: #1A1F2B (headings), #4B5563 (body), #9CA3AF (muted labels)
- Brand accent: #0D7C66 (deep teal — CTAs, links, .AI in logo)
- Confidence: #0FA87A (high), #D4980B (caution), #C93B3B (flag)

**Dark mode (Lesson Sidebar — bay environments)**
- Background: #0C1117 (page), #151D28 (surface), #1E2A36 (cards)
- Text: #E8ECF1 (headings), #8B99A8 (body), #5E6E7E (muted)
- Accent: #10B981 (emerald — adjusted for dark context)

### Typography System — Split Voice Architecture

**Brand voice — Cabinet Grotesk (Fontshare, free for commercial use)**
- 800 weight: Wordmark, display headings
- 500 weight: Section headings, subheads
- 400 weight: Body text, long-form copy
- Humanist geometry with visible character — the R, O, and P have distinctive shapes

**Data voice — Space Mono (Google Fonts)**
- 700 weight: Metric values, primary data points
- 400 weight: Labels, captions, confidence intervals, table data
- Industrial precision — numbers feel machine-generated, not hand-written

**Editorial voice — Instrument Serif italic (Google Fonts)**
- Used sparingly: taglines, pull quotes, editorial moments only
- Never for body text or data

### Visual Identity Principles

**1. Clinical light foundation with surgical precision**
The primary product identity is light, clean, and high-contrast. Deep teal accent is the single punctuation mark against a near-white canvas. Dark mode exists for the Lesson Sidebar in bay environments, not as the default brand expression.

**2. Dense information, zero decoration**
The design language takes cues from tools like Bloomberg Terminal and Strava. Every element earns its space. No ornamental graphics, no illustrative icons, no visual filler.

**3. Geometric layout discipline**
All cards in a row are equal size. All gaps are consistent. All edges align. If it doesn't snap to the grid, it doesn't ship.

**4. Product visuals should feel like a lab**
Imagery focuses on strike maps, screens, bays, and practitioners in real environments. No stock golf imagery, scenic fairways, or lifestyle photography.

**5. Use interface cues from engineering systems**
Grids, coordinate systems, contour maps, and measurement overlays shape the visual language. No neural-net graphics, glowing brains, or generic AI iconography.

## Logo Principles

### 1. The logo must survive at small scale
The primary mark must remain recognizable at app-icon size and in embroidery. Complexity is the enemy.

### 2. The wordmark uses Cabinet Grotesk 800
LOOPER in near-black (#1A1F2B), .AI in deep teal (#0D7C66). Letter-spacing: 0.05-0.06em. The split color treatment on .AI is the primary brand signature.

### 3. ".AI" is part of the identity
The suffix is treated as a deliberate part of the wordmark, not a web extension or afterthought.

### 4. Avoid illustrative golf cliches
No golf balls, flags, clubs, grass textures, or literal swing silhouettes unless abstracted beyond recognition.

## Color Principles

### Primary palette
- Clinical light foundation (#F6F7F9) with white cards
- Deep teal accent (#0D7C66) — single calibrated brand color
- Near-black text (#1A1F2B) for maximum contrast

### Functional guidance
- Confidence high: #0FA87A (bright teal-green)
- Caution: #D4980B (deep gold)
- Flag: #C93B3B (muted red)
- All semantic colors use tinted badge backgrounds (color at 10-12% opacity)
- Colors must work in bright lesson bays and dark simulator environments

### Avoid
- Royal blue (associated with TrackMan)
- Bright emerald green (too generic for tech)
- Bright red as a primary brand color
- Rainbow systems, gaming gradients, and consumer-tech glow effects

## Typography Principles

### 1. Split voice architecture
Brand voice (Cabinet Grotesk) for human-readable content. Data voice (Space Mono) for machine-generated values. Never mix them — no Cabinet Grotesk for numbers in data cards, no Space Mono for body paragraphs.

### 2. Pair with monospaced for data
Metrics, confidence intervals, and tabular information use Space Mono to reinforce technical credibility and ensure tabular alignment.

### 3. Favor readability over personality
Type should feel sober, modern, and precise. The typography supports serious work, not announces itself.

## Product UI Principles

### 1. Two form factors, one intelligence
The Coach Portal is the command center for between-lesson work — full-width, information-dense, designed for deliberate use. The Lesson Sidebar is the in-lesson copilot — 420-480px wide, dark mode, ultra-compact, designed for glances between shots. Every feature belongs to one or both. Never design for a generic "the product."

### 2. The sidebar thinks alongside the coach
During a lesson, the AI is visibly processing — detecting lesson phases, analyzing incoming data, cataloging observations. The coach sees the AI working, not just its conclusions. Visible reasoning builds trust. This is what makes Looper different from every other tool in the bay.

### 3. The live lesson timeline is the sidebar's primary structure
Four auto-detected phases (Catch-up → Diagnosis → Intervention → Review) displayed as a vertical progression within the sidebar. Everything in the sidebar is organized by when it happened in the lesson, not by data category.

### 4. Information comes to the practitioner
Insight cards appear when the AI has something useful. Drill suggestions surface during intervention phase. Pre-session briefings auto-assemble in the portal before the lesson starts. The practitioner should never have to go looking for information. Push over pull.

### 5. Confidence is always visible and always evolving
During diagnosis, confidence starts low and visibly grows as data accumulates. The coach watches the AI earn its conclusions. A small confidence indicator animates upward as shots accumulate and patterns emerge. No assertion without evidence. No false precision.

### 6. The practitioner can always override, and the system learns
When a coach selects a different drill than suggested, or corrects an AI observation, the system acknowledges the override and logs it as a learning signal. Show this moment — it's the product's core training loop and a key differentiator.

### 7. Build for the moment, not the screen
A pre-session briefing (portal), an in-lesson phase card (sidebar), a post-session summary (portal), a between-lesson digest (portal), a player practice reminder (player portal). Each moment has its own optimal density and format. Don't force everything into one layout.

### 8. Use probability-native visuals
Dispersion maps, confidence ellipses, expected improvement bands, and strike clusters are signature product elements. Every visualization needs both a portal variant (full-width, detailed) and a sidebar variant (compact, sparkline-style).

### 9. Surface diagnostics clearly
Recommendations are tied to diagnosis, expected gain, and confidence level. No recommendation without reasoning. The "Why?" button is always available.

### 10. Phase taxonomy is internal, not user-facing (March 23)
The four-phase lesson model (Catch-up, Diagnosis, Intervention, Review) drives Looper's ambient capture and AI processing. It is never exposed to coaches or players as labels, indicators, or framework. Lesson records describe what happened in natural coaching language. The coach's mental model is "we worked on iron strike," not "the Diagnosis phase identified a toe bias."

### 11. The Player Journey is a shared, time-centric visualization (March 23)
The Player Journey is a horizontally scrollable three-layer timeline (Lessons, Rounds/Handicap, Strokes Gained) on a shared date-based time axis. It is a shared component rendering in both Coach Portal and Player Portal. The time axis is continuous — lessons are events on the calendar, not the calendar itself. The space between lessons shows the player's on-course life and is as informative as the lessons themselves.

### 12. Coaching threads are AI-inferred narratives (March 23)
Coaching themes that connect related lessons are visualized as curved thread lines on the Player Journey. These themes are unique per player and inferred by AI from lesson content. They are not a fixed taxonomy or pre-defined category system. The visualization shows how coaching themes evolve, branch, resurface, and merge over the life of a coaching relationship.

### 13. Looper Insight is a practical briefing (March 23)
AI insights on player profiles follow a three-part briefing format: (1) last session recap, (2) on-course status, (3) recommendation for next session. The tone is direct and practical. No academic language, no biomechanics explanations unless directly relevant to the recommendation.

## Sidebar-Specific Design Constraints

- Width: 420-480px. Shares coach monitor with TPS at ~75/25 split.
- Dark mode default (#0C1117 background).
- All text must be legible: body 13px, data values 14-16px Space Mono.
- No horizontal card layouts wider than 2 data points per row. Vertical stacking for everything else.
- Insight cards: 1-2 sentences max. Expand on tap for detail.
- Charts: compact, vertical-scroll-friendly variants only (sparklines, small dispersion, compact bar).
- Vertical timeline as primary navigation, not horizontal tabs.
- Maximum 2-3 insight cards visible at a time.

## Voice and Tone Principles

### 1. Sound like the smartest colleague in the room
Be clear, calm, and grounded. Explain reasoning without condescension.

### 2. Use practitioner language naturally
Use golf terms like strike, carry window, dispersion, club path, and face control with fluency. Never use AI/ML jargon in customer-facing content.

### 3. Be direct
Prefer short, precise statements over inflated claims.

### 4. Replace certainty theater with calibrated confidence
Say "expected improvement" or "with 84% confidence," not "guaranteed optimization."

### 5. The practitioner is the hero
Never position AI as replacing the coach. Always: thinking alongside, augmenting, systematizing, empowering. Never say "Our AI" as a separate entity making decisions. The system is Looper, not "Looper's AI."

## What Looper.AI Should Feel Like
Looper.AI should feel like a serious piece of professional intelligence infrastructure: part coaching copilot, part engineering instrument, part thinking partner for expertise.

It should not feel like:
- a gadget
- a golf lifestyle brand
- a generic AI startup
- a consumer performance app
- another dark-mode SaaS dashboard
- a filing cabinet with a chat interface

It should feel like:
- a thinking partner that keeps up with the coach
- visible intelligence, not hidden magic
- a decision system that shows its work
- a tool built by people who respect the craft
- a lab instrument with clinical precision

The Player Journey should feel like a coaching autobiography — a continuous narrative of the player's golf evolution, with lessons, rounds, performance data, and coaching themes woven together on a single timeline. It should make the persistent record tangible and the coaching relationship visible.

## Brand Test
Before approving any design, ask:

1. Does this help the brand feel more engineering-grade?
2. Does this respect the intelligence of elite practitioners?
3. Does this avoid generic AI startup cues?
4. Would this look credible on a coach's monitor beside TrackMan, in an investor deck, and in a player's pocket?
5. Does this make Looper.AI feel like infrastructure, not decoration?
6. Are all elements geometrically aligned, consistently sized, and visually organized?
7. Does the AI's reasoning feel visible and trustworthy, not hidden or magical?

If the answer is no, keep refining.
