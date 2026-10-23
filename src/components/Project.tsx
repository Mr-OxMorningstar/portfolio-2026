import type { ReactNode } from 'react';
import { type RoomId, roomVars } from '../data/rooms';

interface ProjectProps {
  title: string;
  period?: string;
  summary: string;
  points: string[];
  stack: string;
  github?: string;
  href?: string;
  room: RoomId;
  children?: ReactNode;
}

export default function Project({ title, period, summary, points, stack, github, href, room, children }: ProjectProps) {
  return (
    <article style={roomVars(room)}>
      <h3 className="border-l-4 border-(--room) pl-3 text-2xl font-semibold tracking-tight">{title}</h3>
      {period && <p className="mt-1 pl-4 text-sm text-muted">{period}</p>}
      <p className="mt-3 max-w-2xl">{summary}</p>
      {children}
      <ul className="mt-6 max-w-2xl list-disc space-y-2 pl-5 marker:text-(--room)">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted">
        <span className="font-medium text-(--room-deep)">Built with:</span> {stack}
      </p>
      <p className="mt-3 flex flex-wrap gap-x-5 text-sm">
        {href && <a href={href} target="_blank" rel="noreferrer">View live</a>}
        {github && <a href={github} target="_blank" rel="noreferrer">View on GitHub</a>}
      </p>
    </article>
  );
}
