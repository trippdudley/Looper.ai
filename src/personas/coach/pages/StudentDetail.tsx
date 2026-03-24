import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Pencil,
  X,
} from 'lucide-react';
// recharts removed — handicap ribbon replaced by HCP row in heatmap grid

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PLAYER = {
  name: 'Moe Norman',
  handicap: 12.1,
  handicapPrev: 13.8,
  sessions: 8,
  coach: 'M. Thompson',
  coachYears: 1,
  goal: 'Break 80',
  dataSources: ['Arccos', 'GHIN', 'TrackMan'],
};

/** Individual round data — from Arccos / GHIN */
interface RoundData {
  date: string;
  course: string;
  score: number;
  differential: number;
  rollingHcp: number;
  /** Month index 0-12 (Mar 25 = 0, Mar 26 = 12) */
  monthIdx: number;
  /** Fractional position within the month (0-1) for precise date placement */
  monthFrac: number;
}

const ROUNDS_DATA: RoundData[] = [
  { date: 'Mar 15, 2025', course: 'Pine Valley', score: 86, differential: 13.9, rollingHcp: 13.8, monthIdx: 0, monthFrac: 0.45 },
  { date: 'Mar 22, 2025', course: 'Evergreen GC', score: 84, differential: 12.8, rollingHcp: 13.6, monthIdx: 0, monthFrac: 0.68 },
  { date: 'Apr 5, 2025', course: 'Pine Valley', score: 87, differential: 14.2, rollingHcp: 13.5, monthIdx: 1, monthFrac: 0.13 },
  { date: 'Apr 19, 2025', course: 'Evergreen GC', score: 85, differential: 13.5, rollingHcp: 13.4, monthIdx: 1, monthFrac: 0.6 },
  { date: 'May 3, 2025', course: 'Chambers Bay', score: 88, differential: 14.1, rollingHcp: 13.3, monthIdx: 2, monthFrac: 0.06 },
  { date: 'May 24, 2025', course: 'Evergreen GC', score: 83, differential: 12.4, rollingHcp: 13.1, monthIdx: 2, monthFrac: 0.74 },
  { date: 'Jun 7, 2025', course: 'Pine Valley', score: 85, differential: 13.1, rollingHcp: 13.0, monthIdx: 3, monthFrac: 0.2 },
  { date: 'Jun 21, 2025', course: 'Evergreen GC', score: 84, differential: 12.7, rollingHcp: 12.9, monthIdx: 3, monthFrac: 0.67 },
  { date: 'Jul 12, 2025', course: 'Chambers Bay', score: 86, differential: 13.3, rollingHcp: 12.8, monthIdx: 4, monthFrac: 0.35 },
  { date: 'Jul 26, 2025', course: 'Evergreen GC', score: 83, differential: 12.1, rollingHcp: 12.7, monthIdx: 4, monthFrac: 0.81 },
  { date: 'Aug 9, 2025', course: 'Pine Valley', score: 84, differential: 12.5, rollingHcp: 12.6, monthIdx: 5, monthFrac: 0.26 },
  { date: 'Aug 23, 2025', course: 'Evergreen GC', score: 82, differential: 11.8, rollingHcp: 12.5, monthIdx: 5, monthFrac: 0.71 },
  { date: 'Sep 6, 2025', course: 'Chambers Bay', score: 85, differential: 12.6, rollingHcp: 12.5, monthIdx: 6, monthFrac: 0.17 },
  { date: 'Sep 27, 2025', course: 'Evergreen GC', score: 83, differential: 12.3, rollingHcp: 12.4, monthIdx: 6, monthFrac: 0.87 },
  { date: 'Oct 11, 2025', course: 'Pine Valley', score: 84, differential: 12.5, rollingHcp: 12.4, monthIdx: 7, monthFrac: 0.32 },
  { date: 'Oct 25, 2025', course: 'Evergreen GC', score: 84, differential: 12.8, rollingHcp: 12.5, monthIdx: 7, monthFrac: 0.77 },
  { date: 'Nov 8, 2025', course: 'Evergreen GC', score: 85, differential: 13.0, rollingHcp: 12.5, monthIdx: 8, monthFrac: 0.23 },
  { date: 'Dec 20, 2025', course: 'Indoor Sim', score: 83, differential: 12.4, rollingHcp: 12.4, monthIdx: 9, monthFrac: 0.61 },
  { date: 'Jan 10, 2026', course: 'Indoor Sim', score: 84, differential: 12.6, rollingHcp: 12.3, monthIdx: 10, monthFrac: 0.29 },
  { date: 'Jan 31, 2026', course: 'Indoor Sim', score: 82, differential: 12.0, rollingHcp: 12.2, monthIdx: 10, monthFrac: 0.97 },
  { date: 'Feb 15, 2026', course: 'Evergreen GC', score: 83, differential: 12.3, rollingHcp: 12.2, monthIdx: 11, monthFrac: 0.47 },
  { date: 'Mar 1, 2026', course: 'Pine Valley', score: 82, differential: 11.9, rollingHcp: 12.1, monthIdx: 12, monthFrac: 0.0 },
  { date: 'Mar 15, 2026', course: 'Evergreen GC', score: 81, differential: 11.6, rollingHcp: 12.1, monthIdx: 12, monthFrac: 0.45 },
];

/** Monthly strokes gained snapshots — from Arccos */
interface MonthlySG {
  month: string;
  monthIdx: number;
  driver: number;
  approach: number;
  shortGame: number;
  putting: number;
}

const MONTHLY_SG: MonthlySG[] = [
  { month: 'Mar 25', monthIdx: 0, driver: -1.5, approach: -0.3, shortGame: -0.7, putting: 0.1 },
  { month: 'Apr 25', monthIdx: 1, driver: -1.6, approach: -0.3, shortGame: -0.4, putting: 0.2 },
  { month: 'May 25', monthIdx: 2, driver: -1.7, approach: -0.2, shortGame: -0.2, putting: 0.1 },
  { month: 'Jun 25', monthIdx: 3, driver: -1.8, approach: -0.1, shortGame: -0.1, putting: 0.2 },
  { month: 'Jul 25', monthIdx: 4, driver: -1.9, approach: -0.1, shortGame: -0.1, putting: 0.3 },
  { month: 'Aug 25', monthIdx: 5, driver: -1.9, approach: 0.0, shortGame: -0.1, putting: 0.2 },
  { month: 'Sep 25', monthIdx: 6, driver: -2.0, approach: 0.0, shortGame: -0.1, putting: 0.2 },
  { month: 'Oct 25', monthIdx: 7, driver: -2.0, approach: 0.0, shortGame: 0.0, putting: 0.3 },
  { month: 'Nov 25', monthIdx: 8, driver: -2.0, approach: 0.0, shortGame: 0.0, putting: 0.2 },
  { month: 'Dec 25', monthIdx: 9, driver: -2.1, approach: 0.0, shortGame: -0.1, putting: 0.3 },
  { month: 'Jan 26', monthIdx: 10, driver: -2.2, approach: 0.1, shortGame: 0.0, putting: 0.3 },
  { month: 'Feb 26', monthIdx: 11, driver: -2.2, approach: 0.1, shortGame: -0.1, putting: 0.3 },
  { month: 'Mar 26', monthIdx: 12, driver: -2.3, approach: 0.2, shortGame: -0.1, putting: 0.3 },
];

const STROKES_GAINED = [
  { category: 'Driver', value: -2.3, trend: 'down' as const, context: 'vs. 12-HCP avg' },
  { category: 'Approach', value: 0.2, trend: 'up' as const, context: '\u2191 0.3 since Session 6' },
  { category: 'Short Game', value: -0.1, trend: 'flat' as const, context: 'vs. 12-HCP avg' },
  { category: 'Putting', value: 0.3, trend: 'up' as const, context: 'vs. 12-HCP avg' },
];

interface SessionData {
  number: number;
  date: string;
  focusTag: string;
  focusDetail: string;
  /** AI-inferred theme summary for the lesson card */
  themeSummary: string;
  duration: number;
  drills: string;
  keyData: string;
  summary: string;
  coachNote?: string;
  sg: { driver: number; approach: number; shortGame: number; putting: number };
  /** Handicap at this session point */
  hcp: number;
  /** Month index on the shared time axis (0 = Mar 25, 12 = Mar 26) */
  monthIdx: number;
  /** Fractional position within the month (0-1) */
  monthFrac: number;
}

/** Thread connecting lessons by shared coaching theme */
interface Thread {
  name: string;
  color: string;
  /** Session numbers where this thread is active */
  sessions: number[];
  /** Whether gaps between non-adjacent sessions are inferred (dashed) */
  hasGap?: boolean;
}

const THREADS: Thread[] = [
  { name: 'Wedge/Short Game', color: '#D4980B', sessions: [1, 2] },
  { name: 'Setup & Posture', color: '#6B7280', sessions: [3, 4] },
  { name: 'Trail Arm & Rotation', color: '#8B5CF6', sessions: [4, 5] },
  { name: 'Strike Quality', color: '#0D7C66', sessions: [6, 7, 8] },
  { name: 'Ball Position', color: '#3B82F6', sessions: [3, 7], hasGap: true },
];

const SESSIONS_DATA: SessionData[] = [
  { number: 1, date: 'Mar 8, 2025', focusTag: 'Wedge', focusDetail: 'Wedge distance control \u2014 50-80 yard carry windows', themeSummary: 'Wedge distance control \u2014 50-80 yard carry windows. Focused on consistent rhythm and wrist release point.', duration: 60, drills: 'Partial-Swing Distance Ladder', keyData: '60-yd carry spread: 18 yds (baseline)', summary: 'Established baseline wedge distances. Carry window varied by 18 yards. Prescribed partial-swing distance ladder.', sg: { driver: -1.5, approach: -0.3, shortGame: -0.7, putting: 0.1 }, hcp: 13.8, monthIdx: 0, monthFrac: 0.23 },
  { number: 2, date: 'Mar 29, 2025', focusTag: 'Wedge', focusDetail: 'Continued wedge work \u2014 partial swing ladder drill', themeSummary: 'Continued wedge work \u2014 added partial swing ladder drill. Carry gaps tightening.', duration: 60, drills: 'Tempo Drill (3:1 Ratio)', keyData: '60-yd carry spread: 12 yds (\u22126 from S1)', summary: 'Introduced 3:1 tempo ratio for partial wedges. Carry window tightened to 12 yards. Short game responding well.', sg: { driver: -1.6, approach: -0.3, shortGame: -0.4, putting: 0.2 }, hcp: 13.6, monthIdx: 0, monthFrac: 0.9 },
  { number: 3, date: 'May 12, 2025', focusTag: 'Setup', focusDetail: 'Setup posture and ball position audit', themeSummary: 'Setup posture and ball position. Standing taller, pelvis centered. Applies to irons and driver.', duration: 60, drills: 'Video Analysis, Ball Position Stations', keyData: 'Ball position variance: 1.5" across irons', summary: 'Video analysis revealed inconsistent ball position at address. 1.5" variance across iron set. Began standardization protocol.', sg: { driver: -1.7, approach: -0.2, shortGame: -0.2, putting: 0.1 }, hcp: 13.3, monthIdx: 2, monthFrac: 0.35 },
  { number: 4, date: 'Jul 3, 2025', focusTag: 'Trail Arm', focusDetail: 'Trail arm structure and pelvic rotation', themeSummary: 'Trail arm structure and pelvic rotation. Right arm staying in front, dialing down chest rotation for full pivot. G-Box drill introduced.', duration: 45, drills: 'G-Box Drill, Right-Arm-Only Swings', keyData: 'Pelvic rotation increased 8\u00b0. Right arm position improved at P5.', summary: 'Trail arm and rotation work addressing a connected pattern \u2014 right arm getting stuck behind creates compensations through impact. G-Box drill targets the root cause.', sg: { driver: -1.9, approach: -0.1, shortGame: -0.1, putting: 0.3 }, hcp: 12.9, monthIdx: 4, monthFrac: 0.06 },
  { number: 5, date: 'Sep 20, 2025', focusTag: 'Trail Arm', focusDetail: 'Continued trail arm work \u2014 wrist loading and shaft plane', themeSummary: 'Continued trail arm work \u2014 wrist loading and shaft plane. Building early radial hinge, less external rotation at top.', duration: 45, drills: 'Alignment Station, Pre-Shot Routine Timer', keyData: 'Pre-shot routine standardized at 12 seconds (was variable 8-18s)', summary: 'Variable pre-shot routine was creating alignment inconsistency. Standardized routine should compound with the trail arm improvements from summer work.', coachNote: 'Discussed driver with Moe. He\u2019s aware it\u2019s a weakness but wants to lock in iron consistency first. Revisit after next block.', sg: { driver: -2.0, approach: 0.0, shortGame: -0.1, putting: 0.2 }, hcp: 12.7, monthIdx: 6, monthFrac: 0.63 },
  { number: 6, date: 'Dec 8, 2025', focusTag: 'Iron Strike', focusDetail: 'Iron contact quality assessment', themeSummary: 'Iron contact assessment \u2014 toe bias pattern identified. Smash factor below target.', duration: 60, drills: 'Impact Tape Assessment, 9-to-3 Swings', keyData: 'Smash factor 1.32 (target 1.38). Strike pattern toe-biased.', summary: 'Toe-biased strike identified as primary iron limiter. Approach SG stalled \u2014 strike quality appears to be the bottleneck.', sg: { driver: -2.1, approach: 0.0, shortGame: -0.1, putting: 0.3 }, hcp: 12.5, monthIdx: 9, monthFrac: 0.23 },
  { number: 7, date: 'Jan 25, 2026', focusTag: 'Iron Strike', focusDetail: 'Gate drill for strike centering', themeSummary: 'Gate drill for strike centering. Toe bias consistent across 7i and 8i \u2014 likely ball position, not path.', duration: 60, drills: 'Gate Drill (new), Impact Tape Assessment', keyData: 'Toe bias 0.4" off-center. Consistent across 7i and 8i.', summary: 'Consistent toe-biased strike confirmed. Likely related to ball position at address, not swing path. Gate drill targets lateral contact directly.', coachNote: 'Toe bias consistent across clubs. Ball position, not path.', sg: { driver: -2.2, approach: 0.1, shortGame: 0.0, putting: 0.3 }, hcp: 12.3, monthIdx: 10, monthFrac: 0.77 },
  { number: 8, date: 'Mar 18, 2026', focusTag: 'Iron Strike', focusDetail: 'Continued gate drill \u2014 strike centering', themeSummary: 'Continued gate drill. Face-to-path narrowed. Strike pattern centering. Ready to test 6-iron transfer.', duration: 60, drills: 'Gate Drill, Alignment Rod Check', keyData: 'Face-to-path 2\u00b0 (from 4\u00b0 at S7). Strike center shifted 0.3" toward center.', summary: 'Strike pattern responding well to gate drill. Dispersion tightened 22% within session. Centering improvement holding across shot blocks. Ready to test transfer to 6-iron.', coachNote: 'Moe responding well to gate drill. Strike pattern noticeably more centered by end of session.', sg: { driver: -2.3, approach: 0.2, shortGame: -0.1, putting: 0.3 }, hcp: 12.1, monthIdx: 12, monthFrac: 0.55 },
];

const COACH_NOTES = [
  { date: 'Mar 18', text: 'Moe responding well to gate drill. Strike pattern noticeably more centered by end of session. Ready to test transfer to 6-iron next session.' },
  { date: 'Jan 25', text: 'Toe bias consistent across 7i and 8i. Likely ball position at address, not swing path. Gate drill should address this directly.' },
  { date: 'Sep 20', text: 'Discussed driver with Moe. He\u2019s aware it\u2019s a weakness but wants to lock in iron consistency first. Revisit driver after next block.' },
];




// ─── Player Journey (Unified Section) ────────────────────────────────────────

/** SG heatmap cell color based on value */
function sgCellStyle(v: number): { bg: string; text: string } {
  if (v <= -1.5) return { bg: 'rgba(201, 59, 59, 0.25)', text: '#C93B3B' };
  if (v <= -1.0) return { bg: 'rgba(201, 59, 59, 0.15)', text: '#C93B3B' };
  if (v <= -0.5) return { bg: 'rgba(201, 59, 59, 0.08)', text: 'rgba(201, 59, 59, 0.8)' };
  if (v < 0) return { bg: 'rgba(212, 152, 11, 0.08)', text: '#D4980B' };
  if (v === 0) return { bg: 'transparent', text: '#9CA3AF' };
  if (v <= 0.4) return { bg: 'rgba(15, 168, 122, 0.08)', text: '#0FA87A' };
  if (v <= 0.9) return { bg: 'rgba(15, 168, 122, 0.15)', text: '#0FA87A' };
  return { bg: 'rgba(15, 168, 122, 0.25)', text: '#0FA87A' };
}

/** Focus tag pill badge */
function FocusTagBadge({ tag }: { tag: string }): JSX.Element {
  const tintMap: Record<string, { bg: string; text: string }> = {
    'Wedge': { bg: 'rgba(212, 152, 11, 0.12)', text: '#D4980B' },
    'Chipping': { bg: 'rgba(212, 152, 11, 0.12)', text: '#D4980B' },
    'Iron Strike': { bg: 'rgba(13, 124, 102, 0.12)', text: '#0D7C66' },
    'Trail Arm': { bg: 'rgba(139, 92, 246, 0.12)', text: '#8B5CF6' },
    'Setup': { bg: 'rgba(107, 114, 128, 0.10)', text: '#6B7280' },
    'Ball Pos': { bg: 'rgba(107, 114, 128, 0.10)', text: '#6B7280' },
    'Alignment': { bg: 'rgba(107, 114, 128, 0.10)', text: '#6B7280' },
  };
  const tint = tintMap[tag] ?? { bg: 'rgba(107, 114, 128, 0.10)', text: '#6B7280' };
  return (
    <span
      className="text-[11px] font-medium px-1.5 py-0.5 rounded"
      style={{ backgroundColor: tint.bg, color: tint.text, fontFamily: 'DM Sans' }}
    >
      {tag}
    </span>
  );
}

/** Three-layer player journey on a shared time axis */
function PlayerJourney(): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const [highlightedSession, setHighlightedSession] = useState<number | null>(null);
  const [hoveredRound, setHoveredRound] = useState<number | null>(null);

  const scrollToSession = (num: number): void => {
    setShowAll(true);
    setHighlightedSession(num);
    setTimeout(() => {
      const el = document.getElementById(`lesson-card-${num}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
    setTimeout(() => setHighlightedSession(null), 1500);
  };

  const recentSessions = showAll ? [...SESSIONS_DATA].reverse() : [...SESSIONS_DATA].reverse().slice(0, 5);
  const fmtSg = (v: number): string => v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1);

  // Shared time axis: 13 months, ~80px per month
  const monthW = 80;
  const totalMonths = 13;
  const labelW = 80; // sticky label column width
  const ghostW = 40;
  const contentW = totalMonths * monthW + ghostW;
  const monthLabels = ['Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26'];

  /** Convert monthIdx + monthFrac to pixel x position */
  const toX = (mIdx: number, mFrac: number): number => (mIdx + mFrac) * monthW;

  const getSessionThreads = (num: number): Thread[] =>
    THREADS.filter((t) => t.sessions.includes(num));

  // Rounds layer: y-axis scale (differential range ~11.5 to 14.5)
  const roundsH = 80;
  const diffMin = 11.0;
  const diffMax = 14.5;
  const diffToY = (diff: number): number => {
    const ratio = (diff - diffMin) / (diffMax - diffMin);
    return ratio * roundsH; // 0 = top (low diff = good), roundsH = bottom (high diff = bad)
    // Actually inverted: low diff = good = bottom visually? No — spec says higher dots = worse scores
    // So high differential = top, low = bottom. ratio 1 = top (y=0), ratio 0 = bottom (y=roundsH)
  };
  const diffToYInv = (diff: number): number => {
    const ratio = 1 - (diff - diffMin) / (diffMax - diffMin);
    return ratio * roundsH;
  };

  /** Round dot color based on differential vs rolling handicap */
  const roundDotColor = (r: RoundData): string => {
    if (r.differential <= r.rollingHcp - 2) return '#0FA87A';
    if (r.differential >= r.rollingHcp + 2) return '#C93B3B';
    return '#9CA3AF';
  };

  // Lesson card dimensions
  const cardW = 120;

  return (
    <div className="bg-white rounded-lg border border-[#DFE2E7] p-4">
      <h2 className="text-[18px] font-medium mb-3" style={{ color: '#1A1F2B', fontFamily: 'DM Sans' }}>
        Player Journey
      </h2>

      {/* ── Pinned SG Status Bar ── */}
      <div
        className="flex items-center justify-between pb-2 mb-3"
        style={{ borderBottom: '1px solid #ECEEF2' }}
      >
        {STROKES_GAINED.map((sg) => {
          const isNeg = sg.value < 0;
          const isPos = sg.value > 0;
          const valueColor = isNeg ? '#C93B3B' : isPos ? '#0FA87A' : '#4B5563';
          return (
            <div key={sg.category} className="flex items-center gap-1.5">
              <span className="text-[12px]" style={{ color: '#9CA3AF', fontFamily: 'DM Sans' }}>
                {sg.category} SG
              </span>
              <span className="font-mono text-[16px] font-bold" style={{ color: valueColor }}>
                {sg.value > 0 ? '+' : ''}{sg.value.toFixed(1)}
              </span>
              {sg.trend === 'up' && <TrendingUp className="w-3 h-3" style={{ color: '#0FA87A' }} />}
              {sg.trend === 'down' && <TrendingDown className="w-3 h-3" style={{ color: '#C93B3B' }} />}
              {sg.trend === 'flat' && <Minus className="w-3 h-3" style={{ color: '#4B5563' }} />}
            </div>
          );
        })}
      </div>

      {/* ── Thread legend ── */}
      <div className="flex items-center gap-3 mb-2">
        {THREADS.map((t) => (
          <div key={t.name} className="flex items-center gap-1">
            <span className="block w-[6px] h-[6px] rounded-full" style={{ backgroundColor: t.color }} />
            <span className="text-[9px]" style={{ color: '#9CA3AF', fontFamily: 'DM Sans' }}>{t.name}</span>
          </div>
        ))}
      </div>

      {/* ── Scrollable Three-Layer Container ── */}
      <div className="relative">
        {/* Left fade indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-4 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent)' }} />

        <div
          className="overflow-x-auto"
          ref={(el) => { if (el) el.scrollLeft = el.scrollWidth; }}
        >
          <div className="relative" style={{ width: `${labelW + contentW}px` }}>

            {/* ════ LAYER 1: Lessons + Thread Lines (integrated) ════ */}
            {(() => {
              const staggerOffset = 50;
              const cardH = 90; // approximate card content height
              const threadBandY = cardH + staggerOffset + 8; // below tallest card
              const layerH = threadBandY + 20; // total layer height
              /** Get stagger Y offset: odd sessions at top, even offset down */
              const cardY = (num: number): number => num % 2 === 0 ? staggerOffset : 0;
              /** Thread anchor Y for a session (bottom of its card area) */
              const threadY = (num: number): number => cardY(num) + cardH + 4;

              return (
                <div className="flex" style={{ minHeight: `${layerH}px` }}>
                  {/* Sticky label */}
                  <div className="shrink-0 sticky left-0 z-20 bg-white flex items-start pt-1 pr-2 justify-end" style={{ width: `${labelW}px`, borderRight: '1px solid #ECEEF2' }}>
                    <span className="text-[11px] font-medium" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>Lessons</span>
                  </div>
                  {/* Lesson cards + thread curves */}
                  <div className="relative flex-1" style={{ height: `${layerH}px` }}>
                    {/* Cards (z-10 to sit above thread lines) */}
                    {SESSIONS_DATA.map((s) => {
                      const x = toX(s.monthIdx, s.monthFrac);
                      const y = cardY(s.number);
                      const sessionThreads = getSessionThreads(s.number);
                      return (
                        <button
                          key={s.number}
                          className="absolute text-left rounded-[6px] hover:bg-[#F6F7F9] transition-colors z-10"
                          style={{ left: `${x}px`, top: `${y}px`, width: `${cardW}px`, padding: '6px 8px', backgroundColor: '#FFFFFF', border: '1px solid #ECEEF2' }}
                          onClick={() => scrollToSession(s.number)}
                        >
                          <p className="font-mono text-[10px]" style={{ color: '#9CA3AF' }}>{s.date}</p>
                          <p className="font-mono text-[11px] font-bold" style={{ color: '#1A1F2B' }}>S{s.number}</p>
                          <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#4B5563', fontFamily: 'DM Sans', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {s.themeSummary}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {sessionThreads.map((t) => (
                              <span key={t.name} className="block w-[6px] h-[6px] rounded-full" style={{ backgroundColor: t.color }} />
                            ))}
                          </div>
                        </button>
                      );
                    })}

                    {/* Thread bezier curves (z-0, behind cards) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                      {THREADS.map((thread) => {
                        const sessionNums = [...thread.sessions].sort((a, b) => a - b);
                        if (sessionNums.length < 2) return null;

                        // Build path segments between consecutive pairs
                        const points = sessionNums.map((sNum) => {
                          const sd = SESSIONS_DATA.find((s) => s.number === sNum);
                          if (!sd) return null;
                          return { x: toX(sd.monthIdx, sd.monthFrac) + cardW / 2, y: threadY(sNum) };
                        }).filter(Boolean) as { x: number; y: number }[];

                        if (points.length < 2) return null;

                        // Build a smooth bezier path through all points
                        let d = `M ${points[0].x} ${points[0].y}`;
                        for (let i = 1; i < points.length; i++) {
                          const p0 = points[i - 1];
                          const p1 = points[i];
                          const cpOffset = (p1.x - p0.x) * 0.4;
                          d += ` C ${p0.x + cpOffset} ${p0.y}, ${p1.x - cpOffset} ${p1.y}, ${p1.x} ${p1.y}`;
                        }

                        return (
                          <g key={thread.name}>
                            <path
                              d={d}
                              fill="none"
                              stroke={thread.color}
                              strokeWidth={2}
                              strokeDasharray={thread.hasGap ? '6 3' : 'none'}
                            />
                            {/* Nodes */}
                            {points.map((p, i) => (
                              <circle key={i} cx={p.x} cy={p.y} r={3} fill={thread.color} />
                            ))}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              );
            })()}

            {/* Separator */}
            <div className="flex">
              <div className="shrink-0 sticky left-0 z-20 bg-white" style={{ width: `${labelW}px` }} />
              <div className="flex-1" style={{ height: '1px', backgroundColor: '#ECEEF2' }} />
            </div>

            {/* ════ LAYER 2: Rounds & Handicap ════ */}
            <div className="flex" style={{ height: `${roundsH + 8}px` }}>
              {/* Sticky label */}
              <div className="shrink-0 sticky left-0 z-20 bg-white flex flex-col items-end justify-start pt-1 pr-2" style={{ width: `${labelW}px`, borderRight: '1px solid #ECEEF2' }}>
                <span className="text-[11px] font-medium" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>Rounds</span>
                <span className="font-mono text-[11px] font-bold mt-0.5" style={{ color: '#0D7C66' }}>12.1</span>
                <span className="font-mono text-[9px]" style={{ color: '#9CA3AF' }}>HCP</span>
              </div>
              {/* Round dots + handicap line */}
              <div className="relative flex-1" style={{ height: `${roundsH}px`, marginTop: '4px' }}>
                {/* Subtle gridlines */}
                <svg width="100%" height={roundsH} className="absolute inset-0">
                  {monthLabels.map((_, i) => (
                    <line key={i} x1={i * monthW} y1={0} x2={i * monthW} y2={roundsH} stroke="#F0F2F5" strokeWidth={1} />
                  ))}
                </svg>

                {/* Rolling handicap line */}
                <svg width="100%" height={roundsH} className="absolute inset-0" style={{ overflow: 'visible' }}>
                  <polyline
                    fill="none"
                    stroke="#0D7C66"
                    strokeWidth={1.5}
                    points={ROUNDS_DATA.map((r) => `${toX(r.monthIdx, r.monthFrac)},${diffToYInv(r.rollingHcp)}`).join(' ')}
                  />
                </svg>

                {/* Round dots */}
                {ROUNDS_DATA.map((r, i) => {
                  const x = toX(r.monthIdx, r.monthFrac);
                  const y = diffToYInv(r.differential);
                  return (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: '6px', height: '6px',
                        left: `${x - 3}px`, top: `${y - 3}px`,
                        backgroundColor: roundDotColor(r),
                        cursor: 'default',
                      }}
                      onMouseEnter={() => setHoveredRound(i)}
                      onMouseLeave={() => setHoveredRound(null)}
                    >
                      {hoveredRound === i && (
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-[#1A1F2B] whitespace-nowrap z-30"
                          style={{ pointerEvents: 'none' }}
                        >
                          <p className="font-mono text-[10px] text-white">{r.course}</p>
                          <p className="font-mono text-[10px] text-white">{r.score} ({r.differential.toFixed(1)})</p>
                          <p className="font-mono text-[9px]" style={{ color: '#9CA3AF' }}>{r.date}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Separator */}
            <div className="flex">
              <div className="shrink-0 sticky left-0 z-20 bg-white" style={{ width: `${labelW}px` }} />
              <div className="flex-1" style={{ height: '1px', backgroundColor: '#ECEEF2' }} />
            </div>

            {/* ════ LAYER 3: Strokes Gained Heatmap ════ */}
            {(() => {
              const sgRows: { label: string; key: 'driver' | 'approach' | 'shortGame' | 'putting' }[] = [
                { label: 'Driver', key: 'driver' },
                { label: 'Approach', key: 'approach' },
                { label: 'Short Game', key: 'shortGame' },
                { label: 'Putting', key: 'putting' },
              ];

              return (
                <div>
                  {sgRows.map((row) => (
                    <div key={row.key} className="flex" style={{ height: '22px' }}>
                      {/* Sticky row label */}
                      <div
                        className="shrink-0 sticky left-0 z-20 bg-white flex items-center justify-end pr-2"
                        style={{ width: `${labelW}px`, borderRight: '1px solid #ECEEF2' }}
                      >
                        <span className="text-[11px] font-medium" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>{row.label}</span>
                      </div>
                      {/* Monthly SG cells */}
                      {MONTHLY_SG.map((m) => {
                        const v = m[row.key];
                        const cs = sgCellStyle(v);
                        return (
                          <div
                            key={m.monthIdx}
                            className="flex items-center justify-center border-r border-b"
                            style={{ width: `${monthW}px`, borderColor: '#ECEEF2', backgroundColor: cs.bg }}
                          >
                            <span className="font-mono text-[10px]" style={{ color: cs.text }}>{fmtSg(v)}</span>
                          </div>
                        );
                      })}
                      {/* Ghost column */}
                      {row.key === 'driver' ? (
                        <div className="flex items-center justify-center shrink-0" style={{ width: `${ghostW}px`, border: '2px dashed rgba(201, 59, 59, 0.3)', backgroundColor: 'rgba(201, 59, 59, 0.12)' }}>
                          <span className="font-mono text-[10px]" style={{ color: '#C93B3B' }}>-2.3</span>
                        </div>
                      ) : (
                        <div className="shrink-0" style={{ width: `${ghostW}px`, border: '2px dashed rgba(201, 59, 59, 0.15)' }} />
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ════ Shared Time Axis ════ */}
            <div className="flex mt-1">
              <div className="shrink-0 sticky left-0 z-20 bg-white" style={{ width: `${labelW}px` }} />
              {monthLabels.map((label, i) => (
                <div key={i} className="text-center" style={{ width: `${monthW}px` }}>
                  <span className="font-mono text-[10px]" style={{ color: '#9CA3AF' }}>{label}</span>
                </div>
              ))}
              <div style={{ width: `${ghostW}px` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Lesson Record List ── */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #ECEEF2' }}>
        <div className="space-y-2" style={{ maxHeight: showAll ? 'none' : '600px', overflowY: showAll ? 'visible' : 'auto' }}>
          {recentSessions.map((s) => (
            <div
              key={s.number}
              id={`lesson-card-${s.number}`}
              className="border rounded-[6px] p-3 transition-colors duration-500"
              style={{
                borderColor: '#ECEEF2',
                backgroundColor: highlightedSession === s.number ? 'rgba(13, 124, 102, 0.05)' : '#FFFFFF',
              }}
            >
              {/* Row 1: Session number, date, focus tag, duration */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[13px] font-bold" style={{ color: '#1A1F2B' }}>
                    S{s.number}
                  </span>
                  <span className="font-mono text-[12px]" style={{ color: '#9CA3AF' }}>
                    {s.date}
                  </span>
                  <FocusTagBadge tag={s.focusTag} />
                </div>
                <span className="font-mono text-[11px]" style={{ color: '#9CA3AF' }}>
                  {s.duration} min
                </span>
              </div>

              {/* Description */}
              <p className="text-[13px] mb-1" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
                {s.focusDetail}
              </p>

              {/* Drills */}
              <p className="text-[12px] mb-1" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
                <span className="font-medium" style={{ color: '#9CA3AF' }}>Drills:</span> {s.drills}
              </p>

              {/* Key data */}
              <p className="font-mono text-[11px] mb-1" style={{ color: '#9CA3AF' }}>
                {s.keyData}
              </p>

              {/* AI observation */}
              <p className="text-[12px] leading-relaxed" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
                {s.summary}
              </p>

              {/* Coach note */}
              {s.coachNote && (
                <div className="flex items-start gap-1.5 mt-2 pt-2" style={{ borderTop: '1px solid #F0F2F5' }}>
                  <Pencil className="w-3 h-3 mt-0.5 shrink-0" style={{ color: '#9CA3AF' }} />
                  <p className="text-[12px] italic" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
                    {s.coachNote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showAll && SESSIONS_DATA.length > 5 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-3 text-[12px] font-medium hover:underline"
            style={{ color: '#0D7C66', fontFamily: 'DM Sans' }}
          >
            Show earlier sessions ({SESSIONS_DATA.length - 5} more)
          </button>
        )}
        {showAll && SESSIONS_DATA.length > 5 && (
          <button
            onClick={() => setShowAll(false)}
            className="mt-3 text-[12px] font-medium hover:underline"
            style={{ color: '#0D7C66', fontFamily: 'DM Sans' }}
          >
            Show recent sessions only
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/** Player longitudinal profile — the coach's view of an ongoing coaching relationship */
export default function StudentDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        navigate('/coach/students');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

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
              onClick={() => navigate('/trackman')}
              className="px-4 py-2 rounded-[6px] text-sm font-medium text-white transition-colors hover:brightness-110"
              style={{ backgroundColor: '#0D7C66', fontFamily: 'DM Sans' }}
            >
              Start Lesson
            </button>
            <p className="font-mono text-[10px] mt-1" style={{ color: '#9CA3AF' }}>
              Session 9
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
{/* confidence badge removed */}
        </div>
        <div className="text-sm leading-relaxed space-y-2" style={{ color: '#4B5563', fontFamily: 'DM Sans' }}>
          <p>
            <span className="font-medium" style={{ color: '#1A1F2B' }}>Last session</span> (Mar 18): Continued iron strike centering &mdash; toe bias correction with gate drill. Dispersion tightened 22% within the session.
          </p>
          <p>
            <span className="font-medium" style={{ color: '#1A1F2B' }}>On the course:</span> Approach play has improved steadily &mdash; strokes gained up +0.3 over the last three sessions. However, driver remains Moe&apos;s biggest opportunity: losing 2.3 strokes per round off the tee, trending worse over the past year.
          </p>
          <p>
            <span className="font-medium" style={{ color: '#1A1F2B' }}>For next session:</span> Consider pivoting to a driver block. The iron strike work is showing results and should hold &mdash; the driver gap is widening.
          </p>
        </div>
      </div>

      {/* ─── Section 3+4: Player Journey (Unified) ──────────────────── */}
      <PlayerJourney />

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

    </div>
  );
}
