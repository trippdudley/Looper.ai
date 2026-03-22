import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wifi } from 'lucide-react';
import { trackmanShots } from '../data/trackmanData';
import type { TrackmanShot } from '../data/trackmanData';
import { sessionContext } from '../data/coachingOSData';
import TPSSimulator from '../components/trackman/TPSSimulator';
import LooperIntelPanel from '../components/trackman/LooperIntelPanel';
import { C, F } from '../components/trackman/TPSColors';

// Session 3 data
const session3Shots = trackmanShots.filter(s => s.sessionId === 'session-3');

export default function TrackmanIntegration() {
  const [activeShot, setActiveShot] = useState<TrackmanShot>(
    session3Shots[session3Shots.length - 1],
  );
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  // CSS keyframes injection
  useEffect(() => {
    const id = 'trackman-integration-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      @keyframes breathe { 0%,100% { opacity:0.03; } 50% { opacity:0.07; } }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: C.bg, fontFamily: F.brand, color: C.body,
      position: 'relative',
    }}>
      {/* Ambient breathe */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 800px 600px at 40% 30%, ${C.accent}06, transparent)`,
        animation: 'breathe 8s ease-in-out infinite',
      }} />

      {/* ═══ TOP BAR ═══════════════════════════════════════════════ */}
      <div style={{
        minHeight: 44, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 12px', flexShrink: 0,
        flexWrap: 'wrap' as const, gap: 6,
        background: `${C.surface}ee`, backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`, zIndex: 10, position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex' }}>
            <span style={{
              fontFamily: F.brand, fontSize: 13, fontWeight: 800,
              letterSpacing: '.05em', color: C.ink,
            }}>LOOPER</span>
            <span style={{
              fontFamily: F.brand, fontSize: 13, fontWeight: 800,
              letterSpacing: '.05em', color: C.accent,
            }}>.AI</span>
          </Link>
          <Link to="/coach/live" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: F.brand, fontSize: 12, color: C.muted, fontWeight: 500,
          }}>
            <ArrowLeft size={12} /> Coaching OS
          </Link>
        </div>

        {/* Integration Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 16,
            background: C.tpsBg, border: `1px solid ${C.tpsBorder}`,
          }}>
            <span style={{
              fontFamily: F.data, fontSize: 8, fontWeight: 700,
              color: C.tps, letterSpacing: '.04em',
            }}>TRACKMAN</span>
            <Wifi size={10} color={C.tps} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: C.conf, animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontFamily: F.data, fontSize: 9, fontWeight: 700,
              color: C.conf, letterSpacing: '.04em',
            }}>LIVE</span>
          </div>
          <span style={{ fontFamily: F.data, fontSize: 10, color: C.muted }}>
            {sessionContext.playerName} · Session 3
          </span>
        </div>

        <div style={{
          fontFamily: F.data, fontSize: 8, color: C.dim, letterSpacing: '.04em',
        }}>TRACKMAN INTEGRATION PROTOTYPE</div>
      </div>

      {/* ═══ SPLIT CONTENT ═════════════════════════════════════════ */}
      <div style={{
        flex: 1, display: 'flex', overflow: 'auto',
        position: 'relative', zIndex: 1,
      }}>
        <TPSSimulator
          shots={session3Shots}
          activeShot={activeShot}
          onSelectShot={setActiveShot}
        />
        <LooperIntelPanel
          activeShot={activeShot}
          collapsed={panelCollapsed}
          onToggle={() => setPanelCollapsed(!panelCollapsed)}
        />
      </div>
    </div>
  );
}
