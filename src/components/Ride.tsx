import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Frame } from "@/data/frames";

gsap.registerPlugin(ScrollTrigger);

const VIOLET = "#6B3FE4";
const ACID = "#FFE400";
const AMBER = "#FFC000";

/** The route, drawn in its own 600x1400 box and scaled to the stage. */
const ROUTE =
  "M300 0 C300 120 190 180 180 300 C170 420 340 470 350 600 " +
  "C360 730 180 790 180 920 C180 1050 350 1090 350 1220 C350 1330 305 1370 300 1400";

/**
 * Three views of the same bike, all pointing right so one rotation puts any of
 * them on the path. Stroke only: at this weight a filled drawing reads as a
 * cartoon and an outline reads as a diagram, which is what the flyers are.
 */
const Top = () => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="-34" cy="0" rx="17" ry="5" />
    <ellipse cx="34" cy="0" rx="17" ry="5" />
    <path d="M-34 0 H34" />
    <path d="M9 -15 L9 15" />
    <circle cx="-5" cy="0" r="8.5" />
    <path d="M2 -7 L9 -14 M2 7 L9 14" />
  </g>
);

const Front = () => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 30 L0 -7" />
    <ellipse cx="0" cy="23" rx="5" ry="17" />
    <path d="M-19 -9 H19" />
    <path d="M-11 -9 L-7 9 M11 -9 L7 9" />
    <path d="M-8 9 H8" />
    <circle cx="0" cy="-23" r="9" />
  </g>
);

const Side = () => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="-34" cy="16" r="18" />
    <circle cx="34" cy="16" r="18" />
    <path d="M-34 16 L-7 16 L7 -11 L-16 -11 Z" />
    <path d="M-7 16 L34 16 M7 -11 L34 16" />
    <path d="M7 -11 L16 -20 H29" />
    <path d="M-16 -11 L-20 -23" />
    <path d="M-20 -23 L-2 -30 L20 -22" />
    <circle cx="-7" cy="-39" r="9" />
    <path d="M-2 -30 L3 -14 L-7 16" />
  </g>
);

/**
 * The ride.
 *
 * The camera is real rather than implied: the whole scene is a plane in CSS 3D,
 * and the sequence tilts it up from overhead to level, then swings it round to
 * the side. Everything on the plane — the route, the two printed colours, the
 * bike — moves together, which is what makes it read as one camera rather than
 * as several things animating at once.
 *
 * GSAP drives it because this is a timeline, not a value: six moves that have to
 * overlap in a particular order and stay in step with the scrollbar. Hand rolled
 * ramps did the first version and could not hold the choreography.
 */
export function Ride({ frames }: { frames: Frame[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const rider = useRef<SVGGElement>(null);
  const scale = useRef<SVGGElement>(null);
  const views = useRef<(SVGGElement | null)[]>([]);
  const rails = useRef<(SVGRectElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current, p = path.current, g = rider.current, pl = plane.current;
    if (!el || !p || !g || !pl) return;

    const len = p.getTotalLength();
    const place = (t: number) => {
      const at = len * Math.min(1, Math.max(0, t));
      const a = p.getPointAtLength(at);
      const b = p.getPointAtLength(Math.min(len, at + 1));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      g.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle})`);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(pl, { rotateX: 0, rotateY: -52, scale: 1 });
      gsap.set(views.current[0], { opacity: 0 });
      gsap.set(views.current[1], { opacity: 0 });
      gsap.set(views.current[2], { opacity: 1 });
      gsap.set(scale.current, { scale: 3.4 });
      gsap.set(rails.current, { attr: { x: (i: number) => (i ? 430 : 90) }, opacity: 1 });
      gsap.set(cards.current, { opacity: 1, y: 0 });
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: 0 });
      place(1);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",     // the stage is CSS sticky; nothing is pinned
          scrub: 0.8,
          onUpdate: (self) => place(self.progress),
        },
      });

      // the route lays itself down the whole way
      tl.fromTo(p, { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 10 }, 0);

      // ACT ONE — high above, looking down the road
      tl.fromTo(pl, { rotateX: 74, rotateY: 0, scale: 0.82, y: "-6%" },
        { rotateX: 74, scale: 0.82, duration: 1 }, 0);
      tl.fromTo(scale.current, { scale: 2.4 }, { scale: 2.4, duration: 1 }, 0);

      // ACT TWO — the camera comes down until it is level and close
      tl.to(pl, { rotateX: 0, scale: 1.25, y: "0%", duration: 2.4 }, 1);
      tl.to(scale.current, { scale: 3.6, duration: 2.4 }, 1);
      tl.to(views.current[0], { opacity: 0, duration: 1.4 }, 1.2);
      tl.to(views.current[1], { opacity: 1, duration: 1.4 }, 1.2);
      // and the two rails open out from beside the bike
      tl.to(rails.current[0], { attr: { x: 150, width: 130 }, duration: 2.4 }, 1);
      tl.to(rails.current[1], { attr: { x: 320, width: 130 }, duration: 2.4 }, 1);

      // ACT THREE — it swings round to the side of the bike
      tl.to(pl, { rotateY: -52, scale: 1.5, duration: 2.6 }, 3.6);
      tl.to(scale.current, { scale: 3.2, duration: 2.6 }, 3.6);
      tl.to(views.current[1], { opacity: 0, duration: 1.2 }, 4.0);
      tl.to(views.current[2], { opacity: 1, duration: 1.2 }, 4.0);
      // the rails run to the edges of the frame as it turns
      tl.to(rails.current[0], { attr: { x: -220, width: 300 }, duration: 2.6 }, 3.6);
      tl.to(rails.current[1], { attr: { x: 520, width: 300 }, duration: 2.6 }, 3.6);

      // ACT FOUR — it holds and the work comes past
      tl.to(pl, { rotateY: -58, scale: 1.4, duration: 3.8 }, 6.2);
      cards.current.forEach((c, i) => {
        if (!c) return;
        tl.fromTo(c, { opacity: 0, y: 46 },
          { opacity: 1, y: 0, duration: 0.7 }, 6.3 + (i * 3.4) / frames.length);
      });
    }, el);

    place(0);
    return () => ctx.revert();
  }, [frames.length]);

  return (
    <div ref={wrap} className="ride">
      <div className="ride-stage">
        <div className="ride-camera">
          <div ref={plane} className="ride-plane">
            <svg className="ride-svg" viewBox="0 0 600 1400" preserveAspectRatio="xMidYMid meet"
              aria-hidden="true">
              <rect ref={(n) => { rails.current[0] = n; }} x="232" y="-200" width="34" height="1800" fill={VIOLET} />
              <rect ref={(n) => { rails.current[1] = n; }} x="334" y="-200" width="34" height="1800" fill={ACID} />
              <path ref={path} d={ROUTE} fill="none" stroke={AMBER} strokeWidth="3"
                strokeLinecap="round" opacity=".6" />
              <g ref={rider}>
                <g ref={scale} stroke={AMBER} strokeWidth="1.15"
                  style={{ transform: "scale(3)", transformBox: "fill-box", transformOrigin: "center" }}>
                  <g data-view="top" ref={(n) => { views.current[0] = n; }}><Top /></g>
                  <g data-view="front" ref={(n) => { views.current[1] = n; }} style={{ opacity: 0 }}><Front /></g>
                  <g data-view="side" ref={(n) => { views.current[2] = n; }} style={{ opacity: 0 }}><Side /></g>
                </g>
              </g>
            </svg>
          </div>
        </div>

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
