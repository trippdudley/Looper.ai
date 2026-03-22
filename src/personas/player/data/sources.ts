// Data source identity system — each source has a color, label, and short code.

export interface SourceConfig {
  label: string;
  color: string;
  short: string;
  status: 'live' | 'synced' | 'available' | 'coming';
  lastSync?: string;
  dataTypes: string[];
  crossSourceInsight: string;
}

export const sourceConfig: Record<string, SourceConfig> = {
  coaching: {
    label: 'Coaching OS',
    color: '#0D7C66',
    short: 'COACH',
    status: 'live',
    lastSync: 'Real-time',
    dataTypes: ['Session records', 'Coach plans', 'Drills', 'Video annotations', 'Intervention history'],
    crossSourceInsight: 'Coach Thompson diagnosed face-to-path inconsistency. 3 sessions completed in current phase.',
  },
  arccos: {
    label: 'Arccos',
    color: '#3B82F6',
    short: 'ARCCOS',
    status: 'synced',
    lastSync: '2 hours ago',
    dataTypes: ['Shot-level GPS', 'Club distances', 'Strokes gained', 'Round data'],
    crossSourceInsight: 'Approach shots from 125-150 yds costing 1.4 SG/round. Combined with Coaching OS, correlates with face-to-path issue.',
  },
  garmin: {
    label: 'Garmin R10',
    color: '#F59E0B',
    short: 'GARMIN',
    status: 'synced',
    lastSync: '3 days ago',
    dataTypes: ['Ball speed', 'Spin rate', 'Launch angle', 'Carry distance', 'Practice sessions'],
    crossSourceInsight: 'Last 3 sessions show 7-iron dispersion tightening from \u00B18.2 to \u00B15.4 yds. The prescribed drill is working.',
  },
  rapsodo: {
    label: 'Rapsodo',
    color: '#F59E0B',
    short: 'RAPSODO',
    status: 'available',
    dataTypes: ['Ball speed', 'Spin rate', 'Launch angle', 'Carry distance', 'Practice sessions'],
    crossSourceInsight: 'Import Rapsodo MLM2PRO session data. Practice metrics flowing into your unified timeline.',
  },
  ghin: {
    label: 'GHIN',
    color: '#6366F1',
    short: 'GHIN',
    status: 'synced',
    lastSync: '1 day ago',
    dataTypes: ['Handicap index', 'Score history', 'Course ratings'],
    crossSourceInsight: 'Handicap dropped 1.8 in 90 days \u2014 fastest improvement rate in your history.',
  },
  whoop: {
    label: 'WHOOP',
    color: '#EF4444',
    short: 'WHOOP',
    status: 'available',
    dataTypes: ['HRV', 'Sleep', 'Strain', 'Recovery', 'Heart rate'],
    crossSourceInsight: 'Overlay biometrics on every round. See how recovery correlates with scoring. Get alerts when body state predicts a tough day.',
  },
  apple: {
    label: 'Apple Health',
    color: '#EC4899',
    short: 'HEALTH',
    status: 'available',
    dataTypes: ['Steps', 'Workouts', 'Heart rate', 'Sleep'],
    crossSourceInsight: 'Activity tracking and heart rate during rounds to understand how fitness affects performance.',
  },
  trackman: {
    label: 'TrackMan',
    color: '#F97316',
    short: 'TMAN',
    status: 'available',
    dataTypes: ['Full club delivery', 'Ball flight', 'Session exports'],
    crossSourceInsight: 'Import TrackMan session exports. Full club delivery data flowing into your longitudinal record.',
  },
  foresight: {
    label: 'Foresight',
    color: '#14B8A6',
    short: 'FORE',
    status: 'available',
    dataTypes: ['Ball data', 'Club data', 'Impact location'],
    crossSourceInsight: 'Import Foresight data with camera-grade precision \u2014 contextualized by your coaching plan.',
  },
  clippd: {
    label: 'Clippd',
    color: '#8B5CF6',
    short: 'CLIPPD',
    status: 'available',
    dataTypes: ['Shot quality', 'Player quality', 'Skill analytics'],
    crossSourceInsight: 'Import Shot Quality scores. See how Clippd analysis aligns with your Coaching OS diagnosis.',
  },
  decade: {
    label: 'DECADE',
    color: '#64748B',
    short: 'DECADE',
    status: 'coming',
    dataTypes: ['Course strategy', 'Target selection', 'Mental scorecards'],
    crossSourceInsight: 'Integration in development. Course strategy connected to your performance data.',
  },
};

export const connectedSources = Object.entries(sourceConfig)
  .filter(([, s]) => s.status === 'live' || s.status === 'synced')
  .map(([key]) => key);

export const availableSources = Object.entries(sourceConfig)
  .filter(([, s]) => s.status === 'available' || s.status === 'coming')
  .map(([key]) => key);
