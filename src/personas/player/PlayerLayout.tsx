import { useState } from 'react';
import { C, F } from './data/tokens';
import GlobalBar from './components/layout/GlobalBar';
import DataSourceBar from './components/layout/DataSourceBar';
import BottomNav, { type PlayerTab } from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import PracticeMode from './pages/PracticeMode';
import Rounds from './pages/Rounds';
import Lessons from './pages/Lessons';
import MyJourney from './pages/MyJourney';
import ChatPanel, { ChatFAB } from './components/overlays/ChatPanel';
import DataSourceDrawer from './components/overlays/DataSourceDrawer';

export default function PlayerLayout() {
  const [activeTab, setActiveTab] = useState<PlayerTab>('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [drawerSource, setDrawerSource] = useState<string | null>(null);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToJourney={() => setActiveTab('journey')} />;
      case 'practice':
        return <PracticeMode />;
      case 'rounds':
        return <Rounds />;
      case 'lessons':
        return <Lessons />;
      case 'journey':
        return <MyJourney />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        fontFamily: F.brand,
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=Playfair+Display:ital@1&display=swap"
        rel="stylesheet"
      />

      {/* L1: Global bar */}
      <GlobalBar />

      {/* L2: Data source inventory */}
      <DataSourceBar onSourceTap={setDrawerSource} />

      {/* L3: Tab nav (inline, above content) */}
      <div
        style={{
          background: C.surface,
          borderBottom: `0.5px solid ${C.borderSub}`,
          display: 'flex',
          padding: '0 16px',
        }}
      >
        {(['dashboard', 'practice', 'rounds', 'lessons', 'journey'] as PlayerTab[]).map((tab) => {
          const active = activeTab === tab;
          const labels: Record<PlayerTab, string> = {
            dashboard: 'Dashboard',
            practice: 'Practice',
            rounds: 'Rounds',
            lessons: 'Lessons',
            journey: 'My Journey',
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: F.brand,
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: active ? C.accent : C.muted,
                background: 'none',
                border: 'none',
                borderBottom: active ? `2px solid ${C.accent}` : '2px solid transparent',
                padding: '10px 12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* L4: Content area */}
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: '16px 16px 88px',
        }}
      >
        {renderTab()}
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Chat FAB + Panel */}
      {!chatOpen && <ChatFAB onClick={() => setChatOpen(true)} />}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} activeTab={activeTab} />

      {/* Data source drawer */}
      <DataSourceDrawer sourceKey={drawerSource} onClose={() => setDrawerSource(null)} />
    </div>
  );
}
