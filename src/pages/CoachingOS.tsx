import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { TabId, ShotData, DiagnosisFactor } from '../data/coachingOSData';
import {
  C, F, shots, sessionContext, tabs, l1Modes, baselineAvg,
  diagnosisFactors, interventions,
  getInsightForShot, getRecommendationForShot,
  fmtDelta, confidenceLevel,
} from '../data/coachingOSData';

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
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [activeShot, setActiveShot] = useState(14);
  const [shotRailCollapsed, setShotRailCollapsed] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const currentShot = useMemo(() => shots.find((s) => s.id === activeShot) || shots[shots.length - 1], [activeShot]);
  const insight = useMemo(() => getInsightForShot(activeShot), [activeShot]);
  const recommendation = useMemo(() => getRecommendationForShot(activeShot), [activeShot]);

  const showShotRail = activeTab !== 'player-plan';

  const toggleStage = (id: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

      {/* ═══ L1: GLOBAL BAR ═══════════════════════════════════════ */}
      <div style={{
        height: 44, background: C.ink, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px', flexShrink: 0,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: F.brand, fontSize: 13, fontWeight: 800,
            letterSpacing: '.05em', color: 'white',
          }}>
            LOOPER
          </span>
          <span style={{
            fontFamily: F.brand, fontSize: 13, fontWeight: 800,
            letterSpacing: '.05em', color: C.accent,
          }}>
            .AI
          </span>
        </Link>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: 4 }}>
          {l1Modes.map((mode) => (
            <button key={mode.id} style={{
              fontFamily: F.brand, fontSize: 12, fontWeight: 500,
              padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: mode.id === 'session' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: mode.id === 'session' ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s',
            }}>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Settings + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{
            fontFamily: F.brand, fontSize: 12, color: 'rgba(255,255,255,0.4)',
            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Settings size={14} />
            Settings
          </button>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.brand, fontSize: 10, fontWeight: 700, color: 'white',
          }}>
            {sessionContext.coachInitials}
          </div>
        </div>
      </div>

      {/* ═══ L2: CONTEXT BAR ══════════════════════════════════════ */}
      <div style={{
        height: 34, background: C.surface, display: 'flex', alignItems: 'center',
        gap: 8, padding: '0 20px', borderBottom: `0.5px solid ${C.border}`, flexShrink: 0,
      }}>
        {/* Active pill */}
        <span style={{
          fontFamily: F.data, fontSize: 10, fontWeight: 700, padding: '3px 10px',
          borderRadius: 12, background: C.accentBg, color: C.accent,
          border: `1px solid ${C.accent}`,
        }}>
          {sessionContext.playerName} · {sessionContext.handicap}
        </span>
        {/* Neutral pills */}
        {[
          `${sessionContext.club} · ${sessionContext.clubModel}`,
          `Session ${sessionContext.sessionNumber} of ${sessionContext.totalSessions}`,
          `Swing ${activeShot}/${sessionContext.totalSwings}`,
          `Goal: ${sessionContext.goal}`,
        ].map((text) => (
          <span key={text} style={{
            fontFamily: F.data, fontSize: 10, padding: '3px 10px',
            borderRadius: 12, border: `0.5px solid ${C.borderSub}`, color: C.muted,
          }}>
            {text}
          </span>
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
                {[...shots].reverse().map((shot) => {
                  const isActive = shot.id === activeShot;
                  const badgeBg = isActive ? C.accent : shot.flagged ? C.flag : C.surfaceAlt;
                  const badgeColor = isActive || shot.flagged ? 'white' : C.ink;
                  const rowBg = isActive ? C.accentBg : 'transparent';

                  return (
                    <button
                      key={shot.id}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }}>
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
                  <StrikeMapSVG allShots={shots} activeShotId={activeShot} />
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

          </div>
        </main>
      </div>
    </div>
  );
}
