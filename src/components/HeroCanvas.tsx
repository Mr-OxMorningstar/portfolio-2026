import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ROOM_COLORS = [0xe0409b, 0x2f6feb, 0x22b86a, 0x7c4dff, 0xf28c1c, 0x14b8b0, 0xf2c21b];
const STAR_COUNT  = 160;
const DOT_COUNT   = 35; // coloured room accent dots

// Earth: large, bottom-left, partially off-screen
const EARTH_POS    = new THREE.Vector3(-9.5, -5.5, -3);
const EARTH_RADIUS = 3.8;

// Orbit: ship starts at South Africa (angle 0.3 rad in the orbit plane puts it
// at the lower-right visible face of the Earth — lat ≈ -30, the SA zone)
const ORBIT_RADIUS   = 4.5;          // > EARTH_RADIUS so ship is outside the surface
const SA_ANGLE       = 0.3;          // starting angle: lower-right of Earth face
const ORBIT_EXTENT   = 0.8;          // radians to sweep before departure (~46°)
const ORBIT_DURATION = 2.0;

// Travel bezier: direct burn across the hero — not a balloon arc
// CP1: departure burn, tangent to orbit at exit point (up-left, away from Earth)
// CP2: cruise correction midway across the screen
const TRAVEL_CP1 = new THREE.Vector3(-5.5, -2.0, -0.8);
const TRAVEL_CP2 = new THREE.Vector3(1.5,  -3.5, -0.2);
const HOLOGRAM   = new THREE.Vector3(5.2,  -5.8,  0.0);
const TRAVEL_DUR = 2.4;

type Phase = 'orbit' | 'travel' | 'arrived';

function cubicBez(t: number, p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, out: THREE.Vector3) {
  const u = 1 - t;
  out.set(
    u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
    u*u*u*p0.z + 3*u*u*t*p1.z + 3*u*t*t*p2.z + t*t*t*p3.z,
  );
}

// Hard burn → fast cruise → sharp engine cut on arrival
function shipEase(t: number): number {
  if (t < 0.4) return (t / 0.4) ** 0.6;          // aggressive acceleration
  if (t > 0.88) return 1 - ((1 - t) / 0.12) ** 2.5 * 0.12; // hard brake
  const mid = (t - 0.4) / 0.48;
  return (0.4 ** 0.6) + mid * (1 - (0.4 ** 0.6) - 0.12);
}

export default function HeroCanvas({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 100);
    camera.position.z = 10;

    // Directional sun + ambient (matches office scene lighting feel)
    const sun = new THREE.DirectionalLight(0xfff0dc, 2.0);
    sun.position.set(8, 5, 10);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x0a0a22, 0.8));

    // ── Stars — small, distant, real-looking ─────────────────────────────
    const starPos  = new Float32Array(STAR_COUNT * 3);
    const starCol  = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i*3]   = (Math.random() - 0.5) * 28;
      starPos[i*3+1] = (Math.random() - 0.5) * 18;
      starPos[i*3+2] = (Math.random() - 0.5) * 3 - 3; // further back
      // 80% near-white, 20% faint star tints
      const tint = Math.random();
      let c: THREE.Color;
      if (tint < 0.15) c = new THREE.Color(0xaaddff); // blue giant
      else if (tint < 0.25) c = new THREE.Color(0xffe8cc); // yellow dwarf
      else c = new THREE.Color(0xffffff);
      const bright = 0.3 + Math.random() * 0.7;
      c.multiplyScalar(bright);
      starCol[i*3] = c.r; starCol[i*3+1] = c.g; starCol[i*3+2] = c.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.9 })));

    // ── Room-colour accent dots (slow drift) ─────────────────────────────
    const dotPos = new Float32Array(DOT_COUNT * 3);
    const dotCol = new Float32Array(DOT_COUNT * 3);
    const dotVel: { vx: number; vy: number }[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      dotPos[i*3]   = (Math.random() - 0.5) * 22;
      dotPos[i*3+1] = (Math.random() - 0.5) * 14;
      dotPos[i*3+2] = (Math.random() - 0.5) * 4;
      const c = new THREE.Color(ROOM_COLORS[Math.floor(Math.random() * ROOM_COLORS.length)]);
      dotCol[i*3] = c.r; dotCol[i*3+1] = c.g; dotCol[i*3+2] = c.b;
      dotVel.push({ vx: (Math.random() - 0.5) * 0.006, vy: (Math.random() - 0.5) * 0.004 });
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    dotGeo.setAttribute('color',    new THREE.BufferAttribute(dotCol, 3));
    const dotMat = new THREE.PointsMaterial({ size: 0.10, vertexColors: true, transparent: true, opacity: 0.65 });
    scene.add(new THREE.Points(dotGeo, dotMat));

    // ── Earth — blue marble, same as The Office war table ────────────────
    const loader   = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 48, 32);
    const earthMat = new THREE.MeshPhongMaterial({
      map:       loader.load('/earth-blue-marble.jpg'),
      bumpMap:   loader.load('/earth-topology.png'),
      bumpScale: 0.04,
      specular:  new THREE.Color(0x0a1a3a),
      shininess: 18,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.copy(EARTH_POS);
    // South Africa faces the viewer with rotation.y ≈ 0.5
    earth.rotation.y = 0.52;
    scene.add(earth);

    // Atmosphere — #4da3ff, same as The Office war table
    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.09, 32, 20);
    const atmosMat = new THREE.MeshPhongMaterial({
      color: 0x4da3ff,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmos = new THREE.Mesh(atmosGeo, atmosMat);
    atmos.position.copy(EARTH_POS);
    scene.add(atmos);

    // ── Spaceship ─────────────────────────────────────────────────────────
    const fuselageGeo = new THREE.CapsuleGeometry(0.042, 0.20, 4, 8);
    const fuselageMat = new THREE.MeshBasicMaterial({ color: 0xd0e0ee });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);

    const cockpitGeo = new THREE.SphereGeometry(0.035, 8, 6);
    const cockpitMat = new THREE.MeshBasicMaterial({ color: 0x4fd4e6 });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.y = 0.13;

    const wingGeo = new THREE.BoxGeometry(0.17, 0.013, 0.065);
    const wingMat = new THREE.MeshBasicMaterial({ color: 0x9ab0c0 });
    const wingL = new THREE.Mesh(wingGeo, wingMat);
    const wingR = wingL.clone();
    wingL.position.set(-0.09, -0.04, 0);
    wingR.position.set( 0.09, -0.04, 0);

    const nozzleGeo = new THREE.CylinderGeometry(0.026, 0.038, 0.055, 8);
    const nozzleMat = new THREE.MeshBasicMaterial({ color: 0x3a4a58 });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.y = -0.15;

    const plumeGeo = new THREE.ConeGeometry(0.038, 0.18, 8);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9 });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.rotation.z = Math.PI;
    plume.position.y = -0.24;

    const ship = new THREE.Group();
    ship.add(fuselage, cockpit, wingL, wingR, nozzle, plume);

    // ── Start position: South Africa on Earth ─────────────────────────────
    // SA is at (ORBIT_RADIUS * cos(SA_ANGLE), ..., ORBIT_RADIUS * sin(SA_ANGLE) * 0.65)
    // relative to Earth center, giving the lower-right visible face (SA latitude zone)
    ship.position.set(
      EARTH_POS.x + ORBIT_RADIUS * Math.cos(SA_ANGLE),
      EARTH_POS.y - ORBIT_RADIUS * 0.22 * Math.sin(SA_ANGLE), // negative Y for southern hemisphere
      EARTH_POS.z + ORBIT_RADIUS * 0.65 * Math.sin(SA_ANGLE),
    );
    scene.add(ship);

    const engLight = new THREE.PointLight(0xfbbf24, 2.5, 2.5);
    scene.add(engLight);

    // ── Trail ─────────────────────────────────────────────────────────────
    const TRAIL = 50;
    const trailBuf = new Float32Array(TRAIL * 3);
    for (let i = 0; i < TRAIL; i++) {
      trailBuf[i*3]   = ship.position.x;
      trailBuf[i*3+1] = ship.position.y;
      trailBuf[i*3+2] = ship.position.z;
    }
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailBuf, 3));
    const trailMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0 });
    scene.add(new THREE.Line(trailGeo, trailMat));

    // ── State ─────────────────────────────────────────────────────────────
    let phase: Phase = 'orbit';
    let phaseTime    = 0;
    let travelFrom   = new THREE.Vector3();
    const prevPos    = new THREE.Vector3();
    const tmpPos     = new THREE.Vector3();
    const UP         = new THREE.Vector3(0, 1, 0);

    const clock = new THREE.Clock();
    let animId: number;

    const dotAttr   = dotGeo.attributes.position as THREE.BufferAttribute;
    const trailAttr = trailGeo.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      phaseTime += dt;

      // Room accent dot drift
      for (let i = 0; i < DOT_COUNT; i++) {
        let x = dotAttr.getX(i) + dotVel[i].vx;
        let y = dotAttr.getY(i) + dotVel[i].vy;
        if (x > 11) x = -11; else if (x < -11) x = 11;
        if (y > 7)  y = -7;  else if (y < -7)  y = 7;
        dotAttr.setXY(i, x, y);
      }
      dotAttr.needsUpdate = true;

      // Earth rotation (real West-to-East)
      earth.rotation.y += 0.0015;
      atmos.rotation.y += 0.0010;

      prevPos.copy(ship.position);

      if (phase === 'orbit') {
        // Orbit from SA (SA_ANGLE) sweeping ORBIT_EXTENT radians
        const t     = Math.min(phaseTime / ORBIT_DURATION, 1);
        const angle = SA_ANGLE + t * ORBIT_EXTENT;
        ship.position.set(
          EARTH_POS.x + ORBIT_RADIUS * Math.cos(angle),
          EARTH_POS.y - ORBIT_RADIUS * 0.22 * Math.sin(angle),
          EARTH_POS.z + ORBIT_RADIUS * 0.65 * Math.sin(angle),
        );
        plume.scale.setScalar(0.5);
        plumeMat.opacity = 0.45;
        trailMat.opacity = 0.12;

        if (t >= 1) {
          phase = 'travel';
          phaseTime = 0;
          travelFrom.copy(ship.position);
        }
      } else if (phase === 'travel') {
        const raw = Math.min(phaseTime / TRAVEL_DUR, 1);
        const t   = shipEase(raw);
        cubicBez(t, travelFrom, TRAVEL_CP1, TRAVEL_CP2, HOLOGRAM, tmpPos);
        ship.position.copy(tmpPos);

        const burn = 1 - raw;
        plume.scale.setScalar(0.55 + burn * 1.3);
        plumeMat.opacity = 0.5 + burn * 0.4;
        engLight.intensity = 2.5 + burn * 2.2;
        trailMat.opacity = 0.5 - raw * 0.3;

        if (raw >= 1) {
          phase = 'arrived';
          phaseTime = 0;
          ship.position.copy(HOLOGRAM);
          trailMat.opacity = 0;
          window.dispatchEvent(new CustomEvent('hologram-ready'));
        }
      } else {
        // Station-keeping hover at hologram base
        ship.position.y = HOLOGRAM.y + Math.sin(phaseTime * 1.5) * 0.06;
        ship.position.x = HOLOGRAM.x + Math.sin(phaseTime * 0.9) * 0.04;
        plume.scale.setScalar(0.15 + Math.abs(Math.sin(phaseTime * 3.5)) * 0.1);
        plumeMat.opacity = 0.22;
        engLight.intensity = 0.7;
        trailMat.opacity = 0;
      }

      // Orient ship nose toward velocity
      const vel = tmpPos.copy(ship.position).sub(prevPos);
      if (vel.length() > 0.0004) ship.quaternion.setFromUnitVectors(UP, vel.normalize());

      engLight.position.copy(ship.position);

      // Shift trail
      for (let i = TRAIL - 1; i > 0; i--) {
        trailBuf[i*3]   = trailBuf[(i-1)*3];
        trailBuf[i*3+1] = trailBuf[(i-1)*3+1];
        trailBuf[i*3+2] = trailBuf[(i-1)*3+2];
      }
      trailBuf[0] = ship.position.x;
      trailBuf[1] = ship.position.y;
      trailBuf[2] = ship.position.z;
      trailAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      [starGeo, dotGeo, earthGeo, atmosGeo, fuselageGeo, cockpitGeo, wingGeo, nozzleGeo, plumeGeo, trailGeo]
        .forEach(g => g.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
