interface MetricRange {
  min: number;
  max: number;
  ideal: number;
}

interface OptimalWindowProps {
  metrics: {
    label: string;
    unit: string;
    range: MetricRange;
    current: number;
    fullMin: number;
    fullMax: number;
  }[];
}

export default function OptimalWindowChart({ metrics }: OptimalWindowProps) {
  return (
    <div className="space-y-4">
      {metrics.map((m) => {
        const span = m.fullMax - m.fullMin;
        const optLeftPct = ((m.range.min - m.fullMin) / span) * 100;
        const optWidthPct = ((m.range.max - m.range.min) / span) * 100;
        const idealPct = ((m.range.ideal - m.fullMin) / span) * 100;
        const currentPct = Math.min(100, Math.max(0, ((m.current - m.fullMin) / span) * 100));
        const inWindow = m.current >= m.range.min && m.current <= m.range.max;

        return (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400">{m.label}</span>
              <span className={`text-xs font-mono font-semibold ${inWindow ? 'text-accent-light' : 'text-coral'}`}>
                {m.current.toLocaleString()} {m.unit}
              </span>
            </div>
            <div className="relative h-5 bg-white/5 rounded-full overflow-hidden">
              {/* Optimal zone */}
              <div
                className="absolute top-0 h-full bg-accent/20 rounded-full"
                style={{ left: `${optLeftPct}%`, width: `${optWidthPct}%` }}
              />
              {/* Ideal marker */}
              <div
                className="absolute top-0 h-full w-0.5 bg-accent-light/60"
                style={{ left: `${idealPct}%` }}
              />
              {/* Current value dot */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${
                  inWindow
                    ? 'bg-accent-light border-accent-light'
                    : 'bg-coral border-coral'
                }`}
                style={{ left: `${currentPct}%`, marginLeft: '-6px' }}
              />
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[10px] text-gray-600">{m.fullMin.toLocaleString()}</span>
              <span className="text-[10px] text-accent-light/60">
                optimal: {m.range.min.toLocaleString()}–{m.range.max.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-600">{m.fullMax.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
