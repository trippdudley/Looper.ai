/**
 * GlobalBar — Top navigation bar for the Player Portal (dark mode).
 * LOOPER wordmark (white) + .AI (accent glow), player name and avatar on right.
 */
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { C, F } from '../../data/tokens';

export default function GlobalBar(): JSX.Element {
  return (
    <div
      style={{
        background: C.bg,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 4,
            marginRight: 8,
          }}
          aria-label="Back to home"
        >
          <ChevronLeft size={16} color={C.muted} />
        </Link>
        <span
          style={{
            fontFamily: F.brand,
            fontSize: 15,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
          }}
        >
          LOOPER
        </span>
        <span
          style={{
            fontFamily: F.brand,
            fontSize: 15,
            fontWeight: 800,
            color: C.accentBright,
            letterSpacing: '.06em',
            textShadow: `0 0 12px ${C.confGlow}`,
          }}
        >
          .AI
        </span>
      </div>

      {/* Right: player name + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontFamily: F.brand,
            fontSize: 13,
            fontWeight: 500,
            color: C.body,
          }}
        >
          Tripp D.
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: C.accentGrad,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 16px ${C.confGlow}`,
          }}
        >
          <span
            style={{
              fontFamily: F.brand,
              fontSize: 11,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            TD
          </span>
        </div>
      </div>
    </div>
  );
}
