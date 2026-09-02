import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const META: [string, string][] = [
  ["Project", "A night in Berlin"],
  ["Role", "Director / editor"],
  ["Duration", "3:24"],
  ["Location", "Kreuzberg, Friedrichshain, Mitte"],
  ["Year", "2026"],
];

/**
 * Berlin keeps its own language, carried over from the old site: outline hero
 * type, scanlines, chromatic split, a descent through the night. The video is
 * the piece; the stills are supporting material, not the headline.
 */
export default function Berlin() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [seen, setSeen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <main className="relative min-h-screen bg-[#0A0A0A] text-[#E9E4D7]" style={{ fontFamily: "var(--data)" }}>
      <div className="pointer-events-none fixed inset-0 z-10 opacity-50" aria-hidden="true"
        style={{ background: "repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.35) 2px 4px)" }} />

      <div className="relative z-20">
        {/* Hero: outline type, nothing behind it */}
        <section className="flex h-screen flex-col items-center justify-center px-6">
          <h1 className="m-0 text-center uppercase leading-[.85]"
            style={{
              fontSize: "clamp(4rem,20vw,16rem)", color: "transparent",
              WebkitTextStroke: "2px rgba(233,228,215,.85)", letterSpacing: "-.02em",
            }}>
            Berlin
          </h1>
          <p className="mt-6 text-[.85rem] uppercase tracking-[.3em] text-[#7E7A70]">A night out</p>
          <div className="absolute bottom-12 flex flex-col items-center gap-2">
            <span className="text-[.7rem] uppercase tracking-[.2em] text-[#5A5750]">Scroll to descend</span>
            <span className="block h-12 w-px bg-[#E9E4D7]/25" />
          </div>
        </section>

        {/* The piece */}
        <section ref={wrap} className="px-6 py-24">
          <div className="mx-auto w-[min(1000px,100%)]">
            <p className="mb-4 text-[.72rem] uppercase tracking-[.3em] text-[#1B6B65]">01 / The film</p>
            <div className="relative aspect-video overflow-hidden bg-black"
              style={{ boxShadow: seen ? "0 0 60px rgba(255,0,64,.14)" : "none", border: "1px solid rgba(27,107,101,.5)" }}>
              <video ref={video} src="/berlin/night.mp4" muted={muted} loop playsInline preload="metadata"
                className="h-full w-full object-cover" onClick={toggle}
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
              <div className="pointer-events-none absolute inset-0" aria-hidden="true"
                style={{ background: "repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.18) 2px 4px)" }} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" onClick={toggle}
                className="border border-[#1B6B65] px-4 py-2 text-[.75rem] uppercase tracking-[.16em] text-[#E9E4D7] hover:bg-[#1B6B65]">
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" onClick={() => { setMuted((m) => !m); if (video.current) video.current.muted = !muted; }}
                className="border border-[#3A3A38] px-4 py-2 text-[.75rem] uppercase tracking-[.16em] text-[#9C978B] hover:text-[#E9E4D7]">
                {muted ? "Sound off" : "Sound on"}
              </button>
              <span className="ml-auto text-[.72rem] uppercase tracking-[.16em] text-[#FF0040]">Rec</span>
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section className="px-6 py-16">
          <div className="mx-auto w-[min(820px,100%)]">
            {META.map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-4 py-4 text-[.85rem]">
                <span className="w-32 flex-none uppercase tracking-[.14em] text-[#5A5750]">{k}</span>
                <span className="h-px flex-1 bg-[#E9E4D7]/10" />
                <span className="text-right">{v}</span>
              </div>
            ))}
            <blockquote className="m-0 py-20 text-center uppercase leading-tight"
              style={{ fontSize: "clamp(1.5rem,5vw,3rem)", textShadow: "-2px 0 #FF0040, 2px 0 #00D5FF" }}>
              The bass finds you<br />before the door does.
            </blockquote>
            <p className="mx-auto max-w-[52ch] text-center text-[.9rem] leading-relaxed text-[#9C978B]">
              Berlin does not give you nightlife, it absorbs you into it. From the
              first pulse of bass in a queue to the bleary sunrise at Holzmarkt,
              this is an unfiltered descent into the city's underground.
            </p>
          </div>
        </section>

        {/* Dawn */}
        <section className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="mx-auto max-w-[36ch] space-y-6 text-center">
            <span className="block text-[clamp(1.6rem,5vw,2.6rem)] tracking-[.2em] text-[#00D5FF]">06:00</span>
            <p className="m-0 text-[1.05rem] leading-relaxed text-[#9C978B]">You surface.</p>
            <p className="m-0 text-[1.05rem] leading-relaxed text-[#9C978B]">The city remembers nothing.</p>
            <p className="m-0 text-[1.05rem] leading-relaxed text-[#E9E4D7]">But you do.</p>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-6 px-6 pb-20">
          <span className="text-[.72rem] uppercase tracking-[.16em] text-[#5A5750]">Unseen Scenes · Noe Elamine</span>
          <Link to="/" className="border border-[#1B6B65] px-4 py-2 text-[.72rem] uppercase tracking-[.16em] text-[#E9E4D7] transition-colors hover:bg-[#1B6B65]">
            Back to the archive
          </Link>
        </footer>
      </div>
    </main>
  );
}
