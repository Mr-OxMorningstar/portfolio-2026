import { useEffect, useRef, useState } from 'react';
import { office } from '../data/profile';
import { type RoomId, rooms, TOUR_ROOMS } from '../data/rooms';
import type { OfficeScene } from '../three/officeScene';

// The Office scene, loaded only when it is about to scroll into view.
export default function OfficeView({ caption }: { caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scene = useRef<OfficeScene>(null);
  const [status, setStatus] = useState<'waiting' | 'ready' | 'failed'>('waiting');
  const [focused, setFocused] = useState<RoomId | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import('../three/officeScene')
          .then(({ mountOfficeScene }) => {
            if (cancelled) return;
            scene.current = mountOfficeScene(container, {
              reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
              onFocusChange: setFocused,
            });
            setStatus(scene.current ? 'ready' : 'failed');
          })
          .catch(() => setStatus('failed'));
      },
      { rootMargin: '300px' },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  return (
    <figure className="mt-6">
      <div
        ref={ref}
        className="relative aspect-[16/10] w-full cursor-grab overflow-hidden bg-[#1b1f26] active:cursor-grabbing"
        role="img"
        aria-label="3D view of three team rooms from The Office: desks with glowing monitors, people at work, team boards and room signs."
      >
        {status !== 'ready' && (
          <p className="absolute inset-0 grid place-items-center text-sm text-[#9aa3ad]">
            {status === 'failed' ? 'The 3D view could not load in this browser.' : 'Loading the 3D view…'}
          </p>
        )}
      </div>
      <div role="group" aria-label="Move the camera" className="mt-3 flex flex-wrap gap-2">
        {TOUR_ROOMS.map((id) => (
          <button
            key={id}
            type="button"
            disabled={status !== 'ready'}
            aria-pressed={focused === id}
            onClick={() => scene.current?.focus(id)}
            style={{ borderColor: rooms[id].color, background: focused === id ? rooms[id].deep : undefined }}
            className="flex cursor-pointer items-center gap-2 border-2 px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-rule disabled:cursor-default disabled:opacity-50 aria-pressed:text-paper"
          >
            <span aria-hidden className="size-2.5" style={{ background: rooms[id].color }} />
            {rooms[id].name}
          </button>
        ))}
        <button
          type="button"
          disabled={status !== 'ready' || focused === null}
          onClick={() => scene.current?.focus(null)}
          className="cursor-pointer border border-rule px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink disabled:cursor-default disabled:opacity-50"
        >
          Reset view
        </button>
      </div>
      <figcaption className="mt-2 text-sm text-muted">{caption} {office.captionHint}</figcaption>
    </figure>
  );
}
