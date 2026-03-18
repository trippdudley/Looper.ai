import { useState, useEffect, useRef } from 'react';

/** Animates a number from 0 to `end` over `duration` ms. */
export function useCountUp(end: number, duration = 1200, startOnMount = true): number {
  const [value, setValue] = useState(startOnMount ? 0 : end);
  const startTime = useRef<number | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!startOnMount) return;
    startTime.current = null;
    const step = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [end, duration, startOnMount]);

  return value;
}
