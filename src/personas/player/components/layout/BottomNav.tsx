/**
 * BottomNav — Mobile bottom tab bar (dark mode).
 * 5 tabs: Home (chat + dashboard), Practice, Journey, DNA, Rounds.
 */
import { MessageCircle, LayoutDashboard, Target, Route, Dna, List } from 'lucide-react';
import { C, F } from '../../data/tokens';

export type PlayerTab = 'ask' | 'home' | 'practice' | 'journey' | 'dna' | 'activity';

interface BottomNavProps {
  activeTab: PlayerTab;
  onTabChange: (tab: PlayerTab) => void;
}

const tabs: { key: PlayerTab; label: string; Icon: typeof MessageCircle }[] = [
  { key: 'ask', label: 'Ask', Icon: MessageCircle },
  { key: 'home', label: 'Home', Icon: LayoutDashboard },
  { key: 'practice', label: 'Practice', Icon: Target },
  { key: 'journey', label: 'Journey', Icon: Route },
  { key: 'dna', label: 'DNA', Icon: Dna },
  { key: 'activity', label: 'Activity', Icon: List },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps): JSX.Element {
  return (
    <nav
      className="player-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0 env(safe-area-inset-bottom, 10px)',
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}
    >
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        const isHome = key === 'ask';
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              minWidth: 56,
              position: 'relative',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 2,
                background: C.accentBright,
                borderRadius: 1,
                boxShadow: `0 0 8px ${C.confGlow}`,
              }} />
            )}
            {isHome ? (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: active ? C.accentGrad : C.surfaceAlt,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: active ? `0 0 12px ${C.confGlow}` : 'none',
                transition: 'all 150ms',
                marginTop: -4,
              }}>
                <Icon size={14} color={active ? '#fff' : C.muted} strokeWidth={active ? 2.2 : 1.5} />
              </div>
            ) : (
              <Icon
                size={20}
                color={active ? C.accentBright : C.muted}
                strokeWidth={active ? 2.2 : 1.5}
                style={active ? { filter: `drop-shadow(0 0 6px ${C.confGlow})` } : undefined}
              />
            )}
            <span style={{ fontFamily: F.brand, fontSize: 10, fontWeight: active ? 600 : 400, color: active ? C.accentBright : C.muted }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
