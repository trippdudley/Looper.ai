import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Wifi,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Send,
} from 'lucide-react';
import { golfers } from '../../../data/golfers';
import { driverRecommendation } from '../../../data/fittingRecommendations';
import { shaftComparisons } from '../../../data/fittingComparisons';
import { liveFittingInsights } from '../../../data/fittingAIInsights';
import FittingAIInsightCard from '../../../components/fitter/FittingAIInsightCard';
import ShaftComparisonTable from '../../../components/fitter/ShaftComparisonTable';
import OptimalWindowChart from '../../../components/fitter/OptimalWindowChart';

// ── Mock fitting shots ──
const fittingShots = [
  { shot: 1, club: 'Driver', shaft: 'Ventus Blue 6S', ballSpeed: 141.8, launch: 12.5, spin: 2510, carry: 236, total: 253, smash: 1.47 },
  { shot: 2, club: 'Driver', shaft: 'Ventus Blue 6S', ballSpeed: 143.1, launch: 13.0, spin: 2440, carry: 239, total: 257, smash: 1.48 },
  { shot: 3, club: 'Driver', shaft: 'Ventus Blue 6S', ballSpeed: 142.0, launch: 12.6, spin: 2520, carry: 237, total: 254, smash: 1.47 },
  { shot: 4, club: 'Driver', shaft: 'Ventus Blue 6S', ballSpeed: 142.8, launch: 12.9, spin: 2460, carry: 238, total: 256, smash: 1.48 },
  { shot: 5, club: 'Driver', shaft: 'Tensei White 65S', ballSpeed: 140.2, launch: 13.4, spin: 2700, carry: 232, total: 247, smash: 1.45 },
  { shot: 6, club: 'Driver', shaft: 'Tensei White 65S', ballSpeed: 141.0, launch: 13.6, spin: 2650, carry: 234, total: 249, smash: 1.46 },
  { shot: 7, club: 'Driver', shaft: 'Tour AD DI 6S', ballSpeed: 143.5, launch: 11.8, spin: 2290, carry: 241, total: 261, smash: 1.48 },
  { shot: 8, club: 'Driver', shaft: 'Tour AD DI 6S', ballSpeed: 142.8, launch: 12.0, spin: 2340, carry: 239, total: 258, smash: 1.48 },
];

const opt = driverRecommendation.optimalWindow;

function inOptimal(val: number, range: { min: number; max: number }): boolean {
  return val >= range.min && val <= range.max;
}

function optLabel(val: number, range: { min: number; max: number }): string | null {
  if (val > range.max) return '↑ above optimal';
  if (val < range.min) return '↓ below optimal';
  return null;
}

export default function FittingSession() {
  const navigate = useNavigate();
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/fitter/brief');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const golfer = golfers.find((g) => g.id === 'golfer-mike')!;

  // Session averages (driver only, all shafts combined for the overview)
  const driverShots = fittingShots.filter((s) => s.club === 'Driver');
  const avgBallSpeed = +(driverShots.reduce((s, v) => s + v.ballSpeed, 0) / driverShots.length).toFixed(1);
  const avgLaunch = +(driverShots.reduce((s, v) => s + v.launch, 0) / driverShots.length).toFixed(1);
  const avgSpin = Math.round(driverShots.reduce((s, v) => s + v.spin, 0) / driverShots.length);
  const avgCarry = Math.round(driverShots.reduce((s, v) => s + v.carry, 0) / driverShots.length);

  const dataTiles = [
    { label: 'Ball Speed', value: avgBallSpeed, unit: 'mph', range: opt.ballSpeed },
    { label: 'Launch Angle', value: avgLaunch, unit: '°', range: opt.launchAngle },
    { label: 'Spin Rate', value: avgSpin, unit: 'rpm', range: opt.spinRate },
    { label: 'Carry', value: avgCarry, unit: 'yds', range: opt.carry },
  ];

  return (
    <div className="space-y-4">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/fitter/brief" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Brief</span>
          </Link>
          <h1 className="font-serif text-xl text-white font-bold">
            Fitting Session &mdash; {golfer.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
            <Wifi className="w-3.5 h-3.5 text-accent-light" />
            <span className="text-xs text-gray-400">GCQuad <span className="text-accent-light font-medium">Connected</span></span>
          </div>
          <Link
            to="/fitter/report"
            className="inline-flex items-center gap-2 border border-coral text-coral rounded-lg px-4 py-1.5 text-sm font-semibold hover:bg-coral/10 transition-colors"
          >
            End Fitting
          </Link>
        </div>
      </div>

      {/* ── Three-column layout ── */}
      <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
        {/* ── LEFT: Shot History + Shaft Comparison (25%) ── */}
        <div className="w-[25%] space-y-4 flex flex-col min-h-0">
          <div className="glass-card flex-1 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Shot History</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['#', 'Shaft', 'BSpd', 'Lnch', 'Spin', 'Carry'].map((h) => (
                      <th key={h} className="px-2 py-2 text-left text-[10px] text-gray-600 uppercase tracking-wide font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fittingShots.map((shot, i) => (
                    <tr key={shot.shot} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                      <td className="px-2 py-1.5 font-mono text-xs text-gray-500">{shot.shot}</td>
                      <td className="px-2 py-1.5 text-[11px] text-gray-300 truncate max-w-[80px]">{shot.shaft.split(' ').slice(0, 2).join(' ')}</td>
                      <td className="px-2 py-1.5 font-mono text-xs text-white">{shot.ballSpeed}</td>
                      <td className="px-2 py-1.5 font-mono text-xs text-white">{shot.launch}°</td>
                      <td className="px-2 py-1.5 font-mono text-xs text-white">{shot.spin.toLocaleString()}</td>
                      <td className="px-2 py-1.5 font-mono text-xs text-white">{shot.carry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shaft comparison */}
          <ShaftComparisonTable comparisons={shaftComparisons} compact />
        </div>

        {/* ── CENTER: Launch Monitor Data (50%) ── */}
        <div className="w-[50%] space-y-4">
          {/* Data tiles with optimal window overlay */}
          <div className="grid grid-cols-2 gap-3">
            {dataTiles.map((tile) => {
              const ok = inOptimal(tile.value, tile.range);
              const note = optLabel(tile.value, tile.range);
              return (
                <div key={tile.label} className="bg-card-dark rounded-xl border border-border-dark p-4">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">{tile.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`font-mono text-2xl font-bold ${ok ? 'text-accent-light' : 'text-coral'}`}>
                      {tile.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">{tile.unit}</span>
                  </div>
                  {note && (
                    <p className="text-[10px] text-coral mt-1">{note}</p>
                  )}
                  {ok && (
                    <p className="text-[10px] text-accent-light/60 mt-1">In optimal window</p>
                  )}
                  <p className="text-[9px] text-gray-600 mt-0.5">
                    Optimal: {tile.range.min.toLocaleString()}–{tile.range.max.toLocaleString()} {tile.unit}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional metrics tiles */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Smash Factor', value: '1.47', ok: true },
              { label: 'Shots Hit', value: String(fittingShots.length), ok: true },
              { label: 'Shafts Tested', value: '3', ok: true },
              { label: 'Dispersion', value: '18 yds', ok: true },
            ].map((m) => (
              <div key={m.label} className="bg-card-dark rounded-xl border border-border-dark p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{m.label}</p>
                <p className="font-mono text-lg font-bold text-white">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Optimal window chart */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent-light" />
              <p className="text-sm font-semibold text-white">Session Averages vs. Optimal Window</p>
            </div>
            <OptimalWindowChart
              metrics={[
                { label: 'Launch Angle', unit: '°', range: opt.launchAngle, current: avgLaunch, fullMin: 8, fullMax: 18 },
                { label: 'Spin Rate', unit: 'rpm', range: opt.spinRate, current: avgSpin, fullMin: 1500, fullMax: 3500 },
                { label: 'Ball Speed', unit: 'mph', range: opt.ballSpeed, current: avgBallSpeed, fullMin: 130, fullMax: 155 },
                { label: 'Carry', unit: 'yds', range: opt.carry, current: avgCarry, fullMin: 200, fullMax: 270 },
              ]}
            />
          </div>
        </div>

        {/* ── RIGHT: AI Fitting Assistant (25%) ── */}
        <div className="w-[25%] flex flex-col min-h-0">
          <div className="glass-card flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-light" />
                <span className="text-sm font-semibold text-white">AI Assistant</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">Powered by 2.4M fittings</p>
            </div>

            {/* Insight feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {liveFittingInsights.map((insight) => (
                <div key={insight.id}>
                  <FittingAIInsightCard insight={insight} />
                  {/* Feedback buttons */}
                  {feedbackMode && (
                    <div className="flex items-center gap-2 mt-1.5 ml-12">
                      <button className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-accent-light transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-coral transition-colors">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-warm-amber transition-colors">
                        <Flag className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Ask the AI */}
            <div className="px-3 py-3 border-t border-white/10 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask the AI..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent/40"
                />
                <button className="p-2 bg-accent/20 rounded-lg text-accent-light hover:bg-accent/30 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setFeedbackMode(!feedbackMode)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                  feedbackMode
                    ? 'bg-accent/20 text-accent-light'
                    : 'bg-white/5 text-gray-500 hover:text-gray-300'
                }`}
              >
                {feedbackMode ? '✓ Fitter Feedback On' : 'Fitter Feedback'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
