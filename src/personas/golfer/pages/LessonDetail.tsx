import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Mic, Gauge, Wind, Target, RotateCcw } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import DataSourcePill from '../../../components/ui/DataSourcePill';
import CoachCueCard from '../../../components/session/CoachCueCard';
import DrillCard from '../../../components/session/DrillCard';
import MetricComparison from '../../../components/charts/MetricComparison';

// Inlined from deleted TrackmanDataGrid component
const qualityColors: Record<string, string> = {
  excellent: 'bg-accent/10 text-accent',
  good: 'bg-data-blue/10 text-data-blue',
  average: 'bg-warm-amber/10 text-warm-amber',
  poor: 'bg-coral/10 text-coral',
};

interface ShotGridItem {
  id: string; club: string; clubSpeed: number; ballSpeed: number;
  launchAngle: number; spinRate: number; carry: number;
  clubPath: number; faceAngle: number; shotShape: string; quality: string;
}

function TrackmanDataGrid({ shots }: { shots: ShotGridItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {shots.map((shot) => {
        const qColor = qualityColors[shot.quality.toLowerCase()] || 'bg-gray-100 text-gray-600';
        return (
          <div key={shot.id} className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center">
                  <Target className="w-4 h-4 text-navy" />
                </div>
                <span className="text-sm font-semibold text-navy">{shot.club}</span>
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${qColor}`}>
                {shot.quality}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-gray-500"><Gauge className="w-3 h-3" /> Club Speed</span>
                <span className="text-sm font-mono font-medium text-navy">{shot.clubSpeed.toFixed(1)} mph</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-gray-500"><Wind className="w-3 h-3" /> Ball Speed</span>
                <span className="text-sm font-mono font-medium text-navy">{shot.ballSpeed.toFixed(1)} mph</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Carry</span>
                <span className="text-sm font-mono font-medium text-navy">{shot.carry.toFixed(1)} yds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Launch</span>
                <span className="text-sm font-mono font-medium text-navy">{shot.launchAngle.toFixed(1)}&deg;</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-gray-500"><RotateCcw className="w-3 h-3" /> Spin</span>
                <span className="text-sm font-mono font-medium text-navy">{shot.spinRate.toLocaleString('en-US')} rpm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Path / Face</span>
                <span className="text-sm font-mono font-medium text-navy">
                  {shot.clubPath > 0 ? '+' : ''}{shot.clubPath.toFixed(1)}&deg; / {shot.faceAngle > 0 ? '+' : ''}{shot.faceAngle.toFixed(1)}&deg;
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Shape: </span>
              <span className="text-xs font-medium text-navy">{shot.shotShape}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { sessions } from '../../../data/sessions';
import { trackmanShots } from '../../../data/trackmanData';
import { drills } from '../../../data/drills';
import { coaches } from '../../../data/coaches';

const typeLabels: Record<string, string> = {
  'full-swing': 'Full Swing',
  'short-game': 'Short Game',
  'playing-lesson': 'Playing Lesson',
  assessment: 'Assessment',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCoachInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/golfer/lessons');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-xl text-navy font-bold mb-2">Session not found</h2>
        <p className="text-sm text-gray-500 mb-4">
          The session you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-accent font-medium text-sm hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const coach = coaches.find((c) => c.id === session.coachId);
  const sessionDrills = session.drillIds
    .map((drillId) => drills.find((d) => d.id === drillId))
    .filter(Boolean);
  const sessionShots = trackmanShots.filter((s) => s.sessionId === session.id);

  return (
    <div className="pb-8 space-y-6">
      {/* 1. Back nav + header */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/golfer/lessons" className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Lessons</span>
        </Link>
      </div>
      <h1 className="text-lg font-bold text-navy">Lesson Detail</h1>

      {/* 2. Session header card */}
      <Card>
        <div className="space-y-3">
          {/* Date + duration */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy">{formatDate(session.date)}</span>
            <Badge label={session.duration} variant="neutral" />
          </div>

          {/* Coach */}
          {coach && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                {getCoachInitials(coach.name)}
              </div>
              <span className="text-sm text-gray-700">
                {coach.name}, {coach.title}
              </span>
            </div>
          )}

          {/* Session type + data source */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge label={typeLabels[session.type] || session.type} variant="accent" />
            <DataSourcePill name="Trackman" color="#E63946" />
          </div>
        </div>
      </Card>

      {/* 3. AI Session Summary */}
      <Card className="bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sm text-navy">AI Session Summary</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{session.summary}</p>
      </Card>

      {/* 4. What We Worked On */}
      <div>
        <h2 className="font-semibold text-navy mb-3">What We Worked On</h2>
        <div className="space-y-2">
          {session.faults.map((fault, i) => (
            <div
              key={i}
              className={`bg-white rounded-lg p-3 border-l-4 ${
                i === 0 ? 'border-accent' : 'border-gray-200'
              } shadow-sm`}
            >
              <p className="text-sm text-gray-700">{fault}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Coach's Cues */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Mic className="w-4 h-4 text-accent" />
          <h2 className="font-semibold text-navy">Coach's Cues</h2>
        </div>
        <div className="space-y-3">
          {session.coachingCues.map((cue, i) => (
            <CoachCueCard key={i} cue={cue} index={i} />
          ))}
        </div>
      </div>

      {/* 6. Prescribed Drills */}
      <div>
        <h2 className="font-semibold text-navy mb-3">Prescribed Drills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sessionDrills.map(
            (drill) =>
              drill && (
                <DrillCard
                  key={drill.id}
                  name={drill.name}
                  focus={drill.focus}
                  duration={drill.duration}
                  reps={drill.reps}
                  difficulty={drill.difficulty}
                />
              )
          )}
        </div>
      </div>

      {/* 7. Session Data (Trackman) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-semibold text-navy">Trackman Data</h2>
          <DataSourcePill name="Trackman" color="#E63946" />
        </div>

        {sessionShots.length > 0 && (
          <TrackmanDataGrid
            shots={sessionShots.map((s) => ({
              id: s.id,
              club: s.club,
              clubSpeed: s.clubSpeed,
              ballSpeed: s.ballSpeed,
              launchAngle: s.launchAngle,
              spinRate: s.spinRate,
              carry: s.carry,
              clubPath: s.clubPath,
              faceAngle: s.faceAngle,
              shotShape: s.shotShape,
              quality: s.quality,
            }))}
          />
        )}

        {/* Metric changes */}
        {session.keyMetricChanges.length > 0 && (
          <Card className="mt-4">
            <h3 className="text-sm font-semibold text-navy mb-2">Key Metric Changes</h3>
            <div className="divide-y divide-gray-100">
              {session.keyMetricChanges.map((change, i) => (
                <MetricComparison
                  key={i}
                  label={change.metric}
                  before={change.before}
                  after={change.after}
                  unit={change.unit}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
