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
];

/** Buttons are objects, not rectangles. This one is a rubber stamp. */
export function Nav() {
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-wrap gap-2.5 py-2" aria-label="Sections">
      {NAV.map((n, i) => (
        <Link key={n.to} to={n.to} className="stamp"
          aria-current={pathname === n.to ? "true" : undefined}
          style={{ ["--tilt" as string]: i % 2 ? "1.1deg" : "-1.4deg" }}>
          <span>{n.label}</span>
        </Link>
      ))}
    </nav>
  );
}

/** A number that goes up is the cheapest proof someone is still making things. */
export function Masthead({ title, note }: { title: ReactNode; note?: string }) {
  const count = publicFrames().length;
  return (
    <header className="grid grid-cols-[1fr_auto] items-start gap-x-8 gap-y-5 pt-10">
      <h1 className="m-0 font-display uppercase leading-[.86]"
        style={{ fontSize: "clamp(2.4rem,9vw,5.6rem)", fontWeight: 400 }}>{title}</h1>
      <div className="flex flex-col items-end gap-1.5 text-right">
        <span className="mono">{note ?? "Archive"}</span>
        <span className="mono">{count} frames</span>
        <span className="num text-[13px]" style={{ color: "var(--klein-lift)" }}>{NEWEST}</span>
      </div>
    </header>
  );
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
