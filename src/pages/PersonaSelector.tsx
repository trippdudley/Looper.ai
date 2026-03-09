import { Link } from 'react-router-dom';
import { User, GraduationCap, Wrench, Database } from 'lucide-react';

const personas = [
  {
    label: "I'm a Golfer",
    icon: User,
    description: "Track your improvement, review lessons, practice with purpose",
    path: "/golfer",
    dark: false,
  },
  {
    label: "I'm a Coach",
    icon: GraduationCap,
    description: "Capture sessions, manage students, see what works",
    path: "/coach",
    dark: false,
  },
  {
    label: "I'm a Fitter",
    icon: Wrench,
    description: "Access coaching history, fit with context, see swing evolution",
    path: "/fitter",
    dark: false,
  },
  {
    label: "Platform Spine",
    icon: Database,
    description: "The data architecture, audience engine, and monetization layer",
    path: "/spine",
    dark: true,
  },
];

export default function PersonaSelector() {
  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl font-bold text-navy tracking-tight mb-3">
          LOOPER
        </h1>
        <p className="text-gray-500 text-lg">
          The Platform to Power Golf in the Age of AI
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {personas.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.path}
              to={p.path}
              className={`group rounded-xl p-8 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                p.dark
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-navy shadow-sm'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  p.dark ? 'bg-accent/20' : 'bg-bg-light'
                }`}
              >
                <Icon className={`w-7 h-7 ${p.dark ? 'text-accent-light' : 'text-accent'}`} />
              </div>
              <h2 className="text-lg font-semibold mb-2">{p.label}</h2>
              <p className={`text-sm leading-relaxed ${p.dark ? 'text-gray-300' : 'text-gray-500'}`}>
                {p.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link to="/thesis" className="text-navy font-medium text-sm hover:underline inline-block">
          Read the Thesis &rarr;
        </Link>
      </div>

      <p className="text-gray-400 text-sm mt-12">
        Clickable Prototype — March 2026
      </p>
    </div>
  );
}
