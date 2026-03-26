/**
 * PlayerLayout — Root layout for the Looper Player Portal (dark mode).
 * Chat-first: Home = Ask Looper + Dashboard merged. 5 tabs total.
 * Responsive: mobile bottom nav (<768px), desktop left sidebar (1200px+).
 */
import { useState, useEffect } from 'react';
import { C, F } from './data/tokens';
import GlobalBar from './components/layout/GlobalBar';
import BottomNav, { type PlayerTab } from './components/layout/BottomNav';
import SidebarNav from './components/layout/SidebarNav';
import AskLooperChat from './pages/AskLooperChat';
import Home from './pages/AskLooper';
import PracticeBrief from './pages/PracticeBrief';
import MyJourney from './pages/MyJourney';
import GolfDNA from './pages/GolfDNA';
import Activity from './pages/Activity';

function useWindowWidth(): number {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

export default function PlayerLayout(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<PlayerTab>('home');
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 1200;
  const isMobile = windowWidth < 768;
  const contentMaxWidth = isDesktop ? 860 : isMobile ? 480 : 680;

  const renderTab = (): React.JSX.Element => {
    switch (activeTab) {
      case 'ask':
        return <AskLooperChat />;
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'practice':
        return <PracticeBrief />;
      case 'journey':
        return <MyJourney />;
      case 'dna':
        return <GolfDNA />;
      case 'activity':
        return <Activity />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: F.brand, color: C.ink }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=Playfair+Display:ital@1&display=swap" rel="stylesheet" />
      <style>{`
        .player-bottom-nav { display: flex !important; }
        .player-sidebar-nav { display: none !important; }
        @media (min-width: 1200px) {
          .player-bottom-nav { display: none !important; }
          .player-sidebar-nav { display: block !important; }
        }
      `}</style>
      <GlobalBar />
      <div style={{ display: 'flex' }}>
        <div className="player-sidebar-nav">
          <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div style={{ flex: 1, maxWidth: contentMaxWidth, margin: '0 auto', padding: isMobile ? '16px 16px 88px' : '24px 24px 24px' }}>
          {renderTab()}
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
