import { useEffect, useRef } from "react";

const POOL = "01+-=*/\\<>[]{}()|#%@&$?!:;.~^ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * The screen turning over. Characters arrive at random until they cover
 * everything, the palette is swapped underneath at the moment nothing can be
 * seen through, and then they thin out again onto the other mode.
 *
 * The glyphs take their colour from the variables, so the first half is drawn
 * in the mode you are leaving and the second in the one you are arriving at,
 * without either half being told which that is.
 */
export function ThemeWipe({ run, onFlip, onDone }:
  { run: boolean; onFlip: () => void; onDone: () => void }) {
  const pre = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!run) return;
    const el = pre.current;
    if (!el) return;

    const DUR = 290;
    const start = performance.now();
    let flipped = false;
    let raf = 0;

    // measured from the element itself rather than assumed, so the grid covers
    // the screen at whatever size the face actually renders
    const probe = document.createElement("span");
    probe.textContent = "0".repeat(100);
    probe.style.cssText = "position:absolute;visibility:hidden;font:inherit;white-space:pre";
    el.appendChild(probe);
    const cw = probe.getBoundingClientRect().width / 100 || 8.4;
    const lh = probe.getBoundingClientRect().height || 16;
    probe.remove();

    const cols = Math.ceil(window.innerWidth / cw) + 1;
    const rows = Math.ceil(window.innerHeight / lh) + 1;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DUR);
      // in fast, out a little slower, full cover across the middle
      const cover = t < 0.32 ? (t / 0.32) ** 0.65
        : t < 0.5 ? 1
        : 1 - ((t - 0.5) / 0.5) ** 1.25;

      if (!flipped && t >= 0.38) { flipped = true; onFlip(); }

      let out = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          out += Math.random() < cover ? POOL.charAt((Math.random() * POOL.length) | 0) : " ";
        }
        out += "\n";
      }
      el.textContent = out;

      if (t < 1) raf = requestAnimationFrame(tick);
      else { el.textContent = ""; onDone(); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, onFlip, onDone]);

  if (!run) return null;
  return <pre ref={pre} className="theme-wipe" aria-hidden="true" />;
}
