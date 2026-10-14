import type { ReactNode } from 'react';

// A titled section of the page, separated from the one above by a rule.
export default function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-rule pt-10 pb-14">
      <h2 id={`${id}-title`} className="text-sm font-medium text-muted">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
