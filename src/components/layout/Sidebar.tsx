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
  dark?: boolean;
}

export default function Sidebar({ brandLabel, navItems, integrationStatus, dark }: SidebarProps) {
  const location = useLocation();

  const bgClass = dark ? 'bg-bg-dark' : 'bg-navy';

  return (
    <div className={`${bgClass} h-full flex flex-col text-white`}>
      {/* Brand */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-accent-light">Looper</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent/20 text-accent-light px-2 py-0.5 rounded-full">
            {brandLabel}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-2 border-accent-light text-white bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
