import { useEffect, useRef, useCallback } from 'react';
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
  Wrench,
  Route,
} from 'lucide-react';

/** Hook: IntersectionObserver-based scroll reveal for multiple sections */
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
      { threshold: 0.1 }
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
    []
  );

  return setRef;
}

const prototypes = [
  { label: 'Player', icon: Route, path: '/player' },
  { label: 'Golfer', icon: User, path: '/golfer' },
  { label: 'Coach', icon: GraduationCap, path: '/coach' },
  { label: 'Fitter', icon: Wrench, path: '/fitter' },
];

/** Investor-facing landing page for Looper.AI */
export default function PersonaSelector(): React.JSX.Element {
  const setRef = useScrollReveal(6);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="ambient-bg" />

      <div className="relative z-10">
        {/* ── Section 1: Hero ──────────────────────────────────── */}
        <section
          ref={setRef(0)}
          className="fade-in-up min-h-screen flex flex-col items-center justify-center text-center px-6 relative"
        >
          {/* Atmospheric background — topographic contours (course) + grid (simulator) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Simulator grid pattern */}
                <pattern id="sim-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(13,124,102,0.12)" strokeWidth="0.5" />
                </pattern>
                {/* Perspective grid — converging lines for depth */}
                <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="40%" stopColor="white" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </linearGradient>
                <mask id="grid-mask">
                  <rect width="1200" height="800" fill="url(#grid-fade)" />
                </mask>
                {/* Glow for contour accent */}
                <filter id="contour-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid overlay — fades in toward the bottom (simulator floor feel) */}
              <rect width="1200" height="800" fill="url(#sim-grid)" mask="url(#grid-mask)" />

              {/* Perspective lines converging to horizon */}
              <g opacity="0.08" stroke="rgba(15,168,122,1)" strokeWidth="0.5">
                <line x1="600" y1="300" x2="0" y2="800" />
                <line x1="600" y1="300" x2="200" y2="800" />
                <line x1="600" y1="300" x2="400" y2="800" />
                <line x1="600" y1="300" x2="600" y2="800" />
                <line x1="600" y1="300" x2="800" y2="800" />
                <line x1="600" y1="300" x2="1000" y2="800" />
                <line x1="600" y1="300" x2="1200" y2="800" />
              </g>

              {/* Topographic contour lines — rolling terrain (course feel) */}
              <g fill="none" strokeWidth="0.6">
                <path
                  d="M -100 500 Q 200 420 400 460 Q 600 500 800 440 Q 1000 380 1300 430"
                  stroke="rgba(13,124,102,0.14)"
                />
                <path
                  d="M -100 540 Q 250 470 450 510 Q 650 550 850 480 Q 1050 410 1300 470"
                  stroke="rgba(13,124,102,0.11)"
                />
                <path
                  d="M -100 580 Q 300 520 500 560 Q 700 600 900 530 Q 1100 460 1300 520"
                  stroke="rgba(13,124,102,0.09)"
                />
                <path
                  d="M -100 620 Q 200 570 450 600 Q 700 640 900 580 Q 1100 520 1300 560"
                  stroke="rgba(13,124,102,0.07)"
                />
                <path
                  d="M -100 660 Q 250 620 500 650 Q 750 680 950 630 Q 1150 580 1300 610"
                  stroke="rgba(13,124,102,0.05)"
                />
              </g>

              {/* Accent contour — slightly brighter, with glow */}
              <path
                d="M -100 470 Q 200 390 400 430 Q 600 470 800 400 Q 1000 340 1300 390"
                fill="none"
                stroke="rgba(15,168,122,0.18)"
                strokeWidth="1.2"
                filter="url(#contour-glow)"
              />
            </svg>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white tracking-tight">
            Looper<span className="text-accent-bright">.AI</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-accent-bright font-medium mt-5">
            Expertise, engineered.
          </p>
          <p className="text-lg text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
            The intelligence layer to power golf through AI
          </p>
          <div className="w-20 h-px bg-accent mx-auto mt-8" />

          <div className="absolute bottom-10 animate-bounce text-gray-600">
            <ChevronDown className="w-5 h-5" />
          </div>
        </section>

        {/* ── Section 2: The Insight ───────────────────────────── */}
        <section
          ref={setRef(1)}
          className="fade-in-up py-24 sm:py-32 px-6 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold mb-8">
            The Insight
          </p>
          <p className="font-display text-2xl sm:text-3xl text-white font-medium leading-snug max-w-2xl mx-auto">
            Memory enables intelligence. The persistent record is the foundation
            for an AI that thinks{' '}
            <span className="font-['Instrument_Serif'] italic text-accent-bright">
              alongside
            </span>{' '}
            the coach, not one that replaces them.
          </p>
          <p className="text-base text-gray-500 mt-8 max-w-lg mx-auto leading-relaxed">
            Every session captured. Every outcome tracked. Compounding insight
            over time.
          </p>
        </section>

        {/* ── Section 3: Two Experiences ───────────────────────── */}
        <section
          ref={setRef(2)}
          className="fade-in-up py-24 sm:py-32 px-6"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-10">
            One Intelligence, Two Experiences
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="glass-card p-8 animate-stagger-in" style={{ animationDelay: '100ms' }}>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Monitor className="w-5 h-5 text-accent-bright" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                Coach Experience
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Live lesson copilot that captures sessions automatically.
                Surfaces context from the persistent record, tracks
                interventions, and drafts practice plans. The AI thinks
                alongside the coach in real time.
              </p>
            </div>

            <div className="glass-card p-8 animate-stagger-in" style={{ animationDelay: '250ms' }}>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5 text-accent-bright" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                Player Experience
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your full game on one timeline. Session recaps in plain
                language, practice accountability, round tracking. Ask Looper
                anything between lessons.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 4: The Flywheel ──────────────────────────── */}
        <section
          ref={setRef(3)}
          className="fade-in-up py-24 sm:py-32 px-6"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-10">
            The Flywheel
          </p>

          <div className="max-w-3xl mx-auto">
            {/* Desktop: horizontal row */}
            <div className="hidden sm:flex items-center justify-center gap-4">
              <FlywheelNode
                icon={<Database className="w-5 h-5 text-accent-bright" />}
                label="Record"
                sublabel="Sessions build themselves"
              />
              <ArrowRight className="w-5 h-5 text-accent-bright/50 shrink-0" />
              <FlywheelNode
                icon={<Brain className="w-5 h-5 text-accent-bright" />}
                label="Intelligence"
                sublabel="AI reasons in real time"
                pulse
              />
              <ArrowRight className="w-5 h-5 text-accent-bright/50 shrink-0" />
              <FlywheelNode
                icon={<TrendingUp className="w-5 h-5 text-accent-bright" />}
                label="Compounding Insight"
                sublabel="Every correction trains the model"
              />
            </div>

            {/* Mobile: vertical stack */}
            <div className="flex sm:hidden flex-col items-center gap-3">
              <FlywheelNode
                icon={<Database className="w-5 h-5 text-accent-bright" />}
                label="Record"
                sublabel="Sessions build themselves"
              />
              <ArrowDown className="w-4 h-4 text-accent-bright/50" />
              <FlywheelNode
                icon={<Brain className="w-5 h-5 text-accent-bright" />}
                label="Intelligence"
                sublabel="AI reasons in real time"
                pulse
              />
              <ArrowDown className="w-4 h-4 text-accent-bright/50" />
              <FlywheelNode
                icon={<TrendingUp className="w-5 h-5 text-accent-bright" />}
                label="Compounding Insight"
                sublabel="Every correction trains the model"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-10 text-center font-mono">
            A dataset company that starts as a platform.
          </p>
        </section>

        {/* ── Section 5: See It Live ───────────────────────────── */}
        <section
          ref={setRef(4)}
          className="fade-in-up py-24 sm:py-32 px-6"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold text-center mb-10">
            See It Live
          </p>

          {/* Sizzle reel — prominent */}
          <Link
            to="/vision"
            className="glass-card border-l-2 border-l-accent-bright flex items-center justify-between p-5 max-w-2xl mx-auto mb-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 text-white ml-0.5" />
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

          {/* Documents — 2 column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-4">
            <Link to="/narrative" className="glass-card p-6 block">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-4 h-4 text-accent-bright" />
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold">
                  The Narrative
                </p>
              </div>
              <p className="text-white font-medium text-[15px]">
                Read the Full Story
              </p>
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
              <p className="text-white font-medium text-[15px]">
                Read the Thesis
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Five-year model, moat analysis, and market sizing
              </p>
            </Link>
          </div>

          {/* Prototypes — 4 column */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {prototypes.map((p, i) => {
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

        {/* ── Section 6: Footer ────────────────────────────────── */}
        <footer
          ref={setRef(5)}
          className="fade-in-up py-12 px-6 text-center"
        >
          <p className="text-xs text-gray-600">
            Confidential &mdash; Looper.AI &mdash; March 2026
          </p>
        </footer>
      </div>
    </div>
  );
}

/** Flywheel node — glass card with icon, label, sublabel */
function FlywheelNode({
  icon,
  label,
  sublabel,
  pulse = false,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  pulse?: boolean;
}): React.JSX.Element {
  return (
    <div className="glass-card p-5 text-center flex-1 min-w-0">
      <div
        className={`w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 ${
          pulse ? 'animate-ai-pulse' : ''
        }`}
      >
        {icon}
      </div>
      <p className="font-display text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
    </div>
  );
}
