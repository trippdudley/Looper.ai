import { CheckCircle2, Clock, Lock } from 'lucide-react';
import DataSourceIcon from './DataSourceIcon';

interface IntegrationCardProps {
  name: string;
  status: 'connected' | 'available' | 'coming-soon';
  description: string;
  dataTypes: string[];
  color: string;
  lastSync?: string;
}

const statusConfig = {
  connected: {
    label: 'Connected',
    icon: CheckCircle2,
    badgeClass: 'bg-accent/10 text-accent',
  },
  available: {
    label: 'Available',
    icon: Clock,
    badgeClass: 'bg-data-blue/10 text-data-blue',
  },
  'coming-soon': {
    label: 'Coming Soon',
    icon: Lock,
    badgeClass: 'bg-gray-100 text-gray-500',
  },
};

export default function IntegrationCard({
  name,
  status,
  description,
  dataTypes,
  color,
  lastSync,
}: IntegrationCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-3">
        <DataSourceIcon name={name} color={color} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-navy truncate">{name}</h3>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${config.badgeClass}`}>
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Data types */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {dataTypes.map((dt) => (
          <span
            key={dt}
            className="text-[10px] font-medium bg-bg-light text-gray-600 px-2 py-0.5 rounded-full"
          >
            {dt}
          </span>
        ))}
      </div>

      {/* Last sync */}
      {lastSync && status === 'connected' && (
        <p className="text-[10px] text-gray-400">
          Last synced: {lastSync}
        </p>
      )}
    </div>
  );
}
