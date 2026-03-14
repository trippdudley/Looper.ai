import { Outlet, Link } from 'react-router-dom';
import { House, BookOpen, TrendingUp, Target, Bell } from 'lucide-react';
import MobileShell from '../../components/layout/MobileShell';
import BottomTabBar from '../../components/layout/BottomTabBar';

const tabs = [
  { label: 'Home', icon: <House className="w-5 h-5" />, path: '/golfer' },
  { label: 'Lessons', icon: <BookOpen className="w-5 h-5" />, path: '/golfer/lessons' },
  { label: 'My Swing', icon: <TrendingUp className="w-5 h-5" />, path: '/golfer/swing' },
  { label: 'Practice', icon: <Target className="w-5 h-5" />, path: '/golfer/practice' },
];

export default function GolferLayout() {
  return (
    <MobileShell>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3">
        <Link to="/" className="text-xl font-bold text-accent-light tracking-tight">Looper.AI</Link>
        <Bell className="w-5 h-5 text-gray-500" />
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <Outlet />
      </div>
      {/* Bottom tabs */}
      <BottomTabBar tabs={tabs} />
    </MobileShell>
  );
}
