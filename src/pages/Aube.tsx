import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Aube, built on the product's own tokens rather than an impression of them.
 * Pulled from the live stylesheet: landing-bg 240 5% 3%, surface 240 5% 8%,
 * border 240 5% 12%, accent 28 79% 57%, secondary text 240 2% 65%.
 */
const T = {
  bg: "hsl(240 5% 3%)",
  surface: "hsl(240 5% 8%)",
  border: "hsl(240 5% 12%)",
  accent: "hsl(28 79% 57%)",
  accentHi: "hsl(38 91% 55%)",
  accent3: "hsl(43 100% 64%)",
  glow: "hsl(38 100% 88%)",
  text: "hsl(60 8% 96%)",
  text2: "hsl(240 2% 65%)",
  text3: "hsl(240 2% 43%)",
  danger: "hsl(4 76% 61%)",
  info: "hsl(212 76% 63%)",
  beta: "hsl(243 52% 50%)",
};

const CITIES = ["Sydney", "Lagos", "Jakarta", "São Paulo", "Seoul", "Cairo", "Mumbai"];

const TERMS: [string, string, string][] = [
  ["Cultural appropriation", "5%", "10%"], ["Tokenism", "63%", "7%"],
  ["Stereotyping", "76%", "18%"], ["Colour symbolism", "3%", "27%"],
  ["Religious insensitivity", "68%", "32%"], ["Translation error", "72%", "70%"],
  ["Gesture misread", "4%", "76%"], ["Historical blindspot", "56%", "84%"],
  ["Gender norms", "13%", "89%"], ["Visual taboo", "42%", "93%"],
];

const FRAMEWORKS: [string, string][] = [
  ["Hofstede", "Six cultural dimensions, used to predict how a message lands against local norms around power, individualism and uncertainty."],
  ["Hall", "High and low context communication. Whether a campaign says the thing or implies it, and whether that reads as respect or evasion."],
  ["Schwartz", "Basic human values, mapped per market, so a claim about freedom or tradition is checked against what the market actually prizes."],
  ["Trompenaars", "Seven dimensions of culture, weighted for how a market treats rules, relationships and time."],
  ["GLOBE", "Leadership and societal practice data across sixty plus societies, used for the gap between values held and values practised."],
];

const CHECKS: [string, string, string][] = [
  ["Cultural appropriation", "Sacred and traditional imagery used decoratively, outside its context and without credit.", T.danger],
  ["Tokenism", "Representation that is present but powerless: background casting, no agency, no lines.", T.danger],
  ["Stereotyping", "Roles, settings and props that repeat a market's tired shorthand for itself.", T.accent],
  ["Colour and symbol", "Palettes and motifs that carry meanings in market you did not intend at home.", T.accent],
  ["Translation and gesture", "Copy that inverts, and hand signs that insult, once localised.", T.info],
  ["Visual authenticity", "Whether the imagery was made with the market or merely about it.", T.info],
];

export default function Aube() {
  const [city, setCity] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setCity((c) => (c + 1) % CITIES.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  const pill = {
    background: `linear-gradient(180deg, ${T.accentHi} 0%, ${T.accent} 100%)`,
    boxShadow: `0 0 28px hsl(28 79% 57% / .32)`,
  };

  return (
    <main className="min-h-screen" style={{ background: T.bg, color: T.text }}>
      <div className="mx-auto w-[min(1120px,100%-2.5rem)]">

        <nav className="flex items-center gap-3 py-6">
          <span className="h-4 w-4 flex-none rounded-full"
            style={{ background: `conic-gradient(from 180deg, ${T.accent3}, ${T.accent} 40%, hsl(240 5% 12%) 75%, ${T.accent3})` }} />
          <span className="text-[.95rem]">Aube</span>
          <span className="ml-3 hidden gap-5 text-[.85rem] md:flex" style={{ color: T.text2 }}>
            <span>How it works</span><span>Reports</span><span>For NGOs</span>
          </span>
          <a href="https://aube-ai.com" target="_blank" rel="noreferrer"
            className="ml-auto rounded-md px-3.5 py-2 text-[.82rem]" style={{ ...pill, color: "hsl(240 5% 3%)" }}>
            Request early access
          </a>
        </nav>

        {/* Hero */}
        <section className="relative flex min-h-[78vh] flex-col items-center justify-center gap-6 text-center">
          {TERMS.map(([t, l, top]) => (
            <span key={t} aria-hidden="true"
              className="pointer-events-none absolute whitespace-nowrap text-[9px] uppercase tracking-[.14em]"
              style={{ left: l, top, color: T.text3 }}>{t}</span>
          ))}
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em]" style={{ color: T.text2 }}>
            <i className="block h-1.5 w-1.5 rounded-full" style={{ background: T.accent }} />
            Cultural intelligence for global brands · powered by peer reviewed research
          </span>
          <h1 className="m-0 max-w-[20ch] text-[clamp(1.9rem,5.4vw,3.4rem)] font-normal leading-[1.14] tracking-[-.012em]"
            style={{ fontFamily: '"abacaxi-latin-variable", Abacaxi, "range-sans-variable", sans-serif' }}>
            Your campaign launched in{" "}
            <span style={{ color: T.accent }}>{CITIES[city]}</span>
          </h1>
          <p className="m-0 max-w-[48ch] text-[1rem] leading-relaxed" style={{ color: T.text2 }}>
            Aube analyses your creative against five academic frameworks across
            90+ markets. Catch what you would otherwise miss.
          </p>
          <a href="https://aube-ai.com" target="_blank" rel="noreferrer"
            className="rounded-full px-7 py-3.5 text-[.95rem]" style={{ ...pill, color: "hsl(240 5% 3%)" }}>
            Get your first analysis
          </a>
          <span className="text-[.8rem]" style={{ color: T.text3 }}>Results in under 2 minutes</span>
        </section>

        {/* What it is */}
        <section className="py-24">
          <p className="mb-3 text-[10px] uppercase tracking-[.16em]" style={{ color: T.text3 }}>What it is</p>
          <h2 className="m-0 max-w-[24ch] text-[clamp(1.5rem,3.6vw,2.4rem)] font-normal leading-tight"
            style={{ fontFamily: '"abacaxi-latin-variable", Abacaxi, sans-serif' }}>
            A campaign fails in a market nobody in the room is from.
          </h2>
          <p className="mt-5 max-w-[62ch] leading-relaxed" style={{ color: T.text2 }}>
            Global brands ship creative into markets they do not live in, and the
            problems only surface after launch, when the cost is a public apology.
            Aube reads a campaign the way a local would and returns the specific
            risk, the framework it comes from, and what to change. It is not
            sentiment analysis and it is not a vibe check.
          </p>
        </section>

        {/* How it works */}
        <section className="py-8">
          <p className="mb-6 text-[10px] uppercase tracking-[.16em]" style={{ color: T.text3 }}>How it works</p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["01", "Upload the creative", "Images, video, copy, or a whole campaign. Pick the markets it is going into."],
              ["02", "Run five frameworks", "Every asset is scored against Hofstede, Hall, Schwartz, Trompenaars and GLOBE, per market."],
              ["03", "Read the report", "Ranked findings with severity, the evidence behind each one, and a recommended change."],
            ].map(([n, h, p]) => (
              <div key={n} className="rounded-xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <span className="text-[.8rem]" style={{ color: T.accent }}>{n}</span>
                <h3 className="mb-2 mt-2 text-[1.05rem] font-medium">{h}</h3>
                <p className="m-0 text-[.9rem] leading-relaxed" style={{ color: T.text2 }}>{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The frameworks */}
        <section className="py-20">
          <p className="mb-6 text-[10px] uppercase tracking-[.16em]" style={{ color: T.text3 }}>The five frameworks</p>
          <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {FRAMEWORKS.map(([name, what]) => (
              <div key={name} className="flex gap-4">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full" style={{ background: T.accent }} />
                <div>
                  <h3 className="m-0 text-[1rem] font-medium">{name}</h3>
                  <p className="m-0 mt-1 text-[.9rem] leading-relaxed" style={{ color: T.text2 }}>{what}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What it catches */}
        <section className="py-8">
          <p className="mb-6 text-[10px] uppercase tracking-[.16em]" style={{ color: T.text3 }}>What it catches</p>
          <div className="grid gap-3 md:grid-cols-2">
            {CHECKS.map(([h, p, c]) => (
              <div key={h} className="rounded-xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                  <h3 className="m-0 text-[1rem] font-medium">{h}</h3>
                </div>
                <p className="m-0 text-[.9rem] leading-relaxed" style={{ color: T.text2 }}>{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it is for */}
        <section className="grid gap-3 py-20 md:grid-cols-2">
          <div className="rounded-xl p-6" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <h3 className="m-0 text-[1.15rem] font-medium">For brands</h3>
            <p className="mt-2 text-[.92rem] leading-relaxed" style={{ color: T.text2 }}>
              Tiered B2B pricing by market count and volume, so a team running one
              launch and an agency running forty are not paying the same way.
            </p>
          </div>
          <div className="rounded-xl p-6" style={{ background: `linear-gradient(150deg, hsl(243 52% 20%) 0%, ${T.surface} 70%)`, border: `1px solid ${T.border}` }}>
            <h3 className="m-0 text-[1.15rem] font-medium">For NGOs</h3>
            <p className="mt-2 text-[.92rem] leading-relaxed" style={{ color: T.text2 }}>
              Free access programme. The organisations most likely to be
              communicating across cultures are usually the least able to pay for
              help doing it, which made the pricing decision straightforward.
            </p>
            <span className="mt-3 inline-block rounded-full px-3 py-1 text-[.72rem]"
              style={{ background: T.beta, color: "#fff" }}>Free programme</span>
          </div>
        </section>

        {/* My role */}
        <section className="py-8">
          <p className="mb-6 text-[10px] uppercase tracking-[.16em]" style={{ color: T.text3 }}>My role</p>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ["Founder, 2025 to now", "Started it, still running it. The only entry in the archive that is not finished."],
              ["Product", "Designed and built the product architecture, the AI analysis frameworks and the cultural sensitivity databases from scratch."],
              ["Go to market", "Competitive positioning, tiered B2B pricing, and the NGO partnership programme. Most people who can build the thing cannot price it."],
            ].map(([h, p]) => (
              <div key={h}>
                <h3 className="m-0 text-[1rem] font-medium" style={{ color: T.accent }}>{h}</h3>
                <p className="mt-2 text-[.92rem] leading-relaxed" style={{ color: T.text2 }}>{p}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-6 border-t py-10"
          style={{ borderColor: T.border }}>
          <a href="https://aube-ai.com" target="_blank" rel="noreferrer"
            className="text-[.9rem]" style={{ color: T.accent }}>aube-ai.com</a>
          <span className="text-[.82rem]" style={{ color: T.text3 }}>Noe Elamine · founder</span>
          <Link to="/" className="rounded-md px-3.5 py-2 text-[.82rem]"
            style={{ border: `1px solid ${T.border}`, color: T.text2 }}>Back to the archive</Link>
        </footer>
      </div>
    </main>
  );
}
