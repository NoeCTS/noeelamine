/**
 * The archive manifest.
 *
 * Every frame carries two dates: `made` is when the thing was made, `added` is
 * when it entered the archive. The index orders by `added` (newest first) so
 * the contact sheet reads as a record of the archive growing, falling back to
 * `made` inside a group. Both are ISO year-month; empty `made` means unknown
 * and sorts last, which is the honest default until captions are written.
 */
export type Group =
  | "photography" | "betteride" | "nothing" | "posters"
  | "events" | "portrait" | "berlin" | "google" | "aube";

export interface Frame {
  n: string;            // frame number, matches /frames/NNN.jpg
  title: string;
  kind: string;         // what it is, shown under the title
  group: Group;
  route?: string;       // where it opens, if anywhere
  made?: string;        // YYYY.MM
  added: string;        // YYYY.MM
  sensitive?: boolean;  // held back pending a conversation
}

export const FRAMES: Frame[] = [
  { n: "027", title: "Cards",            kind: "self portrait",    group: "portrait",    made: "2025.08", added: "2026.02" },
  { n: "048", title: "Google",           kind: "London office",    group: "google",   route: "/google", made: "2026.07", added: "2026.09" },
  { n: "049", title: "Tree",             kind: "artwork",          group: "posters",     made: "2026.07", added: "2026.09" },
  { n: "031", title: "Tree",             kind: "ASCII study",      group: "posters",     made: "2026.07", added: "2026.09" },

  { n: "016", title: "Ponte 25 de Abril",kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "017", title: "Cais do Sodré",    kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "018", title: "Tiled facade",     kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "019", title: "Rua",              kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "020", title: "Passage",          kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "021", title: "Apartment block",  kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "022", title: "Glasshouse",       kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "023", title: "Framed work",      kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "024", title: "Interior",         kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "025", title: "Balcony",          kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "026", title: "Facade",           kind: "photograph",       group: "photography", made: "2024.04", added: "2026.09" },
  { n: "028", title: "Parakeets",        kind: "photograph",       group: "photography", made: "2026.05", added: "2026.09" },
  { n: "029", title: "Museum",           kind: "photograph",       group: "photography", made: "2026.01", added: "2026.09" },

  { n: "014", title: "Broken bike",      kind: "flyer",            group: "betteride", route: "/betteride", made: "2026.03", added: "2026.03" },
  { n: "034", title: "Exposed is fine",  kind: "flyer",            group: "betteride", route: "/betteride", made: "2026.03", added: "2026.03" },
  { n: "035", title: "Leaf",             kind: "flyer",            group: "betteride", route: "/betteride", made: "2026.03", added: "2026.03" },
  { n: "036", title: "Lost",             kind: "flyer",            group: "betteride", route: "/betteride", made: "2026.03", added: "2026.03" },
  { n: "032", title: "Banner v2",        kind: "banner",           group: "betteride", route: "/betteride", made: "2026.03", added: "2026.03" },
  { n: "033", title: "Banner",           kind: "banner",           group: "betteride", route: "/betteride", made: "2026.03", added: "2026.03" },
  { n: "004", title: "Night rider",      kind: "campaign image",   group: "betteride", route: "/betteride", made: "2026.02", added: "2026.03" },
  { n: "005", title: "Rain",             kind: "campaign image",   group: "betteride", route: "/betteride", made: "2026.02", added: "2026.03" },
  { n: "006", title: "Scan and book",    kind: "banner",           group: "betteride", route: "/betteride", made: "2026.03", added: "2026.03" },
  { n: "041", title: "Cyclist",          kind: "campaign image",   group: "betteride", route: "/betteride", made: "2026.02", added: "2026.03" },

  { n: "002", title: "Nothing",          kind: "concept ad",       group: "nothing",   route: "/nothing",   made: "2025.11", added: "2025.11" },
  { n: "003", title: "Tube",             kind: "concept ad",       group: "nothing",   route: "/nothing",   made: "2025.11", added: "2025.11" },
  { n: "043", title: "Posters",          kind: "concept campaign", group: "nothing",   route: "/nothing",   made: "2025.11", added: "2025.11" },
  { n: "038", title: "Headphones",       kind: "concept ad",       group: "nothing",   route: "/nothing",   made: "2025.11", added: "2025.12" },
  { n: "039", title: "Studio",           kind: "concept ad",       group: "nothing",   route: "/nothing",   made: "2025.11", added: "2025.12" },
  { n: "040", title: "Handover",         kind: "concept ad",       group: "nothing",   route: "/nothing",   made: "2025.11", added: "2026.01" },

  { n: "042", title: "Unseen Scenes",    kind: "title card",       group: "berlin",    route: "/berlin",                       added: "2026.02" },
  { n: "013", title: "Funkturm",         kind: "photograph",       group: "berlin",    route: "/berlin",    made: "2026.01", added: "2026.02" },

  { n: "012", title: "Identitee",        kind: "poster",           group: "posters",     made: "2026.02", added: "2026.02" },
  { n: "010", title: "Can we trust AI",  kind: "poster",           group: "posters",     made: "2026.02", added: "2026.02" },
  { n: "011", title: "Crossing",         kind: "graphic",          group: "posters",     made: "2026.01", added: "2026.01" },

  { n: "008", title: "Builder Club",     kind: "photograph",       group: "events",      made: "2026.02", added: "2026.02" },
  { n: "009", title: "Panel",            kind: "photograph",       group: "events",      made: "2026.02", added: "2026.02" },
  { n: "007", title: "Portrait",         kind: "photograph",       group: "portrait",    made: "2026.01", added: "2026.01" },

  // Held back: this one is of someone else and wants a conversation first.
  { n: "015", title: "Untitled",         kind: "personal",         group: "portrait",    made: "2025.12", added: "2026.01", sensitive: true },
];

export const GROUP_LABEL: Record<Group, string> = {
  photography: "Photography",
  betteride: "Betteride",
  nothing: "Nothing",
  posters: "Posters and graphic design",
  events: "Events",
  portrait: "Portraits",
  berlin: "Berlin",
  google: "Google",
  aube: "Aube",
};

const key = (f: Frame) => `${f.added}-${f.made ?? "0000.00"}`;

/** Newest addition first. This ordering is the archive's argument. */
export const byAdded = (frames = FRAMES) =>
  [...frames].sort((a, b) => key(b).localeCompare(key(a)));

export const publicFrames = () => FRAMES.filter((f) => !f.sensitive);

/**
 * Every frame has somewhere useful to go. Project work keeps its case-study
 * route, photographs open on the photography page, and standalone archive
 * material opens in the archive viewer.
 */
export const frameHref = (f: Frame) => {
  if (f.route) return f.route;
  const params = new URLSearchParams({ frame: f.n });
  return f.group === "photography"
    ? `/photography?${params}`
    : `/archive?${params}`;
};

export const NEWEST = byAdded(publicFrames())[0]?.added ?? "";
