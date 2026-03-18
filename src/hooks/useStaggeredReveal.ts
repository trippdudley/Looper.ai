import { useState, useEffect } from 'react';

/** Returns how many items should be visible, staggering by `interval` ms. */
export function useStaggeredReveal(total: number, interval = 300, delay = 0): number {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (total === 0) return;
    const timeout = setTimeout(() => {
      let count = 0;
      const id = setInterval(() => {
        count++;
        setVisible(count);
        if (count >= total) clearInterval(id);
      }, interval);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timeout);
  }, [total, interval, delay]);

  return visible;
}
