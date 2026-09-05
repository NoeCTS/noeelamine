import { Link } from "react-router-dom";
import { ChromeMark, DinoRun } from "@/components/ChromeBits";

/**
 * The Google zone. Deliberately the furthest thing from the archive's language:
 * white, centred, Google Sans, a blue pill. Landing here from a black archive
 * should feel like walking into a different building.
 *
 * Kept general on purpose. Nothing here names a specific product or unshipped
 * work, so it needs no sign off and does not go stale when things change.
 */
export default function Google() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#1F1F1F]" style={{ fontFamily: '"Google Sans", Archivo, sans-serif' }}>
      <div className="mx-auto w-full max-w-[1080px] px-5 py-6 sm:px-8 sm:py-8">

        <div className="flex items-center gap-3">
          <span className="flex gap-1" aria-hidden="true">
            {["#4285F4", "#EA4335", "#FBBC04", "#34A853"].map((c) => (
              <i key={c} className="block h-2 w-2 rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span className="text-[1.05rem] font-medium">Google</span>
          <Link to="/#index" className="ml-auto inline-flex min-h-11 items-center rounded-full border border-[#DADCE0] px-4 py-2 text-[13px] transition-colors hover:bg-[#F8F9FA]">
            Back to the archive
          </Link>
        </div>

        <section className="flex flex-col items-center gap-6 py-20 text-center sm:py-24">
          <span className="text-[.78rem] uppercase tracking-[.12em] text-[#80868B]">Current work</span>
          <h1 className="m-0 max-w-[18ch] text-[clamp(2rem,5.5vw,3.6rem)] font-medium leading-[1.12] tracking-[-.028em]">
            Product marketing at <span className="text-[#1B72E8]">Google</span>
          </h1>
          <p className="m-0 max-w-[48ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-[#5F6368]">
            Associate Product Marketing Manager on Chrome, based in London and
            working the UK market. Joined through the APMM programme in 2026.
          </p>
        </section>

        <div className="rounded-[28px] bg-[#EEF1F6] p-4 md:p-6">
          <img src="/frames/048.jpg" alt="Noe Elamine at the Google London office"
            className="block aspect-[4/3] w-full rounded-[16px] object-cover sm:aspect-[16/10]" />
          <p className="m-0 pt-4 text-center text-[.85rem] text-[#80868B]">
            Frame 048 · Google London
          </p>
        </div>


        {/* Short, and in his own words. The page had grown into an essay
            about the discipline; what it needed was a sentence. */}
        <section className="py-20 sm:py-24">
          <div className="flex flex-col items-center gap-8 text-center">
            <ChromeMark />
            <p className="m-0 max-w-[40ch] text-[clamp(1.15rem,2.3vw,1.6rem)] font-medium leading-[1.35] tracking-[-.018em]">
              I work on Google Chrome, and at the moment mostly on{" "}
              <span className="text-[#1B72E8]">Gemini in Chrome</span>.
            </p>
          </div>

          <DinoRun />
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-6 border-t border-[#E8EAED] py-10">
          <span className="text-[.85rem] text-[#5F6368]">Noe Elamine · Associate Product Marketing Manager at Google</span>
          <Link to="/#index" className="inline-flex min-h-11 items-center rounded-full border border-[#DADCE0] px-4 py-2 text-[13px] transition-colors hover:bg-[#F8F9FA]">
            Back to the archive
          </Link>
        </footer>
      </div>
    </main>
  );
}
