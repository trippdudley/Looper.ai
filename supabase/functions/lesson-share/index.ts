/**
 * lesson-share Edge Function
 *
 * GET  /functions/v1/lesson-share?token={share_token}
 *   → Returns a mobile-optimized HTML lesson summary page
 *
 * POST /functions/v1/lesson-share?token={share_token}
 *   → Claim flow: { email?: string, phone?: string }
 *   → Saves contact to lesson_shares, sends Supabase magic link
 *   → Returns JSON { ok: true }
 *
 * This is a standalone HTML server — no React, no bundler.
 * Players landing here from a QR scan see full lesson content immediately.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEB_BASE_URL = Deno.env.get('WEB_BASE_URL') ?? 'https://looper.ai';

// Service-role client for view count increment and claim writes
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface SessionData {
  id: string;
  date: string;
  type: string;
  duration_min: number | null;
  focus: string | null;
  summary: string | null;
  coaching_cues: string[];
  drills: DrillData[];
  key_changes: KeyChange[];
  transcript_segments: TranscriptSeg[];
  players: { name: string } | null;
  coaches: { name: string; academy: string | null } | null;
}

interface DrillData {
  name: string;
  reps: number | null;
  focus: string;
  success_criteria: string;
  category: string;
}

interface KeyChange {
  metric: string;
  before: string;
  after: string;
  unit: string;
}

interface TranscriptSeg {
  start: number;
  speaker: number;
  transcript: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return html(renderError('Missing token'), 400);
  }

  // ── POST: claim flow ────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    return handleClaim(token, req);
  }

  // ── GET: render lesson summary ──────────────────────────────────────────────
  const session = await fetchSession(token);
  if (!session) {
    return html(renderError('This lesson link has expired or does not exist.'), 404);
  }

  // Increment view count asynchronously (don't block render)
  adminClient.rpc('increment_share_view', { p_token: token }).then(() => {});

  return html(renderSession(session, token));
});

// ─── Claim flow ───────────────────────────────────────────────────────────────

async function handleClaim(token: string, req: Request): Promise<Response> {
  let body: { email?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const { email, phone } = body;
  if (!email && !phone) {
    return json({ ok: false, error: 'Email or phone required' }, 400);
  }

  // Update lesson_shares with contact info
  const { error: updateError } = await adminClient
    .from('lesson_shares')
    .update({
      ...(email ? { student_email: email } : {}),
      ...(phone ? { student_phone: phone } : {}),
    })
    .eq('share_token', token);

  if (updateError) {
    return json({ ok: false, error: updateError.message }, 500);
  }

  // Send magic link if email provided
  if (email) {
    const redirectTo = `${WEB_BASE_URL}/lesson/${token}`;
    const { error: magicLinkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo,
        data: { claimed_lesson_token: token },
      },
    });

    if (magicLinkError) {
      // Contact saved — magic link failure is non-fatal
      console.error('Magic link error:', magicLinkError.message);
    }
  }

  return json({ ok: true });
}

// ─── Data fetch ───────────────────────────────────────────────────────────────

async function fetchSession(token: string): Promise<SessionData | null> {
  const { data, error } = await adminClient
    .from('lesson_shares')
    .select(`
      coaching_sessions (
        id, date, type, duration_min, focus, summary,
        coaching_cues, drills, key_changes, transcript_segments,
        players ( name ),
        coaches ( name, academy )
      )
    `)
    .eq('share_token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) return null;

  const s = (data as Record<string, unknown>).coaching_sessions as SessionData | null;
  return s ?? null;
}

// ─── Response helpers ─────────────────────────────────────────────────────────

function html(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// ─── HTML renderers ───────────────────────────────────────────────────────────

function renderError(message: string): string {
  return page(`
    <div class="center-full">
      <div class="brand">Looper</div>
      <div class="error-msg">${escHtml(message)}</div>
      <p class="muted">The coach can generate a new share link from the Looper Coach app.</p>
    </div>
  `);
}

function renderSession(session: SessionData, token: string): string {
  const playerName = (session.players as { name: string } | null)?.name ?? '';
  const coachName = (session.coaches as { name: string; academy: string | null } | null)?.name ?? '';
  const academy = (session.coaches as { name: string; academy: string | null } | null)?.academy ?? '';
  const cues = Array.isArray(session.coaching_cues) ? session.coaching_cues : [];
  const drills = Array.isArray(session.drills) ? session.drills as DrillData[] : [];
  const keyChanges = Array.isArray(session.key_changes) ? session.key_changes as KeyChange[] : [];
  const segments = Array.isArray(session.transcript_segments)
    ? session.transcript_segments as TranscriptSeg[]
    : [];

  const sessionTypeLabels: Record<string, string> = {
    'full-swing': 'Full Swing', 'short-game': 'Short Game',
    'playing-lesson': 'Playing Lesson', 'assessment': 'Assessment',
    'putting': 'Putting', 'mental': 'Mental Game',
  };

  const typeLabel = sessionTypeLabels[session.type] ?? session.type;
  const formattedDate = formatDate(session.date);

  const drillCategoryColors: Record<string, string> = {
    external: '#3B82F6', internal: '#D4980B', constraint: '#8B5CF6', physical: '#0FA87A',
  };

  const cuesHtml = cues.length > 0 ? `
    <div class="section">
      <div class="section-label">Coaching Cues</div>
      <div class="card">
        ${cues.map(c => `
          <div class="cue-row">
            <div class="cue-bullet"></div>
            <div class="cue-text">${escHtml(c)}</div>
          </div>`).join('')}
      </div>
    </div>` : '';

  const keyChangesHtml = keyChanges.length > 0 ? `
    <div class="section">
      <div class="section-label">Key Changes</div>
      ${keyChanges.map(kc => `
        <div class="kc-card">
          <div class="kc-metric">${escHtml(kc.metric)}</div>
          <div class="kc-values">
            <div class="kc-col">
              <div class="kc-label">Before</div>
              <div class="kc-value">${escHtml(kc.before)} <span class="unit">${escHtml(kc.unit)}</span></div>
            </div>
            <div class="kc-arrow">→</div>
            <div class="kc-col">
              <div class="kc-label">After</div>
              <div class="kc-value kc-after">${escHtml(kc.after)} <span class="unit">${escHtml(kc.unit)}</span></div>
            </div>
          </div>
        </div>`).join('')}
    </div>` : '';

  const drillsHtml = drills.length > 0 ? `
    <div class="section">
      <div class="section-label">Practice Drills</div>
      ${drills.map(d => {
        const color = drillCategoryColors[d.category] ?? '#8B99A8';
        const cap = d.category.charAt(0).toUpperCase() + d.category.slice(1);
        return `
          <div class="drill-card">
            <div class="drill-header">
              <div class="drill-name">${escHtml(d.name)}</div>
              <div class="drill-chip" style="background:${color}22;color:${color}">${escHtml(cap)}</div>
            </div>
            ${d.reps ? `<div class="drill-reps">${d.reps} reps</div>` : ''}
            <div class="drill-focus">${escHtml(d.focus)}</div>
            ${d.success_criteria ? `
              <div class="drill-criteria">
                <span class="criteria-label">Success: </span>${escHtml(d.success_criteria)}
              </div>` : ''}
          </div>`;
      }).join('')}
    </div>` : '';

  const transcriptHtml = segments.length > 0 ? `
    <details class="transcript-details">
      <summary class="transcript-summary">Full Transcript (${segments.length} segments)</summary>
      <div class="transcript-content">
        ${segments.map(s => `
          <div class="transcript-seg">
            <div class="transcript-meta">${s.speaker === 0 ? 'Coach' : 'Player'} · ${formatSecs(s.start)}</div>
            <div class="transcript-text">${escHtml(s.transcript)}</div>
          </div>`).join('')}
      </div>
    </details>` : '';

  const summaryHtml = session.summary ? `
    <div class="section">
      <div class="section-label">Summary</div>
      <div class="card"><p class="summary-text">${escHtml(session.summary)}</p></div>
    </div>` : '';

  return page(`
    <!-- Header -->
    <div class="header">
      <div class="brand-row">
        <span class="brand-looper">Looper</span>
        <span class="brand-sep"> · </span>
        <span class="brand-sub">Lesson Summary</span>
      </div>
      <div class="session-date">${escHtml(formattedDate)}</div>
    </div>

    <!-- Player / coach info -->
    <div class="card">
      ${playerName ? `
        <div class="player-row">
          <div class="avatar">${initials(playerName)}</div>
          <div>
            <div class="player-name">${escHtml(playerName)}</div>
            ${coachName ? `<div class="coach-line">with ${escHtml(coachName)}${academy ? ` · ${escHtml(academy)}` : ''}</div>` : ''}
          </div>
        </div>` : ''}
      <div class="chip-row">
        <span class="chip">${escHtml(typeLabel)}</span>
        ${session.duration_min ? `<span class="chip chip-mono">${session.duration_min} min</span>` : ''}
        ${session.focus ? `<span class="chip chip-accent">${escHtml(session.focus)}</span>` : ''}
      </div>
    </div>

    ${summaryHtml}
    ${keyChangesHtml}
    ${cuesHtml}
    ${drillsHtml}
    ${transcriptHtml}

    <!-- Claim your lesson -->
    <div class="section">
      <div class="section-label">Claim Your Lesson</div>
      <div class="card">
        <p class="claim-intro">
          Save this lesson to your account to track progress and receive practice plans.
        </p>
        <div id="claim-form">
          <div class="tab-row">
            <button class="tab-btn tab-active" onclick="setTab('email')" id="tab-email">Email</button>
            <button class="tab-btn" onclick="setTab('phone')" id="tab-phone">Phone</button>
          </div>
          <div id="email-input-row" class="input-row">
            <input id="email-input" type="email" class="text-input" placeholder="your@email.com" autocomplete="email" />
            <button class="submit-btn" onclick="submitClaim('email')">Send link</button>
          </div>
          <div id="phone-input-row" class="input-row" style="display:none">
            <input id="phone-input" type="tel" class="text-input" placeholder="+1 (555) 000-0000" autocomplete="tel" />
            <button class="submit-btn" onclick="submitClaim('phone')">Save</button>
          </div>
          <div id="claim-success" class="claim-success" style="display:none">
            <span class="claim-success-icon">&#10003;</span>
            <span id="claim-success-msg"></span>
          </div>
        </div>
        <div class="cta-divider"></div>
        <div class="cta-app">
          <div class="cta-app-title">Download Looper Player</div>
          <div class="cta-app-body">Track your improvement, get AI practice plans, and see every lesson summary in one place.</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">Looper.AI</div>
      <div class="footer-tag">AI-native golf coaching</div>
    </div>
  `, token);
}

// ─── Page shell ───────────────────────────────────────────────────────────────

function page(content: string, token?: string): string {
  const claimToken = token ? escHtml(token) : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0C1117" />
  <title>Looper · Lesson Summary</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; }
    body {
      background: #0C1117;
      color: #E8ECF1;
      font-family: 'DM Sans', sans-serif;
      min-height: 100dvh;
      display: flex;
      justify-content: center;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 480px;
      padding: 24px 20px 60px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .center-full {
      width: 100%;
      max-width: 480px;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      text-align: center;
      min-height: 100dvh;
    }
    .brand { font-size: 18px; font-weight: 700; color: #10B981; }
    .error-msg { font-size: 16px; color: #C93B3B; font-weight: 600; }
    .muted { font-size: 13px; color: #5E6E7E; line-height: 1.6; }

    /* Header */
    .header { padding-top: 8px; display: flex; flex-direction: column; gap: 8px; }
    .brand-row { font-size: 14px; }
    .brand-looper { font-weight: 700; color: #10B981; }
    .brand-sep { color: #5E6E7E; }
    .brand-sub { color: #8B99A8; }
    .session-date { font-family: 'Space Mono', monospace; font-size: 12px; color: #5E6E7E; }

    /* Card */
    .card {
      background: #151D28;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #2A3A4A;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Player info */
    .player-row { display: flex; align-items: center; gap: 12px; }
    .avatar {
      width: 44px; height: 44px; border-radius: 22px;
      background: #1E2A36; color: #8B99A8;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; flex-shrink: 0;
    }
    .player-name { font-size: 18px; font-weight: 700; }
    .coach-line { font-size: 13px; color: #8B99A8; margin-top: 2px; }
    .chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      font-size: 12px; padding: 4px 10px; border-radius: 20px;
      background: #1E2A36; color: #8B99A8; border: 1px solid #2A3A4A;
    }
    .chip-mono { font-family: 'Space Mono', monospace; }
    .chip-accent { background: #0FA87A22; color: #10B981; border-color: #10B98133; }

    /* Sections */
    .section { display: flex; flex-direction: column; gap: 10px; }
    .section-label {
      font-size: 11px; font-weight: 600; color: #5E6E7E;
      letter-spacing: 1.5px; text-transform: uppercase;
    }
    .summary-text { font-size: 15px; color: #E8ECF1; line-height: 1.6; }

    /* Cues */
    .cue-row { display: flex; align-items: flex-start; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid #1E2A36; }
    .cue-row:last-child { padding-bottom: 0; border-bottom: none; }
    .cue-bullet { width: 6px; height: 6px; border-radius: 3px; background: #10B981; margin-top: 7px; flex-shrink: 0; }
    .cue-text { font-size: 15px; color: #E8ECF1; line-height: 1.5; }

    /* Key changes */
    .kc-card {
      background: #151D28; border-radius: 8px; padding: 14px;
      border: 1px solid #2A3A4A; display: flex; flex-direction: column; gap: 10px;
    }
    .kc-metric { font-size: 14px; font-weight: 600; }
    .kc-values { display: flex; align-items: center; gap: 16px; }
    .kc-col { display: flex; flex-direction: column; gap: 4px; }
    .kc-label { font-size: 11px; color: #5E6E7E; text-transform: uppercase; letter-spacing: 0.5px; }
    .kc-value { font-family: 'Space Mono', monospace; font-size: 18px; }
    .kc-after { color: #10B981; }
    .kc-arrow { font-family: 'Space Mono', monospace; font-size: 16px; color: #5E6E7E; }
    .unit { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #5E6E7E; }

    /* Drills */
    .drill-card {
      background: #151D28; border-radius: 8px; padding: 14px;
      border: 1px solid #2A3A4A; display: flex; flex-direction: column;
      gap: 8px; margin-bottom: 8px;
    }
    .drill-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .drill-name { font-size: 15px; font-weight: 700; flex: 1; }
    .drill-chip { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; flex-shrink: 0; }
    .drill-reps { font-family: 'Space Mono', monospace; font-size: 13px; color: #8B99A8; }
    .drill-focus { font-size: 14px; color: #8B99A8; }
    .drill-criteria {
      font-size: 13px; color: #8B99A8;
      background: #1E2A36; border-radius: 6px; padding: 8px 10px; line-height: 1.5;
    }
    .criteria-label { color: #0FA87A; font-weight: 600; }

    /* Transcript */
    .transcript-details { border: 1px solid #2A3A4A; border-radius: 8px; overflow: hidden; }
    .transcript-summary {
      font-size: 14px; color: #8B99A8; padding: 14px 16px;
      cursor: pointer; background: #151D28; list-style: none;
    }
    .transcript-content { display: flex; flex-direction: column; gap: 8px; padding: 12px 16px 16px; }
    .transcript-seg { display: flex; flex-direction: column; gap: 4px; }
    .transcript-meta { font-family: 'Space Mono', monospace; font-size: 11px; color: #5E6E7E; }
    .transcript-text { font-size: 14px; color: #E8ECF1; line-height: 1.6; }

    /* Claim form */
    .claim-intro { font-size: 14px; color: #8B99A8; line-height: 1.6; }
    .tab-row { display: flex; gap: 8px; }
    .tab-btn {
      border-radius: 20px; padding: 6px 16px; font-size: 13px; font-family: 'DM Sans', sans-serif;
      border: 1px solid #2A3A4A; background: #1E2A36; color: #8B99A8;
      cursor: pointer;
    }
    .tab-active { border-color: #10B981; background: #0FA87A22; color: #10B981; font-weight: 600; }
    .input-row { display: flex; gap: 8px; margin-top: 8px; }
    .text-input {
      flex: 1; background: #1E2A36; border: 1px solid #2A3A4A; border-radius: 8px;
      padding: 12px 14px; color: #E8ECF1; font-size: 15px; font-family: 'DM Sans', sans-serif;
    }
    .text-input:focus { outline: none; border-color: #10B981; }
    .submit-btn {
      background: #10B981; border: none; border-radius: 8px;
      padding: 12px 16px; color: #0C1117; font-size: 14px;
      font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer;
      white-space: nowrap;
    }
    .submit-btn:active { opacity: 0.8; }
    .claim-success {
      display: flex; align-items: center; gap: 10px; margin-top: 8px;
      background: #0FA87A22; border-radius: 8px; padding: 12px 14px;
    }
    .claim-success-icon { color: #10B981; font-size: 18px; }
    #claim-success-msg { font-size: 14px; color: #10B981; }
    .cta-divider { height: 1px; background: #1E2A36; }
    .cta-app-title { font-size: 14px; font-weight: 700; color: #10B981; }
    .cta-app-body { font-size: 13px; color: #8B99A8; line-height: 1.6; }

    /* Footer */
    .footer { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 20px; border-top: 1px solid #1E2A36; }
    .footer-brand { font-size: 14px; font-weight: 700; color: #10B981; }
    .footer-tag { font-size: 12px; color: #5E6E7E; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
  <script>
    const TOKEN = '${claimToken}';
    const SUPABASE_URL = '${SUPABASE_URL}';

    function setTab(type) {
      const emailBtn = document.getElementById('tab-email');
      const phoneBtn = document.getElementById('tab-phone');
      const emailRow = document.getElementById('email-input-row');
      const phoneRow = document.getElementById('phone-input-row');
      if (!emailBtn || !phoneBtn || !emailRow || !phoneRow) return;
      if (type === 'email') {
        emailBtn.className = 'tab-btn tab-active';
        phoneBtn.className = 'tab-btn';
        emailRow.style.display = 'flex';
        phoneRow.style.display = 'none';
      } else {
        phoneBtn.className = 'tab-btn tab-active';
        emailBtn.className = 'tab-btn';
        phoneRow.style.display = 'flex';
        emailRow.style.display = 'none';
      }
    }

    async function submitClaim(type) {
      const input = document.getElementById(type + '-input');
      if (!input || !input.value.trim()) return;
      const value = input.value.trim();
      const btn = input.nextElementSibling;
      if (btn) { btn.textContent = '...'; btn.disabled = true; }

      try {
        const body = type === 'email' ? { email: value } : { phone: value };
        const res = await fetch(
          SUPABASE_URL + '/functions/v1/lesson-share?token=' + encodeURIComponent(TOKEN),
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        );
        const data = await res.json();
        const successEl = document.getElementById('claim-success');
        const msgEl = document.getElementById('claim-success-msg');
        if (data.ok && successEl && msgEl) {
          document.getElementById('claim-form').style.display = 'none';
          msgEl.textContent = type === 'email'
            ? 'Check your email for a sign-in link!'
            : 'Phone saved — we\'ll reach out when the Player app launches.';
          successEl.style.display = 'flex';
        }
      } catch (e) {
        if (btn) { btn.textContent = 'Send link'; btn.disabled = false; }
      }
    }
  </script>
</body>
</html>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function initials(name: string): string {
  return name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

function formatSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
