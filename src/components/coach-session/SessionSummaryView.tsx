import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  BarChart3,
  ArrowRight,
  Clock,
  User,
} from 'lucide-react';
import type { CoachSessionData, CoachSessionSwing } from '../../data/coachSessionData';

interface SessionSummaryViewProps {
  sessionData: CoachSessionData;
}

function sign(n: number): string {
  return n > 0 ? '+' : '';
}

interface ComparisonMetric {
  label: string;
  baseline: string;
  postCue: string;
  delta: string;
  isImprovement: boolean;
  unit: string;
}

export default function SessionSummaryView({ sessionData }: SessionSummaryViewProps) {
  const { summary, swings, transcripts } = sessionData;

  const comparisons: ComparisonMetric[] = useMemo(() => {
    const b = summary.baselineAvg;
    const p = summary.postCueAvg;
    return [
      {
        label: 'Carry',
        baseline: `${b.carry}`,
        postCue: `${p.carry}`,
        delta: `${sign(p.carry - b.carry)}${p.carry - b.carry}`,
        isImprovement: p.carry > b.carry,
        unit: 'yds',
      },
      {
        label: 'Attack Angle',
        baseline: `${sign(b.attackAngle)}${b.attackAngle}°`,
        postCue: `${sign(p.attackAngle)}${p.attackAngle}°`,
        delta: `${sign(p.attackAngle - b.attackAngle)}${(p.attackAngle - b.attackAngle).toFixed(1)}°`,
        isImprovement: p.attackAngle > b.attackAngle, // less negative = better
        unit: '',
      },
      {
        label: 'Face-to-Path',
        baseline: `${sign(b.faceToPath)}${b.faceToPath}°`,
        postCue: `${sign(p.faceToPath)}${p.faceToPath}°`,
        delta: `${sign(Math.abs(p.faceToPath) - Math.abs(b.faceToPath))}${(Math.abs(p.faceToPath) - Math.abs(b.faceToPath)).toFixed(1)}°`,
        isImprovement: Math.abs(p.faceToPath) < Math.abs(b.faceToPath),
        unit: '',
      },
      {
        label: 'Spin Rate',
        baseline: b.spinRate.toLocaleString(),
        postCue: p.spinRate.toLocaleString(),
        delta: `${sign(p.spinRate - b.spinRate)}${Math.round(p.spinRate - b.spinRate).toLocaleString()}`,
        isImprovement: p.spinRate < b.spinRate,
        unit: 'rpm',
      },
      {
        label: 'Smash Factor',
        baseline: b.smashFactor.toFixed(2),
        postCue: p.smashFactor.toFixed(2),
        delta: `${sign(p.smashFactor - b.smashFactor)}${(p.smashFactor - b.smashFactor).toFixed(2)}`,
        isImprovement: p.smashFactor > b.smashFactor,
        unit: '',
      },
    ];
  }, [summary]);

  // find coach note for a swing
  const noteForSwing = (swingNum: number) => {
    const t = transcripts.find((tr) => tr.swingNumber === swingNum);
    return t ? t.text : '';
  };

  // AI tag for a swing
  const tagForSwing = (swing: CoachSessionSwing): string => {
    if (swing.swingNumber <= 5) return 'Baseline';
    if (swing.swingNumber === 6) return 'Cue Introduced';
    if (swing.swingNumber === 9) return 'Regression';
    if (swing.swingNumber >= 13) return 'Validation';
    return 'Post-Cue';
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* ── 1. Session Header ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E2E5E8] p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2B2D] mb-1">
              Session Summary
            </h1>
            <p className="text-sm text-[#9CA3AF]">
              {sessionData.date} • {sessionData.duration} • {sessionData.totalSwings} swings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <User className="w-4 h-4" />
              {sessionData.playerName}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Target className="w-4 h-4" />
              {sessionData.coachName}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Clock className="w-4 h-4" />
              {sessionData.duration}
            </div>
          </div>
        </div>

        {/* Headline metric */}
        <div className="bg-[#F0FDFA] rounded-lg px-6 py-4 border border-[#3A9D7820]">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#3A9D78]" />
            <span
              className="text-lg font-bold text-[#3A9D78]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {summary.headlineMetric}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. AI Lesson Summary ────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E2E5E8] p-8 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-4 h-4 text-[#3A9D78]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Lesson Summary
          </h2>
        </div>

        <div className="space-y-4">
          {summary.lessonSummary.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-sm leading-relaxed"
              style={{
                color: '#1C2B2D',
                fontStyle: idx === 0 ? 'italic' : 'normal',
                fontFamily: idx === 0 ? "'Playfair Display', Georgia, serif" : 'inherit',
                fontSize: idx === 0 ? '15px' : '14px',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* ── 3. Key Comparisons ─────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E2E5E8] p-8 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-4 h-4 text-[#3A9D78]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Key Comparisons
          </h2>
          <span className="text-[10px] text-[#9CA3AF] ml-2">
            Baseline (Swings 1-5) → Post-Cue (Swings 13-18)
          </span>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {comparisons.map((c) => (
            <div key={c.label} className="rounded-lg border border-[#E2E5E8] p-4 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] block mb-3">
                {c.label}
              </span>

              <div className="flex items-center justify-center gap-2 mb-2">
                <span
                  className="text-sm text-[#9CA3AF]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {c.baseline}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                <span
                  className="text-sm font-bold text-[#1C2B2D]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {c.postCue}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1">
                {c.isImprovement ? (
                  <TrendingUp className="w-3 h-3 text-[#0FA87A]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-[#C93B3B]" />
                )}
                <span
                  className="text-xs font-bold"
                  style={{
                    color: c.isImprovement ? '#0FA87A' : '#C93B3B',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {c.delta} {c.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Practice Plan ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E2E5E8] p-8 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-4 h-4 text-[#3A9D78]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Practice Plan
          </h2>
        </div>

        <div className="space-y-4">
          {summary.practicePlan.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-[#E2E5E8] p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-bold text-[#1C2B2D]">{item.name}</h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: item.cueType === 'external' ? '#ECFDF5' : '#EFF6FF',
                    color: item.cueType === 'external' ? '#3A9D78' : '#3B82F6',
                  }}
                >
                  {item.cueType === 'external' ? 'External Cue' : 'Internal Cue'}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    Cue
                  </span>
                  <p className="text-xs text-[#1C2B2D] mt-0.5 italic">"{item.cue}"</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    Reps
                  </span>
                  <p className="text-xs text-[#1C2B2D] mt-0.5">{item.reps}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                    Success Criteria
                  </span>
                  <p className="text-xs text-[#1C2B2D] mt-0.5">{item.successCriteria}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Session Chronicle Log ──────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E2E5E8] p-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-4 h-4 text-[#3A9D78]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Session Chronicle
          </h2>
          <span className="text-[10px] text-[#9CA3AF] ml-2">
            All {swings.length} swings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E2E5E8]">
                <th className="text-left py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">#</th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Time</th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Club</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Ball Spd</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Carry</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Attack</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">F-to-P</th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Tag</th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Coach Note</th>
              </tr>
            </thead>
            <tbody>
              {swings.map((swing) => {
                const tag = tagForSwing(swing);
                const note = noteForSwing(swing.swingNumber);

                return (
                  <tr key={swing.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-2 px-2">
                      <span
                        className="font-bold"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: '#1C2B2D' }}
                      >
                        {String(swing.swingNumber).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="py-2 px-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#9CA3AF' }}>
                      {swing.timestamp}
                    </td>
                    <td className="py-2 px-2 text-[#6B7280]">{swing.club}</td>
                    <td className="py-2 px-2 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#1C2B2D' }}>
                      {swing.ballSpeed.toFixed(1)}
                    </td>
                    <td className="py-2 px-2 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#1C2B2D' }}>
                      {swing.carry}
                    </td>
                    <td className="py-2 px-2 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#1C2B2D' }}>
                      {sign(swing.attackAngle)}{swing.attackAngle.toFixed(1)}°
                    </td>
                    <td className="py-2 px-2 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#1C2B2D' }}>
                      {sign(swing.faceToPath)}{swing.faceToPath.toFixed(1)}°
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: tag === 'Baseline' ? '#EFF6FF'
                            : tag === 'Validation' ? '#ECFDF5'
                            : tag === 'Regression' ? '#FEF2F2'
                            : tag === 'Cue Introduced' ? '#F0FDFA'
                            : '#FFF7ED',
                          color: tag === 'Baseline' ? '#3B82F6'
                            : tag === 'Validation' ? '#3A9D78'
                            : tag === 'Regression' ? '#C93B3B'
                            : tag === 'Cue Introduced' ? '#3A9D78'
                            : '#D4980B',
                        }}
                      >
                        {tag}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-[#6B7280] max-w-[200px] truncate" title={note}>
                      {note ? `"${note.slice(0, 60)}${note.length > 60 ? '...' : ''}"` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-[10px] text-[#9CA3AF]">
          Generated by Looper.AI • {sessionData.date} • Confidential
        </p>
      </div>
    </div>
  );
}
