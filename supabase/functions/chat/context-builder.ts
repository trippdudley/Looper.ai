/**
 * Context Builder — assembles a system prompt from the player's Supabase record.
 *
 * Pulls: player profile, rounds, practice sessions, shots, coaching sessions.
 * Outputs a structured system prompt that gives Claude full context about the player.
 *
 * If the player has minimal data, the prompt gracefully notes what's missing
 * and still provides useful guidance based on what IS available.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface PlayerRow {
  id: string;
  name: string;
  email: string;
  handicap_index: number | null;
  career_low: number | null;
  home_club: string | null;
  goal: string | null;
  archetype: string | null;
  strengths: unknown[] | null;
  weaknesses: unknown[] | null;
  connected_sources: string[] | null;
}

interface RoundRow {
  date: string;
  course_name: string;
  score: number;
  differential: number | null;
  sg_total: number | null;
  sg_off_tee: number | null;
  sg_approach: number | null;
  sg_around_green: number | null;
  sg_putting: number | null;
  source: string;
}

interface SessionRow {
  date: string;
  source: string;
  total_shots: number | null;
  clubs_used: string[] | null;
  type: string | null;
  focus_area: string | null;
}

interface ShotStats {
  club: string;
  count: number;
  avg_carry: number | null;
  avg_ball_speed: number | null;
  avg_offline: number | null;
  avg_spin: number | null;
}

export async function buildSystemPrompt(userId: string): Promise<string> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Fetch player profile
  const { data: player } = await supabase
    .from('players')
    .select('id, name, email, handicap_index, career_low, home_club, goal, archetype, strengths, weaknesses, connected_sources')
    .eq('auth_id', userId)
    .single() as { data: PlayerRow | null };

  if (!player) {
    return buildMinimalPrompt();
  }

  // Fetch all data in parallel
  const [roundsRes, sessionsRes, shotsRes] = await Promise.all([
    supabase
      .from('rounds')
      .select('date, course_name, score, differential, sg_total, sg_off_tee, sg_approach, sg_around_green, sg_putting, source')
      .eq('player_id', player.id)
      .order('date', { ascending: false })
      .limit(50),
    supabase
      .from('practice_sessions')
      .select('date, source, total_shots, clubs_used, type, focus_area')
      .eq('player_id', player.id)
      .order('date', { ascending: false })
      .limit(30),
    supabase
      .from('shots')
      .select('club, carry, ball_speed, offline, spin_rate')
      .eq('player_id', player.id)
      .limit(500),
  ]);

  const rounds: RoundRow[] = roundsRes.data ?? [];
  const sessions: SessionRow[] = sessionsRes.data ?? [];
  const rawShots = shotsRes.data ?? [];

  // Compute shot stats by club
  const clubMap = new Map<string, { carries: number[]; speeds: number[]; offlines: number[]; spins: number[] }>();
  for (const s of rawShots) {
    const club = s.club ?? 'Unknown';
    if (!clubMap.has(club)) clubMap.set(club, { carries: [], speeds: [], offlines: [], spins: [] });
    const entry = clubMap.get(club)!;
    if (s.carry != null) entry.carries.push(s.carry);
    if (s.ball_speed != null) entry.speeds.push(s.ball_speed);
    if (s.offline != null) entry.offlines.push(Math.abs(s.offline));
    if (s.spin_rate != null) entry.spins.push(s.spin_rate);
  }

  const shotStats: ShotStats[] = [];
  for (const [club, data] of clubMap.entries()) {
    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10 : null;
    shotStats.push({
      club,
      count: data.carries.length || data.speeds.length,
      avg_carry: avg(data.carries),
      avg_ball_speed: avg(data.speeds),
      avg_offline: avg(data.offlines),
      avg_spin: avg(data.spins),
    });
  }
  shotStats.sort((a, b) => b.count - a.count);

  // Check what data is available
  const hasSG = rounds.some(r => r.sg_total != null);
  const hasRounds = rounds.length > 0;
  const hasPractice = sessions.length > 0;
  const hasShots = rawShots.length > 0;
  const sources = player.connected_sources ?? [];

  // Build the prompt
  const sections: string[] = [];

  // Identity
  sections.push(`You are Looper — an AI golf intelligence system. You have access to the performance record for ${player.name}.

## Your Identity
You speak like a smart caddie who watches every round and every practice session. You are:
- Precise: every claim backed by data. Uncertainty stated honestly.
- Opinionated: you tell the player what to do, not list options.
- Connected: you link across data sources when possible (rounds ↔ practice ↔ coaching).
- Honest: you don't overcelebrate noise or sugarcoat problems.`);

  // Player Profile
  const hcp = player.handicap_index != null ? player.handicap_index.toFixed(1) : 'unknown';
  const careerLow = player.career_low != null ? player.career_low.toFixed(1) : 'not set';
  sections.push(`## Player Profile
- Name: ${player.name}
- Handicap Index: ${hcp}
- Career Low: ${careerLow}
- Home Club: ${player.home_club ?? 'not set'}
- Goal: ${player.goal ?? 'not set'}
- Connected Data Sources: ${sources.length > 0 ? sources.join(', ') : 'none yet'}`);

  // Golf DNA (if available)
  if (player.archetype || player.strengths || player.weaknesses) {
    let dna = '## Golf DNA\n';
    if (player.archetype) dna += `- Archetype: ${player.archetype}\n`;
    if (player.strengths && Array.isArray(player.strengths)) {
      dna += '\nStrengths:\n';
      for (const s of player.strengths) {
        const st = s as { text?: string; context?: string };
        dna += `- ${st.text ?? ''} (${st.context ?? ''})\n`;
      }
    }
    if (player.weaknesses && Array.isArray(player.weaknesses)) {
      dna += '\nWeaknesses:\n';
      for (const w of player.weaknesses) {
        const wk = w as { text?: string; context?: string };
        dna += `- ${wk.text ?? ''} (${wk.context ?? ''})\n`;
      }
    }
    sections.push(dna);
  }

  // Rounds
  if (hasRounds) {
    const scores = rounds.filter(r => r.score > 0).map(r => r.score);
    const diffs = rounds.map(r => r.differential).filter((d): d is number => d != null);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';
    const bestScore = scores.length > 0 ? Math.min(...scores) : 'N/A';
    const avgDiff = diffs.length > 0 ? (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1) : 'N/A';

    let roundsSection = `## Scoring Record (${rounds.length} rounds)\n`;
    roundsSection += `- Average Score: ${avgScore}\n`;
    roundsSection += `- Best Score: ${bestScore}\n`;
    roundsSection += `- Average Differential: ${avgDiff}\n\n`;
    roundsSection += '### Recent Rounds\n';
    for (const r of rounds.slice(0, 15)) {
      const sgStr = r.sg_total != null ? `, SG: ${r.sg_total > 0 ? '+' : ''}${r.sg_total.toFixed(1)}` : '';
      const diffStr = r.differential != null ? `, diff ${r.differential.toFixed(1)}` : '';
      roundsSection += `- ${r.date} ${r.course_name}: ${r.score}${diffStr}${sgStr} [${r.source}]\n`;
    }
    sections.push(roundsSection);
  }

  // Strokes Gained
  if (hasSG) {
    const sgRounds = rounds.filter(r => r.sg_total != null);
    const avg = (arr: (number | null)[]) => {
      const valid = arr.filter((v): v is number => v != null);
      return valid.length > 0 ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1) : 'N/A';
    };
    let sgSection = `## Strokes Gained Summary (${sgRounds.length} rounds with SG data)\n`;
    sgSection += `- SG Total: ${avg(sgRounds.map(r => r.sg_total))}\n`;
    sgSection += `- SG Off the Tee: ${avg(sgRounds.map(r => r.sg_off_tee))}\n`;
    sgSection += `- SG Approach: ${avg(sgRounds.map(r => r.sg_approach))}\n`;
    sgSection += `- SG Around the Green: ${avg(sgRounds.map(r => r.sg_around_green))}\n`;
    sgSection += `- SG Putting: ${avg(sgRounds.map(r => r.sg_putting))}\n`;
    sections.push(sgSection);
  }

  // Practice Data
  if (hasPractice) {
    let practiceSection = `## Practice Sessions (${sessions.length} sessions)\n`;
    const totalShots = sessions.reduce((sum, s) => sum + (s.total_shots ?? 0), 0);
    practiceSection += `- Total shots tracked: ${totalShots}\n`;
    const sourceBreakdown = new Map<string, number>();
    for (const s of sessions) {
      sourceBreakdown.set(s.source, (sourceBreakdown.get(s.source) ?? 0) + 1);
    }
    practiceSection += `- Sources: ${[...sourceBreakdown.entries()].map(([k, v]) => `${k} (${v})`).join(', ')}\n\n`;
    practiceSection += '### Recent Sessions\n';
    for (const s of sessions.slice(0, 10)) {
      practiceSection += `- ${s.date}: ${s.total_shots ?? '?'} shots, ${s.type ?? 'range'}${s.clubs_used?.length ? `, clubs: ${s.clubs_used.join(', ')}` : ''} [${s.source}]\n`;
    }
    sections.push(practiceSection);
  }

  // Shot Statistics by Club
  if (hasShots && shotStats.length > 0) {
    let shotsSection = '## Club Statistics (from launch monitor data)\n';
    for (const stat of shotStats.slice(0, 12)) {
      const parts = [`${stat.count} shots`];
      if (stat.avg_carry != null) parts.push(`${stat.avg_carry} yd carry`);
      if (stat.avg_ball_speed != null) parts.push(`${stat.avg_ball_speed} mph`);
      if (stat.avg_offline != null) parts.push(`${stat.avg_offline} yd offline`);
      if (stat.avg_spin != null) parts.push(`${Math.round(stat.avg_spin)} rpm`);
      shotsSection += `- ${stat.club}: ${parts.join(', ')}\n`;
    }
    sections.push(shotsSection);
  }

  // Data Availability
  const have: string[] = [];
  const dontHave: string[] = [];

  if (hasRounds) have.push(`GHIN/scoring data (${rounds.length} rounds)`);
  if (hasPractice) have.push(`Practice sessions (${sessions.length})`);
  if (hasShots) have.push(`Launch monitor shots (${rawShots.length})`);
  if (hasSG) have.push('Strokes gained breakdown');

  if (!hasRounds) dontHave.push('Scoring/round data');
  if (!hasPractice) dontHave.push('Practice session data');
  if (!hasShots) dontHave.push('Launch monitor shot data');
  if (!hasSG) dontHave.push('Strokes gained breakdown (connect Arccos)');

  sections.push(`## Data Availability
HAVE: ${have.length > 0 ? have.join(', ') : 'No data imported yet'}
DON'T HAVE: ${dontHave.length > 0 ? dontHave.join(', ') : 'All key data sources connected'}

${dontHave.length > 0 ? 'When the player asks about missing data, be honest about what we need. Encourage them to import more data to unlock deeper insights.' : 'You have comprehensive data. Use it all.'}`);

  // Response guidelines
  sections.push(`## Response Guidelines
1. Always reference specific numbers from the player's record. Never fabricate stats.
2. When recommending practice, be specific: drills, time blocks, clubs, success criteria.
3. Use differentials (not raw scores) for cross-course comparison.
4. Surface cross-source insights when possible: connect rounds to practice behavior.
5. Use confidence language: "data strongly suggests" (high confidence) vs "early signal" (low).
6. Keep responses concise but substantive. Lead with the answer, support with data.
7. Today's date is ${new Date().toISOString().slice(0, 10)}.
8. Never use emoji. Use plain text formatting only.
9. This is a REAL player with REAL data. Do not fabricate any statistics.
10. If the player has minimal data, acknowledge this honestly and provide general guidance while encouraging them to import more data.`);

  return sections.join('\n\n');
}

function buildMinimalPrompt(): string {
  return `You are Looper — an AI golf intelligence system.

The player just signed up and hasn't imported any data yet.

Your role:
- Welcome them warmly
- Explain what Looper can do once they import data (GHIN scores, Arccos strokes gained, Foresight/TrackMan launch monitor sessions)
- Answer general golf questions
- Encourage them to import their first data source via the Journey tab

Be concise, helpful, and knowledgeable about golf. Never use emoji.
Today's date is ${new Date().toISOString().slice(0, 10)}.`;
}
