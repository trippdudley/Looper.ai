---
name: looper-brand-assets
description: "Generate on-brand content and assets for Looper.AI, an AI-native decision platform for golf coaching and club fitting. Use this skill whenever the user asks to create any Looper.AI branded content — including pitch decks, presentations, one-pagers, social media posts (LinkedIn), email copy, customer-facing reports, session summaries, build sheets, internal memos, blog posts, website copy, marketing materials, investor updates, or any document that should reflect Looper.AI's brand voice and visual identity. Also trigger when the user asks to write copy 'as Looper' or 'in the Looper voice,' or references the Looper brand guidelines, or asks for help with Looper-related content of any kind. If the output will be seen by a customer, investor, partner, practitioner, or posted publicly, this skill applies."
---

# Looper.AI Brand Asset Generator

This skill ensures all content created for Looper.AI follows the brand's voice, tone, visual identity, and strategic positioning. Read this file completely before generating any Looper.AI branded content.

## Who Looper.AI Is

Looper.AI is an AI-native decision platform for golf performance. It helps coaches and club fitters make better decisions by capturing shot/swing-level data from existing launch monitors and video, applying physics-informed machine learning with calibrated uncertainty, and recommending what to test, change, or practice next.

The practitioner (coach or fitter) stays in control. The AI handles measurement discipline, math, and memory.

### Two Products, One Platform

- **Coaching OS** (primary): Academy-grade system that turns every lesson into a measured experiment. Diagnoses limiting factors with confidence levels, recommends drills/cues grounded in motor learning science, tracks player progress longitudinally.
- **Fitting Engine** (follows fast): Fitter-facing system that reframes club fitting as a sequential decision problem. Proposes next-best equipment configuration, estimates counterfactual outcomes with uncertainty bands, produces auditable build recommendations.

### Positioning Statement

For golf coaches and club fitters who take their craft seriously, Looper.AI is the decision platform that turns expertise into engineering. Unlike data tools that show you numbers, Looper.AI tells you what to try next, why it should work, and how confident you should be.

### Tagline

**Expertise, engineered.**

---

## Brand Voice Rules

The voice should sound like the smartest colleague in the fitting bay who never talks down to anyone. Like an engineer who also plays golf and understands why feel matters.

### Personality Traits

| Trait | Meaning | What it is NOT |
|-------|---------|----------------|
| Precise | Every claim backed by data; uncertainty stated honestly | Clinical, sterile, or unapproachable |
| Empowering | The practitioner is the hero, not the software | Patronizing ("you were doing it wrong") |
| Quietly Confident | We know this is better; we don't need to shout | Arrogant, dismissive, techbro |
| Craft-Respecting | Fitting and coaching are engineering disciplines | Nostalgic or conservative |
| Clear | Complex ideas, zero jargon unless audience uses it | Dumbed down — practitioners are smart |

### Verbal Do's and Don'ts

**Always use these patterns:**
- "The data suggests X with Y confidence" — not "Our AI determined that X"
- "What to try next" — not "AI-powered optimization"
- "Your expertise, systematized" — not "Replacing intuition with intelligence"
- "Uncertainty is honest; false precision isn't" — not "Guaranteed results"
- "Built for how you actually work" — not "Revolutionary paradigm shift"
- "Engineering-grade" as aspiration — not "Disrupting the golf industry"
- Golf language used naturally (strike, dispersion, carry windows, club path, face control)
- AI/ML jargon never used in customer-facing content (embeddings, bandits, counterfactual, hierarchical Bayesian)

**Never say:**
- "Revolutionary," "game-changing," "disruptive," or "paradigm shift"
- "Our AI" as if it's a separate entity making decisions
- "Guaranteed" anything — use "expected," "estimated," "with X% confidence"
- "Replaces" or "automates" the coach/fitter — always "augments," "systematizes," "empowers"
- Generic startup phrases: "leveraging AI," "end-to-end solution," "seamless integration"

### Copy Examples (Use as Calibration)

These show the right tone. Reference them when writing any Looper.AI content:

- "You already think this way. Now prove it."
- "Better decisions, not more data."
- "The fitting bay is an engineering lab. We built the OS for it."
- "Every lesson is an experiment. Make it count."
- "The best fitters already do this in their heads. We gave it a system."

---

## Visual Identity Rules

### Color Direction

The palette is clinical, precise, and light-foundation — surgical instrument, not lifestyle.

| Role | Specification | Avoid |
|------|--------------|-------|
| Foundation | Near-white (#F6F7F9), pure white cards, cool gray borders | Dark backgrounds as default (reserve for bay/dark mode only) |
| Brand accent | Deep teal #0D7C66 — used for .AI in logo, CTAs, links, interactive elements | Royal blue (TrackMan), bright emerald (too generic), any warm tones |
| Text | Near-black #1A1F2B for headings, slate #4B5563 for body, gray #9CA3AF for labels | Pure black (#000000), warm grays |
| Confidence | Bright teal #0FA87A on subtle tint background #E6F5F1 | Raw green without background tint |
| Caution | Deep gold #D4980B | Bright yellow (too alarming) |
| Flag | Muted red #C93B3B | Bright red (too aggressive) |

When generating HTML, React, or styled content, use this palette:

```
/* Foundation — clinical light base */
--color-bg: #F6F7F9;            /* Page background */
--color-surface: #FFFFFF;        /* Cards and content areas */
--color-border: #DFE2E7;        /* Borders and dividers */
--color-border-subtle: #ECEEF2; /* Card borders, subtle separation */

/* Brand accent — deep teal */
--color-accent: #0D7C66;        /* Primary brand accent: CTAs, links, .AI in logo */
--color-accent-hover: #0A6352;  /* Hover state */
--color-accent-light: #E6F5F1;  /* Accent background tint (badges, rec cards) */
--color-accent-bright: #0FA87A; /* Confidence-high indicators */

/* Text hierarchy */
--color-text: #1A1F2B;          /* Primary text, headings */
--color-text-body: #4B5563;     /* Body copy */
--color-text-muted: #9CA3AF;    /* Labels, captions, secondary info */

/* Semantic — confidence, caution, flags */
--color-confidence: #0FA87A;    /* High confidence, positive indicators */
--color-caution: #D4980B;       /* Caution, medium confidence, warnings */
--color-flag: #C93B3B;          /* Flags, low confidence, errors */

/* Dark mode (for bay/simulator environments) */
--color-bg-dark: #0C1117;
--color-surface-dark: #151D28;
--color-card-dark: #1E2A36;
--color-border-dark: #1E2A36;
--color-text-dark: #E8ECF1;
--color-text-body-dark: #8B99A8;
--color-text-muted-dark: #5E6E7E;
```

### Typography

The type system uses a split-voice architecture: one font for the brand, another for data.

**Brand voice — Cabinet Grotesk (Fontshare, free for commercial use)**
- 800 weight: Wordmark and display headings
- 500 weight: Section headings and subheads
- 400 weight: Body text and long-form copy
- Letter-spacing: 0.05-0.06em for the wordmark in all-caps; normal for body

**Data voice — Space Mono (Google Fonts)**
- 700 weight: Metric values and primary data points
- 400 weight: Labels, captions, confidence intervals, table data
- Always used for: numbers in data cards, axis labels, confidence badges, build specs

**Editorial voice — Instrument Serif italic (Google Fonts)**
- Used sparingly for: taglines, pull quotes, editorial moments
- Never used for body text or data

**Fallback guidance:**
- If Cabinet Grotesk is unavailable, use system sans-serif (not Inter, not Arial — ask the user to install Cabinet Grotesk from fontshare.com)
- If Space Mono is unavailable, use any monospaced system font
- For internal documents where custom fonts aren't practical, Arial is acceptable for body text

### What to Avoid Visually

- Neural network graphics, "AI brain" imagery, glowing blue anything
- Stock golf photos (sunset fairways, celebratory poses, lifestyle imagery)
- Consumer-tech aesthetics (rounded friendly shapes, playful illustrations)
- Generic SaaS template layouts
- Gaming gradients, rainbow palettes, heavy drop shadows

### What to Lean Into

- Data visualization as the primary visual language: strike maps, dispersion ellipses, uncertainty bands
- Engineering/lab aesthetic: grids, coordinate systems, contour lines, measurement overlays
- Product screenshots and UI as hero content
- Real environments: fitting bays, lesson tees, launch monitor screens, impact tape

---

## Content Templates

### Pitch Deck Slides

Structure investor-facing slides with these principles:
- Lead with the problem ("guesswork disguised as method"), then the system
- Show the product UI early — the product IS the proof
- Use data and specifics, not adjectives
- Include uncertainty language even in investor context ("expected market," "estimated improvement")
- End with team/traction, not vision fluff

### LinkedIn Posts

Format for the golf-pro and academy-owner audience:
- Open with a concrete observation or provocation, not a question
- Keep to 150-250 words
- Use short paragraphs (1-2 sentences each)
- End with a thought that makes the reader reconsider their current process
- Never use hashtags excessively (2-3 max, relevant ones like #golfinstruction #clubfitting)
- Never use emoji in body text

### Customer-Facing Reports (Session Summaries, Build Sheets)

- Header: Looper.AI branding, session metadata (date, player, coach/fitter, equipment)
- Body: structured findings with confidence levels, not narrative
- Use tables and data visualization, not paragraphs of interpretation
- Always include uncertainty — "estimated carry: 265-272 yards (84% confidence)"
- Close with clear next steps or recommendations
- Build sheets must include full spec: length, swingweight, total weight, grip, shaft tipping, loft/lie settings

### Email Copy

- Subject lines: specific and benefit-driven, never clickbait ("How your fitting data becomes a decision system")
- Body: short paragraphs, practitioner-respectful tone, one clear CTA
- Never use "Dear [Name]" — use first name directly
- Sign-off should feel like a colleague, not a sales team

### One-Pagers

- Structure: problem → approach → proof → CTA
- Lead with the practitioner's pain point, not the technology
- Include one product screenshot or data visualization
- Keep to one page — density is a feature, not a bug

---

## Competitive Differentiation (Use in All Content)

When positioning Looper.AI against the landscape, use these frames:

| Competitor Category | Their position | Our differentiation |
|---|---|---|
| TrackMan / Foresight | Measurement hardware — they give you numbers | We are a decision layer — we tell you what to do with the numbers |
| TPI / fitness-tech | Physical performance and movement screens | We cover the full coaching/fitting decision workflow |
| CoachNow / Hudl / Golf CRM | Workflow and communication tools | We are an intelligence layer, not another app |
| Arccos / Whoop / Garmin | Consumer player-facing wearables | We are practitioner-facing first; the pro is our customer |

Never directly attack competitors by name in customer-facing content. Instead, frame the gap: "Data tools show you what happened. Looper.AI shows you what to try next."

---

## Quality Checklist

Before finalizing any Looper.AI asset, verify:

1. **Practitioner respect:** Does this make the coach/fitter feel like the expert, not the student?
2. **No false precision:** Are claims stated with appropriate uncertainty?
3. **No AI clichés:** Zero mentions of "leveraging AI," neural net imagery, or glowing brains?
4. **Engineering tone:** Does this read like infrastructure, not a consumer app?
5. **Competitive clarity:** Is it clear why Looper.AI is different from a launch monitor or a golf CRM?
6. **Visual consistency:** Colors, typography, and layout match the brand direction?
7. **Actionable:** Does the reader know what to do or think next?

---

## Reference: Product Capabilities (For Accurate Content)

When writing about what Looper.AI does, stay within these boundaries:

**The Coaching OS can:**
- Capture swing-level multimodal records (launch monitor + video + optional IMU/force data)
- Build player embeddings (skill signature, variability, adaptation rate)
- Diagnose limiting factors with confidence levels
- Recommend drills/cues ranked by expected benefit and learning value
- Track longitudinal progress across sessions
- Support coach override at every decision point

**The Fitting Engine can:**
- Capture shot-level records with equipment metadata and build specs
- Propose next-best equipment configuration to test
- Estimate counterfactual outcomes with uncertainty bands
- Produce auditable build sheets with full spec documentation
- Normalize across launch monitor devices and sessions
- Use equipment ontology (structured head/shaft/build specs, not just brand/model/flex)

**Never claim the system:**
- Replaces coaches or fitters
- Guarantees outcomes
- Works without human judgment
- Is fully autonomous
- Has "solved" golf instruction or fitting
