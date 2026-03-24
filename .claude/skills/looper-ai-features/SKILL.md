---
name: looper-ai-features
description: "AI interaction patterns for Looper.AI. Use this skill whenever building the lesson sidebar, copilot features, AI reasoning displays, live lesson timelines, confidence visualization, streaming insights, phase detection UI, ambient intelligence panels, 'Ask Looper' chat overlays, pre-session briefings, post-session summaries, or any feature where the AI's thinking is visible. Also trigger for mock data fixtures and simulated AI responses."
---

# Looper.AI — AI Feature Patterns

Implementation reference for all AI-visible features in Looper.AI. Read this file completely before building any feature where the AI's reasoning is shown to the user.

## 1. Core Principle: Visible Intelligence

Looper's AI doesn't hide behind a spinner and deliver conclusions. It shows its work. The coach watches the AI think — forming hypotheses, building confidence, earning its recommendations. This is inspired by Claude's extended thinking display.

The coach sees the AI working, not just results. Every AI output has three qualities:
* **Progressive**: Content builds over time (streaming text, evolving confidence)
* **Transparent**: Reasoning is visible and expandable ("Why?" buttons)
* **Overridable**: The coach can always accept, dismiss, or override (the RLHF moment)

## 2. Phase System (Internal Only)

The lesson has four phases. These are AI detection logic only — they are NEVER surfaced to coaches as labels or framework.

| Internal Phase | User-Facing Label | What Happens |
|---|---|---|
| Catch-up | "Context" | AI surfaces persistent record: last session, practice compliance, suggested focus |
| Diagnosis | "Analysis" | AI processes shot data, flags limiting factors with evolving confidence |
| Intervention | "Working" | AI catalogs drills/cues, tracks response, suggests alternatives |
| Review | "Summary" | AI assembles summary, drafts practice plan, logs carry-forward items |

### Phase Indicator (Sidebar)

Horizontal dots with natural-language labels. Compact, 32px height.

```
● Context   ○ Analysis   ○ Working   ○ Summary
```

* Current phase: filled dot + label in CD.accent (#10B981), 10px Space Mono
* Past phases: filled dot + label in CD.muted (#5E6E7E)
* Future phases: empty ring + label in CD.dim (#3A4856)
* Transition: 300ms ease, dot fills, label color changes

**Rule**: Lesson records, session summaries, player-facing content, and all UI outside the sidebar NEVER show "Catch-up / Diagnosis / Intervention / Review." Use natural descriptions of what happened.

## 3. Thinking Indicator

Shows the AI is processing. Appears during transitions between insight cards.

### Visual
* Pulsing dot: 6px circle, CD.accent, animation: scale(1)→scale(1.3)→scale(1), opacity 0.4→1→0.4, 2s infinite
* Label: 12px Space Mono, CD.muted, inline with dot
* Examples: "Loading session context...", "Analyzing strike pattern...", "Cross-referencing session history..."
* Disappears when the next insight card arrives

### Animation
```css
@keyframes breathe {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
```

## 4. Streaming Text Effect

The sidebar's signature micro-interaction. When an insight card first appears, text builds character by character.

### Hook Implementation
```tsx
function useStreamingText(text, isActive, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive) { setDisplayed(text); setIsComplete(true); return; }
    setDisplayed('');
    setIsComplete(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, isActive, speed]);

  return { displayed, isComplete };
}
```

### Rules
* Speed: 18ms/char for body text, 25ms/char for thinking indicator (slower = more deliberate)
* Track `hasBeenVisited` per step — revisiting shows full text immediately (no re-streaming)
* Confidence badge and "Why?" button only appear AFTER text finishes streaming
* Blinking cursor: 2px wide, CD.accent, 530ms blink interval, at end of streaming text. Disappears when complete.

## 5. Insight Cards

The primary content unit in the sidebar. Cards appear when the AI has something useful to surface.

### Structure
```
┌─────────────────────────────────────────┐
│ ANALYSIS            2:34 PM             │  ← phase tag + timestamp
│                                         │
│ Face-to-path volatility: σ = 3.8°       │  ← insight text (1-2 sentences)
│ across 6 shots. Strike location         │
│ clustering 0.3" toe-side.               │
│                                         │
│ [52% confidence]         [Why?]         │  ← badge + expand button
└─────────────────────────────────────────┘
```

### Visual Specs
* Background: CD.surfaceAlt (`#1E2A36`)
* Border: 1px solid CD.borderSub (`#253342`). Left border 3px colored by confidence level.
* Border radius: 6px
* Padding: 10px 12px
* Phase tag: 10px Space Mono, uppercase, letter-spacing .08em, CD.muted
* Timestamp: 10px Space Mono, right-aligned, CD.muted
* Insight text: 13px DM Sans, CD.ink (`#E8ECF1`)
* Key findings: 13px DM Sans 500 weight (slightly bolder)

### Confidence Badge

Pill shape, 10px Space Mono 700:
* High (>=85%): bg CD.confBg, text CD.conf (`#10B981`)
* Medium (60-84%): bg CD.cautionBg, text CD.caution (`#EAB308`)
* Low (<60%): border 1px dashed CD.flag, text CD.flag (`#EF4444`), no fill

### "Why?" Button

11px DM Sans, CD.accent, text-only, no background. Expands card to show 2-3 sentences of reasoning below the main insight.

### Behavior
* Max 2-3 cards visible at once. Older cards scroll up.
* New cards enter with slide-up animation: translateY(8px)→0, opacity 0→1, 200ms ease-out
* Previous cards dim to opacity 0.7 when a new card arrives
* Key finding cards (high confidence) get slightly brighter treatment: accent-tinted background at 4% opacity

### Left Border Colors
* Low confidence (<60%): CD.flag (`#EF4444`)
* Medium confidence (60-84%): CD.caution (`#EAB308`)
* High confidence (>=85%): CD.conf (`#10B981`)
* Briefing/context cards: CD.accent (`#10B981`)

## 6. Confidence Arc

Visual indicator showing confidence level, positioned near the phase header area.

### SVG Implementation
```tsx
function ConfidenceArc({ value, size = 28 }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const color = value >= 85 ? CD.conf : value >= 60 ? CD.caution : CD.flag;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={CD.border} strokeWidth={3} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={color} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 600ms ease-out, stroke 300ms ease' }} />
    </svg>
  );
}
```

### Confidence Evolution Labels

As confidence grows during analysis, labels update:
* Shot 4: "Forming hypothesis..." (no percentage)
* Shot 6: "Building confidence... 52%" (amber)
* Shot 8: "Gaining clarity... 68%" (amber)
* Shot 10: "High confidence: 82%" (transitions to green)
* Shot 12: "Strike variability is the primary limiter. 87% confidence." (green, stable)

**Principle**: The coach watches the AI earn its conclusions.

## 7. Drill Suggestion Card

Appears during the Working phase. Distinct from insight cards — uses accent-tinted background.

### Structure
```
┌─────────────────────────────────────────┐
│ SUGGESTED DRILL                         │  ← 10px Space Mono uppercase, CD.accent
│                                         │
│ Alignment Stick Face Awareness    74%   │  ← 16px DM Sans 500 + confidence arc
│ [EXTERNAL]                              │  ← type badge pill
│                                         │
│ Promotes face awareness through         │  ← 13px DM Sans, CD.body
│ visual gate. Targets the open-face      │
│ pattern without internal cue overload.  │
│                                         │
│ ▾ Why?                                  │  ← expandable reasoning
│                                         │
│ [Accept]          [Alternatives]        │  ← action buttons
└─────────────────────────────────────────┘
```

### Visual Specs
* Background: CD.accentBg (`rgba(16,185,129,0.08)`)
* Left border: 3px solid CD.accent
* Border radius: 6px

### Type Badge (Cue Type)

Pill with colored background:
* **EXTERNAL**: bg CD.confBg, text CD.conf (green) — external focus cues
* **INTERNAL**: bg CD.cautionBg, text CD.caution (amber) — internal focus cues
* **CONSTRAINT**: bg CD.accentBg, text CD.accent (emerald) — constraint-based drills

### Buttons
* "Accept": bg CD.accent, text CD.bg, 11px Space Mono 700 uppercase, rounded 4px
* "Alternatives": border CD.borderSub, text CD.body, 11px Space Mono 700 uppercase, rounded 4px

### Coach Override (The RLHF Moment)

If the coach dismisses the suggestion or picks an alternative:
* Brief acknowledgment text: "Noted — tracking response to your selection"
* The coach's choice is logged as a human override
* This is the most valuable training signal in the system — a coach correcting an AI suggestion is structurally identical to RLHF

## 8. Pre-Session Briefing

Auto-assembled in the Coach Portal from the persistent record. Becomes the Context phase seed when the sidebar activates.

### Three-Part Format
1. **What we worked on last time**: Brief recap of the previous session (1-2 sentences)
2. **What's happening on the course**: Recent Arccos/GHIN data, rounds since last session
3. **Recommendation for next session**: Where to focus, based on trends

### Visual (Coach Portal — Light Mode)
* Left teal border (3px C.accent)
* Lightbulb icon (lucide-react)
* Confidence badge on the recommendation
* Card background: C.surface (`#FFFFFF`)

### Visual (Sidebar — Dark Mode)
* Left accent border (3px CD.accent)
* Card background: CD.surface (`#151D28`)
* Suggested focus line gets brighter text (CD.ink) and accent-colored left border
* Same content, dark mode tokens

### Data Freshness Indicator
* Green dot (<24h since last data sync)
* Amber dot (1-7 days)
* Red dot (>7 days)

## 9. Post-Session Summary

Lives in the Coach Portal (SessionReview at `/coach/review`). Full structured record of the session.

### Content
* Session metadata: player, coach, date, shot count, duration
* Primary finding (the key diagnosis)
* Intervention used (drill name, type, reps, measured response)
* Carry-forward items for next session
* Practice plan recommendation

### Coach Interactions
* Editable by coach (can modify AI-generated summary)
* "Generate Practice Plan" button
* "Share with Player" button (sends simplified version to Player Portal)

## 10. "Ask Looper" Chat

### Sidebar (During Lesson)
* Input always visible at bottom of sidebar, fixed position
* Dark input field: bg CD.surfaceAlt, border CD.borderSub, placeholder "Ask Looper..." in CD.dim
* On focus: border transitions to CD.accent
* Send icon: lucide-react Send, CD.accent
* Suggestion chips above input: 11px DM Sans, CD.body, border CD.borderSub, rounded-full

### Player Portal
* Floating button bottom-right (pill shape, accent bg)
* Opens as overlay chat panel
* Conversational tone, always cites source: "Based on your last 3 sessions with Coach Thompson..."
* Draws from persistent record

### Chat Bubble Styling
* User message: right-aligned, bg CD.accent at 15% opacity, CD.ink text
* AI response: left-aligned, bg CD.surface, CD.body text, small LOOPER.AI mark above

## 11. Mock Data Fixtures

### Demo Characters
* Coach: M. Thompson
* Player: Moe Norman, handicap 12.1 (from 13.8), goal "Break 80"
* Academy: Evergreen Golf Club

### Session History (8 sessions + current S9)

| Session | Date | Focus | Driver SG | Approach SG | Short Game SG | Putting SG |
|---|---|---|---|---|---|---|
| S1 | Mar 8, 2025 | Wedge distance control | -1.5 | -0.3 | -0.7 | +0.1 |
| S2 | Mar 29, 2025 | Continued wedge work | -1.6 | -0.3 | -0.4 | +0.2 |
| S3 | May 12, 2025 | Setup posture & ball position | -1.7 | -0.2 | -0.2 | +0.1 |
| S4 | Jul 3, 2025 | Trail arm & pelvic rotation | -1.9 | -0.1 | -0.1 | +0.3 |
| S5 | Sep 20, 2025 | Trail arm — wrist loading | -2.0 | 0.0 | -0.1 | +0.2 |
| S6 | Dec 8, 2025 | Iron contact assessment | -2.1 | 0.0 | -0.1 | +0.3 |
| S7 | Jan 25, 2026 | Gate drill — strike centering | -2.2 | +0.1 | 0.0 | +0.3 |
| S8 | Mar 18, 2026 | Gate drill continued — transfer | -2.3 | +0.2 | -0.1 | +0.3 |

The story arc: Short Game improved early. Approach improved during iron strike block. Putting always stable. Driver has gotten progressively worse — never addressed. The AI flags this in S9 with 87% confidence.

### Coaching Thread Lines

AI-inferred themes connecting related lessons:
* Wedge/Short Game (gold `#D4980B`): S1→S2
* Setup & Posture (gray `#6B7280`): S3→S4
* Trail Arm & Rotation (purple `#8B5CF6`): S4→S5
* Strike Quality (teal `#0D7C66`): S6→S7→S8
* Ball Position (blue `#3B82F6`): S3···S7 (dashed — resurfaced theme)

### Practice Compliance (Current)
* Gate Drill: 2/3 sessions completed
* Alignment Rod Check: 1/2 completed
* Tempo Drill: 0/2 (not started)

## 12. Anti-Patterns

| Anti-Pattern | Instead Do |
|---|---|
| "Our AI recommends..." | "Recommended:" — the system recommends, not "the AI" |
| Phase labels visible to coaches | Use natural language: "Context / Analysis / Working / Summary" |
| Catch-up/Diagnosis/Intervention/Review in UI | These are internal detection logic ONLY |
| Spinner while AI processes | Thinking indicator with streaming text |
| AI conclusions without visible reasoning | Show confidence evolving across multiple insight cards |
| Single-point predictions | Always show confidence badge + reasoning |
| AI suggestions without override option | Every suggestion needs Accept/Dismiss/Alternatives |
| "Guaranteed" or "optimal" language | "Expected improvement" / "with 74% confidence" |
| AI jargon (embeddings, bandits, RLHF) | Practitioner language (pattern, confidence, recommendation) |
| Generic loading states | Contextual labels: "Analyzing strike pattern..." not "Loading..." |
