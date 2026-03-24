---
name: looper-ai-features
description: "AI interaction patterns for Looper.AI. Use this skill whenever building the lesson sidebar, copilot features, AI reasoning displays, live lesson timelines, confidence visualization, streaming insights, phase detection UI, ambient intelligence panels, coach suggestion cards, pre-session briefings, post-session summaries, 'Ask Looper' chat overlays, or any feature where the AI's thinking is visible to the user. Also trigger for mock data fixtures and simulated AI responses in prototypes."
---

# Looper.AI AI Feature Patterns

## Core Principle
The AI shows its thinking. Not spinners, not "loading," not results that appear from nowhere. The coach sees the AI processing, reasoning, and arriving at conclusions — like watching a colleague think through a problem in real time. This is what makes Looper different from every other tool in the bay.

## 1. Live Lesson Timeline

The sidebar's primary structure. A vertical timeline (not horizontal — 420-480px width constraint) showing four auto-detected lesson phases.

### Phases
- **Catch-up** (~5 min): Background color subtle blue-gray tint on dark surface. Icon: `MessageSquare` from lucide-react.
- **Diagnosis** (~15 min): Background subtle amber tint. Icon: `Search`.
- **Intervention** (~20 min): Background subtle teal tint. Icon: `Lightbulb`.
- **Review** (~5 min): Background subtle green tint. Icon: `ClipboardCheck`.

### Visual States
- **Current phase**: Expanded, shows scrollable feed of AI observations. Subtle pulse animation on the phase indicator (CSS `@keyframes pulse` on a 4px dot, 2s cycle). Full opacity.
- **Past phases**: Collapsed to single line — phase name, duration, key finding. 60% opacity. Tap to expand.
- **Future phases**: Muted label only. 30% opacity. No interaction.

### Phase Transition
When the AI detects a shift (e.g., diagnosis → intervention):
- Brief highlight animation (border flash in phase color, 400ms)
- Transition label appears: "Coach shifted to drill work — cataloging intervention" in 12px Space Mono, muted color
- New phase expands, previous phase collapses with 300ms ease-out

### Auto-Detection
Phase detection comes from audio context and data flow patterns — not manual triggers. For the prototype, simulate with timed transitions or a "advance phase" button hidden in a debug menu. In the mock scenario, phases advance based on shot count: shots 1-3 = catch-up, shots 4-10 = diagnosis, shots 11-13 = intervention, shot 14 = review.

## 2. Visible AI Reasoning

### Thinking Indicator
A small element that shows the AI is actively processing:
- Structure: 4px pulsing dot (accent color #10B981) + label text
- Label: 12px Space Mono, muted color (#8B99A8)
- Examples: "Analyzing strike pattern..." / "Processing shot 7..." / "Detecting phase transition..." / "Comparing to last 3 sessions..."
- Position: Top of the current phase section, below phase header
- Animation: dot pulses (opacity 0.4 → 1.0, 1.5s ease-in-out infinite)

### Streaming Text
AI observations appear word-by-word, not all at once:
- Render using a `useEffect` with `setInterval` at 30-50ms per word
- Each word appends to visible text, with a blinking cursor at the end
- When complete, cursor disappears and text reaches full opacity
- Processing steps: 12px Space Mono, color #8B99A8
- Key findings: 13px DM Sans, color #E8ECF1 (dark mode heading color)

### Example Rendering (Diagnosis Phase)
```
[pulsing dot] Analyzing strike pattern...

  Processing 8 shots with 7-iron...
  Face-to-path volatility: σ = 3.2°
  Impact location clustering: 0.4" toe-biased

  Strike variability is the primary limiter.
  Confidence: 74% — building with more data.
```
The first three lines stream in Space Mono muted. The last two lines stream in DM Sans at standard weight — these are the key findings.

## 3. Insight Cards

The primary content unit in the sidebar. Cards appear when the AI has something useful to surface.

### Structure (fits within 420-480px sidebar minus 16px padding)
```
┌─────────────────────────────────────┐
│ DIAGNOSIS          2:34 PM          │  ← phase tag (10px Space Mono caps, muted) + timestamp
│                                     │
│ Strike pattern is 0.4" toe-biased   │  ← insight text (13px DM Sans, 1-2 sentences max)
│ across last 6 shots. This is the    │
│ likely source of the fade.          │
│                                     │
│ [74% confidence]     [Why?]         │  ← confidence badge + expand button
└─────────────────────────────────────┘
```

### Visual Specs
- Background: #1E2A36 (dark mode card surface)
- Border: 1px solid #2A3544. Left border 3px in phase color.
- Border radius: 6px (never more than 8px anywhere in Looper)
- Padding: 10px
- Phase tag: 10px Space Mono, uppercase, muted (#5E6E7E)
- Timestamp: 10px Space Mono, right-aligned, muted
- Insight text: 13px DM Sans, #E8ECF1
- Confidence badge: pill shape, 10px Space Mono
  - High (≥85%): bg #0FA87A at 15% opacity, text #0FA87A
  - Medium (60-84%): bg #D4980B at 15% opacity, text #D4980B
  - Low (<60%): border 1px dashed #C93B3B, text #C93B3B, no fill
- "Why?" button: text-only, 11px DM Sans, accent color #10B981

### Behavior
- Maximum 2-3 cards visible at once in ambient mode. Older cards scroll up.
- New cards build progressively (streaming text pattern from section 2)
- Cards enter with a subtle slide-up animation (translateY 8px → 0, 200ms ease-out)
- Tap card body: expands to show additional context (2-3 more sentences)
- Swipe left: dismiss (slide out with 150ms ease-in)
- Long-press: flag for post-session review (subtle star icon appears)

## 4. Confidence That Evolves

During the diagnosis phase, confidence starts low and visibly increases as more shots are captured and patterns emerge.

### Visual
- Small arc or circular progress indicator, 28px diameter
- Positioned beside the phase header or inside the thinking indicator area
- Fills clockwise as confidence increases
- Color follows confidence thresholds: starts red outline (<60%), transitions to amber (60-84%), then green (≥85%)

### Label Progression (streams as text updates)
- Shot 4: "Forming hypothesis..." (no percentage shown)
- Shot 6: "Building confidence... 52%" (amber)
- Shot 8: "Gaining clarity... 68%" (amber)
- Shot 10: "High confidence: 82%" (transitions to green)
- Shot 12: "Strike variability is the primary limiter. 87% confidence." (green, stable)

### Principle
The coach watches the AI earn its conclusions. This is the trust-building pattern. Never show high confidence on few shots. Never jump from 0% to 85%. The progression should feel earned.

## 5. Coach Suggestion Pattern

During the intervention phase, the AI suggests drills or cues based on the diagnosis.

### Suggestion Card Structure
```
┌─────────────────────────────────────┐
│ SUGGESTED DRILL                     │
│                                     │
│ Gate Drill — Strike Centering       │  ← drill name (14px DM Sans semi-bold)
│                                     │
│ [External]  [Moderate]              │  ← type badge + difficulty badge
│                                     │
│ Targets toe-bias pattern.           │  ← expected effect (12px DM Sans)
│ Expected: 40% reduction in          │
│ horizontal dispersion.              │
│                                     │
│ [82% confidence]     [Why?] [Alt]   │  ← confidence + expand + alternatives
└─────────────────────────────────────┘
```

### Type Badges
- External: bg #0D7C66 at 15% opacity, text #10B981
- Internal: bg #6366F1 at 15% opacity, text #818CF8
- Constraint: bg #D4980B at 15% opacity, text #D4980B

### Coach Actions
- **Accept**: Tap the card body. Card briefly highlights green, then collapses to a single line: "Gate Drill — tracking response"
- **Dismiss**: Swipe left. Card exits. AI logs: "Coach declined suggestion"
- **Alternatives**: Tap "Alt" button. Card expands to show 1-2 alternative drills ranked by expected benefit.
- **Coach picks something else entirely**: AI shows brief acknowledgment at the top of the feed: "Noted — tracking response to coach's selection" in 11px Space Mono, muted. This is the RLHF moment. Keep it subtle — one line, no modal, no interruption.

## 6. Pre-Session Briefing

Auto-assembled in the Coach Portal from the persistent record. When the lesson starts and the sidebar activates, the briefing content seeds the Catch-up phase.

### Content Sections (rendered as a single scrollable card in the portal)
- **Last session**: Date, primary focus, key outcome (1-2 sentences)
- **Since last session**: Practice activity (from Arccos/WHOOP if connected), rounds played, handicap change
- **Player goals**: Stated goals from the coaching program
- **Suggested focus**: AI's recommendation for today based on trends
- **Data freshness**: Small indicator — green dot (<24h since last data sync), amber (1-7d), red outline (>7d)

### Portal Layout
Single card, full-width, with clear section dividers. Light mode. Each section: header in 12px Space Mono caps muted, content in 14px DM Sans. "Start Lesson" button at bottom that opens the sidebar view.

### Sidebar Handoff
When the sidebar activates, the briefing content appears as the first content inside the Catch-up phase — compressed to 2-3 key points, not the full portal view.

## 7. Post-Session Summary

Lives in the Coach Portal (detailed mode), not the sidebar. This is the persistent record.

### Structure
Organized by phase. Each phase section contains:
- Phase header with duration and timestamp range
- AI observations (editable — coach can correct or annotate)
- Data captured (shot metrics, trends)
- Interventions logged (drills used, cues given, player response)
- Key metrics (before/after comparisons where applicable)

### Editable Fields
- Every AI observation has a small edit icon (lucide `Pencil`, 14px). Tap to inline-edit.
- Coach can add free-text notes to any phase section.
- Corrections are logged with a subtle "Coach edited" indicator — this is training data.

### Action Buttons
- "Generate Practice Plan": Produces a structured plan based on session findings
- "Share with Player": Produces a simplified version in plain language for the Player Portal
- "Flag for Follow-up": Marks specific observations for the next pre-session briefing

## 8. "Ask Looper" Chat Overlay (Player Portal)

### Trigger
Floating button, bottom-right corner of the Player Portal. 48px circle, accent color (#0D7C66), lucide `MessageCircle` icon in white.

### Chat Interface
- Opens as a bottom sheet (mobile) or right-side panel (desktop)
- Dark header bar with "Ask Looper" title
- Message bubbles: player messages right-aligned (light bg), Looper responses left-aligned (subtle teal tint)
- Looper responses stream word-by-word (same pattern as insight cards)
- Response tone: encouraging, clear, never technical unless the player asks for depth

### Source Attribution
Every Looper response that draws on session data includes a source line:
- "Based on your last 3 sessions with Coach Thompson"
- "From your Arccos data, March 12-18"
- Rendered in 11px Space Mono, muted, below the response bubble

### Example Exchange
```
Player: "Am I getting better at iron shots?"

Looper: "Yes — your strike consistency has improved
measurably over the last 4 sessions. Your dispersion
with 7-iron tightened from 24 yards to 18 yards
side-to-side. Coach Thompson's focus on ball position
seems to be working.

Keep practicing the gate drill — your centered
strike rate went from 45% to 62%."

Based on sessions 11-14 with Coach Thompson
```

## 9. Mock Data Fixtures

For prototyping. All prototypes use hardcoded data that tells a compelling story.

### Demo Scenario
- **Coach**: M. Thompson (15 years experience, 6-handicap, external-focus preference)
- **Player**: Moe Norman (12-handicap, 2 years with Coach Thompson, goal: break 80)
- **Session**: #14 in ongoing program. Focus: iron strike consistency.
- **Context**: Last session (#13) focused on ball position. Player practiced 2x since. Handicap dropped from 12.4 to 12.1.

### Mock Shot Data (14 shots, 7-iron)
Use realistic ranges: ball speed 115-125 mph, launch 16-19°, spin 5800-6800 rpm, carry 155-170 yards. Vary impact location to show the toe-bias pattern (average +0.4" toe, with improving trend on shots 11-14 after intervention).

### Mock Phase Content
- **Catch-up** (shots 1-3): AI surfaces: "Last session focused on ball position. Player practiced 2x this week. Handicap 12.1, down from 12.4."
- **Diagnosis** (shots 4-10): AI detects toe-bias strike pattern, face-to-path volatility. Confidence builds from 45% → 74% as shots accumulate.
- **Intervention** (shots 11-13): Coach selects Gate Drill (external cue). AI tracks response: centered strikes improve from 2/7 to 2/3 post-drill.
- **Review** (shot 14): AI summary: "Strike dispersion tightened 22%. Toe bias reduced. Recommend continued gate drill practice 3x before next session."

### File Location
Store mock data as a JSON file at `.claude/skills/looper-ai-features/references/mock-responses.json` for reference, but in actual prototypes, hardcode the data directly in the components for simplicity.
