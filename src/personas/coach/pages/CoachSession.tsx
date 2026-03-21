import { useState, useMemo } from 'react';
import { Monitor, FileText, User, Clock, Calendar } from 'lucide-react';
import { coachSessionData } from '../../../data/coachSessionData';
import SwingCatalog from '../../../components/coach-session/SwingCatalog';
import VideoPlayer from '../../../components/coach-session/VideoPlayer';
import LaunchDataPanel from '../../../components/coach-session/LaunchDataPanel';
import VoiceAIPanel from '../../../components/coach-session/VoiceAIPanel';
import SessionSummaryView from '../../../components/coach-session/SessionSummaryView';

type SessionMode = 'live' | 'summary';

export default function CoachSession() {
  const [selectedSwingId, setSelectedSwingId] = useState(coachSessionData.swings[0].id);
  const [mode, setMode] = useState<SessionMode>('live');

  const selectedSwing = coachSessionData.swings.find((s) => s.id === selectedSwingId) || coachSessionData.swings[0];

  // Compute session averages for the launch data panel
  const sessionAverages = useMemo(() => {
    const swings = coachSessionData.swings;
    const avg = (fn: (s: (typeof swings)[0]) => number) =>
      swings.reduce((a, s) => a + fn(s), 0) / swings.length;
    return {
      ballSpeed: avg((s) => s.ballSpeed),
      launchAngle: avg((s) => s.launchAngle),
      spinRate: avg((s) => s.spinRate),
      carry: avg((s) => s.carry),
      total: avg((s) => s.total),
      clubSpeed: avg((s) => s.clubSpeed),
      attackAngle: avg((s) => s.attackAngle),
      clubPath: avg((s) => s.clubPath),
      faceAngle: avg((s) => s.faceAngle),
      faceToPath: avg((s) => s.faceToPath),
      smashFactor: avg((s) => s.smashFactor),
    };
  }, []);

  return (
    <div className="-m-6 flex flex-col h-[calc(100vh-49px)] overflow-hidden bg-[#F6F7F9]">
      {/* ── TOP BAR ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E2E5E8] flex-shrink-0">
        {/* Left: session metadata */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#3A9D78]" />
            <span className="text-sm font-semibold text-[#1C2B2D]">{coachSessionData.playerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9CA3AF]">Coach:</span>
            <span className="text-sm text-[#1C2B2D]">{coachSessionData.coachName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span className="text-sm text-[#6B7280]">{coachSessionData.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span className="text-sm text-[#6B7280]">{coachSessionData.duration}</span>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#6B7280]">
            {coachSessionData.club}
          </span>
        </div>

        {/* Right: mode toggle */}
        <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5">
          <button
            onClick={() => setMode('live')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor: mode === 'live' ? '#3A9D78' : 'transparent',
              color: mode === 'live' ? 'white' : '#6B7280',
            }}
          >
            <Monitor className="w-3.5 h-3.5" />
            Live Session
          </button>
          <button
            onClick={() => setMode('summary')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor: mode === 'summary' ? '#3A9D78' : 'transparent',
              color: mode === 'summary' ? 'white' : '#6B7280',
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            Summary
          </button>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────── */}
      {mode === 'live' ? (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Rail: Swing Catalog — 20% width */}
          <div className="hidden md:block w-[20%] min-w-[220px] max-w-[300px] flex-shrink-0 border-r border-[#E2E5E8] bg-[#F9FAFB]">
            <SwingCatalog
              swings={coachSessionData.swings}
              selectedSwingId={selectedSwingId}
              onSelectSwing={setSelectedSwingId}
            />
          </div>

          {/* Right Area: Video (top 55%) + Launch Data & Voice/AI (bottom 45%) */}
          <div className="flex-1 flex flex-col min-h-0 p-3 gap-3">
            {/* Video Player — 55% height */}
            <div className="h-[55%] min-h-0">
              <VideoPlayer selectedSwing={selectedSwing} />
            </div>

            {/* Bottom panels — 45% height */}
            <div className="h-[45%] min-h-0 flex gap-3">
              {/* Launch Data — left half */}
              <div className="w-1/2">
                <LaunchDataPanel
                  selectedSwing={selectedSwing}
                  sessionAverages={sessionAverages}
                />
              </div>

              {/* Voice Notes + AI — right half */}
              <div className="w-1/2">
                <VoiceAIPanel
                  selectedSwingId={selectedSwingId}
                  selectedSwingNumber={selectedSwing.swingNumber}
                  transcripts={coachSessionData.transcripts}
                  insights={coachSessionData.insights}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Summary Mode — single scrollable page */
        <div className="flex-1 overflow-y-auto p-6">
          <SessionSummaryView sessionData={coachSessionData} />
        </div>
      )}
    </div>
  );
}
