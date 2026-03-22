import { User } from 'lucide-react';
import { C, F } from '../../data/tokens';

export default function GlobalBar() {
  return (
    <div
      style={{
        background: '#1A1F2B',
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span
          style={{
            fontFamily: F.brand,
            fontSize: 13,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '.05em',
            textTransform: 'uppercase',
          }}
        >
          LOOPER
        </span>
        <span
          style={{
            fontFamily: F.brand,
            fontSize: 13,
            fontWeight: 800,
            color: C.accent,
            letterSpacing: '.05em',
          }}
        >
          .AI
        </span>
        <span
          style={{
            fontFamily: F.data,
            fontSize: 8,
            fontWeight: 700,
            color: '#1A1F2B',
            background: C.accent,
            borderRadius: 2,
            padding: '1px 5px',
            marginLeft: 6,
            letterSpacing: '.06em',
          }}
        >
          PRO
        </span>
      </div>

      {/* Right side */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <User size={14} color="rgba(255,255,255,0.7)" />
      </div>
    </div>
  );
}
