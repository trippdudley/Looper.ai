# Video Analysis Module — Coaching OS

The Video Analysis tab is the second tab in the Coaching OS L3 sequence (Overview → **Video Analysis** → Diagnosis → Interventions → Player Plan). It provides a four-panel layout for technical swing analysis, connecting video to data to AI insight in a single view.

## Strategic positioning

Don't build a video analysis tool. Build the video *intelligence* layer. The video tools market (drawing lines, slow-motion, frame-by-frame) is mature and commodity. The moat is connecting what the coach sees in the video to what the data shows to what the AI recommends. Nobody else does this.

## Four-panel grid (2x2)

All four panels must be **equal size** — use `grid-template-columns: 1fr 1fr` with `grid-template-rows: 1fr 1fr`. No panel dominates. Video panels (01 and 02) should have identical viewport dimensions.

### Panel 01 — Player swing (top-left)

Primary video view with DTL/face-on camera toggle, 240fps slow-motion, frame-by-frame scrubbing. P-position quick-jump pills (P1-P10) below the video — tapping snaps to that frame. Video is timestamped to shot rail and launch monitor data. Drawing tools (lines, angles, circles) overlay on the video. Annotations persist with the session record.

### Panel 02 — Reference comparison (top-right)

Side-by-side or overlay comparison against three reference types:
- Tour pro matched by club type (not just player — "Morikawa 7-iron DTL")
- Player's own previous best swing (longitudinal comparison)
- Sportsbox 3D avatar (if integrated)

Sync button locks both videos to the same P-position for synchronized scrubbing. Video viewport must match Panel 01 dimensions exactly.

### Panel 03 — Position data (bottom-left)

Launch monitor delivery data synced to the current video frame/position: club path, face angle, attack angle, dynamic loft, spin loft, shaft lean. If Sportsbox/3D data is available, also shows: hip turn, chest turn, X-factor, pelvis sway, chest sway. Data updates as the coach scrubs through the video.

### Panel 04 — AI position analysis (bottom-right)

At each P-position, the system provides correlated insights connecting biomechanics to outcome. Each insight includes: position label (P4, P6, P7), observation text in Cabinet Grotesk, and a correlation-to-outcome confidence badge. This is the intelligence layer — it connects what the coach sees in the video to what the data shows to what the AI recommends.

## Build vs. integrate

| Capability | Decision | Rationale |
|---|---|---|
| Video capture + playback | Native build | Core to experience; must sync with launch monitor timestamps and shot rail |
| Drawing + annotation tools | Native build (MVP set) | Lines, angles, circles for MVP. Full suite v2. Must persist with session record. |
| P-position auto-tagging | Native build (AI) | TrackMan just launched this. Being second-to-market but better-integrated is the play. |
| 3D kinematics | Integrate (Sportsbox API) | Sportsbox owns markerless 3D. Import their data, display in our context. |
| Pro reference library | Integrate + curate | License or build curated set. Key differentiator: match by club type, not just player. |
| Video-to-data correlation | Native build (core IP) | Nobody does this. This is the moat. |
| Voice-over lesson export | Phase 2 | V1's bread and butter. Important for retention but not the differentiator. |
