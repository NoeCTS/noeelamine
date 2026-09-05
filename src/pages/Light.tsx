import { useEffect } from "react";
import Index from "./Index";

/**
 * The landing page with the ground and the ink swapped. Not a second design:
 * the same components, the same type, the same tree, rendered under an inverted
 * palette. Everything the page draws reads its colour from a variable, so the
 * whole of it turns over from one block in the stylesheet.
 */
export default function Light() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "light");
    return () => root.removeAttribute("data-theme");
  }, []);
  return <Index />;
}
