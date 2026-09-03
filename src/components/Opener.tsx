import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toAscii, fitSize, prefersReducedMotion } from "@/lib/ascii";

gsap.registerPlugin(ScrollTrigger);

/**
 * The opening. The site starts on a photograph that does not exist yet: a
 * field of characters. Scrolling refines the grid until the image resolves
 * into itself, then black and white, then colour last. Scrolling is developing.
 */
export function Opener({ src, label, frame }: { src: string; label: string; frame: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const stage = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const i = img.current, p = pre.current, box = inner.current;
    if (!i || !p || !box) return;
    let lastCols = -1;

    const draw = (progress: number) => {
      const cols = Math.round(72 + progress * 138);
      if (Math.abs(cols - lastCols) >= 2) {
        p.textContent = toAscii(i, cols);
        p.style.fontSize = `${fitSize(box.clientWidth || 760, cols).toFixed(2)}px`;
        lastCols = cols;
      }
      // characters give way to black and white, and colour arrives last
      const reveal = Math.min(1, Math.max(0, (progress - 0.42) / 0.33));
      const colour = Math.min(1, Math.max(0, (progress - 0.76) / 0.24));
      i.style.opacity = String(reveal);
      p.style.opacity = String(1 - reveal);
      i.style.filter = `grayscale(${(1 - colour).toFixed(3)}) contrast(${(1 + 0.14 * (1 - colour)).toFixed(3)})`;
      if (hint.current) hint.current.style.opacity = String(1 - Math.min(1, progress * 2.2));
      if (pct.current) pct.current.textContent = `00${Math.round(progress * 100)}`.slice(-3);
      if (stage.current) stage.current.textContent = reveal < 1 ? "characters" : colour < 1 ? "monochrome" : "colour";
    };

    const start = () => {
      draw(0);
      if (prefersReducedMotion()) { draw(1); return; }
      const st = ScrollTrigger.create({
        trigger: wrap.current!,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => draw(self.progress),
      });
      return () => st.kill();
    };

    let cleanup: (() => void) | undefined;
    if (i.complete && i.naturalWidth) cleanup = start();
    else i.addEventListener("load", () => { cleanup = start(); }, { once: true });

    return () => { cleanup?.(); };
  }, [src]);

  return (
    <div ref={wrap} className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-void"
      style={{ height: "100svh", width: "100vw", marginInline: "calc(50% - 50vw)" }}>
      <div ref={inner} className="relative max-w-[96vw]"
        style={{ aspectRatio: "3 / 2", height: "min(86vh, calc(96vw / 1.5))" }}>
        <pre ref={pre} aria-hidden="true"
          className="absolute inset-0 m-0 flex items-center justify-center overflow-hidden whitespace-pre text-ink"
          style={{ fontFamily: "var(--data)", lineHeight: 1.15 }} />
        <img ref={img} src={src} alt={label}
          className="absolute inset-0 h-full w-full object-cover opacity-0" />
        <div className="absolute bottom-4 left-4 z-[3] flex gap-5">
          <span className="mono">Frame {frame}</span>
          <span className="mono" ref={stage}>characters</span>
          <span className="num text-[13px]" style={{ color: "var(--klein-lift)" }} ref={pct}>000</span>
        </div>
      </div>
      <span ref={hint} className="mono absolute bottom-8 left-1/2 z-[3] -translate-x-1/2">Keep scrolling</span>
    </div>
  );
}
