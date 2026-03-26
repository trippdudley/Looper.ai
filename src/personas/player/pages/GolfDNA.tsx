/**
 * GolfDNA — Tab 4 (dark mode, WHOOP-inspired).
 * Radar chart for game shape, animated SG bars, glowing course fit,
 * behavioral fingerprint with confidence arcs.
 */
import { Share2, Lock, Minus } from 'lucide-react';
import { C, F, S } from '../data/tokens';
import { golfDNA, strokesGained } from '../data/tripp';
import ConfBadge from '../components/shared/ConfBadge';

/* ── Radar Chart for Game Shape ── */
function GameShapeRadar(): JSX.Element {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 70;
  const categories = [
    { label: 'Driving', value: 0.5, angle: -90 },    // 0.0 SG normalized to 0-1 (0.5 = par)
    { label: 'Approach', value: 0.1, angle: -18 },    // -2.2 SG → very weak
    { label: 'Short Game', value: 0.25, angle: 54 },  // -1.2 SG → weak
    { label: 'Putting', value: 0.42, angle: 126 },    // -0.4 SG → slightly below
    { label: 'Distance', value: 0.85, angle: 198 },   // top 15%
  ];

  const toXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  const rings = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = categories.map((c) => toXY(c.angle, maxR * c.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {rings.map((r, i) => (
        <polygon
          key={i}
          points={categories.map((c) => { const p = toXY(c.angle, maxR * r); return `${p.x},${p.y}`; }).join(' ')}
          fill="none"
          stroke={C.border}
          strokeWidth={0.5}
          opacity={0.5}
        />
      ))}
      {/* Axis lines */}
      {categories.map((c, i) => {
        const p = toXY(c.angle, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth={0.5} opacity={0.3} />;
      })}
      {/* Data fill */}
      <path d={dataPath} fill={`${C.accentBright}18`} stroke={C.accentBright} strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 8px ${C.confGlow})` }} />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={C.accentBright}
          style={{ filter: `drop-shadow(0 0 6px ${C.confGlow})` }} />
      ))}
      {/* Labels */}
      {categories.map((c, i) => {
        const p = toXY(c.angle, maxR + 18);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: F.data, fontSize: 9, fill: C.muted, fontWeight: 500 }}>
            {c.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Confidence Arc (mini ring for behavioral fingerprint) ── */
function ConfArc({ value, color, size = 36 }: { value: number; color: string; size?: number }): JSX.Element {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surfaceAlt} strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color}66)`, transition: 'stroke-dashoffset 600ms ease-out' }}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, fill: color }}>
        {value}
      </text>
    </svg>
  );
}

function UnlockProgress(): JSX.Element {
  const roundsPct = Math.min((golfDNA.roundsCompleted / golfDNA.unlockThresholdRounds) * 100, 100);
  const practicePct = Math.min((golfDNA.practiceSessionsCompleted / golfDNA.unlockThresholdPractice) * 100, 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '48px 24px' }}>
      <Lock size={36} color={C.muted} />
      <div style={{ fontFamily: F.brand, fontSize: 22, fontWeight: 700, color: C.ink, textAlign: 'center' }}>
        Your Golf DNA is building.
      </div>
      <div style={{ fontFamily: F.brand, fontSize: 13, color: C.muted, textAlign: 'center', maxWidth: 300 }}>
        Complete more rounds and practice sessions to unlock your full player profile.
      </div>
      {[{ label: 'Rounds', val: Math.min(golfDNA.roundsCompleted, golfDNA.unlockThresholdRounds), max: golfDNA.unlockThresholdRounds, pct: roundsPct },
        { label: 'Practice Sessions', val: Math.min(golfDNA.practiceSessionsCompleted, golfDNA.unlockThresholdPractice), max: golfDNA.unlockThresholdPractice, pct: practicePct },
      ].map((p, i) => (
        <div key={i} style={{ width: '100%', maxWidth: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body }}>{p.label}</span>
            <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color: C.ink }}>{p.val}/{p.max}</span>
          </div>
          <div style={{ height: 6, background: C.surfaceAlt, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${p.pct}%`, background: C.accentGrad, borderRadius: 3, boxShadow: `0 0 8px ${C.confGlow}` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GolfDNA(): JSX.Element {
  if (!golfDNA.unlocked) return <UnlockProgress />;

  const sgCats = [strokesGained.driving, strokesGained.approach, strokesGained.shortGame, strokesGained.putting];
  const sgMax = Math.max(...sgCats.map((c) => Math.abs(c.sg)), 0.1);

  const fitColors: Record<string, { bg: string; text: string; glow: string }> = {
    Strong: { bg: C.confBg, text: C.conf, glow: C.confGlow },
    Moderate: { bg: C.cautionBg, text: C.caution, glow: 'rgba(245,158,11,0.25)' },
    Weak: { bg: C.flagBg, text: C.flag, glow: C.flagGlow },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ─── Game Shape + Radar ─── */}
      <div style={S.cardHero}>
        <div style={{
          fontFamily: F.data, fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: 10,
        }}>
          SCOUTING REPORT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: F.editorial, fontSize: 20, fontStyle: 'italic', fontWeight: 400, color: C.ink, marginBottom: 8,
              textShadow: `0 0 20px ${C.confGlow}`,
            }}>
              {golfDNA.gameShape.archetype}
            </div>
            <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.6 }}>
              {golfDNA.gameShape.description}
            </div>
          </div>
          <GameShapeRadar />
        </div>
        <div style={{
          marginTop: 14, padding: '10px 14px',
          background: C.accentBg, borderLeft: `2px solid ${C.accentBright}`, borderRadius: '0 6px 6px 0',
        }}>
          <div style={{ fontFamily: F.editorial, fontSize: 13, fontStyle: 'italic', color: C.body, lineHeight: 1.5 }}>
            {golfDNA.gameShape.tourComparison}
          </div>
        </div>
      </div>

      {/* ─── SG Profile ─── */}
      <div style={S.cardElevated}>
        <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 14 }}>
          Strokes Gained Profile
        </div>
        {sgCats.map((cat) => {
          const isPositive = cat.sg >= 0;
          const barPct = (Math.abs(cat.sg) / sgMax) * 50;
          return (
            <div key={cat.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink }}>{cat.label}</span>
                <span style={{
                  fontFamily: F.data, fontSize: 14, fontWeight: 700,
                  color: isPositive ? C.conf : C.flag,
                  textShadow: `0 0 8px ${isPositive ? C.confGlow : C.flagGlow}`,
                }}>
                  {isPositive ? '+' : ''}{cat.sg.toFixed(1)}
                </span>
              </div>
              <div style={{ height: 10, background: C.surfaceAlt, borderRadius: 5, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: C.border }} />
                <div style={{
                  position: 'absolute', top: 1, bottom: 1,
                  ...(isPositive
                    ? { left: '50%', width: `${Math.max(barPct, 3)}%` }
                    : { right: '50%', width: `${Math.max(barPct, 3)}%` }),
                  background: isPositive ? C.conf : C.flag,
                  borderRadius: isPositive ? '0 4px 4px 0' : '4px 0 0 4px',
                  boxShadow: `0 0 12px ${isPositive ? C.confGlow : C.flagGlow}`,
                  transition: 'width 600ms ease-out',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Strengths & Weaknesses ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ ...S.card, borderLeft: `3px solid ${C.border}`, borderRadius: '0 8px 8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Minus size={14} color={C.muted} />
            <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 600, color: C.ink }}>What Works</span>
          </div>
          {golfDNA.strengths.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{s.text}</div>
              <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>{s.context}</div>
            </div>
          ))}
        </div>
        <div style={{ ...S.card, borderLeft: `3px solid ${C.border}`, borderRadius: '0 8px 8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Minus size={14} color={C.muted} />
            <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 600, color: C.ink }}>Where Strokes Live</span>
          </div>
          {golfDNA.weaknesses.map((w, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{w.text}</div>
              <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>{w.context}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Course Fit ─── */}
      <div>
        <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Course Fit</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {golfDNA.courseFit.map((cf, i) => {
            const fit = fitColors[cf.fit] || fitColors.Moderate;
            return (
              <div key={i} style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink }}>{cf.course}</span>
                  <span style={{
                    fontFamily: F.data, fontSize: 9, fontWeight: 700,
                    background: fit.bg, color: fit.text, padding: '3px 10px', borderRadius: 4,
                    textTransform: 'uppercase', letterSpacing: '.06em',
                    boxShadow: `0 0 8px ${fit.glow}`,
                  }}>
                    {cf.fit}
                  </span>
                </div>
                <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>{cf.reason}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Behavioral Fingerprint with Confidence Arcs ─── */}
      <div>
        <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Behavioral Fingerprint</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {golfDNA.behavioralFingerprint.map((bf, i) => {
            const arcColor = bf.confidence >= 80 ? C.conf : bf.confidence >= 60 ? C.caution : C.flag;
            return (
              <div key={i} style={{ ...S.card, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <ConfArc value={bf.confidence} color={arcColor} />
                <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5, flex: 1 }}>
                  {bf.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share CTA */}
      <div style={{ ...S.cardHero, padding: '16px' }}>
        <div style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 6 }}>Share with Coach</div>
        <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5, marginBottom: 12 }}>
          Give any coach a complete picture of your game before your first lesson.
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '14px', background: C.accentGrad, color: '#fff',
          border: 'none', borderRadius: 6, cursor: 'pointer',
          fontFamily: F.brand, fontSize: 14, fontWeight: 600,
          boxShadow: `0 4px 20px ${C.confGlow}`,
        }}>
          <Share2 size={16} color="#FFFFFF" />
          Share Golf DNA
        </button>
      </div>
    </div>
  );
}
