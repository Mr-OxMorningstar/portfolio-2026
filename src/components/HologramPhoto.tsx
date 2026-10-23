import { useEffect, useRef } from 'react';

const BLUE = { r: 35, g: 90, b: 210 };
const B = (a: number) => `rgba(${BLUE.r},${BLUE.g},${BLUE.b},${a})`;

const HOLO_FILTER = [
  `drop-shadow(0 0 3px ${B(0.85)})`,
  `drop-shadow(0 0 16px ${B(0.35)})`,
  `drop-shadow(0 0 40px ${B(0.15)})`,
].join(' ');

const RAY_ANGLES = [-70, -45, -22, 0, 22, 45, 70];

// Random float in [min, max)
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function HologramPhoto() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);
  const ghostRRef = useRef<HTMLImageElement>(null);
  const ghostBRef = useRef<HTMLImageElement>(null);
  const sliceRef  = useRef<HTMLImageElement>(null);

  // Fade-in on hologram-ready
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.opacity = '0';
    const reveal = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.style.opacity = '1';
        return;
      }
      import('animejs').then(({ default: anime }) => {
        anime({
          targets: el,
          opacity: [0, 1],
          duration: 900,
          easing: 'easeOutExpo',
          complete: () => {
            anime({ targets: el, opacity: [1, 0.9, 0.96, 0.8, 0.95, 1], duration: 5000, easing: 'easeInOutSine', loop: true });
          },
        });
      });
    };
    window.addEventListener('hologram-ready', reveal, { once: true });
    return () => window.removeEventListener('hologram-ready', reveal);
  }, []);

  // Random glitch scheduler — fires after a random 1.5–9s wait, plays one burst, repeats
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;

    const fireGlitch = () => {
      const img    = imgRef.current;
      const gR     = ghostRRef.current;
      const gB     = ghostBRef.current;
      const slice  = sliceRef.current;
      if (!img) return;

      // Kick off all glitch animations simultaneously
      [img, gR, gB, slice].forEach(el => {
        if (!el) return;
        el.style.animationPlayState = 'running';
        // Remove and re-add animation to restart it
        const anim = el.dataset.anim ?? '';
        el.style.animation = 'none';
        // Force reflow
        void el.offsetWidth;
        el.style.animation = anim;
      });

      // Schedule next burst at a random interval (1.5s – 9s)
      tid = setTimeout(fireGlitch, rand(1500, 9000));
    };

    // First hit after 1–4 s after component mounts
    tid = setTimeout(fireGlitch, rand(1000, 4000));
    return () => clearTimeout(tid);
  }, []);

  const ANIM_DUR = '0.55s';
  const STEPS    = 'steps(1)';

  return (
    <>
      <style>{`
        @keyframes holo-scan {
          0%,85%,100% { background-position: 0 0; }
          87%          { background-position: 0 4px; }
          90%          { background-position: 0 -2px; }
          93%          { background-position: 0 1px; }
        }

        @keyframes glitch-img {
          0%   { transform:translate(0,0);        filter:var(--hf); }
          20%  { transform:translate(-6px,0);     filter:var(--hf) hue-rotate(26deg) saturate(2.0); }
          35%  { transform:translate(5px,1px);    filter:var(--hf) hue-rotate(-14deg); }
          50%  { transform:translate(-3px,-1px);  filter:var(--hf); }
          65%  { transform:translate(4px,0);      filter:var(--hf) hue-rotate(20deg); }
          80%  { transform:translate(-5px,0);     filter:var(--hf); }
          100% { transform:translate(0,0);        filter:var(--hf); }
        }
        @keyframes glitch-ghost-r {
          0%   { opacity:0;    transform:translate(0,0); }
          20%  { opacity:0.36; transform:translate(8px,0); }
          50%  { opacity:0.12; transform:translate(4px,0); }
          65%  { opacity:0.24; transform:translate(7px,0); }
          85%  { opacity:0; }
          100% { opacity:0;    transform:translate(0,0); }
        }
        @keyframes glitch-ghost-b {
          0%   { opacity:0;    transform:translate(0,0); }
          20%  { opacity:0.30; transform:translate(-8px,0); }
          50%  { opacity:0.09; transform:translate(-3px,0); }
          65%  { opacity:0.22; transform:translate(-7px,0); }
          85%  { opacity:0; }
          100% { opacity:0;    transform:translate(0,0); }
        }
        @keyframes glitch-slice {
          0%,100% { clip-path:none; opacity:0; transform:translate(0,0); }
          30%     { clip-path:inset(32% 0 48% 0); transform:translate(9px,0); opacity:0.65; }
          55%     { clip-path:inset(32% 0 48% 0); transform:translate(-6px,0); opacity:0.45; }
          75%     { opacity:0; }
        }
      `}</style>

      <div
        ref={wrapRef}
        className="relative w-80 xl:w-96 flex items-end justify-center select-none"
        style={{ minHeight: '520px' }}
      >

        {/* ── Light rays: narrow, bright at origin, carry light upward ── */}
        {RAY_ANGLES.map((deg) => {
          const isCenter = deg === 0;
          const isMid    = Math.abs(deg) <= 22;
          const w  = isCenter ? '3px' : isMid ? '2px' : '1px';
          const a0 = isCenter ? 0.90 : isMid ? 0.55 : 0.30;
          const a1 = isCenter ? 0.50 : isMid ? 0.14 : 0.05;
          return (
            <div key={deg} aria-hidden className="absolute pointer-events-none" style={{
              bottom: 0, left: '50%', width: w, height: '90%',
              background: isCenter
                ? `linear-gradient(to top, ${B(a0)} 0%, ${B(a1)} 55%, ${B(0.08)} 78%, transparent 100%)`
                : `linear-gradient(to top, ${B(a0)} 0%, ${B(a1)} 30%, ${B(0.02)} 60%, transparent 100%)`,
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${deg}deg)`,
              zIndex: 1,
            }} />
          );
        })}

        {/* Projector hotspot */}
        <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
          width: '48px', height: '14px',
          background: `radial-gradient(ellipse, rgba(180,210,255,1) 0%, ${B(0.75)} 35%, transparent 72%)`,
          zIndex: 5,
        }} />

        {/* ── Main image — glitch kicked by JS ────────────────────────── */}
        <img
          ref={imgRef}
          src="/profile.png"
          alt="Ntwanano A Hlungwane"
          data-anim={`glitch-img ${ANIM_DUR} ${STEPS} 1 forwards`}
          className="relative w-full object-contain object-bottom"
          style={{
            maxHeight: '520px', zIndex: 3, opacity: 0.88,
            WebkitMaskImage: 'linear-gradient(to top, transparent 5%, rgba(0,0,0,0.4) 14%, black 26%)',
            maskImage:        'linear-gradient(to top, transparent 5%, rgba(0,0,0,0.4) 14%, black 26%)',
            filter: HOLO_FILTER,
            ['--hf' as string]: HOLO_FILTER,
            animation: 'none',
          }}
          draggable={false}
        />

        {/* Red channel ghost */}
        <img
          ref={ghostRRef}
          src="/profile.png"
          aria-hidden
          data-anim={`glitch-ghost-r ${ANIM_DUR} ${STEPS} 1 forwards`}
          className="absolute w-full object-contain object-bottom pointer-events-none"
          style={{
            maxHeight: '520px', bottom: 0, left: 0, zIndex: 4, opacity: 0,
            mixBlendMode: 'screen',
            WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 26%)',
            maskImage:        'linear-gradient(to top, transparent 5%, black 26%)',
            filter: 'saturate(3) hue-rotate(330deg) brightness(1.4)',
            animation: 'none',
          }}
          draggable={false}
        />

        {/* Blue channel ghost */}
        <img
          ref={ghostBRef}
          src="/profile.png"
          aria-hidden
          data-anim={`glitch-ghost-b ${ANIM_DUR} ${STEPS} 1 forwards`}
          className="absolute w-full object-contain object-bottom pointer-events-none"
          style={{
            maxHeight: '520px', bottom: 0, left: 0, zIndex: 4, opacity: 0,
            mixBlendMode: 'screen',
            WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 26%)',
            maskImage:        'linear-gradient(to top, transparent 5%, black 26%)',
            filter: 'saturate(3) hue-rotate(200deg) brightness(1.3)',
            animation: 'none',
          }}
          draggable={false}
        />

        {/* Horizontal slice */}
        <img
          ref={sliceRef}
          src="/profile.png"
          aria-hidden
          data-anim={`glitch-slice ${ANIM_DUR} ${STEPS} 1 forwards`}
          className="absolute w-full object-contain object-bottom pointer-events-none"
          style={{
            maxHeight: '520px', bottom: 0, left: 0, zIndex: 5, opacity: 0,
            WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 26%)',
            maskImage:        'linear-gradient(to top, transparent 5%, black 26%)',
            filter: `${HOLO_FILTER} hue-rotate(30deg)`,
            animation: 'none',
          }}
          draggable={false}
        />

        {/* Scanlines — masked at top so no gray line above the figure */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,20,20,0.15) 4px, rgba(0,20,20,0.15) 5px)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)',
          maskImage:        'linear-gradient(to bottom, transparent 0%, black 18%)',
          zIndex: 6,
          animation: 'holo-scan 8s ease-in-out infinite',
        }} />

      </div>
    </>
  );
}
