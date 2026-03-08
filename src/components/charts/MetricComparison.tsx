import { ArrowRight } from 'lucide-react';

interface MetricComparisonProps {
  label: string;
  before: number;
  after: number;
  unit: string;
  precision?: number;
}

export default function MetricComparison({ label, before, after, unit, precision = 1 }: MetricComparisonProps) {
  const delta = after - before;
  const improved = delta > 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-gray-500 w-32">{label}</span>
      <span className="text-sm font-mono text-gray-700">{before.toFixed(precision)}{unit}</span>
      <ArrowRight className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-mono font-bold text-navy">{after.toFixed(precision)}{unit}</span>
      <span className={`text-xs font-medium ${improved ? 'text-accent' : delta < 0 ? 'text-coral' : 'text-gray-400'}`}>
        {delta > 0 ? '+' : ''}{delta.toFixed(precision)}{unit}
      </span>
    </div>
  );
}
