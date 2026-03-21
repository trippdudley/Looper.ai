import { LayoutDashboard, Target, Flag, BookOpen, Route } from 'lucide-react';
import { C, F } from '../../data/tokens';

export type PlayerTab = 'dashboard' | 'practice' | 'rounds' | 'lessons' | 'journey';

interface BottomNavProps {
  activeTab: PlayerTab;
  onTabChange: (tab: PlayerTab) => void;
}

const tabs: { key: PlayerTab; label: string; Icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'practice', label: 'Practice', Icon: Target },
  { key: 'rounds', label: 'Rounds', Icon: Flag },
  { key: 'lessons', label: 'Lessons', Icon: BookOpen },
  { key: 'journey', label: 'My Journey', Icon: Route },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: C.surface,
        borderTop: `0.5px solid ${C.borderSub}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '6px 0 env(safe-area-inset-bottom, 8px)',
        zIndex: 50,
      }}
    >
      {tabs.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              minWidth: 64,
            }}
          >
            <Icon
              size={20}
              color={active ? C.accent : C.muted}
              strokeWidth={active ? 2.2 : 1.5}
            />
            <span
              style={{
                fontFamily: F.data,
                fontSize: 9,
                fontWeight: active ? 700 : 400,
                color: active ? C.accent : C.muted,
                letterSpacing: '.04em',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
