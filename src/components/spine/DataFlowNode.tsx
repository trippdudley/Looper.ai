interface DataFlowNodeProps {
  label: string;
  type: 'source' | 'processor' | 'output';
  active?: boolean;
}

const typeConfig = {
  source: {
    bg: 'bg-data-blue/10 border-data-blue/30',
    activeBg: 'bg-data-blue/20 border-data-blue',
    text: 'text-data-blue',
    dot: 'bg-data-blue',
  },
  processor: {
    bg: 'bg-accent/10 border-accent/30',
    activeBg: 'bg-accent/20 border-accent',
    text: 'text-accent-light',
    dot: 'bg-accent',
  },
  output: {
    bg: 'bg-warm-amber/10 border-warm-amber/30',
    activeBg: 'bg-warm-amber/20 border-warm-amber',
    text: 'text-warm-amber',
    dot: 'bg-warm-amber',
  },
};

export default function DataFlowNode({ label, type, active = false }: DataFlowNodeProps) {
  const config = typeConfig[type];
  const bgClass = active ? config.activeBg : config.bg;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${bgClass} transition-all`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} ${active ? 'animate-pulse' : ''}`} />
      <span className={`text-sm font-medium ${config.text}`}>{label}</span>
    </div>
  );
}
