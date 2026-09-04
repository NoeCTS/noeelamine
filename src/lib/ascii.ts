/**
 * The reduction engine. Everything visual on this site is one of three
 * settings of the same idea: grain, a dot screen, and characters. This is
 * the characters one, and the opening, the background tree and every zone
 * entrance all run through it.
 */
export const RAMP = " .:-=+*#%@";
export const TREE_RAMP = " .:-=+ixX*#%@";

/** Departure Mono's advance width as a share of the em. */
export const CH = 0.6;

const cv = typeof document !== "undefined" ? document.createElement("canvas") : null;
const ctx = cv ? cv.getContext("2d", { willReadFrequently: true }) : null;

/**
 * Render an image as text. Character cells run about 2:1, hence the halving.
 *
 * `contrast` pushes tone away from mid grey before the ramp is chosen. A fine
 * grid needs it: the more columns there are, the fewer source pixels each cell
 * averages, so neighbouring cells converge on the same character and the
 * picture flattens into an even field exactly when it should be sharpening.
 */
export function toAscii(img: HTMLImageElement, cols: number, ramp = RAMP, contrast = 1): string {
  if (!ctx || !cv || !img.naturalWidth) return "";
  const rows = Math.max(1, Math.round(cols * (img.naturalHeight / img.naturalWidth) * 0.5));
  cv.width = cols;
  cv.height = rows;
  ctx.clearRect(0, 0, cols, rows);
  ctx.drawImage(img, 0, 0, cols, rows);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, cols, rows).data;
  } catch {
    return "";
  }

  const last = ramp.length - 1;
  let out = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const raw = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      const lum = contrast === 1 ? raw : Math.min(1, Math.max(0, (raw - 0.5) * contrast + 0.5));
      out += ramp.charAt(Math.round((1 - lum) * last));
    }
    out += "\n";
  }
  return out;
}

/** Type size that makes a character block of `cols` fill `width`. */
export const fitSize = (width: number, cols: number) => width / (cols * CH);

/**
 * Film grain, generated per pixel the way Add Noise does rather than with an
 * SVG turbulence filter, which makes clouds. Centred on mid grey so an overlay
 * blend leaves the underlying tone alone.
 */
export function noiseTile(size = 180, amount = 58): string {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d");
  if (!x) return "";
  const im = x.createImageData(size, size);
  const d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    // three uniforms summed approximates a gaussian, which is what grain looks like
    const v = 128 + (Math.random() + Math.random() + Math.random() - 1.5) * amount;
    d[i] = d[i + 1] = d[i + 2] = v < 0 ? 0 : v > 255 ? 255 : v;
    d[i + 3] = 255;
  }
  x.putImageData(im, 0, 0);
  return `url(${c.toDataURL("image/png")})`;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
