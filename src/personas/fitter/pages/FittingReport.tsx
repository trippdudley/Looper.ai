import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Shield,
  Activity,
  Eye,
  Send,
  FileDown,
} from 'lucide-react';
import { shaftComparisons } from '../../../data/fittingComparisons';
import { driverRecommendation } from '../../../data/fittingRecommendations';
import ShaftComparisonTable from '../../../components/fitter/ShaftComparisonTable';
import OptimalWindowChart from '../../../components/fitter/OptimalWindowChart';

const optimalWindow = driverRecommendation.optimalWindow;

const optimalMetrics = [
  {
    label: 'Launch Angle',
    unit: '\u00b0',
    range: optimalWindow.launchAngle,
    current: 12.8,
    fullMin: 8,
    fullMax: 18,
  },
  {
    label: 'Spin Rate',
    unit: 'rpm',
    range: optimalWindow.spinRate,
    current: 2480,
    fullMin: 1500,
    fullMax: 3500,
  },
  {
    label: 'Ball Speed',
    unit: 'mph',
    range: optimalWindow.ballSpeed,
    current: 142.3,
    fullMin: 130,
    fullMax: 155,
  },
  {
    label: 'Carry',
    unit: 'yds',
    range: optimalWindow.carry,
    current: 238,
    fullMin: 200,
    fullMax: 270,
  },
  {
    label: 'Landing Angle',
    unit: '\u00b0',
    range: optimalWindow.landingAngle,
    current: 38,
    fullMin: 28,
    fullMax: 50,
  },
];

const refitMetrics = [
  { label: 'Club Speed', current: '95.2 mph', threshold: '91\u201399 mph' },
  { label: 'Attack Angle', current: '+2.1\u00b0', threshold: '+1.0\u00b0 to +3.5\u00b0' },
  { label: 'Spin Rate', current: '2,480 rpm', threshold: '2,200\u20132,700 rpm' },
];

export default function FittingReport() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 bg-transparent">
      {/* ── Back nav ── */}
      <Link
        to="/fitter/session"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent-light transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Session</span>
      </Link>

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl text-white font-bold">
          Fitting Report &mdash; Moe Norman
        </h1>
        <p className="text-sm text-gray-400 mt-1">March 8, 2026</p>
      </div>

      {/* ── 1. AI + Fitter Recommended Configuration ── */}
      <div className="glass-card p-5 border-l-[3px] border-l-accent-light">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-light" />
            <h2 className="text-lg font-semibold text-white">
              AI + Fitter Recommended Configuration
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent/20 text-accent-light px-3 py-1 rounded-full">
            AI Confidence: 92%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Head</p>
            <p className="text-sm text-white font-medium font-mono">
              TaylorMade Qi10, 10.5&deg;, Standard
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Shaft</p>
            <p className="text-sm text-white font-medium font-mono">
              Fujikura Ventus Blue 6, Stiff, 62g
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Grip</p>
            <p className="text-sm text-white font-medium font-mono">
              Golf Pride Tour Velvet, Standard
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Configuration
            </p>
            <p className="text-sm text-white font-medium font-mono">
              45.5&quot;, D2, Standard lie
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 italic mt-4">
          AI and fitter recommendation aligned
        </p>
      </div>

      {/* ── 2. Session Performance Summary ── */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-accent-light" />
          <h2 className="text-lg font-semibold text-white">
            Session Performance Summary
          </h2>
        </div>
        <ShaftComparisonTable comparisons={shaftComparisons} compact />
      </div>

      {/* ── 3. Key Metrics vs. Optimal Window ── */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Key Metrics vs. Optimal Window
        </h2>
        <OptimalWindowChart metrics={optimalMetrics} />

        {/* In-zone badges */}
        <div className="flex flex-wrap gap-2 mt-5">
          {optimalMetrics.map((m) => {
            const inZone = m.current >= m.range.min && m.current <= m.range.max;
            return inZone ? (
              <span
                key={m.label}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-accent/20 text-accent-light px-3 py-1 rounded-full"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {m.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* ── 4. Swing Evolution Context ── */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-accent-light" />
          <h2 className="text-lg font-semibold text-white">
            Swing Evolution Context
          </h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Your attack angle changed 1.1&deg; over 4 months of coaching. Your club
          speed increased 2.4 mph. This fitting accounts for that evolution
          &mdash; the recommended loft moved from 9&deg; to 10.5&deg; to match
          your new delivery.
        </p>
      </div>

      {/* ── 5. Predicted On-Course Impact ── */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Predicted On-Course Impact
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            { stat: '+12 yards', subtitle: 'Avg off the tee' },
            { stat: '18%', subtitle: 'Tighter dispersion' },
            { stat: '-0.8', subtitle: 'Predicted HCP impact' },
          ].map((tile) => (
            <div
              key={tile.stat}
              className="bg-white/5 rounded-lg p-4 text-center"
            >
              <p className="text-xl font-bold font-mono text-accent-light">
                {tile.stat}
              </p>
              <p className="text-xs text-gray-400 mt-1">{tile.subtitle}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Predictions based on outcomes from 12,400 similar golfer fittings
        </p>
      </div>

      {/* ── 6. Re-Fitting Monitor ── */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-accent-light" />
          <h2 className="text-lg font-semibold text-white">
            Re-Fitting Monitor
          </h2>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          We'll track your swing metrics from coaching sessions. If your swing
          evolves beyond this equipment's optimal window, we'll let you know.
        </p>

        <div className="space-y-3">
          {refitMetrics.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
            >
              <span className="text-sm text-gray-300">{row.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono font-semibold text-accent-light">
                  {row.current}
                </span>
                <span className="text-xs text-gray-500">
                  Threshold: {row.threshold}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Bottom Buttons ── */}
      <div className="flex items-center gap-3 pb-8">
        <Link
          to="/fitter"
          className="inline-flex items-center gap-2 bg-accent text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-accent-light transition-colors"
        >
          <Send className="w-4 h-4" />
          Send to Golfer
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-white/20 text-gray-300 rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-white/5 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Cross-persona data flow */}
      <div className="glass-card p-5 mt-6">
        <p className="text-[10px] uppercase tracking-wider text-accent-light font-semibold mb-3">
          Data shared with
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/golfer"
            className="inline-flex items-center gap-2 text-xs bg-white/5 rounded-lg border border-white/10 px-3 py-2 hover:border-accent/40 transition-colors text-gray-300"
          >
            <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[8px] font-bold text-accent-light">G</span>
            Golfer Equipment Profile
          </Link>
          <Link
            to="/coach/students/golfer-moe"
            className="inline-flex items-center gap-2 text-xs bg-white/5 rounded-lg border border-white/10 px-3 py-2 hover:border-accent/40 transition-colors text-gray-300"
          >
            <span className="w-4 h-4 rounded-full bg-data-blue/20 flex items-center justify-center text-[8px] font-bold text-data-blue">C</span>
            Coach Student Record
          </Link>
        </div>
      </div>
    </div>
  );
}
