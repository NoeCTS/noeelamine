import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap relative z-[1] flex min-h-screen flex-col items-start justify-center gap-6">
      <span className="num text-[clamp(3rem,14vw,9rem)] leading-none" style={{ color: "var(--klein-lift)" }}>404</span>
      <h1 className="m-0 font-display text-[clamp(1.6rem,5vw,3rem)] uppercase" style={{ fontWeight: 400 }}>No such frame</h1>
      <p className="max-w-[46ch] text-grey">That number is not in the archive. It may never have been shot.</p>
      <Link to="/#index" className="stamp"><span>Back to the index</span></Link>
    </div>
  );
}
