import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import { CD, F, PHASES, STEPS, type Phase } from './tokens';
import ThinkingIndicator from './ThinkingIndicator';
import InsightCard from './InsightCard';
import DrillSuggestionCard from './DrillSuggestionCard';
import ChatPanel, { type ChatMsg } from './ChatPanel';

/** Phase indicator dots + labels */
function PhaseIndicator({ currentPhase, visitedPhases }: { currentPhase: Phase; visitedPhases: Set<Phase> }) {
  return (
    <div style={{
      height: 32, display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 16px', borderBottom: `1px solid ${CD.border}`,
    }}>
      {PHASES.map(({ key, label }) => {
        const isCurrent = key === currentPhase;
        const isPast = visitedPhases.has(key) && !isCurrent;
        const color = isCurrent ? CD.accent : isPast ? CD.muted : CD.dim;
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, transition: 'all 300ms ease' }}>
            <span style={{
              width: isCurrent ? 8 : 6, height: isCurrent ? 8 : 6,
              borderRadius: '50%', flexShrink: 0,
              background: isCurrent || isPast ? color : 'transparent',
              border: isCurrent || isPast ? 'none' : `1.5px solid ${color}`,
              transition: 'all 300ms ease',
            }} />
            <span style={{
              fontFamily: F.data, fontSize: 10, color,
              transition: 'color 300ms ease',
            }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Top bar with back arrow, LOOPER.AI wordmark, session number, live indicator */
function TopBar() {
  return (
    <div style={{
      height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', borderBottom: `1px solid ${CD.border}`, background: '#0E1319',
      borderRadius: '16px 16px 0 0',
    }}>
      {/* Back + Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          to="/coach"
          style={{ color: CD.muted, display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = CD.body; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = CD.muted; }}
        >
          <ChevronLeft size={16} />
        </Link>
        <span style={{
          fontFamily: F.brand, fontSize: 12, fontWeight: 800, color: CD.ink,
          letterSpacing: '0.05em',
        }}>
          LOOPER<span style={{ color: CD.accent }}>.AI</span>
        </span>
      </div>

      {/* Session + Live */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: F.data, fontSize: 10, color: CD.muted }}>S9</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: CD.accent,
            boxShadow: `0 0 4px ${CD.accent}`,
            animation: 'sidebarPulse 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: F.data, fontSize: 7, color: CD.accent, letterSpacing: '0.08em' }}>
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
}

/** Step 2 quiet state: shot counter + muted pulse */
function QuietContent(_props: { isActive: boolean; hasVisited: boolean }) {
  return (
    <div style={{
      background: CD.surface, borderRadius: 6, padding: '14px 12px',
      marginBottom: 8,
    }}>
      <div style={{ fontFamily: F.brand, fontSize: 13, color: CD.body, marginBottom: 4 }}>
        Observing... 3 shots captured.
      </div>
      <div style={{ fontFamily: F.data, fontSize: 12, color: CD.muted, marginBottom: 8 }}>
        Waiting for stable pattern.
      </div>
      <div style={{ fontFamily: F.data, fontSize: 10, color: CD.muted }}>
        3 / ~8 needed
      </div>
    </div>
  );
}

/** Step 7 summary content */
function SummaryContent(_props: { isActive: boolean; hasVisited: boolean }) {
  const navigate = useNavigate();
  const step = STEPS[6];
  return (
    <>
      {/* Summary card */}
      <div style={{
        background: CD.surface, borderLeft: `3px solid ${CD.accent}`,
        borderRadius: 6, padding: '10px 12px', marginBottom: 8,
      }}>
        <div style={{ fontFamily: F.brand, fontSize: 14, fontWeight: 500, color: CD.ink, marginBottom: 8 }}>
          Session 9 complete &mdash; 14 shots analyzed
        </div>
        {step.summaryBullets?.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: CD.accent,
              marginTop: 6, flexShrink: 0,
            }} />
            <span style={{ fontFamily: F.brand, fontSize: 13, lineHeight: 1.5, color: CD.body }}>
              {b}
            </span>
          </div>
        ))}
      </div>

      {/* Carry-forward */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: F.data, fontSize: 10, color: CD.muted,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 8,
        }}>
          FOR NEXT SESSION
        </div>
        {step.carryForward?.map((cf, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 3, height: 14, background: CD.accent, borderRadius: 1,
              flexShrink: 0, marginTop: 2,
            }} />
            <span style={{ fontFamily: F.brand, fontSize: 13, lineHeight: 1.5, color: CD.body }}>
              {cf}
            </span>
          </div>
        ))}
      </div>

      {/* Generate Practice Plan button */}
      <button style={{
        width: '100%', padding: '10px 0',
        fontFamily: F.brand, fontSize: 13, fontWeight: 600,
        background: CD.accent, color: CD.bg,
        border: 'none', borderRadius: 6, cursor: 'pointer',
        marginBottom: 8,
      }}>
        Generate Practice Plan
      </button>

      {/* Create Lesson Summary CTA */}
      <button
        onClick={() => navigate('/coach/review')}
        style={{
          width: '100%', padding: '12px 0',
          fontFamily: F.brand, fontSize: 14, fontWeight: 500,
          background: '#10B981', color: '#FFFFFF',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#0EA472'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#10B981'; }}
      >
        <FileText size={16} />
        Create Lesson Summary
      </button>
    </>
  );
}

/** Looper sidebar container */
export default function LooperSidebar({
  currentStep,
  visitedSteps,
  chatMessages,
  onChipClick,
}: {
  currentStep: number;
  visitedSteps: Set<number>;
  chatMessages: ChatMsg[];
  onChipClick: (chip: string) => void;
}) {
  const step = STEPS[currentStep];
  const isActive = true; // always active for current step
  const hasVisited = visitedSteps.has(currentStep) && currentStep !== Math.max(...visitedSteps);

  // Build set of visited phases
  const visitedPhases = new Set<Phase>();
  visitedSteps.forEach((s) => visitedPhases.add(STEPS[s].phase));

  return (
    <div style={{
      width: 'var(--sidebar-w)',
      flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: CD.bg,
      overflow: 'hidden',
    }}>
      <TopBar />
      <PhaseIndicator currentPhase={step.phase} visitedPhases={visitedPhases} />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {/* Thinking indicator */}
        {step.thinkingText && (
          <ThinkingIndicator text={step.thinkingText} isActive={isActive && !hasVisited} speed={step.thinkingSpeed} />
        )}

        {/* Step-specific content */}
        {currentStep === 1 ? (
          <QuietContent isActive={isActive} hasVisited={hasVisited} />
        ) : currentStep === 6 ? (
          <SummaryContent isActive={isActive} hasVisited={hasVisited} />
        ) : currentStep === 5 && step.drills ? (
          <>
            {/* Phase transition callout */}
            <div style={{
              fontFamily: F.brand, fontSize: 11, color: CD.accent,
              marginBottom: 8, opacity: hasVisited ? 0 : 1,
              animation: hasVisited ? undefined : 'fadeOut 2s 2s forwards',
            }}>
              Analysis complete. Suggesting intervention.
            </div>
            {step.drills.map((d) => (
              <DrillSuggestionCard key={d.name} drill={d} isActive={isActive} hasVisited={hasVisited} />
            ))}
            {/* Alternative drill */}
            {step.altDrill && (
              <div style={{
                background: CD.surface, borderRadius: 6, padding: '10px 12px',
                marginBottom: 8, opacity: 0.7,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: F.brand, fontSize: 13, fontWeight: 500, color: CD.ink, marginBottom: 2 }}>
                      {step.altDrill.name}
                    </div>
                    <span style={{
                      fontFamily: F.data, fontSize: 10, fontWeight: 700,
                      color: CD.accent, background: CD.accentBg,
                      padding: '2px 8px', borderRadius: 99,
                    }}>
                      {step.altDrill.type}
                    </span>
                  </div>
                  <span style={{ fontFamily: F.data, fontSize: 11, color: CD.muted }}>
                    {step.altDrill.confidence}%
                  </span>
                </div>
                <div style={{ fontFamily: F.brand, fontSize: 12, color: CD.body, marginTop: 6 }}>
                  {step.altDrill.description}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Steps 0, 2, 3, 4: Insight cards */
          step.cards.map((card, i) => {
            const isDimmed = currentStep >= 3 && currentStep <= 4 && i < step.cards.length - 1;
            return (
              <InsightCard
                key={card.id + '-' + currentStep}
                card={card}
                isActive={isActive}
                hasVisited={hasVisited || isDimmed}
                dimmed={isDimmed}
              />
            );
          })
        )}

        {/* Confidence arc label for analysis steps */}
        {currentStep >= 2 && currentStep <= 4 && step.cards.length > 0 && (
          <div style={{
            fontFamily: F.data, fontSize: 12, color: CD.muted,
            padding: '4px 0', textAlign: 'center',
          }}>
            {currentStep === 2 ? 'Forming hypothesis...'
              : currentStep === 3 ? `Building confidence... ${step.cards[step.cards.length - 1].confidence}%`
              : `High confidence: ${step.cards[step.cards.length - 1].confidence}%`}
          </div>
        )}
      </div>

      {/* Chat panel */}
      <ChatPanel
        messages={chatMessages}
        chips={step.chips}
        onChipClick={onChipClick}
      />
    </div>
  );
}
