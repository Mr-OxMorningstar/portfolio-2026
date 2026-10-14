import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Eases a number towards `target`. Holds at `from` until `active`, and jumps straight to the target under reduced motion.
export function useTween(target: number, active: boolean, from = 0, duration = 900): number {
  const [value, setValue] = useState(from);
  const current = useRef(from);

  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      current.current = target;
      setValue(target);
      return;
    }
    const start = current.current;
    const began = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min((now - began) / duration, 1);
      current.current = start + (target - start) * (1 - (1 - t) ** 3);
      setValue(current.current);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}
