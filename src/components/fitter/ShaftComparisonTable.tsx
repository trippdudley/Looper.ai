import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { ShaftComparison } from '../../data/fittingComparisons';

interface Props {
  comparisons: ShaftComparison[];
  compact?: boolean;
}

type MetricKey = 'avgBallSpeed' | 'avgLaunch' | 'avgSpin' | 'avgCarry' | 'avgTotal' | 'dispersion' | 'smashFactor' | 'aiScore';

const metricRows: { key: MetricKey; label: string; unit: string; higherBetter: boolean; decimals?: number }[] = [
  { key: 'avgBallSpeed', label: 'Ball Speed', unit: 'mph', higherBetter: true, decimals: 1 },
  { key: 'avgLaunch', label: 'Launch', unit: '°', higherBetter: false, decimals: 1 },
  { key: 'avgSpin', label: 'Spin', unit: 'rpm', higherBetter: false },
  { key: 'avgCarry', label: 'Carry', unit: 'yds', higherBetter: true },
  { key: 'avgTotal', label: 'Total', unit: 'yds', higherBetter: true },
  { key: 'dispersion', label: 'Dispersion', unit: 'yds', higherBetter: false },
  { key: 'smashFactor', label: 'Smash Factor', unit: '', higherBetter: true, decimals: 2 },
  { key: 'aiScore', label: 'AI Score', unit: '', higherBetter: true },
];

function bestValue(comparisons: ShaftComparison[], key: MetricKey, higherBetter: boolean): number {
  const vals = comparisons.map((c) => c[key] as number);
  return higherBetter ? Math.max(...vals) : Math.min(...vals);
}

function scoreColor(score: number): string {
  if (score >= 90) return 'text-accent-light';
  if (score >= 75) return 'text-data-blue';
  return 'text-gray-500';
}

export default function ShaftComparisonTable({ comparisons, compact }: Props) {
  const [fitterNotes, setFitterNotes] = useState('');
  const recommended = comparisons.find((c) => c.isRecommended);

  return (
    <div className="space-y-4">
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wide font-medium w-24">
                  Metric
                </th>
                {comparisons.map((c) => (
                  <th key={c.shaft.model} className="px-3 py-3 text-center">
                    <div className="text-xs text-white font-semibold">{c.shaft.model}</div>
                    <div className="text-[10px] text-gray-500">
                      {c.shaft.flex} · {c.shaft.weight}
                    </div>
                    {c.isRecommended && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-semibold bg-accent/20 text-accent-light px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" /> AI Recommended
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row) => {
                const best = bestValue(comparisons, row.key, row.higherBetter);
                return (
                  <tr key={row.key} className="border-b border-white/5">
                    <td className="px-3 py-2.5 text-xs text-gray-400">{row.label}</td>
                    {comparisons.map((c) => {
                      const val = c[row.key] as number;
                      const isBest = val === best;
                      const formatted = row.decimals != null ? val.toFixed(row.decimals) : val.toLocaleString();
                      const isScore = row.key === 'aiScore';

                      return (
                        <td key={c.shaft.model} className="px-3 py-2.5 text-center">
                          <span
                            className={`font-mono text-sm ${
                              isScore
                                ? `text-lg font-bold ${scoreColor(val)}`
                                : isBest
                                  ? 'font-semibold text-accent-light'
                                  : 'text-gray-300'
                            }`}
                          >
                            {formatted}
                          </span>
                          {row.unit && !isScore && (
                            <span className="text-[10px] text-gray-600 ml-0.5">{row.unit}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {/* Shots row */}
              <tr className="border-b border-white/5">
                <td className="px-3 py-2.5 text-xs text-gray-400">Shots</td>
                {comparisons.map((c) => (
                  <td key={c.shaft.model} className="px-3 py-2.5 text-center font-mono text-sm text-gray-300">
                    {c.shots}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommended explanation */}
      {recommended && !compact && (
        <div className="glass-card p-4 border-l-[3px] border-l-accent-light">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-light" />
            <span className="text-sm font-semibold text-white">AI Recommendation</span>
          </div>
          <p className="text-[13px] text-white/60 leading-relaxed">{recommended.aiNotes}</p>
        </div>
      )}

      {/* Fitter Override */}
      {!compact && (
        <div className="glass-card p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
            Fitter Override / Notes
          </p>
          <p className="text-[11px] text-gray-500 mb-3">
            Agree or disagree with the AI? Your feedback trains the model.
          </p>
          <textarea
            value={fitterNotes}
            onChange={(e) => setFitterNotes(e.target.value)}
            placeholder="e.g., Golfer preferred feel of Tensei White despite data..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent/40 resize-none h-20"
          />
        </div>
      )}
    </div>
  );
}
