import { Search } from 'lucide-react';

interface TopBarProps {
  title?: string;
  searchPlaceholder?: string;
  userName?: string;
  dark?: boolean;
}

export default function TopBar({ title, searchPlaceholder, userName, dark }: TopBarProps) {
  const bgClass = dark ? 'bg-bg-dark border-border-dark' : 'bg-white border-gray-200';
  const textClass = dark ? 'text-white' : 'text-navy';
  const subtextClass = dark ? 'text-gray-400' : 'text-gray-500';
  const inputBgClass = dark ? 'bg-card-dark border-border-dark text-white placeholder:text-gray-500' : 'bg-gray-50 border-gray-200 text-navy placeholder:text-gray-400';

  return (
    <div className={`${bgClass} border-b px-6 py-3 flex items-center justify-between`}>
      <div className="flex items-center gap-4">
        {title && (
          <h1 className={`text-sm font-semibold ${textClass}`}>{title}</h1>
        )}
        {searchPlaceholder && (
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${subtextClass}`} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={`${inputBgClass} pl-9 pr-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-accent w-64`}
            />
          </div>
        )}
      </div>

      {userName && (
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${textClass}`}>{userName}</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-accent`}>
            {userName
              .split(/[\s,]+/)
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}
