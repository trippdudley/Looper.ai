import { useState } from 'react';
import { Database, Activity, Search } from 'lucide-react';
import { dataCatalog } from '../../../data/dataCatalog';
import { integrations } from '../../../data/integrations';
import type { DataAttribute } from '../../../data/dataCatalog';

// ─── Source & Output node definitions for the SVG diagram ──────────────────

interface SourceNode {
  label: string;
  color: string;
  y: number;
}

interface OutputNode {
  label: string;
  color: string;
  y: number;
}

const sourceGroups: { group: string; nodes: SourceNode[] }[] = [
  {
    group: 'Launch Monitors',
    nodes: [
      { label: 'Trackman', color: '#E63946', y: 50 },
      { label: 'Foresight GCQuad', color: '#1D3557', y: 80 },
      { label: 'Uneekor', color: '#457B9D', y: 110 },
    ],
  },
  {
    group: 'On-Course',
    nodes: [
      { label: 'Arccos', color: '#2ECC71', y: 145 },
      { label: 'Shot Scope', color: '#E67E22', y: 175 },
    ],
  },
  {
    group: 'Handicap',
    nodes: [{ label: 'GHIN / USGA', color: '#003049', y: 210 }],
  },
  {
    group: 'Coaching',
    nodes: [
      { label: 'Looper Sessions', color: '#0D7C66', y: 240 },
      { label: 'Sportsbox AI', color: '#6C5CE7', y: 270 },
    ],
  },
  {
    group: 'Fitting',
    nodes: [{ label: 'Club Champion', color: '#B71C1C', y: 300 }],
  },
  {
    group: 'Wearable',
    nodes: [
      { label: 'Apple Health', color: '#FF2D55', y: 330 },
      { label: 'WHOOP', color: '#00BFA5', y: 360 },
    ],
  },
];

const allSources = sourceGroups.flatMap((g) => g.nodes);

const outputNodes: OutputNode[] = [
  { label: 'Coaching Intelligence', color: '#0D7C66', y: 100 },
  { label: 'Audience Segments', color: '#4A90D9', y: 180 },
  { label: 'Monetization Engine', color: '#D4980B', y: 260 },
  { label: 'Fitting Recommendations', color: '#CC6B6B', y: 340 },
];

// ─── Category color map ────────────────────────────────────────────────────

const categoryColors: Record<DataAttribute['category'], { bg: string; text: string; label: string }> = {
  identity: { bg: 'bg-accent/20', text: 'text-accent', label: 'Identity' },
  biomechanical: { bg: 'bg-data-blue/20', text: 'text-data-blue', label: 'Biomechanical' },
  performance: { bg: 'bg-warm-amber/20', text: 'text-warm-amber', label: 'Performance' },
  equipment: { bg: 'bg-coral/20', text: 'text-coral', label: 'Equipment' },
  behavioral: { bg: 'bg-purple-400/20', text: 'text-purple-400', label: 'Behavioral' },
  coaching: { bg: 'bg-accent/20', text: 'text-accent-light', label: 'Coaching' },
  wellness: { bg: 'bg-teal-400/20', text: 'text-teal-400', label: 'Wellness' },
};

const freshnessColors: Record<DataAttribute['freshness'], string> = {
  'real-time': 'text-accent',
  'per-session': 'text-data-blue',
  'per-round': 'text-warm-amber',
  daily: 'text-gray-300',
  monthly: 'text-gray-500',
};

const monetizationColors: Record<DataAttribute['monetizationRelevance'], string> = {
  high: 'text-accent',
  medium: 'text-warm-amber',
  low: 'text-gray-500',
};

// ─── Sparkle decoration for the LLM layer ──────────────────────────────────

function SparkStar({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#D4980B" strokeWidth={1.5} opacity={0.8} />
      <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#D4980B" strokeWidth={1.5} opacity={0.8} />
      <line x1={cx - 3} y1={cy - 3} x2={cx + 3} y2={cy + 3} stroke="#D4980B" strokeWidth={1} opacity={0.5} />
      <line x1={cx + 3} y1={cy - 3} x2={cx - 3} y2={cy + 3} stroke="#D4980B" strokeWidth={1} opacity={0.5} />
    </g>
  );
}

// ─── SVG Data Flow Diagram ─────────────────────────────────────────────────

function DataFlowDiagram() {
  const centerLeft = 300;
  const centerRight = 600;
  const centerMidY = 205;

  return (
    <div className="bg-card-dark rounded-xl border border-border-dark p-6 overflow-hidden">
      <svg
        viewBox="0 0 900 400"
        className="w-full"
        style={{ maxHeight: 420 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Connecting lines: sources to center ── */}
        {allSources.map((src, i) => (
          <line
            key={`src-line-${i}`}
            x1={180}
            y1={src.y}
            x2={centerLeft}
            y2={centerMidY}
            stroke={src.color}
            strokeWidth={1.2}
            strokeDasharray="6 4"
            opacity={0.45}
            className="animate-dash-flow"
          />
        ))}

        {/* ── Connecting lines: center to outputs ── */}
        {outputNodes.map((out, i) => (
          <line
            key={`out-line-${i}`}
            x1={centerRight}
            y1={centerMidY}
            x2={700}
            y2={out.y}
            stroke={out.color}
            strokeWidth={1.2}
            strokeDasharray="6 4"
            opacity={0.45}
            className="animate-dash-flow"
          />
        ))}

        {/* ── Source nodes (left) ── */}
        {allSources.map((src, i) => (
          <g key={`src-${i}`}>
            <circle cx={50} cy={src.y} r={16} fill={src.color} opacity={0.85} />
            <text
              x={74}
              y={src.y + 4}
              fill="white"
              fontSize={11}
              fontFamily="DM Sans, sans-serif"
            >
              {src.label}
            </text>
          </g>
        ))}

        {/* ── Center: Intelligence Engine ── */}
        <rect
          x={centerLeft}
          y={50}
          width={300}
          height={310}
          rx={12}
          fill="#1E3150"
          stroke="#2A3A55"
          strokeWidth={1}
        />
        <text
          x={centerLeft + 150}
          y={82}
          fill="white"
          fontSize={14}
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="Georgia, serif"
        >
          Looper Intelligence Engine
        </text>

        {/* Layer 1: Ingestion */}
        <rect x={centerLeft + 20} y={100} width={260} height={52} rx={8} fill="#243B5C" />
        <text
          x={centerLeft + 150}
          y={120}
          fill="white"
          fontSize={11}
          textAnchor="middle"
          fontFamily="DM Sans, sans-serif"
        >
          Data Ingestion
        </text>
        <text
          x={centerLeft + 150}
          y={138}
          fill="#94A3B8"
          fontSize={10}
          textAnchor="middle"
          fontFamily="DM Sans, sans-serif"
        >
          &amp; Normalization
        </text>

        {/* Layer 2: LLM Processing */}
        <rect x={centerLeft + 20} y={166} width={260} height={52} rx={8} fill="#2E4A6E" />
        <text
          x={centerLeft + 150}
          y={186}
          fill="white"
          fontSize={11}
          textAnchor="middle"
          fontFamily="DM Sans, sans-serif"
        >
          LLM Processing
        </text>
        <text
          x={centerLeft + 150}
          y={204}
          fill="#94A3B8"
          fontSize={10}
          textAnchor="middle"
          fontFamily="DM Sans, sans-serif"
        >
          (Anthropic Claude)
        </text>
        <SparkStar cx={centerLeft + 38} cy={188} />
        <SparkStar cx={centerLeft + 262} cy={188} />

        {/* Layer 3: Unified Golfer Identity */}
        <rect x={centerLeft + 20} y={232} width={260} height={52} rx={8} fill="#0D7C66" opacity={0.35} />
        <rect x={centerLeft + 20} y={232} width={260} height={52} rx={8} fill="none" stroke="#0D7C66" strokeWidth={1} opacity={0.6} />
        <text
          x={centerLeft + 150}
          y={256}
          fill="white"
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="DM Sans, sans-serif"
        >
          Unified Golfer Identity
        </text>
        <text
          x={centerLeft + 150}
          y={272}
          fill="#3BA86D"
          fontSize={9}
          textAnchor="middle"
          fontFamily="Space Mono, monospace"
        >
          golfer_synth_id::0x7F3A
        </text>

        {/* ── Arrows from center right edge ── */}
        <defs>
          <marker id="arrowAccent" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#0D7C66" opacity={0.6} />
          </marker>
          <marker id="arrowBlue" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#4A90D9" opacity={0.6} />
          </marker>
          <marker id="arrowAmber" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#D4980B" opacity={0.6} />
          </marker>
          <marker id="arrowCoral" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#CC6B6B" opacity={0.6} />
          </marker>
        </defs>

        {/* ── Output nodes (right) ── */}
        {outputNodes.map((out, i) => (
          <g key={`out-${i}`}>
            <circle cx={830} cy={out.y} r={14} fill={out.color} opacity={0.85} />
            <text
              x={808}
              y={out.y + 4}
              fill="white"
              fontSize={11}
              textAnchor="end"
              fontFamily="DM Sans, sans-serif"
            >
              {out.label}
            </text>
          </g>
        ))}

        {/* ── Group labels (left) ── */}
        {sourceGroups.map((group, gi) => {
          const minY = Math.min(...group.nodes.map((n) => n.y));
          return (
            <text
              key={`glabel-${gi}`}
              x={10}
              y={minY - 10}
              fill="#64748B"
              fontSize={8}
              fontFamily="DM Sans, sans-serif"
              letterSpacing="0.05em"
              style={{ textTransform: 'uppercase' }}
            >
              {group.group.toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-card-dark rounded-xl p-5 border border-border-dark">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-3xl font-mono text-white font-bold">{value}</div>
      {children}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function DataSpine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DataAttribute['category'] | 'all'>('all');

  const categories = Object.keys(categoryColors) as DataAttribute['category'][];

  const filteredCatalog = dataCatalog.filter((attr) => {
    const matchesSearch =
      searchTerm === '' ||
      attr.attribute.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.sources.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || attr.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          The Looper Data Spine
        </h1>
        <p className="text-gray-400">
          A unified golfer identity connecting every data source in the golf ecosystem.
        </p>
      </div>

      {/* ── Hero: Data Flow Diagram ── */}
      <DataFlowDiagram />

      {/* ── Summary Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Attributes Tracked"
          value={dataCatalog.length}
          icon={<Database size={16} className="text-data-blue" />}
        />
        <StatCard
          label="Data Sources"
          value={integrations.length}
          icon={<Activity size={16} className="text-accent" />}
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={<Database size={16} className="text-warm-amber" />}
        >
          <div className="flex flex-wrap gap-1.5 mt-3">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[cat].bg} ${categoryColors[cat].text}`}
              >
                {categoryColors[cat].label}
              </span>
            ))}
          </div>
        </StatCard>
      </div>

      {/* ── Data Catalog Table ── */}
      <div className="bg-card-dark rounded-xl border border-border-dark overflow-hidden">
        {/* Table header bar with filters */}
        <div className="px-5 py-4 border-b border-border-dark flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-lg font-bold text-white">Data Catalog</h2>
          <div className="flex-1" />
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search attributes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bg-dark border border-border-dark rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent/50 w-full sm:w-56"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as DataAttribute['category'] | 'all')}
            className="bg-bg-dark border border-border-dark rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-accent/50"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryColors[cat].label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-dark text-gray-500 uppercase text-xs">
                <th className="text-left px-5 py-3 font-medium">Attribute</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Sources</th>
                <th className="text-left px-5 py-3 font-medium">Freshness</th>
                <th className="text-left px-5 py-3 font-medium">Monetization</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalog.map((attr, i) => (
                <tr
                  key={attr.attribute}
                  className={i % 2 === 0 ? 'bg-card-dark' : 'bg-white/[0.03]'}
                >
                  {/* Attribute */}
                  <td className="px-5 py-3">
                    <div className="text-white font-medium">{attr.attribute}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{attr.description}</div>
                  </td>

                  {/* Category badge */}
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[attr.category].bg} ${categoryColors[attr.category].text}`}
                    >
                      {categoryColors[attr.category].label}
                    </span>
                  </td>

                  {/* Sources */}
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {attr.sources.map((src) => (
                        <span
                          key={src}
                          className="text-xs bg-white/10 text-gray-300 rounded-full px-2 py-0.5"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Freshness */}
                  <td className="px-5 py-3">
                    <span className={`text-xs font-mono ${freshnessColors[attr.freshness]}`}>
                      {attr.freshness}
                    </span>
                  </td>

                  {/* Monetization */}
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium capitalize ${monetizationColors[attr.monetizationRelevance]}`}>
                      {attr.monetizationRelevance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredCatalog.length === 0 && (
          <div className="px-5 py-12 text-center text-gray-500">
            No attributes match your search.
          </div>
        )}
      </div>
    </div>
  );
}
