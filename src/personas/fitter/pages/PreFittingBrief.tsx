import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  User,
  Clock,
  TrendingUp,
  Target,
} from 'lucide-react';
import { driverRecommendation } from '../../../data/fittingRecommendations';
import SwingEvolutionCard from '../../../components/fitter/SwingEvolutionCard';
import OptimalWindowChart from '../../../components/fitter/OptimalWindowChart';

const rec = driverRecommendation;
const { aiRecommendation, golferProfile, optimalWindow } = rec;

export default function PreFittingBrief() {
  return (
    <div className="bg-transparent min-h-full">
      {/* Back nav */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/fitter"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lookup</span>
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* ── Left Column (55%) ── */}
        <div className="flex-[1.22] space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">
                AI Pre-Fitting Brief
              </h1>
              <Sparkles className="w-5 h-5 text-accent-light" />
            </div>
            <p className="text-sm text-gray-500">
              Generated from 8 months of coaching data + 2.4M fitting outcomes
            </p>
          </div>

          {/* Golfer Profile Summary */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Moe Norman</h2>
                <p className="text-xs text-gray-500">
                  HCP{' '}
                  <span className="text-white font-mono font-semibold">
                    15.2
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Current Equipment
                </p>
                <p className="text-sm text-gray-300">
                  {golferProfile.currentEquipment}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Time Since Last Fitting
                </p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-white font-mono">
                    {golferProfile.timeSinceLastFitting}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Improvement Score
                </p>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-accent-light" />
                  <span className="text-sm text-accent-light font-mono font-semibold">
                    +12%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Current Focus
                </p>
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    Driver consistency and weight transfer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Swing Evolution Card */}
          <SwingEvolutionCard />

          {/* Optimal Launch Window */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Optimal Launch Window
            </h3>
            <OptimalWindowChart
              metrics={[
                {
                  label: 'Launch Angle',
                  unit: '\u00b0',
                  range: optimalWindow.launchAngle,
                  current: 11.2,
                  fullMin: 8,
                  fullMax: 18,
                },
                {
                  label: 'Spin Rate',
                  unit: 'rpm',
                  range: optimalWindow.spinRate,
                  current: 2850,
                  fullMin: 1500,
                  fullMax: 3500,
                },
                {
                  label: 'Ball Speed',
                  unit: 'mph',
                  range: optimalWindow.ballSpeed,
                  current: 138.4,
                  fullMin: 130,
                  fullMax: 155,
                },
                {
                  label: 'Carry',
                  unit: 'yds',
                  range: optimalWindow.carry,
                  current: 228,
                  fullMin: 200,
                  fullMax: 270,
                },
                {
                  label: 'Landing Angle',
                  unit: '\u00b0',
                  range: optimalWindow.landingAngle,
                  current: 36,
                  fullMin: 28,
                  fullMax: 50,
                },
              ]}
            />
          </div>
        </div>

        {/* ── Right Column (45%) ── */}
        <div className="flex-1 space-y-5">
          {/* AI Equipment Recommendation */}
          <div className="glass-card p-5 border-l-[3px] border-l-accent-light">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Recommended Configuration
              </h3>
              <span className="text-[11px] font-mono font-semibold text-accent-light bg-accent-light/10 px-2 py-0.5 rounded-full">
                {aiRecommendation.head.confidence}% confidence
              </span>
            </div>

            <div className="space-y-4">
              {/* Head */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Head
                </p>
                <p className="text-sm text-white">
                  {aiRecommendation.head.make} {aiRecommendation.head.model},{' '}
                  {aiRecommendation.head.loft},{' '}
                  {aiRecommendation.head.setting} setting
                </p>
                <p className="text-[11px] text-accent-light/70 font-mono mt-0.5">
                  {aiRecommendation.head.confidence}% confidence
                </p>
              </div>

              {/* Shaft */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Shaft
                </p>
                <p className="text-sm text-white">
                  {aiRecommendation.shaft.make}{' '}
                  {aiRecommendation.shaft.model},{' '}
                  {aiRecommendation.shaft.flex},{' '}
                  {aiRecommendation.shaft.weight},{' '}
                  {aiRecommendation.shaft.kickPoint} kick
                </p>
                <p className="text-[11px] text-accent-light/70 font-mono mt-0.5">
                  {aiRecommendation.shaft.confidence}% confidence
                </p>
              </div>

              {/* Grip */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Grip
                </p>
                <p className="text-sm text-white">
                  {aiRecommendation.grip.make} {aiRecommendation.grip.model},{' '}
                  {aiRecommendation.grip.size}
                </p>
              </div>

              {/* Configuration */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Configuration
                </p>
                <p className="text-sm text-white font-mono">
                  {aiRecommendation.configuration.length},{' '}
                  {aiRecommendation.configuration.swingWeight},{' '}
                  {aiRecommendation.configuration.lieAngle} lie
                </p>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent-light" />
              <h3 className="text-sm font-semibold text-white">
                AI Reasoning
              </h3>
            </div>

            <ol className="space-y-3">
              {aiRecommendation.reasoning.map((reason, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[11px] font-mono font-semibold text-accent-light mt-0.5 shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    {reason}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Based On */}
          <div className="glass-card p-5">
            <h3 className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
              Based on
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-white font-mono">
                  {aiRecommendation.basedOn.similarGolfers.toLocaleString()}{' '}
                  <span className="text-gray-400 font-sans">
                    similar golfer fittings
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">
                  Avg Outcome
                </p>
                <p className="text-sm text-accent-light font-mono">
                  {aiRecommendation.basedOn.avgOutcomeImprovement}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">
                  Top Combination
                </p>
                <p className="text-sm text-white font-mono">
                  {aiRecommendation.basedOn.topPerformingCombination}
                </p>
              </div>
            </div>
          </div>

          {/* Start Fitting Button */}
          <Link
            to="/fitter/session"
            className="flex items-center justify-center gap-2 w-full bg-accent text-white rounded-lg px-6 py-3.5 font-semibold text-sm hover:bg-accent/90 transition-colors"
          >
            <Target className="w-4 h-4" />
            Start Fitting Session
          </Link>
        </div>
      </div>
    </div>
  );
}
