/** The Chrome mark, as supplied. */
export function ChromeMark({ size = 104 }: { size?: number }) {
  return (
    <img src="/chrome.png" alt="Google Chrome" width={size} height={size}
      className="block" style={{ width: size, height: size }} />
  );
}

/**
 * The offline dinosaur, running the width of its strip.
 *
 * The file arrived as a JPEG with a transparency checkerboard baked into it, so
 * the grey grid was part of the picture. It is keyed on luminance — the animal
 * is dark, the checkerboard is not — and cropped to what was left.
 */
export function DinoRun() {
  return (
    <div className="dino-track mt-16" aria-hidden="true">
      <div className="dino-run">
        <img src="/dino.png" alt="" className="dino-img" />
      </div>
    </div>
  );
}
