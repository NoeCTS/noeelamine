import { useEffect, useRef } from "react";
import { Foot } from "@/components/Chrome";
import { toAscii, fitSize } from "@/lib/ascii";
import { publicFrames, NEWEST } from "@/data/frames";

const TEXT = `NOE ELAMINE
================================================

  Associate Product Marketing Manager at Google,
  on the Chrome browser team. London.

  Founder of Aube, a cultural intelligence platform
  that analyses campaigns for appropriation,
  tokenism, stereotyping and visual authenticity
  across 90+ markets.

  Before: strategy and growth at Betteride, Berlin.
  Marketing at Publicis One Touch, Hamburg.

  BSc Management, ESCP.
  MSc Strategic Marketing, Imperial.

  English, French, German.

  This is an archive rather than a portfolio. It is
  ordered by when things were added, not by how
  impressive they are.

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
    <div className="wrap page-top relative z-[1]">
      <div className="grid gap-10 md:grid-cols-2">
        <pre ref={pre} aria-hidden="true" className="m-0 overflow-hidden whitespace-pre text-ink"
          style={{ fontFamily: "var(--data)", lineHeight: 1.06 }} />
        <pre className="m-0 overflow-x-auto whitespace-pre text-[13px] leading-relaxed text-grey"
          style={{ fontFamily: "var(--data)" }}>{TEXT}
          {`\n  ${publicFrames().length} frames. Last added ${NEWEST}.\n`}
        </pre>
      </div>
      <Foot />
    </div>
  );
}
