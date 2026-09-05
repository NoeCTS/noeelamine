export type Choice = "light" | "dark" | null;

const KEY = "theme";

/** null means "whatever the device says", which is also the default. */
export function stored(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

export function systemIsLight(): boolean {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-color-scheme: light)").matches;
}

/** The attribute is only written when there is a choice to record. Left off,
 *  the stylesheet's media query decides, which is what following the device
 *  means. */
export function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice) root.setAttribute("data-theme", choice);
  else root.removeAttribute("data-theme");
}

export function save(choice: Choice) {
  try {
    if (choice) localStorage.setItem(KEY, choice);
    else localStorage.removeItem(KEY);
  } catch { /* private mode */ }
  apply(choice);
}

