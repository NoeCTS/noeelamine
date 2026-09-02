import { Link } from "react-router-dom";

const TERMS = [
  ["Cultural appropriation", "6%", "12%"], ["Tokenism", "64%", "8%"],
  ["Stereotyping", "74%", "20%"], ["Colour symbolism", "3%", "30%"],
  ["Religious insensitivity", "68%", "34%"], ["Translation error", "70%", "72%"],
  ["Gesture misread", "5%", "78%"], ["Historical blindspot", "58%", "86%"],
  ["Gender norms", "12%", "90%"], ["Visual taboo", "44%", "94%"],
];

/**
 * The Aube zone, set in the product's own language: warm near black, amber,
 * and the drifting field of failure modes that is the live site's whole idea.
 * The problem space is visible before the copy says a word.
 */
export default function Aube() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#110C08] text-[#F2EDE6]">
      <div className="relative z-10 mx-auto w-[min(1080px,100%-2.5rem)]">
        <div className="flex items-center gap-2.5 py-6">
          <span className="h-4 w-4 flex-none rounded-full"
            style={{ background: "conic-gradient(from 180deg,#F5B65E,#E8913A 40%,#3A2A1C 75%,#F5B65E)" }} />
          <span className="text-[.95rem]">Aube</span>
          <Link to="/" className="ml-auto rounded-md border border-[#3A2E24] px-3 py-1.5 text-[.8rem] text-[#C9B9A8] hover:text-[#F2EDE6]">
            Back to the archive
          </Link>
        </div>

        <section className="relative flex min-h-[74vh] flex-col items-center justify-center gap-5 text-center">
          {TERMS.map(([t, l, top]) => (
            <span key={t} aria-hidden="true"
              className="pointer-events-none absolute whitespace-nowrap text-[9px] uppercase tracking-[.14em] text-[#5E5044]"
              style={{ left: l, top }}>{t}</span>
          ))}
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-[#8A7A6A]">
            <i className="block h-1.5 w-1.5 rounded-full bg-[#E8913A]" />
            Cultural intelligence for global brands
          </span>
          <h1 className="m-0 max-w-[18ch] text-[clamp(1.8rem,5vw,3.2rem)] font-normal leading-[1.14] tracking-[-.01em]"
            style={{ fontFamily: '"abacaxi-latin-variable", Abacaxi, "range-sans-variable", sans-serif' }}>
            Your campaign launched in <span className="text-[#E8913A]">Sydney</span>
          </h1>
          <p className="m-0 max-w-[46ch] text-[.98rem] leading-relaxed text-[#9A8B7C]">
            Aube analyses your creative against five academic frameworks across
            90+ markets. Catch what you would otherwise miss.
          </p>
          <a href="https://aube-ai.com" target="_blank" rel="noreferrer"
            className="rounded-full px-6 py-3 text-[.95rem] text-[#1A1208]"
            style={{ background: "linear-gradient(180deg,#F4AC55 0%,#E4882F 100%)", boxShadow: "0 0 26px rgba(232,145,58,.32)" }}>
            Open aube-ai.com
          </a>
          <span className="text-[.8rem] text-[#6E6156]">Founder, 2025 to now</span>
        </section>

        <section className="grid gap-10 py-20 md:grid-cols-3">
          {[
            ["What it is", "An AI platform that analyses marketing campaigns for cultural appropriation, tokenism, stereotypes and visual authenticity across 90+ markets, so a team catches a problem before it ships instead of apologising after."],
            ["What I did", "Designed and built the product architecture, the AI analysis frameworks and the cultural sensitivity databases from scratch, then wrote the go to market: competitive positioning, tiered B2B pricing, and the NGO partnership programme."],
            ["Why it matters", "Most people who can build the thing cannot price it. That combination is the actual story here."],
          ].map(([h, p]) => (
            <div key={h} className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[.14em] text-[#8A7A6A]">{h}</span>
              <p className="m-0 text-[.95rem] leading-relaxed text-[#C0B2A3]">{p}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
