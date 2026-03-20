import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Mic } from 'lucide-react';
import type { TrackmanShot } from '../../data/trackmanData';
import { C, F } from './TPSColors';
import {
  sessionContext, aiInsights, recommendations, playerHistory,
} from '../../data/coachingOSData';

// ─── Sub-tab type ────────────────────────────────────────────────
type PanelTab = 'brief' | 'insights' | 'capture' | 'diagnosis' | 'plan';

const PANEL_TABS: Array<{ id: PanelTab; label: string }> = [
  { id: 'brief', label: 'Brief' },
  { id: 'insights', label: 'Insights' },
  { id: 'capture', label: 'Capture' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'plan', label: 'Plan' },
];

// ─── Pattern types ───────────────────────────────────────────────
interface PatternInsight {
  id: string;
  type: 'trend' | 'alert' | 'breakthrough';
  title: string;
  detail: string;
  confidence: number;
  shotRange: string;
}

const patterns: PatternInsight[] = [
  {
    id: 'p1', type: 'trend',
    title: 'Attack angle improving across session',
    detail: 'Step drill cue producing +2.0° shallowing trend from shot 1→10. Weight transfer feel translating to measurable delivery change.',
    confidence: 87, shotRange: 'Shots 1-10',
  },
  {
    id: 'p2', type: 'breakthrough',
    title: 'Best smash factor of program (1.46)',
    detail: 'Shot 8 — 141.2 mph ball speed, 96.8 club speed. Center-face contact with optimal attack angle (+3.5°). Step drill fully transferred.',
    confidence: 94, shotRange: 'Shot 8',
  },
  {
    id: 'p3', type: 'alert',
    title: 'Brief regression on shot 3',
    detail: 'Lost step feel momentarily — club path went to -2.2° (old pattern). Recovered on shot 4.',
    confidence: 72, shotRange: 'Shot 3',
  },
  {
    id: 'p4', type: 'trend',
    title: 'Iron contact consistency at program best',
    detail: 'Shots 5-6 show 7-iron smash 1.40-1.41 with neutral path. Weight shift carrying into iron play.',
    confidence: 81, shotRange: 'Shots 5-6',
  },
];

// ─── Confidence badge ────────────────────────────────────────────
function ConfBadge({ value }: { value: number }) {
  const color = value >= 80 ? C.conf : value >= 50 ? C.caution : C.flag;
  const bg = value >= 80 ? C.confBg : value >= 50 ? C.cautionBg : C.flagBg;
  return (
    <span style={{
      fontFamily: F.data, fontSize: 8, fontWeight: 700,
      padding: '1px 6px', borderRadius: 3, background: bg, color,
    }}>{value}%</span>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  BRIEF TAB
// ═══════════════════════════════════════════════════════════════════
function BriefTab() {
  const lastLesson = playerHistory.lessons[1]; // Session 2 completed
  const currentLesson = playerHistory.lessons[2]; // Session 3 in-progress
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Player Context */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap',
      }}>
        {[
          `${sessionContext.playerName} · ${sessionContext.handicap} hcp`,
          `Session ${sessionContext.sessionNumber}/${sessionContext.totalSessions}`,
          `Goal: ${sessionContext.goal}`,
        ].map(text => (
          <span key={text} style={{
            fontFamily: F.data, fontSize: 8, padding: '3px 8px',
            borderRadius: 12, border: `1px solid ${C.borderSub}`, color: C.muted,
          }}>{text}</span>
        ))}
      </div>

      {/* Last Session Recap */}
      <div style={{
        background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
        padding: '12px 14px',
      }}>
        <div style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          letterSpacing: '.08em', color: C.muted, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Last Session · {lastLesson.date}</div>
        <div style={{
          fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink,
          marginBottom: 4,
        }}>{lastLesson.focus}</div>
        <div style={{
          fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.55,
        }}>{lastLesson.keyTakeaway}</div>
        {lastLesson.cueUsed && (
          <div style={{
            marginTop: 6, fontFamily: F.data, fontSize: 8, color: C.accent,
            padding: '3px 8px', borderRadius: 4, background: C.accentBg,
            display: 'inline-block',
          }}>CUE: "{lastLesson.cueUsed}"</div>
        )}
      </div>

      {/* Current Arc */}
      <div style={{
        background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
        padding: '12px 14px',
      }}>
        <div style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          letterSpacing: '.08em', color: C.muted, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Current Session Focus</div>
        <div style={{
          fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink,
          marginBottom: 4,
        }}>{currentLesson.focus}</div>
        <div style={{
          fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.55,
        }}>{currentLesson.keyTakeaway}</div>
      </div>

      {/* Coach Notes */}
      <div style={{
        background: C.elevated, borderRadius: 8, padding: '10px 14px',
        border: `1px solid ${C.borderSub}`,
      }}>
        <div style={{
          fontFamily: F.data, fontSize: 7, fontWeight: 700,
          letterSpacing: '.08em', color: C.dim, marginBottom: 4,
          textTransform: 'uppercase',
        }}>Coach Notes from Session 2</div>
        <div style={{
          fontFamily: F.brand, fontSize: 10, color: C.muted,
          lineHeight: 1.5, fontStyle: 'italic',
        }}>"{lastLesson.coachNotes}"</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  INSIGHTS TAB
// ═══════════════════════════════════════════════════════════════════
function InsightsTab({ activeShot }: { activeShot: TrackmanShot }) {
  const relevantInsight = useMemo(() => {
    if (activeShot.quality === 'good' && activeShot.smashFactor >= 1.44)
      return aiInsights.find(i => i.shotId === 14);
    if (activeShot.quality === 'mishit')
      return aiInsights.find(i => i.shotId === 11);
    if (activeShot.quality === 'good')
      return aiInsights.find(i => i.shotId === 12);
    return aiInsights.find(i => i.shotId === 8);
  }, [activeShot]);

  const relevantRec = useMemo(() => {
    if (activeShot.quality === 'mishit') return recommendations[1];
    if (activeShot.quality === 'good' && activeShot.smashFactor >= 1.44) return recommendations[2];
    return recommendations[0];
  }, [activeShot]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Shot context */}
      <div style={{
        fontFamily: F.data, fontSize: 9, fontWeight: 700,
        letterSpacing: '.06em', color: C.muted, textTransform: 'uppercase',
      }}>
        Shot {activeShot.shotNumber} · {activeShot.club}
      </div>

      {/* AI Observation */}
      {relevantInsight && (
        <div style={{
          background: `linear-gradient(135deg, ${C.surface} 0%, ${C.accent}05 100%)`,
          borderRadius: 10, padding: '12px 14px',
          border: `1px solid ${C.accent}18`, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${C.accent}35, transparent)`,
          }} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 6,
          }}>
            <span style={{
              fontFamily: F.data, fontSize: 8, fontWeight: 700,
              color: C.accent, letterSpacing: '.06em',
            }}>AI OBSERVATION</span>
            <ConfBadge value={relevantInsight.confidence} />
          </div>
          <div style={{
            fontFamily: F.brand, fontSize: 11.5, color: C.body, lineHeight: 1.6,
          }}>{relevantInsight.observation}</div>
        </div>
      )}

      {/* Recommendation */}
      {relevantRec && (
        <div style={{
          background: C.surface, borderRadius: 10, padding: '12px 14px',
          border: `1px solid ${C.caution}18`, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${C.caution}25, transparent)`,
          }} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 6,
          }}>
            <span style={{
              fontFamily: F.data, fontSize: 8, fontWeight: 700,
              color: C.caution, letterSpacing: '.06em',
            }}>RECOMMENDATION</span>
            <span style={{
              fontFamily: F.data, fontSize: 8, fontWeight: 700,
              padding: '1px 6px', borderRadius: 3,
              background: C.cautionBg, color: C.caution,
            }}>{relevantRec.infoGain}</span>
          </div>
          <div style={{
            fontFamily: F.brand, fontSize: 11.5, color: C.body, lineHeight: 1.6,
          }}>{relevantRec.text}</div>
          <button style={{
            marginTop: 8, fontFamily: F.data, fontSize: 8, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.06em',
            padding: '3px 10px', borderRadius: 4, cursor: 'pointer',
            background: 'transparent', border: `1px solid ${C.border}`, color: C.muted,
          }}>Override</button>
        </div>
      )}

      {/* TrackMan note */}
      {activeShot.notes && (
        <div style={{
          background: C.elevated, borderRadius: 8, padding: '10px 14px',
          border: `1px solid ${C.borderSub}`,
        }}>
          <div style={{
            fontFamily: F.data, fontSize: 7, fontWeight: 700,
            letterSpacing: '.08em', color: C.dim, marginBottom: 4,
            textTransform: 'uppercase',
          }}>TrackMan Note</div>
          <div style={{
            fontFamily: F.brand, fontSize: 10, color: C.muted,
            lineHeight: 1.5, fontStyle: 'italic',
          }}>"{activeShot.notes}"</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CAPTURE TAB
// ═══════════════════════════════════════════════════════════════════
function CaptureTab() {
  const [notes, setNotes] = useState('');
  const quickTags = ['Cue landed', 'Revert to old pattern', 'Breakthrough', 'Fatigue', 'Player frustrated', 'Good feel'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        fontFamily: F.data, fontSize: 8, fontWeight: 700,
        letterSpacing: '.08em', color: C.muted, textTransform: 'uppercase',
      }}>Session Capture</div>

      {/* Quick tags */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {quickTags.map(tag => (
          <button key={tag} style={{
            fontFamily: F.data, fontSize: 8, padding: '3px 8px',
            borderRadius: 12, border: `1px solid ${C.borderSub}`,
            background: 'transparent', color: C.muted, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSub; e.currentTarget.style.color = C.muted; }}
            onClick={() => setNotes(prev => prev + (prev ? '\n' : '') + tag + ': ')}
          >{tag}</button>
        ))}
      </div>

      {/* Notes area */}
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Type coaching notes... Why did you choose this intervention? What did the player say?"
        style={{
          fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.55,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '10px 12px', minHeight: 120,
          resize: 'vertical', outline: 'none',
        }}
        onFocus={e => e.currentTarget.style.borderColor = C.accent}
        onBlur={e => e.currentTarget.style.borderColor = C.border}
      />

      {/* Voice note button */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
        fontFamily: F.data, fontSize: 9, fontWeight: 700,
        padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
        background: C.elevated, border: `1px solid ${C.border}`, color: C.muted,
      }}>
        <Mic size={12} /> Voice Note
      </button>

      {/* Saved notes preview */}
      <div style={{
        fontFamily: F.data, fontSize: 7, color: C.dim,
        letterSpacing: '.06em', textTransform: 'uppercase',
      }}>
        Reasoning captured here is saved with the session record
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  DIAGNOSIS TAB
// ═══════════════════════════════════════════════════════════════════
function DiagnosisTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        fontFamily: F.data, fontSize: 8, fontWeight: 700,
        letterSpacing: '.08em', color: C.muted, textTransform: 'uppercase',
      }}>Session Patterns</div>

      {patterns.map(p => (
        <div key={p.id} style={{
          padding: '10px 12px', borderRadius: 8,
          background: C.surface, border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${
            p.type === 'breakthrough' ? C.conf
            : p.type === 'alert' ? C.caution : C.body
          }`,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {p.type === 'alert' && <AlertTriangle size={10} color={C.caution} />}
              <span style={{
                fontFamily: F.brand, fontSize: 11, fontWeight: 600, color: C.ink,
              }}>{p.title}</span>
            </div>
            <ConfBadge value={p.confidence} />
          </div>
          <div style={{
            fontFamily: F.brand, fontSize: 10.5, color: C.body, lineHeight: 1.55,
          }}>{p.detail}</div>
          <span style={{
            fontFamily: F.data, fontSize: 7, color: C.dim, marginTop: 4,
            display: 'inline-block',
          }}>{p.shotRange}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PLAN TAB
// ═══════════════════════════════════════════════════════════════════
function PlanTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        fontFamily: F.data, fontSize: 8, fontWeight: 700,
        letterSpacing: '.08em', color: C.muted, textTransform: 'uppercase',
      }}>Player Plan · {sessionContext.playerName}</div>

      {/* Current Arc */}
      <div style={{
        background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
        padding: '12px 14px',
      }}>
        <div style={{
          fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: C.ink,
          marginBottom: 6,
        }}>Current Arc: Strike Consistency</div>
        <div style={{
          fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.6,
        }}>
          Session 3 of 8. Ground-pressure external cue producing measurable improvement
          in attack angle and strike centering. Partial regression after 2-week break
          confirms motor pattern not yet automatic. Plan: reinforce cue 2 more sessions,
          then layer constraint drill (tee-peg gate).
        </div>
      </div>

      {/* Homework */}
      <div style={{
        background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
        padding: '12px 14px',
      }}>
        <div style={{
          fontFamily: F.brand, fontSize: 12, fontWeight: 500, color: C.ink,
          marginBottom: 6,
        }}>Homework</div>
        <ul style={{
          fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.6,
          margin: 0, paddingLeft: 18,
        }}>
          <li>50 balls, 7-iron only, ground-pressure feel, 3x this week</li>
          <li>70% effort max — focus on feel, not distance</li>
          <li>Note divot start position relative to ball</li>
        </ul>
      </div>

      {/* What NOT to change */}
      <div style={{
        background: C.elevated, borderRadius: 8, padding: '10px 14px',
        border: `1px solid ${C.borderSub}`,
      }}>
        <div style={{
          fontFamily: F.data, fontSize: 7, fontWeight: 700,
          letterSpacing: '.08em', color: C.dim, marginBottom: 4,
          textTransform: 'uppercase',
        }}>Leave Alone (Coach Decision)</div>
        <div style={{
          fontFamily: F.brand, fontSize: 10, color: C.muted, lineHeight: 1.5,
        }}>
          Strong grip producing reliable draw shape — this is a feature, not a fault.
          Do NOT discuss shaft lean or hand position directly with this player.
        </div>
      </div>

      {/* Next session */}
      <div style={{
        background: C.surface, borderRadius: 10, border: `1px solid ${C.accent}18`,
        padding: '12px 14px',
      }}>
        <div style={{
          fontFamily: F.data, fontSize: 8, fontWeight: 700,
          letterSpacing: '.08em', color: C.accent, textTransform: 'uppercase',
          marginBottom: 6,
        }}>Next Session Preview</div>
        <div style={{
          fontFamily: F.brand, fontSize: 11, color: C.body, lineHeight: 1.6,
        }}>
          If cue retention holds: introduce tee-peg gate drill to build pattern without
          conscious reliance. If regression: continue ground-pressure work with refined
          language ("sole brushes forward" vs "press the ground").
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN — Collapsible Looper Intelligence Panel
// ═══════════════════════════════════════════════════════════════════

export default function LooperIntelPanel({ activeShot, collapsed, onToggle }: {
  activeShot: TrackmanShot;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [activeTab, setActiveTab] = useState<PanelTab>('insights');

  // Collapsed state — thin branded strip
  if (collapsed) {
    return (
      <div style={{
        width: 36, display: 'flex', flexDirection: 'column',
        background: C.surface, borderLeft: `1px solid ${C.border}`,
        alignItems: 'center', flexShrink: 0,
      }}>
        <button onClick={onToggle} style={{
          padding: '10px 0', border: 'none', cursor: 'pointer',
          background: 'transparent', color: C.accent,
        }}>
          <ChevronLeft size={14} />
        </button>
        <div style={{
          writingMode: 'vertical-rl', textOrientation: 'mixed',
          fontFamily: F.brand, fontSize: 10, fontWeight: 800,
          letterSpacing: '.05em', color: C.ink, marginTop: 8,
        }}>
          <span>LOOPER</span>
          <span style={{ color: C.accent }}>.AI</span>
        </div>
        <div style={{
          writingMode: 'vertical-rl', textOrientation: 'mixed',
          fontFamily: F.data, fontSize: 7, color: C.muted,
          marginTop: 12, letterSpacing: '.04em',
        }}>COACHING LAYER</div>
        {/* Pulsing dot */}
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: C.accent, marginTop: 16,
          animation: 'pulse 2s infinite',
        }} />
      </div>
    );
  }

  // Expanded panel
  return (
    <div style={{
      flex: '1 1 32%', maxWidth: 420, minWidth: 280,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', borderLeft: `1px solid ${C.border}`,
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '8px 12px', borderBottom: `1px solid ${C.border}`,
        background: C.confBg, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontFamily: F.brand, fontSize: 11, fontWeight: 800,
            letterSpacing: '.05em', color: C.ink,
          }}>LOOPER</span>
          <span style={{
            fontFamily: F.brand, fontSize: 11, fontWeight: 800,
            letterSpacing: '.05em', color: C.accent,
          }}>.AI</span>
          <span style={{
            fontFamily: F.data, fontSize: 7, color: C.muted,
            letterSpacing: '.04em',
          }}>COACHING LAYER</span>
        </div>
        <button onClick={onToggle} style={{
          padding: '2px 4px', border: 'none', cursor: 'pointer',
          background: 'transparent', color: C.muted,
        }}>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{
        display: 'flex', borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        {PANEL_TABS.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '6px 4px', border: 'none', cursor: 'pointer',
              background: 'transparent',
              borderBottom: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
              fontFamily: F.brand, fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? C.ink : C.muted,
              transition: 'all 0.15s',
            }}>{tab.label}</button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 12px',
      }}>
        {activeTab === 'brief' && <BriefTab />}
        {activeTab === 'insights' && <InsightsTab activeShot={activeShot} />}
        {activeTab === 'capture' && <CaptureTab />}
        {activeTab === 'diagnosis' && <DiagnosisTab />}
        {activeTab === 'plan' && <PlanTab />}
      </div>
    </div>
  );
}
