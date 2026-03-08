import { MessageCircle } from 'lucide-react';

interface CoachCueCardProps {
  cue: string;
  index?: number;
}

export default function CoachCueCard({ cue, index }: CoachCueCardProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Speech bubble triangle + icon */}
      <div className="relative mt-1 shrink-0">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-accent" />
        </div>
      </div>

      {/* Speech bubble */}
      <div className="relative bg-white border border-gray-200 rounded-xl rounded-tl-none px-4 py-3 shadow-sm max-w-md">
        {/* Triangle pointing left */}
        <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-gray-200" />
        <div className="absolute -left-[6px] top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-white" />

        {index !== undefined && (
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1 block">
            Cue #{index + 1}
          </span>
        )}
        <p className="text-sm text-navy leading-relaxed">{cue}</p>
      </div>
    </div>
  );
}
