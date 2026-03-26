/**
 * SidebarNav — Desktop left sidebar navigation (dark mode).
 * 5 tabs: Home (chat + dashboard), Practice, Journey, DNA, Rounds.
 */
import { MessageCircle, LayoutDashboard, Target, Route, Dna, List } from 'lucide-react';
import { C, F } from '../../data/tokens';
import type { PlayerTab } from './BottomNav';

interface SidebarNavProps {
  activeTab: PlayerTab;
  onTabChange: (tab: PlayerTab) => void;
}

const tabs: { key: PlayerTab; label: string; Icon: typeof MessageCircle }[] = [
  { key: 'ask', label: 'Ask Looper', Icon: MessageCircle },
  { key: 'home', label: 'Home', Icon: LayoutDashboard },
  { key: 'practice', label: 'Practice Brief', Icon: Target },
  { key: 'journey', label: 'My Journey', Icon: Route },
  { key: 'dna', label: 'Golf DNA', Icon: Dna },
  { key: 'activity', label: 'Activity', Icon: List },
];

export default function SidebarNav({ activeTab, onTabChange }: SidebarNavProps): JSX.Element {
  return (
    <nav style={{ width: 220, minHeight: 'calc(100vh - 52px)', background: C.bg, borderRight: `1px solid ${C.border}`, padding: '20px 0', flexShrink: 0 }}>
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        const isHome = key === 'ask';
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '11px 20px',
              background: active ? C.accentBg : 'transparent',
              border: 'none',
              borderLeft: active ? `3px solid ${C.accentBright}` : '3px solid transparent',
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
          >
            {isHome ? (
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: active ? C.accentGrad : C.surfaceAlt,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: active ? `0 0 8px ${C.confGlow}` : 'none',
                transition: 'all 150ms',
              }}>
                <Icon size={12} color={active ? '#fff' : C.muted} strokeWidth={active ? 2 : 1.5} />
              </div>
            ) : (
              <Icon size={18} color={active ? C.accentBright : C.muted} strokeWidth={active ? 2 : 1.5}
                style={active ? { filter: `drop-shadow(0 0 4px ${C.confGlow})` } : undefined} />
            )}
            <span style={{ fontFamily: F.brand, fontSize: 13, fontWeight: active || isHome ? 600 : 400, color: active ? C.ink : C.body }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
