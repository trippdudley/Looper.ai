import type { ReactNode } from 'react';

interface DesktopShellProps {
  sidebar: ReactNode;
  topBar: ReactNode;
  children: ReactNode;
}

export default function DesktopShell({ sidebar, topBar, children }: DesktopShellProps) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-[220px] flex-shrink-0">{sidebar}</aside>
      <div className="flex-1 flex flex-col">
        <header>{topBar}</header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
