import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

interface Step {
  label: string;
  path: string;
  persona: string;
}

const DEMO_STEPS: Step[] = [
  { label: 'Coach reviews their schedule', path: '/coach', persona: 'Coach' },
  { label: 'Coach gets a player brief', path: '/coach/brief/golfer-james', persona: 'Coach' },
  { label: 'Coach runs a live session', path: '/coach/live', persona: 'Coach' },
  { label: 'Golfer reviews their lesson', path: '/golfer/lessons/session-1', persona: 'Golfer' },
  { label: 'Explore the Data Spine', path: '/spine', persona: 'Platform' },
];

// Match current path to the most specific demo step (longest match first)
function findCurrentStep(currentPath: string): number {
  // Try exact match first, then startsWith for parameterized routes
  // Sort by path length descending so /coach/live matches before /coach
  const ranked = DEMO_STEPS
    .map((s, i) => ({ idx: i, path: s.path }))
    .sort((a, b) => b.path.length - a.path.length);

  for (const { idx, path } of ranked) {
    if (currentPath === path || currentPath.startsWith(path + '/') ||
        // Match /coach/brief/:id to /coach/brief/golfer-james
        (path.includes('/brief/') && currentPath.startsWith('/coach/brief/'))) {
      return idx;
    }
  }
  return -1;
}

export default function DemoWalkthroughBanner({ currentPath }: { currentPath: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const currentIdx = findCurrentStep(currentPath);
  const nextStep = DEMO_STEPS[currentIdx + 1];

  if (currentIdx < 0 || !nextStep) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-navy/95 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 shadow-2xl animate-page-enter">
      <div className="text-xs text-gray-400">
        Demo Step {currentIdx + 1}/{DEMO_STEPS.length}
      </div>
      <Link
        to={nextStep.path}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent-light hover:text-white transition-colors"
      >
        Next: {nextStep.label}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="text-gray-500 hover:text-gray-300 transition-colors ml-2"
        aria-label="Dismiss walkthrough"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
