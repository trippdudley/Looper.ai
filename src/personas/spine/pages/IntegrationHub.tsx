import { useState, useCallback } from 'react';
import { integrations } from '../../../data/integrations';
import type { Integration } from '../../../data/integrations';
import { CheckCircle, Loader2 } from 'lucide-react';

type FilterTab = 'all' | 'connected' | 'available' | 'coming-soon';

const categoryLabels: Record<string, string> = {
  'launch-monitor': 'Launch Monitors',
  'on-course': 'On-Course Tracking',
  'handicap': 'Handicap & Scoring',
  'coaching': 'Coaching & Video',
  'video': 'Coaching & Video',
  'fitting': 'Equipment & Fitting',
  'wearable': 'Wearable & Wellness',
  'booking': 'Booking & Lifestyle',
};

// Ordered display categories (coaching + video merged)
const categoryOrder = [
  'launch-monitor',
  'on-course',
  'handicap',
  'coaching',
  'fitting',
  'wearable',
  'booking',
] as const;

function groupByCategory(items: Integration[]): Record<string, Integration[]> {
  const groups: Record<string, Integration[]> = {};
  for (const item of items) {
    // Merge video into coaching
    const key = item.category === 'video' ? 'coaching' : item.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Less than an hour ago';
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

const statusBadge: Record<string, string> = {
  connected: 'bg-accent/20 text-accent',
  available: 'bg-white/10 text-gray-300',
  'coming-soon': 'bg-warm-amber/20 text-warm-amber',
};

const statusLabel: Record<string, string> = {
  connected: 'Connected',
  available: 'Available',
  'coming-soon': 'Coming Soon',
};

export default function IntegrationHub() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testedIds, setTestedIds] = useState<Set<string>>(new Set());

  const handleTestConnection = useCallback((id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setTestedIds(prev => new Set([...prev, id]));
    }, 1500);
  }, []);

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;
  const availableCount = integrations.filter((i) => i.status === 'available').length;
  const comingSoonCount = integrations.filter((i) => i.status === 'coming-soon').length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: integrations.length },
    { key: 'connected', label: 'Connected', count: connectedCount },
    { key: 'available', label: 'Available', count: availableCount },
    { key: 'coming-soon', label: 'Coming Soon', count: comingSoonCount },
  ];

  const filtered =
    activeFilter === 'all'
      ? integrations
      : integrations.filter((i) => i.status === activeFilter);

  const grouped = groupByCategory(filtered);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Integration Hub</h1>
        <p className="text-gray-400 mt-1">
          Every data source in the golf ecosystem — connected, available, or coming soon.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm border transition ${
              activeFilter === tab.key
                ? 'bg-white/10 text-white border-border-dark'
                : 'bg-card-dark text-gray-500 border-border-dark hover:text-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Integration Cards — Grouped by Category */}
      {categoryOrder.map((catKey) => {
        const items = grouped[catKey];
        if (!items || items.length === 0) return null;
        return (
          <div key={catKey}>
            <h2 className="text-lg text-white mt-6 mb-3">
              {categoryLabels[catKey]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-card-dark rounded-xl border border-border-dark p-4 hover:border-white/20 transition"
                >
                  {/* Header row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: integration.color }}
                    >
                      {integration.name.charAt(0)}
                    </div>
                    <span className="text-white font-semibold">{integration.name}</span>
                    <span
                      className={`ml-auto text-xs rounded-full px-2 py-0.5 ${statusBadge[integration.status]}`}
                    >
                      {statusLabel[integration.status]}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mt-2">{integration.description}</p>

                  {/* Data Types */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 uppercase mb-1">Data Types</p>
                    <div className="flex flex-wrap gap-1">
                      {integration.dataTypes.slice(0, 5).map((dt) => (
                        <span
                          key={dt}
                          className="bg-white/5 text-gray-400 rounded px-1.5 py-0.5 text-xs"
                        >
                          {dt}
                        </span>
                      ))}
                      {integration.dataTypes.length > 5 && (
                        <span className="bg-white/5 text-gray-400 rounded px-1.5 py-0.5 text-xs">
                          +{integration.dataTypes.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Last Sync + Test Connection */}
                  {integration.status === 'connected' && (
                    <div className="flex items-center justify-between mt-2">
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500">
                          Last sync: {relativeTime(integration.lastSync)}
                        </p>
                      )}
                      <button
                        onClick={() => handleTestConnection(integration.id)}
                        disabled={testingId === integration.id}
                        className="text-[10px] font-medium text-accent-light hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {testingId === integration.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Testing...
                          </>
                        ) : testedIds.has(integration.id) ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Connected
                          </>
                        ) : (
                          'Test Connection'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom Summary Bar */}
      <div className="bg-card-dark rounded-xl border border-border-dark p-4 mt-6">
        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="text-white">{integrations.length} integrations mapped</span>
          <span className="text-gray-600">&middot;</span>
          <span className="text-accent">{connectedCount} connected</span>
          <span className="text-gray-600">&middot;</span>
          <span className="text-gray-300">{availableCount} available</span>
          <span className="text-gray-600">&middot;</span>
          <span className="text-warm-amber">{comingSoonCount} coming soon</span>
          <span className="text-gray-600">&middot;</span>
          <span className="text-gray-500 italic">Golf&apos;s most comprehensive data platform.</span>
        </div>
      </div>
    </div>
  );
}
