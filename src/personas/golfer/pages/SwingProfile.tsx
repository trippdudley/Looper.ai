import { User, Briefcase } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import IntegrationBadge from '../../../components/ui/IntegrationBadge';
import TrendLine from '../../../components/charts/TrendLine';
import { golfers } from '../../../data/golfers';
import { sessions } from '../../../data/sessions';
import { trackmanShots } from '../../../data/trackmanData';
import type { TrackmanShot } from '../../../data/trackmanData';
import { integrations } from '../../../data/integrations';

const golfer = golfers[0];

function getSessionAvg(
  sessionId: string,
  club: string,
  metric: keyof TrackmanShot
): number {
  const shots = trackmanShots.filter(
    (s) => s.sessionId === sessionId && s.club === club
  );
  if (shots.length === 0) return 0;
  return shots.reduce((sum, s) => sum + (s[metric] as number), 0) / shots.length;
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRelativeSync(isoStr: string): string {
  const syncDate = new Date(isoStr);
  const now = new Date();
  const diffMs = now.getTime() - syncDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const freshnessLabels: Record<string, string> = {
  trackman: 'Per-session data',
  arccos: 'Per-round data',
  ghin: 'Daily sync',
};

interface TrendChartConfig {
  title: string;
  club: string;
  metric: keyof TrackmanShot;
  unit: string;
  precision: number;
}

const trendCharts: TrendChartConfig[] = [
  { title: 'Club Speed (Driver)', club: 'Driver', metric: 'clubSpeed', unit: ' mph', precision: 1 },
  { title: 'Attack Angle (Driver)', club: 'Driver', metric: 'attackAngle', unit: '\u00b0', precision: 1 },
  { title: 'Club Path (Driver)', club: 'Driver', metric: 'clubPath', unit: '\u00b0', precision: 1 },
  { title: 'Spin Rate (7-Iron)', club: '7-Iron', metric: 'spinRate', unit: ' rpm', precision: 0 },
];

const equipmentSlots: { label: string; key: keyof typeof golfer.equipment }[] = [
  { label: 'Driver', key: 'driver' },
  { label: 'Fairway Woods', key: 'fairwayWoods' },
  { label: 'Hybrids', key: 'hybrids' },
  { label: 'Irons', key: 'irons' },
  { label: 'Wedges', key: 'wedges' },
  { label: 'Putter', key: 'putter' },
  { label: 'Ball', key: 'ball' },
];

export default function SwingProfile() {
  // Build trend data for each chart
  const sortedSessions = [...sessions]
    .filter((s) => s.golferId === golfer.id)
    .sort((a, b) => a.date.localeCompare(b.date));

  const connectedIntegrations = golfer.connectedSystems
    .map((sysId) => integrations.find((i) => i.id === sysId))
    .filter(Boolean);

  return (
    <div className="pb-8 space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl text-navy font-bold">My Swing</h1>
        <p className="text-sm text-gray-500">{golfer.name}</p>
      </div>

      {/* 2. Metric trend charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trendCharts.map((chart) => {
          const data = sortedSessions.map((s) => ({
            label: formatShortDate(s.date),
            value: parseFloat(
              getSessionAvg(s.id, chart.club, chart.metric).toFixed(chart.precision)
            ),
          }));

          const currentValue = data.length > 0 ? data[data.length - 1].value : 0;

          return (
            <Card key={chart.title}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-navy">{chart.title}</span>
                <span className="font-mono font-bold text-lg text-accent">
                  {currentValue.toFixed(chart.precision)}
                  {chart.unit}
                </span>
              </div>
              <TrendLine data={data} height={160} />
            </Card>
          );
        })}
      </div>

      {/* 3. Connected Data Sources */}
      <Card>
        <h2 className="font-semibold text-sm text-navy mb-4">
          Your data flows from {connectedIntegrations.length} sources
        </h2>
        <div className="divide-y divide-gray-100">
          {connectedIntegrations.map((integration) => {
            if (!integration) return null;
            return (
              <div key={integration.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <IntegrationBadge name={integration.name} status={integration.status} />
                  {integration.lastSync && (
                    <span className="text-xs text-gray-400">
                      {formatRelativeSync(integration.lastSync)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  {freshnessLabels[integration.id] || 'Connected'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Body Profile */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-navy" />
          <h2 className="font-semibold text-sm text-navy">Body Profile</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Height</p>
            <p className="text-sm text-navy">{golfer.body.height}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Weight</p>
            <p className="text-sm text-navy">{golfer.body.weight}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Dominant Hand</p>
            <p className="text-sm text-navy">{capitalize(golfer.body.dominantHand)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Flexibility</p>
            <p className="text-sm text-navy">{capitalize(golfer.body.flexibility)}</p>
          </div>
        </div>
        {golfer.body.injuryNotes && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Note:</span> {golfer.body.injuryNotes}
            </p>
          </div>
        )}
      </Card>

      {/* 5. Equipment */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4 h-4 text-navy" />
          <h2 className="font-semibold text-sm text-navy">Current Bag</h2>
        </div>
        <div className="space-y-3">
          {equipmentSlots.map((slot) => (
            <div key={slot.key}>
              <p className="text-xs text-gray-500 uppercase">{slot.label}</p>
              <p className="text-sm text-navy">
                {golfer.equipment[slot.key] as string}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">
            Last fitted: {formatFullDate(golfer.equipment.lastFittingDate)}
          </p>
          <Badge
            variant="warning"
            label="Consider re-fitting — swing metrics have changed since last fit"
          />
        </div>
      </Card>
    </div>
  );
}
