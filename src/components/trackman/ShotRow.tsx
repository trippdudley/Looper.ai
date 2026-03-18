interface ShotRowProps {
  shotNumber: number;
  club: string;
  clubSpeed: number;
  ballSpeed: number;
  carry: number;
  spinRate: number;
  shotShape: string;
  quality: string;
}

const qualityDot: Record<string, string> = {
  excellent: 'bg-accent',
  good: 'bg-data-blue',
  average: 'bg-warm-amber',
  poor: 'bg-coral',
};

export default function ShotRow({
  shotNumber,
  club,
  clubSpeed,
  ballSpeed,
  carry,
  spinRate,
  shotShape,
  quality,
}: ShotRowProps) {
  const dotColor = qualityDot[quality.toLowerCase()] || 'bg-gray-400';

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-100 last:border-b-0 hover:bg-bg-light transition-colors">
      {/* Shot number */}
      <span className="text-xs font-mono text-gray-400 w-6 text-right shrink-0">#{shotNumber}</span>

      {/* Quality dot */}
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} title={quality} />

      {/* Club */}
      <span className="text-sm font-medium text-navy w-16 shrink-0">{club}</span>

      {/* Metrics */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="text-center">
          <p className="text-xs text-gray-400">Club Spd</p>
          <p className="text-sm font-mono text-navy">{clubSpeed.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Ball Spd</p>
          <p className="text-sm font-mono text-navy">{ballSpeed.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Carry</p>
          <p className="text-sm font-mono font-bold text-navy">{carry.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Spin</p>
          <p className="text-sm font-mono text-navy">{spinRate.toLocaleString('en-US')}</p>
        </div>
      </div>

      {/* Shot shape */}
      <span className="text-xs text-gray-500 w-16 text-right shrink-0">{shotShape}</span>
    </div>
  );
}
