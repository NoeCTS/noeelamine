import { Link } from "react-router-dom";
import { FRAMES } from "@/data/frames";

/** Teal, scanlines, chromatic split. The city at night, on tape. */
export default function Berlin() {
  const frames = FRAMES.filter((f) => f.group === "berlin");
  return (
    <main className="relative min-h-screen bg-[#0A0A0A] text-[#E9E4D7]" style={{ fontFamily: "var(--data)" }}>
      <div className="pointer-events-none fixed inset-0 z-10 opacity-50" aria-hidden="true"
        style={{ background: "repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.35) 2px 4px)" }} />
      <div className="relative z-20 mx-auto w-[min(1120px,100%-2.5rem)] py-8">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[.8rem] uppercase tracking-[.14em] text-[#1B6B65]">Unseen Scenes</span>
          <Link to="/" className="border border-[#1B6B65] px-3 py-1.5 text-[.78rem] uppercase tracking-[.1em]">
            Back to the archive
          </Link>
        </div>

        <header className="py-20">
          <h1 className="m-0 text-[clamp(2rem,8vw,5rem)] uppercase leading-[.95]"
            style={{ textShadow: "-3px 0 #FF0040, 3px 0 #00D5FF" }}>
            Unseen<br />Scenes
          </h1>
          <p className="mt-8 max-w-[52ch] text-[.95rem] leading-relaxed text-[#9C978B]">
            Berlin after dark, shot on a phone and graded like tape. Cool teal in
            the shadows, warm amber in the highlights, blacks crushed until the
            city reads as a set of signs rather than a place.
          </p>
        </header>

        <div className="grid gap-5 pb-20" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
          {frames.map((f) => (
            <figure key={f.n} className="m-0">
              <img src={`/frames/${f.n}.jpg`} alt={f.title} loading="lazy" className="block w-full" />
              <figcaption className="pt-2 text-[.72rem] uppercase tracking-[.1em] text-[#1B6B65]">{f.n} · {f.title} · {f.made}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
