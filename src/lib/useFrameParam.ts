
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { Frame } from "@/data/frames";

/**
 * The open frame lives in the URL, so a single photograph can be linked to.
 *
 * Opening one pushes a history entry, so browser Back and the phone's edge
 * swipe close the lightbox, which is what both gestures are for. Stepping with
 * the arrows replaces instead: paging through a set should not bury the page
 * you arrived from under twenty entries.
 *
 * Closing replaces rather than stepping back through that entry. Going back
 * would land on a URL carrying a fragment, and browsers scroll to the fragment
 * on history traversal, which threw you to the top of the index every time you
 * shut a frame. A replace changes no history position, so nothing moves.
 */
export function useFrameParam(frames: Frame[]) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { hash } = useLocation();

  // Written through navigate rather than setSearchParams, which drops the hash.
  // Losing it turns "/#index" into "/", and the app's scroll-to-anchor effect
  // reacts to that by throwing you to the top of the page — so opening a frame
  // lost your place in the index and closing it never gave the place back.
  const go = (search: URLSearchParams, replace: boolean) => {
    const q = search.toString();
    navigate({ search: q ? `?${q}` : "", hash }, { replace, preventScrollReset: true });
  };

  const requested = searchParams.get("frame");
  const found = requested ? frames.findIndex((f) => f.n === requested) : -1;
  const open = found >= 0 ? found : null;

  const setFrame = (index: number, replace: boolean) => {
    const next = new URLSearchParams(searchParams);
    next.set("frame", frames[index].n);
    go(next, replace);
  };

  const openFrame = (index: number) => setFrame(index, false);
  const moveFrame = (index: number) => setFrame(index, true);

  const closeFrame = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("frame");
    go(next, true);
  };

  return { open, openFrame, moveFrame, closeFrame };
}
