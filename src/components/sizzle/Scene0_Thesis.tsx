import { CD, F, vis, fadeInOut } from './tokens';

const T = {
  hook:    600,
  hookOut: 3800,
  subvert: 4100,
  subvertOut: 7300,
};

const gridBg = [
  `linear-gradient(to right, ${CD.border}26 1px, transparent 1px)`,
  `linear-gradient(to bottom, ${CD.border}26 1px, transparent 1px)`,
].join(', ');

export default function Scene0_Thesis({ elapsed }: { elapsed: number }) {
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
        <div style={{ maxWidth: 680, width: '100%', textAlign: 'center' }}>
          {/* Beat 1 — Hook */}
          {vis(elapsed, T.hook) && elapsed < T.hookOut + 600 && (
            <div style={fadeInOut(elapsed, T.hook, T.hookOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 30,
                  lineHeight: 1.55,
                  color: CD.ink,
                }}
              >
                AI will transform how golf is taught, how players learn,
                and how equipment is fitted.
              </div>
            </div>
          )}

          {/* Beat 2 — Subvert */}
          {vis(elapsed, T.subvert) && elapsed < T.subvertOut + 600 && (
            <div style={fadeInOut(elapsed, T.subvert, T.subvertOut)}>
              <div
                style={{
                  fontFamily: F.serif,
                  fontStyle: 'italic',
                  fontSize: 26,
                  lineHeight: 1.55,
                  color: CD.accent,
                }}
              >
                But not the way the industry is approaching it.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
