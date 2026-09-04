import { useMemo, useState } from "react";
import { Masthead, Foot } from "@/components/Chrome";
import { Lightbox } from "@/components/Lightbox";
import { useFrameParam } from "@/lib/useFrameParam";
import { FRAMES, type Frame } from "@/data/frames";

/**
 * The still work: posters, artwork and single graphics. Same grammar as the
 * photography index — pictures first, then the same set again as a line-by-line
 * list — because a poster is judged whole before it is judged by its caption.
 */
export default function GraphicDesign() {
  const works = useMemo(
    () => FRAMES.filter((f) => f.group === "posters" && !f.sensitive && !f.route), []);
  const { open, openFrame, moveFrame, closeFrame } = useFrameParam(works);
  const [hover, setHover] = useState<number>(0);

  // Split on what the piece is rather than when it was made: a poster is set
  // to be read at distance, a graphic or a study is not.
  const sets: [string, string, Frame[]][] = useMemo(() => [
    ["01", "Posters", works.filter((f) => f.kind === "poster")],
    ["02", "Graphics and studies", works.filter((f) => f.kind !== "poster")],
  ], [works]);

  return (
    <div className="wrap page-top relative z-[1]">
      <Masthead title="Graphic design" note="Posters, artwork, graphics" />

      <div className="rule-top mt-10 grid gap-y-6 py-6 sm:grid-cols-3">
        <p className="col-rule text-[.95rem] leading-relaxed text-grey">
          Work made to be looked at rather than read through. Some of it was set
          for a wall, some of it never left the screen it was drawn on.
        </p>
        <p className="col-rule text-[.95rem] leading-relaxed text-grey">
          Campaign work lives in its own zone. What is collected here stands on
          its own, without a brief behind it to explain the decisions.
        </p>
        <p className="col-rule text-[.95rem] leading-relaxed text-grey">
          <span className="num text-ink">{works.length}</span> frames. Click any
          frame or any line to open it.
        </p>
      </div>

      {sets.map(([n, label, list]) => list.length > 0 && (
        <section key={n} className="mt-16">
          <div className="rule-top flex flex-wrap items-baseline gap-4 py-3">
            <span className="num text-[1.15rem] text-grey">{n}</span>
            <h2 className="m-0 font-display text-[clamp(1.2rem,3vw,1.8rem)] uppercase leading-none" style={{ fontWeight: 400 }}>{label}</h2>
            <span className="mono ml-auto">{list.length} frames</span>
          </div>

          {/* Set in their own proportions. These are not all one shape the way a
              contact sheet is, and cropping a poster to a grid cell would be
              deciding for the reader which part of it mattered. */}
          <div className="rule-top grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {list.map((f) => {
              const i = works.indexOf(f);
              return (
                <button key={f.n} type="button" onClick={() => openFrame(i)} onMouseEnter={() => setHover(i)}
                  className="col-rule group block p-3 text-left sm:p-4">
                  <span className="block bg-void-2">
                    <img src={`/frames/${f.n}.jpg`} alt={f.title} loading="lazy"
                      className="block w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
                  </span>
                  <span className="mt-2.5 flex items-baseline justify-between gap-2">
                    <span className="num text-[12px] text-grey-dim">{f.n}</span>
                    <span className="mono-sm text-right">{f.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <ol className="m-0 mt-12 list-none p-0">
            {list.map((f) => {
              const i = works.indexOf(f);
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

      <Foot />

      <Lightbox frames={works} index={open} onClose={closeFrame} onMove={moveFrame} />
      <span className="sr-only" aria-live="polite">{works[hover]?.title}</span>
    </div>
  );
}
