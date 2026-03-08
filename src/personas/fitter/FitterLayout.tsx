import { Outlet } from 'react-router-dom';
import { Crosshair, Search, Briefcase, Settings } from 'lucide-react';
import DesktopShell from '../../components/layout/DesktopShell';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';

const navItems = [
  { label: 'Golfer Lookup', icon: <Search className="w-4 h-4" />, path: '/fitter' },
  { label: 'Fitting Session', icon: <Crosshair className="w-4 h-4" />, path: '/fitter/session' },
  { label: 'Equipment', icon: <Briefcase className="w-4 h-4" />, path: '/fitter/equipment' },
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/fitter/settings' },
];

const integrationStatus = [
  { name: 'Launch Monitor', connected: true },
];

export default function FitterLayout() {
  return (
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
        />
      }
    >
      <div className="bg-bg-light p-6 min-h-full">
        <Outlet />
      </div>
    </DesktopShell>
  );
}
