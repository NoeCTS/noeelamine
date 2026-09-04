import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Resolve } from "./Texture";
import { byAdded, frameHref, publicFrames, NEWEST, GROUP_LABEL, type Frame } from "@/data/frames";

type View = "grid" | "list";

function useView(): [View, (v: View) => void] {
  const [view, set] = useState<View>(() => {
    try { return (localStorage.getItem("index-view") as View) ?? "grid"; } catch { return "grid"; }
  });
  useEffect(() => { try { localStorage.setItem("index-view", view); } catch { /* private mode */ } }, [view]);
  return [view, set];
}

function Meta({ f }: { f: Frame }) {
  return (
    <span className="relative flex items-baseline justify-between gap-2 px-1.5 py-1">
      <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-klein transition-transform duration-300 group-hover:scale-y-100 group-focus-visible:scale-y-100" />
      <span className="num relative z-10 text-[13px] text-grey transition-colors group-hover:text-white">{f.n}</span>
      <span className="mono-sm relative z-10 text-right leading-snug transition-colors group-hover:text-white">
        {f.title}<br />{f.kind}
      </span>
    </span>
  );
}

function Cell({ f }: { f: Frame }) {
  const fresh = f.added === NEWEST;
  const href = frameHref(f);
  const flag = fresh ? (
    <span className="num absolute -top-2 right-0 z-20 text-[11px]" style={{ color: "var(--klein-lift)" }}>new</span>
  ) : null;
  const inner = (
    <>
      <Resolve src={`/frames/${f.n}.jpg`} alt={f.title} />
      <Meta f={f} />
    </>
  );
  return (
    <Link to={href} aria-label={`Open ${f.title}`}
      className="scan group relative flex cursor-pointer flex-col gap-2 text-left outline-offset-4 ring-klein-lift transition-shadow hover:ring-2 focus-visible:ring-2">
      {inner}
      <span className="mono-sm absolute left-1.5 top-1.5 z-20 bg-klein px-1.5 py-1 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Open {GROUP_LABEL[f.group]}
      </span>
      {flag}
    </Link>
  );
}

function Row({ f }: { f: Frame }) {
  const fresh = f.added === NEWEST;
  const href = frameHref(f);
  const body = (
    <span className="index-row grid w-full grid-cols-[46px_1fr_auto] items-baseline gap-4 py-2.5 text-left sm:grid-cols-[54px_1fr_150px_120px_74px]">
      <span className="num text-[13px] text-grey-dim">{f.n}</span>
      <span className="text-[14.5px]">{f.title}</span>
      <span className="mono-sm hidden sm:block">{f.kind}</span>
      <span className="mono-sm hidden sm:block">{GROUP_LABEL[f.group]}</span>
      <span className="mono-sm text-right" style={fresh ? { color: "var(--klein-lift)" } : undefined}>{f.added}</span>
    </span>
  );
  return (
    <li className="scan scan-row rule-top">
      <Link to={href} className="block" aria-label={`Open ${f.title}`}>{body}</Link>
    </li>
  );
}

/**
 * The index, ordered by when each frame entered the archive. Grid is the
 * default; the list exists because forty one frames of pictures is a lot of
 * scrolling when you already know what you are looking for.
 */
export function ContactSheet({ frames = publicFrames() }: { frames?: Frame[] }) {
  const ordered = byAdded(frames);
  const [view, setView] = useView();

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2.5">
        {(["grid", "list"] as View[]).map((v, i) => (
          <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v}
            className={`stamp min-h-11 ${view === v ? "on" : ""}`}
            style={{ ["--tilt" as string]: i % 2 ? "1.1deg" : "-1.4deg" }}>
            <span>{v === "grid" ? "Contact sheet" : "List"}</span>
          </button>
        ))}
      </div>

      {view === "grid" ? (
        <div className="grid gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(clamp(132px,20vw,168px),1fr))" }}>
          {ordered.map((f) => <Cell key={f.n} f={f} />)}
        </div>
      ) : (
        <ol className="m-0 list-none p-0">
          {ordered.map((f) => <Row key={f.n} f={f} />)}
        </ol>
      )}
    </>
  );
}
