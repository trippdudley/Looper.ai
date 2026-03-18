import { Outlet, useLocation } from 'react-router-dom';
import { Calendar, Users, Radio, ClipboardCheck, BarChart3, Settings } from 'lucide-react';
import DesktopShell from '../../components/layout/DesktopShell';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';

const navItems = [
  { label: 'Today', icon: <Calendar className="w-4 h-4" />, path: '/coach' },
  { label: 'Students', icon: <Users className="w-4 h-4" />, path: '/coach/students' },
  { label: 'Live Session', icon: <Radio className="w-4 h-4" />, path: '/coach/live' },
  { label: 'Review', icon: <ClipboardCheck className="w-4 h-4" />, path: '/coach/review' },
  { label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, path: '/coach/analytics' },
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/coach/settings' },
];

const integrationStatus = [
  { name: 'Trackman', connected: true },
];

export default function CoachLayout() {
  const location = useLocation();
  const isLive = location.pathname.startsWith('/coach/live');

  // Immersive mode: CoachingOS has its own L1/L2/L3 chrome — render full-bleed
  if (isLive) {
    return <Outlet />;
  }

  return (
    <DesktopShell
      sidebar={
        <Sidebar
          brandLabel="Coach"
          navItems={navItems}
          integrationStatus={integrationStatus}
        />
      }
      topBar={
        <TopBar
          searchPlaceholder="Search students, sessions..."
          userName="Austin Reed, PGA"
        />
      }
    >
      <div className="bg-bg-light p-6 min-h-full animate-page-enter">
        <Outlet />
      </div>
    </DesktopShell>
  );
}
