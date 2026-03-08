interface ImprovementGaugeProps {
  score: number;
  trend?: number;
  trendLabel?: string;
}

export default function ImprovementGauge({ score, trend, trendLabel }: ImprovementGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // SVG semicircle gauge using stroke-dasharray/stroke-dashoffset
  const cx = 60;
  const cy = 60;
  const r = 50;

  // Semicircle arc length (half circumference)
  const halfCircumference = Math.PI * r;
  const filled = (clampedScore / 100) * halfCircumference;
  const offset = halfCircumference - filled;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="70" viewBox="0 0 120 70" className="overflow-visible">
        {/* Background arc (gray) */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${halfCircumference} ${halfCircumference}`}
          strokeDashoffset={0}
          transform={`rotate(180, ${cx}, ${cy})`}
        />
        {/* Filled arc (accent green) */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#2E8B57"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${halfCircumference} ${halfCircumference}`}
          strokeDashoffset={offset}
          transform={`rotate(180, ${cx}, ${cy})`}
          className="transition-all duration-500 ease-out"
        />
        {/* Score text in center */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-navy font-bold"
          fontSize="24"
        >
          {score}
        </text>
      </svg>
      {/* Trend text below gauge */}
      {trend !== undefined && (
        <p className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-accent' : trend < 0 ? 'text-coral' : 'text-gray-400'}`}>
          {trend > 0 ? '\u2191' : trend < 0 ? '\u2193' : '\u2192'} {trend > 0 ? '+' : ''}{trend}{trendLabel ? ` ${trendLabel}` : ''}
        </p>
      )}
    </div>
  );
}
