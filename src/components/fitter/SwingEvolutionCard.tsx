import { Sparkles } from 'lucide-react';

interface TimelineEvent {
  date: string;
  label: string;
  metrics?: string;
  highlight?: boolean;
}

const timeline: TimelineEvent[] = [
  { date: 'Nov 2024', label: 'Last fitting', metrics: 'Attack angle +3.2° · Club speed 92.8 mph' },
  { date: 'Jan 2025', label: 'Coaching focus on weight shift begins' },
  { date: 'Oct 2025', label: 'Attack angle shifts', metrics: 'Attack angle +2.4° · Speed 94.5 mph' },
  { date: 'Mar 2026', label: 'Today', metrics: 'Attack angle +2.1° · Club speed 95.2 mph', highlight: true },
];

const aiInterpretation =
  'Attack angle steepened 1.1° and speed increased 2.4 mph since last fitting. Current 9° loft is likely under-lofted for the new delivery. Recommend testing 10.5°.';

export default function SwingEvolutionCard() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">
        Swing Evolution Since Last Fitting
      </h3>

      {/* Timeline */}
      <div className="relative pl-6 space-y-5">
        {/* Vertical line */}
        <div className="absolute left-[9px] top-1 bottom-1 w-px bg-white/10" />

        {timeline.map((evt, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div
              className={`absolute -left-6 top-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                evt.highlight
                  ? 'border-accent-light bg-accent/20'
                  : 'border-white/20 bg-card-dark'
              }`}
            >
              {evt.highlight && <div className="w-2 h-2 rounded-full bg-accent-light" />}
            </div>

            <div>
              <span className="text-[10px] text-gray-500 font-mono">{evt.date}</span>
              <p className={`text-sm ${evt.highlight ? 'text-white font-semibold' : 'text-gray-300'}`}>
                {evt.label}
              </p>
              {evt.metrics && (
                <p className="text-xs text-gray-500 font-mono mt-0.5">{evt.metrics}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Interpretation */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-light" />
          <span className="text-[11px] text-accent-light font-semibold uppercase tracking-wide">
            AI Interpretation
          </span>
        </div>
        <p className="text-[13px] text-white/60 leading-relaxed">{aiInterpretation}</p>
      </div>
    </div>
  );
}
