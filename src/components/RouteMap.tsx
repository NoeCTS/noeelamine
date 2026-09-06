import { useEffect, useRef } from "react";
import type { Frame } from "@/data/frames";

const VIOLET = "#6B3FE4";
const ACID = "#FFE400";

/** The city, faintly: the Ringbahn's lopsided loop and the Spree through it.
 *  Not a map, an armature — enough that the ride has somewhere to be. */
const RING =
  "M500 118 C664 118 806 214 828 372 C848 516 792 640 700 728 C620 806 560 862 496 862 " +
  "C430 862 372 806 292 728 C200 640 148 516 168 372 C190 214 336 118 500 118 Z";
const SPREE =
  "M96 596 C214 560 288 630 386 606 C482 582 520 500 606 498 C700 496 742 566 838 540 " +
  "C888 526 918 500 946 470";
const RADIALS = [
  "M500 120 L500 862", "M170 380 L830 620", "M170 620 L830 380",
  "M300 160 L700 820", "M700 160 L300 820",
];

/** The ride. Out of Mitte, along the water, round the park and back. */
const ROUTE =
  "M498 512 C512 470 546 452 590 452 C648 452 676 486 690 528 C706 574 700 620 664 654 " +
  "C620 696 566 700 520 676 C470 650 452 604 456 556 C462 490 508 442 566 404 " +
  "C640 356 726 356 780 396 C830 434 838 494 812 548 C784 606 726 640 660 664 " +
  "C578 694 494 690 424 656 C348 620 300 552 296 480 C292 404 338 340 408 306 " +
  "C476 274 552 282 606 320 C650 352 668 396 662 440";

const GHOSTS = [
  "M470 540 C520 470 620 448 690 480 C760 512 786 596 740 654 C690 716 580 720 512 682 C446 646 428 590 470 540 Z",
  "M420 470 C470 380 610 344 700 380 C790 416 812 520 758 588 C700 660 566 674 486 632 C420 596 388 528 420 470 Z",
  "M520 600 C580 560 660 566 704 610 C748 654 738 716 686 742 C630 770 556 754 522 706 C494 666 490 622 520 600 Z",
];

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (x: number) => x * x * (3 - 2 * x);

/**
 * The ride as a route drawn on the city, which is how anyone who rides actually
 * looks at a ride afterwards. Strava is the reference and stops there: the trace
 * on black and the numbers under it, but in the campaign's two colours, over an
 * armature of Berlin rather than a map, and moving like a camera rather than a
 * replay.
 */
export function RouteMap({ frames }: { frames: Frame[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const stats = useRef<(HTMLSpanElement | null)[]>([]);
  const profile = useRef<SVGRectElement>(null);
  const pins = useRef<(SVGGElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current, p = line.current, g = glow.current, box = svg.current;
    if (!el || !p || !g || !box) return;
    const len = p.getTotalLength();

    // where each piece of work sits along the ride
    const stops = frames.map((_, i) => 0.12 + (i * 0.76) / Math.max(1, frames.length - 1));
    pins.current.forEach((pin, i) => {
      if (!pin) return;
      const at = p.getPointAtLength(len * stops[i]);
      pin.setAttribute("transform", `translate(${at.x} ${at.y})`);
    });

    const draw = (raw: number) => {
      const t = clamp(raw);
      p.style.strokeDashoffset = `${len * (1 - t)}`;
      g.style.strokeDashoffset = `${len * (1 - t)}`;

      const at = p.getPointAtLength(len * Math.max(0.0001, t));
      if (head.current) {
        head.current.setAttribute("transform", `translate(${at.x} ${at.y})`);
        head.current.style.opacity = t > 0.002 && t < 0.999 ? "1" : "0";
      }

      // the camera: wide over the city, in close on the rider, wide again to
      // show what the whole ride looked like
      const inClose = ease(clamp(t / 0.18));
      const pullOut = ease(clamp((t - 0.80) / 0.20));
      const zoom = 1 - inClose * 0.62 + pullOut * 0.62;
      const w = 1000 * zoom, h = 1000 * zoom;
      const cx = 500 + (at.x - 500) * (inClose * (1 - pullOut));
      const cy = 500 + (at.y - 500) * (inClose * (1 - pullOut));
      box.setAttribute("viewBox", `${cx - w / 2} ${cy - h / 2} ${w} ${h}`);

      // the numbers under it
      const km = (t * 34.6).toFixed(1);
      const all = Math.floor(t * 82 * 60);
      const hrs = Math.floor(all / 3600), mins = Math.floor((all % 3600) / 60), secs = all % 60;
      const climb = Math.round(t * 214);
      if (stats.current[0]) stats.current[0].textContent = `${km} km`;
      if (stats.current[1]) stats.current[1].textContent = hrs
        ? `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      if (stats.current[2]) stats.current[2].textContent = `${climb} m`;
      if (profile.current) profile.current.setAttribute("width", `${t * 600}`);

      pins.current.forEach((pin, i) => {
        if (!pin) return;
        pin.style.opacity = t >= stops[i] ? "1" : "0.22";
      });
      cards.current.forEach((c, i) => {
        if (!c) return;
        const k = ease(clamp((t - stops[i]) / 0.06));
        c.style.opacity = `${k}`;
        c.style.transform = `translateY(${(1 - k) * 26}px)`;
      });
    };

    for (const el2 of [p, g]) {
      el2.style.strokeDasharray = `${len}`;
      el2.style.strokeDashoffset = `${len}`;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(1);
      cards.current.forEach((c) => { if (c) { c.style.opacity = "1"; c.style.transform = "none"; } });
      return;
    }

    let target = 0, current = 0, ticking = false, raf = 0;
    const measure = () => {
      const run = el.offsetHeight - window.innerHeight;
      return run > 0 ? clamp(-el.getBoundingClientRect().top / run) : 0;
    };
    const tick = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0004) { current = target; ticking = false; }
      draw(current);
      if (ticking) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = measure();
      if (!ticking) { ticking = true; raf = requestAnimationFrame(tick); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    target = current = measure();
    draw(current);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [frames.length]);

  return (
    <div ref={wrap} className="route">
      <div className="route-stage">
        <svg ref={svg} className="route-svg" viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="ride" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={VIOLET} />
              <stop offset="0.55" stopColor="#C36BD8" />
              <stop offset="1" stopColor={ACID} />
            </linearGradient>
            <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>

          <g className="route-city">
            {RADIALS.map((d) => <path key={d} d={d} />)}
            <path d={RING} />
            <path className="route-water" d={SPREE} />
          </g>

          <g className="route-ghosts">
            {GHOSTS.map((d) => <path key={d} d={d} />)}
          </g>

          <path ref={glow} d={ROUTE} className="route-glow" filter="url(#soft)" />
          <path ref={line} d={ROUTE} className="route-line" />

          {frames.map((f, i) => (
            <g key={f.n} className="route-pin" ref={(n) => { pins.current[i] = n; }}>
              <circle r="13" />
              <circle r="4.5" className="route-pin-core" />
            </g>
          ))}

          <g ref={head} className="route-head" style={{ opacity: 0 }}>
            <circle r="22" className="route-head-halo" />
            <circle r="7" />
          </g>
        </svg>

        <div className="route-hud">
          <div className="route-stats">
            {["Distance", "Moving", "Elevation"].map((label, i) => (
              <div key={label}>
                <span className="route-label">{label}</span>
                <span className="route-value" ref={(n) => { stats.current[i] = n; }}>—</span>
              </div>
            ))}
          </div>
          <svg className="route-profile" viewBox="0 0 600 46" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 46 L0 30 C60 12 96 38 150 26 C210 12 250 40 300 22 C356 2 392 34 450 24 C510 14 552 36 600 18 L600 46 Z" />
            <rect ref={profile} x="0" y="0" width="0" height="46" fill="url(#ride)" opacity=".28" />
          </svg>
        </div>

        <div className="route-cards">
          {frames.map((f, i) => (
            <div key={f.n} ref={(n) => { cards.current[i] = n; }}
              className={`route-card ${i % 2 ? "is-right" : "is-left"}`}>
              <img src={`/frames/${f.n}.jpg`} alt={f.title} loading="lazy" />
              <span>{f.n} · {f.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
