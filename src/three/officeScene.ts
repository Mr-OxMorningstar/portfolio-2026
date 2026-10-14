import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Room code copied unchanged from The Office (src/world/hq, src/live/reports.js).
import { buildRoleRoom, ROLE_ROOMS } from './office/world/hq/team-room.js';

// One row of The Office: the Frontend, Backend and QA team rooms, with sample desk and board states.

const ROOM_IDS = ['frontend', 'backend', 'qa'];

const SAMPLE: Record<string, { description: string; seats: (string | null)[]; working: { name: string; task: string; state: string }[] }> = {
  frontend: {
    description: 'UI code and tests: pages, components, layout and accessibility.',
    seats: ['working', 'thinking', null, 'idle'],
    working: [
      { name: 'frontend-1', task: 'Booking form validation', state: 'working' },
      { name: 'frontend-2', task: 'Quote summary layout', state: 'thinking' },
    ],
  },
  backend: {
    description: 'Server-side code with tests: APIs, services and database changes.',
    seats: ['working', null, null, null],
    working: [{ name: 'backend-1', task: 'Booking RPC re-pricing', state: 'working' }],
  },
  qa: {
    description: 'Reproduces bugs, verifies fixes and reports with evidence.',
    seats: [null, 'waiting', null, null],
    working: [{ name: 'qa-1', task: 'Verify realtime updates', state: 'waiting' }],
  },
};

export interface OfficeSceneOptions {
  reducedMotion: boolean;
}

export function mountOfficeScene(container: HTMLElement, options: OfficeSceneOptions): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x1b1f26);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // The three rooms sit on tiles x 0..17, z 16..21; centre them on the origin.
  const layout = {
    width: 1000, // large, so no room counts as touching an office wall
    depth: 1000,
    tileToWorld: (x: number, z: number) => new THREE.Vector3(x - 8.5, 0, z - 18.5),
  };

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ color: 0x2a323d, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const now = Date.now();
  for (const id of ROOM_IDS) {
    const room = ROLE_ROOMS.find((r) => r.id === id)!;
    const sample = SAMPLE[id];
    const built = buildRoleRoom(layout, room);
    built.setSeats(sample.seats);
    built.setBoard({ role: { description: sample.description }, working: sample.working, blocked: [], done: 3, failed: 0 });
    built.setReports(
      sample.working.map((w, i) => ({ id: `${id}-${i}`, role: room.role, name: w.name, task: w.task, text: '', outcome: 'done', at: now - (i + 1) * 3_600_000 })),
    );
    scene.add(built.group);
  }

  scene.add(new THREE.HemisphereLight(0xfff6e8, 0xb8a990, 1.4));
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.2);
  sun.position.set(8, 18, -10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0005;
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 60 });
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
  camera.position.set(-6, 8.5, 12.5);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.6, 0);
  controls.enableDamping = true;
  controls.enableZoom = false; // keep page scrolling free
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI * 0.45;
  controls.autoRotate = !options.reducedMotion;
  controls.autoRotateSpeed = 0.4;
  controls.update();

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  let onScreen = true;
  const visibility = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
  visibility.observe(container);

  let frame = 0;
  const tick = () => {
    frame = requestAnimationFrame(tick);
    if (!onScreen || document.hidden) return;
    controls.update();
    renderer.render(scene, camera);
  };
  tick();

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibility.disconnect();
    controls.dispose();
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}
