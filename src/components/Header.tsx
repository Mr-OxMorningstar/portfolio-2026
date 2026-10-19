import { nav, profile } from '../data/profile';
import { rooms, roomVars } from '../data/rooms';
import { sections } from '../data/sections';
import EmailButton from './EmailButton';
import RoomStrip from './RoomStrip';

export default function Header() {
  return (
    <header className="pt-16 pb-12 sm:pt-24">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
      <RoomStrip className="mt-4 w-56" />
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
        <li>
          <a href="/ntwanano-a-hlungwane-cv.pdf" download>
            Download CV
          </a>
        </li>
      </ul>

      <nav aria-label={nav.label} className="mt-10">
        <p className="mb-2 text-sm text-muted">{nav.intro}</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {Object.values(sections).map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                style={{ ...roomVars(section.room), borderTopColor: rooms[section.room].color }}
                className="group relative block h-full overflow-hidden border border-rule border-t-[6px] bg-white/60 px-3 py-2.5 text-sm leading-snug font-medium no-underline transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
              >
                <span aria-hidden className="absolute right-2 bottom-2 h-1.5 w-5 bg-(--room) opacity-40 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                {section.title}
                <span className="block pb-2 text-sm font-normal text-muted">{rooms[section.room].name} {nav.room}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
