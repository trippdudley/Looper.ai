import { Calendar, User } from 'lucide-react';
import TrendIndicator from '../ui/TrendIndicator';

interface SessionCardProps {
  id: string;
  date: string;
  coachName: string;
  summary: string;
  focus: string;
  improvementDelta: number;
  onClick?: () => void;
}

export default function SessionCard({
  date,
  coachName,
  summary,
  focus,
  improvementDelta,
  onClick,
}: SessionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.08)] active:scale-[0.99] transition-all duration-150 ease-in-out cursor-pointer"
      aria-label={`Session on ${date} with ${coachName}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <User className="w-3.5 h-3.5" />
            {coachName}
          </div>
        </div>
        <TrendIndicator value={improvementDelta} />
      </div>
      <p className="text-sm text-navy font-medium mb-1">{summary}</p>
      <span className="inline-block text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
        {focus}
      </span>
    </button>
  );
}
