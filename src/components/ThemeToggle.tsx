import { useCallback, useEffect, useRef, useState } from "react";
import { apply, save, stored, type Choice } from "@/lib/theme";
import { ThemeWipe } from "./ThemeWipe";

/**
 * Follows the device until someone says otherwise, then remembers.
 *
 * The label names the mode you are about to get rather than the one you are
 * in — a control should say what it does, not what is true.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>(() => stored());
  const [wiping, setWiping] = useState(false);
  const pending = useRef<Choice>(null);
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

  const flip = useCallback(() => {
    const c = pending.current;
    if (c) { setChoice(c); save(c); }
  }, []);
  const done = useCallback(() => { setWiping(false); pending.current = null; }, []);

  const onClick = () => {
    const c = next as Choice;
    // straight over for anyone who has asked for less movement
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChoice(c); save(c); return;
    }
    pending.current = c;
    setWiping(true);
  };

  return (
    <>
      <button type="button" className="theme-toggle" onClick={onClick}
        aria-label={`Switch to ${next} mode`}>
        <b aria-hidden="true" />
        <span>{next}</span>
      </button>
      <ThemeWipe run={wiping} onFlip={flip} onDone={done} />
    </>
  );
}
