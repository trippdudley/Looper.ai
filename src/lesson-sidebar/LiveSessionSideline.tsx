import { useState, useCallback } from 'react';
import { STEPS } from './tokens';
import { type ChatMsg } from './ChatPanel';
import TPSPanel from './TPSPanel';
import LooperSidebar from './LooperSidebar';
import SessionLaunchTransition from './SessionLaunchTransition';
import DemoNav from './DemoNav';
import ExitDemoButton from '../components/ui/ExitDemoButton';

/** CSS keyframes injected once */
const KEYFRAMES = `
  :root { --sidebar-w: 450px; }

  @keyframes sidebarPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  @keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes cardEnter {
    from { transform: translateY(8px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  /* Launch transition phases */
  .launch-modal {
    transition: transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
                width 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
                opacity 300ms ease;
  }

  .launch-modal.phase-a {
    transform: translateX(calc(50vw - var(--sidebar-w) / 2));
    width: var(--sidebar-w);
    opacity: 0;
  }

  .tps-reveal {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
    transition: opacity 600ms ease, clip-path 600ms ease;
  }

  .tps-reveal.visible {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }

  .sidebar-enter {
    opacity: 0;
    transition: opacity 400ms ease;
  }

  .sidebar-enter.visible {
    opacity: 1;
  }
`;

/** Sidebar upgrade: Visible AI Reasoning, TPS wireframe, launch transition */
export default function LiveSessionSideline() {
  const [sessionLaunched, setSessionLaunched] = useState(false);
  const [animPhase, setAnimPhase] = useState<'idle' | 'a' | 'b' | 'c' | 'done'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);

  const handleLaunch = useCallback(() => {
    setSessionLaunched(true);
    setAnimPhase('a');
    setTimeout(() => setAnimPhase('b'), 200);
    setTimeout(() => setAnimPhase('c'), 600);
    setTimeout(() => setAnimPhase('done'), 1200);
  }, []);

  const goToStep = useCallback((next: number) => {
    if (next < 0 || next >= STEPS.length) return;
    setCurrentStep(next);
    setVisitedSteps((prev) => new Set([...prev, next]));
    setChatMessages([]);
  }, []);

  const handleChipClick = useCallback((chip: string) => {
    const step = STEPS[currentStep];
    const response = step.chatResponses[chip];
    if (!response) return;
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: chip },
    ]);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: response, isNew: true },
      ]);
    }, 400);
  }, [currentStep]);

  // Pre-launch state
  if (!sessionLaunched) {
    return (
      <>
        <style>{KEYFRAMES}</style>
        <ExitDemoButton />
        <SessionLaunchTransition onLaunch={handleLaunch} />
      </>
    );
  }

  const tpsVisible = animPhase === 'b' || animPhase === 'c' || animPhase === 'done';
  const sidebarVisible = animPhase === 'c' || animPhase === 'done';

  return (
    <>
      <style>{KEYFRAMES}</style>
      <ExitDemoButton />
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        background: '#060A0F',
        overflow: 'hidden',
      }}>
        {/* Main content row */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* TPS Panel — full bleed, no rounding */}
          <div className={`tps-reveal${tpsVisible ? ' visible' : ''}`} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <TPSPanel />
          </div>

          {/* Looper Sidebar — floating panel with rounded corners */}
          <div
            className={`sidebar-enter${sidebarVisible ? ' visible' : ''}`}
            style={{
              margin: '8px 8px 8px 4px',
              borderRadius: 16,
              border: '2px solid #3A4856',
              boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <LooperSidebar
              currentStep={currentStep}
              visitedSteps={visitedSteps}
              chatMessages={chatMessages}
              onChipClick={handleChipClick}
            />
          </div>
        </div>

        {/* Demo navigation */}
        <DemoNav
          stepIndex={currentStep}
          totalSteps={STEPS.length}
          visitedSteps={visitedSteps}
          onPrev={() => goToStep(currentStep - 1)}
          onNext={() => goToStep(currentStep + 1)}
        />
      </div>
    </>
  );
}
