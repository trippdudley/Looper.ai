interface DataFlowDiagramProps {
  className?: string;
}

const sourceNodes = [
  'Launch Monitors',
  'On-Course GPS',
  'GHIN Handicap',
  'Wearables',
  'Video Analysis',
];

const outputNodes = [
  'Coaching Insights',
  'Audience Segments',
  'Monetization',
  'Fitting Intelligence',
];

export default function DataFlowDiagram({ className = '' }: DataFlowDiagramProps) {
  const sourceStartY = 20;
  const sourceSpacing = 55;
  const outputStartY = 42;
  const outputSpacing = 58;
  const centerX = 300;
  const centerY = 150;
  const centerW = 160;
  const centerH = 50;

  return (
    <div className={className}>
      <style>{`
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash-flow {
          animation: dash-flow 1.5s linear infinite;
        }
      `}</style>
      <svg viewBox="0 0 600 300" className="w-full h-auto" role="img" aria-label="Data flow diagram showing sources flowing through Looper Intelligence Engine to outputs">
        {/* Source nodes */}
        {sourceNodes.map((label, i) => {
          const y = sourceStartY + i * sourceSpacing;
          return (
            <g key={`source-${i}`}>
              <rect x={10} y={y} width={130} height={32} rx={8} ry={8} fill="#1B2A4A" />
              <text x={75} y={y + 20} textAnchor="middle" fill="white" fontSize={10} fontWeight={500}>
                {label}
              </text>
              {/* Animated line from source to center */}
              <line
                x1={140}
                y1={y + 16}
                x2={centerX - centerW / 2}
                y2={centerY}
                stroke="#2E8B57"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                className="animate-dash-flow"
                opacity={0.7}
              />
            </g>
          );
        })}

        {/* Center processing node */}
        <rect
          x={centerX - centerW / 2}
          y={centerY - centerH / 2}
          width={centerW}
          height={centerH}
          rx={12}
          ry={12}
          fill="#2E8B57"
          stroke="#3BA86D"
          strokeWidth={2}
        />
        <text x={centerX} y={centerY - 4} textAnchor="middle" fill="white" fontSize={11} fontWeight={700}>
          Looper Intelligence
        </text>
        <text x={centerX} y={centerY + 12} textAnchor="middle" fill="white" fontSize={11} fontWeight={700}>
          Engine
        </text>

        {/* Output nodes */}
        {outputNodes.map((label, i) => {
          const y = outputStartY + i * outputSpacing;
          return (
            <g key={`output-${i}`}>
              {/* Animated line from center to output */}
              <line
                x1={centerX + centerW / 2}
                y1={centerY}
                x2={460}
                y2={y + 16}
                stroke="#4A90D9"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                className="animate-dash-flow"
                opacity={0.7}
              />
              <rect x={460} y={y} width={130} height={32} rx={8} ry={8} fill="#1B2A4A" />
              <text x={525} y={y + 20} textAnchor="middle" fill="white" fontSize={10} fontWeight={500}>
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
