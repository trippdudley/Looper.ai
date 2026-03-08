import type { ReactNode } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="min-h-screen bg-bg-dark flex items-start justify-center py-8">
      <div className="w-[390px] h-[844px] bg-white rounded-[2.5rem] border-[4px] border-bg-dark shadow-2xl overflow-hidden flex flex-col relative">
        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-3 pb-1 bg-white">
          <span className="text-sm font-semibold text-black">9:41</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-4 h-4 text-black" />
            <Battery className="w-5 h-5 text-black" />
          </div>
        </div>
        {/* Content area */}
        <div className="flex-1 overflow-y-auto mobile-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
