import { useEffect, useRef } from "react";
import {
  AmbientLight, BoxGeometry, BufferGeometry, CatmullRomCurve3, Color, CylinderGeometry,
  DirectionalLight, FogExp2, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  PerspectiveCamera, PlaneGeometry, PointLight, Quaternion, Scene, SphereGeometry,
  TorusGeometry, Vector3, WebGLRenderer,
} from "three";
import type { Frame } from "@/data/frames";

const AMBER = 0xffc000;
const VIOLET = 0x6b3fe4;
const ACID = 0xffe400;
const NIGHT = 0x080602;

const UP = new Vector3(0, 1, 0);
const q = new Quaternion();

/** A unit cylinder re-aimed between two points. Cheap enough to do every frame,
 *  which is what a pedalling leg needs. */
function bone(mat: MeshStandardMaterial, r: number) {
  const m = new Mesh(new CylinderGeometry(r, r, 1, 8), mat);
  m.userData.set = (a: Vector3, b: Vector3) => {
    const d = b.clone().sub(a);
    const len = d.length() || 0.0001;
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.scale.set(1, len, 1);
    m.quaternion.copy(q.setFromUnitVectors(UP, d.divideScalar(len)));
  };
  return m;
}

/** Knee from hip and foot: two bones, the near solution, in the sagittal plane. */
function knee(hip: Vector3, foot: Vector3, thigh: number, shin: number) {
  const d = foot.clone().sub(hip);
  const D = Math.min(thigh + shin - 0.001, Math.max(0.001, d.length()));
  const a = Math.acos(Math.min(1, Math.max(-1, (thigh * thigh + D * D - shin * shin) / (2 * thigh * D))));
  const dir = d.clone().normalize();
  // rotate the hip-to-foot direction by the knee angle, forwards
  const perp = new Vector3(-dir.y, dir.x, 0).normalize();
  return hip.clone()
    .add(dir.multiplyScalar(Math.cos(a) * thigh))
    .add(perp.multiplyScalar(Math.sin(a) * thigh));
}

/**
 * A bicycle with the proportions of one: 700c wheels, a metre of wheelbase, a
 * diamond frame, and a rider bent over the bars the way you are at speed.
 */
function buildBike() {
  const g = new Group();
  const steel = new MeshStandardMaterial({ color: AMBER, metalness: 0.55, roughness: 0.3 });
  const rubber = new MeshStandardMaterial({ color: 0x121009, metalness: 0.05, roughness: 0.9 });
  const body = new MeshStandardMaterial({ color: 0x2b2313, metalness: 0.15, roughness: 0.7 });

  const R = 0.34;
  const rearHub = new Vector3(-0.50, R, 0);
  const foreHub = new Vector3(0.55, R, 0);
  const bb = new Vector3(-0.05, 0.27, 0);
  const seatTop = new Vector3(-0.28, 0.95, 0);
  const headTop = new Vector3(0.36, 0.98, 0);
  const headBot = new Vector3(0.44, 0.70, 0);

  const wheels: Mesh[] = [];
  for (const hub of [rearHub, foreHub]) {
    const w = new Group();
    const tyre = new Mesh(new TorusGeometry(R, 0.028, 8, 40), rubber);
    w.add(tyre);
    w.add(new Mesh(new TorusGeometry(R - 0.045, 0.016, 6, 36), steel));
    for (let i = 0; i < 16; i++) {
      const s = new Mesh(new CylinderGeometry(0.005, 0.005, R * 2 - 0.08, 4), steel);
      s.rotation.z = (i / 16) * Math.PI;
      w.add(s);
    }
    w.add(new Mesh(new SphereGeometry(0.035, 8, 6), steel));
    w.position.copy(hub);
    g.add(w);
    wheels.push(w as unknown as Mesh);
  }

  const tube = (a: Vector3, b: Vector3, r: number) => {
    const m = bone(steel, r); (m.userData.set as (x: Vector3, y: Vector3) => void)(a, b); g.add(m);
  };
  tube(rearHub, bb, 0.022);      // chainstay
  tube(bb, seatTop, 0.026);      // seat tube
  tube(seatTop, rearHub, 0.020); // seatstay
  tube(bb, headBot, 0.030);      // down tube
  tube(seatTop, headTop, 0.026); // top tube
  tube(headBot, headTop, 0.024); // head tube
  tube(headBot, foreHub, 0.020); // fork
  tube(new Vector3(0.34, 1.02, -0.21), new Vector3(0.34, 1.02, 0.21), 0.018); // bars
  g.add(new Mesh(new BoxGeometry(0.22, 0.045, 0.11), body).translateX(-0.30).translateY(1.00)); // saddle

  // cranks and pedals
  const crank = new Group();
  crank.position.copy(bb);
  for (const s of [1, -1]) {
    const arm = new Mesh(new BoxGeometry(0.035, 0.17, 0.02), steel);
    arm.position.set(0, s * 0.085, s * 0.075);
    crank.add(arm);
    const pedal = new Mesh(new BoxGeometry(0.09, 0.02, 0.055), body);
    pedal.position.set(0, s * 0.17, s * 0.075);
    crank.add(pedal);
  }
  g.add(crank);

  // the rider, folded over the bars
  const hip = new Vector3(-0.26, 1.06, 0);
  const shoulder = new Vector3(0.12, 1.36, 0);
  const torso = bone(body, 0.10); (torso.userData.set as never as (a: Vector3, b: Vector3) => void)(hip, shoulder);
  g.add(torso);
  g.add(new Mesh(new SphereGeometry(0.115, 12, 10), body).translateX(0.22).translateY(1.44));
  for (const s of [1, -1]) {
    const arm = bone(body, 0.045);
    (arm.userData.set as never as (a: Vector3, b: Vector3) => void)(
      shoulder.clone().setZ(s * 0.11), new Vector3(0.34, 1.02, s * 0.19));
    g.add(arm);
  }
  const legs = [1, -1].map((s) => {
    const thigh = bone(body, 0.055), shin = bone(body, 0.042);
    g.add(thigh); g.add(shin);
    return { s, thigh, shin, hip: hip.clone().setZ(s * 0.09) };
  });

  return { group: g, wheels, crank, legs, bb, R };
}

/**
 * The ride.
 *
 * The campaign was shot at night on long exposures: streaked light, a rider in
 * silhouette, everything moving. This is that, in three dimensions. The bike
 * rides continuously whether or not you scroll — wheels turning at the right
 * rate for the ground speed, cranks driving them, legs following the pedals —
 * and scrolling moves the camera around it: overhead, down to the front, then a
 * quarter turn to run alongside.
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
    scene.fog = new FogExp2(NIGHT, 0.026);
    const camera = new PerspectiveCamera(46, 1, 0.1, 300);
    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    box.appendChild(renderer.domElement);

    const road = new Mesh(new PlaneGeometry(9, 400),
      new MeshStandardMaterial({ color: 0x0e0b05, roughness: 1 }));
    road.rotation.x = -Math.PI / 2; scene.add(road);

    // long exposure: the light either side is a smear, not a lamp
    const streaks: Mesh[] = [];
    for (let i = 0; i < 70; i++) {
      const acid = i % 2 === 0;
      const m = new Mesh(new BoxGeometry(0.09, 0.09, 5 + Math.random() * 12),
        new MeshBasicMaterial({ color: acid ? ACID : VIOLET }));
      m.position.set((acid ? 1 : -1) * (3.2 + Math.random() * 3.6),
        0.15 + Math.random() * 3.2, 24 - Math.random() * 210);
      scene.add(m); streaks.push(m);
    }

    const dashes: Mesh[] = [];
    const dashMat = new MeshBasicMaterial({ color: 0x6b5a2a });
    for (let i = 0; i < 60; i++) {
      const d = new Mesh(new BoxGeometry(0.16, 0.01, 2.2), dashMat);
      d.position.set(0, 0.012, 24 - i * 4);
      scene.add(d); dashes.push(d);
    }

    const curve = new CatmullRomCurve3([
      new Vector3(0, 0, 30), new Vector3(-1.3, 0, 0), new Vector3(1.3, 0, -30),
      new Vector3(-1.1, 0, -60), new Vector3(0.7, 0, -90), new Vector3(0, 0, -120),
    ]);

    const bike = buildBike();
    scene.add(bike.group);

    scene.add(new AmbientLight(0x6a78b8, 0.55));
    const key = new DirectionalLight(0xfff0cc, 1.05); key.position.set(4, 9, 5); scene.add(key);
    const rimL = new PointLight(VIOLET, 26, 16); scene.add(rimL);
    const rimR = new PointLight(ACID, 20, 16); scene.add(rimR);

    // measured once: getLength walks the curve, and it does not change
    const total = Math.max(1, curve.getLength());

    const shot = { phi: 0.30, radius: 17, theta: 0, height: 0, look: 0.9 };
    const at = new Vector3(), ahead = new Vector3(), look = new Vector3(), foot = new Vector3();
    let travelled = 0, crankAngle = 0;

    const frame = (dt: number) => {
      const speed = 7.2;                       // metres a second
      travelled += dt * speed;
      // clamped short of the end: getPointAt(1) indexes past the last control
      // point and the sampler reads a position off an undefined vector
      const t = Math.min(0.9995, Math.max(0, (travelled % total) / total));

      curve.getPointAt(t, at);
      curve.getTangentAt(t, ahead);
      bike.group.position.copy(at);
      bike.group.rotation.y = Math.atan2(ahead.x, ahead.z) - Math.PI / 2;

      // wheels turn at the rate the ground demands, cranks drive them
      const spin = -travelled / bike.R;
      bike.wheels.forEach((w) => { w.rotation.z = spin; });
      crankAngle = spin * 0.32;
      bike.crank.rotation.z = crankAngle;

      // and the legs follow the pedals
      bike.legs.forEach(({ s, thigh, shin, hip }) => {
        const a = crankAngle + (s > 0 ? 0 : Math.PI);
        foot.set(bike.bb.x + Math.cos(a) * 0.17, bike.bb.y + Math.sin(a) * 0.17, s * 0.09);
        const k = knee(hip, foot, 0.42, 0.42);
        (thigh.userData.set as (x: Vector3, y: Vector3) => void)(hip, k);
        (shin.userData.set as (x: Vector3, y: Vector3) => void)(k, foot);
      });

      dashes.forEach((d) => {
        d.position.z += dt * speed;
        if (d.position.z > at.z + 26) d.position.z -= 240;
      });

      // the streaks fly past and wrap round
      streaks.forEach((m) => {
        m.position.z += dt * speed * 1.35;
        if (m.position.z > at.z + 30) m.position.z -= 200;
      });

      const sp = Math.sin(shot.phi), cp = Math.cos(shot.phi);
      camera.position.set(
        at.x + shot.radius * sp * Math.sin(shot.theta) + ahead.x * 0.6,
        shot.radius * cp + shot.height,
        at.z + shot.radius * sp * Math.cos(shot.theta) + ahead.z * 0.6,
      );
      look.set(at.x, shot.look, at.z);
      camera.lookAt(look);
      rimL.position.set(at.x - 2.2, 1.5, at.z + 0.4);
      rimR.position.set(at.x + 2.2, 1.5, at.z + 0.4);
      renderer.render(scene, camera);
    };

    const size = () => {
      const w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    size();

    const ease = (x: number) => x * x * (3 - 2 * x);
    const aim = (p: number) => {
      const a = ease(Math.min(1, p / 0.22));
      const b = ease(Math.min(1, Math.max(0, (p - 0.26) / 0.26)));
      shot.phi = 0.30 + a * 1.18;
      shot.radius = 17 - a * 11.5 - b * 1.6;
      shot.theta = b * (-Math.PI / 2);
      shot.height = a * 0.7;
      shot.look = 0.9 + a * 0.25;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const from = 0.44 + (i * 0.48) / Math.max(1, frames.length);
        const k = ease(Math.min(1, Math.max(0, (p - from) / 0.09)));
        c.style.opacity = `${k}`;
        c.style.transform = `translateY(${(1 - k) * 40}px)`;
      });
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      aim(0.62);
      cards.current.forEach((c) => { if (c) { c.style.opacity = "1"; c.style.transform = "none"; } });
      frame(0.6);
      return () => { renderer.dispose(); box.removeChild(renderer.domElement); };
    }

    let raf = 0, last = performance.now(), visible = true;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (visible) frame(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const onScroll = () => {
      const run = el.offsetHeight - window.innerHeight;
      aim(run > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / run)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", size);
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const m = o as Mesh;
        if (m.geometry) (m.geometry as BufferGeometry).dispose();
        if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
      });
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
