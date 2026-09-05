import { TreeField } from "@/components/Texture";

/**
 * The tree and nothing else. No title, no caption, no way back on the page
 * itself: it exists to be filmed. Reachable only by typing the address, which
 * is the point of it.
 */
export default function TreeBare() {
  return (
    <main className="h-screen w-screen overflow-hidden" style={{ background: "var(--void)" }}>
      <TreeField cell={8} className="tree-full" life />
    </main>
  );
}
