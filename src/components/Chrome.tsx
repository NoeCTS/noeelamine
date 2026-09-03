import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { NEWEST, publicFrames } from "@/data/frames";

const NAV = [
  { to: "/", label: "Index" },
  { to: "/photography", label: "Photography" },
  { to: "/google", label: "Google" },
  { to: "/aube", label: "Aube" },
  { to: "/betteride", label: "Betteride" },
  { to: "/nothing", label: "Nothing" },
  { to: "/berlin", label: "Berlin" },
  { to: "/archive", label: "Archive" },
];

/**
 * Fixed, so navigation never requires scrolling back past the opener. That was
 * the actual bug: returning to the index dumped you at a full screen photograph
 * with the links buried underneath it.
 */
export function SiteNav() {
  const { pathname } = useLocation();
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-void/95">
      <nav className="nav-rail wrap flex flex-nowrap items-center gap-2 overflow-x-auto py-2.5" aria-label="Sections">
        {NAV.map((n, i) => {
          const on = pathname === n.to;
          return (
            <Link key={n.to} to={n.to} className="stamp min-h-11 flex-none" aria-current={on ? "page" : undefined}
              style={{ ["--tilt" as string]: i % 2 ? "1.1deg" : "-1.4deg" }}>
              <span>{n.label}</span>
            </Link>
          );
        })}
        <Link to="/index.txt" className="mono flex min-h-11 flex-none items-center px-2 hover:text-ink">index.txt</Link>
      </nav>
    </div>
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

/** A link that looks like a link, in a document with no rules anywhere else. */
export function Back({ to = "/#index", label = "Back to the index" }: { to?: string; label?: string }) {
  return <Link to={to} className="stamp inline-flex min-h-11 items-center"><span>{label}</span></Link>;
}

export function Foot() {
  return (
    <footer className="mt-24 flex flex-wrap justify-between gap-x-10 gap-y-3 pb-16">
      <span className="mono">Noe Elamine</span>
      <Link to="/index.txt" className="mono hover:text-ink">index.txt</Link>
      <a href="mailto:noe.elmne@gmail.com" className="mono hover:text-ink">noe.elmne@gmail.com</a>
    </footer>
  );
}
