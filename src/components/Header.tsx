import { profile } from '../data/profile';
import EmailButton from './EmailButton';

export default function Header() {
  return (
    <header className="pt-16 pb-12 sm:pt-24">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
      <p className="mt-3 text-lg text-muted">{profile.tagline}</p>
      <p className="mt-1 text-muted">
        {profile.location}. {profile.status}
      </p>

      <div className="mt-8 max-w-2xl space-y-4">
        {profile.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8">
        <EmailButton />
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        {profile.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
