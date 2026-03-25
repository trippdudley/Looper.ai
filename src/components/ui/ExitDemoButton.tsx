import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface ExitDemoButtonProps {
  variant?: 'dark' | 'light';
}

/**
 * Floating button in the top-right corner that returns users to the landing page.
 * Subtle and unobtrusive — not part of the demo chrome itself.
 */
export default function ExitDemoButton({ variant = 'dark' }: ExitDemoButtonProps): React.JSX.Element {
  const isDark = variant === 'dark';

  return (
    <Link
      to="/"
      title="Back to Looper.AI"
      className="fixed top-3 right-3 z-[9999] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 opacity-40 hover:opacity-100 backdrop-blur-sm"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <X className="w-3 h-3" />
      <span>Exit Demo</span>
    </Link>
  );
}
