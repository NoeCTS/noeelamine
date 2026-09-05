import { useEffect, useState } from "react";
import { apply, save, stored, type Choice } from "@/lib/theme";

/**
 * Follows the device until someone says otherwise, then remembers.
 *
 * The label names the mode you are about to get rather than the one you are
 * in — a control should say what it does, not what is true.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>(() => stored());
  const [systemLight, setSystemLight] = useState(
    () => typeof window !== "undefined"
      && window.matchMedia("(prefers-color-scheme: light)").matches);

  useEffect(() => { apply(choice); }, [choice]);

  // the device can change its mind while the page is open
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e: MediaQueryListEvent) => setSystemLight(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const now = choice ?? (systemLight ? "light" : "dark");
  const next = now === "dark" ? "light" : "dark";

  return (
    <button type="button" className="theme-toggle"
      onClick={() => { const c = next as Choice; setChoice(c); save(c); }}
      aria-label={`Switch to ${next} mode`}>
      <b aria-hidden="true" />
      <span>{next}</span>
    </button>
  );
}
