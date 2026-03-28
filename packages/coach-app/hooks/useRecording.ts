import { useState, useRef, useCallback } from 'react';
import { LessonRecorder, RecordingState, formatDuration } from '@/services/recording';
import { SwingDetector, SwingEvent } from '@/services/swingDetector';

export interface UseRecordingReturn {
  state: RecordingState;
  swings: SwingEvent[];
  durationLabel: string;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<string | null>;
  discard: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

export function useRecording(): UseRecordingReturn {
  const [state, setState] = useState<RecordingState>({
    status: 'idle',
    durationMs: 0,
    fileUri: null,
    error: null,
    metering: null,
  });
  const [swings, setSwings] = useState<SwingEvent[]>([]);

  const recorderRef = useRef<LessonRecorder | null>(null);
  const detectorRef = useRef<SwingDetector | null>(null);

  const handleStateChange = useCallback((newState: RecordingState) => {
    setState(newState);
    // Feed metering data to swing detector
    if (newState.metering != null && detectorRef.current) {
      detectorRef.current.processMeteringDb(newState.metering);
    }
  }, []);

  const ensureRecorder = useCallback(() => {
    if (!recorderRef.current) {
      recorderRef.current = new LessonRecorder(handleStateChange);
    }
    if (!detectorRef.current) {
      detectorRef.current = new SwingDetector((event) => {
        setSwings((prev) => [...prev, event]);
      });
    }
    return recorderRef.current;
  }, [handleStateChange]);

  const requestPermission = useCallback(async () => {
    return ensureRecorder().requestPermission();
  }, [ensureRecorder]);

  const start = useCallback(async () => {
    const recorder = ensureRecorder();
    setSwings([]);
    detectorRef.current?.start();
    await recorder.start();
  }, [ensureRecorder]);

  const pause = useCallback(async () => {
    await recorderRef.current?.pause();
  }, []);

  const resume = useCallback(async () => {
    await recorderRef.current?.resume();
  }, []);

  const stop = useCallback(async () => {
    detectorRef.current?.stop();
    return recorderRef.current?.stop() ?? null;
  }, []);

  const discard = useCallback(async () => {
    detectorRef.current?.stop();
    setSwings([]);
    await recorderRef.current?.discard();
    recorderRef.current = null;
    detectorRef.current = null;
  }, []);

  return {
    state,
    swings,
    durationLabel: formatDuration(state.durationMs),
    start,
    pause,
    resume,
    stop,
    discard,
    requestPermission,
  };
}
