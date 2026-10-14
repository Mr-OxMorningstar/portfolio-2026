import { useEffect, useRef, useState } from 'react';

// The Office scene, loaded only when it is about to scroll into view.
export default function OfficeView({ caption }: { caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'waiting' | 'ready' | 'failed'>('waiting');

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import('../three/officeScene')
          .then(({ mountOfficeScene }) => {
            if (cancelled) return;
            dispose = mountOfficeScene(container, {
              reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            });
            setStatus('ready');
          })
          .catch(() => setStatus('failed'));
      },
      { rootMargin: '300px' },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      dispose?.();
    };
  }, []);

  return (
    <figure className="mt-6">
      <div
        ref={ref}
        className="relative aspect-[16/10] w-full cursor-grab overflow-hidden bg-[#1b1f26] active:cursor-grabbing"
        role="img"
        aria-label="3D view of three team rooms from The Office: desks with glowing monitors, team boards and room signs."
      >
        {status !== 'ready' && (
          <p className="absolute inset-0 grid place-items-center text-sm text-[#9aa3ad]">
            {status === 'failed' ? 'The 3D view could not load in this browser.' : 'Loading the 3D view…'}
          </p>
        )}
      </div>
      <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}
