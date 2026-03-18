import {
  TrendingUp,
  Crosshair,
  AlertCircle,
  BarChart3,
  Target,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import type { LiveFittingInsight } from '../../data/fittingAIInsights';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Crosshair,
  AlertCircle,
  BarChart3,
  Target,
  CheckCircle,
};

const typeColors: Record<string, string> = {
  recommendation: 'bg-accent/20 text-accent-light',
  observation: 'bg-data-blue/20 text-data-blue',
  alert: 'bg-warm-amber/20 text-warm-amber',
  comparison: 'bg-white/10 text-gray-400',
};

export default function FittingAIInsightCard({ insight }: { insight: LiveFittingInsight }) {
  const Icon = iconMap[insight.icon] ?? Sparkles;
  const colorClass = typeColors[insight.type] ?? typeColors.comparison;
  const isHigh = insight.priority === 'high';

  return (
    <div
      className={`glass-card p-4 relative ${isHigh ? 'border-l-[3px] border-l-accent-light' : ''}`}
    >
      {/* Timestamp */}
      <span className="absolute top-3 right-4 text-[10px] text-gray-500 font-mono">
        {insight.timestamp}
      </span>

      <div className="flex gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-12">
          <p className="text-white text-sm font-semibold mb-1">{insight.title}</p>
          <p className="text-[13px] text-white/60 leading-relaxed">{insight.body}</p>

          {insight.dataPoints && (
            <div className="flex items-center gap-1.5 mt-2">
              <Sparkles className="w-3 h-3 text-accent-light shrink-0" />
              <span className="text-[11px] text-gray-500">{insight.dataPoints}</span>
            </div>
          )}
        </div>

        {/* Confidence */}
        <div className="shrink-0 flex flex-col items-center justify-start">
          <div className="w-10 h-10 rounded-full border-2 border-accent-light/40 flex items-center justify-center">
            <span className="text-[11px] font-bold text-accent-light">{insight.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
