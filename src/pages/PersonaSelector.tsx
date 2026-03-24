import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Monitor,
  Smartphone,
  Database,
  Brain,
  TrendingUp,
  ArrowRight,
  ArrowDown,
  Play,
  FileText,
  BarChart3,
  User,
  GraduationCap,
  Route,
  CheckCircle,
  X,
  Camera,
  Mic,
  Video,
  MapPin,
  Heart,
  Layers,
} from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { useTypewriter } from '../hooks/useTypewriter';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';

/* ─── Hooks ────────────────────────────────────────────────── */

/** IntersectionObserver-based scroll reveal for multiple sections */
function useScrollReveal(count: number): (index: number) => (el: HTMLDivElement | null) => void {
  const refs = useRef<(HTMLDivElement | null)[]>(new Array(count).fill(null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 },
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      refs.current[index] = el;
    },
    [],
  );

  return setRef;
}

/** Returns [ref, isInView] — triggers once when element enters viewport */
function useInViewTrigger(threshold = 0.2): [React.RefCallback<HTMLDivElement>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      elRef.current = el;
    },
    [],
  );

  useEffect(() => {
    const el = elRef.current;
    if (!el || isInView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, isInView]);

  return [setRef, isInView];
}

/* ─── Data ─────────────────────────────────────────────────── */

const DATA_STREAM_ITEMS = [
  'Ball Speed 132.4',
  'Spin Rate 6,240',
  'Carry 172.3',
  'Confidence 78%',
  'Face-to-Path -2.1',
  'Launch 14.8',
  'Smash 1.48',
  'Spin Loft 22.4',
  'D-Plane OK',
  'Phase: Diagnosis',
  'Apex 31.2',
  'Descent 42.1',
  'Strike: Center',
  'Confidence 84%',
  'Dynamic Lie -0.8',
  'Club Path 1.2',
];

const BEFORE_ITEMS = [
  'Notes scattered across spreadsheets and texts',
  'No record of what worked or why',
  'Insights locked in one coach\'s head',
  'Player progress invisible between sessions',
];

const AFTER_ITEMS = [
  'Sessions capture themselves automatically',
  'Every intervention tracked and measured',
  'Intelligence compounds across the roster',
  'Players see their progress in real time',
];

const AGENTS = [
  { name: 'Vision', icon: Camera, source: 'Launch Monitor', desc: 'Reads ball flight and club data from any launch monitor screen' },
  { name: 'Audio', icon: Mic, source: 'Conversation', desc: 'Extracts coaching cues, drill names, and phase transitions' },
  { name: 'Video', icon: Video, source: 'Swing Cameras', desc: 'Processes DTL and face-on angles, maps positions P1\u2013P10' },
  { name: 'Rounds', icon: MapPin, source: 'Arccos', desc: 'Imports shot-level round data between sessions' },
  { name: 'Biometric', icon: Heart, source: 'WHOOP', desc: 'Correlates recovery, strain, and HRV with performance' },
];

const TIMELINE_PHASES = [
  {
    label: 'CATCH-UP',
    time: '~5 min',
    desc: 'AI surfaces context from the persistent record \u2014 last session summary, practice activity, player goals.',
    detail: 'Last session: Mar 14 \u2014 Strike consistency drill. Practice: 2 sessions logged.',
  },
  {
    label: 'DIAGNOSIS',
    time: '~15 min',
    desc: 'Processes incoming launch data and swing video, identifies patterns, flags limiting factors.',
    detail: 'confidence',
  },
  {
    label: 'INTERVENTION',
    time: '~20 min',
    desc: 'Catalogs drills and cues the coach selects, tracks response data, suggests alternatives.',
    detail: 'Brush the grass past the ball',
  },
  {
    label: 'REVIEW',
    time: '~5 min',
    desc: 'Assembles session summary, highlights what changed, drafts practice plan.',
    detail: 'Session delta: +2.1\u00b0 path improvement',
  },
];

const PROTOTYPES = [
  { label: 'Player', icon: Route, path: '/player' },
  { label: 'Coach', icon: GraduationCap, path: '/coach' },
];

/* ─── Sub-components ───────────────────────────────────────── */

/** Scrolling data stream in the hero */
function HeroDataStream(): React.JSX.Element {
  const doubled = [...DATA_STREAM_ITEMS, ...DATA_STREAM_ITEMS];
  return (
    <div className="relative max-w-2xl mx-auto mt-8 h-5 overflow-hidden hidden sm:block">
      {/* Gradient edge masks */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0C1117] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0C1117] to-transparent z-10" />
      <div className="animate-data-stream flex items-center gap-8 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="font-mono text-[10px] text-accent-bright/30 tracking-wider">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Animated confidence counter in hero */
function HeroConfidence(): React.JSX.Element {
  const value = useCountUp(94, 2400);
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <div className="w-2 h-2 rounded-full bg-accent-bright animate-ai-pulse" />
      <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Session Confidence</p>
      <p className="font-mono text-2xl text-accent-bright font-bold tabular-nums">
        {Math.round(value)}%
      </p>
    </div>
  );
}

/** Before/After comparison card */
function ComparisonCard({
  mode,
  items,
}: {
  mode: 'before' | 'after';
  items: string[];
}): React.JSX.Element {
  const isBefore = mode === 'before';
  return (
    <div
      className={`glass-card p-8 border-t-2 ${
        isBefore ? 'border-t-coral/50' : 'border-t-accent-bright/50'
      }`}
    >
      <p className={`font-display text-base font-semibold mb-5 ${isBefore ? 'text-gray-400' : 'text-white'}`}>
        {isBefore ? 'Today' : 'With Looper'}
      </p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            {isBefore ? (
              <X className="w-4 h-4 text-coral/60 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-4 h-4 text-accent-bright shrink-0 mt-0.5" />
            )}
            <span className={`text-sm leading-relaxed ${isBefore ? 'text-gray-500' : 'text-gray-300'}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Device mockup frame */
function DeviceFrame({
  type,
  children,
  className = '',
}: {
  type: 'laptop' | 'phone' | 'sidebar';
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  if (type === 'laptop') {
    return (
      <div className={`${className}`}>
        <div className="bg-gray-800 rounded-lg p-1.5 shadow-2xl border border-white/10">
          {/* Top bar dots */}
          <div className="flex items-center gap-1.5 px-2 pb-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <div className="rounded-md overflow-hidden bg-bg-light">{children}</div>
        </div>
        {/* Base */}
        <div className="w-1/3 h-2 bg-gray-800 rounded-b-lg mx-auto border-x border-b border-white/10" />
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div className={`phone-gradient-border ${className}`}>
        <div className="rounded-[44px] overflow-hidden bg-bg-light p-3">{children}</div>
      </div>
    );
  }

  // sidebar
  return (
    <div className={`bg-gray-900 rounded-lg border border-white/10 shadow-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/** Mock coach portal content for laptop frame */
function CoachPortalMock(): React.JSX.Element {
  return (
    <div className="h-[260px] sm:h-[300px] p-3 text-[10px]">
      {/* Nav bar */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <span className="font-display font-bold text-navy text-xs tracking-wide">
          LOOPER<span className="text-accent">.AI</span>
        </span>
        <div className="flex gap-2">
          <span className="text-gray-400">Today</span>
          <span className="text-gray-400">Students</span>
          <span className="text-gray-400">Analytics</span>
        </div>
      </div>
      {/* Content grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Schedule */}
        <div className="col-span-2 space-y-1.5">
          <p className="font-display font-semibold text-navy text-[11px] mb-2">Today's Sessions</p>
          {['Jake M. — 9:00 AM', 'Sarah K. — 10:30 AM', 'Tom R. — 1:00 PM'].map((s) => (
            <div key={s} className="flex items-center gap-2 p-1.5 bg-white rounded border border-gray-100">
              <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-3 h-3 text-accent" />
              </div>
              <span className="text-gray-600">{s}</span>
            </div>
          ))}
        </div>
        {/* Sparkline */}
        <div className="space-y-2">
          <p className="font-display font-semibold text-navy text-[11px] mb-2">Roster Trend</p>
          <div className="bg-white rounded border border-gray-100 p-2">
            <svg viewBox="0 0 80 32" className="w-full" fill="none">
              <polyline
                points="0,28 10,24 20,26 30,18 40,20 50,12 60,14 70,8 80,6"
                stroke="#0D7C66"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-mono text-accent font-bold text-[11px] mt-1">+12% avg</p>
          </div>
          <div className="bg-white rounded border border-gray-100 p-2 text-center">
            <p className="font-mono text-navy font-bold text-base">24</p>
            <p className="text-gray-400">active students</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mock lesson sidebar content */
function SidebarMock(): React.JSX.Element {
  return (
    <div className="h-[280px] sm:h-[320px] bg-bg-dark p-3 text-[10px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <span className="font-display font-bold text-white text-[11px] tracking-wide">
          LOOPER<span className="text-accent-bright">.AI</span>
        </span>
        <span className="font-mono text-accent-bright text-[9px]">LIVE</span>
      </div>
      {/* Phase */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-accent-bright animate-ai-pulse" />
        <span className="font-mono text-accent-bright text-[9px] uppercase tracking-wider">Diagnosis</span>
        <span className="font-mono text-gray-600 text-[9px] ml-auto">12:34</span>
      </div>
      {/* Confidence badge */}
      <div className="bg-accent-bright/10 rounded-md p-2 mb-3">
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Pattern Confidence</p>
        <p className="font-mono text-xl text-accent-bright font-bold">72%</p>
      </div>
      {/* Insight card */}
      <div className="border-l-2 border-accent-bright bg-white/5 rounded-r-md p-2 mb-3">
        <p className="text-gray-300 text-[10px] leading-relaxed">
          Face angle trending 2.1 open at impact. Correlates with grip pressure pattern from audio.
        </p>
      </div>
      {/* Data row */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ['Speed', '132.4'],
          ['Spin', '6,240'],
          ['Carry', '172'],
        ].map(([label, val]) => (
          <div key={label} className="bg-white/5 rounded p-1.5 text-center">
            <p className="font-mono text-[8px] text-gray-500">{label}</p>
            <p className="font-mono text-[11px] text-white font-bold">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mock player app content */
function PlayerMock(): React.JSX.Element {
  return (
    <div className="h-[260px] sm:h-[300px] text-[10px]">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] text-gray-400">9:41</span>
        <span className="font-display font-bold text-navy text-[11px]">
          LOOPER<span className="text-accent">.AI</span>
        </span>
        <div className="w-6" />
      </div>
      {/* Welcome */}
      <p className="font-display text-navy text-xs font-semibold mb-2">Hi Jake</p>
      {/* Timeline */}
      <div className="space-y-2">
        {[
          { date: 'Mar 21', title: 'Lesson with Coach Mike', tag: 'Path improved +2.1\u00b0' },
          { date: 'Mar 19', title: 'Practice Session', tag: '47 balls, strike focus' },
          { date: 'Mar 16', title: 'Round at Bethpage', tag: '82 \u2014 3 over career best' },
        ].map((e) => (
          <div key={e.date} className="bg-white rounded-lg border border-gray-100 p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-gray-400">{e.date}</span>
            </div>
            <p className="text-navy font-medium text-[10px]">{e.title}</p>
            <p className="text-accent font-mono text-[9px] mt-0.5">{e.tag}</p>
          </div>
        ))}
      </div>
      {/* Ask Looper */}
      <div className="mt-2 bg-accent/10 rounded-full px-3 py-1.5 flex items-center gap-2">
        <Brain className="w-3 h-3 text-accent" />
        <span className="text-gray-400 text-[10px]">Ask Looper anything...</span>
      </div>
    </div>
  );
}

/** Enhanced flywheel phase card */
function FlywheelPhase({
  icon,
  label,
  sublabel,
  children,
  pulse = false,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  children?: React.ReactNode;
  pulse?: boolean;
}): React.JSX.Element {
  return (
    <div className="glass-card p-6 flex-1 min-w-0">
      <div
        className={`w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 ${
          pulse ? 'animate-ai-pulse' : ''
        }`}
      >
        {icon}
      </div>
      <p className="font-display text-base font-semibold text-white text-center">{label}</p>
      <p className="text-xs text-gray-500 mt-1 text-center">{sublabel}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/** Mini data table for the Record flywheel phase */
function MiniDataTable({ active }: { active: boolean }): React.JSX.Element {
  const speed = useCountUp(132.4, 1800, active);
  const spin = useCountUp(6240, 1800, active);
  const carry = useCountUp(172, 1800, active);

  const rows = [
    { label: 'Ball Speed', value: speed.toFixed(1) },
    { label: 'Spin Rate', value: Math.round(spin).toLocaleString() },
    { label: 'Carry', value: Math.round(carry).toString() },
  ];

  return (
    <div className="space-y-1">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-2 py-1 bg-white/5 rounded">
          <span className="font-mono text-[10px] text-gray-500">{r.label}</span>
          <span className="font-mono text-[11px] text-accent-bright font-bold tabular-nums">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/** AI reasoning text for the Intelligence flywheel phase */
function MiniInsight({ active }: { active: boolean }): React.JSX.Element {
  const { displayText, isDone } = useTypewriter(
    'Face angle trending open. Correlating with grip pressure...',
    30,
    active ? 600 : 99999,
  );

  return (
    <div className="border-l-2 border-accent-bright bg-accent/5 p-2 rounded-r-md">
      <p className="font-mono text-[10px] text-gray-300 leading-relaxed">
        {displayText}
        {!isDone && <span className="animate-blink text-accent-bright ml-0.5">|</span>}
      </p>
    </div>
  );
}

/** Mini sparkline for the Compounding flywheel phase */
function MiniSparkline(): React.JSX.Element {
  return (
    <svg viewBox="0 0 120 40" className="w-full" fill="none">
      <polyline
        points="0,36 15,32 30,34 45,26 60,28 75,18 90,14 105,8 120,4"
        stroke="rgba(15,168,122,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="0,36 15,32 30,34 45,26 60,28 75,18 90,14 105,8 120,4"
        stroke="url(#spark-grad)"
        strokeWidth="0"
        fill="url(#spark-fill)"
        opacity="0.15"
      />
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0FA87A" />
          <stop offset="100%" stopColor="#0FA87A" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Single timeline phase node */
function TimelinePhaseNode({
  phase,
  index,
  isVisible,
  isActive,
}: {
  phase: typeof TIMELINE_PHASES[0];
  index: number;
  isVisible: boolean;
  isActive: boolean;
}): React.JSX.Element {
  const confValue = useCountUp(72, 2000, isActive && phase.detail === 'confidence');

  return (
    <div
      className={`relative pl-14 pb-10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Dot on the timeline line */}
      <div
        className={`absolute left-[22px] top-1 w-3 h-3 rounded-full border-2 transition-colors duration-500 ${
          isActive
            ? 'bg-accent-bright border-accent-bright animate-ai-pulse'
            : isVisible
            ? 'bg-accent/30 border-accent/50'
            : 'bg-white/10 border-white/10'
        }`}
      />

      {/* Card */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent-bright">
            {phase.label}
          </span>
          <span className="font-mono text-[10px] text-gray-600">{phase.time}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{phase.desc}</p>

        {/* Phase-specific detail */}
        <div className="mt-3">
          {index === 0 && (
            <div className="bg-white/5 rounded p-2">
              <p className="font-mono text-[10px] text-gray-400 leading-relaxed">{phase.detail}</p>
            </div>
          )}
          {index === 1 && (
            <div className="bg-accent-bright/10 rounded p-2 flex items-center gap-3">
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                Pattern confidence
              </p>
              <p className="font-mono text-lg text-accent-bright font-bold tabular-nums">
                {Math.round(confValue)}%
              </p>
            </div>
          )}
          {index === 2 && (
            <span className="inline-block bg-white/5 rounded px-2 py-1 font-mono text-[11px] text-accent-bright">
              {phase.detail}
            </span>
          )}
          {index === 3 && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-accent-bright" />
              <span className="font-mono text-[11px] text-gray-300">{phase.detail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated 4-phase lesson timeline */
function LiveTimelineDemo(): React.JSX.Element {
  const [triggerRef, isInView] = useInViewTrigger(0.15);
  const visible = useStaggeredReveal(isInView ? 4 : 0, 2000, 500);

  return (
    <div ref={triggerRef} className="max-w-2xl mx-auto relative">
      {/* Timeline line */}
      <div className="absolute left-7 top-0 bottom-0 w-px bg-white/10" />
      {/* Progress overlay */}
      <div
        className="absolute left-7 top-0 w-px bg-accent-bright transition-all duration-1000 ease-out"
        style={{ height: `${(visible / 4) * 100}%` }}
      />

      {TIMELINE_PHASES.map((phase, i) => (
        <TimelinePhaseNode
          key={phase.label}
          phase={phase}
          index={i}
          isVisible={i < visible}
          isActive={i === visible - 1}
        />
      ))}
    </div>
  );
}

/** Stat card with animated counter */
function StatCard({
  end,
  suffix,
  label,
  active,
}: {
  end: number;
  suffix?: string;
  label: string;
  active: boolean;
}): React.JSX.Element {
  const value = useCountUp(end, 1600, active);
  return (
    <div className="glass-card p-8 text-center">
      <p className="font-mono text-4xl sm:text-5xl font-bold text-accent-bright tabular-nums">
        {end === 0 ? '0' : Math.round(value).toLocaleString()}
        {suffix && <span className="text-2xl sm:text-3xl ml-1">{suffix}</span>}
      </p>
      <p className="font-display text-sm text-gray-400 mt-3">{label}</p>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

/** Investor-facing landing page for Looper.AI */
export default function PersonaSelector(): React.JSX.Element {
  const setRef = useScrollReveal(9);
  const [flywheelRef, flywheelInView] = useInViewTrigger(0.2);
  const [metricsRef, metricsInView] = useInViewTrigger(0.2);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="ambient-bg" />

      <div className="relative z-10">
        {/* ── Section 1: Hero ──────────────────────────────── */}
        <section
          ref={setRef(0)}
          className="fade-in-up min-h-screen flex flex-col items-center justify-center text-center px-6 relative"
        >
          {/* Atmospheric SVG background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="sim-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(13,124,102,0.12)" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="40%" stopColor="white" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </linearGradient>
                <mask id="grid-mask">
                  <rect width="1200" height="800" fill="url(#grid-fade)" />
                </mask>
                <filter id="contour-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="1200" height="800" fill="url(#sim-grid)" mask="url(#grid-mask)" />
              <g opacity="0.08" stroke="rgba(15,168,122,1)" strokeWidth="0.5">
                <line x1="600" y1="300" x2="0" y2="800" />
                <line x1="600" y1="300" x2="200" y2="800" />
                <line x1="600" y1="300" x2="400" y2="800" />
                <line x1="600" y1="300" x2="600" y2="800" />
                <line x1="600" y1="300" x2="800" y2="800" />
                <line x1="600" y1="300" x2="1000" y2="800" />
                <line x1="600" y1="300" x2="1200" y2="800" />
              </g>
              <g fill="none" strokeWidth="0.6">
                <path d="M -100 500 Q 200 420 400 460 Q 600 500 800 440 Q 1000 380 1300 430" stroke="rgba(13,124,102,0.14)" />
                <path d="M -100 540 Q 250 470 450 510 Q 650 550 850 480 Q 1050 410 1300 470" stroke="rgba(13,124,102,0.11)" />
                <path d="M -100 580 Q 300 520 500 560 Q 700 600 900 530 Q 1100 460 1300 520" stroke="rgba(13,124,102,0.09)" />
                <path d="M -100 620 Q 200 570 450 600 Q 700 640 900 580 Q 1100 520 1300 560" stroke="rgba(13,124,102,0.07)" />
                <path d="M -100 660 Q 250 620 500 650 Q 750 680 950 630 Q 1150 580 1300 610" stroke="rgba(13,124,102,0.05)" />
              </g>
              <path
                d="M -100 470 Q 200 390 400 430 Q 600 470 800 400 Q 1000 340 1300 390"
                fill="none"
                stroke="rgba(15,168,122,0.18)"
                strokeWidth="1.2"
                filter="url(#contour-glow)"
              />
            </svg>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tight">
            LOOPER<span className="text-accent-bright">.AI</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-accent-bright font-medium mt-5">
            Expertise, engineered.
          </p>
          <p className="text-lg text-gray-400 mt-3 max-w-lg mx-auto leading-relaxed">
            The intelligence layer for golf coaching. One record. One copilot.
            Compounding insight.
          </p>

          <HeroDataStream />
          <HeroConfidence />

          <div className="absolute bottom-10 animate-bounce text-gray-600">
            <ChevronDown className="w-5 h-5" />
          </div>
        </section>

        {/* ── Section 2: The Gap ───────────────────────────── */}
        <section ref={setRef(1)} className="fade-in-up py-24 sm:py-32 px-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-10">
            The Gap
          </p>
          <p className="font-display text-2xl sm:text-3xl text-white font-medium leading-snug max-w-2xl mx-auto text-center">
            Every coach carries years of knowledge. None of it{' '}
            <span className="font-['Instrument_Serif'] italic text-accent-bright">
              compounds
            </span>
            . Sessions vanish. Patterns go unnoticed. The best coaching
            intelligence stays locked in one person&apos;s memory.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto">
            <ComparisonCard mode="before" items={BEFORE_ITEMS} />
            <ComparisonCard mode="after" items={AFTER_ITEMS} />
          </div>
        </section>

        {/* ── Section 3: Product Showcase ──────────────────── */}
        <section ref={setRef(2)} className="fade-in-up py-24 sm:py-32 px-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-4">
            The Product
          </p>
          <p className="font-['Instrument_Serif'] italic text-accent-bright text-lg text-center mb-16">
            One intelligence, two experiences.
          </p>

          {/* Desktop: overlapping composition */}
          <div className="hidden lg:block max-w-5xl mx-auto relative h-[420px]">
            {/* Laptop — center */}
            <DeviceFrame
              type="laptop"
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[680px] animate-float z-10"
            >
              <CoachPortalMock />
            </DeviceFrame>

            {/* Sidebar — right, overlapping */}
            <DeviceFrame
              type="sidebar"
              className="absolute right-0 top-8 w-[220px] animate-float z-20"
              // slight delay via inline style for parallax
            >
              <SidebarMock />
            </DeviceFrame>

            {/* Phone — left, overlapping */}
            <DeviceFrame
              type="phone"
              className="absolute left-0 top-12 w-[180px] animate-float z-20"
            >
              <PlayerMock />
            </DeviceFrame>
          </div>

          {/* Labels under desktop layout */}
          <div className="hidden lg:flex justify-between max-w-5xl mx-auto mt-8 px-8">
            <div className="text-center w-[180px]">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Player App</p>
              </div>
              <p className="text-xs text-gray-500">Mobile-first, 480px</p>
            </div>
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Monitor className="w-3.5 h-3.5 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Coach Portal</p>
              </div>
              <p className="text-xs text-gray-500">Desktop command center</p>
            </div>
            <div className="text-center w-[220px]">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Brain className="w-3.5 h-3.5 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Lesson Sidebar</p>
              </div>
              <p className="text-xs text-gray-500">420-480px, dark mode</p>
            </div>
          </div>

          {/* Tablet & mobile: vertical stack */}
          <div className="lg:hidden space-y-8 max-w-sm mx-auto">
            <div>
              <DeviceFrame type="laptop" className="animate-float">
                <CoachPortalMock />
              </DeviceFrame>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Monitor className="w-3.5 h-3.5 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Coach Portal</p>
              </div>
            </div>
            <div>
              <DeviceFrame type="sidebar" className="mx-auto w-[280px] animate-float">
                <SidebarMock />
              </DeviceFrame>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Brain className="w-3.5 h-3.5 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Lesson Sidebar</p>
              </div>
            </div>
            <div>
              <DeviceFrame type="phone" className="mx-auto w-[200px] animate-float">
                <PlayerMock />
              </DeviceFrame>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Smartphone className="w-3.5 h-3.5 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Player App</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: How It Works ─────────────────────── */}
        <section ref={setRef(3)} className="fade-in-up py-24 sm:py-32 px-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-10">
            How It Works
          </p>

          <div ref={flywheelRef} className="max-w-4xl mx-auto">
            {/* Desktop: horizontal */}
            <div className="hidden sm:flex items-stretch gap-4">
              <FlywheelPhase
                icon={<Database className="w-5 h-5 text-accent-bright" />}
                label="Record"
                sublabel="Sessions build themselves"
              >
                <MiniDataTable active={flywheelInView} />
              </FlywheelPhase>

              <div className="flex items-center shrink-0">
                <ArrowRight className="w-5 h-5 text-accent-bright/50" />
              </div>

              <FlywheelPhase
                icon={<Brain className="w-5 h-5 text-accent-bright" />}
                label="Intelligence"
                sublabel="AI reasons in real time"
                pulse
              >
                <MiniInsight active={flywheelInView} />
              </FlywheelPhase>

              <div className="flex items-center shrink-0">
                <ArrowRight className="w-5 h-5 text-accent-bright/50" />
              </div>

              <FlywheelPhase
                icon={<TrendingUp className="w-5 h-5 text-accent-bright" />}
                label="Compounding Insight"
                sublabel="Every correction trains the model"
              >
                <MiniSparkline />
              </FlywheelPhase>
            </div>

            {/* Mobile: vertical */}
            <div className="flex sm:hidden flex-col items-center gap-3">
              <FlywheelPhase
                icon={<Database className="w-5 h-5 text-accent-bright" />}
                label="Record"
                sublabel="Sessions build themselves"
              >
                <MiniDataTable active={flywheelInView} />
              </FlywheelPhase>
              <ArrowDown className="w-4 h-4 text-accent-bright/50" />
              <FlywheelPhase
                icon={<Brain className="w-5 h-5 text-accent-bright" />}
                label="Intelligence"
                sublabel="AI reasons in real time"
                pulse
              >
                <MiniInsight active={flywheelInView} />
              </FlywheelPhase>
              <ArrowDown className="w-4 h-4 text-accent-bright/50" />
              <FlywheelPhase
                icon={<TrendingUp className="w-5 h-5 text-accent-bright" />}
                label="Compounding Insight"
                sublabel="Every correction trains the model"
              >
                <MiniSparkline />
              </FlywheelPhase>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-10 text-center font-mono">
            A dataset company that starts as a platform.
          </p>
        </section>

        {/* ── Section 5: Live Lesson Timeline ─────────────── */}
        <section ref={setRef(4)} className="fade-in-up py-24 sm:py-32 px-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-4">
            The Live Lesson
          </p>
          <p className="font-display text-xl sm:text-2xl text-white font-medium text-center max-w-xl mx-auto mb-16 leading-snug">
            Four phases. Zero manual input. The AI watches, reasons, and assists
            in real time.
          </p>

          <LiveTimelineDemo />
        </section>

        {/* ── Section 6: Ambient Capture ──────────────────── */}
        <section ref={setRef(5)} className="fade-in-up py-24 sm:py-32 px-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-4">
            Ambient Capture
          </p>
          <p className="font-display text-xl sm:text-2xl text-white font-medium text-center max-w-lg mx-auto mb-12 leading-snug">
            The record builds itself. Five agents, zero manual entry.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {AGENTS.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.name}
                  className="glass-card p-5 text-center animate-stagger-in"
                  style={{ animationDelay: `${200 + i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-accent-bright" />
                  </div>
                  <p className="font-display text-sm font-semibold text-white">{agent.name}</p>
                  <p className="font-mono text-[10px] text-gray-500 mt-1">{agent.source}</p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{agent.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 7: Key Metrics ──────────────────────── */}
        <section ref={setRef(6)} className="fade-in-up py-24 sm:py-32 px-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-10">
            By The Numbers
          </p>

          <div ref={metricsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <StatCard end={30} suffix="sec" label="Post-session review" active={metricsInView} />
            <StatCard end={0} label="Manual data entry points" active={metricsInView} />
            <div className="glass-card p-8 text-center">
              <p className="font-mono text-4xl sm:text-5xl font-bold text-accent-bright tabular-nums">
                12,000<span className="text-2xl sm:text-3xl">+</span>
              </p>
              <p className="font-display text-sm text-gray-400 mt-3">Data points per lesson</p>
            </div>
          </div>
        </section>

        {/* ── Section 8: See It Live ──────────────────────── */}
        <section ref={setRef(7)} className="fade-in-up py-24 sm:py-32 px-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-10">
            See It Live
          </p>

          {/* Sizzle reel */}
          <Link
            to="/vision"
            className="glass-card border-l-2 border-l-accent-bright flex items-center justify-between p-6 max-w-2xl mx-auto mb-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </div>
              <div>
                <p className="font-display text-[15px] font-semibold text-white">
                  Watch the 90-Second Vision
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  Product walkthrough from record to insight
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 shrink-0" />
          </Link>

          {/* Documents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-4">
            <Link to="/narrative" className="glass-card p-6 block">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-4 h-4 text-accent-bright" />
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold">
                  The Narrative
                </p>
              </div>
              <p className="text-white font-medium text-[15px]">Read the Full Story</p>
              <p className="text-sm text-gray-400 mt-1">
                Thesis, problem, solution, flywheel, and roadmap
              </p>
            </Link>

            <Link to="/thesis" className="glass-card p-6 block">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-4 h-4 text-accent-bright" />
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold">
                  The Business Case
                </p>
              </div>
              <p className="text-white font-medium text-[15px]">Read the Thesis</p>
              <p className="text-sm text-gray-400 mt-1">
                Five-year model, moat analysis, and market sizing
              </p>
            </Link>

            <Link to="/evolution" className="glass-card p-6 block">
              <div className="flex items-center gap-3 mb-2">
                <Layers className="w-4 h-4 text-accent-bright" />
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold">
                  Product Evolution
                </p>
              </div>
              <p className="text-white font-medium text-[15px]">See the Roadmap</p>
              <p className="text-sm text-gray-400 mt-1">
                Four stages from record to intelligence
              </p>
            </Link>
          </div>

          {/* Prototypes */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {PROTOTYPES.map((p, i) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.path}
                  to={p.path}
                  className="glass-card p-4 text-center block animate-stagger-in"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-accent-bright" />
                  </div>
                  <p className="text-sm text-white font-medium">{p.label}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Section 9: Footer ───────────────────────────── */}
        <footer ref={setRef(8)} className="fade-in-up py-12 px-6 text-center">
          <p className="text-xs text-gray-600">
            Confidential &mdash; Looper.AI &mdash; March 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
