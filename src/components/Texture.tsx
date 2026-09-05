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
/** Two frames of a wing, and a lone mark for one far enough off to be a speck. */
const BIRD = ["\\v/", "/^\\"];
const FAR_BIRD = ["v", "^"];
/** Wings tucked, for the drop. */
const DIVING = ["\\\\", "//"];
/** Sat down, wings folded. */
const PERCHED = ["~", "\u00AC"];

export function TreeField({ cell = 13, className = "treefield", life = false }:
  { cell?: number; className?: string; life?: boolean }) {
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
    /** How much each cell is allowed to move. Leaves break the picture up over
     *  a few cells; a trunk or a solid limb is the same ink as its neighbours.
     *  Local spread tells the two apart without labelling anything by hand. */
    let leaf: Float32Array | null = null;
    /** A fixed offset per cell. Without it every cell on a row turns on the
     *  same beat and the canopy reads as a scanline rather than as leaves. */
    let phase: Float32Array | null = null;
    let cols = 0, rows = 0, ox = 0, oy = 0;

    // Read once, then again whenever the theme moves. Reading it only at mount
    // meant a tree drawn in light ink stayed light ink after a switch to dark,
    // which is to say it stopped being visible at all.
    let ink = "#FFFFFF";
    const readInk = () => {
      ink = getComputedStyle(document.documentElement)
        .getPropertyValue("--glyph").trim() || "#FFFFFF";
      ctx.fillStyle = ink;
    };

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
      // local spread over a 5x5 window, normalised: high where the picture is
      // breaking up into leaves, near zero across the solid trunk
      const lf = new Float32Array(cols * rows);
      let peak = 0;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let sum = 0, sq = 0, cnt = 0;
          for (let dj = -2; dj <= 2; dj++) {
            const jj = j + dj; if (jj < 0 || jj >= rows) continue;
            for (let di = -2; di <= 2; di++) {
              const ii = i + di; if (ii < 0 || ii >= cols) continue;
              const v = g[jj * cols + ii]; sum += v; sq += v * v; cnt++;
            }
          }
          const mean = sum / cnt;
          const sd = Math.sqrt(Math.max(0, sq / cnt - mean * mean));
          lf[j * cols + i] = sd;
          if (sd > peak) peak = sd;
        }
      }
      // Local spread alone cannot tell a leaf from an edge — the outline of a
      // trunk is high-variance too, which is how the trunk kept shimmering at
      // its own margins. So the shape of the silhouette decides as well: a
      // trunk is the narrow part underneath a wide crown. Rows whose inked
      // width is a small fraction of the widest row, and which sit below the
      // middle of the tree, are structure and hold completely still.
      const rowW = new Float32Array(rows);
      let widest = 0;
      for (let j = 0; j < rows; j++) {
        let lo = -1, hi = -1;
        for (let i = 0; i < cols; i++) if (g[j * cols + i] >= 0.1) { if (lo < 0) lo = i; hi = i; }
        rowW[j] = lo < 0 ? 0 : hi - lo + 1;
        if (rowW[j] > widest) widest = rowW[j];
      }
      const structural = new Uint8Array(rows);
      for (let j = 0; j < rows; j++) {
        structural[j] = (j > rows * 0.5 && widest > 0 && rowW[j] < widest * 0.38) ? 1 : 0;
      }

      // A floor, so anything close to uniform reads as zero rather than as a
      // little bit of leaf, and a penalty for solid mass: a trunk is both even
      // and dense, and either on its own is not enough to identify it.
      if (peak > 0) {
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const n = j * cols + i;
            let sum = 0, cnt = 0;
            for (let dj = -2; dj <= 2; dj++) {
              const jj = j + dj; if (jj < 0 || jj >= rows) continue;
              for (let di = -2; di <= 2; di++) {
                const ii = i + di; if (ii < 0 || ii >= cols) continue;
                sum += g[jj * cols + ii]; cnt++;
              }
            }
            const dense = sum / cnt;
            const spread = Math.max(0, (lf[n] / peak - 0.26) / 0.5);
            lf[n] = structural[j] ? 0
              : Math.min(1, spread) * Math.max(0, 1 - dense * 1.25);
          }
        }
      }

      // deterministic per layout, so the shimmer is stable rather than fizzing
      const ph = new Float32Array(cols * rows);
      for (let n = 0; n < ph.length; n++) {
        const h = Math.sin(n * 12.9898) * 43758.5453;
        ph[n] = (h - Math.floor(h)) * Math.PI * 2;
      }

      grid = g;
      leaf = lf;
      phase = ph;
      // the glyphs take the ink of whatever theme is running, so the tree
      // inverts with the page instead of disappearing into a light ground
      readInk();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${(cell * 1.25).toFixed(1)}px "Departure Mono", ui-monospace, monospace`;
    };

    const last = TREE_RAMP.length - 1;

    /**
     * The tree does not move; the characters standing in for it do.
     *
     * Three gusts cross the field at different speeds and phases, so the wind
     * arrives in waves that overlap rather than as one pass on a loop. Every
     * cell's displacement is multiplied by how leafy it is, which is what keeps
     * the trunk and the solid limbs still while the canopy turns. Displacement
     * is measured in ink rather than in ramp steps, so it stays the same size
     * whatever the ramp's resolution.
     */
    const render = (now: number) => {
      if (!grid || !leaf || !phase) return;
      const t = now * 0.001;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // three fronts, none of them in step with the others
      const f1 = ((t * 0.15) % 1.9) - 0.45;
      const f2 = ((t * 0.09 + 0.5) % 2.3) - 0.65;
      const f3 = ((t * 0.23 + 0.2) % 1.6) - 0.3;

      for (let j = 0; j < rows; j++) {
        const canopy = 1 - (j / rows) * 0.55;
        for (let i = 0; i < cols; i++) {
          const n = j * cols + i;
          const ink = grid[n];
          if (ink < 0.1) continue;
          const give = leaf[n];
          const cx = ox + i * cell + cell / 2;
          const cy = oy + j * cell + cell / 2;

          if (give < 0.12) {                     // trunk and limbs: drawn, then left alone
            ctx.globalAlpha = Math.min(1, ink * 1.2);
            ctx.fillText(TREE_RAMP.charAt(Math.round(ink * last)), cx, cy);
            continue;
          }

          const x = i / cols;
          // a gust arrives faster than it leaves: narrow ahead of the front,
          // wide behind it, which is the shape of air hitting a tree
          const gust = (f: number, amp: number, w: number) => {
            const d = x - f;
            return amp * Math.exp(-(d * d) / (d > 0 ? w * 0.28 : w));
          };
          const wave = gust(f1, 1.0, 0.055) + gust(f2, 0.75, 0.09) + gust(f3, 0.55, 0.035);
          const off = phase[n];
          const travel = i * 0.28 - t * 2.4;
          const detail =
            Math.sin(travel + off) + 0.5 * Math.sin(travel * 0.55 + off * 1.7);
          const sway = detail * (0.10 + 0.90 * Math.min(1.4, wave)) * canopy * give;
          const v = ink + sway * 0.105;
          const idx = Math.round((v < 0 ? 0 : v > 1 ? 1 : v) * last);
          ctx.globalAlpha = Math.min(1, ink * 1.2 + sway * 0.06);
          ctx.fillText(TREE_RAMP.charAt(idx), cx, cy);
        }
      }
      ctx.globalAlpha = 1;

      if (!life) return;
      const W = window.innerWidth, H = window.innerHeight;

      // Birds, crossing the sky at their own speeds and heights. The higher
      // ones fly the other way and are drawn as a single mark, which is enough
      // at that distance and keeps the sky from reading as a formation.
      for (let k = 0; k < 11; k++) {
        const far = k % 3 === 2;
        const dir = k % 2 ? 1 : -1;
        const speed = (far ? 14 : 30) + k * 9;
        const span = W + 300;
        const raw = (t * speed + k * 517) % span;

        // Every so often one drops: wings in, a fast fall, then a climb back.
        // Each bird is on its own clock so they never go together.
        const period = 9 + (k % 5) * 4.5;
        const beat = ((t + k * 3.7) % period) / period;
        const falling = beat < 0.16;
        const drop = falling ? Math.sin((beat / 0.16) * Math.PI) ** 1.6 : 0;

        const bx = (dir > 0 ? raw - 150 : W + 150 - raw) + Math.sin(t * 0.7 + k * 2.1) * 14;
        const by = H * (0.05 + (k % 7) * 0.036)
          + Math.sin(t * (0.4 + k * 0.11) + k) * 15          // the long swell
          + Math.sin(t * (1.7 + k * 0.23) + k * 2) * 5       // and the small correction
          + drop * (70 + (k % 3) * 45);

        // A few of them land. Each perching bird has its own spot in the crown
        // and its own clock, so the tree is never all full or all empty.
        const perches = k % 4 === 1;
        const rest = 17 + (k % 4) * 6;
        const restBeat = ((t + k * 5.9) % rest) / rest;
        const sitting = perches && restBeat > 0.42 && restBeat < 0.74;

        ctx.globalAlpha = far ? .55 : .85;
        const beats = falling ? 7.5 : 2.6 + k * 0.37;
        const frame = Math.floor(t * beats) % 2;

        if (sitting) {
          const spot = Math.sin(k * 3.7);
          const px = W * (0.34 + 0.32 * ((spot + 1) / 2));
          const py = H * (0.24 + 0.22 * ((Math.cos(k * 2.3) + 1) / 2));
          // the smallest shift, so a sitting bird is not a dead pixel
          ctx.fillText(PERCHED[Math.floor(t * 0.9 + k) % 2], px, py + Math.sin(t * 1.3 + k) * 1.2);
        } else {
          const mark = falling ? DIVING[frame] : (far ? FAR_BIRD : BIRD)[frame];
          ctx.fillText(mark, bx, by);
        }
      }

      // Midges. Each one keeps to its own patch of air and wanders inside it on
      // two frequencies, so the swarm never falls into step with itself.
      ctx.globalAlpha = .5;
      for (let k = 0; k < 30; k++) {
        const seed = k * 7.31;
        const cx = W * (0.18 + 0.64 * ((Math.sin(seed) + 1) / 2));
        const cy = H * (0.30 + 0.44 * ((Math.cos(seed * 1.7) + 1) / 2));
        const sp = 0.55 + (k % 7) * 0.19;
        const ix = cx + Math.sin(t * sp + seed) * (13 + (k % 5) * 8)
                      + Math.sin(t * sp * 2.7 + seed) * 5;
        const iy = cy + Math.cos(t * sp * 1.35 + seed) * (9 + (k % 4) * 6)
                      + Math.cos(t * sp * 3.3 + seed) * 4;
        ctx.fillText(k % 4 === 0 ? "'" : ".", ix, iy);
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

    // the theme can change under the page, from the toggle or from the device
    const mo = new MutationObserver(() => { readInk(); if (still) render(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const scheme = window.matchMedia("(prefers-color-scheme: light)");
    const onScheme = () => { readInk(); if (still) render(0); };
    scheme.addEventListener("change", onScheme);

    let t: number;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => { measure(); if (still) render(0); }, 160);
    };
    window.addEventListener("resize", onResize);
    return () => {
      stop = true;
      mo.disconnect();
      scheme.removeEventListener("change", onScheme);
      window.clearTimeout(frame);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, [cell, className, life]);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
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
