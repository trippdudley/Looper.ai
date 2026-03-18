import { Sparkles } from 'lucide-react';

interface AIThinkingIndicatorProps {
  label?: string;
  detail?: string;
  dark?: boolean;
}

export default function AIThinkingIndicator({ label = 'AI is thinking...', detail, dark = true }: AIThinkingIndicatorProps) {
  const textColor = dark ? 'text-white' : 'text-navy';
  const mutedColor = dark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="flex items-start gap-3 p-4">
      <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0 animate-ai-pulse">
        <Sparkles className="w-4 h-4 text-accent-light" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <p className={`text-sm font-semibold ${textColor} mb-1`}>{label}</p>
        {detail && <p className={`text-xs ${mutedColor}`}>{detail}</p>}
        <div className="flex gap-1 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
