import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Database,
  Brain,
  TrendingUp,
  Mic,
  MapPin,
  Heart,
  BarChart3,
  Crosshair,
  MessageSquare,
  Users,
  Lightbulb,
  Zap,
  User,
  CheckCircle,
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

const STAGES = [
  {
    number: 1,
    label: 'The Record',
    tagline: 'The foundation writes itself.',
    description:
      'Ambient capture builds the persistent player record automatically. Every session captured \u2014 audio, video, launch data, coaching cues \u2014 all structured into a searchable history that follows the player across coaches and years.',
    capabilities: [
      { icon: FileText, text: 'Post-session lesson briefs and summaries' },
      { icon: Mic, text: 'Audio-transcribed coaching cues' },
      { icon: Database, text: 'Structured, searchable player profiles' },
    ],
    enables:
      'A single, persistent string record for every player. No manual entry. The dataset starts building from day one.',
  },
  {
    number: 2,
    label: '360-Degree View',
    tagline: 'Every data point, connected.',
    description:
      "The timeline IS the data model. Lessons, rounds, practice sessions, biometrics \u2014 all flowing into one longitudinal view. The complete picture of a player\u2019s journey, visible for the first time.",
    capabilities: [
      { icon: TrendingUp, text: 'Longitudinal progress tracking' },
      { icon: MapPin, text: 'Round data integration via Arccos' },
      { icon: Heart, text: 'Biometric correlation via WHOOP' },
      { icon: Crosshair, text: 'Practice accountability and tracking' },
    ],
    enables:
      'Coaches see patterns that span months, not minutes. Players see their own progress compounding across every touchpoint.',
  },
  {
    number: 3,
    label: 'AI Copilot',
    tagline: 'Intelligence that thinks alongside the coach.',
    description:
      'The accumulated record becomes training data. The AI watches the lesson unfold \u2014 detecting phases, surfacing patterns, flagging limiting factors \u2014 all in real time. The coach glances at the sidebar; the AI does the heavy lifting.',
    capabilities: [
      { icon: Brain, text: 'Live lesson phase detection' },
      { icon: BarChart3, text: 'Real-time pattern confidence' },
      { icon: Zap, text: 'Contextual drill suggestions' },
    ],
    enables:
      'Every session benefits from every prior session. The copilot compounds institutional knowledge across the entire roster.',
  },
  {
    number: 4,
    label: 'The Art of the Possible',
    tagline: 'What happens after the coach leaves.',
    description:
      "Coaching digital twins, AI-automated between-lesson check-ins, self-guided practice sessions. The compounding intelligence enables experiences that weren\u2019t possible before \u2014 the AI becomes an always-available extension of the coach.",
    capabilities: [
      { icon: MessageSquare, text: 'Autonomous player check-ins' },
      { icon: Users, text: 'Coaching digital twins' },
      { icon: Lightbulb, text: 'Self-guided practice with AI' },
    ],
    enables:
      'The coaching relationship extends beyond the bay. Intelligence compounds 24/7, not just during the 45-minute lesson.',
  },
];

/* ─── Device Frame ─────────────────────────────────────────── */

/** Reusable device mockup frame */
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
      <div className={className}>
        <div className="bg-gray-800 rounded-lg p-1.5 shadow-2xl border border-white/10">
          <div className="flex items-center gap-1.5 px-2 pb-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <div className="rounded-md overflow-hidden bg-bg-light">{children}</div>
        </div>
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

  return (
    <div className={`bg-gray-900 rounded-lg border border-white/10 shadow-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ─── Stage Mock UIs ───────────────────────────────────────── */

/** Stage 1: Simple player record card */
function Stage1RecordMock(): React.JSX.Element {
  const lessons = [
    { date: 'Mar 21', title: 'Iron Consistency', summary: 'Strike pattern trending center. Path improved +2.1 degrees.' },
    { date: 'Mar 14', title: 'Driver Optimization', summary: 'Spin loft reduced to 22.4. Carry window expanding.' },
    { date: 'Mar 7', title: 'Short Game Touch', summary: 'Wedge dispersion tightened 18%. Distance control focus.' },
  ];

  return (
    <div className="h-[300px] bg-bg-dark p-4 text-[10px]">
      {/* Player header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <User className="w-4 h-4 text-accent-bright" />
        </div>
        <div>
          <p className="font-display font-semibold text-white text-xs">Jake Morrison</p>
          <p className="font-mono text-[9px] text-gray-500">12.4 HCP / 24 sessions</p>
        </div>
      </div>
      {/* Lesson briefs */}
      <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider mb-2">Recent Sessions</p>
      <div className="space-y-2">
        {lessons.map((l) => (
          <div key={l.date} className="bg-white/5 rounded-md p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-gray-500">{l.date}</span>
              <span className="font-display text-[10px] text-white font-medium">{l.title}</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">{l.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Stage 2: 360-degree timeline mock */
function Stage2TimelineMock({ active }: { active: boolean }): React.JSX.Element {
  const badgeCount = useStaggeredReveal(active ? 4 : 0, 300, 200);
  const entries = [
    { type: 'lesson', date: 'Mar 21', label: 'Lesson \u2014 Iron Consistency', color: 'border-l-accent-bright' },
    { type: 'round', date: 'Mar 19', label: 'Round at Bethpage \u2014 82', color: 'border-l-data-blue' },
    { type: 'practice', date: 'Mar 17', label: 'Practice \u2014 47 balls, strike focus', color: 'border-l-warm-amber' },
    { type: 'biometric', date: 'Mar 16', label: 'WHOOP \u2014 Recovery 84%, HRV 62', color: 'border-l-coral' },
    { type: 'lesson', date: 'Mar 14', label: 'Lesson \u2014 Driver Optimization', color: 'border-l-accent-bright' },
  ];

  const badges = [
    { label: 'Lessons', value: '24' },
    { label: 'Rounds', value: '18' },
    { label: 'Practice', value: '47' },
    { label: 'WHOOP', value: 'Connected' },
  ];

  return (
    <div className="h-[300px] p-3 text-[10px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <span className="font-display font-bold text-navy text-xs tracking-wide">
          LOOPER<span className="text-accent">.AI</span>
        </span>
        <span className="text-gray-400">Player Timeline</span>
      </div>
      {/* Timeline + sparkline */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-1.5">
          {entries.map((e) => (
            <div key={e.date + e.type} className={`border-l-2 ${e.color} pl-2 py-1`}>
              <span className="font-mono text-[9px] text-gray-400">{e.date}</span>
              <p className="text-gray-600 text-[10px]">{e.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="font-display font-semibold text-navy text-[10px]">Progress</p>
          <div className="bg-white rounded border border-gray-100 p-2">
            <svg viewBox="0 0 80 40" className="w-full" fill="none">
              <polyline
                points="0,36 10,32 20,34 30,26 40,24 50,18 60,16 70,10 80,6"
                stroke="#0D7C66"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-mono text-accent font-bold text-[10px] mt-1">+12% avg</p>
          </div>
          <div className="bg-white rounded border border-gray-100 p-1.5 text-center">
            <p className="font-mono text-navy font-bold text-sm">8.2</p>
            <p className="text-gray-400 text-[9px]">months tracked</p>
          </div>
        </div>
      </div>
      {/* Data source badges */}
      <div className="flex gap-1.5 mt-2">
        {badges.map((b, i) => (
          <span
            key={b.label}
            className={`font-mono text-[8px] bg-gray-100 rounded px-1.5 py-0.5 text-gray-500 transition-opacity duration-300 ${
              i < badgeCount ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {b.label}: {b.value}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Stage 3: AI copilot sidebar mock */
function Stage3SidebarMock({ active }: { active: boolean }): React.JSX.Element {
  const confValue = useCountUp(84, 2000, active);
  const { displayText, isDone } = useTypewriter(
    'Face angle trending 2.1\u00b0 open. Correlating with grip pressure from audio cues. Suggesting external focus drill...',
    30,
    active ? 600 : 99999,
  );

  return (
    <div className="h-[320px] bg-bg-dark p-3 text-[10px]">
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
        <span className="font-mono text-gray-600 text-[9px] ml-auto">14:22</span>
      </div>
      {/* Confidence */}
      <div className="bg-accent-bright/10 rounded-md p-2 mb-3">
        <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Pattern Confidence</p>
        <p className="font-mono text-xl text-accent-bright font-bold tabular-nums">
          {Math.round(confValue)}%
        </p>
      </div>
      {/* AI reasoning */}
      <div className="border-l-2 border-accent-bright bg-white/5 rounded-r-md p-2 mb-3">
        <p className="font-mono text-[10px] text-gray-300 leading-relaxed">
          {displayText}
          {!isDone && <span className="animate-blink text-accent-bright ml-0.5">|</span>}
        </p>
      </div>
      {/* Data grid */}
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

/** Stage 4: Autonomous check-in mock */
function Stage4AutonomousMock(): React.JSX.Element {
  return (
    <div className="h-[300px] text-[10px]">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] text-gray-400">9:41</span>
        <span className="font-display font-bold text-navy text-[11px]">
          LOOPER<span className="text-accent">.AI</span>
        </span>
        <div className="w-6" />
      </div>
      {/* Greeting */}
      <p className="font-display text-navy text-xs font-semibold mb-3">
        Hey Jake, checking in on yesterday&apos;s practice.
      </p>
      {/* AI message */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <Brain className="w-3 h-3 text-accent" />
          </div>
          <p className="text-gray-600 text-[10px] leading-relaxed">
            I noticed your strike pattern drifted heel-ward in your last 20 balls.
            Coach Mike&apos;s drill from Tuesday targets exactly this. Want to run through it?
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <p className="font-mono text-[9px] text-gray-400">Confidence:</p>
          <p className="font-mono text-[10px] text-accent font-bold">91%</p>
        </div>
      </div>
      {/* Response buttons */}
      <div className="flex gap-2 mb-4">
        <button className="flex-1 bg-accent text-white rounded-lg py-2 text-[10px] font-medium">
          Start Drill
        </button>
        <button className="flex-1 border border-gray-200 text-gray-500 rounded-lg py-2 text-[10px] font-medium">
          Ask More
        </button>
      </div>
      {/* Recent activity */}
      <div className="bg-gray-50 rounded-lg p-2.5">
        <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider mb-1.5">Yesterday</p>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span className="text-gray-600 text-[10px]">Practice: 52 balls, heel-strike drill</span>
        </div>
      </div>
      {/* Footer */}
      <p className="font-mono text-[8px] text-gray-300 text-center mt-3">
        Looper AI \u2014 Available 24/7
      </p>
    </div>
  );
}

/* ─── Progress Indicator ───────────────────────────────────── */

/** Fixed vertical progress indicator for desktop */
function StageProgressIndicator({ currentStage }: { currentStage: number }): React.JSX.Element {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center z-40 gap-10">
      {/* Background line */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-px h-full bg-white/10" />
      </div>
      {/* Progress fill */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-accent-bright transition-all duration-700 ease-out" style={{ height: `${currentStage >= 0 ? ((currentStage + 1) / 4) * 100 : 0}%` }} />
      {/* Dots */}
      {STAGES.map((stage, i) => (
        <div
          key={stage.number}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-500 ${
            i <= currentStage
              ? i === currentStage
                ? 'bg-accent-bright/20 text-accent-bright border border-accent-bright/50 animate-ai-pulse'
                : 'bg-accent-bright/20 text-accent-bright border border-accent-bright/50'
              : 'bg-white/5 text-gray-600 border border-white/10'
          }`}
        >
          {stage.number}
        </div>
      ))}
    </div>
  );
}

/* ─── Stage Section ────────────────────────────────────────── */

/** Connector line between stages */
function StageConnector(): React.JSX.Element {
  return <div className="w-px h-16 sm:h-24 bg-gradient-to-b from-accent-bright/30 to-transparent mx-auto" />;
}

/* ─── Main Component ───────────────────────────────────────── */

/** Product evolution page — 4-stage technical roadmap */
export default function EvolutionPage(): React.JSX.Element {
  const setRef = useScrollReveal(7);
  const [stage1Ref, stage1InView] = useInViewTrigger(0.2);
  const [stage2Ref, stage2InView] = useInViewTrigger(0.2);
  const [stage3Ref, stage3InView] = useInViewTrigger(0.2);
  const [stage4Ref, stage4InView] = useInViewTrigger(0.2);

  const currentStage = stage4InView ? 3 : stage3InView ? 2 : stage2InView ? 1 : stage1InView ? 0 : -1;

  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-dark">
      <div className="ambient-bg" />

      <div className="relative z-10">
        {/* ── Sticky Nav ──────────────────────────────────── */}
        <nav className="sticky top-0 z-50 bg-bg-dark/90 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link to="/" className="font-display text-xl font-bold text-white hover:opacity-80 transition-opacity">
              LOOPER<span className="text-accent-bright">.AI</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </nav>

        {/* ── Progress Indicator (desktop) ────────────────── */}
        <StageProgressIndicator currentStage={currentStage} />

        {/* ── Hero ────────────────────────────────────────── */}
        <section ref={setRef(0)} className="fade-in-up py-24 sm:py-32 px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-bright font-semibold">
            Product Evolution
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mt-4">
            Record. Understand.<br className="hidden sm:block" /> Reason. Transform.
          </h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Four stages. Each builds on the last. The data compounds, the intelligence
            deepens, and what&apos;s possible expands.
          </p>

          {/* Stage badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-10 max-w-2xl mx-auto">
            {STAGES.map((stage) => (
              <div key={stage.number} className="glass-card px-4 py-2.5 flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-accent-bright font-bold">{stage.number}</span>
                <span className="text-sm text-gray-300 font-medium">{stage.label}</span>
              </div>
            ))}
          </div>

          <div className="w-20 h-px bg-accent mx-auto mt-10" />
        </section>

        {/* ── Stage 1: The Record ─────────────────────────── */}
        <section ref={setRef(1)} className="fade-in-up py-20 sm:py-28 px-6">
          <div ref={stage1Ref} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-accent/10 rounded-full px-3 py-1 font-mono text-[11px] text-accent-bright uppercase tracking-wider">
                Stage 1
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-3">
                {STAGES[0].label}
              </h2>
              <p className="font-['Instrument_Serif'] italic text-accent-bright text-lg mt-2">
                {STAGES[0].tagline}
              </p>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mt-4">
                {STAGES[0].description}
              </p>
              <ul className="mt-6 space-y-3">
                {STAGES[0].capabilities.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <li key={cap.text} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-accent-bright shrink-0" />
                      <span className="text-sm text-gray-300">{cap.text}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="glass-card border-l-2 border-l-accent-bright p-4 mt-6">
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold mb-2">
                  What This Enables
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{STAGES[0].enables}</p>
              </div>
            </div>
            {/* Mock */}
            <div>
              <DeviceFrame type="sidebar" className="max-w-[300px] mx-auto animate-float">
                <Stage1RecordMock />
              </DeviceFrame>
            </div>
          </div>
        </section>

        <StageConnector />

        {/* ── Stage 2: 360-Degree View ────────────────────── */}
        <section ref={setRef(2)} className="fade-in-up py-20 sm:py-28 px-6">
          <div ref={stage2Ref} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Mock (left on desktop) */}
            <div className="lg:order-first order-last">
              <DeviceFrame type="laptop" className="animate-float">
                <Stage2TimelineMock active={stage2InView} />
              </DeviceFrame>
            </div>
            {/* Text */}
            <div>
              <span className="inline-block bg-accent/10 rounded-full px-3 py-1 font-mono text-[11px] text-accent-bright uppercase tracking-wider">
                Stage 2
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-3">
                {STAGES[1].label}
              </h2>
              <p className="font-['Instrument_Serif'] italic text-accent-bright text-lg mt-2">
                {STAGES[1].tagline}
              </p>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mt-4">
                {STAGES[1].description}
              </p>
              <ul className="mt-6 space-y-3">
                {STAGES[1].capabilities.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <li key={cap.text} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-accent-bright shrink-0" />
                      <span className="text-sm text-gray-300">{cap.text}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="glass-card border-l-2 border-l-accent-bright p-4 mt-6">
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold mb-2">
                  What This Enables
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{STAGES[1].enables}</p>
              </div>
            </div>
          </div>
        </section>

        <StageConnector />

        {/* ── Stage 3: AI Copilot ─────────────────────────── */}
        <section ref={setRef(3)} className="fade-in-up py-20 sm:py-28 px-6">
          <div ref={stage3Ref} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-accent/10 rounded-full px-3 py-1 font-mono text-[11px] text-accent-bright uppercase tracking-wider">
                Stage 3
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-3">
                {STAGES[2].label}
              </h2>
              <p className="font-['Instrument_Serif'] italic text-accent-bright text-lg mt-2">
                {STAGES[2].tagline}
              </p>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mt-4">
                {STAGES[2].description}
              </p>
              <ul className="mt-6 space-y-3">
                {STAGES[2].capabilities.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <li key={cap.text} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-accent-bright shrink-0" />
                      <span className="text-sm text-gray-300">{cap.text}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="glass-card border-l-2 border-l-accent-bright p-4 mt-6">
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold mb-2">
                  What This Enables
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{STAGES[2].enables}</p>
              </div>
            </div>
            {/* Mock */}
            <div>
              <DeviceFrame type="sidebar" className="max-w-[300px] mx-auto animate-float">
                <Stage3SidebarMock active={stage3InView} />
              </DeviceFrame>
            </div>
          </div>
        </section>

        <StageConnector />

        {/* ── Stage 4: The Art of the Possible ────────────── */}
        <section ref={setRef(4)} className="fade-in-up py-20 sm:py-28 px-6">
          <div ref={stage4Ref} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Mock (left on desktop) */}
            <div className="lg:order-first order-last">
              <DeviceFrame type="phone" className="max-w-[220px] mx-auto animate-float">
                <Stage4AutonomousMock />
              </DeviceFrame>
            </div>
            {/* Text */}
            <div>
              <span className="inline-block bg-accent/10 rounded-full px-3 py-1 font-mono text-[11px] text-accent-bright uppercase tracking-wider">
                Stage 4
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-3">
                {STAGES[3].label}
              </h2>
              <p className="font-['Instrument_Serif'] italic text-accent-bright text-lg mt-2">
                {STAGES[3].tagline}
              </p>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mt-4">
                {STAGES[3].description}
              </p>
              <ul className="mt-6 space-y-3">
                {STAGES[3].capabilities.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <li key={cap.text} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-accent-bright shrink-0" />
                      <span className="text-sm text-gray-300">{cap.text}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="glass-card border-l-2 border-l-accent-bright p-4 mt-6">
                <p className="text-[11px] uppercase tracking-wider text-accent-bright font-semibold mb-2">
                  What This Enables
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{STAGES[3].enables}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing ─────────────────────────────────────── */}
        <section ref={setRef(5)} className="fade-in-up py-24 sm:py-32 px-6 text-center">
          <p className="font-display text-2xl sm:text-3xl text-white font-medium leading-snug max-w-2xl mx-auto">
            Memory enables intelligence. The record is both the product and the
            moat. The intelligence is the{' '}
            <span className="font-['Instrument_Serif'] italic text-accent-bright">
              value proposition
            </span>
            .
          </p>
          <p className="font-mono text-sm text-accent-bright mt-6">
            A dataset company that starts as a platform.
          </p>

          <Link
            to="/"
            className="glass-card border-l-2 border-l-accent-bright flex items-center justify-between p-5 max-w-md mx-auto mt-12"
          >
            <div>
              <p className="font-display text-[15px] font-semibold text-white">
                Back to Overview
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                Explore the prototypes and thesis
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 shrink-0" />
          </Link>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer ref={setRef(6)} className="fade-in-up py-12 px-6 text-center">
          <p className="text-xs text-gray-600">
            Confidential &mdash; Looper.AI &mdash; March 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
