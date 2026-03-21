import { useState, useMemo } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { C, F, S } from '../data/tokens';
import { todaysPracticePlan, timelineEvents } from '../data/timeline';
import SectionLabel from '../components/shared/SectionLabel';
import KpiTile from '../components/shared/KpiTile';
import Sparkline from '../components/shared/Sparkline';
import SourcePill from '../components/shared/SourcePill';
import TypeIcon from '../components/timeline/TypeIcon';
import ConnectionInsight from '../components/timeline/ConnectionInsight';

export default function PracticeMode() {
  const [blocks, setBlocks] = useState(todaysPracticePlan.blocks);

  const toggleBlock = (idx: number) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, completed: !b.completed } : b))
    );
  };

  // Practice timeline events
  const practiceEvents = useMemo(
    () => timelineEvents.filter((e) => e.type === 'practice'),
    []
  );

  // Dispersion trend
  const dispersionTrend = practiceEvents
    .map((e) => {
      const d = e.metrics.find((m) => m.label === 'Dispersion');
      if (!d) return null;
      const num = parseFloat(d.value.replace(/[^\d.]/g, ''));
      return isNaN(num) ? null : num;
    })
    .filter((v): v is number => v !== null)
    .reverse();

  return (
    <div>
      {/* Today's practice plan card */}
      <div
        style={{
          ...S.card,
          borderLeft: `3px solid ${C.accent}`,
          borderRadius: '0 12px 12px 0',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontFamily: F.brand, fontSize: 16, fontWeight: 600, color: C.ink }}>
            {todaysPracticePlan.title}
          </div>
          <span style={{ fontFamily: F.data, fontSize: 9, color: C.muted }}>
            {todaysPracticePlan.duration}
          </span>
        </div>
        <div style={{ fontFamily: F.data, fontSize: 10, color: C.accent }}>
          {todaysPracticePlan.source}
        </div>
      </div>

      {/* Session blocks */}
      <SectionLabel number="01" text="SESSION STRUCTURE" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {blocks.map((block, idx) => (
          <div
            key={idx}
            style={{
              ...S.card,
              opacity: block.completed ? 0.6 : 1,
              transition: 'opacity 200ms ease',
            }}
          >
            {/* Block header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <button
                onClick={() => toggleBlock(idx)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}
              >
                {block.completed
                  ? <CheckCircle size={20} color={C.conf} />
                  : <Circle size={20} color={C.border} />
                }
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink,
                    textDecoration: block.completed ? 'line-through' : 'none',
                  }}>
                    {block.name}
                  </span>
                  <span style={{
                    fontFamily: F.data, fontSize: 8, fontWeight: 700,
                    color: C.accent, background: C.accentBg,
                    padding: '1px 6px', borderRadius: 3,
                    textTransform: 'uppercase', letterSpacing: '.06em',
                  }}>
                    {block.club}
                  </span>
                  <span style={{
                    fontFamily: F.data, fontSize: 8, fontWeight: 700,
                    color: C.muted, background: C.surfaceAlt,
                    padding: '1px 6px', borderRadius: 3,
                  }}>
                    {block.shots} shots
                  </span>
                </div>
              </div>
              {block.completed && (
                <span style={{
                  fontFamily: F.data, fontSize: 8, fontWeight: 700,
                  color: C.conf, background: C.confBg,
                  padding: '2px 8px', borderRadius: 3,
                  textTransform: 'uppercase', letterSpacing: '.06em',
                }}>
                  DONE
                </span>
              )}
            </div>

            {/* Focus */}
            <p style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5, margin: '0 0 8px', paddingLeft: 30 }}>
              {block.focus}
            </p>

            {/* Cue card */}
            <div
              style={{
                background: C.accentBg,
                borderRadius: 8,
                padding: '10px 14px',
                marginLeft: 30,
              }}
            >
              <div style={{
                fontFamily: F.data, fontSize: 8, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '.08em',
                color: C.accent, marginBottom: 4,
              }}>
                CUE — {block.cueType}
              </div>
              <div style={{
                fontFamily: F.editorial,
                fontSize: 14,
                fontStyle: 'italic',
                color: C.ink,
                lineHeight: 1.4,
              }}>
                {block.cue}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Session controls */}
      <SectionLabel number="02" text="SESSION" />
      <div style={{ ...S.card, marginBottom: 20, textAlign: 'center', padding: '20px 16px' }}>
        <button
          style={{
            fontFamily: F.brand,
            fontSize: 14,
            fontWeight: 600,
            color: C.surface,
            background: C.accent,
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            cursor: 'pointer',
            width: '100%',
            maxWidth: 280,
          }}
        >
          Start Practice Session
        </button>
        <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, marginTop: 8 }}>
          Connect Garmin R10 for auto shot tracking
        </div>
      </div>

      {/* Recent practice timeline */}
      <SectionLabel number="03" text="RECENT PRACTICE" />

      {/* Dispersion trend sparkline */}
      {dispersionTrend.length >= 2 && (
        <div style={{ ...S.card, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: F.data, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted }}>
              DISPERSION TREND
            </div>
            <div style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
              Last {dispersionTrend.length} sessions
            </div>
          </div>
          <Sparkline data={dispersionTrend} width={120} height={32} color={C.conf} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {practiceEvents.map((ev) => (
          <div
            key={ev.id}
            style={{
              ...S.card,
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <TypeIcon type="practice" size={24} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 1 }}>
                <SourcePill source={ev.source} size="sm" />
                <span style={{ fontFamily: F.data, fontSize: 8, color: C.muted }}>{ev.date.slice(5)}</span>
              </div>
              <div style={{ fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ev.title}
              </div>
            </div>
            {ev.metrics.find((m) => m.label === 'Dispersion') && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: F.data, fontSize: 12, fontWeight: 700,
                  color: ev.metrics.find((m) => m.label === 'Dispersion')?.status === 'best' ? C.conf :
                    ev.metrics.find((m) => m.label === 'Dispersion')?.status === 'regression' ? C.flag : C.ink,
                }}>
                  {ev.metrics.find((m) => m.label === 'Dispersion')?.value}
                </div>
                <div style={{ fontFamily: F.data, fontSize: 7, color: C.muted, textTransform: 'uppercase' }}>
                  DISPERSION
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
