interface MonetizationMetricProps {
  label: string;
  value: string;
  subtext?: string;
}

export default function MonetizationMetric({ label, value, subtext }: MonetizationMetricProps) {
  return (
    <div className="bg-card-dark rounded-xl border border-border-dark p-4 text-white">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-accent-light">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
      )}
    </div>
  );
}
