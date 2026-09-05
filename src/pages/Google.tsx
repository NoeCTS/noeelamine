import { Link } from "react-router-dom";

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
          <div className="flex flex-wrap justify-center gap-2.5">
            <span className="rounded-full bg-[#1F1F1F] px-6 py-3 text-[.95rem] font-medium text-white">Chrome and Gemini</span>
            <span className="rounded-full border border-[#DADCE0] px-6 py-3 text-[.95rem]">UK market</span>
            <span className="rounded-full border border-[#DADCE0] px-6 py-3 text-[.95rem]">London</span>
          </div>
        </section>

        <div className="rounded-[28px] bg-[#EEF1F6] p-4 md:p-6">
          <img src="/frames/048.jpg" alt="Noe Elamine at the Google London office"
            className="block aspect-[4/3] w-full rounded-[16px] object-cover sm:aspect-[16/10]" />
          <p className="m-0 pt-4 text-center text-[.85rem] text-[#80868B]">
            Frame 048 · Google London
          </p>
        </div>


        {/* What the job actually consists of. The page was three paragraphs
            describing a title; a browser feature has a route to market, and the
            route is the thing worth explaining. */}
        <section className="py-20 sm:py-24">
          <span className="text-[.78rem] uppercase tracking-[.12em] text-[#80868B]">The work</span>
          <h2 className="m-0 mt-3 max-w-[22ch] text-[clamp(1.5rem,3.4vw,2.3rem)] font-medium leading-[1.15] tracking-[-.022em]">
            How a browser feature gets to the people who would use it
          </h2>
          <p className="m-0 mt-5 max-w-[62ch] text-[1rem] leading-relaxed text-[#5F6368]">
            Chrome is used by billions of people who did not choose it as a
            product so much as arrive at it. That makes marketing a browser a
            particular problem: almost nobody is shopping, so a new capability
            has to explain itself in the moment somebody meets it, in whatever
            language and market they meet it in.
          </p>

          <div className="mt-12 grid gap-x-10 gap-y-9 md:grid-cols-2">
            {[
              ["01", "Understand what changed",
               "Sit with the feature until you can say what it does in a sentence that is true. Most of the work that follows is downstream of getting that sentence right, and most launches that go wrong went wrong here."],
              ["02", "Decide what it means",
               "Positioning and naming: the words people will use for this whether or not you choose them. A name that describes the mechanism rarely survives contact; one that describes the result usually does."],
              ["03", "Read the field",
               "Competitive analysis, which is less about feature grids than about what everyone else is already claiming. Saying the same thing louder is the most expensive way to say nothing."],
              ["04", "Choose what ships loudest",
               "A release has more in it than anyone will remember. Feature prioritisation for the narrative decides which one carries the announcement and which are found later by the people who care."],
              ["05", "Build the external narrative",
               "Worked out with product, engineering, communications and legal, because a claim has to be accurate, defensible and interesting, and it is usually easy to get two of those."],
              ["06", "Land it market by market",
               "A launch is not one launch. Rollouts are staged, availability differs, and the line that works in one market can be meaningless or wrong in the next. That is the part I work on."],
            ].map(([n, h, p]) => (
              <div key={n}>
                <div className="flex items-baseline gap-3">
                  <span className="text-[.85rem] font-medium text-[#1B72E8]">{n}</span>
                  <h3 className="m-0 text-[1.1rem] font-medium leading-snug">{h}</h3>
                </div>
                <p className="m-0 mt-2 max-w-[46ch] text-[.95rem] leading-relaxed text-[#5F6368]">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 pb-20 md:grid-cols-2">
          <div className="rounded-[24px] bg-[#EEF1F6] p-7">
            <h3 className="m-0 text-[1.1rem] font-medium">The programme</h3>
            <p className="m-0 mt-2 text-[.95rem] leading-relaxed text-[#5F6368]">
              APMM is Google's two year rotation for early career marketers,
              running since 2003. Between seventy and a hundred people join each
              year across twenty nine offices, and everyone moves to a different
              role after the first, which is the point of it: you leave knowing
              how two parts of the company argue.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#E8EAED] p-7">
            <h3 className="m-0 text-[1.1rem] font-medium">What appears here</h3>
            <p className="m-0 mt-2 text-[.95rem] leading-relaxed text-[#5F6368]">
              Only work that is already public. Anything unannounced is not
              described, and specific case studies follow when they can be
              shared. The account above is how the job works, not a report on
              any particular launch.
            </p>
          </div>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-6 border-t border-[#E8EAED] py-10">
          <span className="text-[.85rem] text-[#5F6368]">Noe Elamine · Associate Product Marketing Manager at Google</span>
          <span className="text-[.78rem] text-[#9AA0A6]">A personal archive. Views my own, not Google's.</span>
          <Link to="/#index" className="inline-flex min-h-11 items-center rounded-full border border-[#DADCE0] px-4 py-2 text-[13px] transition-colors hover:bg-[#F8F9FA]">
            Back to the archive
          </Link>
        </footer>
      </div>
    </main>
  );
}
