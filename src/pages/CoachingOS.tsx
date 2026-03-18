import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import type { TabId, ShotData, DiagnosisFactor } from '../data/coachingOSData';
import {
  C, F, shots, sessionContext, tabs, baselineAvg,
  diagnosisFactors, interventions, playerHistory,
  getInsightForShot, getRecommendationForShot,
  fmtDelta, confidenceLevel,
} from '../data/coachingOSData';

/** Hook: reveals shots one at a time with delay to simulate real-time data */
function useRealtimeShots(allShots: ShotData[], intervalMs = 1800) {
  const [visibleCount, setVisibleCount] = useState(3); // start with warm-up
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

// ─── Reusable sub-components (inline) ───────────────────────────

function ConfBadge({ value }: { value: number }) {
  const cl = confidenceLevel(value);
  return (
    <span style={{
      fontFamily: F.data, fontSize: 9, fontWeight: 700,
      padding: '1px 7px', borderRadius: 3,
      background: cl.bg, color: cl.color,
    }}>
      {value}%
    </span>
  );
}

function KpiTile({ label, value, unit, delta, deltaType, confidence, borderColor }: {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  deltaType?: string;
  confidence?: number;
  borderColor?: string;
}) {
  const d = delta !== undefined && deltaType ? fmtDelta(delta, deltaType) : null;
  return (
    <div style={{
      background: C.surface, borderRadius: 12, padding: '14px 16px',
      border: `0.5px solid ${C.borderSub}`, borderLeft: `3px solid ${borderColor || C.accent}`,
    }}>
      <div style={{
        fontFamily: F.data, fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: F.data, fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: '-.01em' }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 400, color: C.muted }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        {d && (
          <span style={{ fontFamily: F.data, fontSize: 9, color: d.color }}>
            {d.text} vs baseline
          </span>
        )}
        {confidence !== undefined && <ConfBadge value={confidence} />}
      </div>
    </div>
  );
}

function StrikeMapSVG({ allShots, activeShotId }: { allShots: ShotData[]; activeShotId: number }) {
  // SVG viewBox: clubface ~60mm wide, ~70mm tall
  const cx = 30;
  const cy = 35;
  return (
    <div style={{
      background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
      padding: '14px 16px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        fontFamily: F.data, fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
        marginBottom: 8,
      }}>
        Strike Map
      </div>
      <svg viewBox="0 0 60 70" style={{ width: '100%', maxHeight: 260, flex: 1 }}>
        {/* Clubface outline */}
        <rect x="5" y="3" width="50" height="64" rx="6" ry="6"
          fill={C.surfaceAlt} stroke={C.border} strokeWidth="0.5" />
        {/* Center crosshair */}
        <line x1={cx} y1="8" x2={cx} y2="62" stroke={C.borderSub} strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="10" y1={cy} x2="50" y2={cy} stroke={C.borderSub} strokeWidth="0.3" strokeDasharray="2 2" />
        {/* Sweet spot zone */}
        <ellipse cx={cx} cy={cy} rx="6" ry="5" fill="none" stroke={C.dim} strokeWidth="0.3" strokeDasharray="1.5 1.5" />
        {/* Strike dots */}
        {allShots.map((shot) => {
          const isActive = shot.id === activeShotId;
          const dotX = cx + shot.strikeLocation.x * 0.8;
          const dotY = cy - shot.strikeLocation.y * 0.8;
          const fill = isActive ? C.accent : shot.flagged ? C.flag : C.muted;
          const r = isActive ? 2.5 : 1.8;
          return (
            <g key={shot.id}>
              {isActive && (
                <circle cx={dotX} cy={dotY} r="4" fill="none"
                  stroke={C.accent} strokeWidth="0.6" opacity="0.4" />
              )}
              <circle cx={dotX} cy={dotY} r={r}
                fill={fill} opacity={isActive || shot.flagged ? 1 : 0.5} />
            </g>
          );
        })}
      </svg>
      {/* Cluster label */}
      <div style={{
        fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 6, textAlign: 'center',
      }}>
        Heel-toe spread: 14mm (pre-cue) → 3mm (post-cue)
      </div>
    </div>
  );
}

function StageCardComponent({ factor, isExpanded, onToggle }: {
  factor: DiagnosisFactor;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cl = confidenceLevel(factor.confidence);
  return (
    <div style={{
      background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
      borderLeft: `3px solid ${cl.color}`, overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 4 }}>
            {factor.stage}
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink }}>
            {factor.title}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ConfBadge value={factor.confidence} />
          {isExpanded
            ? <ChevronUp size={14} color={C.muted} />
            : <ChevronDown size={14} color={C.muted} />
          }
        </div>
      </button>
      {isExpanded && (
        <div style={{ padding: '0 16px 14px', borderTop: `0.5px solid ${C.borderSub}` }}>
          <p style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.6, marginTop: 10 }}>
            {factor.detail}
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10,
          }}>
            {factor.metrics.map((m) => (
              <div key={m.label} style={{
                background: C.surfaceAlt, borderRadius: 8, padding: '8px 10px',
              }}>
                <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink, marginTop: 2 }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────

export default function CoachingOS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [activeShot, setActiveShot] = useState(14);
  const [shotRailCollapsed, setShotRailCollapsed] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());
  const [onCourseExpanded, setOnCourseExpanded] = useState(true);
  const [kpiFlash, setKpiFlash] = useState(false);

  // Simulate real-time shot arrival
  const visibleShots = useRealtimeShots(shots, 2200);

  // Flash KPI tiles when a new shot arrives
  const prevCountRef = useRef(visibleShots.length);
  useEffect(() => {
    if (visibleShots.length > prevCountRef.current) {
      setKpiFlash(true);
      setActiveShot(visibleShots[visibleShots.length - 1].id);
      const t = setTimeout(() => setKpiFlash(false), 800);
      prevCountRef.current = visibleShots.length;
      return () => clearTimeout(t);
    }
  }, [visibleShots]);

  const currentShot = useMemo(() => visibleShots.find((s) => s.id === activeShot) || visibleShots[visibleShots.length - 1], [activeShot, visibleShots]);
  const insight = useMemo(() => getInsightForShot(activeShot), [activeShot]);
  const recommendation = useMemo(() => getRecommendationForShot(activeShot), [activeShot]);

  const showShotRail = activeTab !== 'player-plan' && activeTab !== 'player-history';

  const toggleStage = (id: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLesson = (sessionNum: number) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(sessionNum)) next.delete(sessionNum);
      else next.add(sessionNum);
      return next;
    });
  };

  // Find last completed lesson for the hero card
  const lastCompletedLesson = playerHistory.lessons
    .filter((l) => l.status === 'completed')
    .sort((a, b) => b.sessionNumber - a.sessionNumber)[0];

  // ─── Shot-level deltas ────────────────────────────────────────
  const carryDelta = currentShot.club === '7i' ? currentShot.carry - baselineAvg.carry : undefined;
  const speedDelta = currentShot.club === '7i' ? currentShot.ballSpeed - baselineAvg.ballSpeed : undefined;
  const spinDelta = currentShot.club === '7i' ? currentShot.spinRate - baselineAvg.spinRate : undefined;

  // Quality color
  const qualityColor = currentShot.quality === 'good' ? C.conf
    : currentShot.quality === 'outlier' ? C.flag
    : currentShot.quality === 'moderate' ? C.caution : C.flag;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: F.brand }}>

      {/* ═══ L1: SESSION BAR ════════════════════════════════════════ */}
      <div style={{
        height: 44, background: C.ink, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Left: Brand + Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0,
          }}>
            <span style={{
              fontFamily: F.brand, fontSize: 13, fontWeight: 800,
              letterSpacing: '.04em', color: 'rgba(255,255,255,0.7)',
            }}>
              LOOPER
            </span>
            <span style={{
              fontFamily: F.brand, fontSize: 13, fontWeight: 800,
              letterSpacing: '.04em', color: C.accent,
            }}>
              .AI
            </span>
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <Link to="/coach" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: F.brand, fontWeight: 500,
            transition: 'color 0.15s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>
        </div>

        {/* Center: Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%', background: C.accent,
            boxShadow: `0 0 8px ${C.accent}60`,
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            fontFamily: F.brand, fontSize: 12, fontWeight: 600,
            color: 'white', letterSpacing: '.02em',
          }}>
            Live Session
          </span>
          <span style={{
            fontFamily: F.data, fontSize: 10, fontWeight: 400,
            color: 'rgba(255,255,255,0.35)', marginLeft: 4,
          }}>
            {sessionContext.playerName}
          </span>
        </div>

        {/* Right: End Session */}
        <button
          onClick={() => navigate('/coach/review')}
          style={{
            fontFamily: F.brand, fontSize: 11, fontWeight: 600,
            padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: C.accent, color: 'white', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          End Session →
        </button>
      </div>

      {/* ═══ L2: CONTEXT BAR ══════════════════════════════════════ */}
      <div style={{
        height: 34, background: C.surface, display: 'flex', alignItems: 'center',
        gap: 6, padding: '0 20px', borderBottom: `0.5px solid ${C.border}`,
        flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Active pill */}
        <button style={{
          fontFamily: F.data, fontSize: 9, fontWeight: 700, padding: '3px 10px',
          borderRadius: 12, background: C.accentBg, color: C.accent,
          border: `0.5px solid ${C.accent}`, whiteSpace: 'nowrap' as const,
          cursor: 'pointer', lineHeight: 1.3,
        }}>
          {sessionContext.playerName} · {sessionContext.handicap}
        </button>
        {/* Neutral pills */}
        {[
          `${sessionContext.club} · ${sessionContext.clubModel}`,
          `Session ${sessionContext.sessionNumber} of ${sessionContext.totalSessions}`,
          `Swing ${activeShot}/${sessionContext.totalSwings}`,
          `Goal: ${sessionContext.goal}`,
        ].map((text) => (
          <button key={text} style={{
            fontFamily: F.data, fontSize: 9, padding: '3px 10px',
            borderRadius: 12, border: `0.5px solid ${C.borderSub}`, color: C.muted,
            background: 'transparent', whiteSpace: 'nowrap' as const,
            cursor: 'pointer', lineHeight: 1.3,
          }}>
            {text}
          </button>
        ))}
      </div>

      {/* ═══ L3: DECISION TABS ════════════════════════════════════ */}
      <div style={{
        height: 36, background: C.surface, display: 'flex', alignItems: 'stretch',
        padding: '0 20px', borderBottom: `0.5px solid ${C.border}`, flexShrink: 0,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: F.brand, fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? C.accent : C.muted,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 16px', position: 'relative',
              borderBottom: activeTab === tab.id ? `2px solid ${C.accent}` : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ BODY: SHOT RAIL + CONTENT ════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Shot Rail (72px) ──────────────────────────────────── */}
        {showShotRail && (
          <div style={{
            width: shotRailCollapsed ? 28 : 72, flexShrink: 0,
            background: C.surface, borderRight: `0.5px solid ${C.border}`,
            display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease',
          }}>
            {/* Header */}
            <div style={{
              padding: shotRailCollapsed ? '8px 4px' : '8px 10px',
              display: 'flex', alignItems: 'center', justifyContent: shotRailCollapsed ? 'center' : 'space-between',
              borderBottom: `0.5px solid ${C.borderSub}`,
            }}>
              {!shotRailCollapsed && (
                <span style={{
                  fontFamily: F.data, fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                }}>
                  Shots
                </span>
              )}
              <button
                onClick={() => setShotRailCollapsed(!shotRailCollapsed)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: C.muted }}
              >
                {shotRailCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
              </button>
            </div>

            {/* Shot entries */}
            {!shotRailCollapsed && (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {[...visibleShots].reverse().map((shot, revIdx) => {
                  const isActive = shot.id === activeShot;
                  const badgeBg = isActive ? C.accent : shot.flagged ? C.flag : C.surfaceAlt;
                  const badgeColor = isActive || shot.flagged ? 'white' : C.ink;
                  const rowBg = isActive ? C.accentBg : 'transparent';

                  return (
                    <button
                      key={shot.id}
                      className={revIdx === 0 ? 'animate-stagger-in' : ''}
                      onClick={() => setActiveShot(shot.id)}
                      style={{
                        width: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', padding: '6px 0', gap: 2,
                        background: rowBg, border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: badgeBg, color: badgeColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: F.data, fontSize: 10, fontWeight: 700,
                      }}>
                        {shot.id}
                      </div>
                      <span style={{
                        fontFamily: F.data, fontSize: 8, fontWeight: 400,
                        color: isActive ? C.accent : C.muted,
                        textTransform: 'uppercase' as const,
                      }}>
                        {shot.club}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Main Content Area ─────────────────────────────────── */}
        <main style={{
          flex: 1, overflowY: 'auto', padding: '16px 20px',
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>

            {/* ════ OVERVIEW TAB ════════════════════════════════════ */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* KPI Grid (4 columns) */}
                <div className={kpiFlash ? 'animate-kpi-flash' : ''} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, borderRadius: 12 }}>
                  <KpiTile
                    label="Carry" value={String(currentShot.carry)} unit="yds"
                    delta={carryDelta} deltaType="yds"
                    borderColor={carryDelta && carryDelta > 0 ? C.conf : carryDelta && carryDelta < 0 ? C.flag : C.accent}
                  />
                  <KpiTile
                    label="Ball Speed" value={currentShot.ballSpeed.toFixed(1)} unit="mph"
                    delta={speedDelta} deltaType="mph"
                    borderColor={speedDelta && speedDelta > 0 ? C.conf : speedDelta && speedDelta < 0 ? C.flag : C.accent}
                  />
                  <KpiTile
                    label="Spin Rate" value={Math.round(currentShot.spinRate).toLocaleString()} unit="rpm"
                    delta={spinDelta} deltaType="rpm"
                    borderColor={spinDelta && spinDelta < 0 ? C.conf : spinDelta && spinDelta > 0 ? C.flag : C.accent}
                  />
                  <KpiTile
                    label="Strike Quality"
                    value={currentShot.quality.charAt(0).toUpperCase() + currentShot.quality.slice(1)}
                    confidence={insight?.confidence}
                    borderColor={qualityColor}
                  />
                </div>

                {/* Two-column: Video + Strike Map */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {/* Video placeholder */}
                  <div style={{
                    background: C.ink, borderRadius: 12, padding: '40px 20px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 12, minHeight: 240,
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Play size={20} color="rgba(255,255,255,0.4)" style={{ marginLeft: 2 }} />
                    </div>
                    <span style={{
                      fontFamily: F.brand, fontSize: 12, color: 'rgba(255,255,255,0.35)',
                    }}>
                      DTL camera · 240fps · tap to play
                    </span>
                  </div>

                  {/* Strike Map */}
                  <div role="img" aria-label={`Strike map showing ${visibleShots.length} impact locations on clubface. Active shot ${activeShot}.`}>
                    <StrikeMapSVG allShots={visibleShots} activeShotId={activeShot} />
                  </div>
                </div>

                {/* AI Insight Card */}
                {insight && (
                  <div style={{
                    background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                    borderLeft: `3px solid ${C.accent}`, padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{
                        fontFamily: F.data, fontSize: 10, fontWeight: 700,
                        textTransform: 'uppercase' as const, letterSpacing: '.06em', color: C.accent,
                      }}>
                        AI Observation
                      </span>
                      <ConfBadge value={insight.confidence} />
                    </div>
                    <p style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.6, margin: 0 }}>
                      {insight.observation}
                    </p>
                  </div>
                )}

                {/* Recommendation Card */}
                {recommendation && (
                  <div style={{
                    background: C.accentBg, borderRadius: 12,
                    borderLeft: `3px solid ${C.accent}`, padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{
                        fontFamily: F.data, fontSize: 10, fontWeight: 700,
                        textTransform: 'uppercase' as const, letterSpacing: '.06em', color: C.accent,
                      }}>
                        Recommendation
                      </span>
                      <span style={{
                        fontFamily: F.data, fontSize: 9, fontWeight: 700,
                        padding: '1px 7px', borderRadius: 3,
                        background: C.accent, color: 'white',
                      }}>
                        {recommendation.infoGain}
                      </span>
                    </div>
                    <p style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.6, margin: 0 }}>
                      {recommendation.text}
                    </p>
                  </div>
                )}

                {/* Collapsible Advanced Section */}
                <div style={{ borderTop: `0.5px solid ${C.border}`, paddingTop: 8 }}>
                  <button
                    onClick={() => setAdvancedOpen(!advancedOpen)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: F.data, fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                    }}
                  >
                    {advancedOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Model assumptions · Uncertainty detail · Full swing log
                  </button>
                  {advancedOpen && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8,
                      marginTop: 10,
                    }}>
                      {[
                        { label: 'Attack Angle', value: `${currentShot.attackAngle > 0 ? '+' : ''}${currentShot.attackAngle.toFixed(1)}°` },
                        { label: 'Club Path', value: `${currentShot.clubPath > 0 ? '+' : ''}${currentShot.clubPath.toFixed(1)}°` },
                        { label: 'Face Angle', value: `${currentShot.faceAngle > 0 ? '+' : ''}${currentShot.faceAngle.toFixed(1)}°` },
                        { label: 'Launch Angle', value: `${currentShot.launchAngle.toFixed(1)}°` },
                        { label: 'Smash Factor', value: (currentShot.ballSpeed / 90).toFixed(2) },
                        { label: 'Dynamic Loft', value: `${(currentShot.launchAngle + Math.abs(currentShot.attackAngle)).toFixed(1)}°` },
                      ].map((m) => (
                        <div key={m.label} style={{
                          background: C.surfaceAlt, borderRadius: 8, padding: '10px 12px',
                        }}>
                          <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted }}>
                            {m.label}
                          </div>
                          <div style={{ fontFamily: F.data, fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 2 }}>
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════ VIDEO ANALYSIS TAB ══════════════════════════════ */}
            {activeTab === 'video-analysis' && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
                gap: 12, height: 'calc(100vh - 160px)',
              }}>
                {/* Panel 01: Player Swing */}
                <div style={{
                  background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                  padding: '14px 16px', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 8 }}>
                    01 &nbsp; Player Swing
                  </div>
                  <div style={{
                    flex: 1, background: C.ink, borderRadius: 8, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Play size={32} color="rgba(255,255,255,0.3)" />
                  </div>
                  {/* P-position pills */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <span key={i} style={{
                        fontFamily: F.data, fontSize: 9, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 3, border: `0.5px solid ${C.borderSub}`, color: C.muted,
                        cursor: 'pointer',
                      }}>
                        P{i + 1}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Panel 02: Reference Comparison */}
                <div style={{
                  background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                  padding: '14px 16px', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 8 }}>
                    02 &nbsp; Reference Comparison
                  </div>
                  <div style={{
                    flex: 1, background: C.surfaceAlt, borderRadius: 8, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: F.brand, fontSize: 12, color: C.dim }}>Select reference</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                    {['Tour pro — Rory McIlroy P6', 'Previous best — Session 2, Swing 9', '3D avatar overlay'].map((ref) => (
                      <div key={ref} style={{
                        fontFamily: F.brand, fontSize: 11, color: C.body, padding: '4px 8px',
                        borderRadius: 6, background: C.surfaceAlt, cursor: 'pointer',
                      }}>
                        {ref}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 03: Position Data */}
                <div style={{
                  background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                  padding: '14px 16px', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 8 }}>
                    03 &nbsp; Delivery Metrics
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {[
                      { label: 'Club Path', value: `${currentShot.clubPath > 0 ? '+' : ''}${currentShot.clubPath.toFixed(1)}°` },
                      { label: 'Face Angle', value: `${currentShot.faceAngle > 0 ? '+' : ''}${currentShot.faceAngle.toFixed(1)}°` },
                      { label: 'Attack Angle', value: `${currentShot.attackAngle.toFixed(1)}°` },
                      { label: 'Dynamic Loft', value: `${(currentShot.launchAngle + Math.abs(currentShot.attackAngle)).toFixed(1)}°` },
                      { label: 'Spin Loft', value: `${(currentShot.launchAngle + Math.abs(currentShot.attackAngle) - currentShot.clubPath).toFixed(1)}°` },
                      { label: 'Shaft Lean', value: `${(Math.abs(currentShot.attackAngle) - 1.5).toFixed(1)}°` },
                    ].map((m) => (
                      <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: `0.5px solid ${C.borderSub}` }}>
                        <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body }}>{m.label}</span>
                        <span style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: C.ink }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, padding: '8px 10px', background: C.surfaceAlt, borderRadius: 8 }}>
                    <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 4 }}>
                      3D Kinematics
                    </div>
                    <span style={{ fontFamily: F.brand, fontSize: 11, color: C.dim }}>
                      Sportsbox AI data not connected for this session
                    </span>
                  </div>
                </div>

                {/* Panel 04: AI Position Analysis */}
                <div style={{
                  background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                  padding: '14px 16px', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 8 }}>
                    04 &nbsp; AI Position Analysis
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    {[
                      { pos: 'P4', text: 'Lead wrist slightly cupped at top — contributing to open face at transition. Correlation with heel strikes: moderate.', conf: 68 },
                      { pos: 'P6', text: 'Shaft steep relative to elbow plane. Early extension begins here as the body compensates for steep delivery.', conf: 82 },
                      { pos: 'P7', text: 'Club releases early — handle stops rotating while clubhead continues. Consistent with the high dynamic loft numbers.', conf: 76 },
                    ].map((entry) => {
                      const cl = confidenceLevel(entry.conf);
                      return (
                        <div key={entry.pos} style={{
                          background: C.surfaceAlt, borderRadius: 8, padding: '10px 12px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, color: C.accent }}>
                              {entry.pos}
                            </span>
                            <span style={{
                              fontFamily: F.data, fontSize: 9, fontWeight: 700,
                              padding: '1px 7px', borderRadius: 3,
                              background: cl.bg, color: cl.color,
                            }}>
                              {entry.conf}%
                            </span>
                          </div>
                          <p style={{ fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.5, margin: 0 }}>
                            {entry.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════ DIAGNOSIS TAB ═══════════════════════════════════ */}
            {activeTab === 'diagnosis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Primary Limiter */}
                <div style={{
                  background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                  borderLeft: `3px solid ${C.accent}`, padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.accent, marginBottom: 6 }}>
                        Primary Limiter
                      </div>
                      <h3 style={{ fontFamily: F.brand, fontSize: 16, fontWeight: 600, color: C.ink, margin: 0 }}>
                        {diagnosisFactors[0].title}
                      </h3>
                    </div>
                    <ConfBadge value={diagnosisFactors[0].confidence} />
                  </div>
                  <p style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.6, marginTop: 8 }}>
                    {diagnosisFactors[0].detail}
                  </p>
                </div>

                {/* Contributing Factors (Stage Cards) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted }}>
                    Contributing Factors
                  </div>
                  {diagnosisFactors.slice(1).map((factor) => (
                    <StageCardComponent
                      key={factor.id}
                      factor={factor}
                      isExpanded={expandedStages.has(factor.id)}
                      onToggle={() => toggleStage(factor.id)}
                    />
                  ))}
                </div>

                {/* Session Trend */}
                <div style={{
                  background: C.confBg, borderRadius: 12, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <ArrowUpRight size={16} color={C.conf} />
                  <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.conf }}>
                    Session trend: Improving
                  </span>
                  <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginLeft: 'auto' }}>
                    Post-cue swings show +12.3 yds carry vs baseline
                  </span>
                </div>
              </div>
            )}

            {/* ════ INTERVENTIONS TAB ═══════════════════════════════ */}
            {activeTab === 'interventions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 4 }}>
                  Available Interventions
                </div>
                {interventions.map((intv) => {
                  const typeColor = intv.type === 'External' ? C.conf
                    : intv.type === 'Internal' ? '#3B82F6'
                    : C.caution;
                  const typeBg = intv.type === 'External' ? C.confBg
                    : intv.type === 'Internal' ? '#EFF6FF'
                    : C.cautionBg;
                  return (
                    <div key={intv.id} style={{
                      background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                      padding: '16px 20px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h3 style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: C.ink, margin: 0 }}>
                          {intv.name}
                        </h3>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{
                            fontFamily: F.data, fontSize: 9, fontWeight: 700, padding: '2px 8px',
                            borderRadius: 3, background: typeBg, color: typeColor,
                          }}>
                            {intv.type}
                          </span>
                          <span style={{
                            fontFamily: F.data, fontSize: 9, fontWeight: 700, padding: '2px 8px',
                            borderRadius: 3, background: C.surfaceAlt, color: C.muted,
                          }}>
                            Difficulty: {'●'.repeat(intv.difficulty)}{'○'.repeat(5 - intv.difficulty)}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.6, margin: 0, marginBottom: 8 }}>
                        {intv.description}
                      </p>
                      <div style={{
                        fontFamily: F.brand, fontSize: 11, color: C.accent, fontWeight: 500,
                        padding: '6px 10px', background: C.accentBg, borderRadius: 6,
                      }}>
                        Expected effect: {intv.expectedEffect}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ════ PLAYER PLAN TAB ═════════════════════════════════ */}
            {activeTab === 'player-plan' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 }}>
                {/* Session Summary */}
                <div style={{
                  background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                  padding: '20px 24px',
                }}>
                  <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 10 }}>
                    Session Summary
                  </div>
                  <h2 style={{ fontFamily: F.brand, fontSize: 18, fontWeight: 700, color: C.ink, margin: '0 0 12px' }}>
                    Session 3: Strike Consistency — 7-Iron
                  </h2>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: C.confBg, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ArrowUpRight size={14} color={C.conf} />
                      <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color: C.conf }}>
                        +12.3 yds carry improvement
                      </span>
                    </div>
                    <div style={{ background: C.confBg, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ArrowDownRight size={14} color={C.conf} />
                      <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color: C.conf }}>
                        -3° attack angle shallowed
                      </span>
                    </div>
                  </div>
                  <p style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.7 }}>
                    Jake showed significant improvement in strike quality after introducing the external ground-pressure cue at swing 10. Pre-cue 7-iron baseline averaged 156.7 yds carry with -5.0° attack angle and 14mm heel-toe strike spread. Post-cue validation (swings 12-14) averaged 166.7 yds carry with -2.5° attack angle and 3mm strike spread. One outlier (swing 11) showed regression consistent with initial cue misinterpretation, which self-corrected.
                  </p>
                </div>

                {/* Next Session Goals */}
                <div style={{
                  background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                  padding: '20px 24px',
                }}>
                  <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted, marginBottom: 10 }}>
                    Next Session Goals
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      'Confirm retention of ground-pressure cue under fresh conditions (first 5 swings)',
                      'Introduce tee-peg gate drill to build motor pattern without conscious cue',
                      'Test cue transfer to 6-iron and 5-iron (longer clubs amplify delivery errors)',
                      'Assess whether face-to-path volatility has stabilized independently',
                    ].map((goal, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{
                          fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.accent,
                          marginTop: 3, flexShrink: 0,
                        }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.5 }}>
                          {goal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════ PLAYER HISTORY TAB ═══════════════════════════════ */}
            {activeTab === 'player-history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 }}>

                {/* ──── SECTION 1: LAST LESSON RECAP (Hero Card) ──── */}
                {lastCompletedLesson && (
                  <div style={{
                    background: C.accentBg, borderRadius: 12,
                    borderLeft: `3px solid ${C.accent}`, padding: '20px 24px',
                  }}>
                    <div style={{
                      fontFamily: F.data, fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.accent,
                      marginBottom: 10,
                    }}>
                      Last Lesson Recap
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h2 style={{
                        fontFamily: F.brand, fontSize: 18, fontWeight: 700, color: C.ink, margin: 0,
                      }}>
                        Session {lastCompletedLesson.sessionNumber}: {lastCompletedLesson.focus}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 16 }}>
                        <Calendar size={12} color={C.muted} />
                        <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
                          {lastCompletedLesson.date}
                        </span>
                      </div>
                    </div>

                    <p style={{
                      fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.7, margin: '0 0 14px',
                    }}>
                      {lastCompletedLesson.summary}
                    </p>

                    {/* Key metrics grid */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8,
                      marginBottom: 14,
                    }}>
                      {lastCompletedLesson.metrics.map((m) => (
                        <div key={m.label} style={{
                          background: C.surface, borderRadius: 8, padding: '8px 10px',
                        }}>
                          <div style={{
                            fontFamily: F.data, fontSize: 9, fontWeight: 700,
                            textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                          }}>
                            {m.label}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                            <span style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink }}>
                              {m.after}
                            </span>
                            <span style={{ fontFamily: F.data, fontSize: 9, color: m.improved ? C.conf : C.flag }}>
                              from {m.before}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cue used pill */}
                    {lastCompletedLesson.cueUsed && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', background: C.surface, borderRadius: 6,
                        border: `0.5px solid ${C.borderSub}`, marginBottom: 12,
                      }}>
                        <span style={{
                          fontFamily: F.data, fontSize: 9, fontWeight: 700,
                          textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.accent,
                        }}>
                          Cue Used
                        </span>
                        <span style={{
                          fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink, fontStyle: 'italic',
                        }}>
                          &ldquo;{lastCompletedLesson.cueUsed}&rdquo;
                        </span>
                      </div>
                    )}

                    {/* Continue From Here callout */}
                    <div style={{
                      padding: '10px 14px', background: C.surface, borderRadius: 8,
                      borderLeft: `2px solid ${C.accent}`,
                    }}>
                      <div style={{
                        fontFamily: F.data, fontSize: 9, fontWeight: 700,
                        textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                        marginBottom: 4,
                      }}>
                        Continue From Here
                      </div>
                      <p style={{
                        fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink,
                        lineHeight: 1.5, margin: 0,
                      }}>
                        {lastCompletedLesson.keyTakeaway}
                      </p>
                    </div>
                  </div>
                )}

                {/* ──── SECTION 2: SESSION HISTORY ──────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{
                    fontFamily: F.data, fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                  }}>
                    Session History
                  </div>

                  {[...playerHistory.lessons].reverse().map((lesson) => {
                    const isExpanded = expandedLessons.has(lesson.sessionNumber);
                    const statusColor = lesson.status === 'completed' ? C.conf
                      : lesson.status === 'in-progress' ? C.caution : C.muted;
                    const statusBg = lesson.status === 'completed' ? C.confBg
                      : lesson.status === 'in-progress' ? C.cautionBg : C.surfaceAlt;
                    const borderColor = lesson.status === 'in-progress' ? C.caution : C.accent;

                    return (
                      <div key={lesson.sessionNumber} style={{
                        background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                        borderLeft: `3px solid ${borderColor}`, overflow: 'hidden',
                      }}>
                        <button
                          onClick={() => toggleLesson(lesson.sessionNumber)}
                          style={{
                            width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', background: 'none', border: 'none',
                            cursor: 'pointer', textAlign: 'left',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{
                                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                                textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                              }}>
                                Session {lesson.sessionNumber}
                              </span>
                              <span style={{ fontFamily: F.data, fontSize: 9, color: C.dim }}>
                                {lesson.date}
                              </span>
                              <span style={{
                                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                                padding: '2px 8px', borderRadius: 3,
                                background: statusBg, color: statusColor,
                              }}>
                                {lesson.status === 'in-progress' ? 'In Progress' : lesson.status === 'completed' ? 'Completed' : 'Scheduled'}
                              </span>
                            </div>
                            <div style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink }}>
                              {lesson.focus}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {isExpanded
                              ? <ChevronUp size={14} color={C.muted} />
                              : <ChevronDown size={14} color={C.muted} />
                            }
                          </div>
                        </button>

                        {isExpanded && (
                          <div style={{ padding: '0 16px 14px', borderTop: `0.5px solid ${C.borderSub}` }}>
                            <p style={{
                              fontFamily: F.brand, fontSize: 12, color: C.body,
                              lineHeight: 1.6, marginTop: 10, marginBottom: 12,
                            }}>
                              {lesson.summary}
                            </p>

                            <div style={{
                              display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
                              gap: 8, marginBottom: 12,
                            }}>
                              {lesson.metrics.map((m) => (
                                <div key={m.label} style={{
                                  background: C.surfaceAlt, borderRadius: 8, padding: '8px 10px',
                                }}>
                                  <div style={{
                                    fontFamily: F.data, fontSize: 9, fontWeight: 700,
                                    textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                                  }}>
                                    {m.label}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                                    <span style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink }}>
                                      {m.after}
                                    </span>
                                    <span style={{ fontFamily: F.data, fontSize: 9, color: m.improved ? C.conf : C.flag }}>
                                      from {m.before}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {lesson.cueUsed && (
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '4px 10px', background: C.accentBg, borderRadius: 4,
                                marginBottom: 10,
                              }}>
                                <span style={{
                                  fontFamily: F.data, fontSize: 9, fontWeight: 700,
                                  textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.accent,
                                }}>
                                  Cue
                                </span>
                                <span style={{
                                  fontFamily: F.brand, fontSize: 11, color: C.ink, fontStyle: 'italic',
                                }}>
                                  &ldquo;{lesson.cueUsed}&rdquo;
                                </span>
                              </div>
                            )}

                            <div style={{
                              padding: '8px 12px', background: C.surfaceAlt, borderRadius: 8,
                              borderLeft: `2px solid ${C.muted}`,
                            }}>
                              <div style={{
                                fontFamily: F.data, fontSize: 9, fontWeight: 700,
                                textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                                marginBottom: 4,
                              }}>
                                Coach Notes
                              </div>
                              <p style={{
                                fontFamily: F.brand, fontSize: 12, color: C.body,
                                lineHeight: 1.5, margin: 0, fontStyle: 'italic',
                              }}>
                                {lesson.coachNotes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ──── SECTION 3: ON-COURSE PERFORMANCE ────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => setOnCourseExpanded(!onCourseExpanded)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: F.data, fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                      padding: 0,
                    }}
                  >
                    {onCourseExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    On-Course Performance
                  </button>

                  {onCourseExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                      {/* Handicap Trend Card */}
                      <div style={{
                        background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                        borderLeft: `3px solid ${C.conf}`, padding: '14px 16px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <div style={{
                            fontFamily: F.data, fontSize: 9, fontWeight: 700,
                            textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                          }}>
                            GHIN Handicap Index
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <TrendingUp size={12} color={C.conf} />
                            <span style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.conf }}>
                              -1.6 since Jan 1
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                          <span style={{
                            fontFamily: F.data, fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: '-.01em',
                          }}>
                            {playerHistory.onCourse.handicapTrend[0].index}
                          </span>
                          <span style={{ fontFamily: F.data, fontSize: 11, color: C.muted }}>
                            current index
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          {playerHistory.onCourse.handicapTrend.map((entry, i) => (
                            <div key={entry.date} style={{ textAlign: 'center' }}>
                              <div style={{
                                fontFamily: F.data, fontSize: 13, fontWeight: 700,
                                color: i === 0 ? C.accent : C.ink,
                              }}>
                                {entry.index}
                              </div>
                              <div style={{ fontFamily: F.data, fontSize: 8, color: C.dim, marginTop: 2 }}>
                                {entry.date.replace(', 2026', '')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arccos Rounds */}
                      <div style={{
                        fontFamily: F.data, fontSize: 9, fontWeight: 700,
                        textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                      }}>
                        Recent Rounds (Arccos)
                      </div>

                      {playerHistory.onCourse.arccosRounds.map((round) => {
                        const girColor = round.gir >= 40 ? C.conf : round.gir >= 30 ? C.caution : C.flag;
                        return (
                          <div key={round.date} style={{
                            background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                            padding: '14px 16px',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <MapPin size={11} color={C.muted} />
                                  <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink }}>
                                    {round.course}
                                  </span>
                                </div>
                                <span style={{ fontFamily: F.data, fontSize: 9, color: C.dim }}>
                                  {round.date}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                                <span style={{ fontFamily: F.data, fontSize: 18, fontWeight: 700, color: C.ink }}>
                                  {round.score}
                                </span>
                                <span style={{ fontFamily: F.data, fontSize: 10, color: C.flag }}>
                                  +{round.scoreToPar}
                                </span>
                              </div>
                            </div>
                            <div style={{
                              display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8,
                            }}>
                              {[
                                { label: 'GIR', value: `${round.gir.toFixed(1)}%`, color: girColor },
                                { label: 'Fairways', value: `${round.fairways.toFixed(1)}%`, color: round.fairways >= 57 ? C.conf : C.caution },
                                { label: 'Putts', value: String(round.puttsPerRound), color: round.puttsPerRound <= 30 ? C.conf : C.caution },
                                { label: 'Proximity', value: round.proximityToHole, color: C.ink },
                              ].map((stat) => (
                                <div key={stat.label} style={{
                                  background: C.surfaceAlt, borderRadius: 8, padding: '6px 10px',
                                }}>
                                  <div style={{
                                    fontFamily: F.data, fontSize: 9, fontWeight: 700,
                                    textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                                  }}>
                                    {stat.label}
                                  </div>
                                  <div style={{
                                    fontFamily: F.data, fontSize: 14, fontWeight: 700, color: stat.color, marginTop: 2,
                                  }}>
                                    {stat.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Club Distances */}
                      <div style={{
                        background: C.surface, borderRadius: 12, border: `0.5px solid ${C.borderSub}`,
                        padding: '14px 16px',
                      }}>
                        <div style={{
                          fontFamily: F.data, fontSize: 9, fontWeight: 700,
                          textTransform: 'uppercase' as const, letterSpacing: '.08em', color: C.muted,
                          marginBottom: 10,
                        }}>
                          On-Course Club Distances (Arccos Avg)
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {playerHistory.onCourse.clubDistances.map((club) => (
                            <div key={club.club} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '6px 0', borderBottom: `0.5px solid ${C.borderSub}`,
                            }}>
                              <span style={{
                                fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink, minWidth: 60,
                              }}>
                                {club.club}
                              </span>
                              <div style={{ display: 'flex', gap: 16 }}>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>CARRY</div>
                                  <div style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: C.ink }}>{club.avgCarry}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>TOTAL</div>
                                  <div style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: C.ink }}>{club.avgTotal}</div>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: 70 }}>
                                  <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>DISPERSION</div>
                                  <div style={{ fontFamily: F.data, fontSize: 13, fontWeight: 700, color: C.caution }}>{club.dispersion}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
