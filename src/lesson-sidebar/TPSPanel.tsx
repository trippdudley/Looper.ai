import { Home, FolderOpen, HelpCircle, User, Target, Camera, Settings } from 'lucide-react';
import { TPS, TPS_METRICS, F } from './tokens';

/** Top navigation bar */
function TPSNav() {
  const iconStyle = { color: TPS.textDim, cursor: 'pointer' };
  return (
    <div style={{
      height: 44, background: TPS.navBg, display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: 8, borderBottom: `1px solid ${TPS.border}`,
      fontFamily: F.tps,
    }}>
      {/* Left icons */}
      <Home size={18} style={iconStyle} />
      <FolderOpen size={18} style={iconStyle} />
      <HelpCircle size={18} style={iconStyle} />
      <div style={{ width: 1, height: 20, background: TPS.border, margin: '0 6px' }} />

      {/* Shot Analysis label */}
      <span style={{ fontSize: 13, fontWeight: 700, color: TPS.text, letterSpacing: '0.02em' }}>
        SHOT ANALYSIS
      </span>

      <div style={{ flex: 1 }} />

      {/* Player + Club */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <User size={14} style={{ color: TPS.textSec }} />
          <span style={{ fontSize: 12, color: TPS.textSec }}>Moe Norman</span>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: TPS.text,
          background: TPS.surface, padding: '2px 8px', borderRadius: 3,
          border: `1px solid ${TPS.border}`,
        }}>
          DR
        </div>
      </div>

      {/* Right icons */}
      <Target size={16} style={iconStyle} />
      <Camera size={16} style={iconStyle} />
      <Settings size={16} style={iconStyle} />
    </div>
  );
}

/** Ball flight 3D visualization (SVG) */
function BallFlightViz() {
  return (
    <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden', minHeight: 280 }}>
      <svg width="100%" height="100%" viewBox="0 0 600 340" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Sky gradient */}
          <linearGradient id="tps-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a7fa0" />
            <stop offset="40%" stopColor="#8fb8d4" />
            <stop offset="70%" stopColor="#c8dce8" />
            <stop offset="100%" stopColor="#d4e0c8" />
          </linearGradient>
          {/* Fairway gradient */}
          <linearGradient id="tps-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a7a3a" />
            <stop offset="50%" stopColor="#3d6b30" />
            <stop offset="100%" stopColor="#2d5420" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="600" height="200" fill="url(#tps-sky)" />
        {/* Fairway */}
        <rect x="0" y="200" width="600" height="140" fill="url(#tps-grass)" />
        {/* Horizon line */}
        <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* Distance markers on fairway */}
        {[
          { x: 180, label: '100' },
          { x: 300, label: '150' },
          { x: 420, label: '200' },
          { x: 520, label: '250' },
        ].map((m) => (
          <g key={m.label}>
            <line x1={m.x - 20} y1={220} x2={m.x + 20} y2={220}
              stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <text x={m.x} y={235} fill="rgba(255,255,255,0.35)"
              fontSize="10" fontFamily={F.tps} textAnchor="middle">{m.label}</text>
          </g>
        ))}

        {/* Ground shadow trace */}
        <path
          d="M 60,220 Q 300,215 490,225"
          fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeDasharray="4 3"
        />

        {/* Trajectory arc — curves slightly right (fade) */}
        <path
          d="M 60,220 C 150,40 380,30 500,218"
          fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"
        />

        {/* Apex dot */}
        <circle cx="260" cy="55" r="3" fill="#FFFFFF" />

        {/* Landing zone */}
        <circle cx="500" cy="220" r="5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="500" cy="220" r="2" fill="#FFFFFF" />

        {/* View mode icons placeholder (top-left) */}
        <g opacity="0.3">
          <rect x="12" y="12" width="16" height="16" rx="2" fill="none" stroke="#fff" strokeWidth="1" />
          <rect x="34" y="12" width="16" height="16" rx="2" fill="none" stroke="#fff" strokeWidth="1" />
          <rect x="56" y="12" width="16" height="16" rx="2" fill="none" stroke="#fff" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

/** Video panel placeholder */
function VideoPanel() {
  const tabs = ['DL', 'OT1', 'OT2', 'LIVE'];
  const activeTab = 'OT1';

  return (
    <div style={{
      flex: '0 0 45%', background: TPS.bg,
      display: 'flex', flexDirection: 'column',
      borderLeft: `1px solid ${TPS.border}`,
      fontFamily: F.tps,
    }}>
      {/* Tab selector */}
      <div style={{
        display: 'flex', gap: 4, padding: '8px 10px',
        borderBottom: `1px solid ${TPS.border}`,
      }}>
        {tabs.map((t) => (
          <span key={t} style={{
            fontSize: 10, fontWeight: 600, padding: '3px 10px',
            borderRadius: 3, cursor: 'pointer',
            color: t === activeTab ? TPS.bg : TPS.textDim,
            background: t === activeTab ? TPS.accent : 'transparent',
            border: t === activeTab ? 'none' : `1px solid ${TPS.border}`,
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Camera source label */}
      <div style={{
        padding: '6px 10px', fontSize: 10, color: TPS.textSec,
        borderBottom: `1px solid ${TPS.border}`,
      }}>
        Down Line iPhone
      </div>

      {/* Placeholder */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <Camera size={48} style={{ color: TPS.textDim }} />
        <span style={{ fontSize: 11, color: TPS.textDim, letterSpacing: '0.08em' }}>
          VIDEO FEED
        </span>
      </div>
    </div>
  );
}

/** Metrics strip with orange labels and large white values */
function MetricsStrip() {
  return (
    <div style={{
      height: 110, background: TPS.bg,
      borderTop: `1px solid ${TPS.border}`,
      display: 'flex', alignItems: 'center',
      overflowX: 'auto', fontFamily: F.tps,
    }}>
      {TPS_METRICS.map((m, i) => (
        <div key={m.label} style={{
          padding: '0 14px', minWidth: 100,
          borderRight: i < TPS_METRICS.length - 1 ? `1px solid ${TPS.border}` : undefined,
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, color: TPS.accent,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {m.label}
          </span>
          <span style={{ fontSize: 32, fontWeight: 700, color: TPS.text, lineHeight: 1.1 }}>
            {m.value}
          </span>
          <span style={{ fontSize: 10, color: TPS.textSec }}>{m.unit}</span>
        </div>
      ))}
    </div>
  );
}

/** Footer bar */
function TPSFooter() {
  return (
    <div style={{
      height: 28, background: TPS.navBg,
      display: 'flex', alignItems: 'center',
      padding: '0 12px', fontFamily: F.tps,
      borderTop: `1px solid ${TPS.border}`,
    }}>
      {/* Left tabs */}
      <div style={{ display: 'flex', gap: 12 }}>
        {['Shotlist (S)', 'Data (D)', 'Extended screens'].map((t, i) => (
          <span key={t} style={{
            fontSize: 10, color: i === 0 ? TPS.textSec : TPS.textDim,
            cursor: 'pointer',
          }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Center info */}
      <span style={{ fontSize: 10, color: TPS.textSec }}>
        Moe Norman, Driver, Premium, Mar 23, 2026 2:14 PM
      </span>

      <div style={{ flex: 1 }} />

      {/* Right tools */}
      <div style={{ display: 'flex', gap: 12 }}>
        <span style={{ fontSize: 10, color: TPS.textDim, cursor: 'pointer' }}>Normalize (N)</span>
        <span style={{ fontSize: 10, color: TPS.textDim, cursor: 'pointer' }}>Report (R)</span>
      </div>
    </div>
  );
}

/** TrackMan Performance Studio wireframe panel */
export default function TPSPanel() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: TPS.bg, fontFamily: F.tps, overflow: 'hidden',
    }}>
      <TPSNav />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BallFlightViz />
        <VideoPanel />
      </div>
      <MetricsStrip />
      <TPSFooter />
    </div>
  );
}
