import { useEffect, useRef } from "react";
import { Back } from "@/components/Chrome";
import { toAscii, fitSize } from "@/lib/ascii";
import { publicFrames, NEWEST } from "@/data/frames";

const TEXT = `NOE ELAMINE
================================================

  Product marketing at Google, on Chrome.
  Currently working on Gemini in Chrome.

  Building Aube, a cultural intelligence platform
  that analyses campaigns across 90+ markets.

  Before: Betteride in Berlin, Publicis in Hamburg.
  ESCP for the undergrad, Imperial for the postgrad.

  This site is an archive rather than a portfolio.
  It is ordered by when things were added, not by
  how impressive they are.

  noe.elmne@gmail.com
  linkedin.com/in/noeelamine
  aube-ai.com
`;

/** The colophon, rendered the way everything else here is rendered. */
export default function Colophon() {
  const pre = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const el = pre.current;
    if (!el) return;
    const img = new Image();
    img.onload = () => {
      const cols = 74;
      el.textContent = toAscii(img, cols);
      el.style.fontSize = `${fitSize(el.clientWidth || 600, cols).toFixed(2)}px`;
    };
    img.src = "/frames/027.jpg";
  }, []);

  return (
    <div className="wrap pt-nav relative z-[1]">
      <div className="grid gap-10 md:grid-cols-2">
        <pre ref={pre} aria-hidden="true" className="m-0 overflow-hidden whitespace-pre text-ink"
          style={{ fontFamily: "var(--data)", lineHeight: 1.06 }} />
        <pre className="m-0 overflow-x-auto whitespace-pre text-[13px] leading-relaxed text-grey"
          style={{ fontFamily: "var(--data)" }}>{TEXT}
          {`\n  ${publicFrames().length} frames. Last added ${NEWEST}.\n`}
        </pre>
      </div>
      <p className="mt-12"><Back /></p>
    </div>
  );
}
