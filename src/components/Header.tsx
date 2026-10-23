import anime from 'animejs';
import { useEffect, useRef } from 'react';
import { nav, profile } from '../data/profile';
import { rooms, roomVars } from '../data/rooms';
import { sections } from '../data/sections';
import EmailButton from './EmailButton';
import HeroCanvas from './HeroCanvas';
import HologramPhoto from './HologramPhoto';
import RoomStrip from './RoomStrip';

export default function Header() {
  const nameRef  = useRef<HTMLHeadingElement>(null);
  const statRef  = useRef<HTMLDivElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const navRef   = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    anime({
      targets: nameRef.current,
      opacity: [0, 1],
      translateY: [32, 0],
      duration: 900,
      easing: 'easeOutExpo',
      delay: 150,
    });
    anime({
      targets: statRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 750,
      easing: 'easeOutExpo',
      delay: 450,
    });
    anime({
      targets: bodyRef.current,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700,
      easing: 'easeOutCubic',
      delay: 600,
    });
    anime({
      targets: linksRef.current ? Array.from(linksRef.current.children) : [],
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 450,
      easing: 'easeOutCubic',
      delay: anime.stagger(70, { start: 750 }),
    });
    anime({
      targets: navRef.current ? Array.from((navRef.current.querySelector('ul') as HTMLUListElement)?.children ?? []) : [],
      opacity: [0, 1],
      translateY: [10, 0],
      scale: [0.96, 1],
      duration: 400,
      easing: 'easeOutCubic',
      delay: anime.stagger(60, { start: 950 }),
    });
  }, []);

  return (
    <header className="relative overflow-hidden border-b border-rule">
      <HeroCanvas className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent pointer-events-none" />
      {/* Left column text guard — dims Earth texture behind copy */}
      <div className="absolute inset-y-0 left-0 w-3/5 pointer-events-none"
           style={{ background: 'linear-gradient(to right, rgba(11,11,18,0.6) 0%, rgba(11,11,18,0.2) 70%, transparent 100%)' }} />

      <div className="relative px-6 pt-16 pb-12 sm:px-10 lg:px-16 xl:px-24 sm:pt-24">

        {/* Two-column hero: content left, open canvas right */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: all copy */}
          <div>
            <RoomStrip className="mb-5 w-48" />

            <h1
              ref={nameRef}
              style={{ opacity: 0, transform: 'translateY(32px)' }}
              className="text-5xl font-bold tracking-tight sm:text-6xl xl:text-7xl"
            >
              {profile.name}
            </h1>

            <p className="mt-3 text-lg text-muted">{profile.tagline}</p>
              <p className="mt-1 mb-6 underline text-sm text-muted">{profile.location} · {profile.status}</p>

            {/* <div
              ref={statRef}
              style={{ opacity: 0, transform: 'translateY(20px)' }}
              className="mt-8 inline-flex items-start gap-4 border border-rule bg-white/[0.03] px-5 py-4"
            >
              <div className="w-1 shrink-0 self-stretch" style={{ background: rooms.devops.color }} />
              <div>
                <p className="text-3xl font-bold font-mono leading-none" style={{ color: rooms.devops.color }}>
                  US$1,300+<span className="ml-1 text-base font-sans font-medium text-muted">/ mo</span>
                </p>
                <p className="mt-1 text-sm text-muted">cut from AWS infrastructure across three client accounts</p>
              </div>
            </div> */}

            <div ref={bodyRef} style={{ opacity: 0, transform: 'translateY(16px)' }}>
              <div className="mt-5 space-y-4">
                {profile.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8">
                <EmailButton />
              </div>
            </div>

            <ul ref={linksRef} className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <li style={{ opacity: 0 }}>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              {profile.links.map((link) => (
                <li key={link.href} style={{ opacity: 0 }}>
                  <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                </li>
              ))}
              <li style={{ opacity: 0 }}>
                <a href="/ntwanano-a-hlungwane-cv.pdf" download>Download CV</a>
              </li>
            </ul>
          </div>

          {/* Right: hologram photo */}
          <div className="hidden lg:flex lg:items-end lg:justify-center">
            <HologramPhoto />
          </div>
        </div>

        {/* Nav — full width below the two-column split */}
        <nav ref={navRef} aria-label={nav.label} className="mt-12">
          <p className="mb-3 text-sm text-muted">{nav.intro}</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {Object.values(sections).map((section) => (
              <li key={section.id} style={{ opacity: 0 }}>
                <a
                  href={`#${section.id}`}
                  style={{ ...roomVars(section.room), borderTopColor: rooms[section.room].color }}
                  className="group relative block h-full overflow-hidden border border-rule border-t-[3px] bg-white/[0.03] px-3 py-2.5 text-sm leading-snug font-medium no-underline transition-all hover:-translate-y-0.5 hover:bg-white/[0.06] motion-reduce:transition-none"
                >
                  <span aria-hidden className="absolute right-2 bottom-2 h-1.5 w-5 bg-(--room) opacity-30 transition-opacity group-hover:opacity-80 group-focus-visible:opacity-80" />
                  {section.title}
                  <span className="block pb-2 text-sm font-normal text-muted">
                    {rooms[section.room].name} {nav.room}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </header>
  );
}
