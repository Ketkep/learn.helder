# Helder Labs Learn

The source of learn.helderlabs.com: a hub of interactive explainers. The homepage lists the topics. Every topic is its own page with its own interaction.

Built with Astro and TypeScript, static output, plain CSS. No backend, no accounts, no tracking.

## Run it on your computer

You need [Node.js](https://nodejs.org) (LTS, version 22.12 or newer) and [Git](https://git-scm.com). In PowerShell:

```powershell
node -v          # should print v22.12 or higher
npm install      # downloads the packages (first time only)
npm run dev      # starts the site
```

Open http://localhost:4321 in your browser. Changes show up on save. Press `Ctrl+C` in PowerShell to stop.

Other commands:

```powershell
npm run check    # looks for mistakes in the code
npm run build    # builds the real site into the dist folder
npm run preview  # serves the built site, to see what visitors get
```

## Add a new topic

Three steps.

**1. Add it to the registry.** Open `src/data/topics.ts` and add an entry to the `topics` list:

```ts
{
  slug: 'my-new-topic',            // becomes the URL: /my-new-topic/
  title: 'My new topic',
  hook: 'One line that makes people want to click.',
  category: 'Science',             // a new category appears in the filter by itself
  accent: '#B8452E',               // the cover color. Text and drawing colors on it are picked for you
  preview: 'my-new-topic',         // name of the drawing in src/previews
  dateAdded: '2026-11-01',         // topics are ordered by this date, oldest first
  status: 'draft',                 // change to 'live' when it is ready
},
```

**2. Draw the cover.** Put a simple SVG at `src/previews/my-new-topic.svg`. Use viewBox `0 0 400 300`. Take the colors from the cover where you can, so the drawing works in both light and dark mode (covers keep their color in both). Copy one of the existing files in that folder and change the shapes. These classes are available inside the SVG:

- `class="a"` a solid shape in the text color. `class="b"` a softer shape. `class="c"` a very faint one. `class="cv"` a shape in the cover color (to cut a hole).
- `class="l"` a line, and `class="l dash"` a dotted line.
- `class="knob"` the orange knob. Every cover has one, it is the brand's signature. Use it for the thing the reader moves.
- `class="m"` with `style="--dx: 40px"` (or `--dy`) slides a shape when the cover is hovered. `class="grow"` with `style="--g: 0.1"` stretches it upwards. Add `--i: 2` to delay it by a few steps.
- Plain `<text>` is styled for you (small, in the text color).

For bigger animations, a drawing can contain its own `<style>` block. The three current covers do this: `gambits-in-chess.svg` plays a whole little story on a board (a legal game: 1.d4 d5 2.c4 dxc4 3.e3 Nf6 4.Bxc4), `pyramids-in-peru.svg` is a drawn stepped pyramid in three flat tones (made with a small script that does the isometric math) where the knob climbs the stairs, goes into the temple and the sun comes up, and `the-dutch-golden-age.svg` sails a ship past canal houses. A few rules keep this tidy:

- Start your class names and `@keyframes` names with a short prefix for the topic (`ch-`, `pe-`, `nl-`), so two drawings never clash.
- Put the selector `:is(a, .head-art):is(:hover, :focus-visible, .is-playing)` in front of a rule to run an animation only while the cover is hovered, focused or playing. The same drawing is shown on the topic page, where `.head-art` is the target. `.is-playing` is set by `src/scripts/cover-play.ts`: on touch screens, which have no hover, a cover plays while it is mostly on screen.
- Wrap animations in `@media (prefers-reduced-motion: no-preference)`, so people who ask for less motion get a still drawing.
- Colors: use `var(--cover)` (the cover color), `var(--on-cover)` (the text color on it) and `var(--accent)` (the orange knob). `var(--cover-b)` and `var(--cover-c)` are two softer shades of the cover. For any other shade, write a plain hex color. Do not use `color-mix()`: phones with an iOS older than 16.2 do not know it, and a drawing that depends on it turns black there. `mix()` in `src/lib/color.ts` works out the hex value for you (it mixes the same way as `color-mix(in oklab, ...)`).

**3. Create the page.** Make the folder `src/pages/my-new-topic/` with a file `index.astro` inside:

```astro
---
import TopicLayout from '../../layouts/TopicLayout.astro';
---

<TopicLayout
  slug="my-new-topic"
  intro="Two sentences that say what you will do on this page."
  takeaways={[
    'First thing to remember.',
    'Second thing to remember.',
  ]}
>
  <!-- The interactive part goes here. -->
</TopicLayout>
```

The slug in the folder name, the registry and the `slug` prop must be identical. Title, hook, color, next-topic link and the header all come from the registry and the layout, so you only build what is inside the slot. Inside it, the CSS variable `var(--topic)` holds the topic's accent color.

## Put it online with Vercel

You do not need to run anything on your own computer for this.

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New**, then **Project**, and import the `learn.helder` repository. If it is not in the list, use **Adjust GitHub App Permissions** and allow that repository.
3. Leave every setting as it is. Vercel detects Astro and uses `npm run build` and the `dist` folder by itself. Click **Deploy**.
4. After about a minute you get a link ending in `.vercel.app`. Every time new code is pushed to the repository, Vercel rebuilds the site by itself.
5. For learn.helderlabs.com: open the project, go to **Settings**, then **Domains**, and add the domain. Vercel shows the exact DNS record to create where helderlabs.com is managed.

The gambits page is built. The other two topics (pyramids in Peru, the Dutch Golden Age) are set to `live`, but their pages still say "Coming soon". That is fine while you look at the site on the `.vercel.app` link. Before you attach learn.helderlabs.com, either build those pages or set the topics you are not ready to show to `draft`.

## The gambits page: how the film works

The page is a scrolling film. A "screen" with a chess board is pinned next to the text (on a phone, above it). When a scene comes into view, the screen plays it: pieces slide, subtitles appear, and the **ledger** (what the gambit costs and what it gets) fills in. The reader can scrub, step, replay, make a move on the board, or pick an answer.

Everything about the chess is worked out when the site is built, by `src/lib/chess/analyze.ts` (it uses the `chess.js` package). A move that is not legal stops the build, so a typo in the notation cannot reach the page. The browser never runs a chess engine and does not load `chess.js`: it only plays back the finished result (`src/scripts/film/`, about 7 KB compressed).

To change what the page says, edit `src/data/gambits.ts`:

- `lines`: the games, as lists of moves in standard notation without move numbers, with short notes on chosen moves. A note can draw marker arrows and circles. Move numbers here are plies: 1 is White's first move, 2 is Black's reply.
- `scenes`: the text of each scene, and what the screen does. There are three kinds: `replay` (a game plays and can be scrubbed), `try` (the reader makes one move) and `choose` (the reader picks an answer, which can lead to a second question).
- `guide`: the entries of the field guide at the end. The small boards are drawn from the moves.
- `takeaways` and `sources`: the last two blocks of the page.

The ledger counts three simple things, all explained on the page: material (pawn 1, knight and bishop 3, rook 5, queen 9), how many of the four centre squares a side holds, and how many squares around a king are attacked. They are counts, not an engine's opinion.

Other things to know:

- Sound is made in the browser (no audio files) and is on by default, with a button to turn it off. Browsers keep sound locked until the first tap, click or key press, so the first moves of a visit can be silent. The choice is saved in `localStorage` under `sound`.
- With reduced motion switched on, nothing plays by itself: no title cards, no autoplay, no sliding. The reader steps through with the buttons. Moves can be made with a mouse, a finger or the keyboard (Tab to the board, arrow keys to move around, Enter to pick up and put down).
- Without JavaScript the screen is hidden and each scene shows a still board and its moves instead.
- The chess pieces are drawn for this site (`src/lib/chess/pieces.ts`). The board takes its colors from the topic color.
- The history on the page comes from the pages listed under Sources at the bottom. A search for the best move in the traps was done with the Stockfish engine while writing, not at build time.
- `TopicLayout` takes two optional props that any topic can use: `sources` (a list shown at the bottom of the page) and `bare` (no padded box around the explainer).

## Draft and live

- `status: 'draft'` topics show in `npm run dev` with a small "Draft" label.
- `status: 'live'` topics show everywhere.
- In `npm run build`, the pages of draft topics are deleted from the output, so unfinished work never goes online.

## Where things are

```
src/data/topics.ts       the list of all topics
src/data/gambits.ts      everything the chess page says: games, scenes, field guide, sources
src/pages/index.astro    the homepage (hero, filter, grid)
src/pages/<slug>/        one folder per topic
src/layouts/             BaseLayout (page shell) and TopicLayout (topic frame)
src/components/          header, footer, topic card, "coming soon" block
src/components/chess/    the chess page: the film, the field guide, the piece sprite
src/styles/global.css    colors, fonts, spacing: change the look here
src/styles/chess.css     boards and pieces
src/previews/            one SVG drawing per topic, shown on its cover
src/lib/                 small helpers (cover text color, loading the drawings)
src/lib/chess/           chess pieces, still diagrams, and the build-time analysis of games
src/scripts/             lamp.ts (pull the cord to switch light and dark) and cover-play.ts (plays the covers on touch screens)
src/scripts/film/        the browser side of the chess film: board, controller, sound
public/                  favicon and the link preview image
```

## Design notes

- The idea: the topics are a series, like small books. Each topic is a cover in its own color with a spine and a little paper grain, standing on a shelf. The topic page is the inside of that book and uses the same color.
- The page is a colored wall, not white: sky blue in light mode and a deep navy in dark mode. The planks, the footer (the baseboard), the lamp and the marker marks all belong to that room. Other wall colors were tried (blush pink, mint, butter yellow). Sky blue was chosen, and the orange marker stands out well on it. To change the wall, edit the color variables at the top of `src/styles/global.css` (there are two dark blocks, keep them the same).
- The recurring detail is the slider knob. It is the logo, it sits on every cover, and it ends the lamp's pull cord. Most explainers have something you drag or move, so the knob stands for all of them.
- The lamp ("helder" means bright) hangs in the hero. Pull its cord (drag it, tap it, or press Enter or Space on it) and the page switches between light and dark. The lamp is on in light mode and off in dark mode. The choice is saved in the browser (`localStorage`, key `theme`) and wins over the system setting from then on. The code is in `src/scripts/lamp.ts` and `src/components/Lamp.astro`.
- The marks drawn in orange marker (the circle around "Learn") and the hand-written "pull me" hint draw themselves on the first visit of a session. They are plain SVG paths drawn with a stroke animation. The hint disappears after the first pull. To see the intro again, open the site in a new private window.
- Colors, fonts and spacing are CSS variables at the top of `src/styles/global.css`. Covers keep their color in both modes, like objects on a shelf.
- Fonts are Young Serif (headings and titles), Hanken Grotesk (text) and Covered By Your Grace (only the hand-written notes), installed through `@fontsource` so they are served from this site and not from Google. Young Serif has one weight, so do not make it bold or italic.
- Picking a cover color: take a mid-dark or mid-light color with some personality. Cream text is used on dark covers and near-black text on light ones. Check the result is readable before you publish.
- Older phones: the site avoids `color-mix()` and other very new CSS where it can, gives size rules a `vh` fallback next to `svh`, and builds its scripts for Safari 13 and newer (`vite.build.target` in `astro.config.mjs`). To test an old browser without owning one, rename `color-mix(` to something unknown while the page loads and compare screenshots.
- Touch screens (tablets and phones) have no hover, so a cover plays its animation while it is mostly on screen, and stops when you scroll away. With a mouse, covers play on hover or keyboard focus.
- Movement is switched off for people who ask for reduced motion: no lamp swing, no drawing animation, no cover lift. The lamp still works when used.
- The whole cover is one link (cover and caption), so clicking anywhere on it opens the topic.
- The favicon is a placeholder. The link preview image `public/og-image.png` is a 1200 by 630 picture of the hero. Replace both when the brand artwork is ready.

## Writing rules for this site

Short, plain sentences. Sentence case for headings. No em dashes or en dashes anywhere, no emojis, and no marketing words. Use a period, comma, colon or parentheses instead.
