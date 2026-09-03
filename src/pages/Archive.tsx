import { Link } from "react-router-dom";
import { Masthead, Foot, Back } from "@/components/Chrome";
import { byAdded, publicFrames, GROUP_LABEL, NEWEST } from "@/data/frames";

/** The whole archive as a list. Every frame, dated, in the order it arrived. */
export default function Archive() {
  const rows = byAdded(publicFrames());
  const months = rows.reduce<Record<string, number>>((acc, f) => {
    acc[f.added] = (acc[f.added] ?? 0) + 1;
    return acc;
  }, {});
  const scale = Math.max(...Object.values(months));
  const order = Object.keys(months).sort();

  return (
    <div className="wrap pt-nav relative z-[1]">
      <Masthead title="The archive" note="Everything, dated" />
      <p className="mt-9 max-w-[56ch] text-[clamp(1.02rem,1.5vw,1.2rem)] leading-snug">
        Every frame carries two dates: when it was made, and when it entered the
        archive. <span className="text-grey">This list is ordered by the second one,
        newest first, so it reads as a record of the thing growing rather than an
        arbitrary grid.</span>
      </p>

      <section className="mt-16">
        <div className="flex items-end gap-0.5 overflow-x-auto pb-2">
          {order.map((m) => (
            <div key={m} className="flex min-w-[62px] flex-none flex-col gap-1.5">
              <b className="num text-[13px] font-normal text-ink">{String(months[m]).padStart(2, "0")}</b>
              <div style={{ height: `${18 + (months[m] / scale) * 54}px`,
                background: m === NEWEST ? "var(--klein-lift)" : "var(--klein)" }} />
              <span className="num text-[11px] text-grey">{m}</span>
            </div>
          ))}
        </div>
        <p className="mono mt-2">Frames by month added. The bar at the right is the most recent.</p>
      </section>

      <section className="mt-16">
        {rows.map((f) => {
          const content = (
            <>
              <span className="num text-[14px] text-grey">{f.n}</span>
              <span className="text-[15px]">
                {f.title}<span className="text-grey"> · {f.kind} · {GROUP_LABEL[f.group]}</span>
              </span>
              <span className="num col-start-2 flex flex-wrap items-center justify-between gap-x-2 whitespace-nowrap text-[12px] text-grey-dim sm:col-start-auto sm:block">
                {f.route && <b className="bg-klein px-1.5 py-0.5 font-normal uppercase text-white sm:mr-3">Open</b>}
                {f.made ?? "—"} <span style={{ color: f.added === NEWEST ? "var(--klein-lift)" : undefined }}>{f.added}</span>
              </span>
            </>
          );
          const cls = "grid grid-cols-[38px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 px-1.5 py-3 hover:bg-void-2 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:gap-4";
          return f.route ? (
            <Link key={f.n} to={f.route} className={cls} aria-label={`Open ${f.title} case study`}>
              {content}
            </Link>
          ) : (
            <div key={f.n} className={cls}>{content}</div>
          );
        })}
      </section>

      <p className="mt-10"><Back /></p>
      <Foot />
    </div>
  );
}
