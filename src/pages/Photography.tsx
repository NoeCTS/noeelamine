import { Link } from "react-router-dom";
import { Resolve } from "@/components/Texture";
import { Masthead, Foot, Back } from "@/components/Chrome";
import { FRAMES } from "@/data/frames";

export default function Photography() {
  const shots = FRAMES.filter((f) => f.group === "photography" && !f.sensitive);
  const lisbon = shots.filter((f) => f.made === "2026.04");
  const rest = shots.filter((f) => f.made !== "2026.04");

  return (
    <div className="wrap pt-nav relative z-[1]">
      <Masthead title="Photography" note="Lisbon and elsewhere" />
      <p className="mt-9 max-w-[56ch] text-[clamp(1.02rem,1.5vw,1.2rem)] leading-snug">
        No client and no brief. <span className="text-grey">
        Eleven of these were shot in one run in Lisbon, which is why they hold
        together as a set rather than a scatter of travel pictures. This is the
        largest single group in the archive, and the clearest evidence that it is
        an archive rather than a portfolio.</span>
      </p>

      <section className="mt-20">
        <div className="mb-6 flex flex-wrap items-baseline gap-4">
          <span className="num text-[1.4rem] text-grey">01</span>
          <h2 className="m-0 font-display text-[clamp(1.4rem,3.6vw,2.2rem)] uppercase leading-none" style={{ fontWeight: 400 }}>Lisbon</h2>
          <span className="mono ml-auto">2026.04 · {lisbon.length} frames</span>
        </div>
        <div className="grid gap-x-4 gap-y-7" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
          {lisbon.map((f) => (
            <figure key={f.n} className="m-0 flex flex-col gap-2">
              <Resolve src={`/frames/${f.n}.jpg`} alt={f.title} />
              <figcaption className="flex items-baseline justify-between gap-2">
                <span className="num text-[14px] text-grey">{f.n}</span>
                <span className="mono-sm text-right">{f.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-6 flex flex-wrap items-baseline gap-4">
          <span className="num text-[1.4rem] text-grey">02</span>
          <h2 className="m-0 font-display text-[clamp(1.4rem,3.6vw,2.2rem)] uppercase leading-none" style={{ fontWeight: 400 }}>Elsewhere</h2>
          <span className="mono ml-auto">{rest.length} frames</span>
        </div>
        <div className="grid gap-x-4 gap-y-7" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
          {rest.map((f) => (
            <figure key={f.n} className="m-0 flex flex-col gap-2">
              <Resolve src={`/frames/${f.n}.jpg`} alt={f.title} />
              <figcaption className="flex items-baseline justify-between gap-2">
                <span className="num text-[14px] text-grey">{f.n}</span>
                <span className="mono-sm text-right">{f.title} · {f.made}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="field mt-20">
        <h3 className="m-0 mb-2 font-display text-[clamp(1.3rem,3vw,1.9rem)] uppercase leading-none" style={{ fontWeight: 400 }}>Captions pending</h3>
        <p className="m-0 max-w-[52ch] text-white/80">
          These are titled by what they show rather than where they are. Real
          places and dates are the one thing the archive still needs, and the one
          thing only I can write.
        </p>
      </div>

      <p className="mt-10"><Back /></p>
      <Foot />
    </div>
  );
}
