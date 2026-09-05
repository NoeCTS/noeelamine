import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/** Reveal on scroll, the way the original page did it. */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Plate({ src, index, place, note }: { src: string; index: string; place: string; note?: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className={`transition-all duration-1000 ${seen ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}>
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-500">{index} / {place}</p>
      <img src={src} alt={`${place}, Nothing concept campaign`} loading="lazy" className="h-auto w-full" />
      {note && <p className="mt-6 max-w-md text-sm text-neutral-500">{note}</p>}
    </div>
  );
}

/**
 * Kept in the language of the original page: grey hero with a 32px dot grid and
 * Courier, then black for the campaign itself. That page already worked, so the
 * job here was to bring it across and give it the rest of the images.
 */
export default function Nothing() {
  return (
    <div className="min-h-screen overflow-x-hidden text-neutral-900"
      style={{ fontFamily: "'Courier New', monospace", backgroundColor: "#d8d8d8" }}>

      <div className="pointer-events-none fixed inset-0 z-10" aria-hidden="true"
        style={{ backgroundImage: "radial-gradient(circle, #888 1.5px, transparent 1.5px)", backgroundSize: "32px 32px", opacity: 0.4 }} />

      <header className="rise fixed inset-x-0 top-0 z-40 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium uppercase tracking-[0.3em]">Nothing</span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        </div>
        <Link to="/#index" className="border border-neutral-900/60 px-3 py-1.5 text-[.72rem] uppercase tracking-[.16em] text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-[#d8d8d8]">
          Back to the archive
        </Link>
      </header>

      {/* Hero, on grey */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="rise rise-2 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.5em] text-neutral-500">Concept campaign</p>
          <h1 className="mb-8 text-4xl font-light tracking-tight md:text-6xl lg:text-8xl">
            Headphone <span className="opacity-30">(1)</span>
          </h1>
          <p className="text-lg tracking-wide text-neutral-600 md:text-xl">
            nothing <span className="mx-4">feels</span> different.
          </p>
        </div>
        <div className="rise rise-3 absolute bottom-12 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Scroll</span>
          <span className="block h-12 w-px bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </section>

      {/* Everything below is black */}
      <section className="relative z-20 bg-black px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-xs uppercase tracking-[0.5em] text-neutral-600">The brief</p>
          <h2 className="text-2xl font-light leading-relaxed text-neutral-200 md:text-4xl">
            In a world of constant noise and conformity, Nothing offers an escape.
            <span className="text-neutral-500"> The Headphone (1) is not audio equipment, it is a statement.</span>
          </h2>
        </div>
      </section>

      {/* Before the images, not after them. Someone scrolling this should know
          what they are looking at while they look at it. */}
      <section className="relative z-20 bg-black px-6 pb-4 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl border-t border-neutral-900 pt-10">
          <p className="mb-6 text-xs uppercase tracking-[0.5em] text-neutral-600">How this was made</p>
          <p className="m-0 max-w-[62ch] text-[.98rem] leading-relaxed text-neutral-400">
            The photography is generated. Very little else is: every frame was
            graded in Photoshop, had elements composited into it by hand, and
            carries type I set myself — none of the copy or the lockups are
            generated. This is a self-directed concept, with no client and no
            production behind it, so generating a base image was the quickest way
            to think in pictures: casting, light, framing, and how a line sits
            once it is on one. Made for real it would be shot. What is on show is
            the campaign, not the photograph.
          </p>
        </div>
      </section>

      <section className="relative z-20 bg-black px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl space-y-24">
          <Plate src="/nothing/ad-1.jpg" index="01" place="London Underground"
            note="Standing apart in the crowd. The daily commute becomes a personal sanctuary." />
          <Plate src="/nothing/ad-2.jpg" index="02" place="Rush hour"
            note="Find clarity in chaos. When everyone looks down, you look forward." />
          {/* Frames 002 and 003 are the same two pictures as the plates above:
              002 is ad-2 and 003 is ad-1, at a different size. They ran here as
              well, so the sequence showed each key visual twice in a row. */}
          <Plate src="/frames/038.jpg" index="03" place="Portrait"
            note="No expression to sell you anything. The point is the absence of the pitch." />
          <Plate src="/frames/039.jpg" index="04" place="Studio" />
          <Plate src="/frames/040.jpg" index="05" place="Handover"
            note="Transparent hardware, transparent advertising." />
        </div>
      </section>

      <section className="relative z-20 bg-black px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-12 text-center text-xs uppercase tracking-[0.5em] text-neutral-600">Outdoor activation</p>
          <div className="space-y-16">
            <Plate src="/nothing/billboard-1.jpg" index="06" place="Underground billboard" />
            <Plate src="/nothing/billboard-2.jpg" index="07" place="Crowd" />
            <Plate src="/frames/043.jpg" index="08" place="Poster wall"
              note="Repetition as the medium. One poster is an ad; forty is a presence." />
          </div>
        </div>
      </section>

      <section className="relative z-20 border-t border-neutral-800 bg-black px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-3">
          {[
            ["Insight", "Gen Z and millennials feel increasingly alienated by conformity. They crave authenticity in a world of sameness."],
            ["Strategy", "Position Nothing as the anti establishment choice. Not through rebellion, but through quiet confidence."],
            ["Execution", "Outdoor campaign targeting London transport hubs. Digital activation through ambient social content."],
          ].map(([h, p]) => (
            <div key={h}>
              <p className="mb-4 text-xs uppercase tracking-[0.5em] text-neutral-600">{h}</p>
              <p className="leading-relaxed text-neutral-400">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-20 flex items-center justify-center bg-black px-6 py-32">
        <p className="text-center text-3xl font-light tracking-tight text-white md:text-5xl lg:text-7xl">
          nothing <span className="text-neutral-600">feels</span> different.
        </p>
      </section>

      <footer className="relative z-20 border-t border-neutral-800 bg-black px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-600">Concept by</span>
            <span className="text-sm text-white">Noe Elamine</span>
          </div>
          <p className="text-center text-xs text-neutral-700">
            Speculative campaign made for portfolio purposes. Not affiliated with Nothing Technology Ltd.
          </p>
          <Link to="/#index" className="border border-neutral-700 px-3 py-1.5 text-[.72rem] uppercase tracking-[.16em] text-neutral-400 transition-colors hover:border-white hover:text-white">
            Back to the archive
          </Link>
        </div>
      </footer>
    </div>
  );
}
