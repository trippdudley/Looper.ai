import { CheckCircle2, Fingerprint } from 'lucide-react';
import DataSourceIcon from '../integration/DataSourceIcon';

interface GolferIdentityCardProps {
  name: string;
  syntheticId: string;
  connectedSources: { name: string; color: string }[];
  dataCategories: string[];
  completeness: number;
}

export default function GolferIdentityCard({
  name,
  syntheticId,
  connectedSources,
  dataCategories,
  completeness,
}: GolferIdentityCardProps) {
  return (
    <div className="bg-card-dark rounded-2xl p-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
          <Fingerprint className="w-6 h-6 text-accent-light" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-xs font-mono text-gray-400">{syntheticId}</p>
        </div>
      </div>

      {/* Connected sources */}
      <div className="mb-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Connected Sources</p>
        <div className="flex flex-wrap gap-2">
          {connectedSources.map((source) => (
            <DataSourceIcon key={source.name} name={source.name} color={source.color} size={30} />
          ))}
        </div>
      </div>

      {/* Data categories */}
      <div className="mb-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Data Categories</p>
        <ul className="space-y-1.5">
          {dataCategories.map((cat) => (
            <li key={cat} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-accent-light shrink-0" />
              <span className="text-gray-200">{cat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Data completeness */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Data Completeness</p>
          <span className="text-sm font-bold text-accent-light">{completeness}%</span>
        </div>
        <div className="w-full h-2 bg-border-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>
    </div>
  );
}
