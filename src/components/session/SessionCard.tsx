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
  id: _id,
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
      className="w-full text-left bg-white rounded-xl p-4 border-b-2 border-gray-100 hover:border-accent/30 transition-all hover:shadow-md cursor-pointer"
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
