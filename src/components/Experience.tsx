import { jobs } from '../data/profile';

export default function Experience() {
  return (
    <div className="space-y-12">
      {jobs.map((job) => (
        <article key={job.company}>
          <h3 className="text-xl font-semibold">{job.company}</h3>
          <p className="text-sm text-muted">{job.meta}</p>
          <ul className="mt-3 space-y-0.5">
            {job.roles.map((role) => (
              <li key={role.title}>
                {role.title} <span className="text-muted">· {role.period}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 marker:text-muted">
            {job.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
