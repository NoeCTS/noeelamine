import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Frame } from "@/data/frames";

/**
 * Click a frame, see it properly. Escape and the backdrop close it, arrows and
 * swipe move through the set, and focus returns to whatever opened it.
 */
export function Lightbox({
  frames, index, onClose, onMove,
}: { frames: Frame[]; index: number | null; onClose: () => void; onMove: (i: number) => void }) {
  const open = index !== null;
  const dialog = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<Element | null>(null);
  const touchX = useRef<number | null>(null);
  const closeOnBackdrop = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const step = useCallback((d: number) => {
    if (index === null) return;
    onMove((index + d + frames.length) % frames.length);
  }, [index, frames.length, onMove]);

  const closeRef = useRef(onClose);
  const stepRef = useRef(step);
  useEffect(() => {
    closeRef.current = onClose;
    stepRef.current = step;
  }, [onClose, step]);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement;
    // Grain, dot screen and tree are the archive's paper, not the photograph's.
    // They come off while a frame is open so the picture is seen as shot.
    document.documentElement.setAttribute("data-viewing", "");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // preventScroll, or focusing the freshly portalled dialog makes the browser
    // scroll the document to "reveal" it and the page moves under the viewer.
    dialog.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "ArrowRight") stepRef.current(1);
      if (e.key === "ArrowLeft") stepRef.current(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.documentElement.removeAttribute("data-viewing");
      (restoreTo.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (index === null) return null;
  const f = frames[index];

  // Rendered into the body, not where it was written. Both pages that use this
  // sit inside a `relative z-[1]` wrapper, and that wrapper is a stacking
  // context: z-[200] measured inside it still loses to the fixed nav's z-50,
  // which then covers the header strip and eats the Close button.
  return createPortal((
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${f.title}, frame ${f.n}`}
      tabIndex={-1}
      className="lightbox fixed inset-0 z-[200] flex flex-col outline-none"
      onClick={closeOnBackdrop}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex flex-none items-center gap-4 px-4 py-3 sm:px-6" onClick={closeOnBackdrop}>
        <span className="num text-[14px]" style={{ color: "var(--klein-lift)" }}>{f.n}</span>
        <span className="mono">{f.title}</span>
        <span className="mono-sm hidden sm:inline">{f.kind}{f.made ? ` · ${f.made}` : ""}</span>
        <span className="mono-sm ml-auto">{index + 1} / {frames.length}</span>
        <button type="button" onClick={onClose} aria-label="Close"
          className="stamp ml-2 min-h-11"><span>Close</span></button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-6"
        onClick={closeOnBackdrop}>
        <button type="button" onClick={() => step(-1)} aria-label="Previous"
          className="lb-arrow left-2 sm:left-4">‹</button>
        <img key={f.n} src={`/frames/${f.n}.jpg`} alt={f.title}
          className="lb-img max-h-full max-w-full object-contain" />
        <button type="button" onClick={() => step(1)} aria-label="Next"
          className="lb-arrow right-2 sm:right-4">›</button>
      </div>
    </div>
  ), document.body);
}
