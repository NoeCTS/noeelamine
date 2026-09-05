import { useMemo, useState } from "react";
import { Masthead, Foot } from "@/components/Chrome";
import { Lightbox } from "@/components/Lightbox";
import { useFrameParam } from "@/lib/useFrameParam";
import { FRAMES, type Frame } from "@/data/frames";

/**
 * A studio index rather than a gallery: every entry the same size, set out line
 * by line, with hairline rules doing the separating. The archive's no-lines rule
 * is suspended here on purpose, because a list of works is exactly the case
 * where a rule carries information instead of decorating.
 */
export default function Photography() {
  const shots = useMemo(() => FRAMES.filter((f) => f.group === "photography" && !f.sensitive), []);
  const { open, openFrame, moveFrame, closeFrame } = useFrameParam(shots);
  const [hover, setHover] = useState<number>(0);

  // The Lisbon run is whichever shoot date carries the most frames. Deriving it
  // rather than hardcoding a date means correcting a date in the manifest does
  // not silently empty the section.
  const sets: [string, string, Frame[]][] = useMemo(() => {
    const counts = new Map<string, number>();
    shots.forEach((f) => f.made && counts.set(f.made, (counts.get(f.made) ?? 0) + 1));
    const run = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    return [
      ["01", "Lisbon", shots.filter((f) => f.made === run)],
      ["02", "Elsewhere", shots.filter((f) => f.made !== run)],
    ];
  }, [shots]);

  return (
    <div className="wrap page-top relative z-[1]">
      <Masthead title="Photography" note="Lisbon and elsewhere" />

      <div className="rule-top mt-10 grid gap-y-6 py-6 sm:grid-cols-3">
        <p className="col-rule text-[.95rem] leading-relaxed text-grey">
          No client and no brief. Eleven of these were shot in one run, which is
          why they hold together as a set rather than a scatter.
        </p>
        <p className="col-rule text-[.95rem] leading-relaxed text-grey">
          The largest single group here by some way, which is mostly what happens
          when you carry a camera around for a few years.
        </p>
        <p className="col-rule text-[.95rem] leading-relaxed text-grey">
          <span className="num text-ink">{shots.length}</span> frames. Click any
          line or any frame to open it.
        </p>
      </div>

      {sets.map(([n, label, list]) => (
        <section key={n} className="mt-16">
          <div className="rule-top flex flex-wrap items-baseline gap-4 py-3">
            <span className="num text-[1.15rem] text-grey">{n}</span>
            <h2 className="m-0 font-display text-[clamp(1.2rem,3vw,1.8rem)] uppercase leading-none" style={{ fontWeight: 400 }}>{label}</h2>
            <span className="mono ml-auto">{list.length} frames</span>
          </div>

          {/* three columns, separated by rules, nothing else */}
          <div className="rule-top grid grid-cols-2 sm:grid-cols-3">
            {list.map((f) => {
              const i = shots.indexOf(f);
              return (
                <button key={f.n} type="button" onClick={() => openFrame(i)} onMouseEnter={() => setHover(i)}
                  className="col-rule group block p-3 text-left sm:p-4">
                  <span className="block overflow-hidden bg-void-2" style={{ aspectRatio: "4 / 3" }}>
                    <img src={`/frames/${f.n}.jpg`} alt={f.title} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
                  </span>
                  <span className="mt-2.5 flex items-baseline justify-between gap-2">
                    <span className="num text-[12px] text-grey-dim">{f.n}</span>
                    <span className="mono-sm text-right">{f.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* the same set again as an index: one line per work, everything the
              same size. It reads as a caption to the grid above it, not a menu
              you have to get past to reach the pictures. */}
          <ol className="m-0 mt-12 list-none p-0">
            {list.map((f) => {
              const i = shots.indexOf(f);
              return (
                <li key={f.n} className="rule-top">
                  <button type="button" onClick={() => openFrame(i)} onMouseEnter={() => setHover(i)}
                    className="index-row grid w-full grid-cols-[46px_1fr_auto] items-baseline gap-4 py-3.5 text-left sm:grid-cols-[56px_1fr_120px_92px]">
                    <span className="num text-[13px] text-grey-dim transition-colors">{f.n}</span>
                    <span className="text-[15px] transition-transform">{f.title}</span>
                    <span className="mono-sm hidden sm:block">{f.kind}</span>
                    <span className="mono-sm text-right">{f.made ?? "—"}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <p className="mono mt-14">
        Titled by what they show. Places and dates are still to be written.
      </p>

      <Foot />

      <Lightbox frames={shots} index={open} onClose={closeFrame} onMove={moveFrame} />
      <span className="sr-only" aria-live="polite">{shots[hover]?.title}</span>
    </div>
  );
}
