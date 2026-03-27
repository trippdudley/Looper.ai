# Integrations Architecture

Every data source maps to the same internal schema through an adapter layer. The app doesn't care where a shot came from — it cares about ball speed, carry, spin rate, and club.

## The Abstraction Layer

```
Data Sources → Adapter Layer → Internal Schema (rounds, practice_sessions, shots)
```

Each adapter is a single TypeScript file that:
1. Parses the source format (CSV columns, JSON structure, API response)
2. Maps fields to the internal schema
3. Handles source-specific quirks (TrackMan uses meters, Foresight uses yards)
4. Returns normalized `Round[]`, `PracticeSession[]`, and `Shot[]` objects

Adding a new integration means writing one adapter file. No database changes. No API changes. No app changes.

---

## MVP: Manual Import Workflows

At MVP, we don't have formal API partnerships. Here's how each source works for the first 10 users:

### TrackMan CSV Import

**User workflow:**
1. Open TrackMan PC app → Sessions → Select session → Export CSV
2. Transfer CSV to phone (AirDrop, email, iCloud Drive)
3. Open Looper → Data Sources → Import → TrackMan
4. Select CSV from Files picker
5. Looper parses it, shows preview: "18 shots with 7-iron, 12 with driver..."
6. User confirms → data flows into their record
7. Ask Looper immediately has context about the session

**Technical:** `expo-document-picker` opens iOS Files app. TrackMan adapter parses CSV columns (Club, Club Speed, Ball Speed, Launch Angle, Spin Rate, Carry, Total, Club Path, Face Angle, etc.). Preview screen shows parsed data before committing. Raw CSV archived to Supabase Storage, normalized rows inserted into `shots` table.

### Foresight (GCQuad / GC3) CSV Import

Same flow as TrackMan but from Foresight's "Performance" software export. Foresight CSVs have different column names and include impact location data. A working normalizer already exists in the prototype (`foresightSummary` in `tripp.ts`).

### Arccos Import

**Two paths:**
1. **CSV (if available):** Same flow as TrackMan
2. **Screenshot OCR:** User uploads screenshot from Arccos app → Supabase Edge Function sends to Claude Vision with prompt "Extract strokes gained data from this Arccos screenshot" → structured data returned → user confirms → inserted into database

The screenshot path is a clever MVP hack. Not as clean as an API, but works today with zero partnership required.

### GHIN Sync

1. Onboarding or Settings → Connect GHIN
2. Enter GHIN number
3. Edge Function pulls score history via GHIN's public lookup

GHIN has a public-ish API that returns handicap and recent scores given a GHIN number. Not officially supported by USGA, but commonly used by golf apps. For formal partnership later, use their official GPA program API.

---

## The Path from Manual to API

```
Phase 1 (MVP):     CSV upload + screenshot OCR
Phase 2 (v1.0):    GHIN OAuth + Arccos OAuth (apply for API access)
Phase 3 (Scale):   TrackMan API, Foresight API, Garmin Connect API
Phase 4 (Platform): Third parties push data to us
```

Each phase just adds a new adapter. The internal schema never changes. The AI context builder never changes. The UI never changes (except adding an "auto-sync" toggle for API-connected sources).

**Applying for API access:** TrackMan, Foresight, and Arccos all have partner API programs. The application requires a launched app with users, a clear value proposition, and compliance with data usage terms. Having 1,000+ users who manually import data is the best argument for API access.
