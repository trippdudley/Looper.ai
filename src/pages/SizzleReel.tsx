import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import brandAnthem from '../assets/audio/Legacy in Motion.mp3';
import Scene0_Thesis from '../components/sizzle/Scene0_Thesis';
import Scene1_Problem from '../components/sizzle/Scene1_Problem';
import Scene2_SolutionEndgame from '../components/sizzle/Scene2_SolutionEndgame';
import Scene3_PlayerRecord from '../components/sizzle/Scene2_PlayerRecord';
import Scene4_LiveSession from '../components/sizzle/Scene3_LiveSession';
import Scene5_Summary from '../components/sizzle/Scene4_Summary';
import Scene6_Close from '../components/sizzle/Scene5_Close';
import { C } from '../components/sizzle/tokens';

const SCENES = [
  { duration: 8000,  Component: Scene0_Thesis },
  { duration: 14000, Component: Scene1_Problem },
  { duration: 20000, Component: Scene2_SolutionEndgame },
  { duration: 31000, Component: Scene4_LiveSession },
  { duration: 14000, Component: Scene5_Summary },
  { duration: 16000, Component: Scene3_PlayerRecord },
  { duration: 6000,  Component: Scene6_Close },
];

const TOTAL_DURATION = SCENES.reduce((sum, s) => sum + s.duration, 0);
const CROSSFADE_MS = 400;

export default function SizzleReel() {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef(0);
  const sceneStartRef = useRef(0);
  const rafRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tick = useCallback(() => {
    const now = Date.now();
    const total = now - startRef.current;
    const sceneTime = now - sceneStartRef.current;
    setTotalElapsed(total);
    setSceneElapsed(sceneTime);

    // Check if we need to transition
    const sceneDuration = SCENES[currentScene]?.duration ?? 0;
    if (sceneTime >= sceneDuration && currentScene < SCENES.length - 1) {
      // Start crossfade
      setTransitioning(true);
      const transStart = now;
      const nextScene = currentScene + 1;

      const crossfadeTick = () => {
        const p = Math.min(1, (Date.now() - transStart) / CROSSFADE_MS);
        setTransitionProgress(p);
        setTotalElapsed(Date.now() - startRef.current);
        // Keep updating scene elapsed for outgoing scene
        setSceneElapsed(Date.now() - sceneStartRef.current);

        if (p < 1) {
          rafRef.current = requestAnimationFrame(crossfadeTick);
        } else {
          // Transition complete
          setCurrentScene(nextScene);
          sceneStartRef.current = Date.now();
          setSceneElapsed(0);
          setTransitioning(false);
          setTransitionProgress(0);
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(crossfadeTick);
      return; // Don't continue normal tick during crossfade
    }

    // Check if reel is done
    if (currentScene === SCENES.length - 1 && sceneTime >= SCENES[currentScene].duration) {
      setDone(true);
      // Fade out audio
      if (audioRef.current) {
        const audio = audioRef.current;
        const fadeOut = () => {
          if (audio.volume > 0.05) {
            audio.volume = Math.max(0, audio.volume - 0.02);
            requestAnimationFrame(fadeOut);
          } else {
            audio.pause();
          }
        };
        fadeOut();
      }
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [currentScene]);

  useEffect(() => {
    startRef.current = Date.now();
    sceneStartRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);

    // Start background music
    if (!audioRef.current) {
      const audio = new Audio(brandAnthem);
      audio.volume = 0.5;
      audio.play().catch(() => {});
      audioRef.current = audio;
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [tick]);

  const stopAndNavigate = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    navigate('/');
  }, [navigate]);

  // Escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopAndNavigate();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stopAndNavigate]);

  const CurrentComponent = SCENES[currentScene]?.Component;
  const NextComponent = transitioning && currentScene < SCENES.length - 1
    ? SCENES[currentScene + 1]?.Component
    : null;

  const progressPct = Math.min(100, (totalElapsed / TOTAL_DURATION) * 100);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#0C1117',
      overflow: 'hidden',
    }}>
      {/* Current scene */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: transitioning ? 1 - transitionProgress : 1,
      }}>
        {CurrentComponent && <CurrentComponent elapsed={sceneElapsed} />}
      </div>

      {/* Next scene (during crossfade) */}
      {transitioning && NextComponent && (
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: transitionProgress,
        }}>
          <NextComponent elapsed={0} />
        </div>
      )}

      {/* Close button */}
      <button
        onClick={stopAndNavigate}
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          zIndex: 10000,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 20,
          fontFamily: "'Space Mono', monospace",
          cursor: 'pointer',
          padding: '4px 8px',
          lineHeight: 1,
        }}
      >
        x
      </button>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 2,
        background: 'rgba(255,255,255,0.06)',
        zIndex: 10000,
      }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          background: C.accent,
          transition: 'width 0.1s linear',
        }} />
      </div>

      {/* End state: exit button */}
      {done && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          pointerEvents: 'none',
        }}>
          <button
            onClick={stopAndNavigate}
            style={{
              pointerEvents: 'auto',
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.4)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '10px 24px',
              borderRadius: 4,
              cursor: 'pointer',
              position: 'absolute',
              bottom: 40,
            }}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
