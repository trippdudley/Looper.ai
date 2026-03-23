import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Route } from 'lucide-react';

const personas = [
  {
    label: "I'm a Coach",
    icon: GraduationCap,
    description: "Capture sessions, diagnose limiting factors, see what works",
    path: "/coach",
  },
  {
    label: "I'm a Player",
    icon: Route,
    description: "Your full game on one timeline \u2014 every source, every session, one story",
    path: "/player",
  },
];

export default function PersonaSelector() {
  const heroRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

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

    const sections = [heroRef.current, visionRef.current, featureRef.current, personaRef.current];
    sections.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="ambient-bg" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 max-w-4xl mx-auto">
        {/* Hero */}
        <div ref={heroRef} className="fade-in-up text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-2">
            Looper.AI
          </h1>
          <p className="text-sm uppercase tracking-widest text-accent-light font-medium mb-1">
            Expertise, engineered.
          </p>
          <p className="text-base text-gray-400">
            The AI-native coaching copilot for golf
          </p>
          <div className="w-20 h-px bg-accent mx-auto my-6" />
        </div>

        {/* Vision in Action — sizzle reel entry */}
        <div ref={visionRef} className="fade-in-up max-w-3xl mx-auto mb-6 w-full">
          <Link to="/vision" className="flex items-center justify-between bg-[#E6F5F1] border-l-[3px] border-accent rounded-[10px] px-5 py-3.5 no-underline">
            <div>
              <div className="text-base font-bold text-navy mb-0.5">
                Vision in Action
              </div>
              <div className="text-[13px] text-gray-600">
                Watch the 90-second product walkthrough
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0 ml-4">
              <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-0.5" />
            </div>
          </Link>
        </div>

        {/* Feature links — Narrative + Thesis */}
        <div ref={featureRef} className="fade-in-up grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12 w-full">
          <Link to="/narrative" className="glass-card p-6 block">
            <p className="text-[11px] uppercase tracking-wider text-accent-light font-semibold mb-2">
              THE NARRATIVE
            </p>
            <p className="text-white font-medium text-[15px]">
              Read the Full Story
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Thesis, problem, solution, flywheel, roadmap, and business model
            </p>
          </Link>

          <Link to="/thesis" className="glass-card p-6 block">
            <p className="text-[11px] uppercase tracking-wider text-accent-light font-semibold mb-2">
              THE THESIS
            </p>
            <p className="text-white font-medium text-[15px]">
              Read the Business Case
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Five-year model, moat analysis, and market sizing
            </p>
          </Link>
        </div>

        {/* Persona cards — staggered entrance */}
        <div ref={personaRef} className="fade-in-up w-full">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold text-center mb-4">
            Enter the Prototype
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {personas.map((p, i) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.path}
                  to={p.path}
                  className="glass-card p-6 text-center block animate-stagger-in"
                  style={{ animationDelay: `${200 + i * 150}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-accent-light" />
                  </div>
                  <h2 className="text-white font-semibold text-[15px] mb-1">
                    {p.label}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {p.description}
                  </p>
                </Link>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <p className="text-xs text-gray-600 text-center mt-16">
          Confidential &mdash; Clickable Prototype &mdash; March 2026
        </p>
      </div>
    </div>
  );
}
