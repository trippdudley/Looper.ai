import { Outlet } from 'react-router-dom';
import { Calendar, Users, Mic, BarChart3, Settings, Monitor } from 'lucide-react';
import DesktopShell from '../../components/layout/DesktopShell';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';

const navItems = [
  { label: 'Today', icon: <Calendar className="w-4 h-4" />, path: '/coach' },
  { label: 'Students', icon: <Users className="w-4 h-4" />, path: '/coach/students' },
  { label: 'Session Capture', icon: <Mic className="w-4 h-4" />, path: '/coach/capture' },
  { label: 'Session View', icon: <Monitor className="w-4 h-4" />, path: '/coach/session' },
  { label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, path: '/coach/analytics' },
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/coach/settings' },
];

const integrationStatus = [
  { name: 'Trackman', connected: true },
];

export default function CoachLayout() {
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
      <div className="bg-bg-light p-6 min-h-full">
        <Outlet />
      </div>
    </DesktopShell>
  );
}
