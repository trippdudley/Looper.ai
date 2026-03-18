import { useState, useEffect, useRef } from 'react';

/** Types out `text` character by character at `speed` ms per char. */
export function useTypewriter(text: string, speed = 20, delay = 0): { displayText: string; isDone: boolean } {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayText('');
    setIsDone(false);

    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        idx.current++;
        if (idx.current >= text.length) {
          setDisplayText(text);
          setIsDone(true);
          clearInterval(id);
        } else {
          setDisplayText(text.slice(0, idx.current));
        }
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayText, isDone };
}
