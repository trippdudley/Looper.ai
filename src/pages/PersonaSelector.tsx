import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, GraduationCap, Wrench, Play, ArrowRight, Database, Route } from 'lucide-react';

const personas = [
  {
    label: "Player",
    module: "01",
    icon: Route,
    description: "Your full game on one timeline — every source, every session, one story",
    path: "/player",
    accent: "rgba(77, 184, 138, 0.4)",
  },
  {
    label: "Golfer",
    module: "02",
    icon: User,
    description: "Track improvement, review lessons, practice with purpose",
    path: "/golfer",
    accent: "rgba(77, 184, 138, 0.5)",
  },
  {
    label: "Coach",
    module: "03",
    icon: GraduationCap,
    description: "Capture sessions, diagnose limiting factors, see what works",
    path: "/coach",
    accent: "rgba(77, 184, 138, 0.65)",
  },
  {
    label: "Fitter",
    module: "04",
    icon: Wrench,
    description: "Fit with full context, estimate outcomes, produce auditable builds",
    path: "/fitter",
    accent: "rgba(77, 184, 138, 0.8)",
  },
];

export default function PersonaSelector() {
  const heroRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = [heroRef.current, visionRef.current, featureRef.current, personaRef.current];

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

    sections.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Fallback: reveal all after a short delay (handles edge cases where
    // IntersectionObserver doesn't fire, e.g. content already in viewport)
    const fallback = setTimeout(() => {
      sections.forEach((el) => el?.classList.add('visible'));
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="ambient-bg" />
      {/* Grain overlay for texture */}
      <div className="grain-overlay" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 max-w-4xl mx-auto">
        {/* Hero */}
        <div ref={heroRef} className="fade-in-up text-center mb-14">
          {/* Brand mark */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="brand-ring">
              <div className="brand-ring-inner" />
            </div>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Looper<span className="text-accent">.AI</span>
            </h1>
          </div>
          <p style={{ fontFamily: "'Instrument Serif', serif" }}
             className="text-lg sm:text-xl italic text-accent-light/80 mb-1">
            Expertise, engineered.
          </p>
          <p className="text-sm text-gray-500 font-mono tracking-wide">
            The decision platform for golf coaching &amp; fitting
          </p>
        </div>

        {/* Vision in Action — dark-themed */}
        <div ref={visionRef} className="fade-in-up max-w-3xl mx-auto mb-8 w-full">
          <Link to="/vision" className="group glass-card flex items-center justify-between p-5 relative overflow-hidden">
            {/* Subtle accent glow on left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-l-2xl" />
            <div className="pl-3">
              <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                   className="text-[15px] font-semibold text-white mb-0.5 flex items-center gap-2">
                Vision in Action
                <ArrowRight className="w-3.5 h-3.5 text-accent opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
              <div className="text-[13px] text-gray-400">
                Watch the 90-second product walkthrough
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0 ml-4 group-hover:bg-accent/25 transition-colors">
              <Play className="w-3.5 h-3.5 text-accent fill-accent ml-0.5" />
            </div>
          </Link>
        </div>

        {/* Feature links — Narrative + Thesis */}
        <div ref={featureRef} className="fade-in-up grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-14 w-full">
          <Link to="/narrative" className="glass-card p-6 block group">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent-light/60 font-mono mb-2">
              The Narrative
            </p>
            <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
               className="text-white font-medium text-[15px] group-hover:text-accent-light transition-colors">
              Read the Full Story
            </p>
            <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">
              Thesis, problem, solution, flywheel, roadmap, and business model
            </p>
          </Link>

          <Link to="/thesis" className="glass-card p-6 block group">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent-light/60 font-mono mb-2">
              The Thesis
            </p>
            <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
               className="text-white font-medium text-[15px] group-hover:text-accent-light transition-colors">
              Read the Business Case
            </p>
            <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">
              Five-year model, moat analysis, and market sizing
            </p>
          </Link>
        </div>

        {/* OS Module Cards */}
        <div ref={personaRef} className="fade-in-up w-full">
          {/* Section divider */}
          <div className="flex items-center gap-4 max-w-3xl mx-auto mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-dark to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-mono whitespace-nowrap">
              Operating System
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border-dark to-transparent" />
          </div>

          {/* Unified platform container */}
          <div className="max-w-3xl mx-auto os-container relative">
            {/* Connecting spine line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-[1px] bg-gradient-to-b from-transparent via-accent/20 to-transparent hidden sm:block pointer-events-none z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-border-dark/50 rounded-2xl overflow-hidden border border-border-dark/60">
              {personas.map((p, i) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className="os-module group animate-stagger-in"
                    style={{ animationDelay: `${200 + i * 150}ms` }}
                  >
                    {/* Module header bar */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono text-accent/50 tracking-wider">
                        MOD.{p.module}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent group-hover:shadow-[0_0_6px_rgba(58,157,120,0.5)] transition-all duration-300" />
                    </div>

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-accent/8 border border-accent/10 flex items-center justify-center mb-3 group-hover:border-accent/25 group-hover:bg-accent/12 transition-all duration-300">
                      <Icon className="w-5 h-5 text-accent-light/70 group-hover:text-accent-light transition-colors" />
                    </div>

                    {/* Label + description */}
                    <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                        className="text-white font-semibold text-[15px] mb-1.5">
                      {p.label}
                    </h2>
                    <p className="text-[12px] text-gray-500 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Bottom action hint */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-[10px] font-mono text-accent/60 tracking-wide">ENTER</span>
                      <ArrowRight className="w-3 h-3 text-accent/60" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Platform Engine — fourth module, spans full width */}
            <div className="mt-px">
              <Link to="/spine" className="os-module-spine group flex items-center justify-between rounded-b-2xl border border-t-0 border-border-dark/60">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-data-blue/10 border border-data-blue/15 flex items-center justify-center group-hover:border-data-blue/30 transition-all">
                    <Database className="w-4 h-4 text-data-blue/60 group-hover:text-data-blue transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-data-blue/40 tracking-wider">MOD.00</span>
                      <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                         className="text-white/90 font-medium text-[14px]">
                        Data Spine
                      </p>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      30 attributes &middot; 21 integrations &middot; 6 audience segments
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-data-blue transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-3xl mx-auto w-full mt-16">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border-dark/50 to-transparent mb-6" />
          <p className="text-[11px] text-gray-600 text-center font-mono tracking-wide">
            Confidential &mdash; Clickable Prototype &mdash; March 2026
          </p>
        </div>
      </div>
    </div>
  );
}
