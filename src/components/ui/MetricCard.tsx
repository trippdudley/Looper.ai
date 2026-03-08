import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  sparkData?: number[];
  className?: string;
}

export default function MetricCard({ label, value, delta, deltaLabel, sparkData, className = '' }: MetricCardProps) {
  const chartData = sparkData?.map((v, i) => ({ i, v }));

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-navy">{value}</p>
        {sparkData && chartData && (
          <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="monotone" dataKey="v" stroke="#2E8B57" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {delta !== undefined && (
        <p className={`text-xs mt-1 ${delta > 0 ? 'text-accent' : delta < 0 ? 'text-coral' : 'text-gray-400'}`}>
          {delta > 0 ? '\u2191' : delta < 0 ? '\u2193' : '\u2192'} {delta > 0 ? '+' : ''}{delta}{deltaLabel ? ` ${deltaLabel}` : ''}
        </p>
      )}
    </div>
  );
}
