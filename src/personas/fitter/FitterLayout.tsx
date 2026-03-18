import { Outlet } from 'react-router-dom';
import { Crosshair, Search, Briefcase, Settings, Sparkles } from 'lucide-react';
import DesktopShell from '../../components/layout/DesktopShell';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';

const navItems = [
  { label: 'Golfer Lookup', icon: <Search className="w-4 h-4" />, path: '/fitter' },
  { label: 'AI Brief', icon: <Sparkles className="w-4 h-4" />, path: '/fitter/brief' },
  { label: 'Fitting Session', icon: <Crosshair className="w-4 h-4" />, path: '/fitter/session' },
  { label: 'Equipment', icon: <Briefcase className="w-4 h-4" />, path: '/fitter/equipment' },
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/fitter/settings' },
];

const integrationStatus = [
  { name: 'Launch Monitor', connected: true },
];

export default function FitterLayout() {
  return (
    <div className="relative min-h-screen">
      <div className="ambient-bg" />
      <DesktopShell
        sidebar={
          <Sidebar
            brandLabel="Fitter"
            navItems={navItems}
            integrationStatus={integrationStatus}
          />
        }
        topBar={
          <TopBar
            searchPlaceholder="Search golfers, equipment..."
            userName="Pro Fitting Studio"
            dark
          />
        }
      >
        <div className="bg-transparent p-6 min-h-full animate-page-enter">
          <Outlet />
        </div>
      </DesktopShell>
    </div>
  );
}
