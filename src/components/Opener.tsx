import { useEffect, useRef } from "react";
import { toAscii, fitSize, prefersReducedMotion } from "@/lib/ascii";

/**
 * The opening. The site starts on a photograph that does not exist yet: a
 * field of characters. Scrolling refines the grid, so the picture sharpens
 * without ever arriving — it stays made of characters the whole way down. The
 * photograph itself is only ever the source the glyphs are sampled from.
 */
export function Opener({ src, label }: { src: string; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const hint = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const i = img.current, p = pre.current, box = inner.current;
    if (!i || !p || !box) return;
    let lastCols = -1;
    const viewportRef = { value: window.innerHeight };
    let lastProgress = 0;

    const draw = (progress: number) => {
      lastProgress = progress;
      // Resolution is the whole animation now that the photograph never fades
      // up, so the grid has to run fine enough for a face to become legible in
      // it. Small type alone would only flatten the tone, so contrast is lifted
      // in step with the column count to keep the glyphs separating.
      // A shorter scroll wants a shorter journey. The grid still refines, it
      // just does not chase the last stretch of detail that took a second
      // screen of scrolling to reach.
      const narrow = window.innerWidth < 640;
      // Quantised. A phone's address bar collapsing mid-scroll nudges the
      // progress, and an unquantised column count turns that nudge into a
      // visible reshuffle of every character on screen.
      const step = narrow ? 6 : 4;
      const cols = Math.round(((narrow ? 50 : 84) + progress * (narrow ? 78 : 136)) / step) * step;
      const contrast = 1 + progress * 0.5;
      if (cols !== lastCols) {
        p.textContent = toAscii(i, cols, undefined, contrast);
        p.style.fontSize = `${fitSize(box.getBoundingClientRect().width || 360, cols).toFixed(2)}px`;
        lastCols = cols;
      }
      // The source image is never faded up. Resolution is the whole animation:
      // the grid gets finer, the picture gets legible, the glyphs stay glyphs.
      if (hint.current) hint.current.style.opacity = String(1 - Math.min(1, progress * 2.2));
    };

    /**
     * Progress is read from the page, never written back to it. This used to be
     * a GSAP ScrollTrigger, which owns the scroller: locking the body for the
     * lightbox made it renormalise and settle the page somewhere else, and the
     * reader lost their place in the index behind the open frame. Nothing here
     * touches scroll position, so there is nothing to fight.
     */
    const start = () => {
      draw(0);
      if (prefersReducedMotion()) { draw(1); return; }
      const el = wrap.current;
      if (!el) return;

      // The element is 280svh tall with a 100svh sticky child, so it develops
      // over the 180svh between its top meeting the top of the screen and its
      // bottom meeting the bottom.
      // Held, not read live. window.innerHeight grows and shrinks as a phone
      // hides its address bar, and measuring progress against a moving
      // denominator makes the picture jump while the page is standing still.
      const measure = () => {
        const run = el.offsetHeight - viewportRef.value;
        if (run <= 0) return 0;
        return Math.min(1, Math.max(0, -el.getBoundingClientRect().top / run));
      };

      let target = measure();
      let current = target;
      let ticking = false;
      let frame = 0;
      const tick = () => {
        // eased rather than tied hard to the scroll, which is the lag that made
        // the old scrub feel like something developing rather than a slider
        current += (target - current) * 0.16;
        if (Math.abs(target - current) < 0.0015) { current = target; ticking = false; }
        draw(current);
        if (ticking) frame = requestAnimationFrame(tick);
      };
      const onScroll = () => {
        target = measure();
        if (!ticking) { ticking = true; frame = requestAnimationFrame(tick); }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      draw(current);
      return () => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(frame);
      };
    };

    let raf = 0;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      // A real resize changes the width, or moves the height a long way. An
      // address bar sliding is neither, and must not restart the drawing.
      if (window.innerWidth === lastWidth
        && Math.abs(window.innerHeight - viewportRef.value) < 120) return;
      lastWidth = window.innerWidth;
      viewportRef.value = window.innerHeight;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { lastCols = -1; draw(lastProgress); });
    };
    window.addEventListener("resize", onResize);

    let disposed = false;
    let cleanup: (() => void) | undefined;
    const onLoad = () => {
      if (!disposed) cleanup = start();
    };
    if (i.complete && i.naturalWidth) cleanup = start();
    else i.addEventListener("load", onLoad, { once: true });

    return () => {
      disposed = true;
      i.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, [src]);

  return (
    <div ref={wrap} className="opener-scroll relative bg-void"
      style={{ width: "100vw", marginInline: "calc(50% - 50vw)" }}>
      <div className="opener-stage sticky top-0 flex min-h-[520px] items-center justify-center overflow-hidden">
        <div ref={inner} className="relative max-w-[96vw]"
          style={{ aspectRatio: "3 / 2", height: "min(86svh, calc(96vw / 1.5))" }}>
          <pre ref={pre} aria-hidden="true"
            className="absolute inset-0 m-0 flex items-center justify-center overflow-hidden whitespace-pre text-ink"
            style={{ fontFamily: "var(--data)", lineHeight: 1.15 }} />
          {/* Never shown. It is the pixel source toAscii samples, and the
              accessible description of what the character field depicts. */}
          <img ref={img} src={src} alt={label}
            className="absolute inset-0 h-full w-full object-cover opacity-0" />
        </div>
        <span ref={hint} className="mono absolute bottom-8 left-1/2 z-[3] -translate-x-1/2">Keep scrolling</span>
      </div>
    </div>
  );
}
