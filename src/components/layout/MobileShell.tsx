import type { ReactNode } from 'react';

interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  return (
    <>
      {/* Real mobile: full-screen white app, no phone frame */}
      <div className="md:hidden min-h-screen bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto mobile-scroll">
          {children}
        </div>
      </div>

      {/* Desktop: decorative iPhone frame for demo viewing */}
      <div className="hidden md:flex min-h-screen bg-bg-dark items-start justify-center py-8">
        <div className="ambient-bg" />
        <div className="phone-gradient-border">
          <div className="w-[390px] h-[844px] bg-white rounded-[44px] overflow-hidden flex flex-col relative">
            {/* iOS Status bar - 44px tall */}
            <div className="flex items-center justify-between px-8 h-[44px] flex-shrink-0 bg-white">
              <span className="text-sm font-semibold text-black">9:41</span>
              <div className="flex items-center gap-1.5">
                {/* Signal bars */}
                <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="9" width="3" height="3" rx="0.5" fill="black" />
                  <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="black" />
                  <rect x="9" y="3" width="3" height="9" rx="0.5" fill="black" />
                  <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="black" />
                </svg>
                {/* WiFi */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="black" />
                  <path d="M4.94 7.94a4.5 4.5 0 016.12 0" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M2.1 5.1a8 8 0 0111.8 0" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {/* Battery */}
                <svg width="27" height="13" viewBox="0 0 27 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="black" strokeOpacity="0.35" />
                  <rect x="2" y="2" width="19" height="9" rx="1.5" fill="black" />
                  <path d="M24 4.5v4a2 2 0 000-4z" fill="black" fillOpacity="0.4" />
                </svg>
              </div>
            </div>
            {/* Content area */}
            <div className="flex-1 overflow-y-auto mobile-scroll">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
