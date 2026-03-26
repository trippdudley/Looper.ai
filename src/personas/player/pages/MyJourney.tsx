/**
 * MyJourney — Tab 3 (dark mode, WHOOP-inspired).
 * Glowing timeline spine, pulsing dots, connection insight cards with glow.
 */
import { C, F, S } from '../data/tokens';
import { journeyEvents, connectionInsights, journeyInsight } from '../data/tripp';
import ConfBadge from '../components/shared/ConfBadge';

const typeConfig: Record<string, { color: string; label: string }> = {
  round: { color: C.conf, label: 'Round' },
  practice: { color: C.accentBright, label: 'Practice' },
  lesson: { color: C.caution, label: 'Lesson' },
};

export default function MyJourney(): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Journey Summary stat strip */}
      <div style={{ ...S.cardInner, display: 'flex', justifyContent: 'center', gap: 16 }}>
        {[
          { value: '2.5 years', label: 'Duration' },
          { value: '118 rounds', label: 'Rounds' },
          { value: '208 sessions', label: 'Sessions' },
          { value: '6.8 → 2.0 HI', label: 'Handicap' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink }}>{stat.value}</div>
            <div style={{ fontFamily: F.brand, fontSize: 10, color: C.muted }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontFamily: F.brand, fontSize: 22, fontWeight: 700, color: C.ink }}>My Journey</div>
        <div style={{ fontFamily: F.brand, fontSize: 13, color: C.muted, marginTop: 3 }}>
          Rounds, practice sessions, and lessons — one story.
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16 }}>
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: cfg.color,
              boxShadow: `0 0 6px ${cfg.color}66`,
            }} />
            <span style={{ fontFamily: F.brand, fontSize: 11, color: C.body }}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Glowing spine */}
        <div
          style={{
            position: 'absolute', left: 9, top: 8, bottom: 8,
            width: 2,
            background: `linear-gradient(180deg, ${C.conf}44, ${C.accentBright}44, ${C.caution}44, ${C.border})`,
          }}
        />

        {journeyEvents.map((event, i) => {
          const cfg = typeConfig[event.type] || typeConfig.round;
          const connInsight = connectionInsights.find((ci) => ci.afterEventId === event.id);
          const isFirst = i === 0;

          return (
            <div key={event.id}>
              <div style={{ position: 'relative', marginBottom: connInsight ? 0 : 16 }}>
                {/* Dot with glow */}
                <div
                  style={{
                    position: 'absolute', left: -28, top: 14,
                    width: 16, height: 16, borderRadius: '50%',
                    background: cfg.color,
                    border: `2px solid ${C.bg}`,
                    boxShadow: `0 0 12px ${cfg.color}88${isFirst ? ', 0 0 20px ' + cfg.color + '44' : ''}`,
                    zIndex: 1,
                  }}
                />

                <div style={{
                  ...S.card,
                  padding: '14px 16px',
                  background: isFirst ? C.surfaceAlt : C.surface,
                  transition: 'background 150ms ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: F.data, fontSize: 9, fontWeight: 700,
                      color: cfg.color, background: `${cfg.color}18`,
                      padding: '2px 7px', borderRadius: 4,
                      textTransform: 'uppercase', letterSpacing: '.06em',
                      boxShadow: `0 0 6px ${cfg.color}22`,
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>{event.date}</span>
                  </div>
                  <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 5 }}>
                    {event.title}
                  </div>
                  <div style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.5 }}>
                    {event.insight}
                  </div>
                  {event.metrics && event.metrics.length > 0 && (
                    <div style={{ display: 'flex', gap: 14, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                      {event.metrics.map((m, mi) => (
                        <div key={mi}>
                          <div style={{ fontFamily: F.data, fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>
                            {m.label}
                          </div>
                          <div style={{ fontFamily: F.data, fontSize: 14, fontWeight: 700, color: C.ink }}>
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {connInsight && (
                <div
                  style={{
                    marginLeft: 10, marginBottom: 16, marginTop: 8,
                    padding: '10px 14px',
                    background: C.accentBg,
                    borderLeft: `2px solid ${C.accentBright}`,
                    borderRadius: '0 6px 6px 0',
                    boxShadow: `0 0 12px ${C.confGlow}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: F.brand, fontSize: 12, color: C.body, lineHeight: 1.4, flex: 1 }}>
                      {connInsight.text}
                    </span>
                    <ConfBadge value={connInsight.confidence} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Journey Insight */}
      <div
        style={{
          ...S.cardHero,
          borderLeft: `3px solid ${C.accentBright}`,
          borderRadius: '0 8px 8px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            fontFamily: F.data, fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.08em', color: C.accentBright,
            textShadow: `0 0 8px ${C.confGlow}`,
          }}>
            Journey Insight
          </span>
          <ConfBadge value={journeyInsight.confidence} />
        </div>
        <div style={{ fontFamily: F.brand, fontSize: 14, color: C.body, lineHeight: 1.5 }}>
          {journeyInsight.text}
        </div>
      </div>
    </div>
  );
}
