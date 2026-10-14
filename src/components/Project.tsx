import type { ReactNode } from 'react';

interface ProjectProps {
  title: string;
  period?: string;
  summary: string;
  points: string[];
  stack: string;
  children?: ReactNode;
}

// A write-up of one project: what it is, what is worth noticing in it, and what it is built with.
export default function Project({ title, period, summary, points, stack, children }: ProjectProps) {
  return (
    <article>
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      {period && <p className="mt-1 text-sm text-muted">{period}</p>}
      <p className="mt-3 max-w-2xl">{summary}</p>
      {children}
      <ul className="mt-6 max-w-2xl list-disc space-y-2 pl-5 marker:text-muted">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted">
        <span className="font-medium text-ink">Built with:</span> {stack}
      </p>
    </article>
  );
}
