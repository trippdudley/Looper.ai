import { useState, useEffect, useRef } from 'react';

/** Streams text character-by-character. Returns full text instantly when !isActive (revisited steps). */
export function useStreamingText(
  text: string,
  isActive: boolean,
  speed: number = 18
): { displayed: string; isComplete: boolean } {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive || !text) {
      setIndex(text.length);
      return;
    }
    setIndex(0);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, isActive, speed]);

  return {
    displayed: text.slice(0, index),
    isComplete: index >= text.length,
  };
}
