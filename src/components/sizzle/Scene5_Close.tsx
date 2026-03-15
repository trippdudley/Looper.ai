import { CD, F, vis, fadeIn, fadeInOut } from './tokens';

const T = {
  looper:    400,
  looperOut: 3200,
  wordmark:  3800,
  tagline:   4600,
  url:       5200,
};

export default function Scene5_Close({ elapsed }: { elapsed: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: CD.bg,
        backgroundImage: `linear-gradient(${CD.border}26 1px, transparent 1px), linear-gradient(90deg, ${CD.border}26 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 640, padding: 32 }}>
        {/* Beat 1 — Every great golfer */}
        {vis(elapsed, T.looper) && elapsed < T.looperOut + 600 && (
          <div style={fadeInOut(elapsed, T.looper, T.looperOut)}>
            <div
              style={{
                fontFamily: F.serif,
                fontStyle: 'italic',
                fontSize: 22,
                color: CD.ink,
                lineHeight: 1.5,
                marginBottom: 12,
              }}
            >
              Every great golfer has had a looper.
            </div>
            <div
              style={{
                fontFamily: F.serif,
                fontStyle: 'italic',
                fontSize: 16,
                color: CD.body,
                lineHeight: 1.5,
              }}
            >
              Someone who knows your game, remembers what happened last time,
              and helps you make better decisions.
            </div>
          </div>
        )}

        {/* Beat 2 — Wordmark */}
        {vis(elapsed, T.wordmark) && (
          <div>
            <div style={{ ...fadeIn(elapsed, T.wordmark, 800), letterSpacing: '0.06em' }}>
              <span
                style={{
                  fontFamily: F.brand,
                  fontWeight: 800,
                  fontSize: 48,
                  color: CD.ink,
                }}
              >
                LOOPER
              </span>
              <span
                style={{
                  fontFamily: F.brand,
                  fontWeight: 800,
                  fontSize: 48,
                  color: CD.accent,
                }}
              >
                .AI
              </span>
            </div>
            <div
              style={{
                ...fadeIn(elapsed, T.tagline, 600),
                fontFamily: F.serif,
                fontStyle: 'italic',
                fontSize: 22,
                color: CD.body,
                marginTop: 20,
              }}
            >
              Expertise, engineered.
            </div>
            <div
              style={{
                ...fadeIn(elapsed, T.url, 600),
                fontFamily: F.data,
                fontWeight: 400,
                fontSize: 11,
                color: CD.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: 24,
              }}
            >
              looper.ai
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
