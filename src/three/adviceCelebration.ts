import * as THREE from 'three';
// Room code copied unchanged from The Office: the colours, and the canvas board used for the team boards.
import { TEAMS } from './office/world/hq/team-room.js';
import { FONT, fitText, wallBoard } from './office/world/hq/room-parts.js';
import { webglAvailable } from './webgl';

// A four second burst of desk monitors and confetti in The Office's room colours, swirling over the page, with the
// visitor's advice pinned to a board from The Office in the middle. Everything is disposed when it ends.

const DURATION = 4;
const PIECES = 380;
const SCREENS = 80; // the first pieces are monitors, the rest confetti
const GRAVITY = -6;
// The board is wide on a landscape screen and tall on a portrait one, so the text stays large on a phone.
const BOARDS = {
  landscape: { width: 3.6, height: 2, canvasWidth: 1152, canvasHeight: 640, title: 68, text: 52, line: 64, lines: 7 },
  portrait: { width: 3, height: 4, canvasWidth: 768, canvasHeight: 1024, title: 64, text: 50, line: 66, lines: 11 },
};
const COLORS: number[] = TEAMS.map((team: { color: number }) => team.color);

export interface CelebrationOptions {
  advice: string;
  // Where the burst starts, as a point in the viewport (the submit button).
  origin: { x: number; y: number };
}

// Splits `text` into lines that fit `max` pixels at the context's current font, breaking long words if needed.
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, maxLines: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    for (const piece of ctx.measureText(word).width > max ? word.match(/.{1,12}/gu)! : [word]) {
      const next = line ? `${line} ${piece}` : piece;
      if (ctx.measureText(next).width <= max) line = next;
      else {
        lines.push(line);
        line = piece;
      }
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] += '…';
  }
  return lines.map((l) => fitText(ctx, l, max));
}

function drawBoard(advice: string, board: typeof BOARDS.landscape) {
  const canvas = document.createElement('canvas');
  canvas.width = board.canvasWidth;
  canvas.height = board.canvasHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fbfaf7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const stripe = canvas.width / COLORS.length;
  COLORS.forEach((color, i) => {
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(i * stripe, 0, stripe + 1, 24);
  });
  ctx.fillStyle = '#18181b';
  ctx.textBaseline = 'top';
  ctx.font = FONT(700, board.title);
  ctx.fillText('Thank you', 56, 64);
  ctx.font = FONT(500, board.text);
  wrap(ctx, advice, canvas.width - 112, board.lines).forEach((line, i) => ctx.fillText(line, 56, 64 + board.title + 36 + i * board.line));
  return canvas;
}

// Returns a function that stops the show early. Does nothing if WebGL is unavailable.
export function playCelebration({ advice, origin }: CelebrationOptions): () => void {
  if (!webglAvailable()) return () => {};
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '60' });
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 4, 8);
  scene.add(key);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  camera.position.z = 10;

  const screens = new THREE.InstancedMesh(new THREE.BoxGeometry(0.55, 0.34, 0.05), new THREE.MeshLambertMaterial(), SCREENS);
  const confetti = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.16, 0.1),
    new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }),
    PIECES - SCREENS,
  );
  const meshes = [screens, confetti];
  meshes.forEach((mesh) => {
    mesh.frustumCulled = false;
    scene.add(mesh);
  });

  const layout = BOARDS[window.innerWidth < window.innerHeight * 0.9 ? 'portrait' : 'landscape'];
  const board = wallBoard(layout.width, layout.height, drawBoard(advice, layout));
  // Unlit, so the board's colours stay true under the lights that shade the pieces.
  const surface = board.surface as THREE.Mesh;
  (surface.material as THREE.Material).dispose();
  surface.material = new THREE.MeshBasicMaterial({ map: board.texture });
  board.group.scale.setScalar(0);
  scene.add(board.group);

  // Half the visible width and height of the z = 0 plane, in world units.
  let halfW = 5;
  let halfH = 5;
  const sizeToViewport = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
  };
  sizeToViewport();
  window.addEventListener('resize', sizeToViewport);

  // Three waves: the submit button first, then both bottom corners.
  const waves = [
    { at: 0, x: (origin.x / window.innerWidth) * 2 - 1, y: 1 - (origin.y / window.innerHeight) * 2, lean: 0 },
    { at: 0.5, x: -1, y: -1, lean: 0.5 },
    { at: 1, x: 1, y: -1, lean: -0.5 },
  ].map((w) => ({ ...w, x: w.x * halfW, y: w.y * halfH }));
  const pieces = Array.from({ length: PIECES }, (_, i) => {
    const wave = waves[i % waves.length];
    const angle = wave.lean + (Math.random() - 0.5) * 1.6;
    const speed = (6 + Math.random() * 6) * Math.min(1, halfH / 5);
    return {
      born: wave.at + Math.random() * 0.2,
      x: wave.x,
      y: wave.y,
      z: -0.8 - Math.random() * 2.4, // always behind the board, so the advice stays readable
      vx: Math.sin(angle) * speed * Math.min(1, halfW / 5),
      vy: Math.cos(angle) * speed,
      spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(14),
      rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      size: i < SCREENS ? 1 : 0.8 + Math.random() * 1.2,
    };
  });
  const color = new THREE.Color();
  pieces.forEach((_, i) => {
    color.setHex(COLORS[i % COLORS.length]);
    (i < SCREENS ? screens : confetti).setColorAt(i < SCREENS ? i : i - SCREENS, color);
  });

  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const began = performance.now();
  let last = began;
  let frame = 0;
  let stopped = false;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', sizeToViewport);
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      (mesh.material as THREE.Material | undefined)?.dispose();
    });
    meshes.forEach((mesh) => mesh.dispose());
    board.texture.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  const tick = (now: number) => {
    const t = (now - began) / 1000;
    if (t >= DURATION) return stop();
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const fade = Math.min(1, (DURATION - t) / 0.7); // everything shrinks away over the last 0.7s

    pieces.forEach((p, i) => {
      const age = t - p.born;
      if (age < 0) {
        matrix.makeScale(0, 0, 0);
      } else {
        // A slow whirlpool around the middle of the screen, on top of gravity and drag.
        p.vx += (-(p.y - halfH * 0.2) * 0.9 - p.vx * 0.7) * dt;
        p.vy += (p.x * 0.9 + GRAVITY - p.vy * 0.7) * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot.x += p.spin.x * dt;
        p.rot.y += p.spin.y * dt;
        p.rot.z += p.spin.z * dt;
        quaternion.setFromEuler(p.rot);
        position.set(p.x, p.y, p.z);
        scale.setScalar(p.size * Math.min(1, age * 8) * fade);
        matrix.compose(position, quaternion, scale);
      }
      (i < SCREENS ? screens : confetti).setMatrixAt(i < SCREENS ? i : i - SCREENS, matrix);
    });
    meshes.forEach((mesh) => (mesh.instanceMatrix.needsUpdate = true));

    // The board spins in with a little overshoot, holds, then shrinks away with the rest.
    const intro = THREE.MathUtils.clamp((t - 0.4) / 0.7, 0, 1);
    const grow = 1 + 2.7 * (intro - 1) ** 3 + 1.7 * (intro - 1) ** 2;
    // The board is the hero: as large as fits, centred.
    const fit = Math.min((halfW * 2 * 0.88) / layout.width, (halfH * 2 * 0.6) / layout.height);
    board.group.scale.setScalar(Math.max(grow, 0) * fit * fade);
    board.group.rotation.y = (1 - intro) * Math.PI * 2;
    board.group.position.y = Math.sin(t * 2) * 0.08;

    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(tick);

  return stop;
}
