import { Link } from "react-router-dom";
import { Resolve } from "./Texture";
import { byAdded, publicFrames, NEWEST, type Frame } from "@/data/frames";

function Cell({ f }: { f: Frame }) {
  const fresh = f.added === NEWEST;
  const destination = f.route?.slice(1) || "";
  const body = (
    <>
      <Resolve src={`/frames/${f.n}.jpg`} alt={f.title} />
      <span className="relative flex items-baseline justify-between gap-2 px-1.5 py-1">
        <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-klein group-hover:scale-y-100 group-focus-visible:scale-y-100" />
        <span className="num relative z-10 text-[14px] text-grey group-hover:text-white">{f.n}</span>
        <span className="mono-sm relative z-10 text-right leading-snug group-hover:text-white">
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
      aria-label={`Open ${destination} case study: ${f.title}`}
      className="group relative flex cursor-pointer flex-col gap-2 text-left outline-offset-4 ring-klein-lift hover:ring-2 focus-visible:ring-2">
      {body}
      <span className="mono-sm absolute left-1.5 top-1.5 z-20 bg-klein px-2 py-1.5 text-white">
        Open {destination}
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
    <div className="grid gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(clamp(132px,20vw,168px),1fr))" }}>
      {ordered.map((f) => <Cell key={f.n} f={f} />)}
    </div>
  );
}
