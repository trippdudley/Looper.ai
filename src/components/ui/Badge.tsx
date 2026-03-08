interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
}

export default function Badge({ label, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const colors = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
    accent: 'bg-accent/10 text-accent',
  };
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors[variant]} ${sizes[size]}`}>
      {label}
    </span>
  );
}
