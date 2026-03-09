import type { ReactNode, ReactElement } from 'react';
import { cloneElement, isValidElement } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Tab {
  label: string;
  icon: ReactNode;
  path: string;
}

interface BottomTabBarProps {
  tabs: Tab[];
}

export default function BottomTabBar({ tabs }: BottomTabBarProps) {
  const location = useLocation();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[80px] px-2 pb-5 pt-2">
      <div className="flex items-center justify-around h-full">
        {tabs.map((tab) => {
          const isActive =
            tab.path === '/golfer'
              ? location.pathname === '/golfer' || location.pathname === '/golfer/'
              : location.pathname.startsWith(tab.path);

          const iconWithColor = isValidElement(tab.icon)
            ? cloneElement(tab.icon as ReactElement<{ className?: string }>, {
                className: `w-5 h-5 ${isActive ? 'text-accent' : 'text-gray-400'}`,
              })
            : tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center gap-0.5 min-w-[60px]"
            >
              {iconWithColor}
              {isActive && (
                <span className="text-[10px] font-semibold text-accent">{tab.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
