import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { NEWEST, publicFrames } from "@/data/frames";

const NAV = [
  { to: "/google", label: "Google" },
  { to: "/photography", label: "Photography" },
  { to: "/graphic-design", label: "Graphic design" },
  { to: "/aube", label: "Aube" },
  { to: "/betteride", label: "Betteride" },
  { to: "/nothing", label: "Nothing" },
  { to: "/berlin", label: "Berlin" },
  { to: "/archive", label: "Archive" },
  { to: "/#index", label: "Index" },
  { to: "/index.txt", label: "index.txt" },
];

/**
 * The sections, set as an index at the foot of the page rather than a bar
 * bolted over the top of it. Same grammar as the archive list underneath it —
 * a rule, a number, a name — so it reads as the last entry in the document
 * instead of as chrome sitting on top of one.
 */
/**
 * `main` is the landing page's whole content: the sections, named large, in the
 * house display face. `foot` is the same list run small at the end of every
 * other page. One source, so the two can never drift apart.
 */
export function SiteNav({ scale = "foot" }: { scale?: "foot" | "main" }) {
  const { pathname } = useLocation();
  const main = scale === "main";
  // On the landing page the list is a place to go next, so the row that points
  // back at where you already are is dropped rather than shown as current.
  const items = main ? NAV.filter((n) => pathname !== n.to.split("#")[0]) : NAV;

  return (
    <nav className={main ? "grid grid-cols-1 sm:grid-cols-2" : "mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}
      aria-label="Sections">
      {items.map((n, i) => {
        const on = pathname === n.to.split("#")[0];
        return (
          // labelled explicitly: the ordinal is decoration, and without this a
          // screen reader announces the link as "zero two Photography"
          <Link key={n.to} to={n.to} aria-current={on ? "page" : undefined} aria-label={n.label}
            className={`nav-row grid items-baseline gap-3 ${main
              ? "grid-cols-[44px_minmax(0,1fr)] py-6"
              : "grid-cols-[34px_minmax(0,1fr)] py-3.5"}`}>
            <span className={main ? "num text-[14px]" : "num text-[12px]"} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display uppercase leading-none"
              style={{ fontSize: main ? "clamp(1.7rem,5.5vw,3rem)" : "clamp(1rem,2.2vw,1.3rem)", fontWeight: 400 }}>
              {n.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/** A number that goes up is the cheapest proof someone is still making things. */
export function Masthead({ title, note }: { title: ReactNode; note?: string }) {
  const count = publicFrames().length;
  return (
    <header className="grid grid-cols-1 items-start gap-x-8 gap-y-5 pt-10 sm:grid-cols-[minmax(0,1fr)_auto]">
      <h1 className="m-0 font-display uppercase leading-[.86]"
        style={{ fontSize: "clamp(2.4rem,9vw,5.6rem)", fontWeight: 400 }}>{title}</h1>
      <div className="flex flex-row flex-wrap items-baseline gap-x-4 gap-y-1.5 sm:flex-col sm:items-end sm:text-right">
        <span className="mono">{note ?? "Archive"}</span>
        <span className="mono">{count} frames</span>
        <span className="num text-[13px]" style={{ color: "var(--klein-lift)" }}>{NEWEST}</span>
      </div>
    </header>
  );
}

/** The sections, then the signature. Every page ends the same way — except the
 *  landing page, which carries the sections as its body and asks for `nav`
 *  off so the same list does not run twice. */
export function Foot({ nav = true }: { nav?: boolean }) {
  return (
    <>
      {nav && <SiteNav />}
      <footer className="mt-12 flex flex-wrap justify-between gap-x-10 gap-y-3 pb-16">
        <span className="mono">Noe Elamine</span>
        <a href="mailto:noe.elmne@gmail.com" className="mono hover:text-ink">noe.elmne@gmail.com</a>
      </footer>
    </>
  );
}
