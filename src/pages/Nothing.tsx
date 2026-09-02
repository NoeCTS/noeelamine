import { Link } from "react-router-dom";
import { FRAMES } from "@/data/frames";

/**
 * Kept in its original language rather than redrawn: light grey, Courier, the
 * 32px dot grid and one red dot. That page already worked, and rebuilding it
 * would only make it more like everything else.
 */
export default function Nothing() {
  const frames = FRAMES.filter((f) => f.group === "nothing");
  return (
    <main className="relative min-h-screen bg-[#D8D8D8] text-[#171717]" style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="pointer-events-none fixed inset-0 z-10 opacity-40"
        style={{ backgroundImage: "radial-gradient(circle,#888 1.5px,transparent 1.5px)", backgroundSize: "32px 32px" }}
        aria-hidden="true" />
      <div className="relative z-20 mx-auto w-[min(1120px,100%-2.5rem)] py-8">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-[.85rem] font-medium uppercase tracking-[.3em]">
            Nothing <span className="inline-block h-2 w-2 rounded-full bg-[#D71921]" />
          </span>
          <Link to="/" className="border border-[#171717] px-3 py-1.5 text-[.78rem] uppercase tracking-[.1em]">
            Back to the archive
          </Link>
        </div>

        <header className="py-20">
          <h1 className="m-0 text-[clamp(2rem,7vw,4.4rem)] uppercase leading-[1] tracking-[.06em]">
            Nothing<span className="text-[#D71921]">.</span>
          </h1>
          <p className="mt-6 max-w-[54ch] text-[1rem] leading-relaxed">
            A concept campaign. Transparent hardware, transparent advertising:
            the product does not shout, so the campaign does not either.
          </p>
          <p className="mt-3 text-[.8rem] uppercase tracking-[.12em] text-[#5A5A5A]">Concept work, not commissioned by Nothing</p>
        </header>

        <div className="grid gap-5 pb-20" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
          {frames.map((f) => (
            <figure key={f.n} className="m-0">
              <img src={`/frames/${f.n}.jpg`} alt={f.title} loading="lazy" className="block w-full" />
              <figcaption className="pt-2 text-[.75rem] uppercase tracking-[.1em] text-[#5A5A5A]">{f.n} · {f.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
