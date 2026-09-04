import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "@/lib/ascii";

/**
 * Runs the light bar across anything marked .scan as it comes into view, once.
 * Lives at app level so every page gets it without wiring an observer per
 * component, and re-scans on navigation because the DOM is replaced.
 */
export function ScanController() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          // stagger by column so a grid reads left to right rather than all at once
          const delay = Number(el.dataset.scanDelay ?? 0);
          window.setTimeout(() => el.classList.add("is-lit"), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    const attach = () => {
      document.querySelectorAll<HTMLElement>(".scan:not(.is-lit)").forEach((el, i) => {
        if (!el.dataset.scanDelay) el.dataset.scanDelay = String((i % 6) * 55);
        io.observe(el);
      });
    };
    attach();
    // pages that mount content after data or images settle
    const t = window.setTimeout(attach, 400);

    return () => { window.clearTimeout(t); io.disconnect(); };
  }, [pathname]);

  return null;
}
