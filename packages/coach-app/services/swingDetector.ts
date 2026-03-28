/**
 * SwingDetector — audio-level-based swing event detection.
 *
 * Detects golf swings from the microphone audio level (metering data from expo-av).
 * Works without a custom native module by analyzing the dB metering stream:
 *
 * A golf swing has a characteristic audio signature:
 *   1. Impact transient: sudden spike in dB level (typically +20-30 dB above ambient)
 *   2. Short duration: the spike lasts < 200ms
 *   3. Recovery: level returns to ambient within ~500ms
 *   4. Minimum gap: swings are at least 1.5s apart
 *
 * The detector maintains a rolling 2-second ambient baseline.
 * When metering exceeds baseline + IMPACT_THRESHOLD_DB for IMPACT_MIN_MS,
 * a swing event is fired.
 *
 * NOTE: Works best at 1-3m distance from the ball. At driving range distances,
 * ambient noise may interfere. A SwingDetector native module (AVAudioEngine on iOS)
 * would provide better accuracy — this is the pure-JS implementation.
 */

export interface SwingEvent {
  timestamp: number;        // Date.now() at detection
  durationMs: number;       // Impact duration
  peakDb: number;           // Peak dB during impact
  ambientDb: number;        // Baseline at time of swing
}

type SwingCallback = (event: SwingEvent) => void;

const IMPACT_THRESHOLD_DB = 18;       // dB above ambient to trigger
const IMPACT_MIN_DURATION_MS = 20;    // Minimum spike duration to qualify
const IMPACT_MAX_DURATION_MS = 250;   // Maximum (longer = not a swing impact)
const MIN_SWING_GAP_MS = 1500;        // Minimum time between detected swings
const AMBIENT_WINDOW_MS = 2000;       // Rolling window for ambient baseline
const AMBIENT_SAMPLE_RATE_MS = 100;   // How often metering is sampled

export class SwingDetector {
  private ambientSamples: Array<{ db: number; ts: number }> = [];
  private impactStart: number | null = null;
  private impactPeak: number = -160;
  private lastSwingTs: number = 0;
  private callback: SwingCallback;
  private active: boolean = false;

  constructor(callback: SwingCallback) {
    this.callback = callback;
  }

  start(): void {
    this.active = true;
    this.ambientSamples = [];
    this.impactStart = null;
    this.impactPeak = -160;
    this.lastSwingTs = 0;
  }

  stop(): void {
    this.active = false;
  }

  /**
   * Feed metering data from expo-av Recording status updates.
   * Call this from your onRecordingStatusUpdate callback.
   *
   * @param db - Current dB level (typically -160 to 0)
   */
  processMeteringDb(db: number): void {
    if (!this.active) return;

    const now = Date.now();
    const ambient = this.getAmbientDb(now);

    // Add to ambient window (only when not in an impact)
    if (this.impactStart === null) {
      this.ambientSamples.push({ db, ts: now });
      // Prune old samples
      const cutoff = now - AMBIENT_WINDOW_MS;
      this.ambientSamples = this.ambientSamples.filter((s) => s.ts > cutoff);
    }

    const isImpact = db > ambient + IMPACT_THRESHOLD_DB;

    if (isImpact && this.impactStart === null) {
      // Impact begins
      this.impactStart = now;
      this.impactPeak = db;
    } else if (isImpact && this.impactStart !== null) {
      // Impact ongoing — track peak
      if (db > this.impactPeak) this.impactPeak = db;
    } else if (!isImpact && this.impactStart !== null) {
      // Impact ended
      const duration = now - this.impactStart;

      if (
        duration >= IMPACT_MIN_DURATION_MS &&
        duration <= IMPACT_MAX_DURATION_MS &&
        now - this.lastSwingTs >= MIN_SWING_GAP_MS
      ) {
        this.lastSwingTs = now;
        this.callback({
          timestamp: this.impactStart,
          durationMs: duration,
          peakDb: this.impactPeak,
          ambientDb: ambient,
        });
      }

      this.impactStart = null;
      this.impactPeak = -160;
    }
  }

  private getAmbientDb(now: number): number {
    const cutoff = now - AMBIENT_WINDOW_MS;
    const recent = this.ambientSamples.filter((s) => s.ts > cutoff);
    if (recent.length === 0) return -40; // Default ambient

    // Use the 40th percentile (low-end to represent true ambient, not peaks)
    const sorted = [...recent].sort((a, b) => a.db - b.db);
    const idx = Math.floor(sorted.length * 0.4);
    return sorted[idx].db;
  }

  /** How many swings detected in the last N seconds */
  getSwingsInWindow(_windowMs: number): number {
    // Tracking handled externally via callback
    return 0;
  }
}
