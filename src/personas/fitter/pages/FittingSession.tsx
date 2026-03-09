import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Wifi,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MessageSquare,
} from 'lucide-react';
import { golfers } from '../../../data/golfers';
import { sessions } from '../../../data/sessions';
import { trackmanShots } from '../../../data/trackmanData';

// ── Mock fitting shots (Foresight GCQuad data, NOT from trackmanData) ──
const fittingShots = [
  { shot: 1, club: 'Driver',  ballSpeed: 152.3, launch: 10.8, spin: 2420, carry: 248, total: 267, landing: 38.2, spinAxis: -1.5, smash: 1.48 },
  { shot: 2, club: 'Driver',  ballSpeed: 151.8, launch: 11.2, spin: 2580, carry: 245, total: 263, landing: 39.1, spinAxis: 0.8,  smash: 1.47 },
  { shot: 3, club: 'Driver',  ballSpeed: 153.1, launch: 10.5, spin: 2350, carry: 251, total: 270, landing: 37.8, spinAxis: -0.5, smash: 1.49 },
  { shot: 4, club: '7-Iron',  ballSpeed: 120.5, launch: 16.2, spin: 6580, carry: 165, total: 173, landing: 48.5, spinAxis: 0.3,  smash: 1.42 },
  { shot: 5, club: '7-Iron',  ballSpeed: 119.8, launch: 15.8, spin: 6720, carry: 163, total: 171, landing: 49.2, spinAxis: -0.8, smash: 1.41 },
  { shot: 6, club: '7-Iron',  ballSpeed: 121.2, launch: 16.5, spin: 6450, carry: 167, total: 175, landing: 47.8, spinAxis: 0.5,  smash: 1.43 },
  { shot: 7, club: '5-Iron',  ballSpeed: 132.5, launch: 14.2, spin: 5200, carry: 188, total: 199, landing: 44.5, spinAxis: -1.2, smash: 1.39 },
  { shot: 8, club: 'PW',      ballSpeed: 98.2,  launch: 24.5, spin: 8950, carry: 128, total: 132, landing: 52.3, spinAxis: 0.2,  smash: 1.35 },
];

// ── Swing change comparison data (since last fitting April 2025) ──
const swingChanges = [
  {
    metric: 'Club Speed',
    before: 93.5,
    after: 95.8,
    unit: 'mph',
    delta: +2.3,
    improved: true,
    note: null,
  },
  {
    metric: 'Attack Angle',
    before: -2.1,
    after: -4.5,
    unit: '\u00b0',
    delta: -2.4,
    improved: false,
    note: 'Steeper. Consider shaft flex adjustment.',
  },
  {
    metric: 'Spin Rate',
    before: 2950,
    after: 2520,
    unit: 'rpm',
    delta: -430,
    improved: true,
    note: 'Lower spin may warrant loft adjustment.',
  },
  {
    metric: 'Launch Angle',
    before: 11.8,
    after: 11.2,
    unit: '\u00b0',
    delta: -0.6,
    improved: false,
    note: 'Slightly lower. Shaft flex change may help optimize.',
  },
  {
    metric: 'Club Path',
    before: -2.5,
    after: 0.3,
    unit: '\u00b0',
    delta: +2.8,
    improved: true,
    note: 'Now in-to-out. Draw bias shaft/head no longer needed.',
  },
];

function smashColor(smash: number): string {
  if (smash >= 1.45) return 'text-accent';
  if (smash >= 1.38) return 'text-navy';
  return 'text-coral';
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10;
}

export default function FittingSession() {
  const golfer = golfers.find((g) => g.id === 'golfer-mike')!;

  const mikeSessions = useMemo(
    () =>
      sessions
        .filter((s) => s.golferId === 'golfer-mike')
        .sort((a, b) => a.date.localeCompare(b.date)),
    []
  );

  // ── Session averages by club ──
  const driverShots = fittingShots.filter((s) => s.club === 'Driver');
  const ironShots = fittingShots.filter((s) => s.club === '7-Iron');

  const driverAvg = {
    ballSpeed: avg(driverShots.map((s) => s.ballSpeed)),
    launch: avg(driverShots.map((s) => s.launch)),
    spin: Math.round(driverShots.reduce((sum, s) => sum + s.spin, 0) / driverShots.length),
    carry: avg(driverShots.map((s) => s.carry)),
    smash: avg(driverShots.map((s) => s.smash)),
    landing: avg(driverShots.map((s) => s.landing)),
  };

  const ironAvg = {
    ballSpeed: avg(ironShots.map((s) => s.ballSpeed)),
    launch: avg(ironShots.map((s) => s.launch)),
    spin: Math.round(ironShots.reduce((sum, s) => sum + s.spin, 0) / ironShots.length),
    carry: avg(ironShots.map((s) => s.carry)),
    smash: avg(ironShots.map((s) => s.smash)),
    landing: avg(ironShots.map((s) => s.landing)),
  };

  // ── 6-month trend data from trackman shots (driver only per session) ──
  const trendData = useMemo(() => {
    return mikeSessions.map((session, i) => {
      const shots = trackmanShots.filter(
        (s) => s.sessionId === session.id && s.club === 'Driver'
      );
      const count = shots.length || 1;
      return {
        label: `S${i + 1}`,
        clubSpeed:
          Math.round(
            (shots.reduce((sum, s) => sum + s.clubSpeed, 0) / count) * 10
          ) / 10,
        spinRate: Math.round(
          shots.reduce((sum, s) => sum + s.spinRate, 0) / count
        ),
        attackAngle:
          Math.round(
            (shots.reduce((sum, s) => sum + s.attackAngle, 0) / count) * 10
          ) / 10,
      };
    });
  }, [mikeSessions]);

  return (
    <div className="space-y-5">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-navy font-bold">
          Fitting Session &mdash; {golfer.name}
        </h1>
        <Link
          to="/fitter"
          className="inline-flex items-center gap-2 border border-coral text-coral rounded-lg px-5 py-2 text-sm font-semibold hover:bg-coral/5 transition-colors"
        >
          End Fitting
        </Link>
      </div>

      {/* Integration Badge */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <Wifi className="w-3.5 h-3.5 text-accent" />
        <span className="text-sm text-gray-600">
          Foresight GCQuad: <span className="font-medium text-accent">Connected</span>
        </span>
      </div>

      {/* ── Two Column Layout ── */}
      <div className="flex gap-6">
        {/* ── Left Column (55%) ── */}
        <div className="flex-[1.2] space-y-5">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
            Current Fitting Session
          </h2>

          {/* Live Shot Data Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['#', 'Club', 'Ball Spd', 'Launch', 'Spin', 'Carry', 'Total', 'Land\u00b0', 'Spin Axis', 'Smash'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left text-xs text-gray-500 uppercase tracking-wide font-medium"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {fittingShots.map((shot, i) => (
                    <tr
                      key={shot.shot}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-bg-light'}
                    >
                      <td className="px-3 py-2 font-mono text-sm text-gray-500">
                        {shot.shot}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-navy">
                        {shot.club}
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-navy">
                        {shot.ballSpeed}
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-navy">
                        {shot.launch}&deg;
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-navy">
                        {shot.spin.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-navy">
                        {shot.carry}
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-navy">
                        {shot.total}
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-navy">
                        {shot.landing}&deg;
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-navy">
                        {shot.spinAxis > 0 ? '+' : ''}
                        {shot.spinAxis}&deg;
                      </td>
                      <td
                        className={`px-3 py-2 font-mono text-sm font-bold ${smashColor(
                          shot.smash
                        )}`}
                      >
                        {shot.smash.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Session Averages */}
          <div className="space-y-3">
            <h3 className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Session Averages
            </h3>

            {/* Driver Averages */}
            <div>
              <p className="text-xs font-semibold text-navy mb-2">Driver</p>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { label: 'Avg Ball Speed', value: `${driverAvg.ballSpeed}`, unit: 'mph' },
                  { label: 'Avg Launch', value: `${driverAvg.launch}\u00b0`, unit: '' },
                  { label: 'Avg Spin', value: driverAvg.spin.toLocaleString(), unit: 'rpm' },
                  { label: 'Avg Carry', value: `${driverAvg.carry}`, unit: 'yds' },
                  { label: 'Avg Smash', value: driverAvg.smash.toFixed(2), unit: '' },
                  { label: 'Avg Landing', value: `${driverAvg.landing}\u00b0`, unit: '' },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white rounded-lg border border-gray-200 p-3"
                  >
                    <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                    <p className="font-mono text-sm font-bold text-navy">
                      {m.value}
                      {m.unit && (
                        <span className="text-xs text-gray-400 font-sans font-normal ml-0.5">
                          {m.unit}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Iron Averages */}
            <div>
              <p className="text-xs font-semibold text-navy mb-2">7-Iron</p>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { label: 'Avg Ball Speed', value: `${ironAvg.ballSpeed}`, unit: 'mph' },
                  { label: 'Avg Launch', value: `${ironAvg.launch}\u00b0`, unit: '' },
                  { label: 'Avg Spin', value: ironAvg.spin.toLocaleString(), unit: 'rpm' },
                  { label: 'Avg Carry', value: `${ironAvg.carry}`, unit: 'yds' },
                  { label: 'Avg Smash', value: ironAvg.smash.toFixed(2), unit: '' },
                  { label: 'Avg Landing', value: `${ironAvg.landing}\u00b0`, unit: '' },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white rounded-lg border border-gray-200 p-3"
                  >
                    <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                    <p className="font-mono text-sm font-bold text-navy">
                      {m.value}
                      {m.unit && (
                        <span className="text-xs text-gray-400 font-sans font-normal ml-0.5">
                          {m.unit}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column (45%) ── */}
        <div className="flex-1 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
              Looper Profile Comparison
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Historical Context from Coaching Record
            </p>
          </div>

          {/* Changes Since Last Fitting */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-navy mb-1">
              Changes Since Last Fitting
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Swing Changes Since Last Equipment Fitting (April 2025)
            </p>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Metric', 'At Last Fitting', 'Current', 'Change'].map(
                    (h) => (
                      <th
                        key={h}
                        className="pb-2 text-left text-xs text-gray-500 uppercase tracking-wide font-medium"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {swingChanges.map((row) => {
                  const isPositive = row.improved;
                  const DeltaIcon = row.delta > 0 ? ArrowUpRight : row.delta < 0 ? ArrowDownRight : Minus;
                  return (
                    <tr key={row.metric} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 text-sm text-navy font-medium">
                        {row.metric}
                      </td>
                      <td className="py-2.5 text-sm text-gray-500 font-mono">
                        {row.before}
                        {row.unit}
                      </td>
                      <td className="py-2.5 text-sm font-bold text-navy font-mono">
                        {row.after}
                        {row.unit}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isPositive
                              ? 'bg-accent/10 text-accent'
                              : 'bg-coral/10 text-coral'
                          }`}
                        >
                          <DeltaIcon className="w-3 h-3" />
                          {row.delta > 0 ? '+' : ''}
                          {row.delta}
                          {row.unit !== 'mph' && row.unit !== 'rpm' ? row.unit : ` ${row.unit}`}
                        </span>
                        {row.note && (
                          <p className="text-xs text-gray-500 italic mt-1">
                            {row.note}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Coaching Context */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-navy">
                What the Coach Has Been Working On
              </h3>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Current Focus
              </p>
              <p className="text-sm text-navy font-medium">
                {golfer.currentFocus}
              </p>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Key Changes Affecting Fitting
              </p>
              <ul className="space-y-2">
                {[
                  'Weight transfer improved \u2014 now moving into lead side properly',
                  'Attack angle steepened on irons \u2014 better compression',
                  'Driver path corrected from -2.5\u00b0 to +0.3\u00b0 \u2014 slice eliminated',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-accent/5 rounded-lg p-3 mt-3">
              <p className="text-xs text-accent font-medium italic">
                These coaching changes directly affect optimal equipment specs.
              </p>
            </div>
          </div>

          {/* 6-Month Metric Trends */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-navy mb-4">
              6-Month Metric Trends
            </h3>

            <div className="space-y-4">
              {/* Club Speed Trend */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Club Speed (Driver)</p>
                  <p className="text-xs font-mono text-navy">
                    {trendData[trendData.length - 1]?.clubSpeed ?? '\u2014'} mph
                  </p>
                </div>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['dataMin - 1', 'dataMax + 1']}
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                        width={35}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="clubSpeed"
                        stroke="#4A90D9"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#4A90D9' }}
                        name="Club Speed"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Spin Rate Trend */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Spin Rate (Driver)</p>
                  <p className="text-xs font-mono text-navy">
                    {trendData[trendData.length - 1]?.spinRate ?? '\u2014'} rpm
                  </p>
                </div>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['dataMin - 200', 'dataMax + 200']}
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="spinRate"
                        stroke="#E97451"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#E97451' }}
                        name="Spin Rate"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Attack Angle Trend */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Attack Angle (Driver)</p>
                  <p className="text-xs font-mono text-navy">
                    {trendData[trendData.length - 1]?.attackAngle ?? '\u2014'}&deg;
                  </p>
                </div>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={['dataMin - 1', 'dataMax + 1']}
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        axisLine={false}
                        tickLine={false}
                        width={35}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="attackAngle"
                        stroke="#2E8B57"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#2E8B57' }}
                        name="Attack Angle"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
