import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Play, Pause } from 'lucide-react';
import type { TabId, ShotData } from '../data/coachingOSData';
import {
  shots, sessionContext, tabs,
  diagnosisFactors, interventions, playerHistory,
  getInsightForShot, getRecommendationForShot,
} from '../data/coachingOSData';

// ─── Dark-mode design tokens (UX System v2) ────────────────────
const C = {
  bg:       '#080B10',
  surface:  '#0E1319',
  elevated: '#141B24',
  border:   '#1A2332',
  borderSub:'#1E2A38',
  accent:   '#10B981',
  accentHov:'#34D399',
  accentBg: 'rgba(16,185,129,0.08)',
  accentBright: '#34D399',
  ink:      '#E8ECF1',
  body:     '#94A3B8',
  muted:    '#5E6E7E',
  dim:      '#2E3A48',
  data:     '#CBD5E1',
  dataDim:  '#64748B',
  conf:     '#10B981',
  confBg:   'rgba(16,185,129,0.08)',
  caution:  '#F59E0B',
  cautionBg:'rgba(245,158,11,0.08)',
  flag:     '#EF4444',
  flagBg:   'rgba(239,68,68,0.08)',
  phaseBaseline: '#2E3A48',
  phaseAdjust:   '#F59E0B',
  phasePost:     '#10B981',
  overlay:  'rgba(0,0,0,0.6)',
} as const;

const F = {
  brand: "Inter, system-ui, -apple-system, sans-serif",
  data:  "'Space Mono', 'SF Mono', 'Fira Code', monospace",
} as const;

// ─── Format utility (value and unit are SEPARATE) ──────────────
function fmt(v: number, type: string): string {
  switch (type) {
    case 'yds':  return Math.round(v) + '';
    case 'mph':  return v.toFixed(1);
    case 'rpm':  return Math.round(v).toLocaleString();
    case 'deg':  return v.toFixed(1);
    case 'pct':  return v.toFixed(1);
    case 'mm':   return v.toFixed(1);
    default:     return String(v);
  }
}

function fmtSigned(v: number, type: string): string {
  const prefix = v > 0 ? '+' : '';
  return prefix + fmt(v, type);
}

function confidenceLevel(pct: number) {
  if (pct >= 80) return { label: 'High', color: C.conf, bg: C.confBg };
  if (pct >= 50) return { label: 'Medium', color: C.caution, bg: C.cautionBg };
  return { label: 'Low', color: C.flag, bg: C.flagBg };
}

// ─── Swing intent classification ───────────────────────────────
type SwingIntent = 'WARM-UP' | 'BASELINE' | 'DRILL' | 'TRANSFER' | 'FULL EFFORT';

function getSwingIntent(shot: ShotData): SwingIntent {
  if (shot.phase === 'warmup') return 'WARM-UP';
  if (shot.phase === 'transition') return 'BASELINE';
  if (shot.phase === 'pre-cue') return 'BASELINE';
  if (shot.phase === 'post-cue') {
    if (shot.flagged || shot.quality === 'outlier') return 'DRILL';
    if (shot.id <= 11) return 'DRILL';
    return 'TRANSFER';
  }
  return 'FULL EFFORT';
}

function intentColor(intent: SwingIntent): string {
  switch (intent) {
    case 'WARM-UP': return C.muted;
    case 'BASELINE': return C.dim;
    case 'DRILL': return C.caution;
    case 'TRANSFER': return C.accent;
    case 'FULL EFFORT': return C.ink;
  }
}

// ─── Phase color for timeline bars ─────────────────────────────
function phaseColor(shot: ShotData): string {
  if (shot.phase === 'post-cue') return C.phasePost;
  if (shot.phase === 'pre-cue') return C.phaseAdjust;
  return C.phaseBaseline;
}

// ─── Strike quality score (0-1) for timeline bar heights ───────
function strikeQuality(shot: ShotData): number {
  const dist = Math.sqrt(shot.strikeLocation.x ** 2 + shot.strikeLocation.y ** 2);
  return Math.max(0.15, 1 - dist / 15);
}

// ─── Animated value hook ───────────────────────────────────────
function useAnimatedValue(target: number, duration = 350) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    fromRef.current = display;
    const from = fromRef.current;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}

// ─── Video URL builder ─────────────────────────────────────────
const SESSION_ID = 'session-001';

function videoUrl(swingNumber: number, angle: 'dtl' | 'fo'): string {
  const pad = String(swingNumber).padStart(2, '0');
  return `/videos/sessions/${SESSION_ID}/swing-${pad}-${angle}.mov`;
}

// ─── Realtime shot reveal hook ─────────────────────────────────
function useRealtimeShots(allShots: ShotData[], intervalMs = 1800) {
  const [visibleCount, setVisibleCount] = useState(3);
  const totalRef = useRef(allShots.length);
  totalRef.current = allShots.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= totalRef.current) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return allShots.slice(0, visibleCount);
}

// ─── Focus metric options ──────────────────────────────────────
const FOCUS_OPTIONS = ['Strike quality', 'Speed control', 'Face-to-path', 'Launch window', 'Full effort'] as const;
type FocusMetric = typeof FOCUS_OPTIONS[number];

// ═══════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ─── Metric Cell (Neutral — NO judgment colors) ────────────────
function MetricCell({ label, value, unit }: {
  label: string; value: number; unit: string;
}) {
  const animated = useAnimatedValue(value);
  const isInteger = unit === 'yds' || unit === 'rpm';
  const displayVal = isInteger
    ? (unit === 'rpm' ? Math.round(animated).toLocaleString() : fmt(animated, unit))
    : fmt(animated, unit === 'mph' ? 'mph' : unit === '°' ? 'deg' : 'deg');

  return (
    <div style={{
      padding: '10px', borderRadius: 6,
      background: C.elevated, border: `1px solid ${C.border}`,
    }}>
      <div style={{
        fontFamily: F.data, fontSize: 8, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '.08em',
        color: C.muted, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{
          fontFamily: F.data, fontSize: 20, fontWeight: 700,
          color: C.data, letterSpacing: '-0.02em',
        }}>
          {displayVal}
        </span>
        <span style={{ fontFamily: F.data, fontSize: 9, color: C.dataDim }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

// ─── Confidence Badge ──────────────────────────────────────────
function ConfBadge({ value }: { value: number }) {
  const cl = confidenceLevel(value);
  return (
    <span style={{
      fontFamily: F.data, fontSize: 9, fontWeight: 700,
      padding: '2px 8px', borderRadius: 3,
      background: cl.bg, color: cl.color,
    }}>
      {value}%
    </span>
  );
}

// ─── Focus Metric Chip ─────────────────────────────────────────
function FocusChip({ value, onChange }: {
  value: FocusMetric;
  onChange: (v: FocusMetric) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontFamily: F.data, fontSize: 9, fontWeight: 700,
          letterSpacing: '.04em', padding: '3px 10px', borderRadius: 16,
          background: `${C.accent}08`, border: `1px solid ${C.accent}33`,
          color: C.accent, cursor: 'pointer',
        }}
      >
        ◉ FOCUS: {value.toUpperCase()} ▾
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: C.elevated, border: `1px solid ${C.border}`,
          borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          padding: 6, zIndex: 50, minWidth: 180,
        }}>
          <div style={{
            fontFamily: F.data, fontSize: 8, fontWeight: 700,
            letterSpacing: '.06em', color: C.muted, padding: '4px 8px',
            textTransform: 'uppercase',
          }}>
            System suggested · tap to override
          </div>
          {FOCUS_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                fontFamily: F.data, fontSize: 10, padding: '6px 8px',
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: opt === value ? C.accentBg : 'transparent',
                color: opt === value ? C.accent : C.body,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Session Timeline (Horizontal Shot Bar Chart) ──────────────
function SessionTimeline({ allShots, activeShotId, onSelectShot }: {
  allShots: ShotData[];
  activeShotId: number;
  onSelectShot: (id: number) => void;
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const maxQ = Math.max(...allShots.map(strikeQuality));

  return (
    <div style={{
      background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
      padding: '10px 14px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted,
        }}>
          Session Timeline
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Baseline', color: C.phaseBaseline },
            { label: 'Adjusting', color: C.phaseAdjust },
            { label: 'Post-cue', color: C.phasePost },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              <span style={{ fontFamily: F.data, fontSize: 8, color: C.muted }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        display: 'flex', gap: 3, height: 48, alignItems: 'flex-end',
      }}>
        {allShots.map(shot => {
          const isActive = shot.id === activeShotId;
          const isHovered = shot.id === hoveredId;
          const q = strikeQuality(shot) / maxQ;
          const color = phaseColor(shot);
          const barH = Math.max(8, q * 44);

          return (
            <div
              key={shot.id}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-end',
                cursor: 'pointer', position: 'relative',
              }}
              onClick={() => onSelectShot(shot.id)}
              onMouseEnter={() => setHoveredId(shot.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {(isActive || isHovered) && (
                <span style={{
                  fontFamily: F.data, fontSize: 7, fontWeight: 700,
                  color: isActive ? color : C.muted, marginBottom: 2,
                  position: 'absolute', top: -2,
                }}>
                  {shot.id}
                </span>
              )}
              <div style={{
                width: '100%', height: barH, borderRadius: 4,
                background: isActive
                  ? `linear-gradient(to top, ${color}88, ${color})`
                  : color,
                opacity: isActive ? 1 : 0.6,
                border: isActive ? `1px solid ${color}` : 'none',
                boxShadow: isActive ? `0 0 8px ${color}40` : 'none',
                transform: isHovered && !isActive ? 'scaleY(1.2) scaleX(1.08)' : 'none',
                transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s',
                transformOrigin: 'bottom',
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Clubface Impact Pattern (Trapezoidal Iron Face) ───────────
function ClubfaceImpact({ allShots, activeShotId, onSelectShot }: {
  allShots: ShotData[];
  activeShotId: number;
  onSelectShot: (id: number) => void;
}) {
  const cx = 50;
  const cy = 55;
  const grooveCount = 12;

  return (
    <div style={{
      background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
      padding: '14px 16px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted,
        }}>
          Impact Pattern
        </span>
        <span style={{ fontFamily: F.data, fontSize: 8, color: C.dim }}>
          {allShots.length} marks
        </span>
      </div>

      <svg viewBox="0 0 100 110" style={{ width: '100%', flex: 1, maxHeight: 280 }}>
        <defs>
          <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A2332" />
            <stop offset="35%" stopColor="#2A3A4E" />
            <stop offset="50%" stopColor="#354A60" />
            <stop offset="65%" stopColor="#2A3A4E" />
            <stop offset="100%" stopColor="#1A2332" />
          </linearGradient>
          <style>{`
            @keyframes glowPulse {
              0%, 100% { r: 10; opacity: 0.3; }
              50% { r: 16; opacity: 0.1; }
            }
          `}</style>
        </defs>

        {/* Perimeter labels */}
        <text x="8" y={cy + 2} style={{ fontFamily: F.data, fontSize: 5, fill: C.dim }} textAnchor="middle">TOE</text>
        <text x="92" y={cy + 2} style={{ fontFamily: F.data, fontSize: 5, fill: C.dim }} textAnchor="middle">HEEL</text>
        <text x={cx} y="18" style={{ fontFamily: F.data, fontSize: 5, fill: C.dim }} textAnchor="middle">HIGH</text>
        <text x={cx} y="100" style={{ fontFamily: F.data, fontSize: 5, fill: C.dim }} textAnchor="middle">LOW</text>

        {/* Trapezoidal iron face — wider topline, narrower sole */}
        <path
          d="M 22 24 L 78 24 Q 82 24 82 28 L 76 88 Q 75 92 72 92 L 28 92 Q 25 92 24 88 L 18 28 Q 18 24 22 24 Z"
          fill="url(#faceGrad)"
          stroke={C.border}
          strokeWidth="0.8"
        />

        {/* Groove lines — lower 2/3 of face */}
        {Array.from({ length: grooveCount }).map((_, i) => {
          const y = 52 + i * 3.2;
          const xInset = 2 + i * 0.3;
          return (
            <line key={i}
              x1={26 + xInset} y1={y}
              x2={74 - xInset} y2={y}
              stroke={C.dim} strokeWidth="0.3" opacity="0.5"
            />
          );
        })}

        {/* Sweet spot ellipse */}
        <ellipse cx={cx} cy={cy} rx="10" ry="8"
          fill="none" stroke={C.dim} strokeWidth="0.3" strokeDasharray="2 2" opacity="0.4"
        />

        {/* Center crosshair */}
        <line x1={cx} y1="30" x2={cx} y2="88"
          stroke={C.dim} strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3"
        />
        <line x1="24" y1={cy} x2="76" y2={cy}
          stroke={C.dim} strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3"
        />

        {/* Impact marks — accumulating */}
        {allShots.map((shot, idx) => {
          const isActive = shot.id === activeShotId;
          const dotX = cx + shot.strikeLocation.x * 1.6;
          const dotY = cy - shot.strikeLocation.y * 1.6;
          const age = allShots.length - idx;
          const opacity = isActive ? 1 : Math.max(0.12, 1 - age * 0.06);

          return (
            <g key={shot.id} onClick={() => onSelectShot(shot.id)} style={{ cursor: 'pointer' }}>
              {isActive && (
                <>
                  <circle cx={dotX} cy={dotY} r="10" fill="none"
                    stroke={C.accent} strokeWidth="0.6"
                    style={{ animation: 'glowPulse 2.5s ease-in-out infinite' }}
                  />
                  <circle cx={dotX} cy={dotY} r="5" fill={C.accent} opacity="0.8" />
                  <circle cx={dotX} cy={dotY} r="2" fill="white" />
                  <text x={dotX + 8} y={dotY - 4}
                    style={{ fontFamily: F.data, fontSize: 5, fill: C.accent, fontWeight: 700 }}
                  >
                    {shot.id}
                  </text>
                </>
              )}
              {!isActive && (
                <ellipse cx={dotX} cy={dotY} rx="2.5" ry="2"
                  fill={C.data} opacity={opacity}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Video Panel (maps to file system convention) ──────────────
function VideoPanel({ swingNumber, angle, label }: {
  swingNumber: number;
  angle: 'dtl' | 'fo';
  label: string;
}) {
  const [hasVideo, setHasVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubPos, setScrubPos] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = videoUrl(swingNumber, angle);

  const handleCanPlay = useCallback(() => setHasVideo(true), []);
  const handleError = useCallback(() => setHasVideo(false), []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setScrubPos(isNaN(pct) ? 0 : pct);
  }, []);

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    videoRef.current.currentTime = (pct / 100) * videoRef.current.duration;
    setScrubPos(pct);
  }, []);

  const changeSpeed = useCallback(() => {
    const speeds = [0.25, 0.5, 1];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  }, [playbackSpeed]);

  // Reset when swing changes
  useEffect(() => {
    setHasVideo(false);
    setIsPlaying(false);
    setScrubPos(0);
  }, [swingNumber]);

  return (
    <div style={{
      background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Label */}
      <div style={{
        padding: '8px 12px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted,
        }}>
          {label}
        </span>
        <span style={{ fontFamily: F.data, fontSize: 8, color: C.dim }}>
          Swing {String(swingNumber).padStart(2, '0')}
        </span>
      </div>

      {/* Video area */}
      <div style={{
        position: 'relative', aspectRatio: '16/10',
        background: C.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Hidden video element for probing */}
        <video
          ref={videoRef}
          src={src}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onTimeUpdate={handleTimeUpdate}
          playsInline
          muted
          preload="metadata"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            display: hasVideo ? 'block' : 'none',
          }}
        />

        {/* Placeholder when no video */}
        {!hasVideo && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            position: 'absolute', inset: 0, justifyContent: 'center',
          }}>
            {/* Subtle grid overlay */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
              <defs>
                <pattern id={`grid-${angle}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke={C.muted} strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${angle})`} />
            </svg>

            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: `2px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={18} color={C.muted} style={{ marginLeft: 2 }} />
            </div>
            <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
              {angle === 'dtl' ? 'Down the line' : 'Face on'} · No video
            </span>
          </div>
        )}

        {/* Click to play overlay */}
        {hasVideo && (
          <div
            onClick={togglePlay}
            style={{
              position: 'absolute', inset: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {!isPlaying && (
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Play size={18} color="white" style={{ marginLeft: 2 }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        padding: '6px 10px', borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button
          onClick={togglePlay}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 2, color: hasVideo ? C.body : C.dim,
          }}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} style={{ marginLeft: 1 }} />}
        </button>

        {/* Scrub bar */}
        <div
          onClick={hasVideo ? handleScrub : undefined}
          style={{
            flex: 1, height: 4, borderRadius: 2,
            background: C.border, cursor: hasVideo ? 'pointer' : 'default',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            height: '100%', borderRadius: 2,
            background: C.accent, width: `${scrubPos}%`,
            transition: 'width 0.1s',
          }} />
        </div>

        {/* Speed */}
        <button
          onClick={changeSpeed}
          style={{
            fontFamily: F.data, fontSize: 8, fontWeight: 700,
            color: C.muted, background: C.elevated, border: `1px solid ${C.border}`,
            borderRadius: 3, padding: '2px 6px', cursor: 'pointer',
          }}
        >
          {playbackSpeed}x
        </button>

        {/* Timestamp */}
        <span style={{ fontFamily: F.data, fontSize: 8, color: C.dim }}>
          00:00
        </span>
      </div>
    </div>
  );
}

// ─── AI Observation Card ───────────────────────────────────────
function AIObservationCard({ shotId, focusMetric, intent }: {
  shotId: number;
  focusMetric: FocusMetric;
  intent: SwingIntent;
}) {
  const insight = getInsightForShot(shotId);
  if (!insight) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.surface} 0%, ${C.accent}05 100%)`,
      borderRadius: 10, padding: '16px 18px',
      border: `1px solid ${C.accent}18`,
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.25s ease',
      animation: 'fadeUp 0.45s ease both',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${C.accent}30`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${C.accent}18`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${C.accent}35, transparent)`,
      }} />

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: F.data, fontSize: 9, fontWeight: 700,
            color: C.accent, letterSpacing: '.06em',
          }}>
            AI OBSERVATION
          </span>
          <span style={{
            fontFamily: F.data, fontSize: 8,
            padding: '2px 6px', borderRadius: 3,
            background: `${C.accent}10`, color: C.muted,
          }}>
            re: {focusMetric}
          </span>
        </div>
        <ConfBadge value={insight.confidence} />
      </div>

      <div style={{
        fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.65,
      }}>
        <strong style={{ color: intentColor(intent) }}>{intent}</strong> — {insight.observation}
      </div>
    </div>
  );
}

// ─── Recommendation Card ───────────────────────────────────────
function RecommendationCard({ shotId }: { shotId: number }) {
  const rec = getRecommendationForShot(shotId);
  if (!rec) return null;

  return (
    <div style={{
      background: C.surface, borderRadius: 10, padding: '16px 18px',
      border: `1px solid ${C.caution}18`,
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.25s ease',
      animation: 'fadeUp 0.45s ease 0.1s both',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${C.caution}30`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${C.caution}18`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top caution line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${C.caution}25, transparent)`,
      }} />

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: F.data, fontSize: 9, fontWeight: 700,
          color: C.caution, letterSpacing: '.06em',
        }}>
          RECOMMENDATION
        </span>
        <span style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          padding: '2px 8px', borderRadius: 3,
          background: C.cautionBg, color: C.caution,
        }}>
          {rec.infoGain}
        </span>
      </div>

      <div style={{
        fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.65,
      }}>
        {rec.text}
      </div>

      <button style={{
        marginTop: 10, fontFamily: F.data, fontSize: 8, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '.06em',
        padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
        background: 'transparent', border: `1px solid ${C.border}`,
        color: C.muted, transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
      >
        Override
      </button>
    </div>
  );
}

// ─── Advanced Group (Collapsible) ──────────────────────────────
function AdvancedGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.08em', color: C.dim,
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0',
        }}
      >
        {open ? '▾' : '▸'} {label}
      </button>
      {open && (
        <div style={{ padding: '8px 0', animation: 'fadeUp 0.2s ease both' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN SESSION VIEW
// ═══════════════════════════════════════════════════════════════

export default function CoachingOS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [activeShot, setActiveShot] = useState(14);
  const [focusMetric, setFocusMetric] = useState<FocusMetric>('Strike quality');
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const visibleShots = useRealtimeShots(shots, 2200);

  // Auto-advance to newest shot
  const prevCountRef = useRef(visibleShots.length);
  useEffect(() => {
    if (visibleShots.length > prevCountRef.current) {
      setActiveShot(visibleShots[visibleShots.length - 1].id);
      prevCountRef.current = visibleShots.length;
    }
  }, [visibleShots]);

  const currentShot = useMemo(
    () => visibleShots.find(s => s.id === activeShot) || visibleShots[visibleShots.length - 1],
    [activeShot, visibleShots],
  );

  const swingIntent = getSwingIntent(currentShot);

  const toggleStage = (id: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // CSS keyframes injection
  useEffect(() => {
    const id = 'looper-session-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      @keyframes breathe { 0%,100% { opacity:0.03; } 50% { opacity:0.07; } }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: C.bg, fontFamily: F.brand, color: C.body,
      position: 'relative',
    }}>
      {/* Ambient background breathe */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 800px 600px at 40% 30%, ${C.accent}06, transparent)`,
        animation: 'breathe 8s ease-in-out infinite',
      }} />

      {/* ═══ L1: GLOBAL BAR ═══════════════════════════════════════ */}
      <div style={{
        height: 44, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px', flexShrink: 0,
        background: `${C.surface}ee`, backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`, zIndex: 10,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex' }}>
            <span style={{
              fontFamily: F.brand, fontSize: 13, fontWeight: 800,
              letterSpacing: '.05em', color: C.ink,
            }}>LOOPER</span>
            <span style={{
              fontFamily: F.brand, fontSize: 13, fontWeight: 800,
              letterSpacing: '.05em', color: C.accent,
            }}>.AI</span>
          </Link>
          <Link to="/coach" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: F.brand, fontSize: 12, color: C.muted, fontWeight: 500,
          }}>
            <ArrowLeft size={12} /> Dashboard
          </Link>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%', background: C.conf,
            boxShadow: `0 0 8px ${C.conf}60`,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            fontFamily: F.data, fontSize: 10, fontWeight: 700,
            color: C.conf, letterSpacing: '.04em',
          }}>LIVE</span>
          <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
            {sessionContext.playerName}
          </span>
        </div>

        {/* End Session */}
        <button
          onClick={() => navigate('/coach/review')}
          style={{
            fontFamily: F.brand, fontSize: 11, fontWeight: 600,
            padding: '5px 14px', borderRadius: 6, cursor: 'pointer',
            background: `${C.flag}10`, border: `1px solid ${C.flag}30`,
            color: C.flag, transition: 'all 0.15s',
          }}
        >
          End Session
        </button>
      </div>

      {/* ═══ L2: CONTEXT BAR + FOCUS CHIP ═════════════════════════ */}
      <div style={{
        height: 36, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px',
        background: `${C.surface}99`, borderBottom: `1px solid ${C.border}`,
        flexShrink: 0, zIndex: 9, position: 'relative',
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Active pill */}
          <span style={{
            fontFamily: F.data, fontSize: 9, fontWeight: 700, padding: '3px 10px',
            borderRadius: 16, background: C.accentBg, color: C.accent,
            border: `1px solid ${C.accent}33`,
          }}>
            {sessionContext.playerName} · {sessionContext.handicap}
          </span>
          {/* Inactive pills */}
          {[
            `${sessionContext.club} · ${sessionContext.clubModel}`,
            `Session ${sessionContext.sessionNumber}/${sessionContext.totalSessions}`,
            `Swing ${activeShot}/${visibleShots.length}`,
          ].map(text => (
            <span key={text} style={{
              fontFamily: F.data, fontSize: 9, padding: '3px 10px',
              borderRadius: 16, border: `1px solid ${C.borderSub}`, color: C.muted,
            }}>
              {text}
            </span>
          ))}
        </div>
        <FocusChip value={focusMetric} onChange={setFocusMetric} />
      </div>

      {/* ═══ L3: DECISION TABS ════════════════════════════════════ */}
      <div style={{
        height: 36, display: 'flex', alignItems: 'stretch',
        padding: '0 20px', background: `${C.surface}60`,
        borderBottom: `1px solid ${C.border}`, flexShrink: 0,
        zIndex: 8, position: 'relative',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: F.brand, fontSize: 11,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? C.ink : C.muted,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 14px', position: 'relative',
              borderBottom: activeTab === tab.id
                ? `2px solid ${C.accent}`
                : '2px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ CONTENT AREA ═════════════════════════════════════════ */}
      <main style={{
        flex: 1, overflowY: 'auto', padding: '14px 20px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>

          {/* ════ OVERVIEW TAB ════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Swing header */}
              <div style={{
                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                letterSpacing: '.06em', color: C.muted,
                textTransform: 'uppercase',
              }}>
                Swing {activeShot} · {currentShot.club.toUpperCase()} · {swingIntent}
                {swingIntent === 'DRILL' && ' — 70%'}
              </div>

              {/* Row 1: Metric Grid (4×2) + Clubface Impact (320px) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: 10,
              }}>
                {/* 4×2 Metric Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: 6,
                }}>
                  <MetricCell label="Carry" value={currentShot.carry} unit="yds" />
                  <MetricCell label="Ball Speed" value={currentShot.ballSpeed} unit="mph" />
                  <MetricCell label="Spin Rate" value={currentShot.spinRate} unit="rpm" />
                  <MetricCell label="Launch Angle" value={currentShot.launchAngle} unit="°" />
                  <MetricCell label="Attack Angle" value={currentShot.attackAngle} unit="°" />
                  <MetricCell label="Club Path" value={currentShot.clubPath} unit="°" />
                  <MetricCell label="Face Angle" value={currentShot.faceAngle} unit="°" />
                  <MetricCell label="Impact X" value={currentShot.strikeLocation.x} unit="mm" />
                </div>

                {/* Clubface Impact Pattern */}
                <ClubfaceImpact
                  allShots={visibleShots}
                  activeShotId={activeShot}
                  onSelectShot={setActiveShot}
                />
              </div>

              {/* Row 2: Session Timeline */}
              <SessionTimeline
                allShots={visibleShots}
                activeShotId={activeShot}
                onSelectShot={setActiveShot}
              />

              {/* Row 3: Video Panels (DTL + Face-on) */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              }}>
                <VideoPanel
                  swingNumber={activeShot}
                  angle="dtl"
                  label="Video: Down the Line"
                />
                <VideoPanel
                  swingNumber={activeShot}
                  angle="fo"
                  label="Video: Face On"
                />
              </div>

              {/* Row 4: AI Observation Card */}
              <AIObservationCard
                shotId={activeShot}
                focusMetric={focusMetric}
                intent={swingIntent}
              />

              {/* Row 5: Recommendation Card */}
              <RecommendationCard shotId={activeShot} />

              {/* Row 6: Advanced Groups */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <AdvancedGroup label="Model Assumptions">
                  <div style={{
                    fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.6,
                    padding: '4px 0',
                  }}>
                    Player baseline derived from pre-cue 7-iron swings (shots 8-10). Attack angle benchmark
                    for 8-handicap: -2.0° to -3.5°. Strike quality scored by Euclidean distance from face center.
                    Session phase classification uses cue introduction at swing 10 as the dividing event.
                  </div>
                </AdvancedGroup>
                <AdvancedGroup label="Uncertainty Detail">
                  <div style={{
                    fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.6,
                    padding: '4px 0',
                  }}>
                    Strike location measurement uncertainty: ±1.5mm. Attack angle: ±0.3°. Carry distance
                    measurement: ±2 yds. Spin rate: ±200 rpm. Confidence intervals widen for swings with
                    off-center contact due to gear-effect-induced variance in measured values.
                  </div>
                </AdvancedGroup>
                <AdvancedGroup label="Full Swing Log">
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%', borderCollapse: 'collapse',
                      fontFamily: F.data, fontSize: 9,
                    }}>
                      <thead>
                        <tr>
                          {['#', 'Club', 'Carry', 'Speed', 'Spin', 'Launch', 'AoA', 'Path', 'Face', 'Strike X', 'Strike Y'].map(h => (
                            <th key={h} style={{
                              textAlign: 'left', padding: '4px 8px',
                              color: C.muted, fontWeight: 700,
                              textTransform: 'uppercase', letterSpacing: '.06em',
                              borderBottom: `1px solid ${C.border}`,
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleShots.map(shot => (
                          <tr
                            key={shot.id}
                            onClick={() => setActiveShot(shot.id)}
                            style={{
                              cursor: 'pointer',
                              background: shot.id === activeShot ? C.accentBg : 'transparent',
                            }}
                          >
                            <td style={{ padding: '3px 8px', color: shot.id === activeShot ? C.accent : C.data }}>{shot.id}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{shot.club}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{shot.carry}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{shot.ballSpeed.toFixed(1)}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{Math.round(shot.spinRate).toLocaleString()}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{shot.launchAngle.toFixed(1)}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{fmtSigned(shot.attackAngle, 'deg')}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{fmtSigned(shot.clubPath, 'deg')}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{fmtSigned(shot.faceAngle, 'deg')}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{shot.strikeLocation.x.toFixed(1)}</td>
                            <td style={{ padding: '3px 8px', color: C.data }}>{shot.strikeLocation.y.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AdvancedGroup>
              </div>
            </div>
          )}

          {/* ════ DIAGNOSIS TAB ═══════════════════════════════════ */}
          {activeTab === 'diagnosis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                letterSpacing: '.06em', color: C.muted, textTransform: 'uppercase',
              }}>
                Diagnosis Factors
              </div>
              {diagnosisFactors.map(factor => {
                const cl = confidenceLevel(factor.confidence);
                const isOpen = expandedStages.has(factor.id);
                return (
                  <div key={factor.id} style={{
                    background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
                    borderLeft: `3px solid ${cl.color}`, overflow: 'hidden',
                  }}>
                    <button
                      onClick={() => toggleStage(factor.id)}
                      style={{
                        width: '100%', padding: '12px 16px', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                        background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div>
                        <div style={{
                          fontFamily: F.data, fontSize: 8, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '.08em',
                          color: C.muted, marginBottom: 4,
                        }}>{factor.stage}</div>
                        <div style={{
                          fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink,
                        }}>{factor.title}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ConfBadge value={factor.confidence} />
                        {isOpen ? <ChevronUp size={14} color={C.muted} /> : <ChevronDown size={14} color={C.muted} />}
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 16px 14px', borderTop: `1px solid ${C.border}`,
                      }}>
                        <p style={{
                          fontFamily: F.brand, fontSize: 12, color: C.body,
                          lineHeight: 1.6, marginTop: 10,
                        }}>{factor.detail}</p>
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 8, marginTop: 10,
                        }}>
                          {factor.metrics.map(m => (
                            <div key={m.label} style={{
                              background: C.elevated, borderRadius: 8, padding: '8px 10px',
                            }}>
                              <div style={{
                                fontFamily: F.data, fontSize: 8, fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted,
                              }}>{m.label}</div>
                              <div style={{
                                fontFamily: F.data, fontSize: 14, fontWeight: 700,
                                color: C.data, marginTop: 2,
                              }}>{m.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ INTERVENTIONS TAB ═══════════════════════════════ */}
          {activeTab === 'interventions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                letterSpacing: '.06em', color: C.muted, textTransform: 'uppercase',
              }}>
                Available Interventions
              </div>
              {interventions.map(int => {
                const typeColor = int.type === 'External' ? C.conf
                  : int.type === 'Internal' ? C.caution : C.accent;
                return (
                  <div key={int.id} style={{
                    background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
                    padding: '14px 16px',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 8,
                    }}>
                      <span style={{
                        fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink,
                      }}>{int.name}</span>
                      <span style={{
                        fontFamily: F.data, fontSize: 9, fontWeight: 700,
                        padding: '2px 8px', borderRadius: 3,
                        background: typeColor + '12', color: typeColor,
                      }}>{int.type}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: i < int.difficulty ? C.accent : C.dim,
                        }} />
                      ))}
                    </div>
                    <p style={{
                      fontFamily: F.brand, fontSize: 12, color: C.body,
                      lineHeight: 1.6, margin: '0 0 6px',
                    }}>{int.expectedEffect}</p>
                    <p style={{
                      fontFamily: F.brand, fontSize: 12, color: C.muted,
                      lineHeight: 1.6, margin: 0, fontStyle: 'italic',
                    }}>{int.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ VIDEO TAB ══════════════════════════════════════ */}
          {activeTab === 'video-analysis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                letterSpacing: '.06em', color: C.muted, textTransform: 'uppercase',
              }}>
                Video Analysis · Swing {activeShot}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <VideoPanel swingNumber={activeShot} angle="dtl" label="Player: Down the Line" />
                <VideoPanel swingNumber={activeShot} angle="fo" label="Player: Face On" />
              </div>
              {/* Session Timeline for navigation */}
              <SessionTimeline
                allShots={visibleShots}
                activeShotId={activeShot}
                onSelectShot={setActiveShot}
              />
            </div>
          )}

          {/* ════ PLAYER PLAN TAB ════════════════════════════════ */}
          {activeTab === 'player-plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                letterSpacing: '.06em', color: C.muted, textTransform: 'uppercase',
              }}>
                Player Plan · {sessionContext.playerName}
              </div>
              <div style={{
                background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
                padding: '16px 18px',
              }}>
                <div style={{
                  fontFamily: F.brand, fontSize: 16, fontWeight: 500, color: C.ink,
                  marginBottom: 8,
                }}>Current Arc: Strike Consistency</div>
                <p style={{
                  fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.65,
                }}>
                  Session 3 of 8. Ground-pressure external cue producing measurable improvement
                  in attack angle and strike centering. Partial regression observed after 2-week break
                  (session 2 → 3), confirming the motor pattern is not yet automatic. Plan: continue
                  cue reinforcement for 2 more sessions, then layer constraint drill (tee-peg gate)
                  to build pattern without conscious reliance.
                </p>
              </div>
              <div style={{
                background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
                padding: '16px 18px',
              }}>
                <div style={{
                  fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink,
                  marginBottom: 8,
                }}>Homework</div>
                <ul style={{
                  fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.65,
                  margin: 0, paddingLeft: 20,
                }}>
                  <li>Practice ground-pressure feel with 50 balls, 7-iron only, 3x this week</li>
                  <li>No full-effort swings during practice — 70% effort, focus on feel</li>
                  <li>Note where divots start relative to ball position</li>
                </ul>
              </div>
            </div>
          )}

          {/* ════ PLAYER HISTORY TAB ═════════════════════════════ */}
          {activeTab === 'player-history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                letterSpacing: '.06em', color: C.muted, textTransform: 'uppercase',
              }}>
                Lesson History · {sessionContext.playerName}
              </div>
              {playerHistory.lessons.map(lesson => (
                <div key={lesson.sessionNumber} style={{
                  background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${lesson.status === 'in-progress' ? C.accent : C.muted}`,
                  padding: '14px 16px',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 6,
                  }}>
                    <span style={{
                      fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink,
                    }}>
                      Session {lesson.sessionNumber}: {lesson.focus}
                    </span>
                    <span style={{
                      fontFamily: F.data, fontSize: 8, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 3,
                      background: lesson.status === 'in-progress' ? C.accentBg : `${C.muted}15`,
                      color: lesson.status === 'in-progress' ? C.accent : C.muted,
                      textTransform: 'uppercase',
                    }}>
                      {lesson.status}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: F.data, fontSize: 9, color: C.muted, marginBottom: 8,
                  }}>
                    {lesson.date} · {lesson.club}
                  </div>
                  <p style={{
                    fontFamily: F.brand, fontSize: 12, color: C.body,
                    lineHeight: 1.6, margin: 0,
                  }}>
                    {lesson.keyTakeaway}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
