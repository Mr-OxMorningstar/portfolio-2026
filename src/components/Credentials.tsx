import { badges, courses, education } from '../data/profile';

export default function Credentials() {
  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h3 className="font-semibold text-(--room-deep)">AWS Partner training badges</h3>
        <p className="mt-1 text-muted">
          Earned by passing each course’s assessment. These are AWS Partner training badges, not AWS Certification exams.
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          {badges.map((badge) => (
            <li key={badge.name}>
              <a href={badge.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 no-underline">
                <img src={badge.image} alt="" width={48} height={48} loading="lazy" className="size-12 shrink-0" />
                <span className="text-sm leading-snug">
                  <span className="underline decoration-(--room) decoration-2 underline-offset-4">{badge.name}</span>
                  <span className="block text-muted">{badge.issued}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-(--room-deep)">Education</h3>
        <p className="mt-1">
          {education.name}, {education.school} <span className="text-muted">· {education.period}</span>
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-(--room-deep)">Courses</h3>
        <ul className="mt-2 space-y-1">
          {courses.map((course) => (
            <li key={course.name}>
              {course.name} <span className="text-muted">· {course.issuer}, {course.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
