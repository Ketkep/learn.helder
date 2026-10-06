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

All four topics are built and set to `live`. Before you attach learn.helderlabs.com, skim the Sources list at the bottom of each page: the facts were gathered through search results, and some of the source sites could not be opened directly while writing.

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
- `TopicLayout` takes optional props that any topic can use: `sources` (a list shown at the bottom of the page), `sourcesNote` (a sentence above that list), `bare` (no padded box around the explainer) and `wide` (the explainer runs the full width of the screen, like a film frame).

## The Peru page: how the dig works

The page is one hole you scroll down through. A gauge shows the year you have dug down to (it sits at the left edge on a wide screen and along the top on a phone). Each layer of earth is one shot with a short text, a paper tag with an extra fact, and one tool to try: a brush that wipes sand off a pyramid, a wall of bricks to shove, a wall of stamped bricks, a wall you peel open, a switch for the cotton and fish trade, a shaking table, and a year line.

- `src/data/peru.ts` holds all the words, the brick stamps, the year line and the sources.
- `src/components/peru/Dig.astro` is the frame. Each tool is its own file, `Tool*.astro`, and has a matching script in `src/scripts/peru/`.
- The layers get their colors from the cover color with `mix()` (`src/lib/color.ts`), so nothing depends on `color-mix()`.
- The pictures are drawn with small helpers: `src/lib/rand.ts` (the same random numbers on every build) and `src/lib/svgpath.ts` (smooth curves).
- The wall and shake tools are toy models. They show an idea, not engineering numbers, and the page says so.

## The Dutch page: how the film works

The page is a sideways tracking shot. A coin (the orange knob) rolls along a film strip while a set of stops slides past a pinned screen. Each stop pauses for a while so you can use its toy: a wind sawmill race, a share game (the bars are the exact chances, worked out in the script), a voyage to Batavia with a crew that shrinks, the tulip legend next to the records and a price slider, a dark room you light with a lamp, a coin to flip, and a sluice to open.

- `src/data/dutch.ts` holds all the words, the pretend numbers (they are marked as pretend on the page), the sea route and the sources.
- `src/components/dutch/Roll.astro` is the frame (the sky, the far and near strips, the bar with the year, the film strip, the coin, the "Meanwhile" signs). `Station*.astro` is one stop each. A stop has a `.stop` block with a text card (`.story`) and one or more pictures (`.sub`). Two pictures in a `.col` stack on a wide screen and become two screens on a phone. The tulip stop has two `.stop` blocks.
- `src/scripts/dutch/roll.ts` is the camera. It turns the stops into a timeline of waiting and sliding, moves the layers at different speeds, turns the coin, blends the sky color, and updates the bar. A card whose text is too tall gets slightly smaller text instead of running into the coin. One script per stop starts its toy.
- `src/lib/dutch/` has the drawing helpers (`art.ts`: houses, windmill, ship, people, tulip), the repeating background strips (`layers.ts`), the map (`map.ts`) and the Night Watch drawing (`nightwatch.ts`).
- When the screen is too short, or the reader asked for less motion, the camera does not run. The page is then a plain stack and every toy still works. Without scripts only the pictures and the words show.
- The film mode needs a screen at least 40rem tall on a wide screen and 34rem tall on a phone. Change this in `src/scripts/dutch/roll.ts` (`mq`).
- On a wide screen the stops are whole screens. On a phone every `.story` and `.sub` is its own screen, so long stops take more scrolling.
- The sound switch and all the sounds are shared with the other pages: `src/scripts/sound.ts` makes the sounds, `src/scripts/soundButton.ts` runs the switch.

## The radiation page: how the zoom works

The page is a zoom. One round lens sits next to a card with the text and a tool. Scrolling zooms the lens from a treatment room into the body, the tumour, one cell, its DNA and an atom, and then back out through a dish of cells to the person. A scale bar and the number at the top show how wide the picture is in real life. The ring around the lens turns while you zoom, like the focus ring of a camera.

- `src/data/radiation/` holds the page. `en.ts` and `nl.ts` hold all the words (scene texts, tool texts, takeaways, sources). `index.ts` holds what is the same in every language: the sizes used for the scale bar, how far each jump zooms, and the cell cycle numbers. `types.ts` is the shape both languages must follow.
- `src/components/radiation/Zoom.astro` is the frame. `Scene.astro` is one scene: the round picture and the card. `Scene*.astro` are the eight pictures and their tools.
- `src/scripts/radiation/zoom.ts` is the camera. It turns the scenes into a timeline of waiting and zooming, scales and fades the pictures (the next scene appears small on top of the old one and grows), shows the card of the scene you are on, updates the size at the top, and turns the ring. A card whose text is too tall gets smaller text first, and then scrolls inside itself. On a phone only the first paragraph shows, and "Read more" opens the rest.
- One script per tool: `room.ts`, `body.ts` (with `dose.ts`, the model of where radiation lands), `tumour.ts`, `cell.ts`, `dna.ts`, `rays.ts`, `weeks.ts`, `person.ts`. `active.ts` tells a tool when its scene is in front of the reader, so animations rest otherwise.
- To change how far a jump zooms, edit `zoom` in the scene list (`ratio` is how much the picture grows or shrinks, `dir` says in or out). The size at the top comes from `size` (in metres).
- When the screen is too short, or the reader asked for less motion, or pressed the "Plain view" button, the camera does not run. The page is then a stack of sections (a round picture, then its card) and every tool still works. The choice of the plain view is saved in `localStorage` under `zoomView`.
- The tools are simple models and the page says so. The beam model, the weeks model and the numbers in the cell tool are made up to show an idea, not to plan a treatment. Keep it that way, and keep the sentence "It is not medical advice" in the note above the sources.
- The page is based on a school research project. No names are on the page. To credit the authors, add their names to `sourcesNote` in both `src/data/radiation/en.ts` and `nl.ts`, with their permission.

## The tides page: how the quay works

The page is a walk along a harbour wall. A tide staff (a painted ruler) stands at the left edge, and along the top on a phone. Four benches follow one after another, each with one tool: two bulges of water around the Earth, a tide clock, spring and neap tides, and a toy tank that shows resonance. Whatever you move, the water on the staff moves with it. The staff uses a made-up scale.

- `src/data/tides.ts` holds all the words, the takeaways and the sources.
- `src/components/tides/Quay.astro` is the frame (the staff, the opening card, the benches). `Tool*.astro` is one tool each, with its picture, controls and a status line that is read out to screen readers.
- `src/scripts/tides/quay.ts` runs the staff and starts the tools. A tool calls `staff.set(bench, { level, range, text })` to say where its water stands. The staff shows the report of the bench in the middle of the screen. `model.ts` holds the maths (a 12.42 hour tide, 29.53 day month, the Sun at 0.46 of the Moon, a basin that is open at one end). `bulges.ts`, `clock.ts`, `spring.ts` and `basin.ts` are the tools.
- The tide clock starts with a high tide at 06:00 on day 1. That time is made up. Each day the highs move by 24 h 50 min minus 24 h, about 50 minutes.
- The tank toy uses the exact result for a basin that is open at one end and closed at the other: the closed end rises 1 / cos(k L) times as far as the mouth. Friction is made up (`FRICTION` in `model.ts`) so the peak is finite. The page calls it a toy tank.
- Without scripts the benches are plain text and still pictures. The staff and the play button need a script (`.needs-js`). With reduced motion the play button is hidden, and the staff does not animate.

## The primes page: how the cabinet works

The page is a cabinet of five drawers: the sieve (strike out), dots in rectangles, Euclid's trick (no last prime), a window of 100 numbers that slides up the number line (thinning out), and multiplying two primes against splitting the product (easy one way). Each drawer front is a heading. With a script it becomes a button that opens the drawer (the first one starts open). Inside is a cream tray with the words on the left and one tool on the right.

- `src/data/primes.ts` holds all the words, the takeaways and the sources.
- `src/components/primes/Cabinet.astro` is the frame. `Tool*.astro` is one tool each, with its controls and a status line that is read out to screen readers. Elements that a script builds later (the rectangles) are styled with `is:global` and a `.tool-rects` prefix, because Astro scoping only reaches elements that exist at build time.
- `src/scripts/primes/cabinet.ts` wraps each heading's content in a button (`aria-expanded`, `aria-controls`), opens and closes the trays, and starts the tools. `math.ts` holds the number work (prime test, factoring, sieve). `sieve.ts`, `rects.ts`, `euclid.ts`, `density.ts` and `lock.ts` are the tools.
- The sieve only accepts the smallest number that is not struck out, and stops after 7 because 11 times 11 is more than 100.
- The density drawer builds a sieve up to 1,000,000 in the browser (a few milliseconds) and counts primes from it. The log scale of the slider runs from 100 to 1,000,000.
- The last drawer makes two random primes and splits their product by trial division. Numbers stay below 10^14 so JavaScript numbers are exact. The row for 617 digits is a calculation, not a test.
- Without scripts every drawer is open and the page is plain text with a finished sieve and the 12 and 13 examples. Buttons that need a script carry `.needs-js`.

## The strings page: how the strings work

The page is a row of five strings, each stretched across the full width of the page on a dark wooden board. Above a string are the words, below it are the controls and a status line, and paper tags hold extra facts. The strings: a bridge you drag (shorter is higher), two strings in slow motion, tension and thickness, two strings at once (ratios and the sum of two vibrations), and six harmonics you mix into a sound.

- `src/data/strings.ts` holds all the words, the takeaways and the sources.
- `src/components/strings/Strings.astro` is the frame. `Lesson*.astro` is one string each, with its drawing, controls and status line. Labels that would be too small inside a drawing on a phone are plain HTML (`.cap`, `.tick-row`).
- `src/scripts/strings/` has one script per string (`length.ts`, `wave.ts`, `tight.ts`, `ratio.ts`, `build.ts`), `music.ts` (note names) and `strings.ts` (starts everything).
- Sound is made in the browser by `pluck()` in `src/scripts/sound.ts`: sine partials with a fade, no audio files. It plays after the first click or key press and follows the sound switch.
- The made-up numbers are the starting note (110 Hz for the whole string, `BASE_HZ` in `music.ts`) and the scale of the tension and thickness sliders. The frequency rule (1 / length, square root of tension, 1 / thickness) is the real one.
- The pictures use a slowed-down swing. With reduced motion the plucks and the play buttons do not animate: the strings flash instead, and the time slider stays.
- Without scripts every string is a still drawing and the words read in order. Buttons and sliders carry `.needs-js`.

## The Dutch version and other languages

The radiation page also exists in Dutch, at `/nl/radiotherapie/`. The English page stays the default, and each page links to the other.

- All the words of the page sit in two files with the same shape: `src/data/radiation/en.ts` and `nl.ts`. TypeScript (`npm run check`) fails if a line is missing in one of them. Lines with `{name}` in them are templates, and a pair like `[one, many]` is picked by the count (`src/lib/text.ts`).
- The scripts hold no sentences. `Zoom.astro` puts the words they need on the root element as JSON (`data-ui`), in the language of the page, and `src/scripts/radiation/ui.ts` reads them. So the English page never downloads the Dutch words.
- The frame around a topic (header, footer, "Key takeaways", "Sources", the skip link) is in `src/lib/siteText.ts`. `TopicLayout` and `BaseLayout` take a `lang` prop that sets `<html lang>`, the words around the page, and the `hreflang` links for search engines.
- The home page and the other topics are English only. So the Dutch page has no "next topic" card, and its "all topics" links say "(Engels)".
- For now the home page card for this topic leads to the Dutch page. It shows the Dutch title and text, with a small "NL" mark, and it still sits under "Medicine" in the category filter. The "next topic" card at the end of the topic before it does the same. This is one line in `src/data/topics.ts`: `hubLanguage: 'nl'`. Remove it and both cards lead to the English page again.
- Dutch uses a decimal comma in the size at the top (2,5 m). The Dutch text follows the school project where it can (afweersysteem, uitzaaiing, bronhouders, zaadjes). Facts that the project got wrong were corrected in both languages.
- To translate another topic: add `translations: { nl: { slug, title, hook, category } }` to its entry in `src/data/topics.ts`, put the page in `src/pages/nl/<slug>/index.astro` with `lang="nl"` on `TopicLayout`, and keep the same ids, numbers and links in both languages. Draft topics take their translations down with them in `npm run build`.

## Draft and live

- `status: 'draft'` topics show in `npm run dev` with a small "Draft" label.
- `status: 'live'` topics show everywhere.
- In `npm run build`, the pages of draft topics are deleted from the output, so unfinished work never goes online.

## Where things are

```
src/data/topics.ts       the list of all topics
src/data/gambits.ts      everything the chess page says: games, scenes, field guide, sources
src/data/peru.ts         everything the Peru page says: shots, brick stamps, year line, sources
src/data/dutch.ts        everything the Dutch page says: stops, pretend numbers, route, sources
src/data/radiation/      the radiation page: en.ts and nl.ts (the words), index.ts (the numbers), types.ts
src/data/tides.ts        everything the tides page says: benches, takeaways, sources
src/data/primes.ts       everything the primes page says: drawers, takeaways, sources
src/data/strings.ts      everything the strings page says: lessons, takeaways, sources
src/pages/index.astro    the homepage (hero, filter, grid)
src/pages/<slug>/        one folder per topic.  src/pages/nl/<slug>/: the Dutch versions
src/layouts/             BaseLayout (page shell) and TopicLayout (topic frame)
src/components/          header, footer, topic card, "coming soon" block
src/components/chess/    the chess page: the film, the field guide, the piece sprite
src/components/peru/     the Peru page: the dig and its seven tools
src/components/dutch/    the Dutch page: the film frame, one file per stop, the coin
src/components/radiation/ the radiation page: the zoom frame, one file per scene
src/components/tides/    the tides page: the quay with its staff, one file per tool
src/components/primes/   the primes page: the cabinet of drawers, one file per tool
src/components/strings/  the strings page: the row of strings, one file per lesson
src/styles/global.css    colors, fonts, spacing: change the look here
src/styles/chess.css     boards and pieces
src/styles/dig.css       the Peru dig: gauge, layers, controls
src/styles/roll.css      the Dutch film: plain mode, film mode, bar, strip, controls
src/styles/zoom.css      the radiation zoom: plain mode, film mode, lens, bar, controls
src/styles/tides.css     the tides quay: staff, benches, controls
src/styles/primes.css    the primes cabinet: drawer fronts, trays, controls
src/styles/strings.css   the strings page: boards, strings, controls
src/previews/            one SVG drawing per topic, shown on its cover
src/lib/                 small helpers (cover text color, loading the drawings)
src/lib/siteText.ts      the words around the topics (header, footer, headings) in English and Dutch
src/lib/text.ts          fill {slots} in a line, and pick singular or plural
src/lib/chess/           chess pieces, still diagrams, and the build-time analysis of games
src/lib/dutch/           drawing helpers, background strips, map and painting for the Dutch page
src/lib/rand.ts          repeatable random numbers.  src/lib/svgpath.ts: smooth curves for drawings
src/scripts/             lamp.ts (pull the cord to switch light and dark) and cover-play.ts (plays the covers on touch screens)
src/scripts/film/        the browser side of the chess film: board and controller
src/scripts/peru/        one script per Peru tool, plus the gauge
src/scripts/dutch/       the camera (roll.ts) and one script per Dutch stop
src/scripts/radiation/   the camera (zoom.ts), the dose model, and one script per scene
src/scripts/tides/       the staff (quay.ts), the tide maths (model.ts) and one script per tool
src/scripts/primes/      the cabinet (cabinet.ts), the number work (math.ts) and one script per tool
src/scripts/strings/     one script per string, plus note names (music.ts)
src/scripts/sound.ts     the sounds (made in the browser).  soundButton.ts: the on/off switch.  util.ts: small shared helpers
public/                  favicon and the link preview image
CLAUDE.md                the rules for working on the site, and the daily routine for new topics
docs/daily-log.md        what the daily routine published, skipped and wants to do next
tools/check-topic.mjs    checks a page at 8 widths, with no script, with reduced motion, by keyboard, and makes screenshots
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
