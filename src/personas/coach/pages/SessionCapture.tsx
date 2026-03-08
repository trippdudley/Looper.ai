import { useState, useEffect, useMemo } from 'react';
import type { TrackmanShot } from '../../../data/trackmanData';
import {
  Mic,
  MicOff,
  Square,
  Target,
  ChevronDown,
  ChevronUp,
  Timer,
  CheckCircle2,
  MessageCircle,
  Plus,
  BarChart3,
  Circle,
} from 'lucide-react';
import { golfers } from '../../../data/golfers';
import { sessions } from '../../../data/sessions';
import { trackmanShots } from '../../../data/trackmanData';

// ─── helpers ──────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function qualityColor(q: TrackmanShot['quality']) {
  if (q === 'good') return { bg: 'bg-accent/10', text: 'text-accent' };
  if (q === 'acceptable') return { bg: 'bg-warm-amber/10', text: 'text-warm-amber' };
  return { bg: 'bg-coral/10', text: 'text-coral' };
}

function sign(n: number) {
  if (n > 0) return '+';
  if (n < 0) return '';
  return '';
}

// ─── component ────────────────────────────────────────────
export default function SessionCapture() {
  // data
  const session = sessions.find((s) => s.id === 'session-6')!;
  const previousSession = sessions.find((s) => s.id === 'session-5')!;
  const golfer = golfers.find((g) => g.id === session.golferId)!;
  const sessionShots = trackmanShots.filter((s) => s.sessionId === 'session-6').slice(0, 5);

  // state
  const [selectedShotIndex, setSelectedShotIndex] = useState(0);
  const [isRecording] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isPreviousSessionExpanded, setIsPreviousSessionExpanded] = useState(false);
  const [usedCues, setUsedCues] = useState<Set<number>>(new Set());

  // timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedShot = sessionShots[selectedShotIndex];

  // compute session-level averages for delta indicators
  const averages = useMemo(() => {
    const avg = (fn: (s: TrackmanShot) => number) => {
      const sum = sessionShots.reduce((a, s) => a + fn(s), 0);
      return sum / sessionShots.length;
    };
    return {
      clubSpeed: avg((s) => s.clubSpeed),
      ballSpeed: avg((s) => s.ballSpeed),
      smashFactor: avg((s) => s.smashFactor),
      launchAngle: avg((s) => s.launchAngle),
      spinRate: avg((s) => s.spinRate),
      carry: avg((s) => s.carry),
      total: avg((s) => s.total),
      attackAngle: avg((s) => s.attackAngle),
      clubPath: avg((s) => s.clubPath),
      faceAngle: avg((s) => s.faceAngle),
    };
  }, [sessionShots]);

  // transcript data
  const transcript = [
    { time: '00:15', speaker: 'Coach' as const, text: "Let's start with a few warm-up 7-irons through the gate." },
    { time: '01:30', speaker: 'Coach' as const, text: 'Good contact. Notice how the ball started right of target and drew back?' },
    { time: '02:45', speaker: 'Golfer' as const, text: 'Yeah, I felt like my weight really moved forward on that one.' },
    { time: '03:20', speaker: 'Coach' as const, text: "That's exactly it. The weight shift is what's creating the draw." },
    { time: '04:10', speaker: 'Coach' as const, text: "Now let's see the same thing with driver. Tee it up high." },
    { time: '05:00', speaker: 'Golfer' as const, text: 'That felt pure.' },
  ];

  // waveform bars (seeded random heights)
  const waveformBars = useMemo(() => {
    const bars: number[] = [];
    // deterministic pseudo-random
    let seed = 42;
    for (let i = 0; i < 48; i++) {
      seed = (seed * 16807 + 7) % 2147483647;
      bars.push(8 + (seed % 40));
    }
    return bars;
  }, []);

  // Ball-flight SVG calculations based on selected shot
  const svgWidth = 600;
  const svgHeight = 200;
  const groundY = svgHeight - 30;
  const originX = 50;
  // Normalise carry to a 0..1 range (250 yds = full width)
  const carryNorm = Math.min(selectedShot.carry / 260, 1);
  const landX = originX + (svgWidth - 80) * carryNorm;
  // Apex height based on launch angle (steeper = higher arc)
  const apexY = groundY - 40 - Math.min(selectedShot.launchAngle * 6, 110);
  // Control point for the quadratic bezier
  const cpX = originX + (landX - originX) * 0.45;
  const cpY = apexY - 15;
  // Launch angle line endpoint
  const launchRad = (selectedShot.launchAngle * Math.PI) / 180;
  const launchLineLen = 80;
  const launchEndX = originX + Math.cos(launchRad) * launchLineLen;
  const launchEndY = groundY - Math.sin(launchRad) * launchLineLen;

  // data tiles definition
  const dataTiles: {
    label: string;
    value: string;
    unit: string;
    delta: number;
  }[] = [
    { label: 'Club Speed', value: selectedShot.clubSpeed.toFixed(1), unit: 'mph', delta: selectedShot.clubSpeed - averages.clubSpeed },
    { label: 'Ball Speed', value: selectedShot.ballSpeed.toFixed(1), unit: 'mph', delta: selectedShot.ballSpeed - averages.ballSpeed },
    { label: 'Smash Factor', value: selectedShot.smashFactor.toFixed(2), unit: '', delta: selectedShot.smashFactor - averages.smashFactor },
    { label: 'Launch Angle', value: selectedShot.launchAngle.toFixed(1), unit: '\u00b0', delta: selectedShot.launchAngle - averages.launchAngle },
    { label: 'Spin Rate', value: selectedShot.spinRate.toLocaleString(), unit: 'rpm', delta: selectedShot.spinRate - averages.spinRate },
    { label: 'Carry', value: selectedShot.carry.toString(), unit: 'yds', delta: selectedShot.carry - averages.carry },
    { label: 'Total', value: selectedShot.total.toString(), unit: 'yds', delta: selectedShot.total - averages.total },
    { label: 'Attack Angle', value: `${sign(selectedShot.attackAngle)}${selectedShot.attackAngle.toFixed(1)}`, unit: '\u00b0', delta: selectedShot.attackAngle - averages.attackAngle },
    { label: 'Club Path', value: `${sign(selectedShot.clubPath)}${selectedShot.clubPath.toFixed(1)}`, unit: '\u00b0', delta: selectedShot.clubPath - averages.clubPath },
    { label: 'Face Angle', value: `${sign(selectedShot.faceAngle)}${selectedShot.faceAngle.toFixed(1)}`, unit: '\u00b0', delta: selectedShot.faceAngle - averages.faceAngle },
    { label: 'Shot Shape', value: selectedShot.shotShape.charAt(0).toUpperCase() + selectedShot.shotShape.slice(1), unit: '', delta: 0 },
    { label: 'Quality', value: selectedShot.quality.charAt(0).toUpperCase() + selectedShot.quality.slice(1), unit: '', delta: 0 },
  ];

  const toggleCue = (idx: number) => {
    setUsedCues((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Distance markers along the ground
  const distanceMarkers = [0, 50, 100, 150, 200, 250];

  return (
    <div className="-m-6 flex flex-col h-[calc(100vh-49px)] overflow-hidden">
      {/* ── TOP BANNER ─────────────────────────────────────────── */}
      <div className="bg-navy text-white py-3 px-6 flex items-center justify-between flex-shrink-0">
        {/* left */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
            {golfer.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <span className="text-sm font-semibold">{golfer.name}</span>
            <span className="ml-2 text-[10px] font-medium uppercase tracking-wider bg-white/10 rounded px-2 py-0.5">
              {session.type.replace('-', ' ')}
            </span>
          </div>
        </div>
        {/* center */}
        <div className="font-serif text-base font-semibold tracking-wide">{session.focus}</div>
        {/* right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-mono">
            <Timer className="w-4 h-4 text-gray-300" />
            {formatTime(elapsedSeconds)}
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase">Live</span>
          </div>
          {isRecording && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
              </span>
              <span className="text-[10px] text-gray-300 uppercase tracking-wider">Recording</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 3-COLUMN BODY ──────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ─ LEFT COLUMN ───────────────────────────────────────── */}
        <div className="w-[280px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-y-auto">
          {/* Shot History */}
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" />
              Shot History
            </h3>
            <div className="space-y-1.5">
              {sessionShots.map((shot, idx) => {
                const qc = qualityColor(shot.quality);
                const isSelected = idx === selectedShotIndex;
                return (
                  <button
                    key={shot.id}
                    onClick={() => setSelectedShotIndex(idx)}
                    className={`w-full text-left rounded-lg p-2.5 transition-colors ${
                      isSelected
                        ? 'bg-accent/5 border-l-2 border-accent'
                        : 'hover:bg-gray-50 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">#{shot.shotNumber}</span>
                        <span className="text-xs font-medium text-navy">{shot.club}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${qc.bg} ${qc.text}`}>
                        {shot.quality}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-mono font-bold text-navy">{shot.carry}</span>
                      <span className="text-[10px] text-gray-400 mb-0.5">yds carry</span>
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-gray-400 font-mono">
                      <span>{shot.clubSpeed} mph</span>
                      <span>{sign(shot.clubPath)}{shot.clubPath.toFixed(1)}&deg; path</span>
                      <span>{sign(shot.faceAngle)}{shot.faceAngle.toFixed(1)}&deg; face</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-4" />

          {/* Previous Session Context */}
          <div className="px-4 py-3">
            <button
              onClick={() => setIsPreviousSessionExpanded((p) => !p)}
              className="w-full flex items-center justify-between text-xs font-bold text-navy uppercase tracking-wider hover:text-accent transition-colors"
            >
              <span>Previous Session</span>
              {isPreviousSessionExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {isPreviousSessionExpanded && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-navy">Focus:</span> {previousSession.focus}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-navy">Improvement:</span>{' '}
                  <span className="font-mono font-bold text-accent">{previousSession.improvementScore}%</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400 mt-2 mb-1">Top Faults</div>
                {previousSession.faults.slice(0, 2).map((fault, i) => (
                  <div key={i} className="flex gap-2 text-xs text-gray-600">
                    <Circle className="w-2.5 h-2.5 text-coral mt-0.5 flex-shrink-0" />
                    <span>{fault}</span>
                  </div>
                ))}
                <div className="text-[10px] uppercase font-bold text-gray-400 mt-2 mb-1">What to Watch For</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Old fade pattern may return under fatigue. Use step drill feel as reset when needed. Trust the new swing.
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-4" />

          {/* Coaching Cues Bank */}
          <div className="px-4 py-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" />
              Coaching Cues
            </h3>
            <div className="flex flex-wrap gap-2">
              {session.coachingCues.map((cue, idx) => {
                const isUsed = usedCues.has(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCue(idx)}
                    className={`text-[11px] leading-tight px-2.5 py-1.5 rounded-full border transition-all ${
                      isUsed
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {isUsed && <CheckCircle2 className="w-3 h-3 inline mr-1 -mt-0.5" />}
                    {cue.length > 60 ? cue.slice(0, 57) + '...' : cue}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─ CENTER COLUMN ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-bg-dark">
          {/* Ball Flight Visualization */}
          <div className="p-4">
            <div className="bg-bg-dark rounded-xl border border-border-dark overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full"
                style={{ maxHeight: 220 }}
              >
                {/* Ground line */}
                <line x1="30" y1={groundY} x2={svgWidth - 20} y2={groundY} stroke="#2A3A55" strokeWidth="1" />

                {/* Distance markers */}
                {distanceMarkers.map((d) => {
                  const x = originX + ((svgWidth - 80) * d) / 260;
                  return (
                    <g key={d}>
                      <line x1={x} y1={groundY} x2={x} y2={groundY + 6} stroke="#2A3A55" strokeWidth="1" />
                      <text x={x} y={groundY + 18} fill="#6B7280" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">
                        {d}
                      </text>
                    </g>
                  );
                })}

                {/* Launch angle dashed line */}
                <line
                  x1={originX}
                  y1={groundY}
                  x2={launchEndX}
                  y2={launchEndY}
                  stroke="#4A90D9"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />
                <text x={launchEndX + 4} y={launchEndY - 2} fill="#4A90D9" fontSize="8" fontFamily="var(--font-mono)">
                  {selectedShot.launchAngle}&deg;
                </text>

                {/* Ball flight arc */}
                <path
                  d={`M ${originX} ${groundY} Q ${cpX} ${cpY}, ${landX} ${groundY}`}
                  fill="none"
                  stroke="#2E8B57"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                  style={{
                    strokeDasharray: 500,
                    strokeDashoffset: 0,
                    transition: 'd 0.5s ease',
                  }}
                />

                {/* Origin dot */}
                <circle cx={originX} cy={groundY} r="3" fill="#2E8B57" />

                {/* Landing zone marker */}
                <circle cx={landX} cy={groundY} r="4" fill="none" stroke="#D4A843" strokeWidth="1.5" />
                <circle cx={landX} cy={groundY} r="1.5" fill="#D4A843" />
                <text x={landX} y={groundY - 10} fill="#D4A843" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight="bold">
                  {selectedShot.carry} yds
                </text>
              </svg>

              {/* Shot shape badge */}
              <div className="flex items-center justify-center pb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${qualityColor(selectedShot.quality).bg} ${qualityColor(selectedShot.quality).text}`}>
                  {selectedShot.shotShape.charAt(0).toUpperCase() + selectedShot.shotShape.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Data Tile Grid */}
          <div className="px-4 pb-4 flex-1">
            <div className="grid grid-cols-4 gap-2">
              {dataTiles.map((tile) => {
                const absDelta = Math.abs(tile.delta);
                const isQualitative = tile.label === 'Shot Shape' || tile.label === 'Quality';
                const isQuality = tile.label === 'Quality';
                const qc = isQuality ? qualityColor(selectedShot.quality) : null;
                return (
                  <div
                    key={tile.label}
                    className="bg-card-dark border border-border-dark rounded-lg p-3 flex flex-col"
                  >
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{tile.label}</span>
                    <div className="flex items-end gap-1.5">
                      <span className={`text-lg font-mono font-bold ${isQuality && qc ? qc.text : 'text-white'}`}>
                        {tile.value}
                      </span>
                      {tile.unit && <span className="text-[10px] text-gray-500 mb-0.5">{tile.unit}</span>}
                    </div>
                    {!isQualitative && (
                      <div className="mt-1 flex items-center gap-1 text-[10px]">
                        {tile.delta > 0.01 ? (
                          <>
                            <span className="text-accent">&uarr;</span>
                            <span className="text-accent">+{absDelta < 10 ? absDelta.toFixed(1) : Math.round(absDelta)}</span>
                          </>
                        ) : tile.delta < -0.01 ? (
                          <>
                            <span className="text-coral">&darr;</span>
                            <span className="text-coral">-{absDelta < 10 ? absDelta.toFixed(1) : Math.round(absDelta)}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">avg</span>
                        )}
                        <span className="text-gray-600">vs avg</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─ RIGHT COLUMN ──────────────────────────────────────── */}
        <div className="w-[320px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
          {/* Audio Capture Section */}
          <div className="px-4 pt-4 pb-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mic className="w-3.5 h-3.5" />
              Audio Capture
            </h3>
            {/* Mic status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isMicOn && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {isMicOn ? `Recording: ${formatTime(elapsedSeconds)}` : 'Paused'}
                </span>
              </div>
              <button
                onClick={() => setIsMicOn((p) => !p)}
                className={`p-2 rounded-lg transition-colors ${
                  isMicOn
                    ? 'bg-accent/10 text-accent hover:bg-accent/20'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
            {/* Waveform */}
            <div className="flex items-center gap-[2px] h-12 bg-gray-50 rounded-lg px-2 overflow-hidden">
              {waveformBars.map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full flex-shrink-0"
                  style={{
                    height: isMicOn ? `${h}%` : '12%',
                    backgroundColor: isMicOn ? '#2E8B57' : '#D1D5DB',
                    transition: 'height 0.3s ease',
                    animation: isMicOn ? `waveform 0.8s ease-in-out ${(i * 0.06).toFixed(2)}s infinite alternate` : 'none',
                  }}
                />
              ))}
            </div>
            <style>{`
              @keyframes waveform {
                0% { transform: scaleY(1); }
                100% { transform: scaleY(0.3); }
              }
            `}</style>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-4" />

          {/* Live Transcription */}
          <div className="px-4 py-3 flex-1 min-h-0 overflow-y-auto">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">Live Transcription</h3>
            <div className="space-y-3">
              {transcript.map((entry, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[10px] font-mono text-gray-400 mt-0.5 flex-shrink-0 w-9">{entry.time}</span>
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        entry.speaker === 'Coach' ? 'text-accent' : 'text-data-blue'
                      }`}
                    >
                      {entry.speaker}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed mt-0.5">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-4" />

          {/* Coach Notes */}
          <div className="px-4 py-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">Coach Notes</h3>
            <textarea
              className="w-full h-24 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent leading-relaxed"
              defaultValue="Iron contact is crisp today. Weight transfer automatic on irons — doesn't even think about it anymore. Moving to driver work."
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────────────── */}
      <div className="bg-white border-t border-gray-200 py-3 px-6 flex items-center gap-3 flex-shrink-0">
        <button className="flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-coral/90 transition-colors">
          <Square className="w-4 h-4" />
          End Session
        </button>
        <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors">
          <Plus className="w-4 h-4" />
          Save Shot
        </button>
        <button className="flex items-center gap-2 border border-navy text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy/5 transition-colors">
          <MessageCircle className="w-4 h-4" />
          Add Cue
        </button>
        <button className="flex items-center gap-2 border border-navy text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy/5 transition-colors">
          <BarChart3 className="w-4 h-4" />
          View Stats
        </button>
      </div>
    </div>
  );
}
