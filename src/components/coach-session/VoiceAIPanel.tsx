import { MessageCircle, Sparkles } from 'lucide-react';
import type { CoachSessionTranscript, CoachSessionAIInsight } from '../../data/coachSessionData';

interface VoiceAIPanelProps {
  selectedSwingId: string;
  selectedSwingNumber: number;
  transcripts: CoachSessionTranscript[];
  insights: CoachSessionAIInsight[];
}

const confidenceStyles = {
  high: { bg: '#ECFDF5', text: '#0FA87A', label: 'High confidence' },
  moderate: { bg: '#FFFBEB', text: '#D4980B', label: 'Moderate confidence' },
  low: { bg: '#FEF2F2', text: '#C93B3B', label: 'Low confidence' },
};

export default function VoiceAIPanel({
  selectedSwingNumber,
  transcripts,
  insights,
}: VoiceAIPanelProps) {
  // Find the insight closest to or matching the selected swing
  const currentInsight = insights.find((i) => i.swingNumber === selectedSwingNumber)
    || insights.reduce<CoachSessionAIInsight | null>((closest, insight) => {
      if (insight.swingNumber > selectedSwingNumber) return closest;
      if (!closest || insight.swingNumber > closest.swingNumber) return insight;
      return closest;
    }, null);

  return (
    <div className="h-full bg-white rounded-lg border border-[#E2E5E8] overflow-hidden flex flex-col">
      {/* ── Section A: Coach Voice Transcript ── */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-3 pb-2 border-b border-[#E2E5E8] bg-[#F9FAFB] flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-[#0D7C66]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Coach Notes
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {transcripts.map((t, idx) => {
            const isHighlighted = t.swingNumber === selectedSwingNumber;
            return (
              <div
                key={idx}
                className="flex gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-200"
                style={{
                  backgroundColor: isHighlighted ? '#F0FDFA' : 'transparent',
                  border: isHighlighted ? '1px solid #0D7C6620' : '1px solid transparent',
                }}
              >
                {/* Swing badge */}
                <div className="flex-shrink-0 mt-0.5">
                  <span
                    className="inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      backgroundColor: isHighlighted ? '#0D7C66' : '#F3F4F6',
                      color: isHighlighted ? 'white' : '#6B7280',
                    }}
                  >
                    #{String(t.swingNumber).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[10px] text-[#9CA3AF] block mb-0.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {t.timestamp}
                  </span>
                  <p className="text-xs text-[#1A1F2B] leading-relaxed">
                    {t.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section B: AI Insight Card ── */}
      {currentInsight && (
        <div className="border-t border-[#E2E5E8]">
          <div className="px-4 pt-3 pb-2 bg-[#F9FAFB] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0D7C66]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              AI Insight
            </h3>
            <span
              className="text-[10px] ml-auto"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: '#9CA3AF' }}
            >
              Swing #{String(currentInsight.swingNumber).padStart(2, '0')}
            </span>
          </div>

          <div className="px-4 py-3 space-y-2.5">
            {/* Observation */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] block mb-1">
                Observation
              </span>
              <p className="text-xs text-[#1A1F2B] leading-relaxed">
                {currentInsight.observation}
              </p>
            </div>

            {/* Connection */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] block mb-1">
                Connection
              </span>
              <p className="text-xs text-[#1A1F2B] leading-relaxed">
                {currentInsight.connection}
              </p>
            </div>

            {/* Confidence pill */}
            <div className="flex items-center justify-end pt-1">
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: confidenceStyles[currentInsight.confidence].bg,
                  color: confidenceStyles[currentInsight.confidence].text,
                }}
              >
                {confidenceStyles[currentInsight.confidence].label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
