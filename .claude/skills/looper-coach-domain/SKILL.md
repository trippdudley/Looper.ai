---
name: looper-coach-domain
description: "Golf coaching domain knowledge for building Looper.AI product experiences. Use this skill whenever building any coaching-related UI, player record, session view, practice plan, player brief, session summary, or any experience that a golf coach or player will interact with. Also trigger when designing data visualizations for coaching contexts, intervention tracking, progress views, or strokes-gained displays. If the experience involves coaching logic, player data, or session workflow, this skill applies. Load alongside looper-ux-system for implementation patterns."
---

# Looper.AI Coach Domain Reference

This file contains the golf coaching domain knowledge required to build product experiences that earn the trust of elite practitioners. It encodes how the best coaches in the world actually think, diagnose, communicate, and design player development — so that Claude Code can build a Coaching OS that supports and amplifies their expertise rather than contradicting it.

Read this file completely before building any coaching-related Looper.AI experience.

---

## 1. How Elite Coaches Think: The Diagnostic Reasoning Pattern

Every great coach — from Butch Harmon to Cameron McCormick to Pete Cowen — follows a consistent six-step reasoning loop. This is the cognitive architecture the Coaching OS must support.

### Step 1: Observe the output, not the positions

The coach watches what the ball does first. Ball flight is the symptom. Carry, dispersion pattern, shot shape tendency, trajectory window — by club category, not as a single aggregate. A coach sees "consistent 15-yard left miss with irons" before they ever look at a swing video.

**Design rule:** Ball flight and shot outcome data should appear before swing mechanics data in any diagnostic view.

### Step 2: Identify the ONE root cause

Great coaches triage ruthlessly. Butch Harmon's analogy: "If you have a broken ankle, a sprained ankle, and cancer, we're going to forget that other stuff and take care of the cancer." The root cause is the single issue whose fix cascades through multiple symptoms.

**Design rule:** The system should support identifying a primary limiting factor, not listing all problems equally. The Player Brief should name the current root cause and the coaching hypothesis.

### Step 3: Communicate simply — one or two things maximum

Hank Haney: "I like to say one or two things and repeat them over and over." Butch Harmon, channeling his father: "Teach golf at a second-grade level." Information overload is the #1 complaint from players and the #1 error of junior coaches.

**Design rule:** Session summaries should have ONE primary focus. Practice assignments should have ONE drill. If the coach addresses multiple issues, the system should still identify the primary focus and frame everything else as secondary.

### Step 4: Use technology to verify, not to diagnose

Every elite coach uses technology. None outsources the diagnosis to it. Technology confirms the coach's hypothesis — it does not generate the hypothesis. Leadbetter: "Technology to up my natural instinct as a teacher."

**Design rule:** AI recommendations are presented to the coach as suggestions to review, approve, or override — never as conclusions delivered to the player. The coach is the decision-maker. The system is the measurement layer.

### Step 5: Build the player's self-diagnosis capability

Haney: "Teach my students to become their own best teacher." Leadbetter: "I'm trying to make you your own best coach." The goal of great coaching is to make itself unnecessary.

**Design rule:** Player-facing outputs should help players understand their own patterns over time. Progress views should be designed to build golf literacy, not dependence on the coach or the system.

### Step 6: Know the person, not just the swing

McCormick: "Before he ever looked at a swing, he wanted to know the person — their goals, their mindset, their drive." Chuck Cook diagnosed that Payne Stewart's primary issue was undiagnosed ADD, not a swing fault. Pia Nilsson and Lynn Marriott assess physical, technical, mental, emotional, and social dimensions.

**Design rule:** The Player Brief must include player context (goals, personality, learning style, competitive context, physical constraints) — not just data. The coaching record should capture who the player is, not just what their numbers show.

---

## 2. The Feel vs Real Gap

This is the single most important diagnostic pattern in golf coaching and Looper.AI's highest-value integration feature.

### What it is

"Feel vs real" describes the systematic difference between what a player intends or perceives during a swing and what actually happens. Justin Rose: "I don't want the club to be here in delivery. But as soon as I bring rotation into play, this feel turns into the correct impact delivery." Every player "feels" something different to achieve the same mechanical position.

### Why it matters for Looper

Currently, no tool connects these data streams. TrackMan shows what the ball did. Video shows what the body did. The player reports what they felt. The coach integrates these mentally across disconnected screens. Looper's value is making this integration automatic and persistent.

### How to design for it

**Paired view pattern:** When the system detects a discrepancy between player intent (captured via coaching notes or player self-report) and measured outcome, present as:
- What the player was trying to do (coaching intent / feel cue)
- What the data shows happened (launch monitor + video + body data)
- The delta between intent and outcome

**Example — the shallowing case:**
- Intent: "Player was trying to shallow the club in transition"
- Ball data: Attack angle steepened by 1.5°
- Body data: Early extension detected in downswing
- Coach diagnosis: Player compensated for shallowing feel by extending early, which actually steepened the attack
- System value: Connected the body compensation to the ball result — a pattern invisible when looking at either data stream alone

**Example — the face control case:**
- Intent: "Player trying to feel clubface square at the top"
- Ball data: Consistent left miss with irons, face-to-path gap averaging -4°
- Video: Club appears square at the top — but dynamic loft at impact is 2° higher than expected
- Coach diagnosis: Feel is miscalibrated. Player's "square" is actually slightly closed. Need a different feel cue.

**Design rule:** Feel vs real is not a feature to be shown on every swing. It is a diagnostic mode the coach activates when investigating a pattern. The system should make it easy to correlate across data streams when the coach asks the question, not overwhelm with correlations on every shot.

---

## 3. Metrics in Context: What Coaches Actually Care About

### The metric-by-club-category problem

Golf metrics change meaning dramatically by club category. A system that shows "Attack Angle: -3.2°" without club context is useless. Here's what coaches look at by category:

**Driver:**
- Primary concern: Launch conditions (speed, launch angle, spin rate) and dispersion
- Attack angle: Typically positive (hitting up). Range: 0° to +5° for most players
- Spin: 2000-3000 rpm target range for most. Lower = more distance, higher = more stability
- Strike: Low-face hits lose massive carry. High-face hits reduce spin (can be good or bad)
- Coaching focus: Maximize carry while managing dispersion. Face-to-path for curvature control

**Irons (long vs mid vs short):**
- Primary concern: Carry distance control, trajectory, and dispersion
- Attack angle: Negative (hitting down). Gets steeper as clubs get shorter. 7-iron: roughly -4° to -6°
- Spin: Increases with loft. 7-iron: 6000-7500 rpm. Too low = no stopping power. Too high = ballooning
- Strike: Thin/fat is more critical than toe/heel. Low point control is the fundamental skill
- Coaching focus: Consistent strike location, distance gapping between clubs, trajectory control

**Wedges:**
- Primary concern: Distance control, spin, trajectory variation
- Attack angle: Steepest in the bag. Highly variable by shot type (full vs pitch vs chip)
- Spin: Wide range is intentional — coaches want players to control spin by shot type
- Strike: Strike quality directly controls spin and distance consistency
- Coaching focus: Touch, trajectory control, distance gapping within wedge distances

**Putter:**
- Completely different data set: face angle at impact, path, strike location, speed control
- "Ball speed consistency" matters more than any single mechanical metric
- Start line accuracy (face angle at impact) and speed control are the two KPIs

**Design rule:** Any data display must specify club category. Any aggregation must be within club category. When showing trends, show them per-club or per-club-category. A "7-iron trend" and a "driver trend" are different views, never combined.

### The relationships between metrics matter more than individual numbers

Coaches don't look at isolated metrics. They look at relationships:

- **Face-to-path:** Controls curvature. Face angle alone is meaningless. A 2° closed face with a 5° inside-out path produces a draw. The same 2° closed face with a 2° outside-in path produces a pull.
- **Spin loft (dynamic loft minus attack angle):** Controls spin rate. Showing spin alone doesn't tell the coach whether the issue is loft delivery or angle of attack.
- **Smash factor (ball speed / club speed):** Indicates strike quality and energy transfer. Low smash = off-center contact or poor energy transfer.
- **Carry vs total:** Carry is what the coach controls. Total depends on landing conditions.
- **Dispersion pattern (not single shots):** Coaches diagnose from patterns across multiple shots, not from any individual shot. A single pull-hook after 9 good draws is noise, not signal.

**Design rule:** Show metric relationships, not isolated numbers. Pair face-to-path, not face angle alone. Show dispersion patterns, not shot-by-shot scatter. When displaying a metric, always show the related metric that gives it meaning.

### The triage hierarchy

When a coach looks at data, they prioritize roughly in this order:

1. **Strike quality** — Is the player hitting the center of the face consistently? Poor strike contaminates every other metric. This is the most underweighted metric in most technology and the most important in coaching.
2. **Face control** — Is the face angle at impact consistent and aligned to the coach's intent? Face-to-path gap determines curvature.
3. **Path and direction** — Is the club path producing the intended ball flight direction?
4. **Launch conditions** — Are launch angle and spin producing the intended trajectory and carry?
5. **Speed** — Is clubhead speed where it should be? (Often the LAST thing to address, not the first)

**Design rule:** When building a diagnostic view, weight strike quality and face control more prominently than speed. The intuition to lead with speed or distance is wrong — coaches address those last.

---

## 4. The Three Product Moments — Detailed Field Guidance

### Moment 1: The Player Brief

**Purpose:** Give the coach 60 seconds of context before the player walks in. The system's "memory" that solves the #1 coaching failure — treating every lesson like a blank slate.

**Must contain:**

**Coaching arc context:**
- Current coaching phase (e.g., "Week 4 of face control work with irons")
- Root cause identified in previous sessions
- Current intervention (the specific cue, drill, or constraint being used)
- What was deliberately deferred ("attack angle is steep but not current priority")

**Last session record:**
- What was worked on (coaching intent, not data dump)
- Key coaching points (the verbal guidance captured via voice memo)
- What the coach observed changing during the session
- What practice was assigned (drill, reps, frequency)

**Between-session activity:**
- Did the player submit practice video?
- Did the player log self-reported feedback?
- Practice completion (if trackable)

**Off-course reality:**
- Recent scores (if available)
- Strokes gained breakdown (if available) — this is the truth layer
- Are scores improving, declining, or stable relative to the coaching arc?
- Where are strokes being lost? (This often reveals that the coaching focus needs adjustment)

**Proposed session agenda:**
- What the system suggests based on the coaching arc and between-session data
- The coach can accept, modify, or override

**What NOT to touch today:**
- Explicit list of metrics or issues the coach has flagged as "defer"
- This prevents junior coaches from chasing every imperfect number

**Design rules for the Player Brief:**
- Narrative-first, evidence-attached. Not a stats card.
- Numbers are contextual to the coaching objective, not standardized
- Must support multi-coach handoff (Coach B seeing a player Coach A saw last time)
- 60-second scan — the coach should grasp the full picture without scrolling

### Moment 2: The Live Session

**Purpose:** Connect data streams that don't currently talk to each other. Help the coach see patterns across ball flight, club delivery, strike, video, and body data — indexed to the same swing.

**Core design principles:**

**Swing-indexed correlation:**
- Every data point (launch monitor reading, video frame, body sensor data) must be tied to a specific swing
- Selecting a swing in the shot rail updates ALL data views simultaneously
- The coach should be able to see, for any single swing: what the ball did, what the club did at impact, what the body did, and what the player was trying to do

**Session objective drives the display:**
- The coaching intent for this session (set by coach or proposed by system) determines which metrics are foregrounded
- If the objective is face control, face-to-path is prominent; carry distance is secondary
- If the objective is strike consistency, the strike map is prominent; path data is secondary
- There is no "default dashboard" — the display adapts to the coaching intent

**Designed for glancing, not reading:**
- Mid-lesson, a coach looks at the screen for 2 seconds
- The primary signal (is the target metric trending in the right direction?) must be visible at a glance
- Detailed data is available on demand but never forced

**No universal baseline:**
- Do not show "today vs average" as a default comparison
- If showing comparisons, the reference frame is the session objective: "during the gate drill, face-to-path averaged X" vs "during open targets, face-to-path averaged Y"
- What "good" looks like changes by what the player is doing on each swing

**Shot-by-shot context:**
- Each swing should be tagged with what drill or condition was active
- "Shots 1-5: gate drill, half swing. Shots 6-10: gate drill, full swing. Shots 11-15: open target"
- Data without task context is uninterpretable

**Coach-controlled player visibility:**
- The coach decides what appears on the player-facing display (if any)
- Some players benefit from seeing numbers; others are harmed by it
- Default: coach-only data display

**Feel vs real detection:**
- When the session has a tagged intent and the data shows a contradictory pattern, surface it as a suggestion to the coach
- "Player was working on shallowing → attack angle steepened → early extension detected" — presented as a correlation for the coach to evaluate, not as a diagnosis

### Moment 3: The Session Summary

**Purpose:** The deliverable the player takes home. Solves the documentation gap that voice-of-player research identifies as the #1 retention killer.

**Must contain:**

**What we worked on and why** (1-2 sentences, plain language):
- "Today we focused on improving your clubface consistency with irons. This is the primary factor behind your tendency to miss left."

**Visual evidence of change:**
- Before/after from today's session — dispersion comparison, strike map comparison, or a specific metric in context
- Must be visual, not just numerical. The player needs to SEE that something changed
- This is the "proof that effort is producing results" the research says is the #1 unmet player need

**Practice assignment** (specific):
- One primary drill
- Specific reps and frequency ("3 times this week, 20 balls per session")
- Clear success metric the player can self-assess
- Video reference if available
- Use external focus language in the drill description when possible

**What's coming next** (1 sentence):
- "Next session: if your face consistency holds, we'll start transferring this to variable targets"
- The player should feel like they're on a journey, not a treadmill

**What we chose not to address** (optional, coach-reviewed):
- "We noticed your attack angle is steeper than ideal with irons, but we're addressing face control first — this may improve naturally as the face pattern stabilizes"

**Design rules for the Session Summary:**
- Written for the player, not the coach — different language, different emphasis
- ONE primary focus, not five competing action items
- Coach reviews and approves before delivery (never auto-sent)
- Should reinforce confidence and normalize the difficulty of change

---

## 5. Motor Learning Principles for Practice Plan Design

When the system generates or suggests practice plans, apply these evidence-based principles:

### External focus of attention (strong evidence)

Direct attention to the movement's effect, not the body.
- Good: "Focus on the ball starting right of the target" (effect)
- Bad: "Focus on rotating your forearms through impact" (body part)
- Meta-analysis shows external focus superiority with effect sizes of 0.264 (performance) and 0.583 (retention)
- The system should flag internal-focus cues and suggest external-focus alternatives

### Variable practice over blocked repetition (strong evidence)

Mixing tasks randomly produces worse in-practice performance but dramatically better long-term learning.
- Good: "Hit 7-iron, then wedge, then driver, then 8-iron — different target each time"
- Bad: "Hit 50 seven-irons to the same target"
- Practice plans should default to variable formats unless the coach overrides for a specific reason

### Challenge Point Framework (moderate evidence)

Difficulty should match skill level.
- Beginners: More repetition of the same task before changing (3-5 reps). More feedback. More structure.
- Experienced players: Change task after 1-2 reps. Less feedback. More autonomy.
- The system should scale practice difficulty recommendations based on player skill level

### Autonomy support (emerging evidence)

Giving players choice — even irrelevant choice like ball color — improves learning outcomes.
- Practice plans should offer the player options where possible ("choose which of these two drills to start with")
- This supports VISION54's philosophy: the player is an active participant, not a passive recipient

### The 90-day reality

Coaches report that mechanical changes require at least 90 days of consistent practice to become permanent. Most players expect improvement in 1-2 sessions. The system should:
- Set realistic timelines in the coaching arc
- Track adherence over weeks and months, not just sessions
- Show progress at the appropriate time scale (weeks, not shots)

---

## 6. Coaching Communication Patterns

### Three player learning archetypes

Coaches identify three primary learning modes. The system should track which mode each player responds to:

1. **Analytical/technical:** Wants data, numbers, mechanical explanations. "Show me the TrackMan numbers." Give them the evidence.
2. **Visual:** Wants demonstrations, video comparisons, spatial references. "Show me what it should look like." Use video and spatial overlays.
3. **Feel-based:** Wants physical sensations, metaphors, kinesthetic cues. "What should this feel like?" Use analogies and feel-language.

The same mechanical fix can be communicated three different ways depending on the player. The system should support all three and help coaches match mode to player.

### The exaggeration principle

Because proprioception is miscalibrated, coaches routinely prescribe feels that are extreme relative to the actual desired change. "Feel like you're swinging to right field" might produce a 2° path change. The system should understand that coaching cues are NOT literal descriptions of desired mechanics — they are calibrated exaggerations designed to produce a specific outcome in a specific player.

**Design rule:** Never interpret a coaching cue literally. "Swing to right field" does not mean the coach wants a 40° inside-out path. It means the coach wants a modest path change and knows this player needs an extreme feel cue to produce it.

---

## 7. Scoring and Off-Course Context

### Strokes Gained as the truth layer

Strokes gained analysis reveals where a player actually loses shots relative to a benchmark population. It is the off-course truth that validates or challenges what happens in the bay.

Key strokes gained categories:
- **Off the tee:** Driving distance + accuracy
- **Approach:** Iron play from 100+ yards
- **Around the green:** Short game within 50 yards
- **Putting:** On the green

A player can have perfect TrackMan numbers in the bay and still lose strokes on approach if the skills don't transfer to the course. Conversely, messy bay numbers during a change period can coexist with stable or improving scores if the player's previous patterns are holding.

**Design rule:** When strokes gained data is available, it should appear in the Player Brief as the reality check. It answers "is this coaching arc actually helping the player score?" — which is the only question that ultimately matters.

### The swing vs scoring tension

Jim McLean's 25% Theory: golf performance is roughly 25% long game, 25% short game, 25% course management, 25% mental/emotional game. Most coaching (and most technology) over-indexes on the long game.

**Design rule:** The system should track and surface where strokes are actually being lost, even if that's not where the current coaching focus is. If the player is losing 3 strokes/round on the green but the coaching arc is focused on driver, the system should flag this — not as an override, but as context for the coach's planning.

---

## 8. Multi-Coach and Academy Context

### The handoff problem

In a multi-coach academy (like Evergreen with 21 bays), a player might see Coach A one week and Coach B the next. Coach B needs:
- Everything in the Player Brief
- Coach A's specific language and cues (because the player has calibrated their feel to Coach A's words)
- The deliberate omissions (so Coach B doesn't chase what Coach A decided to leave alone)
- The session-level coaching notes, not just the data

**Design rule:** The coaching record must be written assuming a different coach will read it. This means: no shorthand that only the original coach would understand, explicit labeling of the coaching intent, and clear documentation of what was prescribed and what was deferred.

### Junior coach guidance

One of Looper's core value propositions for academies: a junior coach using the system should be guided toward elite diagnostic reasoning rather than defaulting to "let me show you your numbers."

The system should:
- Suggest a diagnostic starting point (strike quality first, then face control, then path, then speed)
- Flag when a junior coach appears to be addressing too many issues simultaneously
- Surface the "leave it alone" list from the senior coach's previous session
- Suggest external-focus cue language when the coach enters an internal-focus cue

This is NOT the system replacing the coach. It is the system encoding the senior coach's reasoning patterns so that consistency scales across the academy staff.

---

## 9. Anti-Patterns Specific to Coaching Domain

| Anti-Pattern | Why It Fails | Instead Do |
|-------------|-------------|-----------|
| Showing "Attack Angle: -3.2°" without club context | Meaningless — driver AA should be positive, wedge AA should be steep | Always show club category alongside every metric |
| Averaging metrics across all clubs | A player's driver and iron patterns tell different stories | Show per-club or per-club-category views |
| "Your baseline attack angle is -2.8°" | There is no universal baseline; it changes by day, intent, warmup, club | Tie comparisons to specific coaching objectives and session conditions |
| Showing all 40+ TrackMan parameters | Overwhelms the coach, paralyzes the player | Show only metrics relevant to the current coaching intent; hide everything else |
| "AI recommends you work on path" | The coach makes the diagnosis, not the AI | "Pattern detected: face-to-path gap of 4° across last 3 sessions. Possible factor in left miss pattern." |
| Practice plan: "Work on all aspects of your game" | No focus, no accountability, player doesn't know what to do | One drill, specific reps, specific frequency, one success metric |
| Treating speed as the primary metric | Coaches address speed LAST — strike and face control come first | Weight strike quality and face control above speed in diagnostic views |
| Showing the same data layout for beginners and tour players | Different skill levels need different information density and communication modes | Scale data density to player skill level and learning style |
| Designing the session view for deep reading | Coaches glance for 2 seconds mid-lesson | Design for the glance: one primary signal, visible at arm's length |
| Interpreting coaching cues literally | "Swing to right field" doesn't mean 40° path — it's a calibrated exaggeration | Store coaching cues as verbal records, not as mechanical targets |

---

## 10. Domain Vocabulary Reference

Use practitioner language, never AI/ML jargon, in any coach-facing or player-facing UI.

| Practitioner term | What it means | Never say |
|------------------|---------------|-----------|
| Strike | Contact quality and location on the face | Impact optimization |
| Dispersion | The spread pattern of shots | Outcome variance |
| Carry window | The range of carry distances the player produces | Distance distribution |
| Face control | Consistency of face angle at impact | Face angle optimization |
| Limiting factor | The root cause issue holding the player back | Primary deficiency |
| Expected improvement | What the data suggests will change | Predicted marginal gain |
| Confidence level | How certain the system is about a recommendation | Model certainty score |
| Coaching arc | The multi-session plan for a player's development | Development trajectory |
| Feel cue | A physical sensation the coach prescribes | Proprioceptive instruction |
| Gear effect | How off-center strikes change spin axis and curvature | Strike-induced trajectory perturbation |
| Miss pattern | The player's typical bad shot shape and direction | Error distribution cluster |

---

## 11. Integration Checklist

When building a coaching experience, verify:

- [ ] Every metric displayed has club category context
- [ ] The view is organized by coaching intent, not by data source
- [ ] The coaching narrative (verbal record) has a prominent place in the design
- [ ] Feel vs real detection is possible when multiple data streams are connected
- [ ] The coach controls what the player sees
- [ ] AI suggestions are framed as hypotheses for coach review, not conclusions
- [ ] Practice recommendations use external focus language and variable practice formats
- [ ] The session summary has ONE primary focus
- [ ] Deliberate omissions are tracked and visible to subsequent coaches
- [ ] The Player Brief is scannable in 60 seconds
- [ ] The live session view is glanceable in 2 seconds
- [ ] Strokes gained / off-course data is included in the Player Brief when available
- [ ] The design doesn't assume a universal baseline
- [ ] Strike quality and face control are weighted above speed in diagnostic views
- [ ] Load the looper-ux-system skill for visual implementation patterns