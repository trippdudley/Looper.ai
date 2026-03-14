import { Users, Activity, DollarSign, TrendingUp, BookOpen, Sparkles, Target } from 'lucide-react';
import { audienceSegments } from '../../../data/audienceSegments';

const totalProfiled = audienceSegments.reduce((s, seg) => s + seg.size, 0);

const metrics = [
  { label: 'Total Profiled Golfers', value: totalProfiled.toLocaleString(), icon: Users, color: 'text-white' },
  { label: 'Monthly Active Users', value: '22,400', icon: Activity, color: 'text-white' },
  { label: 'Blended CPM', value: '$43', icon: DollarSign, color: 'text-warm-amber' },
  { label: 'Projected Annual Data Revenue', value: '$3.4M', icon: TrendingUp, color: 'text-accent' },
];

const howItWorks = [
  {
    step: '1',
    title: 'Golfer takes a lesson',
    description: 'Session data flows into the coaching record — swing metrics, faults, drills, and outcomes are captured in real-time.',
    icon: BookOpen,
    iconColor: 'text-accent',
  },
  {
    step: '2',
    title: 'AI structures the data',
    description: 'Faults, drills, outcomes, and intent signals are extracted by Claude — creating the richest golfer profile in the sport.',
    icon: Sparkles,
    iconColor: 'text-data-blue',
  },
  {
    step: '3',
    title: 'Segments activate',
    description: 'Brands reach in-market golfers with endemic, high-CPM placements — powered by first-party coaching data, not cookies.',
    icon: Target,
    iconColor: 'text-warm-amber',
  },
];

export default function AudienceEngine() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Audience Engine</h1>
        <p className="text-gray-400 mt-1">
          First-party behavioral segments powered by coaching data — the most valuable targeting signals in golf.
        </p>
      </div>

      {/* Top Row — Monetization Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="relative bg-card-dark rounded-xl border border-border-dark p-5 overflow-hidden"
            >
              <Icon className="absolute top-4 right-4 w-12 h-12 text-white opacity-20" />
              <p className="text-gray-400 text-xs uppercase">{m.label}</p>
              <p className={`text-3xl font-mono ${m.color} mt-1`}>{m.value}</p>
            </div>
          );
        })}
      </div>

      {/* Segment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {audienceSegments.map((seg) => (
          <div
            key={seg.id}
            className="bg-card-dark rounded-xl border border-border-dark p-5"
          >
            <h3 className="text-lg font-bold text-white">{seg.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{seg.description}</p>

            {/* Stats row */}
            <div className="flex gap-4 mt-3 flex-wrap">
              <span className="text-white font-mono text-sm">{seg.size.toLocaleString()} golfers</span>
              <span className="text-accent font-medium text-sm">{seg.growthRate}</span>
              <span className="text-warm-amber font-mono text-lg font-bold">${seg.estimatedCPM}</span>
              <span className="text-accent font-mono text-sm">${(seg.annualValue / 1000).toFixed(0)}K</span>
            </div>

            {/* Data Signals */}
            <div className="mt-3 border-t border-border-dark pt-3">
              <p className="text-xs text-gray-500 uppercase mb-1">Data Signals</p>
              <div className="flex flex-wrap gap-1">
                {seg.dataSignals.map((signal) => (
                  <span
                    key={signal}
                    className="bg-white/10 text-gray-300 rounded-full px-2 py-0.5 text-xs"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            {/* Interested Partners */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 uppercase mb-1">Interested Partners</p>
              <div className="flex flex-wrap gap-1">
                {seg.interestedPartners.map((partner) => (
                  <span
                    key={partner}
                    className="bg-warm-amber/10 text-warm-amber rounded-full px-2 py-0.5 text-xs"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mt-8">
        <h2 className="text-xl text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-3 gap-4">
          {howItWorks.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-card-dark rounded-xl border border-border-dark p-5"
              >
                <p className="text-4xl font-mono text-accent/30">{step.step}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Icon className={`w-5 h-5 ${step.iconColor}`} />
                  <h3 className="text-white font-semibold">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mt-2">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
