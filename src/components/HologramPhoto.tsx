import { useEffect, useRef } from 'react';

// Hoodie blue — matches the royal blue on the subject's hoodie
const BLUE = { r: 35, g: 90, b: 210 };
const B = (a: number) => `rgba(${BLUE.r},${BLUE.g},${BLUE.b},${a})`;

// Edge glow in hoodie blue
const HOLO_FILTER = [
  `drop-shadow(0 0 3px ${B(0.85)})`,
  `drop-shadow(0 0 16px ${B(0.35)})`,
  `drop-shadow(0 0 40px ${B(0.15)})`,
].join(' ');

// Rays fanning from base projector: 7 beams, ≈ 160° spread
const RAY_ANGLES = [-70, -45, -22, 0, 22, 45, 70];

export default function HologramPhoto() {
  const wrapRef = useRef<HTMLDivElement>(null);

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
            anime({
              targets: el,
              opacity: [1, 0.9, 0.96, 0.8, 0.95, 1],
              duration: 5000,
              easing: 'easeInOutSine',
              loop: true,
            });
          },
        });
      });
    };

    window.addEventListener('hologram-ready', reveal, { once: true });
    return () => window.removeEventListener('hologram-ready', reveal);
  }, []);

  return (
    <>
      <style>{`
        @keyframes holo-scan {
          0%,85%,100% { background-position: 0 0; }
          87%          { background-position: 0 4px; }
          90%          { background-position: 0 -2px; }
          93%          { background-position: 0 1px; }
        }
      `}</style>

      <div
        ref={wrapRef}
        className="relative w-80 xl:w-96 flex items-end justify-center select-none"
        style={{ minHeight: '520px' }}
      >


        {/* ── Rays: bright at origin, light carried outward, fades ──── */}
        {RAY_ANGLES.map((deg) => {
          const isCenter = deg === 0;
          const isMid    = Math.abs(deg) <= 22;
          const w   = isCenter ? '5px' : isMid ? '3px' : '2px';
          const a0  = isCenter ? 0.90 : isMid ? 0.60 : 0.35; // bright at base
          const a1  = isCenter ? 0.30 : isMid ? 0.12 : 0.05; // mid-fade
          return (
            <div
              key={deg}
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                bottom: 0,
                left: '50%',
                width: w,
                height: '90%',
                // Light carried outward from origin, fades with distance
                background: `linear-gradient(to top, ${B(a0)} 0%, ${B(a1)} 35%, ${B(0.02)} 65%, transparent 100%)`,
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${deg}deg)`,
                zIndex: 1,
              }}
            />
          );
        })}

        {/* Small origin hotspot only — no wide floor puddle */}
        <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
          width: '48px',
          height: '14px',
          background: `radial-gradient(ellipse, rgba(180,210,255,1) 0%, ${B(0.75)} 35%, transparent 72%)`,
          zIndex: 5,
        }} />

        {/* ── Hologram image — NO clip, natural shape, teal energy ─── */}
        <img
          src="/profile.png"
          alt="Ntwanano A Hlungwane"
          className="relative w-full object-contain object-bottom"
          style={{
            maxHeight: '520px',
            zIndex: 3,
            opacity: 0.88,
            // Dissolve feet into projector glow
            WebkitMaskImage: 'linear-gradient(to top, transparent 5%, rgba(0,0,0,0.4) 14%, black 26%)',
            maskImage: 'linear-gradient(to top, transparent 5%, rgba(0,0,0,0.4) 14%, black 26%)',
            filter: HOLO_FILTER,
          }}
          draggable={false}
        />

        {/* ── Scanlines over image ─────────────────────────────────── */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,20,20,0.18) 4px, rgba(0,20,20,0.18) 5px)',
          zIndex: 4,
          animation: 'holo-scan 8s ease-in-out infinite',
        }} />


      </div>
    </>
  );
}
