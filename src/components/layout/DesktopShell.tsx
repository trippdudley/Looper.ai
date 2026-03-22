import { type ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface DesktopShellProps {
  sidebar: ReactNode;
  topBar: ReactNode;
  children: ReactNode;
}

export default function DesktopShell({ sidebar, topBar, children }: DesktopShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar — hidden below md */}
      <aside className="hidden md:block w-[240px] flex-shrink-0">{sidebar}</aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Sidebar panel */}
          <aside
            className="relative w-[280px] max-w-[85vw] h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex-shrink-0 flex items-center">
          {/* Hamburger — visible below md */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden ml-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">{topBar}</div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
