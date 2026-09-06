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
const STREETS = [
  "M-418 60 L-518 940",
  "M-356 60 L-456 940",
  "M-294 60 L-394 940",
  "M-232 60 L-332 940",
  "M-170 60 L-270 940",
  "M-108 60 L-208 940",
  "M-46 60 L-146 940",
  "M16 60 L-84 940",
  "M78 60 L-22 940",
  "M140 60 L40 940",
  "M202 60 L102 940",
  "M264 60 L164 940",
  "M326 60 L226 940",
  "M388 60 L288 940",
  "M450 60 L350 940",
  "M512 60 L412 940",
  "M574 60 L474 940",
  "M636 60 L536 940",
  "M698 60 L598 940",
  "M30 -466 L970 -606",
  "M30 -392 L970 -532",
  "M30 -318 L970 -458",
  "M30 -244 L970 -384",
  "M30 -170 L970 -310",
  "M30 -96 L970 -236",
  "M30 -22 L970 -162",
  "M30 52 L970 -88",
  "M30 126 L970 -14",
  "M30 200 L970 60",
  "M30 274 L970 134",
  "M30 348 L970 208",
  "M30 422 L970 282",
  "M30 496 L970 356",
  "M30 570 L970 430",
  "M30 644 L970 504",
  "M30 718 L970 578",
  "M30 792 L970 652",
  "M30 866 L970 726",
  "M500 500 L1120 500",
  "M500 500 L1066 752",
  "M500 500 L915 961",
  "M500 500 L692 1090",
  "M500 500 L435 1117",
  "M500 500 L190 1037",
  "M500 500 L-2 864",
  "M500 500 L-106 629",
  "M500 500 L-106 371",
  "M500 500 L-2 136",
  "M500 500 L190 -37",
  "M500 500 L435 -117",
  "M500 500 L692 -90",
  "M500 500 L915 39",
  "M500 500 L1066 248",
];

/** City blocks, so the grid has something between its lines. */
const BLOCKS = [
  "M421 264 h76 v61 h-76 Z",
  "M139 184 h94 v26 h-94 Z",
  "M464 706 h33 v52 h-33 Z",
  "M309 148 h37 v47 h-37 Z",
  "M518 181 h56 v25 h-56 Z",
  "M654 544 h33 v72 h-33 Z",
  "M669 236 h54 v60 h-54 Z",
  "M732 706 h33 v56 h-33 Z",
  "M689 516 h32 v34 h-32 Z",
  "M137 680 h43 v38 h-43 Z",
  "M519 257 h95 v27 h-95 Z",
  "M674 425 h49 v26 h-49 Z",
  "M685 694 h50 v43 h-50 Z",
  "M189 670 h34 v56 h-34 Z",
  "M151 743 h52 v51 h-52 Z",
  "M786 654 h80 v69 h-80 Z",
  "M411 586 h84 v43 h-84 Z",
  "M396 364 h49 v64 h-49 Z",
  "M339 193 h64 v53 h-64 Z",
  "M596 461 h83 v38 h-83 Z",
  "M713 184 h41 v52 h-41 Z",
  "M518 278 h69 v29 h-69 Z",
  "M590 541 h31 v62 h-31 Z",
  "M169 681 h66 v41 h-66 Z",
  "M801 468 h89 v57 h-89 Z",
  "M557 180 h37 v37 h-37 Z",
  "M575 823 h34 v23 h-34 Z",
  "M838 828 h65 v61 h-65 Z",
  "M681 807 h83 v38 h-83 Z",
  "M823 505 h70 v21 h-70 Z",
  "M562 473 h47 v59 h-47 Z",
  "M209 615 h33 v33 h-33 Z",
  "M876 404 h42 v67 h-42 Z",
  "M343 517 h76 v51 h-76 Z",
  "M172 280 h83 v45 h-83 Z",
  "M652 394 h43 v72 h-43 Z",
  "M530 673 h61 v65 h-61 Z",
  "M515 477 h74 v34 h-74 Z",
  "M244 194 h48 v29 h-48 Z",
  "M327 784 h55 v20 h-55 Z",
  "M586 713 h49 v36 h-49 Z",
  "M378 114 h44 v46 h-44 Z",
  "M637 488 h66 v28 h-66 Z",
  "M797 637 h32 v49 h-32 Z",
  "M786 682 h76 v45 h-76 Z",
  "M498 513 h39 v50 h-39 Z",
];

/** The park, and the districts anyone from Berlin would name. */
const PARK = "M300 392 C300 350 372 336 452 340 C536 344 596 356 596 396 C596 438 522 452 444 448 C360 444 300 434 300 392 Z";
const PLACES: [string, number, number][] = [
  ["Mitte", 512, 470], ["Tiergarten", 372, 398], ["Prenzlauer Berg", 636, 320],
  ["Friedrichshain", 706, 512], ["Kreuzberg", 566, 640], ["Neukölln", 604, 760],
  ["Charlottenburg", 236, 470], ["Wedding", 402, 262], ["Treptow", 762, 668],
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
  const city = useRef<SVGGElement>(null);
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

      // The camera works the whole way rather than moving once at each end:
      // establish the city, drop to street level, lift to see where the ride is
      // going, drop again, and only then pull back over the finished route.
      const keys: [number, number][] = [
        [0.00, 1.00], [0.10, 0.94], [0.20, 0.30], [0.36, 0.30],
        [0.46, 0.58], [0.56, 0.26], [0.74, 0.26], [0.86, 0.62], [1.00, 1.00],
      ];
      let zoom = keys[keys.length - 1][1];
      for (let i = 0; i < keys.length - 1; i++) {
        const [a, za] = keys[i], [bK, zb] = keys[i + 1];
        if (t >= a && t <= bK) { zoom = za + (zb - za) * ease((t - a) / (bK - a)); break; }
      }
      // how tightly it holds the rider: loose when wide, locked when close
      const hold = clamp((1.0 - zoom) / 0.7);
      const w = 1000 * zoom, h = 1000 * zoom;
      const cx = 500 + (at.x - 500) * hold;
      const cy = 500 + (at.y - 500) * hold;
      box.setAttribute("viewBox", `${cx - w / 2} ${cy - h / 2} ${w} ${h}`);
      if (city.current) city.current.style.opacity = `${0.35 + hold * 0.65}`;

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
      // Each piece has the frame to itself: it arrives as the rider reaches its
      // segment and leaves before the next one comes, so nothing ever stacks.
      cards.current.forEach((c, i) => {
        if (!c) return;
        const span = stops.length > 1 ? stops[1] - stops[0] : 0.1;
        const inK = ease(clamp((t - stops[i] + span * 0.34) / (span * 0.34)));
        const outK = ease(clamp((t - stops[i] - span * 0.52) / (span * 0.34)));
        const k = inK * (1 - outK);
        c.style.opacity = `${k}`;
        c.style.transform = `translateY(${(1 - inK) * 30 - outK * 22}px)`;
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
            <clipPath id="city"><path d={RING} /></clipPath>
          </defs>

          <g ref={city} className="route-city" clipPath="url(#city)">
            {BLOCKS.map((d) => <path key={d} className="route-block" d={d} />)}
            {STREETS.map((d) => <path key={d} className="route-street" d={d} />)}
            <path className="route-park" d={PARK} />
            <path className="route-ring" d={RING} />
            <path className="route-water" d={SPREE} />
          </g>
          <g className="route-places">
            {PLACES.map(([name, x, y]) => (
              <text key={name} x={x} y={y}>{name.toUpperCase()}</text>
            ))}
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
