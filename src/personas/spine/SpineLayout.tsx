import { Outlet } from 'react-router-dom';
import { Database, Target, Plug } from 'lucide-react';
import DesktopShell from '../../components/layout/DesktopShell';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';

const navItems = [
  { label: 'Data Spine', icon: <Database className="w-4 h-4" />, path: '/spine' },
  { label: 'Audience Engine', icon: <Target className="w-4 h-4" />, path: '/spine/audience' },
  { label: 'Integration Hub', icon: <Plug className="w-4 h-4" />, path: '/spine/integrations' },
];

export default function SpineLayout() {
  return (
    <DesktopShell
      sidebar={
        <Sidebar
          brandLabel="Platform"
          navItems={navItems}
          dark
        />
      }
      topBar={
        <TopBar
          title="Platform Intelligence — Internal View"
          dark
        />
      }
    >
      <div className="bg-bg-dark p-6 min-h-full">
        <Outlet />
      </div>
    </DesktopShell>
  );
}
