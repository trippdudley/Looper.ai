import { useMemo } from 'react';
import { Hash } from 'lucide-react';
import type { CoachSessionSwing } from '../../data/coachSessionData';
import { getQualityColor } from '../../data/coachSessionData';

interface SwingCatalogProps {
  swings: CoachSessionSwing[];
  selectedSwingId: string;
  onSelectSwing: (id: string) => void;
}

export default function SwingCatalog({ swings, selectedSwingId, onSelectSwing }: SwingCatalogProps) {
  const stats = useMemo(() => {
    const avg = (fn: (s: CoachSessionSwing) => number) =>
      swings.reduce((a, s) => a + fn(s), 0) / swings.length;
    return {
      totalSwings: swings.length,
      avgBallSpeed: avg((s) => s.ballSpeed).toFixed(1),
      avgCarry: Math.round(avg((s) => s.carry)),
    };
  }, [swings]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#E2E5E8]">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-4 h-4 text-[#3A9D78]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Swing Catalog
          </h3>
        </div>
        <p className="text-[11px] text-[#9CA3AF]">{swings.length} swings recorded</p>
      </div>

      {/* Swing List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {swings.map((swing) => {
          const isSelected = swing.id === selectedSwingId;
          const qc = getQualityColor(swing.qualityScore);

          return (
            <button
              key={swing.id}
              onClick={() => onSelectSwing(swing.id)}
              className="w-full text-left rounded-lg transition-all duration-200"
              style={{
                backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
                border: `1px solid ${isSelected ? '#3A9D78' : '#E2E5E8'}`,
                borderLeftWidth: '3px',
                borderLeftColor: isSelected ? '#3A9D78' : qc.border,
                boxShadow: isSelected ? '0 1px 4px rgba(13,124,102,0.10)' : 'none',
              }}
            >
              <div className="px-3 py-2.5">
                {/* Top row: swing number + timestamp + club */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold tracking-tight"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: isSelected ? '#3A9D78' : '#1C2B2D' }}
                    >
                      #{String(swing.swingNumber).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[10px] text-[#9CA3AF]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {swing.timestamp}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">
                    {swing.club}
                  </span>
                </div>

                {/* Metric row: carry + quality */}
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-lg font-bold text-[#1C2B2D]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {swing.carry}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">yds</span>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: qc.bg, color: qc.text }}
                  >
                    {swing.qualityScore}
                  </span>
                </div>

                {/* Intent tag */}
                {swing.intentTag && (
                  <div className="mt-1.5">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: swing.intentTag === 'Baseline' ? '#EFF6FF'
                          : swing.intentTag === 'Validation' ? '#ECFDF5'
                          : '#FFF7ED',
                        color: swing.intentTag === 'Baseline' ? '#3B82F6'
                          : swing.intentTag === 'Validation' ? '#3A9D78'
                          : '#D4980B',
                      }}
                    >
                      {swing.intentTag}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Session Stats Footer */}
      <div className="border-t border-[#E2E5E8] px-4 py-3 bg-[#F9FAFB]">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
          Session Stats
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div
              className="text-sm font-bold text-[#1C2B2D]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {stats.totalSwings}
            </div>
            <div className="text-[9px] text-[#9CA3AF]">Swings</div>
          </div>
          <div>
            <div
              className="text-sm font-bold text-[#1C2B2D]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {stats.avgBallSpeed}
            </div>
            <div className="text-[9px] text-[#9CA3AF]">Avg mph</div>
          </div>
          <div>
            <div
              className="text-sm font-bold text-[#1C2B2D]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {stats.avgCarry}
            </div>
            <div className="text-[9px] text-[#9CA3AF]">Avg yds</div>
          </div>
        </div>
      </div>
    </div>
  );
}
