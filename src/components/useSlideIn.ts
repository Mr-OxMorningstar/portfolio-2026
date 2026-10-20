import { useEffect, useLayoutEffect, useRef } from 'react';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useSlideIn<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import('animejs').then(({ default: anime }) => {
          anime({
            targets: el,
            opacity: [0, 1],
            translateY: [14, 0],
            delay,
            duration: 650,
            easing: 'easeOutCubic',
          });
        });
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}
