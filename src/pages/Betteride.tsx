import { Link } from "react-router-dom";
import { FRAMES } from "@/data/frames";
import { Suspense, lazy } from "react";

const RouteMap = lazy(() => import("@/components/RouteMap").then((m) => ({ default: m.RouteMap })));

/**
 * Betteride runs two palettes and the case study carries both rather than
 * picking one: the amber and near black of the site, and the violet and acid
 * of the printed flyers. That split is the actual story of the launch.
 */
export default function Betteride() {
  // Frames that are another frame again. 035 is 014 under the same headline in
  // the same layout, differing only in the QR block; 033 is 032 with the two
  // text bars swapped. Side by side they read as a mistake rather than as two
  // separate pieces of work, so only the first of each pair runs.
  const REPEATED = new Set(["035", "033"]);
  const frames = FRAMES.filter((f) => f.group === "betteride" && !REPEATED.has(f.n));
  const flyers = frames.filter((f) => f.kind === "flyer");
  const rest = frames.filter((f) => f.kind !== "flyer");

  return (
    <main className="min-h-screen bg-[#0C0902] text-[#FFC000]">
      {/* The ride comes first and the work sits on it, at the point on the route
          where it happened. The grid below is the same pieces together, for
          anyone who would rather not ride for them. */}
      <Suspense fallback={<div className="route"><div className="route-stage" /></div>}>
        <RouteMap frames={frames} />
      </Suspense>

      <div className="mx-auto w-[min(1120px,100%-2.5rem)] py-8">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[.95rem] font-bold uppercase tracking-tight">Betteride</span>
          <Link to="/#index" className="border border-[#3A2F16] px-3 py-1.5 text-[.8rem] text-[#D7BD72] hover:text-[#FFC000]">
            Back to the archive
          </Link>
        </div>

        <header className="py-16">
          <h1 className="m-0 max-w-[14ch] text-[clamp(2.2rem,8vw,5rem)] font-bold uppercase leading-[.92] tracking-[-.02em]">
            Lost with a broken bike
          </h1>
          <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-[#D7BD72]">
            Multi channel launch campaign for a bike repair marketplace entering
            Berlin. Flyers, banners and street posters, plus the positioning
            underneath them.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5 text-[.8rem] font-bold uppercase">
            <span className="bg-[#6B3FE4] px-3 py-2 text-white">Strategy and growth</span>
            <span className="bg-[#FFE400] px-3 py-2 text-[#0C0902]">Berlin, 2026</span>
          </div>
        </header>

        {/* The route does not stop at the map: a line runs on down the page,
            swerving, with the work set out on a grid either side of it. */}
        <div className="bt-run" aria-hidden="true">
          <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
            <path d="M50 0 C50 90 22 130 22 210 C22 292 78 320 78 404 C78 488 20 512 20 596
                     C20 680 80 704 80 790 C80 872 50 906 50 1000" />
          </svg>
        </div>

        {([["01", "The flyers", flyers], ["02", "Banners and campaign images", rest]] as const)
          .map(([n, title, set]) => (
          <section key={n} className="bt-band">
            <div className="bt-grid">
              <span className="bt-num">{n}</span>
              <h2 className="bt-head">{title}</h2>
              <span className="bt-count">{set.length} pieces</span>
            </div>
            <div className="bt-grid bt-work">
              {set.map((f, i) => (
                <figure key={f.n} className={`m-0 bt-item ${i % 2 ? "is-right" : "is-left"}`}>
                  <img src={`/frames/${f.n}.jpg`} alt={f.title} loading="lazy" className="block w-full" />
                  <figcaption>
                    <span className="bt-item-n">{f.n}</span>
                    <span>{f.title}</span>
                    <span className="bt-item-kind">{f.kind}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}

        <div className="mb-16 bg-[#6B3FE4] p-8 text-white">
          <h3 className="m-0 mb-3 text-[clamp(1.2rem,3vw,1.8rem)] font-bold uppercase leading-tight">Two palettes, on purpose</h3>
          <p className="m-0 max-w-[54ch] leading-relaxed text-white/85">
            The product site runs amber on near black. The printed campaign runs
            violet and acid yellow. Keeping both is the honest record of a launch
            that had to work on a screen and on a lamp post.
          </p>
        </div>
      </div>
    </main>
  );
}
