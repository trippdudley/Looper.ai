import { useState, useMemo } from 'react';
import { C, F, S } from '../data/tokens';
import { timelineEvents } from '../data/timeline';
import SectionLabel from '../components/shared/SectionLabel';
import KpiTile from '../components/shared/KpiTile';
import Sparkline from '../components/shared/Sparkline';
import SourcePill from '../components/shared/SourcePill';
import TypeIcon from '../components/timeline/TypeIcon';

export default function Rounds() {
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  const rounds = useMemo(
    () => timelineEvents.filter((e) => e.type === 'round'),
    []
  );

  // Score trend data
  const scores = rounds.map((r) => {
    const scoreMetric = r.metrics.find((m) => m.label === 'Score');
    return scoreMetric ? parseInt(scoreMetric.value) : 0;
  }).reverse();

  return (
    <div>
      {/* Scoring trend */}
      <div style={{ ...S.card, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 4 }}>
            SCORING TREND
          </div>
          <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
            Last {rounds.length} rounds
          </div>
        </div>
        <Sparkline data={scores} width={140} height={36} color={C.conf} />
      </div>

      {/* Driver dispersion placeholder */}
      <SectionLabel number="01" text="DRIVER DISPERSION — LAST 5 ROUNDS" />
      <div style={{ ...S.card, marginBottom: 20, padding: '16px' }}>
        <svg viewBox="0 0 300 200" width="100%" style={{ maxHeight: 180 }}>
          {/* Target line */}
          <line x1="150" y1="10" x2="150" y2="190" stroke={C.borderSub} strokeDasharray="3 3" />
          <line x1="20" y1="100" x2="280" y2="100" stroke={C.borderSub} strokeDasharray="3 3" />

          {/* Confidence ellipse */}
          <ellipse cx="158" cy="95" rx="55" ry="35" fill="none" stroke={C.accent} strokeDasharray="4 3" strokeWidth="1" opacity="0.3" />

          {/* Shot dots — simulated scatter */}
          {[
            [142, 82], [165, 108], [138, 95], [170, 88], [155, 102],
            [148, 78], [162, 112], [135, 92], [172, 98], [158, 85],
            [145, 105], [168, 90], [140, 100], [175, 95], [152, 110],
            [160, 80], [143, 88], [167, 105], [155, 92], [150, 98],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3.5} fill={C.accent} opacity={0.7} />
          ))}

          {/* Centroid */}
          <circle cx="158" cy="95" r={4} fill={C.surface} stroke={C.accent} strokeWidth={2} />

          {/* Labels */}
          <text x="150" y="198" textAnchor="middle" style={{ fontSize: 9, fontFamily: F.data, fill: C.muted }}>Lateral (yds)</text>
          <text x="10" y="100" textAnchor="middle" style={{ fontSize: 9, fontFamily: F.data, fill: C.muted }} transform="rotate(-90, 10, 100)">Carry (yds)</text>
        </svg>
        <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted, marginTop: 8, textAlign: 'center' }}>
          ±12.4 yds lateral · 238-256 carry · slight push bias
        </div>
      </div>

      {/* Recent rounds */}
      <SectionLabel number="02" text="RECENT ROUNDS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rounds.map((round) => {
          const isExpanded = expandedRound === round.id;
          const scoreM = round.metrics.find((m) => m.label === 'Score');
          const sgM = round.metrics.find((m) => m.label === 'SG Total');

          // Find same-day events for context
          const sameDayEvents = timelineEvents.filter(
            (e) => e.date === round.date && e.id !== round.id
          );

          return (
            <div key={round.id}>
              <div
                style={{
                  ...S.card,
                  cursor: 'pointer',
                  padding: '12px 14px',
                }}
                onClick={() => setExpandedRound(isExpanded ? null : round.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedRound(isExpanded ? null : round.id); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TypeIcon type="round" size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink }}>
                      {round.title}
                    </div>
                    <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
                      {round.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {scoreM && (
                      <div style={{ fontFamily: F.data, fontSize: 20, fontWeight: 700, color: C.ink }}>
                        {scoreM.value}
                      </div>
                    )}
                    {sgM && (
                      <div style={{
                        fontFamily: F.data, fontSize: 10, fontWeight: 700,
                        color: parseFloat(sgM.value) > 0 ? C.conf : C.flag,
                      }}>
                        SG {sgM.value}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded: SG breakdown + same-day timeline */}
                {isExpanded && (
                  <div style={{ marginTop: 12, borderTop: `0.5px solid ${C.borderSub}`, paddingTop: 12 }}>
                    {/* SG breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6, marginBottom: 12 }}>
                      {round.metrics.filter((m) => m.label.startsWith('SG') || m.label === 'Fairways' || m.label === 'GIR' || m.label === 'Putts').map((m, i) => (
                        <KpiTile key={i} label={m.label} value={m.value} color={
                          m.status === 'good' || m.status === 'improving' || m.status === 'best' ? C.conf :
                          m.status === 'poor' ? C.flag : C.accent
                        } />
                      ))}
                    </div>

                    {/* Narrative */}
                    <p style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5, margin: '0 0 12px' }}>
                      {round.narrative}
                    </p>

                    {/* Coach note */}
                    {round.coachNote && (
                      <div
                        style={{
                          borderLeft: `2px solid ${C.accent}`,
                          padding: '8px 12px',
                          background: C.accentBg,
                          borderRadius: '0 8px 8px 0',
                          marginBottom: 12,
                        }}
                      >
                        <div style={{ fontFamily: F.data, fontSize: 8, color: C.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
                          COACH NOTE
                        </div>
                        <p style={{ fontFamily: F.brand, fontSize: 12, fontStyle: 'italic', color: C.body, lineHeight: 1.5, margin: 0 }}>
                          {round.coachNote}
                        </p>
                      </div>
                    )}

                    {/* Same-day timeline context */}
                    {sameDayEvents.length > 0 && (
                      <>
                        <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, marginBottom: 8 }}>
                          THAT DAY
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {sameDayEvents.map((ev) => (
                            <div
                              key={ev.id}
                              style={{
                                ...S.cardInner,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 10px',
                              }}
                            >
                              <TypeIcon type={ev.type} size={22} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                  <SourcePill source={ev.source} size="sm" />
                                  {ev.time && <span style={{ fontFamily: F.data, fontSize: 8, color: C.muted }}>{ev.time}</span>}
                                </div>
                                <div style={{ fontFamily: F.brand, fontSize: 11, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {ev.title}
                                </div>
                              </div>
                              {ev.metrics[0] && (
                                <span style={{ fontFamily: F.data, fontSize: 11, fontWeight: 700, color: C.ink, flexShrink: 0 }}>
                                  {ev.metrics[0].value}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
