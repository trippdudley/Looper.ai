import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { House, BookOpen, TrendingUp, Target, Bell, X, MessageSquare } from 'lucide-react';
import MobileShell from '../../components/layout/MobileShell';
import BottomTabBar from '../../components/layout/BottomTabBar';
import PageTransition from '../../components/ui/PageTransition';

const tabs = [
  { label: 'Home', icon: <House className="w-5 h-5" />, path: '/golfer' },
  { label: 'Lessons', icon: <BookOpen className="w-5 h-5" />, path: '/golfer/lessons' },
  { label: 'My Swing', icon: <TrendingUp className="w-5 h-5" />, path: '/golfer/swing' },
  { label: 'Practice', icon: <Target className="w-5 h-5" />, path: '/golfer/practice' },
];

export default function GolferLayout() {
  const [showNotification, setShowNotification] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);

  // Show a mock push notification after 3 seconds
  useEffect(() => {
    if (notifDismissed) return;
    const t = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(t);
  }, [notifDismissed]);

  return (
    <MobileShell>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3">
        <Link to="/" className="text-xl font-bold text-accent-light tracking-tight">Looper.AI</Link>
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-500" />
          {showNotification && !notifDismissed && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-coral rounded-full" />
          )}
        </div>
      </div>

      {/* Mock push notification */}
      {showNotification && !notifDismissed && (
        <div className="mx-4 mb-2 animate-slide-in-right">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-navy">Coach Austin added notes</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                "Great session today — your strike consistency improved 68%. Keep working on the ground-pressure drill."
              </p>
            </div>
            <button
              onClick={() => setNotifDismissed(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
      {/* Bottom tabs */}
      <BottomTabBar tabs={tabs} />
    </MobileShell>
  );
}
