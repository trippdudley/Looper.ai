import { Gauge, Wind, Target, RotateCcw } from 'lucide-react';

interface Shot {
  id: string;
  club: string;
  clubSpeed: number;
  ballSpeed: number;
  launchAngle: number;
  spinRate: number;
  carry: number;
  clubPath: number;
  faceAngle: number;
  shotShape: string;
  quality: string;
}

interface TrackmanDataGridProps {
  shots: Shot[];
}

const qualityColors: Record<string, string> = {
  excellent: 'bg-accent/10 text-accent',
  good: 'bg-data-blue/10 text-data-blue',
  average: 'bg-warm-amber/10 text-warm-amber',
  poor: 'bg-coral/10 text-coral',
};

function formatSpin(rpm: number): string {
  return rpm.toLocaleString('en-US');
}

export default function TrackmanDataGrid({ shots }: TrackmanDataGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {shots.map((shot) => {
        const qColor = qualityColors[shot.quality.toLowerCase()] || 'bg-gray-100 text-gray-600';
        return (
          <div
            key={shot.id}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            {/* Club header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center">
                  <Target className="w-4 h-4 text-navy" />
                </div>
                <span className="text-sm font-semibold text-navy">{shot.club}</span>
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${qColor}`}>
                {shot.quality}
              </span>
            </div>

            {/* Key metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Gauge className="w-3 h-3" /> Club Speed
                </span>
                <span className="text-sm font-mono font-medium text-navy">{shot.clubSpeed.toFixed(1)} mph</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Wind className="w-3 h-3" /> Ball Speed
                </span>
                <span className="text-sm font-mono font-medium text-navy">{shot.ballSpeed.toFixed(1)} mph</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Carry</span>
                <span className="text-sm font-mono font-medium text-navy">{shot.carry.toFixed(1)} yds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Launch</span>
                <span className="text-sm font-mono font-medium text-navy">{shot.launchAngle.toFixed(1)}&deg;</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <RotateCcw className="w-3 h-3" /> Spin
                </span>
                <span className="text-sm font-mono font-medium text-navy">{formatSpin(shot.spinRate)} rpm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Path / Face</span>
                <span className="text-sm font-mono font-medium text-navy">
                  {shot.clubPath > 0 ? '+' : ''}{shot.clubPath.toFixed(1)}&deg; / {shot.faceAngle > 0 ? '+' : ''}{shot.faceAngle.toFixed(1)}&deg;
                </span>
              </div>
            </div>

            {/* Shot shape */}
            <div className="mt-3 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Shape: </span>
              <span className="text-xs font-medium text-navy">{shot.shotShape}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
