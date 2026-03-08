import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  suffix?: string;
}

export default function TrendIndicator({ value, suffix = '' }: TrendIndicatorProps) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
        <TrendingUp className="w-4 h-4" />
        +{value}{suffix}
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-coral text-sm font-medium">
        <TrendingDown className="w-4 h-4" />
        {value}{suffix}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-gray-400 text-sm font-medium">
      <Minus className="w-4 h-4" />
      0{suffix}
    </span>
  );
}
