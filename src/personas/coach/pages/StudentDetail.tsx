import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Pencil,
  CheckCircle,
  Circle,
  X,
  Check,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PLAYER = {
  name: 'Moe Norman',
  handicap: 12.1,
  handicapPrev: 14.2,
  sessions: 14,
  coach: 'M. Thompson',
  coachYears: 2,
  goal: 'Break 80',
  dataSources: ['Arccos', 'GHIN', 'TrackMan'],
};

const HANDICAP_TREND = [
  { month: 'Sep 24', handicap: 14.2 },
  { month: 'Oct 24', handicap: 14.1 },
  { month: 'Nov 24', handicap: 14.0 },
  { month: 'Dec 24', handicap: 13.8 },
  { month: 'Jan 25', handicap: 13.6 },
  { month: 'Feb 25', handicap: 13.4 },
  { month: 'Mar 25', handicap: 13.1 },
  { month: 'Apr 25', handicap: 13.0 },
  { month: 'May 25', handicap: 12.9 },
  { month: 'Jun 25', handicap: 12.8 },
  { month: 'Jul 25', handicap: 12.7 },
  { month: 'Aug 25', handicap: 12.6 },
  { month: 'Sep 25', handicap: 12.5 },
  { month: 'Oct 25', handicap: 12.4 },
  { month: 'Nov 25', handicap: 12.4 },
  { month: 'Dec 25', handicap: 12.3 },
  { month: 'Jan 26', handicap: 12.2 },
  { month: 'Feb 26', handicap: 12.1 },
  { month: 'Mar 26', handicap: 12.1 },
];

const STROKES_GAINED = [
  { category: 'Driver', value: -2.3, trend: 'down' as const, context: 'vs. 12-HCP avg' },
  { category: 'Approach', value: 0.2, trend: 'up' as const, context: '\u2191 0.4 since Session 11' },
  { category: 'Short Game', value: -0.1, trend: 'flat' as const, context: 'vs. 12-HCP avg' },
  { category: 'Putting', value: 0.3, trend: 'up' as const, context: 'vs. 12-HCP avg' },
];

interface CoachingArc {
  id: string;
  name: string;
  label: string;
  sessions: number[];
  startMonth: number;
  endMonth: number;
  color: string;
  borderColor: string;
  bgOpacity: string;
  impact: string;
}

const COACHING_ARCS: CoachingArc[] = [
  {
    id: 'short-game',
    name: 'Short Game',
    label: 'Wedge distance control',
    sessions: [1, 2, 3, 4, 5],
    startMonth: 0,
    endMonth: 4,
    color: '#D4980B',
    borderColor: '#D4980B',
    bgOpacity: 'rgba(212, 152, 11, 0.12)',
    impact: 'SG Short Game: -0.8 \u2192 -0.1',
  },
  {
    id: 'ball-position',
    name: 'Ball Position',
    label: 'Address fundamentals',
    sessions: [6, 7, 8, 9, 10],
    startMonth: 6,
    endMonth: 10,
    color: '#6B7280',
    borderColor: '#6B7280',
    bgOpacity: 'rgba(107, 114, 128, 0.10)',
    impact: 'Approach SG stabilized at 0.0',
  },
  {
    id: 'iron-strike',
    name: 'Iron Strike',
    label: 'Centering & toe bias correction',
    sessions: [11, 12, 13, 14],
    startMonth: 15,
    endMonth: 18,
    color: '#0D7C66',
    borderColor: '#0D7C66',
    bgOpacity: 'rgba(13, 124, 102, 0.15)',
    impact: 'Approach SG improved +0.4',
  },
];

interface SessionMock {
  number: number;
  date: string;
  arcId: string;
  focus: string;
  phases: [boolean, boolean, boolean, boolean];
  summary: string;
  evidence: string;
}

const SESSIONS_DATA: SessionMock[] = [
  { number: 1, date: 'Sep 15, 2024', arcId: 'short-game', focus: 'Wedge distance control — 50-80 yard window', phases: [true, true, true, true], summary: 'Established baseline wedge distances. 60-yard carry window varied by 18 yards. Prescribed partial-swing distance ladder.', evidence: '60-yd carry spread: 18 yds (baseline)' },
  { number: 2, date: 'Oct 3, 2024', arcId: 'short-game', focus: 'Wedge distance control — tempo focus', phases: [true, true, true, true], summary: 'Introduced 3:1 tempo ratio for partial wedges. Carry window tightened to 14 yards.', evidence: '60-yd carry spread: 14 yds (\u22124 from S1)' },
  { number: 3, date: 'Oct 28, 2024', arcId: 'short-game', focus: 'Wedge loft and spin management', phases: [true, true, true, true], summary: 'Shifted focus to dynamic loft control. Spin rate consistency improved significantly.', evidence: 'Spin rate variance: \u221215%' },
  { number: 4, date: 'Nov 20, 2024', arcId: 'short-game', focus: 'Short game scoring integration', phases: [true, true, true, false], summary: 'On-course application session. Up-and-down conversion improved in practice rounds.', evidence: 'Scrambling rate: 42% \u2192 51%' },
  { number: 5, date: 'Dec 12, 2024', arcId: 'short-game', focus: 'Short game arc review', phases: [true, true, true, true], summary: 'Arc completion review. Short game SG improved from -0.8 to -0.1. Wedge distance control now within acceptable range.', evidence: 'SG Short Game: -0.1 (from -0.8)' },
  { number: 6, date: 'Jan 15, 2025', arcId: 'ball-position', focus: 'Address position audit', phases: [true, true, true, true], summary: 'Video analysis revealed inconsistent ball position at address. 1.5" variance across iron set. Began standardization protocol.', evidence: 'Ball position variance: 1.5" across irons' },
  { number: 7, date: 'Feb 5, 2025', arcId: 'ball-position', focus: 'Alignment rod protocol', phases: [true, true, true, true], summary: 'Alignment rod check drill introduced. Ball position standardized within 0.5" for 7-iron.', evidence: 'Ball position variance: 0.5" (7-iron)' },
  { number: 8, date: 'Mar 1, 2025', arcId: 'ball-position', focus: 'Address fundamentals transfer', phases: [true, true, true, true], summary: 'Extended ball position protocol to 5-iron through PW. Stance width adjusted for consistency.', evidence: 'Address consistency: 88% within protocol' },
  { number: 9, date: 'Apr 8, 2025', arcId: 'ball-position', focus: 'Address under pressure', phases: [true, true, true, false], summary: 'Pressure testing address fundamentals. Ball position held under simulated pressure conditions.', evidence: 'Pressure consistency: 82%' },
  { number: 10, date: 'May 12, 2025', arcId: 'ball-position', focus: 'Ball position arc review', phases: [true, true, true, true], summary: 'Arc completion. Approach SG stabilized at 0.0 from -0.3. Address fundamentals now automatic.', evidence: 'SG Approach: 0.0 (from -0.3)' },
  { number: 11, date: 'Jan 8, 2026', arcId: 'iron-strike', focus: 'Strike pattern baseline', phases: [true, true, true, true], summary: 'TrackMan face mapping revealed consistent toe bias on 7-iron and 8-iron. 0.6" average toe-side miss.', evidence: 'Strike center: +0.6" toe (7-iron avg)' },
  { number: 12, date: 'Jan 28, 2026', arcId: 'iron-strike', focus: 'Gate drill introduction', phases: [true, true, true, true], summary: 'Gate drill prescribed for toe bias correction. Alignment rod check continued as maintenance. Initial response positive.', evidence: 'Strike center: +0.4" toe (\u22120.2" from S11)' },
  { number: 13, date: 'Feb 25, 2026', arcId: 'iron-strike', focus: 'Strike centering progression', phases: [true, true, true, true], summary: 'Gate drill showing measurable transfer. Dispersion tightened 18% within session. Face-to-path improving.', evidence: 'Dispersion: \u221218% within session' },
  { number: 14, date: 'Mar 18, 2026', arcId: 'iron-strike', focus: 'Toe bias correction — consolidation', phases: [true, true, true, true], summary: 'Toe bias pattern noticeably more centered by end of session. Gate drill effective. Dispersion tightened 22% within session. Face-to-path narrowed from 4\u00b0 to 2\u00b0 across Sessions 13\u201314.', evidence: 'Strike center: shifted 0.3" toward center vs. Session 12' },
];

const PRACTICE_PLAN = [
  { name: 'Gate Drill \u2014 Strike Centering', completed: 2, total: 3, prescribed: 'Session 13' },
  { name: 'Alignment Rod Check \u2014 Address Consistency', completed: 1, total: 2, prescribed: 'Session 12' },
  { name: 'Tempo Drill \u2014 3:1 Ratio', completed: 0, total: 2, prescribed: 'Session 14' },
];

const COACH_NOTES = [
  { date: 'Mar 18', text: 'Moe responding well to gate drill. Strike pattern noticeably more centered by end of session. Ready to test transfer to 6-iron next session.' },
  { date: 'Mar 4', text: 'Toe bias pattern consistent across 7-iron and 8-iron. Likely related to ball position at address, not swing path. Gate drill should address this directly.' },
  { date: 'Feb 15', text: 'Discussed driver with Moe. He\u2019s aware it\u2019s a weakness but wants to \u201clock in\u201d iron consistency first. Revisit driver plan after Session 15.' },
];

// ─── Session Launch Modal ─────────────────────────────────────────────────────

interface LaunchStage {
  thinking: string;
  resolved: string;
}

const LAUNCH_STAGES: LaunchStage[] = [
  { thinking: 'Loading persistent record...', resolved: '14 sessions captured. Last: Mar 18 \u2014 Iron strike centering' },
  { thinking: 'Checking practice compliance...', resolved: 'Gate drill: 2/3 completed. Alignment check: 1/2 completed.' },
  { thinking: 'Assembling session context...', resolved: 'Suggested focus: Continue iron strike arc or pivot to driver block (SG: \u22122.3 off tee)' },
];

/** Session launch transition overlay — visible AI preparation */
function SessionLaunchModal({ onClose }: { onClose: () => void }): JSX.Element {
  const navigate = useNavigate();
  const [stages, setStages] = useState<('thinking' | 'resolved')[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Stage 1: appear immediately as thinking
    setStages(['thinking']);
    // Stage 1: resolve after 1.5s
    timers.push(setTimeout(() => setStages(['resolved', 'thinking']), 1500));
    // Stage 2: resolve after 3s
    timers.push(setTimeout(() => setStages(['resolved', 'resolved', 'thinking']), 3000));
    // Stage 3: resolve after 4.5s
    timers.push(setTimeout(() => setStages(['resolved', 'resolved', 'resolved']), 4500));
    return () => timers.forEach(clearTimeout);
  }, []);

  const allResolved = stages.length === 3 && stages.every((s) => s === 'resolved');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(12, 17, 23, 0.95)' }}>
      {/* Cancel */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-sm hover:text-[#8B99A8] transition-colors"
        style={{ color: '#5E6E7E', fontFamily: 'DM Sans' }}
      >
        Cancel
      </button>

      <div className="max-w-[480px] w-full px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-lg font-medium mb-1" style={{ color: '#E8ECF1', fontFamily: 'DM Sans' }}>
            Preparing Session 15
          </h2>
          <p className="font-mono text-[13px]" style={{ color: '#5E6E7E' }}>
            Moe Norman &mdash; M. Thompson
          </p>
        </div>

        {/* Stages */}
        <div className="space-y-6">
          {stages.map((status, i) => (
            <div key={i} className="flex items-start gap-3">
              {status === 'thinking' ? (
                <span className="mt-1 block w-[10px] h-[10px] rounded-full shrink-0" style={{ backgroundColor: '#10B981', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
              ) : (
                <Check className="w-[14px] h-[14px] mt-0.5 shrink-0" style={{ color: '#10B981' }} />
              )}
              <span className="font-mono text-xs leading-relaxed" style={{ color: status === 'thinking' ? '#5E6E7E' : '#8B99A8' }}>
                {status === 'thinking' ? LAUNCH_STAGES[i].thinking : LAUNCH_STAGES[i].resolved}
              </span>
            </div>
          ))}
        </div>

        {/* Launch button */}
        {allResolved && (
          <div className="mt-10 text-center animate-fade-in">
            <button
              onClick={() => navigate('/trackman')}
              className="px-6 py-3 rounded-[6px] text-sm font-medium transition-colors hover:brightness-110"
              style={{ backgroundColor: '#10B981', color: '#0C1117', fontFamily: 'DM Sans' }}
            >
              Launch Session
            </button>
            <p className="font-mono text-[10px] mt-3" style={{ color: '#5E6E7E' }}>
              TrackMan Performance Studio will open alongside Looper
            </p>
          </div>
        )}
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Coaching Journey Timeline ────────────────────────────────────────────────

function CoachingTimeline(): JSX.Element {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const session = selectedSession !== null ? SESSIONS_DATA.find((s) => s.number === selectedSession) : null;

  // Timeline spans 19 months (index 0–18)
  const totalMonths = 19;
  const monthLabels = ['Sep 24', '', 'Nov 24', '', 'Jan 25', '', 'Mar 25', '', 'May 25', '', 'Jul 25', '', 'Sep 25', '', 'Nov 25', '', 'Jan 26', '', 'Mar 26'];

  const getX = (monthIdx: number): string => `${(monthIdx / (totalMonths - 1)) * 100}%`;

  return (
    <div className="bg-white rounded-lg border border-[#DFE2E7] p-4">
      <h2 className="text-base font-medium mb-6" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
        Coaching Journey
      </h2>

      <div className="relative overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Arc bars */}
          <div className="relative h-14 mb-1">
            {COACHING_ARCS.map((arc) => {
              const left = (arc.startMonth / (totalMonths - 1)) * 100;
              const width = ((arc.endMonth - arc.startMonth) / (totalMonths - 1)) * 100;
              return (
                <div key={arc.id} className="absolute top-2" style={{ left: `${left}%`, width: `${width}%` }}>
                  {/* Arc bar */}
                  <div
                    className="h-[10px] rounded"
                    style={{ backgroundColor: arc.bgOpacity, borderLeft: `3px solid ${arc.borderColor}` }}
                  >
                    {/* Session dots */}
                    <div className="relative h-full">
                      {arc.sessions.map((sNum) => {
                        const sessionData = SESSIONS_DATA.find((s) => s.number === sNum);
                        if (!sessionData) return null;
                        // Map session within its arc
                        const arcSpan = arc.endMonth - arc.startMonth;
                        const sessionIdx = arc.sessions.indexOf(sNum);
                        const sessionPos = arcSpan > 0 ? (sessionIdx / (arc.sessions.length - 1 || 1)) * 100 : 50;
                        const isSelected = selectedSession === sNum;
                        return (
                          <button
                            key={sNum}
                            onClick={() => setSelectedSession(isSelected ? null : sNum)}
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all"
                            style={{
                              left: `${Math.max(4, Math.min(96, sessionPos))}%`,
                              width: isSelected ? '12px' : '7px',
                              height: isSelected ? '12px' : '7px',
                              backgroundColor: isSelected ? arc.color : arc.color,
                              border: isSelected ? `2px solid ${arc.color}` : 'none',
                              boxShadow: isSelected ? `0 0 0 3px ${arc.bgOpacity}` : 'none',
                            }}
                            title={`Session ${sNum}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  {/* Arc label */}
                  <div className="mt-2">
                    <p className="text-[11px] font-medium truncate" style={{ color: arc.color, fontFamily: 'DM Sans' }}>
                      {arc.name} &mdash; {arc.label}
                    </p>
                    <p className="font-mono text-[10px] truncate" style={{ color: '#9CA3AF' }}>
                      {arc.impact}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month axis */}
          <div className="flex justify-between mt-8 px-0">
            {monthLabels.map((label, i) => (
              <span key={i} className="font-mono text-[10px]" style={{ color: '#9CA3AF', width: `${100 / totalMonths}%`, textAlign: 'center' }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selected session detail panel */}
      {session && (
        <div
          className="mt-4 border border-[#DFE2E7] rounded-lg p-4 transition-all duration-200 ease-out"
          style={{ backgroundColor: '#F6F7F9' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
                Session {session.number} &mdash; {session.date}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
                {session.focus}
              </p>
            </div>
            <button onClick={() => setSelectedSession(null)} className="p-1 hover:bg-white rounded transition-colors">
              <X className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </button>
          </div>

          {/* Phase dots */}
          <div className="flex items-center gap-2 mb-3">
            {['Catch-up', 'Diagnosis', 'Intervention', 'Review'].map((phase, i) => (
              <div key={phase} className="flex items-center gap-1">
                <span
                  className="block w-[6px] h-[6px] rounded-full"
                  style={{ backgroundColor: session.phases[i] ? '#0FA87A' : '#DFE2E7' }}
                />
                <span className="font-mono text-[10px]" style={{ color: session.phases[i] ? '#4B5563' : '#9CA3AF' }}>
                  {phase}
                </span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <p className="text-[13px] leading-relaxed mb-2" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
            {session.summary}
          </p>

          {/* Evidence */}
          <p className="font-mono text-[11px]" style={{ color: '#9CA3AF' }}>
            {session.evidence}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/** Player longitudinal profile — the coach's view of an ongoing coaching relationship */
export default function StudentDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        if (showLaunchModal) {
          setShowLaunchModal(false);
        } else {
          navigate('/coach/students');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showLaunchModal]);

  // Handicap chart arc bands — map arc months to chart index
  const arcBands = COACHING_ARCS.map((arc) => {
    // Map timeline months to chart data indices
    const chartMonths = HANDICAP_TREND.map((d) => d.month);
    // Find closest chart indices for arc start/end
    const monthToIndex = (m: number): number => {
      // Arc months 0-18 map to chart months Sep 24 - Mar 26
      return Math.round((m / 18) * (chartMonths.length - 1));
    };
    return {
      ...arc,
      chartStart: monthToIndex(arc.startMonth),
      chartEnd: monthToIndex(arc.endMonth),
    };
  });

  return (
    <div className="pb-8 space-y-6 max-w-[1200px]">
      {/* Back link */}
      <Link to="/coach/students" className="inline-flex items-center gap-1.5 text-sm hover:text-[#1A1F2B] transition-colors" style={{ color: '#9CA3AF', fontFamily: 'DM Sans' }}>
        <ArrowLeft className="w-4 h-4" />
        Students
      </Link>

      {/* ─── Section 1: Player Header ─────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#DFE2E7] p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Name + details */}
          <div className="flex items-center gap-6 flex-wrap">
            {/* Name */}
            <h1 className="text-2xl font-medium" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
              {PLAYER.name}
            </h1>

            {/* Handicap */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xl font-bold" style={{ color: '#1A1F2B' }}>
                {PLAYER.handicap}
              </span>
              <TrendingDown className="w-3.5 h-3.5" style={{ color: '#0FA87A' }} />
              <span className="font-mono text-xs" style={{ color: '#9CA3AF' }}>
                from {PLAYER.handicapPrev}
              </span>
            </div>

            {/* Sessions */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>Sessions:</span>
              <span className="font-mono text-sm font-medium" style={{ color: '#1A1F2B' }}>{PLAYER.sessions}</span>
            </div>

            {/* Coach */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>Coach:</span>
              <span className="text-sm" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>{PLAYER.coach} &mdash; {PLAYER.coachYears} years</span>
            </div>

            {/* Goal */}
            <span className="text-sm italic" style={{ color: '#4B5563', fontFamily: 'Playfair Display' }}>
              &ldquo;{PLAYER.goal}&rdquo;
            </span>

            {/* Data sources */}
            <div className="flex items-center gap-1.5">
              {PLAYER.dataSources.map((src) => (
                <span
                  key={src}
                  className="font-mono text-[10px] px-2 py-0.5 rounded border"
                  style={{ color: '#4B5563', borderColor: '#DFE2E7' }}
                >
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Start Lesson */}
          <div className="text-right shrink-0">
            <button
              onClick={() => setShowLaunchModal(true)}
              className="px-4 py-2 rounded-[6px] text-sm font-medium text-white transition-colors hover:brightness-110"
              style={{ backgroundColor: '#0D7C66', fontFamily: 'DM Sans' }}
            >
              Start Lesson
            </button>
            <p className="font-mono text-[10px] mt-1" style={{ color: '#9CA3AF' }}>
              Session 15
            </p>
          </div>
        </div>
      </div>

      {/* ─── Section 2: AI Insight Card ───────────────────────────────── */}
      <div
        className="bg-white rounded-lg border border-[#DFE2E7] p-4"
        style={{ borderLeft: '4px solid #0D7C66', backgroundColor: 'rgba(13, 124, 102, 0.04)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" style={{ color: '#0D7C66' }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#0D7C66', fontFamily: 'DM Sans' }}>
              Looper Insight
            </span>
          </div>
          <span
            className="font-mono text-[11px] px-2.5 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(15, 168, 122, 0.12)', color: '#0FA87A' }}
          >
            78% confidence
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
          Moe&apos;s Arccos data shows he&apos;s losing 2.3 strokes per round off the tee &mdash; his largest opportunity area. Recent coaching (Sessions 11&ndash;14) has focused on iron strike centering, which has been effective: approach strokes gained improved +0.4 over this period. However, driver work requires distinct biomechanical patterns &mdash; longer downswing acceleration windows and different pelvic-torso separation timing &mdash; that won&apos;t transfer from iron-focused drills. Consider opening a driver block in the next 2&ndash;3 sessions.
        </p>
      </div>

      {/* ─── Section 3: On-Course Performance ─────────────────────────── */}

      {/* Part A: Handicap Trend */}
      <div className="bg-white rounded-lg border border-[#DFE2E7] p-4">
        <h2 className="text-base font-medium mb-4" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
          Handicap Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={HANDICAP_TREND} margin={{ top: 8, right: 12, bottom: 24, left: 8 }}>
            {/* Arc background bands */}
            {arcBands.map((arc) => (
              <ReferenceArea
                key={arc.id}
                x1={HANDICAP_TREND[arc.chartStart]?.month}
                x2={HANDICAP_TREND[arc.chartEnd]?.month}
                fill={arc.color}
                fillOpacity={0.06}
                strokeOpacity={0}
              />
            ))}

            {/* Session marker lines (subtle) */}
            {SESSIONS_DATA.filter((_, i) => i % 3 === 0).map((s) => {
              // Approximate session month on chart
              const arcData = COACHING_ARCS.find((a) => a.id === s.arcId);
              if (!arcData) return null;
              const sessionIdx = arcData.sessions.indexOf(s.number);
              const arcSpan = arcData.endMonth - arcData.startMonth;
              const monthIdx = arcData.startMonth + (arcSpan * sessionIdx / (arcData.sessions.length - 1 || 1));
              const chartIdx = Math.round((monthIdx / 18) * (HANDICAP_TREND.length - 1));
              const month = HANDICAP_TREND[chartIdx]?.month;
              return month ? (
                <ReferenceLine
                  key={s.number}
                  x={month}
                  stroke="#0D7C66"
                  strokeOpacity={0.25}
                  strokeDasharray="2 4"
                />
              ) : null;
            })}

            <defs>
              <linearGradient id="handicapGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D7C66" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#0D7C66" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'Space Mono' }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              domain={[11.5, 14.8]}
              reversed
              tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'Space Mono' }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Area
              type="monotone"
              dataKey="handicap"
              fill="url(#handicapGrad)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="handicap"
              stroke="#0D7C66"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#0D7C66', stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Arc legend below chart */}
        <div className="flex items-center gap-6 mt-2 pl-10">
          {COACHING_ARCS.map((arc) => (
            <div key={arc.id} className="flex items-center gap-1.5">
              <span className="block w-3 h-2 rounded-sm" style={{ backgroundColor: arc.color, opacity: 0.5 }} />
              <span className="font-mono text-[10px]" style={{ color: '#9CA3AF' }}>{arc.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Part B: Strokes Gained Breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {STROKES_GAINED.map((sg) => {
          const isNegative = sg.value < 0;
          const isPositive = sg.value > 0;
          const isNeutral = !isNegative && !isPositive;
          const valueColor = isNegative ? '#C93B3B' : isPositive ? '#0FA87A' : '#4B5563';
          return (
            <div
              key={sg.category}
              className="bg-white rounded-lg border p-4"
              style={{ borderColor: isNegative && sg.value <= -1 ? '#C93B3B30' : '#DFE2E7' }}
            >
              <p className="text-[13px] font-medium mb-2" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
                {sg.category}
              </p>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-mono text-[22px] font-bold" style={{ color: valueColor }}>
                  {sg.value > 0 ? '+' : ''}{sg.value.toFixed(1)}
                </span>
                {sg.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" style={{ color: '#0FA87A' }} />}
                {sg.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" style={{ color: '#C93B3B' }} />}
              </div>
              <p className="font-mono text-[11px]" style={{ color: '#9CA3AF' }}>
                {sg.context}
              </p>
            </div>
          );
        })}
      </div>

      {/* ─── Section 4: Coaching Journey Timeline ─────────────────────── */}
      <CoachingTimeline />

      {/* ─── Section 5: Active Practice Plan ──────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#DFE2E7] p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
            Active Practice Plan
          </h2>
          <span className="font-mono text-[10px]" style={{ color: '#9CA3AF' }}>Updated Mar 18</span>
        </div>

        <div className="space-y-4">
          {PRACTICE_PLAN.map((drill, i) => (
            <div key={i} className="flex items-start gap-3">
              {/* Completion indicators */}
              <div className="flex items-center gap-1 mt-0.5 shrink-0">
                {Array.from({ length: drill.total }).map((_, j) => (
                  j < drill.completed
                    ? <CheckCircle key={j} className="w-4 h-4" style={{ color: '#0FA87A' }} />
                    : <Circle key={j} className="w-4 h-4" style={{ color: '#DFE2E7' }} />
                ))}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
                  {drill.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[11px]" style={{ color: '#9CA3AF' }}>
                    {drill.completed} of {drill.total} practice sessions
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: '#9CA3AF' }}>
                    Prescribed: {drill.prescribed}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: '#F0F2F5' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(drill.completed / drill.total) * 100}%`,
                      backgroundColor: '#0FA87A',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section 6: Coach Notes ───────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#DFE2E7] p-4">
        <h2 className="text-base font-medium mb-4" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
          Coach Notes
        </h2>

        <div className="space-y-4">
          {COACH_NOTES.map((note, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <span className="font-mono text-[11px] mt-0.5 shrink-0 w-[52px]" style={{ color: '#9CA3AF' }}>
                {note.date}
              </span>
              <p className="flex-1 text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
                {note.text}
              </p>
              <Pencil className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9CA3AF' }} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section 7: Session Launch Modal ──────────────────────────── */}
      {showLaunchModal && <SessionLaunchModal onClose={() => setShowLaunchModal(false)} />}
    </div>
  );
}
