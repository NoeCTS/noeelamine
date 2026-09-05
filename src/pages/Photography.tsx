import { useMemo, useState } from "react";
import { Masthead, Foot } from "@/components/Chrome";
import { Lightbox } from "@/components/Lightbox";
import { useFrameParam } from "@/lib/useFrameParam";
import { FRAMES } from "@/data/frames";

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

      {/* Every frame first, then the same set as a list. The two-run split was
          a distinction only the manifest cared about. */}
      <section className="mt-14">
        <div className="rule-top grid grid-cols-2 sm:grid-cols-3">
          {shots.map((f) => {
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

        <ol className="m-0 mt-16 list-none p-0">
          {shots.map((f) => {
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

      <p className="mono mt-14">
        Titled by what they show. Places and dates are still to be written.
      </p>

      <Foot />

      <Lightbox frames={shots} index={open} onClose={closeFrame} onMove={moveFrame} />
      <span className="sr-only" aria-live="polite">{shots[hover]?.title}</span>
    </div>
  );
}
