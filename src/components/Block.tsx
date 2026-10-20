import type { ReactNode } from 'react';
import { type RoomId, roomVars } from '../data/rooms';
import { useSlideIn } from './useSlideIn';

export default function Block({ id, title, room, children }: { id: string; title: string; room: RoomId; children: ReactNode }) {
  const headingRef = useSlideIn<HTMLHeadingElement>(0);
  const contentRef = useSlideIn<HTMLDivElement>(120);

  return (
    <section id={id} aria-labelledby={`${id}-title`} style={roomVars(room)} className="relative border-t border-rule pt-10 pb-14">
      <span aria-hidden className="absolute -top-px left-0 h-1 w-16 bg-(--room)" />
      <h2 ref={headingRef} id={`${id}-title`} className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-(--room-deep) uppercase">
        <span aria-hidden className="size-3 bg-(--room)" />
        {title}
      </h2>
      <div ref={contentRef} className="mt-6">{children}</div>
    </section>
  );
}
