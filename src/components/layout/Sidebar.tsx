import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

interface IntegrationStatus {
  name: string;
  connected: boolean;
}

interface SidebarProps {
  brandLabel: string;
  navItems: NavItem[];
  integrationStatus?: IntegrationStatus[];
}

export default function Sidebar({ brandLabel, navItems, integrationStatus }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="glass-sidebar h-full flex flex-col text-white">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-accent-light">Looper.AI</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent/20 text-accent-light px-2 py-0.5 rounded-full">
            {brandLabel}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          // Index routes (e.g. /fitter, /coach, /spine) match only on exact path
          // Sub-routes (e.g. /fitter/session) match on exact or prefix
          const isIndex = item.path === navItems[0]?.path;
          const isActive = isIndex
            ? location.pathname === item.path || location.pathname === item.path + '/'
            : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 h-[44px] rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-[2px] border-accent-light text-white bg-accent/[0.08] pl-[13px]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06] pl-4'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Integration Status */}
      {integrationStatus && integrationStatus.length > 0 && (
        <div className="px-5 pb-5 pt-3 border-t border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            Integrations
          </span>
          <div className="mt-2 space-y-2">
            {integrationStatus.map((integration) => (
              <div key={integration.name} className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    integration.connected ? 'bg-accent-light' : 'bg-gray-500'
                  }`}
                />
                <span className="text-gray-300">{integration.name}</span>
                <span className={`ml-auto ${integration.connected ? 'text-accent-light' : 'text-gray-500'}`}>
                  {integration.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
