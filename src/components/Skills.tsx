import { skills } from '../data/profile';

export default function Skills() {
  return (
    <div className="max-w-2xl space-y-6">
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[11rem_1fr]">
        {skills.map((group) => (
          <div key={group.name} className="contents">
            <dt className="font-medium text-(--room-deep)">{group.name}</dt>
            <dd className="mb-2 sm:mb-0">
              <span>{group.items}</span>
              {group.secondary && (
                <span className="text-muted"> · {group.secondary}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted">Primary skills listed first · secondary / also used in grey.</p>
    </div>
  );
}
