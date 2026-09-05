import { Link } from "react-router-dom";
import { TreeField } from "@/components/Texture";

/**
 * The tree, given the page it was always asking for.
 *
 * It used to sit behind everything at a third of its strength, where it cost
 * the copy in front of it real contrast and could never be looked at properly.
 * Here it runs at full strength on a finer grid, with nothing over it: a
 * photograph of a tree, redrawn as characters, moving.
 */
export default function Tree() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--void)" }}>
      <TreeField cell={8} className="tree-full" life />

      <div className="wrap relative z-[2] flex min-h-screen flex-col justify-between py-8">
        <header>
          <p className="mono">Tree · character study</p>
        </header>

        <div className="max-w-[46ch] pb-2">
          <h1 className="m-0 font-display uppercase leading-[.9]"
            style={{ fontSize: "clamp(2rem,7vw,4.2rem)", fontWeight: 400 }}>
            Tree
          </h1>
          <p className="mono mt-4">
            A photograph sampled to a grid, one character per cell, chosen by how
            much ink the cell needs. Two slow waves cross the field so the glyphs
            standing in for leaves turn; the trunk holds still.
          </p>
          <p className="mt-5">
            <Link to="/#index" className="stamp inline-flex min-h-11 items-center">
              <span>Back to the index</span>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
