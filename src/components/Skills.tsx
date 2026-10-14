import { skills } from '../data/profile';

export default function Skills() {
  return (
    <dl className="grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-[11rem_1fr]">
      {skills.map((group) => (
        <div key={group.name} className="contents">
          <dt className="font-medium text-(--room-deep)">{group.name}</dt>
          <dd className="mb-2 text-muted sm:mb-0">{group.items}</dd>
        </div>
      ))}
    </dl>
  );
}
