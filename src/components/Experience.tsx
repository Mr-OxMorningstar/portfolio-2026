import { jobs } from '../data/profile';

export default function Experience() {
  return (
    <div className="space-y-12">
      {jobs.map((job) => (
        <article key={job.company}>
          <h3 className="border-l-4 border-(--room) pl-3 text-xl font-semibold">{job.company}</h3>
          <p className="pl-4 text-sm text-muted">{job.meta}</p>
          <ul className="mt-3 space-y-0.5">
            {job.roles.map((role) => (
              <li key={role.title}>
                {role.title} <span className="text-muted">· {role.period}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 marker:text-(--room)">
            {job.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {job.projects && (
            <p className="mt-3 flex flex-wrap gap-x-5 text-sm">
              {job.projects.map((p) => (
                <a key={p.href} href={p.href} target="_blank" rel="noreferrer">{p.name}</a>
              ))}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
