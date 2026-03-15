import { CD, F, vis, fadeIn, fadeInOut } from './tokens';

// Timing triggers (ms from scene start)
const T = {
  // Act 1: Brand reveal
  wordmark:     400,
  tagline:      1200,
  descriptor:   2000,
  wordmarkOut:  3200,
  // Act 2: Day One Value — Coach OS First Act
  d1Intro:      3800,
  d1IntroOut:   5600,
  feat1:        6000,
  feat2:        7200,
  feat3:        8400,
  feat4:        9600,
  feat5:        10800,
  featOut:      12400,
};

const gridBg = [
  `linear-gradient(to right, ${CD.border}26 1px, transparent 1px)`,
  `linear-gradient(to bottom, ${CD.border}26 1px, transparent 1px)`,
].join(', ');

const features = [
  { title: 'Integrated Coaching Operating System', tag: 'COACHING + FITTING',
    desc: 'Single pane of glass that connects the coaching infrastructure.' },
  { title: 'Automatic Session Summaries', tag: 'CAPTURE',
    desc: 'Audio capture transcribes the conversation. AI extracts what was identified, what was prescribed, and why.' },
  { title: 'Record Strings', tag: 'CONTINUITY',
    desc: 'Every session links to the last. A coach picking up with a returning student never starts cold.' },
  { title: 'On-Course Closed Loop', tag: 'OUTCOMES',
    desc: 'GHIN tracks handicap trends. Arccos tracks shot-level strokes gained. Did what we tried actually work?' },
  { title: 'Professional-Language Diagnostics', tag: 'INTELLIGENCE',
    desc: 'Data translated into the language pros already think in. Strike variability, not launch monitor jargon.' },
];


export default function Scene2_SolutionEndgame({ elapsed }: { elapsed: number }) {
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

          {/* === Act 1: Wordmark reveal === */}
          {vis(elapsed, T.wordmark) && elapsed < T.wordmarkOut + 600 && (
            <div style={fadeInOut(elapsed, T.wordmark, T.wordmarkOut)}>
              <div
                style={{
                  ...fadeIn(elapsed, T.wordmark, 800),
                  fontFamily: F.brand,
                  fontWeight: 800,
                  fontSize: 42,
                  letterSpacing: '0.06em',
                  marginBottom: 12,
                }}
              >
                <span style={{ color: CD.ink }}>LOOPER</span>
                <span style={{ color: CD.accent }}>.AI</span>
              </div>
              <div
                style={{
                  ...fadeIn(elapsed, T.tagline, 600),
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 20,
                  color: CD.body,
                  marginBottom: 14,
                }}
              >
                Expertise, engineered.
              </div>
              <div
                style={{
                  ...fadeIn(elapsed, T.descriptor, 600),
                  fontFamily: F.data,
                  fontWeight: 400,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: CD.muted,
                }}
              >
                THE COACHING OS FOR THE AGE OF AI
              </div>
            </div>
          )}

          {/* === Act 2: Day One Value === */}
          {/* Intro line */}
          {vis(elapsed, T.d1Intro) && elapsed < T.d1IntroOut + 600 && (
            <div style={fadeInOut(elapsed, T.d1Intro, T.d1IntroOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: CD.ink,
                }}
              >
                We begin by creating the operating system
                for coaching in the age of AI.
              </div>
            </div>
          )}

          {/* Feature cards — staggered */}
          {vis(elapsed, T.feat1) && elapsed < T.featOut + 600 && (
            <div
              style={{
                ...fadeInOut(elapsed, T.feat1, T.featOut),
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 14,
                textAlign: 'left',
                maxWidth: 560,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {features.map((f, i) => {
                const trigger = [T.feat1, T.feat2, T.feat3, T.feat4, T.feat5][i];
                return (
                  <div
                    key={i}
                    style={{
                      ...fadeIn(elapsed, trigger, 500),
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontFamily: F.brand,
                          fontWeight: 700,
                          fontSize: 14,
                          color: CD.ink,
                        }}
                      >
                        {f.title}
                      </span>
                      <span
                        style={{
                          fontFamily: F.data,
                          fontSize: 8,
                          fontWeight: 700,
                          color: CD.accent,
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.06em',
                          border: `1px solid ${CD.accent}40`,
                          padding: '2px 6px',
                          borderRadius: 3,
                        }}
                      >
                        {f.tag}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: F.data,
                        fontSize: 10,
                        color: CD.body,
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
