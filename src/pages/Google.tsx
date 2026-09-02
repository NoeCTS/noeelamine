import { Link } from "react-router-dom";

/**
 * The Chrome zone. Deliberately the furthest thing from the archive's language:
 * white, centred, Google Sans, a blue pill. Modelled on the live Gemini in
 * Chrome page. Landing here from a black archive should feel like stepping into
 * a different building, and that contrast is the argument.
 *
 * Everything on this page is publicly announced. Nothing about unshipped work
 * goes here without a sign off first.
 */
export default function Google() {
  return (
    <main className="min-h-screen bg-white text-[#1F1F1F]" style={{ fontFamily: '"Google Sans", Archivo, sans-serif' }}>
      <div className="mx-auto w-[min(1080px,100%-2.5rem)] py-8">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <defs>
              <linearGradient id="gg" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#34A853" /><stop offset=".35" stopColor="#4285F4" />
                <stop offset=".72" stopColor="#EA4335" /><stop offset="1" stopColor="#FBBC04" />
              </linearGradient>
            </defs>
            <path fill="url(#gg)" d="M12 0c0 6.63 5.37 12 12 12-6.63 0-12 5.37-12 12 0-6.63-5.37-12-12-12C6.63 12 12 6.63 12 0Z" />
          </svg>
          <span className="text-[1.05rem] font-medium">Gemini</span>
          <Link to="/" className="ml-auto rounded-full border border-[#DADCE0] px-4 py-2 text-[13px] hover:bg-[#F8F9FA]">
            Back to the archive
          </Link>
        </div>

        <section className="flex flex-col items-center gap-5 py-20 text-center">
          <h1 className="m-0 max-w-[16ch] text-[clamp(2rem,5.5vw,3.6rem)] font-medium leading-[1.12] tracking-[-.028em]">
            Meet <span className="text-[#1B72E8]">Gemini</span> in Chrome
          </h1>
          <p className="m-0 max-w-[46ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-[#5F6368]">
            AI assistance, right in your browser. I do product marketing for the
            Chrome browser team.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <span className="rounded-full bg-[#4285F4] px-6 py-3 text-[.95rem] font-medium text-white">Coming soon</span>
            <span className="rounded-full border border-[#DADCE0] px-6 py-3 text-[.95rem]">APMM programme</span>
          </div>
        </section>

        <div className="rounded-[28px] bg-[#EEF1F6] p-4 md:p-6">
          <img src="/frames/048.jpg" alt="Noe at the Google London office"
            className="block w-full rounded-[16px] object-cover" style={{ aspectRatio: "16 / 10" }} />
          <p className="m-0 pt-4 text-center text-[.85rem] text-[#80868B]">
            Noe Elamine · Associate Product Marketing Manager, Chrome · London
          </p>
        </div>

        <section className="grid gap-8 py-20 md:grid-cols-3">
          {[
            ["The role", "Associate Product Marketing Manager on Chrome, through the APMM programme."],
            ["The work", "Bringing Gemini into the browser people already use every day."],
            ["The page", "A fuller case study follows once the work is public."],
          ].map(([h, p]) => (
            <div key={h} className="flex flex-col gap-2">
              <span className="text-[.8rem] uppercase tracking-[.1em] text-[#80868B]">{h}</span>
              <p className="m-0 text-[.98rem] leading-relaxed text-[#3C4043]">{p}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
