import { Link } from "react-router-dom";
import { publicFrames, NEWEST } from "@/data/frames";

/**
 * The same landing page argued a different way, for comparison rather than to
 * replace it: light ground, one grotesque, and a twelve column grid that
 * everything actually sits on.
 *
 * The archive's version reaches for texture — a character field behind the
 * type, a display face built out of drawn figures. This one takes the opposite
 * position. Nothing is decorated. Hierarchy is carried by size, weight and
 * position on the grid, which is the whole argument of Swiss typography, and
 * the only ornament is the rule between sections.
 */

const SECTIONS: [string, string, string][] = [
  ["01", "Google", "/google"],
  ["02", "Photography", "/photography"],
  ["03", "Graphic design", "/graphic-design"],
  ["04", "Aube", "/aube"],
  ["05", "Betteride", "/betteride"],
  ["06", "Nothing", "/nothing"],
  ["07", "Berlin", "/berlin"],
  ["08", "Archive", "/archive"],
  ["09", "Colophon", "/index.txt"],
];

const INK = "#111111";
const RULE = "#DADAD6";
const MUTED = "#6B6B66";
const PAPER = "#FBFBF9";

/** Every band in the page hangs off the same twelve columns. */
function Band({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto grid w-[min(1240px,100%-3rem)] grid-cols-4 gap-x-5 md:grid-cols-12 ${className}`}>
      {children}
    </div>
  );
}

export default function Swiss() {
  const total = publicFrames().length;
  const sans = 'Archivo, "Helvetica Neue", Helvetica, Arial, sans-serif';

  return (
    <main className="min-h-screen" style={{ background: PAPER, color: INK, fontFamily: sans }}>
      <div className="py-12 md:py-20">

        {/* Masthead. The name takes eight columns, the facts take the last four,
            set small and flush right so the two read as one line of information. */}
        <Band>
          <h1 className="col-span-4 m-0 md:col-span-8"
            style={{ fontSize: "clamp(2.6rem,7.4vw,5.6rem)", fontWeight: 600,
                     letterSpacing: "-.035em", lineHeight: .92 }}>
            Noé Elamine
          </h1>
          <div className="col-span-4 flex flex-col gap-1 self-end md:col-span-4 md:items-end md:text-right"
            style={{ fontSize: ".8rem", letterSpacing: ".01em", color: MUTED }}>
            <span>An archive of my work</span>
            <span>{total} frames</span>
            <span style={{ color: INK }}>{NEWEST}</span>
          </div>
        </Band>

        <Band className="mt-10 md:mt-14">
          <div className="col-span-4 md:col-span-12" style={{ borderTop: `1px solid ${INK}` }} />
        </Band>

        {/* Copy on six columns, portrait on four, a column of air between them. */}
        <Band className="mt-8 md:mt-10">
          <div className="col-span-4 flex flex-col gap-5 md:col-span-6"
            style={{ fontSize: "1.0625rem", lineHeight: 1.55, letterSpacing: "-.003em" }}>
            <p className="m-0">
              I work as an <b style={{ fontWeight: 600 }}>Associate Product Marketing
              Manager at Google</b> on the Chrome browser team.
            </p>
            <p className="m-0">
              In my free time I am also building{" "}
              <a href="https://aube-ai.com" target="_blank" rel="noopener noreferrer"
                style={{ fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Aube
              </a>, a platform that analyses marketing campaigns for cultural
              appropriation, tokenism, stereotypes, and visual authenticity across
              90+ markets.
            </p>
            <p className="m-0">I did my undergrad at ESCP and my postgrad at Imperial.</p>
            <p className="m-0">I like learning about AI and building cool stuff.</p>
            <p className="m-0" style={{ color: MUTED }}>
              This is an archive of all my work. Thanks for taking a look.
            </p>
          </div>

          <figure className="col-span-4 m-0 mt-8 md:col-span-4 md:col-start-9 md:mt-0">
            <img src="/portrait.jpg" alt="Noé Elamine"
              className="block w-full" style={{ aspectRatio: "1 / 1", objectFit: "cover", filter: "grayscale(1)" }} />
            <figcaption className="mt-2" style={{ fontSize: ".75rem", color: MUTED }}>
              Noé Elamine · London
            </figcaption>
          </figure>
        </Band>

        {/* The sections. A number, a rule, a name — the same row repeated, which
            is what makes a list read as a system rather than as nine decisions. */}
        <Band className="mt-16 md:mt-24">
          <p className="col-span-4 m-0 md:col-span-12"
            style={{ fontSize: ".7rem", letterSpacing: ".14em", textTransform: "uppercase", color: MUTED }}>
            Sections
          </p>
        </Band>

        <Band className="mt-4">
          <ol className="col-span-4 m-0 list-none p-0 md:col-span-12">
            {SECTIONS.map(([n, label, to]) => (
              <li key={to}>
                <Link to={to} className="swiss-row grid grid-cols-4 items-baseline gap-x-5 py-4 md:grid-cols-12"
                  style={{ borderTop: `1px solid ${RULE}`, color: INK }}>
                  <span className="col-span-1" style={{ fontSize: ".8rem", color: MUTED }}>{n}</span>
                  <span className="col-span-3 md:col-span-8"
                    style={{ fontSize: "clamp(1.35rem,3.1vw,2.1rem)", fontWeight: 500, letterSpacing: "-.025em" }}>
                    {label}
                  </span>
                  <span className="hidden md:col-span-3 md:block" style={{ fontSize: ".8rem", color: MUTED }}>{to}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Band>

        <Band className="mt-20">
          <div className="col-span-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 md:col-span-12"
            style={{ borderTop: `1px solid ${INK}`, paddingTop: "1rem", fontSize: ".8rem", color: MUTED }}>
            <span>Noé Elamine</span>
            <a href="mailto:noe.elmne@gmail.com" style={{ color: MUTED }}>noe.elmne@gmail.com</a>
            <Link to="/#index" style={{ color: INK, textDecoration: "underline", textUnderlineOffset: "3px" }}>
              The dark version
            </Link>
          </div>
        </Band>

      </div>
    </main>
  );
}
