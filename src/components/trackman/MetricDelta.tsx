import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricDeltaProps {
  label: string;
  value: number;
  previousValue?: number;
  unit: string;
  precision?: number;
}

export default function MetricDelta({ label, value, previousValue, unit, precision = 1 }: MetricDeltaProps) {
  const delta = previousValue !== undefined ? value - previousValue : undefined;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-xl font-bold font-mono text-navy">
          {value.toFixed(precision)}
        </span>
        <span className="text-sm text-gray-400 mb-0.5">{unit}</span>
      </div>

      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          {delta > 0 ? (
            <>
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">
                +{delta.toFixed(precision)}{unit} vs last session
              </span>
            </>
          ) : delta < 0 ? (
            <>
              <TrendingDown className="w-3.5 h-3.5 text-coral" />
              <span className="text-xs font-medium text-coral">
                {delta.toFixed(precision)}{unit} vs last session
              </span>
            </>
          ) : (
            <>
              <Minus className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">No change vs last session</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
