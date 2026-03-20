import { useState, useEffect, useRef } from 'react';
import { Wifi } from 'lucide-react';
import type { TrackmanShot } from '../../data/trackmanData';
import { C, F, qualityColor, qualityBg, fmtSigned } from './TPSColors';

// ─── Animated value hook ─────────────────────────────────────────
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

// ─── Neutral Metric Tile ─────────────────────────────────────────
function MetricTile({ label, value, unit, large }: {
  label: string; value: number; unit: string; large?: boolean;
}) {
  const animated = useAnimatedValue(value);
  const isInt = unit === 'yds' || unit === 'rpm';
  const displayVal = isInt
    ? (unit === 'rpm' ? Math.round(animated).toLocaleString() : String(Math.round(animated)))
    : animated.toFixed(unit === 'mph' ? 1 : unit === '°' ? 1 : 2);

  return (
    <div style={{
      padding: large ? '10px 12px' : '8px 10px', borderRadius: 6,
      background: C.elevated, border: `1px solid ${C.border}`,
    }}>
      <div style={{
        fontFamily: F.data, fontSize: 7, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '.08em',
        color: C.muted, marginBottom: large ? 6 : 4,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{
          fontFamily: F.data, fontSize: large ? 20 : 16, fontWeight: 700,
          color: C.data, letterSpacing: '-0.02em',
        }}>{displayVal}</span>
        <span style={{ fontFamily: F.data, fontSize: 8, color: C.dataDim }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

// ─── 2D Overhead Shot Trace ──────────────────────────────────────
function ShotTrace({ shots, activeShot, onSelectShot }: {
  shots: TrackmanShot[];
  activeShot: TrackmanShot;
  onSelectShot: (s: TrackmanShot) => void;
}) {
  // Map carry (y-axis) and lateral dispersion (x-axis) into SVG space
  // X: use clubPath as proxy for lateral. Positive path = right of target
  // Y: carry distance
  const allCarries = shots.map(s => s.carry);
  const minCarry = Math.min(...allCarries) - 15;
  const maxCarry = Math.max(...allCarries) + 15;
  const carryRange = maxCarry - minCarry;

  // Compute avg carry and avg lateral for dispersion ellipse
  const avgCarry = shots.reduce((a, s) => a + s.carry, 0) / shots.length;
  const avgLateral = shots.reduce((a, s) => a + s.clubPath, 0) / shots.length;

  // Map to SVG coords (300x220 viewBox)
  const svgW = 300, svgH = 200;
  const padX = 40, padY = 20;
  const plotW = svgW - padX * 2;
  const plotH = svgH - padY * 2;

  function toSvg(carry: number, lateral: number): { x: number; y: number } {
    const x = padX + plotW / 2 + (lateral / 6) * (plotW / 2); // scale path ±6° to full width
    const y = padY + plotH - ((carry - minCarry) / carryRange) * plotH;
    return { x, y };
  }

  const avgPt = toSvg(avgCarry, avgLateral);

  // Dispersion ellipse radii (based on std dev)
  const stdCarry = Math.sqrt(shots.reduce((a, s) => a + (s.carry - avgCarry) ** 2, 0) / shots.length);
  const stdLateral = Math.sqrt(shots.reduce((a, s) => a + (s.clubPath - avgLateral) ** 2, 0) / shots.length);
  const ellipseRx = Math.max(12, (stdLateral / 6) * (plotW / 2) * 1.5);
  const ellipseRy = Math.max(15, (stdCarry / carryRange) * plotH * 1.5);

  return (
    <div style={{
      background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
      padding: '10px 12px', flex: 1,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 6,
      }}>
        <span style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted,
        }}>Dispersion · Overhead</span>
        <span style={{ fontFamily: F.data, fontSize: 8, color: C.dim }}>
          {shots.length} shots
        </span>
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 180 }}>
        {/* Grid lines */}
        <line x1={padX + plotW / 2} y1={padY} x2={padX + plotW / 2} y2={padY + plotH}
          stroke={C.dim} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        {/* Carry reference lines */}
        {[0.25, 0.5, 0.75].map(pct => {
          const y = padY + plotH * (1 - pct);
          const carryVal = Math.round(minCarry + carryRange * pct);
          return (
            <g key={pct}>
              <line x1={padX} y1={y} x2={padX + plotW} y2={y}
                stroke={C.dim} strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3" />
              <text x={padX - 4} y={y + 3}
                style={{ fontFamily: F.data, fontSize: 7, fill: C.dim }}
                textAnchor="end">{carryVal}</text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={padX + plotW / 2} y={svgH - 2}
          style={{ fontFamily: F.data, fontSize: 7, fill: C.dim }}
          textAnchor="middle">← PULL · TARGET · PUSH →</text>
        <text x={8} y={padY + plotH / 2}
          style={{ fontFamily: F.data, fontSize: 7, fill: C.dim }}
          textAnchor="middle"
          transform={`rotate(-90, 8, ${padY + plotH / 2})`}>CARRY (yds)</text>

        {/* Dispersion ellipse */}
        <ellipse cx={avgPt.x} cy={avgPt.y} rx={ellipseRx} ry={ellipseRy}
          fill="none" stroke={C.accent} strokeWidth="0.8"
          strokeDasharray="4 3" opacity="0.2" />

        {/* Shot dots */}
        {shots.map((shot, idx) => {
          const pt = toSvg(shot.carry, shot.clubPath);
          const isActive = shot.id === activeShot.id;
          const age = shots.length - idx;
          const opacity = isActive ? 1 : Math.max(0.25, 1 - age * 0.06);

          return (
            <g key={shot.id} onClick={() => onSelectShot(shot)} style={{ cursor: 'pointer' }}>
              {isActive ? (
                <>
                  <circle cx={pt.x} cy={pt.y} r="8" fill="none"
                    stroke={C.accent} strokeWidth="0.6" opacity="0.3">
                    <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pt.x} cy={pt.y} r="4.5" fill={C.accent} opacity="0.8" />
                  <circle cx={pt.x} cy={pt.y} r="1.8" fill="white" />
                  <text x={pt.x + 7} y={pt.y - 5}
                    style={{ fontFamily: F.data, fontSize: 7, fill: C.accent, fontWeight: 700 }}>
                    {shot.shotNumber}
                  </text>
                </>
              ) : (
                <circle cx={pt.x} cy={pt.y} r="3" fill={C.data} opacity={opacity} />
              )}
            </g>
          );
        })}

        {/* Average marker */}
        <line x1={avgPt.x - 4} y1={avgPt.y} x2={avgPt.x + 4} y2={avgPt.y}
          stroke={C.muted} strokeWidth="0.5" />
        <line x1={avgPt.x} y1={avgPt.y - 4} x2={avgPt.x} y2={avgPt.y + 4}
          stroke={C.muted} strokeWidth="0.5" />
      </svg>
    </div>
  );
}

// ─── Shot History Strip ──────────────────────────────────────────
function ShotStrip({ shots, activeShot, onSelectShot }: {
  shots: TrackmanShot[];
  activeShot: TrackmanShot;
  onSelectShot: (s: TrackmanShot) => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: 3, height: 40, alignItems: 'flex-end',
      padding: '0 2px',
    }}>
      {shots.map(shot => {
        const isActive = shot.id === activeShot.id;
        // Bar height proportional to smash factor (1.26-1.47 range)
        const minSmash = 1.26, maxSmash = 1.47;
        const pct = Math.max(0.15, (shot.smashFactor - minSmash) / (maxSmash - minSmash));
        const barH = Math.max(6, pct * 34);

        return (
          <div key={shot.id} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            cursor: 'pointer', position: 'relative',
          }}
            onClick={() => onSelectShot(shot)}
          >
            {isActive && (
              <span style={{
                fontFamily: F.data, fontSize: 6, fontWeight: 700,
                color: C.accent, marginBottom: 2, position: 'absolute', top: -2,
              }}>{shot.shotNumber}</span>
            )}
            <div style={{
              width: '100%', height: barH, borderRadius: 3,
              background: isActive
                ? `linear-gradient(to top, ${C.accent}88, ${C.accent})`
                : shot.quality === 'good' ? C.dim : `${C.dim}88`,
              opacity: isActive ? 1 : 0.6,
              border: isActive ? `1px solid ${C.accent}` : 'none',
              transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
              transformOrigin: 'bottom',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.transform = 'scaleY(1.2) scaleX(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  TPS SIMULATOR — Full Left Panel
// ═══════════════════════════════════════════════════════════════════

type ClubFilter = 'All' | 'Driver' | '7-Iron';

export default function TPSSimulator({ shots, activeShot, onSelectShot }: {
  shots: TrackmanShot[];
  activeShot: TrackmanShot;
  onSelectShot: (s: TrackmanShot) => void;
}) {
  const [clubFilter, setClubFilter] = useState<ClubFilter>('All');

  const filteredShots = clubFilter === 'All'
    ? shots
    : shots.filter(s => s.club === clubFilter);

  // Make sure active shot is in filtered set, else pick last
  const effectiveActive = filteredShots.find(s => s.id === activeShot.id)
    ? activeShot
    : filteredShots[filteredShots.length - 1];

  return (
    <div style={{
      flex: '1 1 68%', display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${C.border}`, overflow: 'hidden',
      minWidth: 0,
    }}>
      {/* TPS Header */}
      <div style={{
        padding: '8px 16px', borderBottom: `1px solid ${C.tpsBorder}`,
        background: C.tpsBg, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: F.data, fontSize: 11, fontWeight: 700,
            letterSpacing: '.06em', color: C.tps,
          }}>TRACKMAN</span>
          <span style={{
            fontFamily: F.data, fontSize: 9, color: C.muted, letterSpacing: '.04em',
          }}>PERFORMANCE STUDIO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Wifi size={11} color={C.conf} />
          <span style={{ fontFamily: F.data, fontSize: 8, color: C.conf }}>CONNECTED</span>
        </div>
      </div>

      {/* Club Selector Tabs */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        {(['All', 'Driver', '7-Iron'] as ClubFilter[]).map(club => {
          const isActive = club === clubFilter;
          const count = club === 'All' ? shots.length : shots.filter(s => s.club === club).length;
          return (
            <button key={club} onClick={() => setClubFilter(club)} style={{
              flex: 1, padding: '6px 12px', border: 'none', cursor: 'pointer',
              background: isActive ? C.accentBg : 'transparent',
              borderBottom: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
              fontFamily: F.data, fontSize: 9, fontWeight: isActive ? 700 : 400,
              color: isActive ? C.accent : C.muted,
              transition: 'all 0.15s',
            }}>
              {club} <span style={{ fontSize: 7, opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Content: Data Tiles + Shot Trace side by side */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 12px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Shot header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: F.data, fontSize: 9, fontWeight: 700,
              letterSpacing: '.06em', color: C.muted, textTransform: 'uppercase',
            }}>Shot {effectiveActive.shotNumber}</span>
            <span style={{
              fontFamily: F.data, fontSize: 9, fontWeight: 700,
              padding: '2px 8px', borderRadius: 3,
              background: qualityBg(effectiveActive.quality),
              color: qualityColor(effectiveActive.quality),
            }}>{effectiveActive.quality.toUpperCase()}</span>
          </div>
          <span style={{
            fontFamily: F.data, fontSize: 10, fontWeight: 700,
            color: C.data, padding: '2px 8px', borderRadius: 3,
            background: C.elevated, border: `1px solid ${C.borderSub}`,
          }}>{effectiveActive.club}</span>
        </div>

        {/* Row 1: 4×2 Data Tiles + Shot Trace */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 280px', gap: 10,
        }}>
          {/* 4×2 metric grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)', gap: 6,
          }}>
            <MetricTile label="Ball Speed" value={effectiveActive.ballSpeed} unit="mph" large />
            <MetricTile label="Carry" value={effectiveActive.carry} unit="yds" large />
            <MetricTile label="Total" value={effectiveActive.total} unit="yds" large />
            <MetricTile label="Smash Factor" value={effectiveActive.smashFactor} unit="" large />
            <MetricTile label="Launch Angle" value={effectiveActive.launchAngle} unit="°" />
            <MetricTile label="Spin Rate" value={effectiveActive.spinRate} unit="rpm" />
            <MetricTile label="Club Path" value={effectiveActive.clubPath} unit="°" />
            <MetricTile label="Face Angle" value={effectiveActive.faceAngle} unit="°" />
          </div>

          {/* 2D Shot Trace */}
          <ShotTrace
            shots={filteredShots}
            activeShot={effectiveActive}
            onSelectShot={onSelectShot}
          />
        </div>

        {/* Row 2: Secondary metrics strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
        }}>
          <MetricTile label="Club Speed" value={effectiveActive.clubSpeed} unit="mph" />
          <MetricTile label="Attack Angle" value={effectiveActive.attackAngle} unit="°" />
          <MetricTile label="Shot Shape" value={0} unit={effectiveActive.shotShape.charAt(0).toUpperCase() + effectiveActive.shotShape.slice(1)} />
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: C.elevated, border: `1px solid ${C.border}`,
          }}>
            <div style={{
              fontFamily: F.data, fontSize: 7, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '.08em',
              color: C.muted, marginBottom: 4,
            }}>NOTE</div>
            <div style={{
              fontFamily: F.brand, fontSize: 9, color: C.body,
              lineHeight: 1.4, fontStyle: 'italic',
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {effectiveActive.notes || '—'}
            </div>
          </div>
        </div>

        {/* Row 3: Shot History Strip */}
        <div style={{
          background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
          padding: '8px 12px',
        }}>
          <div style={{
            fontFamily: F.data, fontSize: 8, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.08em',
            color: C.muted, marginBottom: 6,
          }}>Shot History</div>
          <ShotStrip
            shots={filteredShots}
            activeShot={effectiveActive}
            onSelectShot={onSelectShot}
          />
        </div>

        {/* Row 4: Shot Table */}
        <div style={{
          background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
          overflow: 'hidden',
        }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse', fontFamily: F.data, fontSize: 9,
          }}>
            <thead>
              <tr>
                {['#', 'Club', 'Ball', 'Carry', 'Total', 'Spin', 'Launch', 'Path', 'Face', 'AoA', 'Smash'].map(h => (
                  <th key={h} style={{
                    textAlign: h === 'Club' ? 'left' : 'right',
                    padding: '6px 5px', color: C.muted, fontWeight: 700,
                    letterSpacing: '.06em', borderBottom: `1px solid ${C.border}`,
                    fontSize: 7, textTransform: 'uppercase',
                    background: C.surface, position: 'sticky', top: 0,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredShots.map(shot => {
                const isActive = shot.id === effectiveActive.id;
                return (
                  <tr key={shot.id} onClick={() => onSelectShot(shot)}
                    style={{
                      cursor: 'pointer',
                      background: isActive ? C.accentBg : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.elevated; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: isActive ? C.accent : C.dataDim }}>{shot.shotNumber}</td>
                    <td style={{ padding: '4px 5px', color: C.data }}>{shot.club}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{shot.ballSpeed.toFixed(1)}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.ink, fontWeight: 700 }}>{shot.carry}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{shot.total}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{Math.round(shot.spinRate).toLocaleString()}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{shot.launchAngle.toFixed(1)}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{fmtSigned(shot.clubPath)}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{fmtSigned(shot.faceAngle)}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{fmtSigned(shot.attackAngle)}</td>
                    <td style={{ padding: '4px 5px', textAlign: 'right', color: C.data }}>{shot.smashFactor.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer: Session Averages */}
      <div style={{
        padding: '6px 16px', borderTop: `1px solid ${C.border}`,
        background: C.surface, display: 'flex', gap: 16, flexShrink: 0,
      }}>
        {(() => {
          const driverShots = shots.filter(s => s.club === 'Driver');
          const ironShots = shots.filter(s => s.club === '7-Iron');
          const avgD = driverShots.length ? Math.round(driverShots.reduce((a, s) => a + s.carry, 0) / driverShots.length) : 0;
          const avgI = ironShots.length ? Math.round(ironShots.reduce((a, s) => a + s.carry, 0) / ironShots.length) : 0;
          const goodPct = Math.round((shots.filter(s => s.quality === 'good').length / shots.length) * 100);
          return (
            <>
              <span style={{ fontFamily: F.data, fontSize: 7, color: C.muted }}>
                Driver avg: {avgD} yds
              </span>
              <span style={{ fontFamily: F.data, fontSize: 7, color: C.muted }}>
                7-Iron avg: {avgI} yds
              </span>
              <span style={{ fontFamily: F.data, fontSize: 7, color: C.conf, marginLeft: 'auto' }}>
                {goodPct}% good quality
              </span>
            </>
          );
        })()}
      </div>
    </div>
  );
}
