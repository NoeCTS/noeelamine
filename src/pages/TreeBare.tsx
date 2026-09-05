import { Link } from "react-router-dom";
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
      {/* A way out that will not appear in the recording: invisible until it is
          pointed at or tabbed to. */}
      <Link to="/#index" className="bare-exit">Back to the index</Link>
    </main>
  );
}
