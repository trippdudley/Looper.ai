import { Link } from 'react-router-dom';
import {
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  Users,
  Megaphone,
  Mail,
  CreditCard,
  BarChart3,
  TrendingDown,
  Activity,
  Target,
} from 'lucide-react';

// ---------- types ----------

interface NavCard {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  route: string;
  accent: string;
  accentBg: string;
  features: { icon: React.ElementType; label: string }[];
  live: boolean;
}

// ---------- data ----------

const navCards: NavCard[] = [
  {
    title: 'Coaching',
    subtitle: 'Lessons, briefs, and player progress',
    icon: GraduationCap,
    route: '/coach',
    accent: 'text-accent',
    accentBg: 'bg-accent/10',
    features: [
      { icon: CalendarCheck, label: "Today's schedule" },
      { icon: ClipboardList, label: 'Pre-session briefs' },
      { icon: Users, label: 'Player roster' },
    ],
    live: true,
  },
  {
    title: 'Operations',
    subtitle: 'Marketing, messaging, and business tools',
    icon: Megaphone,
    route: '/operations',
    accent: 'text-data-blue',
    accentBg: 'bg-data-blue/10',
    features: [
      { icon: Mail, label: 'Client messaging' },
      { icon: Target, label: 'Campaign manager' },
      { icon: CreditCard, label: 'Billing and packages' },
    ],
    live: false,
  },
  {
    title: 'Analytics',
    subtitle: 'Academy-wide performance data',
    icon: BarChart3,
    route: '/analytics',
    accent: 'text-accent-bright',
    accentBg: 'bg-accent-bright/10',
    features: [
      { icon: Users, label: 'Active students' },
      { icon: TrendingDown, label: 'Avg handicap trend' },
      { icon: Activity, label: 'Lesson volume' },
    ],
    live: false,
  },
];

const academyMetrics = [
  { label: 'Active Students', value: '24', delta: '+3 this month' },
  { label: 'Avg Handicap', value: '14.2', delta: '-0.8 since Jan' },
  { label: 'Lessons This Week', value: '18', delta: '6 remaining' },
  { label: 'Practice Compliance', value: '71%', delta: '+4% vs last month' },
];

// ---------- component ----------

/** OS-level home page — the single pane of glass for a coach or academy director. */
export default function OSHome() {
  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            </Link>
            <div>
              <h1 className="font-display text-3xl font-extrabold text-navy tracking-[0.05em]">
                LOOPER
                <span className="text-accent">.AI</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Coaching OS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-sm font-semibold text-accent">MT</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-navy">Coach Thompson</p>
              <p className="text-xs text-gray-400">Pine Valley Academy</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Welcome section */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-navy">
            Good morning, Coach
          </h2>
          <p className="text-gray-500 mt-1">
            3 lessons on the books today. 2 briefs ready for review.
          </p>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {navCards.map((card) => {
            const Icon = card.icon;
            const isPlaceholder = !card.live;

            const cardClass = `group relative bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-6 transition-all duration-150 ${
              card.live
                ? 'cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                : 'cursor-default'
            }`;

            const cardContent = (
              <>
                {/* Icon + title row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-lg ${card.accentBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.accent}`} strokeWidth={1.5} />
                  </div>
                  {card.live ? (
                    <ChevronRight
                      className="w-4 h-4 text-gray-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                      strokeWidth={2}
                    />
                  ) : (
                    <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full">
                      Coming soon
                    </span>
                  )}
                </div>

                {/* Title + subtitle */}
                <h3 className="font-display text-lg font-semibold text-navy mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  {card.subtitle}
                </p>

                {/* Feature list */}
                <ul className="space-y-2">
                  {card.features.map((feature) => {
                    const FIcon = feature.icon;
                    return (
                      <li key={feature.label} className="flex items-center gap-2.5">
                        <FIcon
                          className={`w-3.5 h-3.5 ${isPlaceholder ? 'text-gray-300' : 'text-gray-400'}`}
                          strokeWidth={1.5}
                        />
                        <span className={`text-xs ${isPlaceholder ? 'text-gray-400' : 'text-gray-500'}`}>
                          {feature.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            );

            return card.live ? (
              <Link key={card.title} to={card.route} className={cardClass}>
                {cardContent}
              </Link>
            ) : (
              <div key={card.title} className={cardClass}>
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Academy snapshot */}
        <div className="mb-6">
          <h3 className="font-display text-base font-semibold text-navy mb-4">
            Academy Snapshot
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {academyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] p-4"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {metric.label}
                </p>
                <p className="font-mono text-2xl font-bold text-navy">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {metric.delta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
