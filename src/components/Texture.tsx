import { useEffect, useRef } from "react";
import { noiseTile, toAscii, TREE_RAMP, prefersReducedMotion } from "@/lib/ascii";

/** Real film grain: three tiles cycled so it scintillates instead of sitting still. */
export function Grain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tiles = [noiseTile(), noiseTile(), noiseTile()];
    // the Klein fields reuse the same grain through this variable
    document.documentElement.style.setProperty("--noise", tiles[0]);
    el.style.backgroundImage = tiles[0];
    if (prefersReducedMotion()) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % tiles.length;
      el.style.backgroundImage = tiles[i];
    }, 90);
    return () => window.clearInterval(id);
  }, []);
  return <div ref={ref} className="grain" aria-hidden="true" />;
}

export const DotScreen = () => <div className="dotscreen" aria-hidden="true" />;

/**
 * The tree, drawn into the background out of characters. A dot grid is
 * wallpaper; this is a picture that happens to be made of type.
 */
export function TreeField({ cell = 13 }: { cell?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true });

    // The sampled tree, held between frames. Measuring is the expensive half and
    // the picture does not change; only which character stands in for each cell.
    let grid: Float32Array | null = null;
    let cols = 0, rows = 0, ox = 0, oy = 0;

    const measure = () => {
      if (!sctx) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grid = null;
      if (!img.naturalWidth) return;

      const sc = Math.min(w / img.naturalWidth, h / img.naturalHeight) * 0.94;
      const dw = img.naturalWidth * sc;
      const dh = img.naturalHeight * sc;
      ox = (w - dw) / 2;
      oy = (h - dh) / 2;
      cols = Math.max(1, Math.ceil(dw / cell));
      rows = Math.max(1, Math.ceil(dh / cell));

      sample.width = cols;
      sample.height = rows;
      sctx.clearRect(0, 0, cols, rows);
      sctx.drawImage(img, 0, 0, cols, rows);
      let d: Uint8ClampedArray;
      try {
        d = sctx.getImageData(0, 0, cols, rows).data;
      } catch {
        return;
      }
      const g = new Float32Array(cols * rows);
      for (let n = 0; n < cols * rows; n++) {
        const k = n * 4;
        // the source is dark characters on a transparent ground: alpha gates the ink
        const a = d[k + 3] / 255;
        g[n] = a * (1 - (0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) / 255);
      }
      grid = g;
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${(cell * 1.25).toFixed(1)}px "Departure Mono", ui-monospace, monospace`;
    };

    const last = TREE_RAMP.length - 1;

    /**
     * The tree does not move; the characters standing in for it do.
     *
     * A gust crosses the field from one side rather than the whole canopy
     * shimmering at once, so the wind arrives from a direction. Its strength
     * breathes on a slower cycle, the top of the tree gives more than the base,
     * and the densest cells — the trunk, the heart of the canopy — barely move
     * at all. Displacement is measured in ink rather than in ramp steps, so it
     * stays the same size whatever the ramp's resolution.
     */
    const render = (now: number) => {
      if (!grid) return;
      const t = now * 0.001;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const front = ((t * 0.13) % 1.6) - 0.3;          // the gust, crossing
      const breath = 0.55 + 0.45 * Math.sin(t * 0.37); // and rising and falling

      for (let j = 0; j < rows; j++) {
        const canopy = 1 - (j / rows) * 0.78;
        for (let i = 0; i < cols; i++) {
          const ink = grid[j * cols + i];
          if (ink < 0.1) continue;
          const gust = Math.exp(-((i / cols - front) ** 2) / 0.05);
          const travel = i * 0.26 - t * 2.1;
          const detail =
            Math.sin(travel + j * 0.42) + 0.5 * Math.sin(travel * 0.55 - j * 0.29);
          const sway = detail * breath * (0.3 + 0.7 * gust) * canopy * (1 - ink);
          const v = ink + sway * 0.085;
          const idx = Math.round((v < 0 ? 0 : v > 1 ? 1 : v) * last);
          ctx.globalAlpha = Math.min(1, ink * 1.2 + sway * 0.06);
          ctx.fillText(
            TREE_RAMP.charAt(idx),
            ox + i * cell + cell / 2,
            oy + j * cell + cell / 2,
          );
        }
      }
      ctx.globalAlpha = 1;
    };

    let frame = 0;
    let stop = false;
    const still = prefersReducedMotion();
    const loop = (now: number) => {
      if (stop) return;
      render(now);
      // eleven frames a second: enough that a gust reads as travelling rather
      // than stepping, cheap enough to sit under everything else
      frame = window.setTimeout(() => requestAnimationFrame(loop), 90) as unknown as number;
    };

    const begin = () => {
      measure();
      if (still) render(0);
      else if (!stop) requestAnimationFrame(loop);
    };

    img.onload = begin;
    img.src = "/frames/tree.png";
    // the glyphs need the face resolved before the canvas can measure them
    document.fonts?.ready.then(() => { measure(); if (still) render(0); });

    let t: number;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => { measure(); if (still) render(0); }, 160);
    };
    window.addEventListener("resize", onResize);
    return () => {
      stop = true;
      window.clearTimeout(frame);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, [cell]);

  return <canvas ref={canvas} className="treefield" aria-hidden="true" />;
}

/**
 * A frame that arrives as characters and resolves into itself. The site opens
 * this way and every case study enters this way, so it is the grammar of the
 * place rather than an intro animation.
 */
export function Resolve({
  src, alt, className = "", ratio = "4 / 3", duration = 900,
}: { src: string; alt: string; className?: string; ratio?: string; duration?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = host.current;
    const img = imgRef.current;
    const pre = preRef.current;
    if (!el || !img || !pre) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      img.style.opacity = "1";
      pre.style.display = "none";
      return;
    }

    let done = false;
    const play = () => {
      if (!img.naturalWidth) {
        img.addEventListener("load", play, { once: true });
        return;
      }
      const w = el.clientWidth || 320;
      const t0 = performance.now();
      let lastCols = -1;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const cols = Math.round(18 + p * 120);
        if (Math.abs(cols - lastCols) >= 3) {
          pre.textContent = toAscii(img, cols);
          pre.style.fontSize = `${(w / (cols * 0.6)).toFixed(2)}px`;
          lastCols = cols;
        }
        const reveal = Math.max(0, (p - 0.5) / 0.5);
        img.style.opacity = String(reveal);
        pre.style.opacity = String(1 - reveal);
        if (p < 1) requestAnimationFrame(tick);
        else {
          img.style.opacity = "1";
          pre.style.display = "none";
        }
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done) {
            done = true;
            play();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, duration]);

  return (
    <div ref={host} className={`relative overflow-hidden bg-void-2 ${className}`} style={{ aspectRatio: ratio }}>
      <img ref={imgRef} src={src} alt={alt} loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-0" />
      <pre ref={preRef} aria-hidden="true"
        className="absolute inset-0 m-0 flex items-center justify-center overflow-hidden whitespace-pre bg-void text-ink"
        style={{ fontFamily: "var(--data)", lineHeight: 1.06 }} />
    </div>
  );
}
