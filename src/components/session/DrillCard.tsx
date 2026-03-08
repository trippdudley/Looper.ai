import { Clock, RotateCcw, Target } from 'lucide-react';

interface DrillCardProps {
  name: string;
  focus: string;
  duration: string;
  reps: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'bg-accent/10 text-accent' },
  intermediate: { label: 'Intermediate', color: 'bg-warm-amber/10 text-warm-amber' },
  advanced: { label: 'Advanced', color: 'bg-coral/10 text-coral' },
};

export default function DrillCard({ name, focus, duration, reps, difficulty }: DrillCardProps) {
  const diff = difficultyConfig[difficulty];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      {/* Thumbnail placeholder */}
      <div className="w-full h-24 bg-gradient-to-br from-navy/5 to-accent/5 rounded-lg mb-3 flex items-center justify-center">
        <Target className="w-8 h-8 text-accent/30" />
      </div>

      <h4 className="text-sm font-semibold text-navy mb-1">{name}</h4>
      <p className="text-xs text-gray-500 mb-3">{focus}</p>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          {duration}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <RotateCcw className="w-3.5 h-3.5" />
          {reps}
        </div>
      </div>

      <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${diff.color}`}>
        {diff.label}
      </span>
    </div>
  );
}
