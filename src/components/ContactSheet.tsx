import { Link } from "react-router-dom";
import { Resolve } from "./Texture";
import { byAdded, publicFrames, NEWEST, type Frame } from "@/data/frames";

function Cell({ f }: { f: Frame }) {
  const fresh = f.added === NEWEST;
  const body = (
    <>
      <Resolve src={`/frames/${f.n}.jpg`} alt={f.title} />
      <span className="relative flex items-baseline justify-between gap-2 px-1.5 py-1">
        <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-klein transition-transform duration-300 group-hover:scale-y-100 group-focus-visible:scale-y-100" />
        <span className="num relative z-10 text-[14px] text-grey transition-colors group-hover:text-white">{f.n}</span>
        <span className="mono-sm relative z-10 text-right leading-snug transition-colors group-hover:text-white">
          {f.title}
          <br />
          {f.kind}
        </span>
      </span>
    </>
  );

  const flag = fresh ? (
    <span className="num absolute -top-2 right-0 text-[11px]" style={{ color: "var(--klein-lift)" }}>new</span>
  ) : null;

  // A frame that opens says so. Everything else is plainly not a link.
  return f.route ? (
    <Link to={f.route}
      className="group relative flex cursor-pointer flex-col gap-2 text-left outline-offset-4
                 ring-klein-lift transition-shadow hover:ring-2 focus-visible:ring-2">
      {body}
      <span className="mono-sm absolute left-1.5 top-1.5 z-20 bg-klein px-1.5 py-1 text-white opacity-0
                       transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Open {f.route}
      </span>
      {flag}
    </Link>
  ) : (
    <div className="group relative flex flex-col gap-2 text-left">
      {body}
      {flag}
    </div>
  );
}

/**
 * The index is a contact sheet ordered by when each frame entered the archive,
 * newest first. A campaign and a photograph of a pitch invasion carry the same
 * frame number; that flatness is the argument.
 */
export function ContactSheet({ frames = publicFrames() }: { frames?: Frame[] }) {
  const ordered = byAdded(frames);
  return (
    <div className="grid gap-x-5 gap-y-8" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}>
      {ordered.map((f) => <Cell key={f.n} f={f} />)}
    </div>
  );
}
