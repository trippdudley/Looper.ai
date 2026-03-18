interface StatusDotProps {
  status: 'connected' | 'available' | 'coming-soon' | 'error';
}

export default function StatusDot({ status }: StatusDotProps) {
  const colors = {
    connected: 'bg-green-500',
    available: 'bg-gray-400',
    'coming-soon': 'bg-amber-400',
    error: 'bg-red-500',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status]}`} />
  );
}
