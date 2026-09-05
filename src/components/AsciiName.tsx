import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/ascii";

/** Nine rows by seven columns: two for an accent, seven for the letter, with
 *  two-cell strokes. One-cell strokes read as a wireframe at this size; the
 *  name wants the weight of a printed headline. */
const GLYPHS: Record<string, string[]> = {
  N: ["       ", "       ", "##   ##", "###  ##", "#### ##", "## ####", "##  ###", "##   ##", "##   ##"],
  O: ["       ", "       ", " ##### ", "##   ##", "##   ##", "##   ##", "##   ##", "##   ##", " ##### "],
  E: ["       ", "       ", "#######", "##     ", "##     ", "#####  ", "##     ", "##     ", "#######"],
  "É": ["   ##  ", "  ##   ", "#######", "##     ", "##     ", "#####  ", "##     ", "##     ", "#######"],
  L: ["       ", "       ", "##     ", "##     ", "##     ", "##     ", "##     ", "##     ", "#######"],
  A: ["       ", "       ", " ##### ", "##   ##", "##   ##", "#######", "##   ##", "##   ##", "##   ##"],
  M: ["       ", "       ", "##   ##", "### ###", "#######", "## # ##", "##   ##", "##   ##", "##   ##"],
  I: ["       ", "       ", "#######", "  ###  ", "  ###  ", "  ###  ", "  ###  ", "  ###  ", "#######"],
  " ": ["       ", "       ", "       ", "       ", "       ", "       ", "       ", "       ", "       "],
};

/** All of it heavy. The lit cells move between weights, never down to a hairline. */
const RAMP = "+*#%@";

/**
 * The name, set the way the rest of the site is set: as characters. The letters
 * are fixed; which character stands in for each lit cell is not, and a wave
 * crossing the block keeps it moving without the shape ever drifting.
 */
export function AsciiName({ text }: { text: string }) {
  const pre = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = pre.current;
    if (!el) return;

    const letters = [...text.toUpperCase()].map((c) => GLYPHS[c] ?? GLYPHS[" "]);
    const rows = 9;
    const grid: boolean[][] = [];
    for (let r = 0; r < rows; r++) {
      const line: boolean[] = [];
      letters.forEach((g, i) => {
        for (const ch of g[r]) line.push(ch === "#");
        if (i < letters.length - 1) line.push(false);   // one column between letters
      });
      grid.push(line);
    }
    const cols = grid[0].length;
    const last = RAMP.length - 1;

    /**
     * Two waves crossing the block at different rates, one along it and one
     * down. They never line up, so the weight moves through the letters without
     * ever settling into a pattern — the shape holds, the surface does not.
     */
    const draw = (t: number) => {
      let out = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!grid[r][c]) { out += " "; continue; }
          const w = Math.sin(c * 0.36 - t * 2.2) * 0.5
                  + Math.sin(r * 0.9 + c * 0.12 - t * 1.1) * 0.5;
          const i = Math.round((0.5 + w * 0.5) * last);
          out += RAMP.charAt(i < 0 ? 0 : i > last ? last : i);
        }
        out += "\n";
      }
      el.textContent = out;
    };

    if (prefersReducedMotion()) { draw(0); return; }
    let stop = false, timer = 0;
    const loop = (now: number) => {
      if (stop) return;
      draw(now * 0.001);
      timer = window.setTimeout(() => requestAnimationFrame(loop), 90);
    };
    requestAnimationFrame(loop);
    return () => { stop = true; window.clearTimeout(timer); };
  }, [text]);

  return (
    <pre ref={pre} aria-label={text}
      className="m-0 overflow-hidden whitespace-pre text-ink"
      style={{ fontFamily: "var(--data)", lineHeight: 1.0,
               fontSize: "clamp(4.1px,1.2vw,10.4px)", letterSpacing: 0 }} />
  );
}
