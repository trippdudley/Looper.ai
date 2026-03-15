import { CD, F, vis, fadeIn, fadeInOut } from './tokens';

const T = {
  coachCard:   400,
  coachOut:    5400,
  quote:       6000,
  attribution: 7400,
  quoteOut:    8800,
  playerCard:  9400,
  playerOut:   13400,
  insight:     14000,
};

const gridBg = [
  `linear-gradient(to right, ${CD.border}26 1px, transparent 1px)`,
  `linear-gradient(to bottom, ${CD.border}26 1px, transparent 1px)`,
].join(', ');

const coachProblems = [
  { num: '01', title: 'No persistent student record',
    desc: "Every lesson starts from scratch. The coach's memory is the only system." },
  { num: '02', title: '6–8 disconnected tools',
    desc: 'TrackMan on one screen. Video in another app. Drills via text. Payments somewhere else.' },
  { num: '03', title: 'No way to scale',
    desc: '29 billable hours a week. No infrastructure for between-lesson support.' },
  { num: '04', title: 'No proof of what works',
    desc: 'No longitudinal data connecting what was taught to what actually improved.' },
];

const playerProblems = [
  { num: '01', title: 'No continuity between lessons',
    desc: "The coach doesn't remember what was worked on last time." },
  { num: '02', title: 'No follow-up after the lesson ends',
    desc: 'Only 8% of first-time students hear from their instructor again.' },
  { num: '03', title: 'No way to tell if lessons are working',
    desc: '78% of players never track progress beyond keeping score.' },
  { num: '04', title: 'Overload, then nothing',
    desc: 'Information overload during the lesson. Nothing to reference after.' },
];

function ProblemCard({
  header,
  problems,
  elapsed,
  trigger,
}: {
  header: string;
  problems: { num: string; title: string; desc: string }[];
  elapsed: number;
  trigger: number;
}) {
  return (
    <div
      style={{
        background: CD.surface,
        border: `1px solid ${CD.border}`,
        borderRadius: 12,
        padding: '28px 32px',
        maxWidth: 580,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          fontFamily: F.brand,
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: CD.ink,
          marginBottom: 22,
        }}
      >
        {header}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
        {problems.map((p, i) => (
          <div
            key={i}
            style={{
              ...fadeIn(elapsed, trigger + i * 300, 400),
              display: 'flex',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: F.data,
                fontSize: 10,
                fontWeight: 700,
                color: CD.accent,
                marginTop: 2,
                flexShrink: 0,
              }}
            >
              {p.num}
            </div>
            <div>
              <div
                style={{
                  fontFamily: F.brand,
                  fontWeight: 700,
                  fontSize: 15,
                  color: CD.ink,
                  marginBottom: 3,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: F.data,
                  fontWeight: 400,
                  fontSize: 11,
                  color: CD.body,
                  lineHeight: 1.5,
                }}
              >
                {p.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Scene1_Problem({ elapsed }: { elapsed: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: CD.bg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: gridBg,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <div style={{ maxWidth: 720, width: '100%', textAlign: 'center' }}>
          {/* Beat 1 — Academy owner quote */}
          {vis(elapsed, T.quote) && elapsed < T.quoteOut + 600 && (
            <div style={fadeInOut(elapsed, T.quote, T.quoteOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.55,
                  color: CD.ink,
                  marginBottom: 20,
                  maxWidth: 640,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                I have a scheduling website, launch monitor software, 3D software,
                video software, emails, texts, an academy website...
                it would be better if these were all integrated.
              </div>
              <div
                style={{
                  ...fadeIn(elapsed, T.attribution, 700),
                  fontFamily: F.data,
                  fontWeight: 400,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: CD.muted,
                }}
              >
                -- PGA TEACHING PROFESSIONAL, 22 YEARS
              </div>
            </div>
          )}

          {/* Beat 2 — Coach/Academy problems */}
          {vis(elapsed, T.coachCard) && elapsed < T.coachOut + 600 && (
            <div style={fadeInOut(elapsed, T.coachCard, T.coachOut)}>
              <ProblemCard
                header="For the coach and academy today"
                problems={coachProblems}
                elapsed={elapsed}
                trigger={T.coachCard}
              />
            </div>
          )}

          {/* Beat 3 — Player problems */}
          {vis(elapsed, T.playerCard) && elapsed < T.playerOut + 600 && (
            <div style={fadeInOut(elapsed, T.playerCard, T.playerOut)}>
              <ProblemCard
                header="For the player today"
                problems={playerProblems}
                elapsed={elapsed}
                trigger={T.playerCard}
              />
            </div>
          )}

          {/* Beat 4 — Structural insight */}
          {vis(elapsed, T.insight) && (
            <div style={fadeIn(elapsed, T.insight, 800)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 20,
                  lineHeight: 1.55,
                  color: CD.ink,
                  maxWidth: 600,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                No one is building the structured data layer that connects
                coaching decisions to fitting decisions to on-course outcomes
                over time.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
