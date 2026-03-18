import { Link, useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { golfers } from '../../../data/golfers';
import { sessions } from '../../../data/sessions';
import { integrations } from '../../../data/integrations';
import ImprovementGauge from '../../../components/ui/ImprovementGauge';
import IntegrationBadge from '../../../components/ui/IntegrationBadge';
import SessionCard from '../../../components/session/SessionCard';
import Card from '../../../components/ui/Card';

export default function GolferHome() {
  const golfer = golfers[0];
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Sort sessions by date descending
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Two most recent sessions
  const recentSessions = sortedSessions.slice(0, 2);

  // Build a map of session improvement deltas
  // Sort ascending to compute deltas relative to the previous session
  const sessionsAsc = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const deltaMap: Record<string, number> = {};
  sessionsAsc.forEach((session, index) => {
    if (index === 0) {
      deltaMap[session.id] = 0;
    } else {
      deltaMap[session.id] = session.improvementScore - sessionsAsc[index - 1].improvementScore;
    }
  });

  // Connected integrations
  const connectedIntegrations = golfer.connectedSystems
    .map((systemId) => integrations.find((i) => i.id === systemId))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Greeting */}
      <div>
        <h1 className="text-lg font-semibold text-navy">
          {greeting}, {golfer.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-gray-400">Handicap Index: {golfer.handicapIndex}</p>
      </div>

      {/* Improvement Score Hero Card */}
      <Card>
        <div className="flex flex-col items-center">
          <ImprovementGauge
            score={golfer.improvementScore}
            trend={12}
            trendLabel="% over last 3 sessions"
          />
          <p className="text-xs text-gray-400 mt-2">Improvement Score</p>
        </div>
      </Card>

      {/* Current Focus Card */}
      <Card className="bg-accent/5">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-accent" />
          <span className="font-semibold text-navy text-sm">Your Current Focus</span>
        </div>
        <p className="text-sm text-gray-700 mb-3">{golfer.currentFocus}</p>
        <Link
          to="/golfer/practice"
          className="inline-flex items-center bg-accent/10 text-accent text-xs font-medium px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors"
        >
          Prescribed Drill: Step Drill
        </Link>
      </Card>

      {/* Connected Data Sources */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
          Connected Sources
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {connectedIntegrations.map((integration) => (
            <IntegrationBadge
              key={integration!.id}
              name={integration!.name}
              status={integration!.status}
            />
          ))}
        </div>
      </div>

      {/* Recent Lessons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-navy">Recent Lessons</h2>
          <Link
            to="/golfer/lessons"
            className="text-sm text-accent font-medium hover:underline"
          >
            See All &rarr;
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {recentSessions.map((session) => (
            <SessionCard
              key={session.id}
              id={session.id}
              date={new Date(session.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              coachName="Austin Reed, PGA"
              summary={session.summary}
              focus={session.focus}
              improvementDelta={deltaMap[session.id] ?? 0}
              onClick={() => navigate(`/golfer/lessons/${session.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Log Practice Button */}
      <button className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors">
        Log Practice
      </button>
    </div>
  );
}
