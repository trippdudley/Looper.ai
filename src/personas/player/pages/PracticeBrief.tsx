/**
 * PracticeBrief — Tab 2 (dark mode, WHOOP-inspired).
 * SG-proportional allocation ring, animated block bars,
 * coach context, drill cards, transparent reasoning.
 */
import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Bookmark, Info } from 'lucide-react';
import { C, F, S } from '../data/tokens';
import { practiceBrief } from '../data/tripp';
import ConfBadge from '../components/shared/ConfBadge';

/* ── Donut chart for time allocation ── */
function AllocationDonut({ blocks }: { blocks: typeof practiceBrief.blocks }): JSX.Element {
  const size = 140;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const colors = [C.flag, C.caution, C.caution, C.accentBright, C.muted];
  let accumulated = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surfaceAlt} strokeWidth={10} />
      {blocks.map((block, i) => {
        const pct = block.pct;
        const offset = circ * (1 - pct);
        const rotation = -90 + accumulated * 360;
        accumulated += pct;
        return (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={colors[i] || C.muted}
            strokeWidth={10}
            strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
            style={{ filter: `drop-shadow(0 0 4px ${colors[i]}44)` }}
          />
        );
      })}
      <text x={size / 2} y={size / 2 - 6} textAnchor="middle" style={{ fontFamily: F.data, fontSize: 22, fontWeight: 700, fill: C.ink }}>
        {practiceBrief.totalDuration}
      </text>
      <text x={size / 2} y={size / 2 + 12} textAnchor="middle" style={{ fontFamily: F.data, fontSize: 10, fill: C.muted }}>
        minutes
      </text>
    </svg>
  );
}

export default function PracticeBrief(): JSX.Element {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(0);
  const [showWhy, setShowWhy] = useState(false);
  const brief = practiceBrief;
  const blockColors = [C.flag, C.caution, C.caution, C.accentBright, C.muted];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ─── Hero: Priority + Allocation Donut ─── */}
      <div style={S.cardHero}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{
            fontFamily: F.data, fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.1em', color: C.accentBright,
            textShadow: `0 0 8px ${C.confGlow}`,
          }}>
            YOUR PRACTICE PLAN
          </span>
          <ConfBadge value={87} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: F.brand, fontSize: 18, fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: 8,
            }}>
              {brief.priority.area}
            </div>
            <div style={{ fontFamily: F.brand, fontSize: 13, color: C.body, lineHeight: 1.5 }}>
              {brief.priority.reason}
            </div>
          </div>
          <AllocationDonut blocks={brief.blocks} />
        </div>
      </div>

      {/* ─── Coach Context ─── */}
      {brief.coachContext.coachName && (
        <div
          style={{
            ...S.cardElevated,
            borderLeft: `3px solid ${C.caution}`,
            borderRadius: '0 8px 8px 0',
            background: C.cautionBg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontFamily: F.data, fontSize: 9, fontWeight: 700,
              background: 'rgba(245,158,11,0.2)', color: C.caution,
              padding: '2px 8px', borderRadius: 4,
              textTransform: 'uppercase', letterSpacing: '.06em',
            }}>
              {brief.coachContext.tag}
            </span>
            <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 600, color: C.ink }}>
              {brief.coachContext.coachName}
            </span>
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.body, marginBottom: 4 }}>
            Currently working on: {brief.coachContext.currentFocus}
          </div>
          <div style={{ fontFamily: F.brand, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
            {brief.coachContext.connection}
          </div>
        </div>
      )}

      {/* ─── Session Plan Blocks ─── */}
      {brief.blocks.map((block, i) => {
        const isExpanded = expandedBlock === i;
        const blockColor = blockColors[i] || C.muted;

        return (
          <div key={i} style={{ ...S.card, padding: 0, overflow: 'hidden', borderLeft: `3px solid ${blockColor}`, borderRadius: '0 8px 8px 0' }}>
            <button
              onClick={() => setExpandedBlock(isExpanded ? null : i)}
              style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: '14px 14px', background: 'none', border: 'none', cursor: 'pointer', gap: 10,
              }}
            >
              {/* Time pill */}
              <div style={{
                fontFamily: F.data, fontSize: 11, fontWeight: 700,
                color: blockColor, background: `${blockColor}15`,
                padding: '4px 10px', borderRadius: 4, whiteSpace: 'nowrap',
                boxShadow: `0 0 6px ${blockColor}33`,
              }}>
                {block.minutes}m
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 600, color: C.ink }}>{block.title}</div>
                <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 2 }}>
                  {block.clubs} · ~{block.shotCount} shots
                </div>
              </div>
              <span style={{
                fontFamily: F.data, fontSize: 13, fontWeight: 700, color: blockColor,
                textShadow: `0 0 6px ${blockColor}44`,
              }}>
                {block.sg > 0 ? '+' : ''}{block.sg.toFixed(1)}
              </span>
              {isExpanded ? <ChevronUp size={14} color={C.muted} /> : <ChevronDown size={14} color={C.muted} />}
            </button>

            {isExpanded && (
              <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5, marginTop: 10, marginBottom: 10 }}>
                  {block.focus}
                </div>
                {/* Allocation bar with gradient */}
                <div style={{ height: 6, background: C.surfaceAlt, borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${block.pct * 100}%`,
                    background: `linear-gradient(90deg, ${blockColor}88, ${blockColor})`,
                    borderRadius: 3,
                    boxShadow: `0 0 8px ${blockColor}44`,
                  }} />
                </div>
                {/* Drills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {block.drills.map((drill, di) => (
                    <div key={di} style={{
                      ...S.cardInner,
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                    }}>
                      <span style={{
                        fontFamily: F.data, fontSize: 10, fontWeight: 700,
                        color: blockColor, marginTop: 1, minWidth: 18,
                      }}>
                        {String(di + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.4 }}>
                        {drill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ─── Why This Plan ─── */}
      <button
        onClick={() => setShowWhy(!showWhy)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
        }}
      >
        <Info size={14} color={C.muted} />
        <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.body }}>Why this plan?</span>
        {showWhy ? <ChevronUp size={14} color={C.muted} /> : <ChevronDown size={14} color={C.muted} />}
      </button>

      {showWhy && (
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {brief.whyThisPlan.sources.map((src, i) => (
            <div key={i} style={S.cardInner}>
              <div style={{
                fontFamily: F.data, fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '.06em',
                color: C.accentBright, marginBottom: 4,
              }}>
                {src.label}
              </div>
              <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
                {src.detail}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save CTA */}
      <button style={{
        background: C.accentGrad, border: 'none', borderRadius: 8, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px',
        boxShadow: `0 4px 20px ${C.confGlow}`,
      }}>
        <Bookmark size={16} color="#FFFFFF" />
        <span style={{ fontFamily: F.brand, fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>Start This Session</span>
      </button>
    </div>
  );
}
