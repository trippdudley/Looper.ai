interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export default function Skeleton({ className = '', width, height, rounded }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-white/10 ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ lines = 3, dark = false }: { lines?: number; dark?: boolean }) {
  const bg = dark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-gray-200';
  const bar = dark ? 'bg-white/10' : 'bg-gray-200';
  return (
    <div className={`rounded-xl border p-5 space-y-3 ${bg}`}>
      <div className={`h-4 w-1/3 rounded ${bar} animate-pulse`} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 rounded ${bar} animate-pulse`} style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function SkeletonMetricTile({ dark = false }: { dark?: boolean }) {
  const bg = dark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-gray-200';
  const bar = dark ? 'bg-white/10' : 'bg-gray-200';
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <div className={`h-3 w-16 rounded ${bar} animate-pulse mb-2`} />
      <div className={`h-6 w-20 rounded ${bar} animate-pulse`} />
    </div>
  );
}
