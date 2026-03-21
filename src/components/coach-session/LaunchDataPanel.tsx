import type { CoachSessionSwing } from '../../data/coachSessionData';

interface LaunchDataPanelProps {
  selectedSwing: CoachSessionSwing;
  sessionAverages: {
    ballSpeed: number;
    launchAngle: number;
    spinRate: number;
    carry: number;
    total: number;
    clubSpeed: number;
    attackAngle: number;
    clubPath: number;
    faceAngle: number;
    faceToPath: number;
    smashFactor: number;
  };
}

interface MetricRow {
  label: string;
  value: string;
  unit: string;
  delta?: number;
  invert?: boolean; // true for metrics where lower is better
}

function formatDelta(delta: number | undefined): { text: string; color: string } | null {
  if (delta === undefined || Math.abs(delta) < 0.05) return null;
  const isPositive = delta > 0;
  return {
    text: `${isPositive ? '+' : ''}${Math.abs(delta) < 10 ? delta.toFixed(1) : Math.round(delta).toString()}`,
    color: isPositive ? '#0FA87A' : '#C93B3B',
  };
}

function sign(n: number): string {
  return n > 0 ? '+' : '';
}

function MetricItem({ label, value, unit, delta, invert }: MetricRow) {
  const d = formatDelta(delta);
  // If metric is inverted (lower = better), flip the color logic
  const deltaColor = d ? (invert
    ? (delta! < 0 ? '#0FA87A' : '#C93B3B')
    : d.color
  ) : undefined;

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-[#9CA3AF]">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className="text-sm font-bold text-[#1C2B2D]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[10px] text-[#9CA3AF] w-6 text-right">{unit}</span>
        )}
        {d && (
          <span
            className="text-[10px] font-medium w-10 text-right"
            style={{ color: deltaColor, fontFamily: "'Space Mono', monospace" }}
          >
            {d.text}
          </span>
        )}
        {!d && <span className="w-10" />}
      </div>
    </div>
  );
}

export default function LaunchDataPanel({ selectedSwing, sessionAverages }: LaunchDataPanelProps) {
  const ballData: MetricRow[] = [
    { label: 'Ball Speed', value: selectedSwing.ballSpeed.toFixed(1), unit: 'mph', delta: selectedSwing.ballSpeed - sessionAverages.ballSpeed },
    { label: 'Launch Angle', value: selectedSwing.launchAngle.toFixed(1), unit: '°', delta: selectedSwing.launchAngle - sessionAverages.launchAngle },
    { label: 'Spin Rate', value: selectedSwing.spinRate.toLocaleString(), unit: 'rpm', delta: selectedSwing.spinRate - sessionAverages.spinRate, invert: true },
    { label: 'Spin Axis', value: `${sign(selectedSwing.spinAxis)}${selectedSwing.spinAxis.toFixed(1)}`, unit: '°' },
    { label: 'Carry', value: selectedSwing.carry.toString(), unit: 'yds', delta: selectedSwing.carry - sessionAverages.carry },
    { label: 'Total', value: selectedSwing.total.toString(), unit: 'yds', delta: selectedSwing.total - sessionAverages.total },
  ];

  const clubData: MetricRow[] = [
    { label: 'Club Speed', value: selectedSwing.clubSpeed.toFixed(1), unit: 'mph', delta: selectedSwing.clubSpeed - sessionAverages.clubSpeed },
    { label: 'Attack Angle', value: `${sign(selectedSwing.attackAngle)}${selectedSwing.attackAngle.toFixed(1)}`, unit: '°', delta: selectedSwing.attackAngle - sessionAverages.attackAngle },
    { label: 'Club Path', value: `${sign(selectedSwing.clubPath)}${selectedSwing.clubPath.toFixed(1)}`, unit: '°', delta: selectedSwing.clubPath - sessionAverages.clubPath },
    { label: 'Face Angle', value: `${sign(selectedSwing.faceAngle)}${selectedSwing.faceAngle.toFixed(1)}`, unit: '°', delta: selectedSwing.faceAngle - sessionAverages.faceAngle },
    { label: 'Face to Path', value: `${sign(selectedSwing.faceToPath)}${selectedSwing.faceToPath.toFixed(1)}`, unit: '°' },
    { label: 'Dynamic Loft', value: selectedSwing.dynamicLoft.toFixed(1), unit: '°' },
  ];

  const impactData: MetricRow[] = [
    { label: 'Impact Location', value: selectedSwing.impactLocation, unit: '' },
    { label: 'Smash Factor', value: selectedSwing.smashFactor.toFixed(2), unit: '', delta: selectedSwing.smashFactor - sessionAverages.smashFactor },
  ];

  const sections = [
    { title: 'Ball Data', metrics: ballData },
    { title: 'Club Data', metrics: clubData },
    { title: 'Impact', metrics: impactData },
  ];

  return (
    <div className="h-full bg-white rounded-lg border border-[#E2E5E8] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-[#E2E5E8] bg-[#F9FAFB]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Launch Data
        </h3>
        <p
          className="text-[10px] text-[#9CA3AF] mt-0.5"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Swing #{String(selectedSwing.swingNumber).padStart(2, '0')} • {selectedSwing.club}
        </p>
      </div>

      {/* Metrics */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {sections.map((section, si) => (
          <div key={section.title}>
            {si > 0 && <div className="border-t border-[#E2E5E8] my-2" />}
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#0D7C66] mb-1 mt-1">
              {section.title}
            </h4>
            {section.metrics.map((m) => (
              <MetricItem key={m.label} {...m} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
