import { sideProjects } from '../data/profile';

export default function SideProjects() {
  return (
    <ul className="max-w-2xl space-y-6">
      {sideProjects.map((project) => (
        <li key={project.name}>
          <h3 className="font-semibold text-(--room-deep)">{project.name}</h3>
          <p>{project.summary}</p>
          <p className="text-sm text-muted">{project.stack}</p>
        </li>
      ))}
    </ul>
  );
}
