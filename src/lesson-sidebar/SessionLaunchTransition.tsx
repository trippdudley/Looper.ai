import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { CD, F } from './tokens';

interface LaunchStage {
  thinking: string;
  resolved: string;
}

const STAGES: LaunchStage[] = [
  { thinking: 'Loading persistent record...', resolved: '8 sessions captured. Last: Mar 18 \u2014 Iron strike centering' },
  { thinking: 'Checking practice compliance...', resolved: 'Gate drill: 2/3 completed. Alignment check: 1/2 completed.' },
  { thinking: 'Assembling session context...', resolved: 'Suggested focus: Continue iron strike work or pivot to driver block (SG: \u22122.3 off tee)' },
];

/** Pre-launch modal with visible AI preparation stages */
export default function SessionLaunchTransition({ onLaunch }: { onLaunch: () => void }) {
  const [stageStates, setStageStates] = useState<('thinking' | 'resolved')[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    setStageStates(['thinking']);
    timers.push(setTimeout(() => setStageStates(['resolved', 'thinking']), 1500));
    timers.push(setTimeout(() => setStageStates(['resolved', 'resolved', 'thinking']), 3000));
    timers.push(setTimeout(() => setStageStates(['resolved', 'resolved', 'resolved']), 4500));
    return () => timers.forEach(clearTimeout);
  }, []);

  const allResolved = stageStates.length === 3 && stageStates.every((s) => s === 'resolved');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `rgba(12, 17, 23, 0.95)`,
    }}>
      <div style={{ maxWidth: 480, width: '100%', padding: '0 32px' }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{
            fontFamily: F.brand, fontSize: 14, fontWeight: 800, color: CD.ink,
            letterSpacing: '0.05em',
          }}>
            LOOPER<span style={{ color: CD.accent }}>.AI</span>
          </span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontFamily: F.brand, fontSize: 18, fontWeight: 500, color: CD.ink,
            margin: '0 0 4px 0',
          }}>
            Preparing Session 9
          </h2>
          <p style={{
            fontFamily: F.data, fontSize: 13, color: CD.muted, margin: 0,
          }}>
            Moe Norman &mdash; M. Thompson
          </p>
        </div>

        {/* Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {stageStates.map((status, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {status === 'thinking' ? (
                <span style={{
                  display: 'block', width: 10, height: 10, borderRadius: '50%',
                  background: CD.accent, marginTop: 3, flexShrink: 0,
                  animation: 'sidebarPulse 1.5s ease-in-out infinite',
                }} />
              ) : (
                <Check size={14} style={{ color: CD.accent, marginTop: 2, flexShrink: 0 }} />
              )}
              <span style={{
                fontFamily: F.data, fontSize: 12, lineHeight: 1.6,
                color: status === 'thinking' ? CD.muted : CD.body,
              }}>
                {status === 'thinking' ? STAGES[i].thinking : STAGES[i].resolved}
              </span>
            </div>
          ))}
        </div>

        {/* Launch button */}
        {allResolved && (
          <div style={{ textAlign: 'center', marginTop: 40, animation: 'cardEnter 300ms ease-out forwards' }}>
            <button
              onClick={onLaunch}
              style={{
                fontFamily: F.brand, fontSize: 14, fontWeight: 600,
                background: CD.accent, color: CD.bg,
                border: 'none', borderRadius: 6,
                padding: '12px 28px', cursor: 'pointer',
              }}
            >
              Launch Session
            </button>
            <p style={{
              fontFamily: F.data, fontSize: 10, color: CD.muted, marginTop: 12,
            }}>
              TrackMan Performance Studio will open alongside Looper
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
