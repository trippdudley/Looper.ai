import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, ChevronLeft } from 'lucide-react';
import {
  C, TM, F, steps, shots, player, wrapData,
  getShotsAtStep, getLatestShot, centerRate, avgCarry, avgSpin, spinVariance,
  type ShotData, type ChatMessage, type BreathPhase,
} from '../data/sidelineData';

// ─── Launch Monitor Panel (Left) ────────────────────────────────

function TrajectoryViz({ shot }: { shot: ShotData | null }) {
  if (!shot) {
    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TM.textDim, fontFamily: F.data, fontSize: 13 }}>
        Awaiting shot data
      </div>
    );
  }
  // Simple SVG trajectory arc
  const peakH = Math.min(shot.height, 100);
  const carryPct = Math.min(shot.carry / 160, 1);
  return (
    <svg viewBox="0 0 400 140" style={{ width: '100%', height: 200 }}>
      {/* Ground gradient */}
      <defs>
        <linearGradient id="ground" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#1a3a1a" />
          <stop offset="100%" stopColor={TM.bg} />
        </linearGradient>
      </defs>
      <rect x="0" y="100" width="400" height="40" fill="url(#ground)" />
      {/* Grid lines */}
      {[50, 100, 150, 200, 250, 300, 350].map(x => (
        <line key={x} x1={x} y1="20" x2={x} y2="100" stroke={TM.border} strokeWidth="0.5" strokeDasharray="2 4" />
      ))}
      {/* Distance markers */}
      {[{ x: 100, label: '50y' }, { x: 200, label: '100y' }, { x: 300, label: '150y' }].map(m => (
        <text key={m.label} x={m.x} y="115" fill={TM.textDim} fontSize="8" fontFamily={F.data} textAnchor="middle">{m.label}</text>
      ))}
      {/* Trajectory arc */}
      <path
        d={`M 30,100 Q ${30 + carryPct * 170},${100 - peakH * 0.9} ${30 + carryPct * 340},100`}
        fill="none" stroke={TM.orange} strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Ball position at apex */}
      <circle cx={30 + carryPct * 170} cy={100 - peakH * 0.8} r="3" fill={TM.orange} />
      {/* Landing dot */}
      <circle cx={30 + carryPct * 340} cy={100} r="3" fill={TM.orange} opacity="0.6" />
    </svg>
  );
}

function MetricGrid({ shot }: { shot: ShotData | null }) {
  const grid = [
    { label: 'ATTACK ANGLE', value: shot ? `${shot.attackAngle.toFixed(1)}` + '\u00B0' : '--' },
    { label: 'DYN. LOFT', value: shot ? `${shot.dynamicLoft.toFixed(1)}` + '\u00B0' : '--' },
    { label: 'LAUNCH ANGLE', value: shot ? `${shot.launchAngle.toFixed(1)}` + '\u00B0' : '--' },
    { label: 'SPIN RATE', value: shot ? `${shot.spinRate.toLocaleString()}` : '--' },
    { label: 'FACE TO PATH', value: shot ? `${shot.faceToPath.toFixed(1)}` + '\u00B0' : '--' },
    { label: 'SWING PLANE', value: shot ? `${shot.swingPlane.toFixed(1)}` + '\u00B0' : '--' },
    { label: 'SWING DIR.', value: shot ? `${shot.swingDirection.toFixed(1)}` + '\u00B0' : '--' },
    { label: 'LOW POINT', value: shot ? `${shot.lowPoint.toFixed(1)}"` : '--' },
    { label: 'LAND ANGLE', value: shot ? `${shot.landingAngle.toFixed(1)}` + '\u00B0' : '--' },
    { label: 'HEIGHT', value: shot ? `${shot.height} ft` : '--' },
    { label: 'HANG TIME', value: shot ? `${shot.hangTime.toFixed(1)}s` : '--' },
    { label: 'CURVE', value: shot ? `${shot.curve.toFixed(1)} yds` : '--' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: TM.border }}>
      {grid.map(m => (
        <div key={m.label} style={{ background: TM.bg, padding: '8px 10px' }}>
          <div style={{ fontFamily: F.data, fontSize: 8, fontWeight: 700, color: TM.orange, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>
            {m.label}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 16, fontWeight: 700, color: TM.text, letterSpacing: '-0.01em' }}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroBar({ shot }: { shot: ShotData | null }) {
  const heroes = [
    { label: 'CLUB SPEED', value: shot ? `${shot.clubSpeed.toFixed(1)}` : '--', unit: 'mph' },
    { label: 'BALL SPEED', value: shot ? `${shot.ballSpeed.toFixed(1)}` : '--', unit: 'mph' },
    { label: 'SMASH', value: shot ? `${shot.smashFactor.toFixed(2)}` : '--', unit: '' },
    { label: 'CARRY', value: shot ? `${shot.carry}` : '--', unit: 'yds' },
    { label: 'TOTAL', value: shot ? `${shot.total}` : '--', unit: 'yds' },
    { label: 'PATH', value: shot ? `${shot.path.toFixed(1)}` + '\u00B0' : '--', unit: '' },
  ];
  return (
    <div style={{ display: 'flex', background: TM.surface, borderTop: `1px solid ${TM.border}` }}>
      {heroes.map((h, i) => (
        <div key={h.label} style={{ flex: 1, padding: '10px 12px', borderRight: i < heroes.length - 1 ? `1px solid ${TM.border}` : 'none', textAlign: 'center' }}>
          <div style={{ fontFamily: F.data, fontSize: 8, fontWeight: 700, color: TM.orange, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>
            {h.label}
          </div>
          <div style={{ fontFamily: F.data, fontSize: 20, fontWeight: 700, color: TM.text, letterSpacing: '-0.01em' }}>
            {h.value}
            {h.unit && <span style={{ fontSize: 10, fontWeight: 400, color: TM.textDim, marginLeft: 2 }}>{h.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreCircles({ shot }: { shot: ShotData | null }) {
  const items = [
    { label: 'Trajectory', score: shot?.trajectoryScore ?? 0 },
    { label: 'Precision', score: shot?.precisionScore ?? 0 },
  ];
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px' }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: `2.5px solid ${shot ? TM.orange : TM.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.data, fontSize: 14, fontWeight: 700, color: shot ? TM.text : TM.textDim,
          }}>
            {shot ? item.score : '--'}
          </div>
          <span style={{ fontFamily: F.data, fontSize: 9, color: TM.textDim, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function LaunchMonitorPanel({ shot, shotCount }: { shot: ShotData | null; shotCount: number }) {
  return (
    <div style={{ background: TM.bg, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${TM.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color: TM.text, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Launch Monitor
          </span>
          <span style={{
            fontFamily: F.data, fontSize: 9, padding: '2px 8px', borderRadius: 3,
            background: shot ? 'rgba(255,140,26,0.15)' : 'rgba(255,255,255,0.06)',
            color: shot ? TM.orange : TM.textDim,
          }}>
            {shot ? `Shot ${shotCount}` : 'STANDBY'}
          </span>
        </div>
        <div style={{ fontFamily: F.data, fontSize: 9, color: TM.textDim }}>
          {shot ? `${shot.club}` : '--'}
        </div>
      </div>

      {/* Score circles */}
      <ScoreCircles shot={shot} />

      {/* Trajectory viz */}
      <div style={{ flex: '0 0 auto', borderBottom: `1px solid ${TM.border}` }}>
        <TrajectoryViz shot={shot} />
      </div>

      {/* Metric grid */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <MetricGrid shot={shot} />
      </div>

      {/* Hero bar */}
      <HeroBar shot={shot} />
    </div>
  );
}

// ─── Sidebar Components ─────────────────────────────────────────

function PhaseIndicator({ phase }: { phase: BreathPhase }) {
  const phaseOrder: BreathPhase[] = ['brief', 'quiet', 'quiet-forming', 'insight', 'delta', 'wrap'];
  const barPhases: BreathPhase[] = ['brief', 'quiet', 'insight', 'delta', 'wrap'];
  const currentIndex = phaseOrder.indexOf(phase);
  const labels: Record<string, string> = {
    brief: 'Brief', quiet: 'Quiet', 'quiet-forming': 'Quiet', insight: 'Insight', delta: 'Delta', wrap: 'Wrap',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {barPhases.map((p) => {
          const pIdx = phaseOrder.indexOf(p);
          const active = pIdx <= currentIndex;
          return (
            <div key={p} style={{
              width: active && pIdx === currentIndex ? 16 : 8,
              height: 3,
              borderRadius: 1.5,
              background: active ? C.accent : C.dim,
              transition: 'all 300ms ease',
            }} />
          );
        })}
      </div>
      <span style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>
        {labels[phase]}
      </span>
    </div>
  );
}

function BriefCards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Last session */}
      <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: '12px 14px' }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          Last Session — {player.lastSession.date}
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.5, marginBottom: 4 }}>
          {player.lastSession.focus}
        </div>
        <div style={{ fontFamily: F.data, fontSize: 11, color: C.conf }}>
          {player.lastSession.result}
        </div>
        <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 4 }}>
          Assigned: {player.lastSession.drillAssigned}
        </div>
      </div>

      {/* Practice adherence */}
      <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: '12px 14px' }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          Practice Adherence
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
          <div>
            <span style={{ fontFamily: F.data, fontSize: 20, fontWeight: 700, color: player.practice.adherence >= 75 ? C.conf : C.caution }}>
              {player.practice.adherence}%
            </span>
          </div>
          <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
            {player.practice.completed}/{player.practice.assigned} sessions{'\n'}
            {player.practice.daysSinceLast}d since last{'\n'}
            {player.practice.roundsPlayed} rounds played
          </div>
        </div>
      </div>

      {/* Program trend */}
      <div style={{ background: C.surfaceAlt, borderRadius: 8, padding: '12px 14px' }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          Program Trend
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.5, marginBottom: 4 }}>
          {player.programTrend}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontFamily: F.data, fontSize: 16, fontWeight: 700, color: C.ink }}>
            HCP {player.handicap}
          </span>
          <span style={{ fontFamily: F.data, fontSize: 11, color: C.conf }}>
            {player.handicapDelta}
          </span>
        </div>
      </div>

      {/* Recommended focus */}
      <div style={{ background: C.accentBg, borderLeft: `2px solid ${C.accent}`, borderRadius: 0, padding: '12px 14px' }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
          Recommended Focus Today
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.5 }}>
          Continue spin optimization through dynamic loft control. Target: tighten spin variance below 200 rpm with PW. If spin stabilizes, test trajectory variability under target pressure.
        </div>
      </div>

      {/* Learning profile note */}
      <div style={{ background: C.cautionBg, borderLeft: `2px solid ${C.caution}`, borderRadius: 0, padding: '10px 14px' }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.caution, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
          Player Note
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
          {player.learningProfile}
        </div>
      </div>
    </div>
  );
}

function QuietCards({ shotCount, status }: { shotCount: number; status: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 16 }}>
      {/* Shot count */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: F.data, fontSize: 32, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>
          {shotCount}
        </span>
        <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}>
          shots
        </span>
      </div>
      {/* Status line with pulse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: C.accent,
          animation: 'sidelinePulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontFamily: F.data, fontSize: 11, color: C.muted }}>
          {status}
        </span>
      </div>
    </div>
  );
}

function StrikeMapMini({ shotList }: { shotList: ShotData[] }) {
  // Clubface outline: PW ~60mm wide, ~18mm tall
  const faceW = 60, faceH = 18;
  const svgW = 100, svgH = 50;
  const cx = svgW / 2, cy = svgH / 2;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: 80, height: 40 }}>
      {/* Face outline */}
      <rect x={cx - faceW / 2} y={cy - faceH / 2} width={faceW} height={faceH} rx="4" ry="4"
        fill="none" stroke={C.border} strokeWidth="1" />
      {/* Center crosshair */}
      <line x1={cx} y1={cy - faceH / 2 + 2} x2={cx} y2={cy + faceH / 2 - 2} stroke={C.dim} strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1={cx - faceW / 2 + 2} y1={cy} x2={cx + faceW / 2 - 2} y2={cy} stroke={C.dim} strokeWidth="0.5" strokeDasharray="2 2" />
      {/* Strike dots */}
      {shotList.map(s => (
        <circle key={s.id}
          cx={cx + s.strike.x * 1.5}
          cy={cy - s.strike.y * 1.2}
          r="2.5"
          fill={s.strike.label === 'center' ? C.accent : C.caution}
          opacity={0.8}
        />
      ))}
    </svg>
  );
}

function ConfBadge({ value }: { value: number }) {
  const cl = value >= 80
    ? { label: 'High', color: C.conf, bg: C.confBg }
    : value >= 50
    ? { label: 'Medium', color: C.caution, bg: C.cautionBg }
    : { label: 'Low', color: C.flag, bg: C.flagBg };
  return (
    <span style={{
      fontFamily: F.data, fontSize: 9, fontWeight: 700,
      padding: '2px 8px', borderRadius: 3,
      background: cl.bg, color: cl.color, whiteSpace: 'nowrap',
    }}>
      {value}%
    </span>
  );
}

function InsightCards({ shotList }: { shotList: ShotData[] }) {
  const aSpin = avgSpin(shotList);
  const sVar = spinVariance(shotList);
  const cRate = centerRate(shotList);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* AI Observation card (ported from CoachingOS intelligence panel) */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.surface} 0%, ${C.accent}08 100%)`,
          borderRadius: 8, padding: '14px 14px',
          border: `1px solid ${C.accent}18`,
          position: 'relative', overflow: 'hidden',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.accent}30`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.accent}18`; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${C.accent}35, transparent)`,
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: '.06em' }}>
              AI OBSERVATION
            </span>
            <span style={{
              fontFamily: F.data, fontSize: 8, padding: '2px 6px', borderRadius: 3,
              background: `${C.accent}10`, color: C.muted,
            }}>
              re: Strike quality
            </span>
          </div>
          <ConfBadge value={91} />
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.65, marginBottom: 8 }}>
          Spin averaging {aSpin.toLocaleString()} rpm with {sVar} rpm variance through 12 shots. Strike is {cRate}% center — contact is elite. The spin spread is coming from dynamic loft fluctuating between 28.8 and 30.3 deg, driven by attack angle steepening past -5.2 on 5 of 12 swings. Ball position may be drifting back during the set.
        </div>
        {/* Mini strike map */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0 0' }}>
          <StrikeMapMini shotList={shotList} />
          <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
            12 shots / {cRate}% center / {aSpin.toLocaleString()} avg spin
          </div>
        </div>
      </div>

      {/* Recommendation card (ported from CoachingOS intelligence panel) */}
      <div
        style={{
          background: C.accentBg, borderLeft: `2px solid ${C.accent}`, borderRadius: 0, padding: '12px 14px',
          position: 'relative', overflow: 'hidden',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Recommendation
          </span>
          <span style={{
            fontFamily: F.data, fontSize: 8, fontWeight: 700,
            padding: '2px 8px', borderRadius: 3,
            background: C.cautionBg, color: C.caution,
          }}>
            High information gain
          </span>
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
          Ball position forward 0.5 inch
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5, marginBottom: 6 }}>
          Move ball position forward half an inch to shallow attack angle into the -4.7 to -5.0 window. This stabilizes dynamic loft delivery without changing the swing. Setup adjustment, not a feel change — high retention probability.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, fontFamily: F.data, fontSize: 9, color: C.muted }}>
            <span>Type: <span style={{ color: C.accent }}>setup adjustment</span></span>
            <span>Session 3 result: <span style={{ color: C.conf }}>spin variance -110 rpm</span></span>
          </div>
          <button
            style={{
              fontFamily: F.data, fontSize: 8, fontWeight: 700,
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
      </div>
    </div>
  );
}

function DeltaCards({ pre, post }: { pre: ShotData[]; post: ShotData[] }) {
  const preSpin = avgSpin(pre);
  const postSpin = avgSpin(post);
  const preVar = spinVariance(pre);
  const postVar = spinVariance(post);
  const preCarry = avgCarry(pre);
  const postCarry = avgCarry(post);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: C.surface, borderRadius: 8, padding: '14px 14px', border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
          Before / After — Ball Position Adjustment
        </div>

        {/* Spin variance — the key metric */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginBottom: 2 }}>SPIN VARIANCE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: F.data, fontSize: 14, color: C.muted, textDecoration: 'line-through' }}>{preVar} rpm</span>
              <span style={{ fontFamily: F.data, fontSize: 22, fontWeight: 700, color: C.conf }}>{postVar} rpm</span>
              <span style={{ fontFamily: F.data, fontSize: 11, color: C.conf }}>
                {'\u25BC'} -{preVar - postVar} rpm
              </span>
            </div>
          </div>
          {/* Mini strike maps side by side */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <StrikeMapMini shotList={pre} />
              <div style={{ fontFamily: F.data, fontSize: 8, color: C.muted, marginTop: 2 }}>Before</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <StrikeMapMini shotList={post} />
              <div style={{ fontFamily: F.data, fontSize: 8, color: C.muted, marginTop: 2 }}>After</div>
            </div>
          </div>
        </div>

        {/* Supporting deltas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <DeltaMetric label="AVG SPIN" before={`${preSpin.toLocaleString()}`} after={`${postSpin.toLocaleString()}`} delta={`-${preSpin - postSpin}`} unit="rpm" positive />
          <DeltaMetric label="AVG CARRY" before={`${preCarry.toFixed(1)}`} after={`${postCarry.toFixed(1)}`} delta={`+${(postCarry - preCarry).toFixed(1)}`} unit="yds" positive />
        </div>

        {/* Sample size honesty */}
        <div style={{ fontFamily: F.data, fontSize: 9, color: C.caution, marginTop: 10, padding: '6px 8px', background: C.cautionBg, borderRadius: 4 }}>
          5 post-adjustment swings — spin tightening is mechanically sound (setup change, not swing change). Carry window narrowed from 4 yds to 1 yd. High confidence this holds.
        </div>
      </div>
    </div>
  );
}

function DeltaMetric({ label, before, after, delta, unit, positive }: {
  label: string; before: string; after: string; delta: string; unit: string; positive: boolean;
}) {
  return (
    <div style={{ background: C.surfaceAlt, borderRadius: 6, padding: '8px 10px' }}>
      <div style={{ fontFamily: F.data, fontSize: 8, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: F.data, fontSize: 11, color: C.muted, textDecoration: 'line-through' }}>{before}</span>
        <span style={{ fontFamily: F.data, fontSize: 16, fontWeight: 700, color: C.ink }}>{after}</span>
        <span style={{ fontFamily: F.data, fontSize: 9, color: unit === 'yds' ? C.conf : C.muted, marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{ fontFamily: F.data, fontSize: 9, color: positive ? C.conf : C.muted, marginTop: 2 }}>
        {positive ? '\u25B2 ' : ''}{delta}{unit === 'deg' ? '\u00B0' : ` ${unit}`}
      </div>
    </div>
  );
}

function WrapCards() {
  const w = wrapData;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Session outcome KPIs */}
      <div style={{ background: C.surface, borderRadius: 8, padding: '14px 14px', border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
          Session Outcome
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          <MiniKPI label="SHOTS" value={`${w.shotsHit}`} />
          <MiniKPI label="SPIN VAR." value={`${w.preIntervention.spinVariance}`} after={`${w.postIntervention.spinVariance}`} unit="rpm" />
          <MiniKPI label="AVG CARRY" value={`${w.preIntervention.avgCarry}`} after={`${w.postIntervention.avgCarry.toFixed(1)}`} unit="yds" />
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
          {w.sessionOutcome}
        </div>
      </div>

      {/* Retention estimate */}
      <div style={{ background: C.cautionBg, borderLeft: `2px solid ${C.caution}`, borderRadius: 0, padding: '10px 14px' }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.caution, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
          Retention Estimate
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
          {w.retentionEstimate}
        </div>
      </div>

      {/* Intervention tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {w.interventionTags.map(tag => (
          <span key={tag} style={{
            fontFamily: F.data, fontSize: 9, padding: '3px 8px', borderRadius: 3,
            background: C.accentBg, color: C.accent, border: `1px solid ${C.border}`,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Practice plan */}
      <div style={{ background: C.surface, borderRadius: 8, padding: '14px 14px', border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
          Practice Plan Draft
        </div>
        {w.practicePlan.map((p, i) => (
          <div key={i} style={{ marginBottom: i < w.practicePlan.length - 1 ? 10 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 600, color: C.ink }}>{p.drill}</span>
              <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>{p.reps} / {p.frequency}</span>
            </div>
            <div style={{ fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.4 }}>
              {p.note}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button style={{
            flex: 1, padding: '8px 12px', borderRadius: 6,
            background: C.accent, color: '#fff', border: 'none',
            fontFamily: F.brand, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            Approve
          </button>
          <button style={{
            flex: 1, padding: '8px 12px', borderRadius: 6,
            background: 'transparent', color: C.body, border: `1px solid ${C.border}`,
            fontFamily: F.brand, fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            Edit
          </button>
        </div>
      </div>

      {/* Next session */}
      <div style={{ background: C.accentBg, borderLeft: `2px solid ${C.accent}`, borderRadius: 0, padding: '10px 14px' }}>
        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
          Next Session Preview
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
          {w.nextSessionPreview}
        </div>
      </div>
    </div>
  );
}

function MiniKPI({ label, value, after, unit }: { label: string; value: string; after?: string; unit?: string }) {
  return (
    <div style={{ background: C.surfaceAlt, borderRadius: 6, padding: '8px 8px' }}>
      <div style={{ fontFamily: F.data, fontSize: 8, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>
        {label}
      </div>
      {after ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: F.data, fontSize: 11, color: C.muted, textDecoration: 'line-through' }}>{value}</span>
          <span style={{ fontFamily: F.data, fontSize: 15, fontWeight: 700, color: C.conf }}>{after}{unit && <span style={{ fontSize: 9, fontWeight: 400, color: C.muted, marginLeft: 1 }}>{unit}</span>}</span>
        </div>
      ) : (
        <span style={{ fontFamily: F.data, fontSize: 15, fontWeight: 700, color: C.ink }}>{value}</span>
      )}
    </div>
  );
}

// ─── Chat Interface ─────────────────────────────────────────────

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isCoach = msg.role === 'coach';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isCoach ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div style={{ fontFamily: F.data, fontSize: 8, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>
        {isCoach ? 'COACH' : 'LOOPER.AI'}
      </div>
      <div style={{
        maxWidth: '92%',
        padding: '10px 12px',
        borderRadius: isCoach ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
        background: isCoach ? C.surfaceAlt : C.surface,
        border: isCoach ? 'none' : `1px solid ${C.border}`,
        fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.55,
        whiteSpace: 'pre-wrap',
      }}>
        {msg.text}
      </div>
    </div>
  );
}

function SuggestionChips({ suggestions, onSelect }: { suggestions: string[]; onSelect: (s: string) => void }) {
  if (suggestions.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 0' }}>
      {suggestions.map(s => (
        <button key={s} onClick={() => onSelect(s)} style={{
          padding: '6px 12px', borderRadius: 16,
          background: 'transparent', border: `1px solid ${C.border}`,
          fontFamily: F.brand, fontSize: 11, color: C.body, cursor: 'pointer',
          transition: 'border-color 150ms ease',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function ChatInput() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 10px',
      background: C.surfaceAlt, borderRadius: 10,
      border: `1px solid ${C.border}`,
    }}>
      <input
        type="text"
        placeholder="Ask about this player or session..."
        readOnly
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: F.brand, fontSize: 12, color: C.ink,
        }}
      />
      <button style={{
        width: 28, height: 28, borderRadius: '50%',
        background: C.accent, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Send size={13} color="#fff" />
      </button>
    </div>
  );
}

// ─── Sidebar Panel ──────────────────────────────────────────────

function SidebarPanel({ stepIndex }: { stepIndex: number }) {
  const step = steps[stepIndex];
  const shotList = getShotsAtStep(stepIndex);

  const breathContent = useMemo(() => {
    switch (step.phase) {
      case 'brief':
        return <BriefCards />;
      case 'quiet':
        return <QuietCards shotCount={step.shotId ?? 0} status="Accumulating..." />;
      case 'quiet-forming':
        return <QuietCards shotCount={step.shotId ?? 0} status="Pattern confirmed — spin running high" />;
      case 'insight':
        return <InsightCards shotList={shotList} />;
      case 'delta':
        return <DeltaCards pre={shots.slice(0, 12)} post={shots.slice(12, 17)} />;
      case 'wrap':
        return <WrapCards />;
    }
  }, [step.phase, step.shotId, shotList]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing: '.04em' }}>
            LOOPER<span style={{ color: C.accent }}>.AI</span>
          </div>
          <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
            Session {player.sessionNumber}/{player.totalSessions}
          </div>
        </div>
        <PhaseIndicator phase={step.phase} />
        {/* Player context line */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {[player.name, `HCP ${player.handicap}`, 'PW', player.coach].map(pill => (
            <span key={pill} style={{
              fontFamily: F.data, fontSize: 9, padding: '2px 8px', borderRadius: 10,
              border: `1px solid ${C.borderSub}`, color: C.muted,
            }}>
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px' }}>
        {/* Breathing cards */}
        {breathContent}

        {/* Chat conversation */}
        {step.chat.length > 0 && (
          <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            <div style={{ fontFamily: F.data, fontSize: 8, fontWeight: 700, color: C.dim, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
              Conversation
            </div>
            {step.chat.map((msg, i) => (
              <ChatBubble key={i} msg={msg} />
            ))}
          </div>
        )}

        {/* Suggestion chips when no conversation */}
        {step.chat.length === 0 && step.suggestions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <SuggestionChips suggestions={step.suggestions} onSelect={() => {}} />
          </div>
        )}
      </div>

      {/* Chat input — always visible */}
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <ChatInput />
      </div>
    </div>
  );
}

// ─── Bottom Demo Bar ────────────────────────────────────────────

function DemoBar({ stepIndex, totalSteps, onPrev, onNext }: {
  stepIndex: number; totalSteps: number; onPrev: () => void; onNext: () => void;
}) {
  const step = steps[stepIndex];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '10px 20px',
      background: '#080C10',
      borderTop: `1px solid ${C.border}`,
      minHeight: 56,
    }}>
      {/* Back to coach */}
      <Link to="/coach" style={{ display: 'flex', alignItems: 'center', color: C.muted, textDecoration: 'none' }}>
        <ChevronLeft size={16} />
      </Link>

      {/* Prev / Next */}
      <button onClick={onPrev} disabled={stepIndex === 0} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 14px', borderRadius: 6,
        background: stepIndex === 0 ? C.dim : C.surfaceAlt,
        border: `1px solid ${C.border}`, color: stepIndex === 0 ? C.dim : C.body,
        fontFamily: F.brand, fontSize: 12, fontWeight: 500, cursor: stepIndex === 0 ? 'default' : 'pointer',
        opacity: stepIndex === 0 ? 0.4 : 1,
      }}>
        <ArrowLeft size={13} /> Back
      </button>
      <button onClick={onNext} disabled={stepIndex === totalSteps - 1} style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 14px', borderRadius: 6,
        background: stepIndex === totalSteps - 1 ? C.dim : C.accent,
        border: 'none', color: '#fff',
        fontFamily: F.brand, fontSize: 12, fontWeight: 600, cursor: stepIndex === totalSteps - 1 ? 'default' : 'pointer',
        opacity: stepIndex === totalSteps - 1 ? 0.4 : 1,
      }}>
        Next <ArrowRight size={13} />
      </button>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i === stepIndex;
          const isPast = i < stepIndex;
          return (
            <div key={i} style={{
              width: isActive ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: isActive ? C.accent : isPast ? C.muted : C.dim,
              transition: 'all 250ms ease',
            }} />
          );
        })}
      </div>

      {/* Label + narrative */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.data, fontSize: 10, fontWeight: 700, color: C.ink, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {step.label}
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 11, color: C.muted, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {step.narrative}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────

export default function LiveSessionSideline() {
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = steps.length;

  const latestShot = useMemo(() => getLatestShot(stepIndex), [stepIndex]);
  const visibleShots = useMemo(() => getShotsAtStep(stepIndex), [stepIndex]);
  const shotCount = visibleShots.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TM.bg, overflow: 'hidden' }}>
      {/* Pulse animation keyframe */}
      <style>{`
        @keyframes sidelinePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>

      {/* Launch monitor fills full width, with right padding so content isn't hidden behind sidebar */}
      <div style={{ flex: 1, overflow: 'hidden', paddingRight: 380 }}>
        <LaunchMonitorPanel shot={latestShot} shotCount={shotCount} />
      </div>

      {/* Floating Looper Sideline panel — docked right, like Claude-in-Chrome */}
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        bottom: 68,
        width: 360,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        background: C.bg,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <SidebarPanel stepIndex={stepIndex} />
      </div>

      {/* Bottom: Demo navigation bar — full width below everything */}
      <DemoBar
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        onPrev={() => setStepIndex(i => Math.max(0, i - 1))}
        onNext={() => setStepIndex(i => Math.min(totalSteps - 1, i + 1))}
      />
    </div>
  );
}
