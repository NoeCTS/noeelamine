import { useEffect, useRef } from "react";
import {
  AmbientLight, BufferGeometry, CatmullRomCurve3, Color, CylinderGeometry, DirectionalLight,
  Group, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PointLight, Scene,
  SphereGeometry, TorusGeometry, TubeGeometry, Vector3, WebGLRenderer,
} from "three";
import type { Frame } from "@/data/frames";

const AMBER = 0xffc000;
const VIOLET = 0x6b3fe4;
const ACID = 0xffe400;
const NIGHT = 0x0c0902;

/** A tube between two points, which is every part of a bicycle frame. */
function tube(a: Vector3, b: Vector3, r: number, mat: MeshStandardMaterial) {
  const len = a.distanceTo(b);
  const m = new Mesh(new CylinderGeometry(r, r, len, 10), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return m;
}

/** Wheels, a diamond frame, bars, and someone on top of it. */
function buildBike() {
  const g = new Group();
  const frame = new MeshStandardMaterial({ color: AMBER, metalness: 0.35, roughness: 0.35 });
  const tyre = new MeshStandardMaterial({ color: 0x1a1508, metalness: 0.1, roughness: 0.8 });
  const skin = new MeshStandardMaterial({ color: AMBER, metalness: 0.2, roughness: 0.55 });

  const R = 1.0;
  for (const x of [-1.45, 1.45]) {
    const w = new Mesh(new TorusGeometry(R, 0.075, 10, 44), tyre);
    w.position.set(x, R, 0);
    g.add(w);
    for (let i = 0; i < 12; i++) {                       // spokes
      const s = new Mesh(new CylinderGeometry(0.012, 0.012, R * 2, 5), frame);
      s.position.set(x, R, 0);
      s.rotation.z = (i / 12) * Math.PI;
      g.add(s);
    }
    g.add(new Mesh(new SphereGeometry(0.09, 10, 8), frame).translateX(x).translateY(R));
  }

  const rear = new Vector3(-1.45, R, 0), fore = new Vector3(1.45, R, 0);
  const bb = new Vector3(-0.15, 0.62, 0);                 // bottom bracket
  const seat = new Vector3(-0.6, 1.72, 0);
  const head = new Vector3(0.85, 1.62, 0);
  for (const [a, b] of [[rear, bb], [bb, head], [head, seat], [seat, rear], [bb, fore], [head, fore]] as const)
    g.add(tube(a, b, 0.055, frame));

  g.add(tube(new Vector3(0.95, 1.72, -0.42), new Vector3(0.95, 1.72, 0.42), 0.05, frame)); // bars
  g.add(new Mesh(new SphereGeometry(0.14, 10, 8), frame).translateX(-0.6).translateY(1.78)); // saddle

  const rider = new Group();
  const torso = new Mesh(new CylinderGeometry(0.2, 0.28, 1.0, 12), skin);
  torso.position.set(-0.1, 2.35, 0); torso.rotation.z = 0.5; rider.add(torso);
  rider.add(new Mesh(new SphereGeometry(0.26, 14, 12), skin).translateX(0.4).translateY(2.85));
  rider.add(tube(new Vector3(0.2, 2.6, 0), new Vector3(0.95, 1.8, 0), 0.07, skin));   // arm
  rider.add(tube(new Vector3(-0.35, 2.0, 0), new Vector3(-0.15, 1.1, 0), 0.09, skin)); // thigh
  rider.add(tube(new Vector3(-0.15, 1.1, 0), new Vector3(-0.15, 0.62, 0), 0.07, skin)); // shin
  g.add(rider);

  g.scale.setScalar(0.62);
  return g;
}

/**
 * The ride, in three dimensions.
 *
 * The camera is the thing that moves. It begins directly overhead looking down
 * at the road, drops to eye level in front of the bike, then orbits a quarter
 * turn to run alongside it. Because the bike, the road and the two printed
 * colours are all real geometry, none of that has to be faked: moving the
 * camera moves everything correctly, including the colours, which is what a
 * tilted flat drawing could never do.
 */
export function Ride({ frames }: { frames: Frame[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current, box = host.current;
    if (!el || !box) return;

    const scene = new Scene();
    scene.background = new Color(NIGHT);
    const camera = new PerspectiveCamera(42, 1, 0.1, 400);

    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    box.appendChild(renderer.domElement);

    // the road, and the two colours running either side of it
    const road = new Mesh(new PlaneGeometry(7, 400),
      new MeshStandardMaterial({ color: 0x15100a, roughness: 1 }));
    road.rotation.x = -Math.PI / 2; scene.add(road);
    for (const [x, c] of [[-6.2, VIOLET], [6.2, ACID]] as const) {
      const band = new Mesh(new PlaneGeometry(4.4, 400),
        new MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.45, roughness: 0.9 }));
      band.rotation.x = -Math.PI / 2; band.position.set(x, 0.01, 0); scene.add(band);
    }

    // the route the bike actually takes
    const curve = new CatmullRomCurve3([
      new Vector3(0, 0, 40), new Vector3(-1.6, 0, 14), new Vector3(1.6, 0, -12),
      new Vector3(-1.4, 0, -38), new Vector3(0.6, 0, -64), new Vector3(0, 0, -92),
    ]);
    const line = new Mesh(new TubeGeometry(curve, 240, 0.05, 6, false),
      new MeshStandardMaterial({ color: AMBER, emissive: AMBER, emissiveIntensity: 0.7 }));
    line.position.y = 0.03; scene.add(line);

    const bike = buildBike();
    scene.add(bike);

    scene.add(new AmbientLight(0xffffff, 0.55));
    const key = new DirectionalLight(0xfff2cc, 1.5); key.position.set(6, 12, 6); scene.add(key);
    const rimL = new PointLight(VIOLET, 90, 40); scene.add(rimL);
    const rimR = new PointLight(ACID, 70, 40); scene.add(rimR);

    // camera choreography, in spherical coordinates about the bike
    const shot = { t: 0, radius: 30, phi: 0.06, theta: 0, height: 0, look: 1.2 };
    const pos = new Vector3(), look = new Vector3();

    const frame = () => {
      const at = Math.min(0.999, Math.max(0, shot.t));
      curve.getPointAt(at, pos);
      bike.position.copy(pos);
      const ahead = curve.getTangentAt(at);
      bike.rotation.y = Math.atan2(ahead.x, ahead.z) - Math.PI / 2;

      const sp = Math.sin(shot.phi), cp = Math.cos(shot.phi);
      camera.position.set(
        pos.x + shot.radius * sp * Math.sin(shot.theta),
        shot.radius * cp + shot.height,
        pos.z + shot.radius * sp * Math.cos(shot.theta),
      );
      look.set(pos.x, shot.look, pos.z);
      camera.lookAt(look);
      rimL.position.set(pos.x - 7, 3.5, pos.z + 2);
      rimR.position.set(pos.x + 7, 3.5, pos.z + 2);
      renderer.render(scene, camera);
    };

    const size = () => {
      const w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      frame();
    };
    size();

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, dirty = true;
    const loop = () => { if (dirty) { frame(); dirty = false; } raf = requestAnimationFrame(loop); };

    const set = (p: number) => {
      // overhead, then down to the front, then a quarter turn to the side
      const a = Math.min(1, p / 0.20);                       // the drop
      const b = Math.min(1, Math.max(0, (p - 0.24) / 0.24)); // the turn
      const ease = (x: number) => x * x * (3 - 2 * x);
      const e1 = ease(a), e2 = ease(b);
      shot.phi = 0.06 + e1 * 1.34;
      shot.radius = 30 - e1 * 20.5 - e2 * 2.2;
      shot.theta = e2 * (-Math.PI / 2);
      shot.height = e1 * 1.1;
      shot.look = 1.2 + e1 * 0.4;
      shot.t = Math.max(0, (p - 0.30) / 0.70) * 0.98;
      dirty = true;
    };

    if (still) {
      set(0.62);
      frame();
      cards.current.forEach((c) => c && (c.style.opacity = "1", c.style.transform = "none"));
    } else {
      raf = requestAnimationFrame(loop);
      const onScroll = () => {
        const run = el.offsetHeight - window.innerHeight;
        const p = run > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / run)) : 0;
        set(p);
        cards.current.forEach((c, i) => {
          if (!c) return;
          const from = 0.42 + (i * 0.5) / Math.max(1, frames.length);
          const t = ease01(Math.min(1, Math.max(0, (p - from) / 0.09)));
          c.style.opacity = `${t}`;
          c.style.transform = `translateY(${(1 - t) * 40}px)`;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", size);
      onScroll();
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", size);
        cancelAnimationFrame(raf);
        renderer.dispose();
        scene.traverse((o) => {
          const m = o as Mesh;
          if (m.geometry) (m.geometry as BufferGeometry).dispose();
          if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
        });
        box.removeChild(renderer.domElement);
      };
    }

    return () => {
      renderer.dispose();
      if (renderer.domElement.parentNode === box) box.removeChild(renderer.domElement);
    };
  }, [frames.length]);

  return (
    <div ref={wrap} className="ride">
      <div className="ride-stage">
        <div ref={host} className="ride-canvas" aria-hidden="true" />
        <div className="ride-cards">
          {frames.map((f, i) => (
            <div key={f.n} ref={(n) => { cards.current[i] = n; }}
              className={`ride-card ${i % 2 ? "is-right" : "is-left"}`}>
              <img src={`/frames/${f.n}.jpg`} alt={f.title} loading="lazy" />
              <span>{f.n} · {f.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ease01 = (x: number) => x * x * (3 - 2 * x);
