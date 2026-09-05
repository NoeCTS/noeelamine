# noeelamine

Personal site of Noé Elamine. An archive of his work, ordered by when things
were added rather than by how impressive they are, so a campaign and a
photograph sit at the same rank.

## Running it

```sh
npm install
npm run dev      # vite dev server on :8080
npm run build    # production build to dist/
npm run preview  # serve the built output
npm run lint
```

## How it is put together

Vite, React and TypeScript, with Tailwind for layout and a hand-written stylesheet
in `src/index.css` for everything the design actually depends on.

- `src/pages` — one file per route. The archive pages (index, photography,
  graphic design, archive, colophon) share a common chrome; the zones
  (Google, Aube, Betteride, Nothing, Berlin) each carry their own palette and
  deliberately do not.
- `src/data/frames.ts` — the manifest. Every piece of work is a numbered frame
  with a group, a kind and the month it was added. Adding a frame here is what
  puts it on the site; images live in `public/frames/<n>.jpg`.
- `src/lib/ascii.ts` — the reduction engine. Grain, the dot screen and the
  character fields are three settings of the same idea, and the opening, the
  background tree and the colophon all run through it.
- `src/components/Texture.tsx` — grain, dot screen, and the tree drawn out of
  characters. The tree redraws slowly so the glyphs standing in for leaves
  turn, which reads as wind.
- `src/components/Opener.tsx` — the opening. Scrolling refines a character grid;
  the photograph underneath is only ever the source the glyphs are sampled from
  and is never revealed.

Type is self hosted from `public/fonts` apart from Range Sans, which comes from
Typekit and cannot be. Motion is held behind `prefers-reduced-motion` throughout.

## Deploying

`npm run build` produces a static `dist/`. Any static host will serve it, but it
needs a SPA fallback — every unknown path should return `index.html`, or direct
links to routes like `/photography` will 404.
