import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, GraduationCap, Wrench } from 'lucide-react';

const personas = [
  {
    label: "I'm a Golfer",
    icon: User,
    description: "Track improvement, review lessons, practice with purpose",
    path: "/golfer",
  },
  {
    label: "I'm a Coach",
    icon: GraduationCap,
    description: "Capture sessions, diagnose limiting factors, see what works",
    path: "/coach",
  },
  {
    label: "I'm a Fitter",
    icon: Wrench,
    description: "Fit with full context, estimate outcomes, produce auditable builds",
    path: "/fitter",
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
            The decision platform for golf coaching and fitting
          </p>
          <div className="w-20 h-px bg-accent mx-auto my-6" />
        </div>

        {/* Vision in Action — sizzle reel entry */}
        <div ref={visionRef} className="fade-in-up max-w-3xl mx-auto mb-6 w-full">
          <Link to="/vision" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#E6F5F1',
            borderLeft: '3px solid #0D7C66',
            borderRadius: 10,
            padding: '14px 20px',
            textDecoration: 'none',
          }}>
            <div>
              <div style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: '#1A1F2B',
                marginBottom: 2,
              }}>
                Vision in Action
              </div>
              <div style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: '#4B5563',
              }}>
                Watch the 90-second product walkthrough
              </div>
            </div>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#0D7C66',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 16,
            }}>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid white',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                marginLeft: 2,
              }} />
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

        {/* Persona cards */}
        <div ref={personaRef} className="fade-in-up w-full">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold text-center mb-4">
            Enter the Prototype
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {personas.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.path}
                  to={p.path}
                  className="glass-card p-6 text-center block"
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

          {/* Platform Engine — below prototype cards */}
          <div className="max-w-3xl mx-auto mt-6">
            <Link to="/spine" className="glass-card p-6 block text-center">
              <p className="text-[11px] uppercase tracking-wider text-data-blue font-semibold mb-2">
                PLATFORM ENGINE
              </p>
              <p className="text-white font-medium text-[15px]">
                Explore the Data Spine
              </p>
              <p className="text-sm text-gray-400 mt-1">
                30 attributes, 21 integrations, 6 audience segments
              </p>
            </Link>
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
