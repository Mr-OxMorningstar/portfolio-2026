import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Room code copied unchanged from The Office (src/world/hq, src/live/reports.js).
import { buildRoleRoom, ROLE_ROOMS, roleRoomSpots } from './office/world/hq/team-room.js';
import { roomBounds } from './office/world/hq/room-parts.js';
import { type RoomId, TOUR_ROOMS } from '../data/rooms';
import { webglAvailable } from './webgl';

// One row of The Office: the Frontend, Backend and QA team rooms, with sample desk and board states.

const SAMPLE: Record<(typeof TOUR_ROOMS)[number], { description: string; seats: (string | null)[]; working: { name: string; task: string; state: string }[] }> = {
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
  // Called with the room the camera is heading for, or null when it is back to free looking (reset or a drag).
  onFocusChange?: (id: RoomId | null) => void;
}

export interface OfficeScene {
  // Flies the camera to a room, or back to the overview when `id` is null.
  focus: (id: RoomId | null) => void;
  dispose: () => void;
}

const SKIN = [0xf1c9a5, 0xd9a577, 0xa8714b, 0x7a4b2d];
const TROUSERS = 0x2a323d;

// A low-poly person seated at a desk, facing it. Typing sets the hands and head moving a little.
function person(chair: THREE.Vector3, facing: number, color: number, skin: number, typing: boolean) {
  const group = new THREE.Group();
  group.position.copy(chair).setY(0);
  group.rotation.y = facing;
  const shirt = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
  const trousers = new THREE.MeshStandardMaterial({ color: TROUSERS, roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 });
  const part = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    group.add(mesh);
    return mesh;
  };
  part(new THREE.CapsuleGeometry(0.17, 0.3, 4, 8), shirt, 0, 0.82, -0.12);
  const head = part(new THREE.SphereGeometry(0.12, 12, 10), skinMat, 0, 1.2, -0.1);
  for (const x of [-0.09, 0.09]) {
    part(new THREE.BoxGeometry(0.12, 0.1, 0.42), trousers, x, 0.52, 0.28);
    part(new THREE.BoxGeometry(0.1, 0.4, 0.1), trousers, x, 0.28, 0.46);
  }
  const hands = [-0.2, 0.2].map((x) => part(new THREE.BoxGeometry(0.08, 0.08, 0.38), shirt, x, 0.9, 0.22));
  return {
    group,
    update(t: number) {
      if (!typing) return;
      head.position.y = 1.2 + Math.sin(t * 2.2) * 0.006;
      hands[0].position.y = 0.9 + Math.sin(t * 14) * 0.012;
      hands[1].position.y = 0.9 + Math.sin(t * 14 + 2) * 0.012;
    },
  };
}

// Returns null when WebGL is not available.
export function mountOfficeScene(container: HTMLElement, options: OfficeSceneOptions): OfficeScene | null {
  if (!webglAvailable()) return null;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
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
  const people: ReturnType<typeof person>[] = [];
  const roomBounding = {} as Record<RoomId, { min: THREE.Vector3; max: THREE.Vector3; centre: THREE.Vector3 }>;
  for (const id of TOUR_ROOMS) {
    const room = ROLE_ROOMS.find((r) => r.id === id)!;
    const sample = SAMPLE[id];
    const built = buildRoleRoom(layout, room);
    built.setSeats(sample.seats);
    built.setBoard({ role: { description: sample.description }, working: sample.working, blocked: [], done: 3, failed: 0 });
    built.setReports(
      sample.working.map((w, i) => ({ id: `${id}-${i}`, role: room.role, name: w.name, task: w.task, text: '', outcome: 'done', at: now - (i + 1) * 3_600_000 })),
    );
    scene.add(built.group);

    roomBounding[id] = roomBounds(layout, room.tiles);
    const seats = roleRoomSpots(layout, room).seats;
    sample.seats.forEach((state, i) => {
      if (!state) return;
      const p = person(seats[i].position, seats[i].facing, room.color, SKIN[(i + id.length) % SKIN.length], state === 'working');
      people.push(p);
      scene.add(p.group);
    });
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

  // Camera flights: ease from where the camera is now to a pose.
  const overview = { position: camera.position.clone(), target: controls.target.clone() };
  let flight: { from: typeof overview; to: typeof overview; began: number } | null = null;
  const FLIGHT_MS = 1100;
  const focus = (id: RoomId | null) => {
    const bounds = id ? roomBounding[id] : null;
    // From the open side of the room, looking at its centre.
    const to = bounds
      ? {
          position: new THREE.Vector3(bounds.centre.x + 1, 3.6, bounds.max.z + 3.2),
          target: new THREE.Vector3(bounds.centre.x, 0.8, bounds.centre.z),
        }
      : { position: overview.position.clone(), target: overview.target.clone() };
    options.onFocusChange?.(id);
    controls.autoRotate = false;
    if (options.reducedMotion) {
      camera.position.copy(to.position);
      controls.target.copy(to.target);
      controls.update();
      return;
    }
    flight = { from: { position: camera.position.clone(), target: controls.target.clone() }, to, began: performance.now() };
  };
  controls.addEventListener('start', () => {
    // The visitor took over.
    flight = null;
    options.onFocusChange?.(null);
  });

  // A click (not a drag) on a room's floor flies to that room.
  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let downAt = { x: 0, y: 0 };
  const onDown = (e: PointerEvent) => (downAt = { x: e.clientX, y: e.clientY });
  const onUp = (e: PointerEvent) => {
    if (e.button !== 0) return;
    if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) return;
    const rect = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1), camera);
    const hit = raycaster.ray.intersectPlane(ground, new THREE.Vector3());
    if (!hit) return;
    const id = TOUR_ROOMS.find((r) => hit.x >= roomBounding[r].min.x && hit.x <= roomBounding[r].max.x && hit.z >= roomBounding[r].min.z && hit.z <= roomBounding[r].max.z);
    if (id) focus(id);
  };
  renderer.domElement.addEventListener('pointerdown', onDown);
  renderer.domElement.addEventListener('pointerup', onUp);

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
    if (flight) {
      const t = Math.min((performance.now() - flight.began) / FLIGHT_MS, 1);
      const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
      camera.position.lerpVectors(flight.from.position, flight.to.position, eased);
      controls.target.lerpVectors(flight.from.target, flight.to.target, eased);
      if (t === 1) flight = null;
    }
    controls.update();
    if (!options.reducedMotion) {
      const seconds = performance.now() / 1000;
      people.forEach((p) => p.update(seconds));
    }
    renderer.render(scene, camera);
  };
  tick();

  const dispose = () => {
    cancelAnimationFrame(frame);
    renderer.domElement.removeEventListener('pointerdown', onDown);
    renderer.domElement.removeEventListener('pointerup', onUp);
    resizeObserver.disconnect();
    visibility.disconnect();
    controls.dispose();
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      for (const m of Array.isArray(material) ? material : material ? [material] : []) {
        const { map, emissiveMap } = m as THREE.MeshStandardMaterial;
        map?.dispose();
        emissiveMap?.dispose();
        m.dispose();
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { focus, dispose };
}
