import { Link } from "react-router-dom";
import { Nav, Masthead, Foot } from "@/components/Chrome";
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
    <div className="wrap relative z-[1]">
      <Masthead title="The archive" note="Everything, dated" />
      <p className="mt-9 max-w-[56ch] text-[clamp(1.02rem,1.5vw,1.2rem)] leading-snug">
        Every frame carries two dates: when it was made, and when it entered the
        archive. <span className="text-grey">This list is ordered by the second one,
        newest first, so it reads as a record of the thing growing rather than an
        arbitrary grid.</span>
      </p>
      <div className="mt-8"><Nav /></div>

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
        {rows.map((f) => (
          <div key={f.n} className="grid grid-cols-[52px_1fr_auto] items-baseline gap-4 px-1.5 py-3 transition-colors hover:bg-void-2">
            <span className="num text-[14px] text-grey">{f.n}</span>
            <span className="text-[15px]">
              {f.route ? <Link to={f.route} className="hover:text-klein-lift">{f.title}</Link> : f.title}
              <span className="text-grey"> · {f.kind} · {GROUP_LABEL[f.group]}</span>
            </span>
            <span className="num whitespace-nowrap text-[12px] text-grey-dim">
              {f.made ?? "—"} <span style={{ color: f.added === NEWEST ? "var(--klein-lift)" : undefined }}>{f.added}</span>
            </span>
          </div>
        ))}
      </section>

      <p className="mt-10"><Link to="/" className="stamp inline-block"><span>Back to the index</span></Link></p>
      <Foot />
    </div>
  );
}
