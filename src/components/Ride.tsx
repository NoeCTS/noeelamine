import { useEffect, useRef } from "react";
import type { Frame } from "@/data/frames";

const VIOLET = "#6B3FE4";
const ACID = "#FFE400";
const AMBER = "#FFC000";

/** The route. Drawn once in its own box and scaled to whatever the stage is. */
const ROUTE =
  "M300 0 C300 90 210 130 200 220 C190 310 330 340 340 430 " +
  "C350 520 200 560 200 650 C200 740 360 770 360 860 C360 930 310 960 300 1000";

/**
 * Three views of the same bike, all drawn pointing right so one rotation puts
 * any of them on the path. Stroke only: at this weight a filled drawing reads
 * as a cartoon and an outline reads as a diagram, which is what the flyers are.
 */
function BikeTop() {                       // from above
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="-30" cy="0" rx="15" ry="4.5" />
      <ellipse cx="30" cy="0" rx="15" ry="4.5" />
      <path d="M-30 0 H30" />
      <path d="M8 -13 H8 M8 13 H8" />
      <path d="M8 -13 L8 13" />
      <circle cx="-4" cy="0" r="7.5" />
      <path d="M2 -6 L8 -12 M2 6 L8 12" />
    </g>
  );
}

function BikeFront() {                     // head on
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 26 L0 -6" />
      <ellipse cx="0" cy="20" rx="4.5" ry="15" />
      <path d="M-17 -8 H17" />
      <path d="M-10 -8 L-6 8 M10 -8 L6 8" />
      <path d="M-7 8 H7" />
      <circle cx="0" cy="-20" r="8" />
    </g>
  );
}

function BikeSide() {                      // the one everybody draws
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="-30" cy="14" r="16" />
      <circle cx="30" cy="14" r="16" />
      <path d="M-30 14 L-6 14 L6 -10 L-14 -10 Z" />
      <path d="M-6 14 L30 14 M6 -10 L30 14" />
      <path d="M6 -10 L14 -18 H26" />
      <path d="M-14 -10 L-18 -20" />
      <path d="M-18 -20 L-2 -26 L18 -19" />
      <circle cx="-6" cy="-34" r="8" />
      <path d="M-2 -26 L2 -12 L-6 14" />
    </g>
  );
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** 0 before `a`, 1 after `b`, eased between. */
const ramp = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * The ride. One path down the page; the bike travels it as you scroll, the
 * camera turns from overhead to head on to side across the first third, the two
 * printed colours part to the edges as it turns, and the work arrives one piece
 * at a time for the rest of the descent.
 */
export function Ride({ frames }: { frames: Frame[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const rider = useRef<SVGGElement>(null);
  const top = useRef<SVGGElement>(null);
  const front = useRef<SVGGElement>(null);
  const side = useRef<SVGGElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current, p = path.current, g = rider.current;
    if (!el || !p || !g) return;
    const len = p.getTotalLength();

    const draw = (progress: number) => {
      // the route lays itself down behind the rider
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len * (1 - clamp(progress * 1.02))}`;

      // the bike sits on the path and leans into it
      const at = len * clamp(progress);
      const a = p.getPointAtLength(at);
      const b = p.getPointAtLength(Math.min(len, at + 1));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      g.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle})`);

      // overhead, then head on, then side, across the first third
      const toFront = ramp(progress, 0.08, 0.20);
      const toSide = ramp(progress, 0.24, 0.38);
      if (top.current) top.current.style.opacity = `${1 - toFront}`;
      if (front.current) front.current.style.opacity = `${toFront * (1 - toSide)}`;
      if (side.current) side.current.style.opacity = `${toSide}`;

      // The colours begin as two strips either side of the bike and open
      // outward as the camera turns. Scaling from the inner edge means they
      // grow away from the centre rather than arriving from off screen.
      const part = ramp(progress, 0.10, 0.42);
      const k = 0.09 + part * 0.91;
      if (left.current) left.current.style.transform = `scaleX(${k})`;
      if (right.current) right.current.style.transform = `scaleX(${k})`;

      // the work arrives one piece at a time over the rest of the descent
      cards.current.forEach((c, i) => {
        if (!c) return;
        const from = 0.44 + (i * 0.52) / Math.max(1, frames.length);
        const t = ramp(progress, from, from + 0.10);
        c.style.opacity = `${t}`;
        c.style.transform = `translateY(${(1 - t) * 34}px)`;
      });
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) { draw(1); return; }

    let target = 0, current = 0, ticking = false, frame = 0;
    const measure = () => {
      const run = el.offsetHeight - window.innerHeight;
      return run > 0 ? clamp(-el.getBoundingClientRect().top / run) : 0;
    };
    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0004) { current = target; ticking = false; }
      draw(current);
      if (ticking) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = measure();
      if (!ticking) { ticking = true; frame = requestAnimationFrame(tick); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    target = current = measure();
    draw(current);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [frames.length]);

  return (
    <div ref={wrap} className="ride">
      <div className="ride-stage">
        <div ref={left} className="ride-edge is-left" style={{ background: VIOLET }} />
        <div ref={right} className="ride-edge is-right" style={{ background: ACID }} />

        <svg className="ride-svg" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMid meet"
          aria-hidden="true">
          <path ref={path} d={ROUTE} fill="none" stroke={AMBER} strokeWidth="2.5"
            strokeLinecap="round" opacity=".55" />
          <g ref={rider} stroke={AMBER} strokeWidth="3">
            <g ref={top}><BikeTop /></g>
            <g ref={front}><BikeFront /></g>
            <g ref={side} style={{ opacity: 0 }}><BikeSide /></g>
          </g>
        </svg>

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
