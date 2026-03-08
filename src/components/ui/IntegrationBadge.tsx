import StatusDot from './StatusDot';

interface IntegrationBadgeProps {
  name: string;
  status: 'connected' | 'available' | 'coming-soon';
}

export default function IntegrationBadge({ name, status }: IntegrationBadgeProps) {
  const textColors = {
    connected: 'text-green-700',
    available: 'text-gray-600',
    'coming-soon': 'text-amber-700',
  };

  const bgColors = {
    connected: 'bg-green-50 border-green-200',
    available: 'bg-gray-50 border-gray-200',
    'coming-soon': 'bg-amber-50 border-amber-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bgColors[status]} ${textColors[status]}`}
    >
      <StatusDot status={status} />
      {name}
    </span>
  );
}
