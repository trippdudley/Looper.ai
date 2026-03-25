import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Database,
  Brain,
  TrendingUp,
  ArrowRight,
  ArrowDown,
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
  Zap,
  Shield,
  Target,
  Activity,
  Gauge,
  Award,
  Crosshair,
  Wrench,
  Navigation,
  Smile,
  ClipboardList,
  PersonStanding,
  CalendarCheck,
  Send,
  ChevronLeft,
  ChevronRight,
  Search,
  Repeat,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { useTypewriter } from '../hooks/useTypewriter';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';

/* ─── Hooks ────────────────────────────────────────────────── */

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

const COACH_TOOLS = [
  { name: 'Session Record', icon: ClipboardList, data: 'Interventions + cues' },
  { name: 'Launch Monitor', icon: Target, data: 'TrackMan / Foresight' },
  { name: 'Swing Video', icon: Video, data: 'V1 / CoachNow / Onform' },
  { name: '3D Motion', icon: Activity, data: 'Sportsbox / K-Motion' },
  { name: 'Force Plates', icon: Crosshair, data: 'Swing Catalyst' },
  { name: 'TPI Screening', icon: PersonStanding, data: 'Movement assessments' },
  { name: 'Practice Behavior', icon: CalendarCheck, data: 'Facility booking + check-in' },
];

const PLAYER_TOOLS = [
  { name: 'GHIN', icon: Award, data: 'Handicap + scoring history' },
  { name: 'Arccos', icon: MapPin, data: 'Strokes gained by category' },
  { name: 'WHOOP / Garmin', icon: Heart, data: 'Recovery + sleep' },
  { name: 'Personal LM', icon: Gauge, data: 'Unsupervised practice data' },
  { name: 'Equipment History', icon: Wrench, data: 'Fitting records + build specs' },
  { name: 'Course GPS', icon: Navigation, data: 'Shot Scope / Garmin Golf' },
  { name: 'Self-Reported State', icon: Smile, data: 'Confidence + intentions' },
];

export const _AGENTS = [
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

export const _PROTOTYPES = [
  { label: 'Player Portal', icon: Route, path: '/player', desc: 'Mobile-first player experience' },
  { label: 'Coach Portal', icon: GraduationCap, path: '/coach', desc: 'Desktop coaching command center' },
];

export const _VALUE_PROPS = [
  { icon: Zap, title: 'Zero Manual Input', desc: 'The record builds itself. Coaches coach. Nothing to type, nothing to upload.' },
  { icon: Shield, title: 'Persistent Memory', desc: 'Sessions, corrections, breakthroughs. Nothing gets lost, and it all compounds over time.' },
  { icon: Target, title: 'Real-Time Intelligence', desc: 'An AI copilot that sits alongside the coach during every lesson, processing data as it arrives.' },
];

const EVOLUTION_STAGES = [
  {
    stage: 'Record',
    outcome: 'Coaches stop losing context.',
    supporting: 'Pre-session briefs and post-session summaries. Ambient capture \u2014 nothing to type. Every lesson has a before and after.',
  },
  {
    stage: 'Reason',
    outcome: 'Blind spots surface before they compound.',
    supporting: 'Real-time insights during the lesson. Pattern detection across sessions. The AI catches what the coach missed.',
  },
  {
    stage: 'Compound',
    outcome: 'Retention climbs. Coaching scales.',
    supporting: 'Predictive development plans. Benchmarks across the academy. Coaching IP becomes a product, not just a service.',
  },
];

const ANALOGS = [
  {
    name: 'Epic Systems',
    domain: 'Healthcare EHR',
    desc: 'Started by capturing the patient record when healthcare was all paper and silos. Now runs the data infrastructure behind most of American medicine.',
    metric: '$4.6B revenue',
    icon: Heart,
  },
  {
    name: 'Veeva Systems',
    domain: 'Life Sciences CRM',
    desc: 'Built vertical SaaS for pharma when everyone said the market was too small. Turns out owning the record in a specialized industry is a very good business.',
    metric: '$37B market cap',
    icon: Shield,
  },
  {
    name: 'ServiceTitan',
    domain: 'Home Services OS',
    desc: 'Showed that fragmented, trust-based, relationship-heavy industries are exactly where vertical software wins. Sound familiar?',
    metric: '$9.5B valuation',
    icon: Wrench,
  },
];

const SOCIAL_PROOF = [
  {
    quote: 'I use 5\u20136 different tools, it would be better if they were connected.',
    attribution: 'Patrick',
    role: 'PGA Teaching Professional',
    type: 'quote' as const,
  },
  {
    quote: 'I used to see a teacher who knew a lot about the golf swing but each time I saw him, it was clear that he had no memory of what we\u2019d worked on two weeks before.',
    attribution: 'PGA Magazine',
    role: 'Psychotherapist & Golfer',
    type: 'quote' as const,
  },
  {
    quote: 'PGA Section Teacher of the Year Randy Dietz spends 30\u201360 minutes each night responding to student emails, his lesson book is permanently full, and his wait list is two dozen deep.',
    attribution: 'Randy Dietz',
    role: 'PGA Section Teacher of the Year',
    type: 'fact' as const,
  },
  {
    quote: 'I think lessons are a useless waste of time and money. A coaching program is far better as it provides ongoing support and development on all parts of the game.',
    attribution: 'GolfWRX Forum',
    role: 'Player',
    type: 'quote' as const,
  },
];

/* ─── Sub-components ───────────────────────────────────────── */

/** Floating navigation bar */
export function _FloatingNav(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'nav-glass rounded-2xl mx-4 sm:mx-6 lg:mx-auto py-3 px-6' : ''
        }`}
      >
        <span className="font-display font-bold text-white text-lg tracking-wide">
          LOOPER<span className="text-accent-bright">.AI</span>
        </span>

        <div className="hidden sm:flex items-center gap-8">
          <a href="#product" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
            Product
          </a>
          <a href="#vision" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
            Vision
          </a>
          <a href="#analogs" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
            Analogs
          </a>
        </div>

        <Link
          to="/coach"
          className="text-sm font-medium text-accent-bright hover:text-white bg-accent-bright/10 hover:bg-accent-bright/20 px-4 py-2 rounded-lg transition-all duration-200"
        >
          View Demo
        </Link>
      </div>
    </nav>
  );
}

/** Animated confidence counter in hero */
export function _HeroConfidence(): React.JSX.Element {
  const value = useCountUp(94, 2400);
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <div className="w-2.5 h-2.5 rounded-full bg-accent-bright animate-ai-pulse" />
      <p className="font-mono text-[11px] text-gray-500 uppercase tracking-[0.15em]">Session Confidence</p>
      <p className="font-mono text-3xl text-accent-bright font-bold tabular-nums">
        {Math.round(value)}%
      </p>
    </div>
  );
}

/** Lemniscate parametric point */
function lemniscatePoint(t: number, a: number): { x: number; y: number } {
  const sinT = Math.sin(t);
  const cosT = Math.cos(t);
  const denom = 1 + sinT * sinT;
  return {
    x: (a * cosT) / denom,
    y: (a * sinT * cosT) / denom,
  };
}

/** Generate SVG path string from lemniscate parametric sampling */
function lemniscatePath(a: number, samples = 200): string {
  const points: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * 2 * Math.PI;
    const { x, y } = lemniscatePoint(t, a);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ') + ' Z';
}

/** Compact orbit card rendered at absolute position */
export function _OrbitCard({
  name,
  icon: Icon,
  data: _data,
  side,
  x,
  y,
  rotation: _rotation,
  scale,
  opacity,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  data: string;
  side: 'coach' | 'player';
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}): React.JSX.Element {
  const isCoach = side === 'coach';
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      <div className="flex flex-col items-center gap-1" style={{ transform: `rotate(0deg)` }}>
        {/* Icon dot */}
        <div
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${
            isCoach
              ? 'bg-accent-bright/10 border border-accent-bright/25'
              : 'bg-data-blue/10 border border-data-blue/25'
          }`}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCoach ? 'text-accent-bright' : 'text-data-blue'}`} />
        </div>
        {/* Name label — only shows when card is prominent */}
        <p
          className={`font-display text-[9px] sm:text-[10px] font-medium whitespace-nowrap text-center leading-none ${
            isCoach ? 'text-accent-bright/70' : 'text-data-blue/70'
          }`}
          style={{ opacity: Math.min(1, opacity * 1.5) }}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

/** The Infinity Loop — animated lemniscate visualization */
function InfinityLoop(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const animRef = useRef<number>(0);
  const accumRef = useRef(0);
  const lastFrameRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [containerSize, setContainerSize] = useState({ w: 900, h: 320 });

  // IntersectionObserver to trigger animation when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isInView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView]);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = (): void => {
      const rect = el.getBoundingClientRect();
      const isMobile = rect.width < 640;
      setContainerSize({ w: rect.width, h: isMobile ? 220 : 320 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animation: update card positions every frame using direct DOM manipulation
  // to avoid React re-render overhead and stale closure issues.
  useEffect(() => {
    if (!isInView) return;

    const PI = Math.PI;
    const SAMPLES = 200;
    const speed = 0.00035;

    const w = containerSize.w;
    const h = containerSize.h;
    const a = w * 0.42;
    const cx = w / 2;
    const cy = h / 2;

    // Build arc-length table for a lobe (once per effect)
    const buildArcTable = (lobeStart: number): { ts: Float64Array; cumLen: Float64Array } => {
      const ts = new Float64Array(SAMPLES + 1);
      const cumLen = new Float64Array(SAMPLES + 1);
      let totalLen = 0;
      let prev = lemniscatePoint(lobeStart, a);
      for (let s = 0; s <= SAMPLES; s++) {
        const t = lobeStart + (s / SAMPLES) * PI;
        const pt = lemniscatePoint(t, a);
        if (s > 0) {
          totalLen += Math.sqrt((pt.x - prev.x) ** 2 + (pt.y - prev.y) ** 2);
        }
        ts[s] = t;
        cumLen[s] = totalLen;
        prev = pt;
      }
      return { ts, cumLen };
    };

    const tAtFraction = (frac: number, table: { ts: Float64Array; cumLen: Float64Array }): number => {
      const target = frac * table.cumLen[SAMPLES];
      for (let i = 1; i <= SAMPLES; i++) {
        if (table.cumLen[i] >= target) {
          const segFrac = (target - table.cumLen[i - 1]) / (table.cumLen[i] - table.cumLen[i - 1] || 1);
          return table.ts[i - 1] + segFrac * (table.ts[i] - table.ts[i - 1]);
        }
      }
      return table.ts[SAMPLES];
    };

    const rightTable = buildArcTable(-PI / 2);
    const leftTable = buildArcTable(PI / 2);
    const moveCard = (
      el: HTMLDivElement | null,
      index: number,
      count: number,
      table: { ts: Float64Array; cumLen: Float64Array },
      time: number,
    ): void => {
      if (!el) return;
      const phase = index / count;
      const frac = ((phase + time * 0.12) % 1 + 1) % 1;
      const lobeT = tAtFraction(frac, table);
      const pt = lemniscatePoint(lobeT, a);
      const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y) / a;
      const fadeT = 0.35;
      const op = dist < fadeT ? 0 : Math.min(1, ((dist - fadeT) / (1 - fadeT)) ** 0.5);
      const sc = 0.75 + 0.25 * dist;
      el.style.left = `${cx + pt.x}px`;
      el.style.top = `${cy + pt.y}px`;
      el.style.opacity = String(op);
      el.style.transform = `translate(-50%, -50%) scale(${sc})`;
      el.style.display = op < 0.05 ? 'none' : '';
    };

    const animate = (timestamp: number): void => {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp;
      const delta = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;
      accumRef.current += delta * speed;
      const time = accumRef.current;

      for (let i = 0; i < COACH_TOOLS.length; i++) {
        moveCard(cardRefs.current[i], i, COACH_TOOLS.length, rightTable, time);
      }
      for (let i = 0; i < PLAYER_TOOLS.length; i++) {
        moveCard(cardRefs.current[COACH_TOOLS.length + i], i, PLAYER_TOOLS.length, leftTable, time);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isInView, containerSize]);

  const a = containerSize.w * 0.42;
  const cx = containerSize.w / 2;
  const cy = containerSize.h / 2;
  const svgPath = lemniscatePath(a);

  // Label positions at lobe apexes
  const rightApex = lemniscatePoint(0, a);
  const leftApex = lemniscatePoint(Math.PI, a);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{ maxWidth: '960px', height: `${containerSize.h}px`, minHeight: '200px' }}
    >
      {/* SVG lemniscate track */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="lemniscate-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Glow layer */}
        <g transform={`translate(${cx}, ${cy})`}>
          <path
            d={svgPath}
            stroke="rgba(15,168,122,0.08)"
            strokeWidth="12"
            filter="url(#lemniscate-glow)"
          />
        </g>
        {/* Main track */}
        <g transform={`translate(${cx}, ${cy})`}>
          <path
            d={svgPath}
            stroke="rgba(15,168,122,0.15)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Lobe labels */}
      <div
        className="absolute pointer-events-none flex items-center gap-1.5"
        style={{
          left: `${cx + rightApex.x}px`,
          top: `${cy + rightApex.y - 50}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <GraduationCap className="w-3 h-3 text-accent-bright/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent-bright/40">Coach</span>
      </div>
      <div
        className="absolute pointer-events-none flex items-center gap-1.5"
        style={{
          left: `${cx + leftApex.x}px`,
          top: `${cy + leftApex.y - 50}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <User className="w-3 h-3 text-data-blue/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-data-blue/40">Player</span>
      </div>

      {/* Orbiting cards — positioned via direct DOM in rAF */}
      {COACH_TOOLS.map((tool, i) => {
        const Icon = tool.icon;
        return (
          <div
            key={tool.name}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute pointer-events-none"
            style={{ display: 'none', willChange: 'transform, opacity, left, top' }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-accent-bright/10 border border-accent-bright/25" style={{ backdropFilter: 'blur(8px)' }}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-bright" />
              </div>
              <p className="font-display text-[9px] sm:text-[10px] font-medium whitespace-nowrap text-center leading-none text-accent-bright/70">{tool.name}</p>
            </div>
          </div>
        );
      })}
      {PLAYER_TOOLS.map((tool, i) => {
        const Icon = tool.icon;
        return (
          <div
            key={tool.name}
            ref={(el) => { cardRefs.current[COACH_TOOLS.length + i] = el; }}
            className="absolute pointer-events-none"
            style={{ display: 'none', willChange: 'transform, opacity, left, top' }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-data-blue/10 border border-data-blue/25" style={{ backdropFilter: 'blur(8px)' }}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-data-blue" />
              </div>
              <p className="font-display text-[9px] sm:text-[10px] font-medium whitespace-nowrap text-center leading-none text-data-blue/70">{tool.name}</p>
            </div>
          </div>
        );
      })}

      {/* Center Looper hub */}
      <div
        className="absolute z-10"
        style={{
          left: `${cx}px`,
          top: `${cy}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-bg-dark/90 border border-accent-bright/30 flex items-center justify-center animate-ai-pulse">
            <div className="text-center">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-accent-bright mx-auto" />
              <p className="font-display text-[7px] sm:text-[8px] font-bold text-accent-bright mt-0.5 tracking-wide">LOOPER.AI</p>
            </div>
          </div>
          <div className="absolute inset-[-8px] rounded-3xl bg-accent-bright/8 blur-xl -z-10" />
        </div>
      </div>
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
      <div className={className}>
        <div className="bg-gray-800/80 rounded-xl p-2 shadow-2xl shadow-black/40 border border-white/[0.08]">
          <div className="flex items-center gap-1.5 px-3 pb-2">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <div className="rounded-lg overflow-hidden bg-bg-light">{children}</div>
        </div>
        <div className="w-1/3 h-2.5 bg-gray-800/80 rounded-b-xl mx-auto border-x border-b border-white/[0.08]" />
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
    <div className={`bg-gray-900/80 rounded-xl border border-white/[0.08] shadow-xl shadow-black/30 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/** Mock coach portal content — mirrors real Coach Portal dashboard */
export function _CoachPortalMock(): React.JSX.Element {
  return (
    <div className="h-[260px] sm:h-[300px] p-3 text-[10px] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 flex flex-col justify-between">
            <div className="w-full h-[1.5px] bg-gray-400 rounded" />
            <div className="w-3 h-[1.5px] bg-gray-400 rounded" />
            <div className="w-full h-[1.5px] bg-gray-400 rounded" />
          </div>
          <div className="bg-gray-100 rounded-full px-2 py-0.5 flex items-center gap-1">
            <Search className="w-2.5 h-2.5 text-gray-400" />
            <span className="text-gray-400 text-[8px]">Search students, sessions...</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 text-[9px]">Austin Reed, PGA</span>
          <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white text-[6px] font-bold">AR</span>
          </div>
        </div>
      </div>
      {/* Greeting */}
      <p className="font-display text-navy text-[13px] font-semibold leading-tight">Good afternoon, Coach Thompson</p>
      <p className="font-mono text-[8px] text-gray-400 mb-1.5">3 lessons today · 12 active students · 2 briefings ready</p>
      {/* Up Next card */}
      <div className="bg-white rounded-lg border border-accent/20 p-2 mb-2 shadow-sm">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-accent text-[8px] font-semibold uppercase tracking-wider">Up Next</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-accent/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-accent/60" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-navy text-[11px] font-semibold">Moe Norman</p>
            <p className="font-mono text-[8px] text-gray-400">HCP 15.2 · Session 14</p>
            <p className="text-gray-500 text-[8px] mt-0.5">Iron strike consistency — continue from last session</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono text-navy text-[10px] font-bold">2:00 PM</p>
            <p className="font-mono text-gray-400 text-[7px]">45 min</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-accent text-[8px]">87% confidence</span>
        </div>
      </div>
      {/* Schedule */}
      <div className="space-y-1">
        {[
          { time: '9:00 AM', name: 'Sarah Chen', hcp: '22', status: 'Completed', done: true },
          { time: '10:30 AM', name: 'Moe Norman', hcp: '15.2', status: 'Briefing Ready', done: false },
          { time: '2:00 PM', name: 'James Okafor', hcp: '9.1', status: 'Briefing Ready', done: false },
        ].map((s) => (
          <div key={s.time} className={`flex items-center gap-2 p-1 rounded border ${s.done ? 'border-gray-100 opacity-60' : 'border-accent/15 bg-accent/[0.03]'}`}>
            <span className="font-mono text-[8px] text-gray-400 w-10 flex-shrink-0">{s.time}</span>
            <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {s.done ? <CheckCircle className="w-3 h-3 text-accent/50" /> : <User className="w-2.5 h-2.5 text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-navy text-[9px] font-medium">{s.name}</span>
              <span className="font-mono text-[7px] text-gray-400 ml-1">HCP {s.hcp}</span>
            </div>
            <span className={`font-mono text-[7px] px-1.5 py-0.5 rounded-full ${s.done ? 'bg-gray-100 text-gray-400' : 'bg-accent/10 text-accent'}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mock lesson sidebar — mirrors real Analysis phase with streaming insights */
function SidebarMock(): React.JSX.Element {
  return (
    <div className="h-[280px] sm:h-[320px] bg-bg-dark p-3 text-[10px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="w-3 h-3 text-gray-500" />
          <span className="font-display font-bold text-white text-[11px] tracking-wide">
            LOOPER<span className="text-accent-bright">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-gray-500 text-[9px]">S9</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-ai-pulse" />
            <span className="font-mono text-accent-bright text-[8px] uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
      {/* Phase navigation */}
      <div className="flex items-center gap-2 mb-3">
        {['Context', 'Analysis', 'Working', 'Summary'].map((phase, i) => (
          <div key={phase} className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-accent-bright' : i === 1 ? 'bg-accent-bright/60' : 'bg-gray-600'}`} />
            <span className={`font-mono text-[8px] ${i <= 1 ? 'text-accent-bright' : 'text-gray-600'}`}>{phase}</span>
          </div>
        ))}
      </div>
      {/* Streaming status */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-ai-pulse" />
        <span className="font-mono text-accent-bright/80 text-[9px]">Cross-referencing session history...</span>
      </div>
      {/* Insight card with confidence */}
      <div className="bg-[#1a1215] border border-[#c93b3b]/20 rounded-md p-2 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="w-full" />
          <div className="flex items-center gap-1 flex-shrink-0">
            <svg viewBox="0 0 20 20" className="w-4 h-4">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#333" strokeWidth="2" />
              <circle cx="10" cy="10" r="8" fill="none" stroke="#c93b3b" strokeWidth="2" strokeDasharray={`${0.52 * 50.3} ${50.3}`} strokeDashoffset="12.6" strokeLinecap="round" transform="rotate(-90 10 10)" />
            </svg>
            <span className="font-mono text-[10px] text-[#c93b3b] font-bold">52%</span>
          </div>
        </div>
        <p className="text-gray-300 text-[9px] leading-relaxed">
          Face-to-path volatility: sigma = 3.8 across 6 shots. Strike location clustering 0.3" toe-side.
        </p>
      </div>
      {/* Second insight streaming */}
      <div className="bg-white/[0.03] border border-[#d4980b]/20 rounded-md p-2 mb-2">
        <p className="font-mono text-[9px] text-[#d4980b]/80 mb-1">Driver face angle trending open...</p>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[9px] text-gray-500">Building confidence...</span>
          <span className="font-mono text-[10px] text-[#d4980b] font-bold">71%</span>
        </div>
      </div>
      {/* Quick prompts */}
      <div className="flex gap-1 mb-2">
        <div className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
          <span className="text-gray-400 text-[8px]">How does his strike compare to S8?</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
          <span className="text-gray-400 text-[8px]">What cue type works best?</span>
        </div>
      </div>
      {/* Input */}
      <div className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 flex items-center justify-between">
        <span className="text-gray-600 text-[9px]">Ask Looper...</span>
        <Send className="w-3 h-3 text-gray-600" />
      </div>
    </div>
  );
}

/** Mock player brief — the lesson summary sent to the player after each session */
export function _PlayerMock(): React.JSX.Element {
  return (
    <div className="h-[260px] sm:h-[300px] text-[10px] overflow-hidden">
      {/* Status bar + header */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[9px] text-gray-400">9:41</span>
        <span className="font-display font-bold text-navy text-[11px]">
          LOOPER<span className="text-accent">.AI</span>
        </span>
        <div className="w-6" />
      </div>
      <div className="text-center mb-2 pb-1.5 border-b border-gray-200">
        <p className="font-display text-navy text-[12px] font-semibold">Lesson Summary</p>
        <p className="font-mono text-[8px] text-gray-400">March 24, 2026 · Coach Thompson</p>
      </div>
      {/* What We Worked On */}
      <div className="mb-2">
        <p className="font-mono text-[7px] text-gray-400 uppercase tracking-wider mb-0.5">What We Worked On</p>
        <p className="text-navy text-[9px] leading-relaxed">
          We focused on your iron contact today. The strike pattern moved from toe-heavy to center, and your carry numbers responded.
        </p>
      </div>
      {/* What Clicked */}
      <div className="mb-2">
        <p className="font-mono text-[7px] text-gray-400 uppercase tracking-wider mb-0.5">What Clicked</p>
        <p className="text-navy text-[9px] leading-relaxed mb-1">
          The gate drill unlocked center strike. Your dispersion tightened by 40%.
        </p>
        <div className="flex items-center gap-2 bg-gray-50 rounded p-1.5">
          <span className="font-mono text-[8px] text-gray-500 w-14 flex-shrink-0">Strike quality</span>
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent h-full rounded-full" style={{ width: '71%' }} />
          </div>
          <span className="font-mono text-[9px] text-accent font-bold">71%</span>
        </div>
      </div>
      {/* Practice Plan */}
      <div className="mb-2">
        <p className="font-mono text-[7px] text-gray-400 uppercase tracking-wider mb-0.5">Your Practice Plan</p>
        <div className="space-y-1">
          {[
            { drill: 'Gate drill — 7 iron', freq: '3 sets of 10, 3x this week' },
            { drill: 'Tempo ladder — 7 iron', freq: '5-5-5 at 60/80/100%, 2x this week' },
          ].map((d) => (
            <div key={d.drill} className="bg-gray-50 rounded p-1.5 flex items-start gap-1.5">
              <Repeat className="w-2.5 h-2.5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-navy text-[9px] font-medium">{d.drill}</p>
                <p className="font-mono text-[7px] text-gray-400">{d.freq}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* CTA */}
      <div className="bg-accent rounded-lg py-1.5 text-center">
        <span className="text-white text-[10px] font-display font-semibold">View My Journey</span>
      </div>
    </div>
  );
}

/** Mock pre-session brief — the coach's intel view before a lesson */
function PreSessionBriefMock(): React.JSX.Element {
  return (
    <div className="h-[260px] sm:h-[300px] p-3 text-[10px] overflow-hidden">
      {/* Back nav */}
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-gray-200">
        <ChevronLeft className="w-3 h-3 text-gray-400" />
        <span className="text-gray-400 text-[9px]">Back to Dashboard</span>
      </div>
      {/* Player header */}
      <div className="bg-white rounded-lg border border-gray-100 p-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0">
            <span className="text-[7px] font-bold">MN</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-navy text-[11px] font-semibold">James Okafor</span>
              <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">Short Game</span>
            </div>
            <p className="font-mono text-[8px] text-gray-400">2:00 PM · 45 min · Wedge Distance Control</p>
          </div>
          <div className="bg-accent text-white text-[8px] font-semibold px-2 py-1 rounded flex-shrink-0 flex items-center gap-0.5">
            Start Lesson <ChevronRight className="w-2.5 h-2.5" />
          </div>
        </div>
        {/* Quick stats */}
        <div className="flex gap-2 mt-2">
          {[
            { label: 'Handicap', value: '9.1', delta: '-1.2' },
            { label: 'Last Session', value: 'Mar 18' },
            { label: 'Connected', tags: ['Arccos', 'GHIN'] },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded px-2 py-1 text-center flex-1">
              <p className="font-mono text-[7px] text-gray-400 uppercase">{s.label}</p>
              {'value' in s && (
                <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                  <span className="font-mono text-[10px] text-navy font-bold">{s.value}</span>
                  {'delta' in s && <span className="font-mono text-[7px] text-accent font-semibold">{s.delta}</span>}
                </div>
              )}
              {'tags' in s && (
                <div className="flex gap-0.5 justify-center mt-0.5">
                  {s.tags?.map((t) => (
                    <span key={t} className="text-[6px] px-1 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Last session card */}
      <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 mb-1.5">
        <div className="flex items-center gap-1 mb-1">
          <FileText className="w-2.5 h-2.5 text-blue-500" />
          <span className="font-mono text-[7px] text-blue-500 uppercase font-bold">Last Session</span>
          <span className="font-mono text-[7px] text-gray-400 ml-auto">Mar 18, 2026</span>
        </div>
        <p className="text-navy text-[9px] font-medium mb-1">Session 8: Ground Pressure Gate Drill</p>
        <div className="grid grid-cols-4 gap-1 mb-1">
          {[
            { label: 'Strike', val: '71%', from: '54%', good: true },
            { label: 'Carry Var', val: '4.2yd', from: '8.1yd', good: true },
            { label: 'GIR sim', val: '44%', from: '33%', good: true },
            { label: 'Face-Path', val: '2.1°', from: '4.8°', good: true },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded px-1 py-0.5 text-center">
              <p className="font-mono text-[6px] text-gray-400 uppercase">{m.label}</p>
              <p className="font-mono text-[9px] text-navy font-bold">{m.val}</p>
              <p className="font-mono text-[6px] text-accent">from {m.from}</p>
            </div>
          ))}
        </div>
        <div className="border-l-2 border-accent pl-1.5 py-0.5">
          <p className="text-[7px] text-gray-400 uppercase font-semibold">Where We Left Off</p>
          <p className="text-[8px] text-navy">Pressure shift retained. Ready to extend to wedge distance ladder.</p>
        </div>
      </div>
      {/* On-course card */}
      <div className="bg-gray-50 rounded-lg border border-gray-100 p-2 mb-1.5">
        <div className="flex items-center gap-1 mb-1">
          <MapPin className="w-2.5 h-2.5 text-amber-500" />
          <span className="font-mono text-[7px] text-amber-500 uppercase font-bold">On the Course</span>
          <span className="font-mono text-[7px] text-gray-400 ml-auto">Bethpage Black</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[12px] font-bold text-navy">82</span>
          <span className="font-mono text-[8px] text-red-400 font-semibold">+10</span>
          <div className="h-3 w-px bg-gray-200" />
          <span className="text-[8px] text-red-400 font-semibold">GIR 33%</span>
          <span className="text-[8px] text-gray-500">FW 57%</span>
          <span className="text-[8px] text-red-400 font-semibold">31 putts</span>
        </div>
        <div className="flex items-start gap-1">
          <AlertTriangle className="w-2.5 h-2.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[8px] text-gray-600"><strong className="text-navy">GIR below 40%</strong> — approach shots are the biggest scoring leak.</p>
        </div>
      </div>
      {/* AI recommendation */}
      <div className="bg-accent/5 border border-accent/15 rounded-lg p-2">
        <div className="flex items-center gap-1 mb-0.5">
          <Zap className="w-2.5 h-2.5 text-accent" />
          <span className="font-mono text-[7px] text-accent uppercase font-bold">AI Recommendation</span>
        </div>
        <p className="text-[8px] text-gray-600 leading-relaxed">Confirm ground-pressure cue retention, then extend to wedge distance ladder (80/100/120 yds).</p>
      </div>
    </div>
  );
}

/** Player profile mock — player database pillar */
function PlayerProfileMock(): React.JSX.Element {
  return (
    <div className="h-[260px] sm:h-[300px] text-[10px] overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[9px] text-gray-400">9:41</span>
        <span className="font-display font-bold text-navy text-[11px]">
          LOOPER<span className="text-accent">.AI</span>
        </span>
        <div className="w-6" />
      </div>
      {/* Player header */}
      <div className="text-center mb-2 pb-1.5 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-1">
          <span className="text-[8px] font-bold">MN</span>
        </div>
        <p className="font-display text-navy text-[13px] font-semibold">Moe Norman</p>
        <p className="font-mono text-[8px] text-gray-400">Goal: Break 80</p>
      </div>
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {[
          { label: 'Handicap', value: '12.1', sub: 'from 13.8' },
          { label: 'Sessions', value: '9', sub: 'with Coach T' },
          { label: 'Last Lesson', value: 'Mar 24', sub: '' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded px-1.5 py-1 text-center">
            <p className="font-mono text-[6px] text-gray-400 uppercase">{s.label}</p>
            <p className="font-mono text-[11px] text-navy font-bold">{s.value}</p>
            {s.sub && <p className="font-mono text-[6px] text-accent">{s.sub}</p>}
          </div>
        ))}
      </div>
      {/* Connected sources */}
      <div className="mb-2">
        <p className="font-mono text-[7px] text-gray-400 uppercase tracking-wider mb-1">Connected</p>
        <div className="flex gap-1">
          {['Arccos', 'GHIN', 'TrackMan', 'WHOOP'].map((s) => (
            <span key={s} className="text-[7px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">{s}</span>
          ))}
        </div>
      </div>
      {/* Handicap trend */}
      <div className="mb-2">
        <p className="font-mono text-[7px] text-gray-400 uppercase tracking-wider mb-1">Handicap Trend</p>
        <svg viewBox="0 0 140 28" className="w-full" fill="none">
          <polyline
            points="0,24 20,22 40,20 60,18 80,16 100,12 120,10 140,6"
            stroke="#0D7C66"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,24 20,22 40,20 60,18 80,16 100,12 120,10 140,6"
            fill="url(#profile-grad)"
            opacity="0.15"
          />
          <defs>
            <linearGradient id="profile-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D7C66" />
              <stop offset="100%" stopColor="#0D7C66" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Strokes gained */}
      <div className="mb-2">
        <p className="font-mono text-[7px] text-gray-400 uppercase tracking-wider mb-1">Strokes Gained</p>
        <div className="grid grid-cols-4 gap-1">
          {[
            { cat: 'Drive', val: '-2.3', bad: true },
            { cat: 'Appr', val: '+0.8', bad: false },
            { cat: 'Short', val: '+1.1', bad: false },
            { cat: 'Putt', val: '+0.2', bad: false },
          ].map((sg) => (
            <div key={sg.cat} className="bg-gray-50 rounded px-1 py-0.5 text-center">
              <p className="font-mono text-[6px] text-gray-400">{sg.cat}</p>
              <p className={`font-mono text-[9px] font-bold ${sg.bad ? 'text-red-500' : 'text-accent'}`}>{sg.val}</p>
            </div>
          ))}
        </div>
      </div>
      {/* CTA */}
      <div className="bg-accent rounded-lg py-1.5 text-center">
        <span className="text-white text-[10px] font-display font-semibold">View Full Journey</span>
      </div>
    </div>
  );
}

/** Enhanced flywheel phase card */
export function _FlywheelPhase({
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
    <div className="glass-premium p-6 flex-1 min-w-0">
      <div
        className={`w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 ${
          pulse ? 'animate-ai-pulse' : ''
        }`}
      >
        {icon}
      </div>
      <p className="font-display text-base font-semibold text-white text-center">{label}</p>
      <p className="text-xs text-gray-500 mt-1.5 text-center">{sublabel}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

/** Mini data table for the Record flywheel phase */
export function _MiniDataTable({ active }: { active: boolean }): React.JSX.Element {
  const speed = useCountUp(132.4, 1800, active);
  const spin = useCountUp(6240, 1800, active);
  const carry = useCountUp(172, 1800, active);

  const rows = [
    { label: 'Ball Speed', value: speed.toFixed(1) },
    { label: 'Spin Rate', value: Math.round(spin).toLocaleString() },
    { label: 'Carry', value: Math.round(carry).toString() },
  ];

  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg">
          <span className="font-mono text-[10px] text-gray-500">{r.label}</span>
          <span className="font-mono text-[11px] text-accent-bright font-bold tabular-nums">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/** AI reasoning text for the Intelligence flywheel phase */
export function _MiniInsight({ active }: { active: boolean }): React.JSX.Element {
  const { displayText, isDone } = useTypewriter(
    'Face angle trending open. Correlating with grip pressure...',
    30,
    active ? 600 : 99999,
  );

  return (
    <div className="border-l-2 border-accent-bright bg-accent/5 p-3 rounded-r-lg">
      <p className="font-mono text-[10px] text-gray-300 leading-relaxed">
        {displayText}
        {!isDone && <span className="animate-blink text-accent-bright ml-0.5">|</span>}
      </p>
    </div>
  );
}

/** Mini sparkline for the Compounding flywheel phase */
export function _MiniSparkline(): React.JSX.Element {
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
      className={`relative pl-16 pb-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`absolute left-[22px] top-1 w-4 h-4 rounded-full border-2 transition-colors duration-500 ${
          isActive
            ? 'bg-accent-bright border-accent-bright animate-ai-pulse'
            : isVisible
            ? 'bg-accent/30 border-accent/50'
            : 'bg-white/10 border-white/10'
        }`}
      />

      <div className="glass-premium p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-bright font-medium">
            {phase.label}
          </span>
          <span className="font-mono text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{phase.time}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{phase.desc}</p>

        <div className="mt-4">
          {index === 0 && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="font-mono text-[10px] text-gray-400 leading-relaxed">{phase.detail}</p>
            </div>
          )}
          {index === 1 && (
            <div className="bg-accent-bright/10 rounded-lg p-3 flex items-center gap-3 border border-accent-bright/10">
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                Pattern confidence
              </p>
              <p className="font-mono text-lg text-accent-bright font-bold tabular-nums">
                {Math.round(confValue)}%
              </p>
            </div>
          )}
          {index === 2 && (
            <span className="inline-block bg-white/5 rounded-lg px-3 py-1.5 font-mono text-[11px] text-accent-bright border border-white/5">
              {phase.detail}
            </span>
          )}
          {index === 3 && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent-bright" />
              <span className="font-mono text-[11px] text-gray-300">{phase.detail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated 4-phase lesson timeline */
export function _LiveTimelineDemo(): React.JSX.Element {
  const [triggerRef, isInView] = useInViewTrigger(0.15);
  const visible = useStaggeredReveal(isInView ? 4 : 0, 2000, 500);

  return (
    <div ref={triggerRef} className="max-w-2xl mx-auto relative">
      <div className="absolute left-7 top-0 bottom-0 w-px bg-white/10" />
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
export function _StatCard({
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
    <div className="glass-premium metric-highlight p-10 text-center">
      <p className="font-mono text-5xl sm:text-6xl font-bold text-accent-bright tabular-nums">
        {end === 0 ? '0' : Math.round(value).toLocaleString()}
        {suffix && <span className="text-3xl sm:text-4xl ml-1">{suffix}</span>}
      </p>
      <p className="font-display text-sm text-gray-400 mt-4">{label}</p>
    </div>
  );
}

/* ─── Section Label ────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-bright font-medium text-center mb-4 badge-shimmer inline-block px-4 py-1.5 rounded-full mx-auto">
      {children}
    </p>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export default function PersonaSelector(): React.JSX.Element {
  const setRef = useScrollReveal(8);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="aurora-bg" />

      <div className="relative z-10">
        {/* ── Section 1: Hero — Identity & Positioning ──── */}
        <section
          ref={setRef(0)}
          className="fade-in-up min-h-screen flex flex-col items-center justify-center text-center px-6 relative pt-20"
        >
          {/* Floating orbs */}
          <div className="hero-orb w-[500px] h-[500px] bg-accent-bright/[0.04] top-[10%] left-[10%]" aria-hidden="true" />
          <div className="hero-orb w-[400px] h-[400px] bg-data-blue/[0.03] top-[20%] right-[10%]" style={{ animationDelay: '-5s' }} aria-hidden="true" />
          <div className="hero-orb w-[300px] h-[300px] bg-accent/[0.05] bottom-[20%] left-[30%]" style={{ animationDelay: '-10s' }} aria-hidden="true" />

          {/* Atmospheric SVG background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <svg
              className="absolute inset-0 w-full h-full opacity-60"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="sim-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(13,124,102,0.08)" strokeWidth="0.5" />
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
              <g fill="none" strokeWidth="0.6">
                <path d="M -100 500 Q 200 420 400 460 Q 600 500 800 440 Q 1000 380 1300 430" stroke="rgba(13,124,102,0.10)" />
                <path d="M -100 540 Q 250 470 450 510 Q 650 550 850 480 Q 1050 410 1300 470" stroke="rgba(13,124,102,0.08)" />
                <path d="M -100 580 Q 300 520 500 560 Q 700 600 900 530 Q 1100 460 1300 520" stroke="rgba(13,124,102,0.06)" />
              </g>
              <path
                d="M -100 470 Q 200 390 400 430 Q 600 470 800 400 Q 1000 340 1300 390"
                fill="none"
                stroke="rgba(15,168,122,0.14)"
                strokeWidth="1.2"
                filter="url(#contour-glow)"
              />
            </svg>
          </div>

          <div className="relative z-10">
            <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]">
              <span className="text-white">LOOPER</span>
              <span className="text-accent-bright">.AI</span>
            </h1>

            <p className="font-display text-lg sm:text-xl text-gray-400 mt-8 max-w-2xl mx-auto leading-relaxed font-light">
              The golf coaching Operating System for AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link
                to="/vision"
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-white font-medium w-56 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" />
                <span>Read the Thesis</span>
              </Link>
              <Link
                to="/coach"
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-white font-medium w-56 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Explore the Demo</span>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-10 scroll-indicator text-gray-600">
            <ChevronDown className="w-5 h-5" />
          </div>
        </section>

        {/* ── Section 2: Problem — Lead with Pain ────────── */}
        <section ref={setRef(1)} className="fade-in-up py-24 sm:py-32 px-6 section-glow">
          <div className="text-center mb-16">
            <SectionLabel>The Problem</SectionLabel>
            <p className="font-display text-2xl sm:text-4xl text-white font-medium leading-snug max-w-3xl mx-auto mt-4">
              Every lesson starts from scratch.
            </p>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed text-base">
              Coaches use 5&ndash;6 tools that don&apos;t talk to each other. Lessons go undocumented. Player data from rounds, practice, and wearables sits in separate apps. The most valuable part of coaching &mdash; what was said during the lesson, what actually clicked &mdash; just disappears.
            </p>
          </div>

          <InfinityLoop />

          <div className="max-w-3xl mx-auto mt-16">
            <p className="font-display text-lg sm:text-xl text-white font-medium text-center mb-8">
              The problem <span className="text-accent-bright">compounds.</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Layers, text: '5\u20136 apps that don\u2019t share a single data point. Insight stays trapped in whichever tool captured it.' },
                { icon: X, text: 'No persistent record. Every session starts cold, with the coach rebuilding context from memory.' },
                { icon: BarChart3, text: 'No way to measure what\u2019s actually working. Progress is a feeling, not a fact.' },
                { icon: Brain, text: 'A coach\u2019s expertise lives in their head. It doesn\u2019t travel with the player between sessions.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="glass-premium p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-coral/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-coral" />
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Social Proof — Voices from the Field ──────── */}
        <section className="py-16 sm:py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>From the Field</SectionLabel>
            </div>
            <div className="space-y-10">
              {SOCIAL_PROOF.map((item) => (
                <div key={item.attribution} className="max-w-3xl mx-auto border-l-2 border-accent-bright/20 pl-6 sm:pl-10">
                  <p className={`font-display text-lg sm:text-xl leading-relaxed ${item.type === 'quote' ? 'text-gray-200 italic' : 'text-gray-300'}`}>
                    {item.type === 'quote' ? '\u201C' : ''}{item.quote}{item.type === 'quote' ? '\u201D' : ''}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-white">{item.attribution}</p>
                    <span className="text-gray-600">/</span>
                    <p className="font-mono text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: The Product — Three Pillars ──────── */}
        <section id="product" ref={setRef(2)} className="fade-in-up py-24 sm:py-32 px-6 section-glow">
          <div className="text-center mb-16">
            <SectionLabel>The Product</SectionLabel>
            <p className="font-display text-2xl sm:text-4xl text-white font-medium leading-snug max-w-3xl mx-auto mt-4">
              Three tools. <span className="text-accent-bright">One intelligence.</span>
            </p>
          </div>

          {/* Three pillar wireframes — desktop */}
          <div className="hidden lg:grid grid-cols-3 gap-8 max-w-6xl mx-auto items-start mb-16">
            {/* Player Database */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Database className="w-4 h-4 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Player Database</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">Every player&apos;s history, connected and visible.</p>
              <DeviceFrame type="phone" className="mx-auto w-[200px] animate-float">
                <PlayerProfileMock />
              </DeviceFrame>
            </div>

            {/* Session Briefs */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <FileText className="w-4 h-4 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Session Briefs</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">AI-generated intel before every lesson. Automatic summary after.</p>
              <DeviceFrame type="laptop" className="animate-float">
                <PreSessionBriefMock />
              </DeviceFrame>
            </div>

            {/* AI Copilot */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Brain className="w-4 h-4 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">AI Copilot</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">Real-time reasoning alongside TrackMan. Confidence builds as data arrives.</p>
              <DeviceFrame type="sidebar" className="mx-auto w-[260px] animate-float">
                <SidebarMock />
              </DeviceFrame>
            </div>
          </div>

          {/* Three pillar wireframes — mobile/tablet */}
          <div className="lg:hidden space-y-12 max-w-sm mx-auto mb-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Database className="w-4 h-4 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Player Database</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">Every player&apos;s history, connected and visible.</p>
              <DeviceFrame type="phone" className="mx-auto w-[200px] animate-float">
                <PlayerProfileMock />
              </DeviceFrame>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <FileText className="w-4 h-4 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">Session Briefs</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">AI-generated intel before every lesson. Automatic summary after.</p>
              <DeviceFrame type="laptop" className="animate-float">
                <PreSessionBriefMock />
              </DeviceFrame>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <Brain className="w-4 h-4 text-accent-bright" />
                <p className="font-display text-sm font-semibold text-white">AI Copilot</p>
              </div>
              <p className="text-xs text-gray-500 mb-4">Real-time reasoning alongside TrackMan. Confidence builds as data arrives.</p>
              <DeviceFrame type="sidebar" className="mx-auto w-[280px] animate-float">
                <SidebarMock />
              </DeviceFrame>
            </div>
          </div>

          {/* Confidence evolution — the "holy shit" moment */}
          <div className="max-w-3xl mx-auto">
            <p className="text-center font-display text-lg text-white font-medium mb-6">
              The AI earns its conclusions in real time.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              {[
                { pct: 52, color: '#C93B3B', label: 'Early signal', desc: 'Face-to-path volatility detected across 6 shots' },
                { pct: 71, color: '#D4980B', label: 'Pattern forming', desc: 'Cross-referencing session history confirms driver trend' },
                { pct: 87, color: '#0FA87A', label: 'High confidence', desc: 'Driver SG declining across 8 sessions — never addressed' },
              ].map((step) => (
                <div key={step.pct} className="glass-premium p-5 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <svg viewBox="0 0 36 36" className="w-10 h-10 flex-shrink-0">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none"
                        stroke={step.color} strokeWidth="3"
                        strokeDasharray={`${(step.pct / 100) * 94.2} 94.2`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <span className="font-mono text-2xl font-bold tabular-nums" style={{ color: step.color }}>
                      {step.pct}%
                    </span>
                  </div>
                  <p className="font-display text-sm font-semibold text-white mb-1">{step.label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TrackMan integration callout */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="glass-premium p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#E8862A]/10 border border-[#E8862A]/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-[#E8862A]" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-white">Works with TrackMan Performance Studio</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Sits alongside the tool coaches already use. Windows snap, shared screen, zero workflow change. Foresight and Full Swing support planned.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Evolution ──────────────────────── */}
        <section id="vision" ref={setRef(3)} className="fade-in-up py-24 sm:py-32 px-6 section-glow">
          <div className="text-center mb-16">
            <SectionLabel>The Evolution</SectionLabel>
            <p className="font-display text-2xl sm:text-4xl text-white font-medium leading-snug max-w-3xl mx-auto mt-4">
              Record. Reason. <span className="text-accent-bright">Compound.</span>
            </p>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              Looper starts by capturing the session record. That data becomes training data. Over time, the system gets smarter about each player, each coach, each pattern.
            </p>
          </div>

          {/* Desktop: three columns with arrows */}
          <div className="hidden sm:flex items-start max-w-5xl mx-auto">
            {EVOLUTION_STAGES.map((stage, stageIdx) => (
              <div key={stage.stage} className="flex items-start flex-1 min-w-0">
                <div className="flex-1 min-w-0 text-center px-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-bright font-medium mb-4">
                    {stage.stage}
                  </p>
                  <p className="font-display text-lg font-semibold text-white leading-snug mb-3">
                    {stage.outcome}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {stage.supporting}
                  </p>
                </div>
                {stageIdx < EVOLUTION_STAGES.length - 1 && (
                  <div className="flex items-center shrink-0 pt-8">
                    <ArrowRight className="w-5 h-5 text-accent-bright/25" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="sm:hidden space-y-8 max-w-sm mx-auto">
            {EVOLUTION_STAGES.map((stage, stageIdx) => (
              <div key={stage.stage}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-bright font-medium mb-3">
                  {stage.stage}
                </p>
                <p className="font-display text-lg font-semibold text-white leading-snug mb-2">
                  {stage.outcome}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {stage.supporting}
                </p>
                {stageIdx < EVOLUTION_STAGES.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <ArrowDown className="w-4 h-4 text-accent-bright/25" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Why Academies Win ─────────────────────────── */}
        <section className="fade-in-up py-24 sm:py-32 px-6 section-glow">
          <div className="text-center mb-16">
            <SectionLabel>For Academies</SectionLabel>
            <p className="font-display text-2xl sm:text-4xl text-white font-medium leading-snug max-w-3xl mx-auto mt-4">
              What&apos;s in it for <span className="text-accent-bright">your business.</span>
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Retention */}
            <div className="glass-premium p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-bright/10 border border-accent-bright/20 flex items-center justify-center mx-auto mb-5">
                <Users className="w-5 h-5 text-accent-bright" />
              </div>
              <p className="font-display text-lg font-semibold text-white mb-2">
                Retention
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Players who see their progress stay longer. Lesson summaries, practice plans, and a visible journey turn one-off lessons into ongoing coaching relationships.
              </p>
            </div>

            {/* Operations */}
            <div className="glass-premium p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-bright/10 border border-accent-bright/20 flex items-center justify-center mx-auto mb-5">
                <Layers className="w-5 h-5 text-accent-bright" />
              </div>
              <p className="font-display text-lg font-semibold text-white mb-2">
                Operations
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Works alongside TrackMan, Foresight, and the tools coaches already use. No new workflows. Ambient capture replaces manual notes. Post-session review takes 30 seconds.
              </p>
            </div>

            {/* Revenue */}
            <div className="glass-premium p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-bright/10 border border-accent-bright/20 flex items-center justify-center mx-auto mb-5">
                <TrendingUp className="w-5 h-5 text-accent-bright" />
              </div>
              <p className="font-display text-lg font-semibold text-white mb-2">
                New Revenue
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Digital coaching twins extend your reach between lessons. Coaching IP becomes a product. Higher retention and visible results drive referrals without anyone writing a post.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 6: Analogs — Market Precedent ────── */}
        <section id="analogs" ref={setRef(4)} className="fade-in-up py-24 sm:py-32 px-6 section-glow">
          <div className="text-center mb-16">
            <SectionLabel>Market Precedent</SectionLabel>
            <p className="font-display text-2xl sm:text-4xl text-white font-medium leading-snug max-w-3xl mx-auto mt-4">
              This playbook has <span className="text-accent-bright">worked before.</span>
            </p>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              Start by capturing the record in a fragmented, relationship-driven industry. Become indispensable. Then layer intelligence on top of the data you already own.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {ANALOGS.map((analog) => {
              const Icon = analog.icon;
              return (
                <div key={analog.name} className="glass-premium p-8 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent-bright/10 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-accent-bright transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="font-display text-base font-semibold text-white">{analog.name}</p>
                      <p className="font-mono text-[10px] text-accent-bright/60 uppercase tracking-wider">{analog.domain}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{analog.desc}</p>
                  <p className="font-mono text-sm text-accent-bright font-bold">{analog.metric}</p>
                </div>
              );
            })}
          </div>

          {/* Market size punchline */}
          <div className="max-w-3xl mx-auto glass-premium p-8 text-center">
            <p className="font-display text-lg text-white font-medium mb-3">
              The playbook is proven. The market is real.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <div>
                <p className="font-mono text-2xl text-accent-bright font-bold">29,000+</p>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-1">PGA Professionals in the US</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div>
                <p className="font-mono text-2xl text-accent-bright font-bold">$2.6B</p>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-1">US golf instruction market</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10" />
              <div>
                <p className="font-mono text-2xl text-accent-bright font-bold">37M</p>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mt-1">Golfers in the US</p>
              </div>
            </div>
          </div>

        </section>

        {/* ── Section 7: Closing ─────────────────────────── */}
        <section ref={setRef(5)} className="fade-in-up py-24 sm:py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-display text-3xl sm:text-5xl text-white font-medium leading-tight">
              Memory enables intelligence.
            </p>
            <p className="font-display text-3xl sm:text-5xl text-accent-bright font-medium leading-tight mt-2">
              Intelligence enables coaching.
            </p>
            <div className="mt-12">
              <Link
                to="/coach"
                className="inline-flex items-center gap-3 bg-accent-bright hover:bg-accent-bright/90 text-white font-medium px-10 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-accent-bright/20 hover:shadow-accent-bright/30 hover:-translate-y-0.5 text-lg"
              >
                <span>Experience the Demo</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer ref={setRef(6)} className="fade-in-up py-16 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display font-bold text-gray-600 text-sm tracking-wide">
              LOOPER<span className="text-accent-bright/40">.AI</span>
            </span>
            <p className="text-xs text-gray-600">
              Confidential &mdash; Looper.AI &mdash; March 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
