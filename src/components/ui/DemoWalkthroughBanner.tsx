import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

interface Step {
  label: string;
  path: string;
  persona: string;
}

const DEMO_STEPS: Step[] = [
  { label: 'Coach captures a session', path: '/coach/live', persona: 'Coach' },
  { label: 'Golfer reviews their lesson', path: '/golfer/lessons/session-1', persona: 'Golfer' },
  { label: 'Fitter gets AI-powered brief', path: '/fitter/brief', persona: 'Fitter' },
  { label: 'Explore the Data Spine', path: '/spine', persona: 'Platform' },
];

export default function DemoWalkthroughBanner({ currentPath }: { currentPath: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const currentIdx = DEMO_STEPS.findIndex(s => currentPath.startsWith(s.path.split('/').slice(0, 2).join('/')));
  const nextStep = DEMO_STEPS[currentIdx + 1];

  if (!nextStep) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-navy/95 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 shadow-2xl animate-page-enter">
      <div className="text-xs text-gray-400">
        Demo Step {currentIdx + 2}/{DEMO_STEPS.length}
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
