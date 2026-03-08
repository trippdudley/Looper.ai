import { AlertTriangle, MessageCircle, Dumbbell, BarChart3 } from 'lucide-react';
import MetricComparison from '../charts/MetricComparison';

interface SessionSummaryProps {
  faults: string[];
  coachingCues: string[];
  drills: { name: string; focus: string }[];
  metrics: { metric: string; before: number; after: number; unit: string }[];
}

export default function SessionSummary({ faults, coachingCues, drills, metrics }: SessionSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Faults */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-coral" />
          <h3 className="text-sm font-semibold text-navy uppercase tracking-wide">Faults Identified</h3>
        </div>
        <ul className="space-y-1.5">
          {faults.map((fault, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
              {fault}
            </li>
          ))}
        </ul>
      </section>

      {/* Coaching Cues */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-navy uppercase tracking-wide">Coaching Cues</h3>
        </div>
        <ul className="space-y-1.5">
          {coachingCues.map((cue, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {cue}
            </li>
          ))}
        </ul>
      </section>

      {/* Drills */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell className="w-4 h-4 text-data-blue" />
          <h3 className="text-sm font-semibold text-navy uppercase tracking-wide">Drills</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {drills.map((drill, i) => (
            <div key={i} className="bg-bg-light rounded-lg px-3 py-2">
              <p className="text-sm font-medium text-navy">{drill.name}</p>
              <p className="text-xs text-gray-500">{drill.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-warm-amber" />
          <h3 className="text-sm font-semibold text-navy uppercase tracking-wide">Key Metrics</h3>
        </div>
        <div className="bg-bg-light rounded-lg px-4 py-2 divide-y divide-gray-200">
          {metrics.map((m, i) => (
            <MetricComparison
              key={i}
              label={m.metric}
              before={m.before}
              after={m.after}
              unit={m.unit}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
