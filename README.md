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

## The seasons page: how the wall works

The page is a wall of four instruments under a night sky: the Earth on its orbit (not the distance), the length of the days through the year for any tilt, a 24 hour clock with daylight and night, and the noon shadow of a stick. Each instrument is a cream card with words on top and a dark dial below. On a wide screen the cards sit two by two.

- `src/data/seasons.ts` holds all the words, the places for the latitude buttons, the takeaways and the sources.
- `src/components/seasons/Observatory.astro` is the frame (the stars are a tiny SVG made with `rand.ts`). `Inst*.astro` is one instrument each, with its dial, controls and a status line that is read out to screen readers.
- `src/scripts/seasons/sun.ts` holds the maths: the Sun's declination as 23.44 degrees times sin(360/365 x (day minus 81)), the day length from latitude (sunrise when the middle of the Sun is 0.833 degrees under the horizon), the noon height 90 minus the distance between latitude and declination, and the Earth to Sun distance. It was checked against the Amsterdam day lengths (16 h 48 min and 7 h 40 min) and the Tromso midnight sun (a few days out). `orbit.ts`, `tilt.ts`, `day.ts` and `shadow.ts` are the instruments.
- The clock uses sun time, with noon at the top. Summer time and time zones are left out on purpose and the page says so.
- Without scripts every dial is a still drawing (Amsterdam on 21 June, the Earth at the June solstice). The sliders and buttons carry `.needs-js`.

## The Morse page: how the tape works

The page is a strip of paper tape coming out of a telegraph, on a dark desk. The tape has holes down both edges and a tear line between messages. Four messages, each with one tool: a key you hold (a short press is a dot, a long one a dash), a tree you walk (dot left, dash right), the most common letters having the shortest codes (sort the bars, shuffle the codes), and a player that sends a message with the right timing and a game that plays a word to copy by ear or by lamp.

- `src/data/morse.ts` holds all the words, the takeaways and the sources.
- `src/components/morse/Tape.astro` is the frame. `Tool*.astro` is one tool each.
- `src/scripts/morse/code.ts` holds the alphabet, the timing (dot 1 unit, dash 3, gap in a letter 1, between letters 3, between words 7) and the English letter frequencies. `key.ts`, `tree.ts`, `common.ts` and `play.ts` are the tools. The tree rows are built at build time from the alphabet.
- Sound comes from two new functions in `src/scripts/sound.ts`: `hold()` (a tone while the key is down) and `beeps()` (a whole message scheduled ahead, cut off by the function it returns).
- Speed: one word is PARIS plus the gap after it, 50 units, so one unit lasts 1.2 divided by the words per minute, in seconds.
- With reduced motion the lamp does not flash and the timeline does not move. The tools still work with the buttons, and the typed message still plays as sound.
- Without scripts the tape shows the finished examples (SOS, the whole tree, the bars sorted by how common each letter is) and no controls. Controls carry `.needs-js`.
- The English letter table is a standard one. The five largest values were checked in two places, and the page says so.

## The bridges page: how the crossing works

The page is a river crossing with four spans, one after another, with a column between each pair. Each span has its words on the left and a blueprint on the right (on top of each other on a phone). On the blueprints orange means pushing (compression) and light blue means pulling (tension). The spans: a plank that bends (top squeezed, bottom stretched), an arch and a cable (the same curve upside down), a square frame that folds unless it has a diagonal, and a two-rafter truss with a tie.

- `src/data/bridges.ts` holds all the words, the takeaways and the sources.
- `src/components/bridges/Crossing.astro` is the frame. `Tool*.astro` is one blueprint each, with controls and a status line that is read out to screen readers.
- `src/scripts/bridges/model.ts` holds the maths in relative units: the sag of a beam with a weight at any point (scaled so a weight of 1 in the middle of a plank of depth 1 gives 1, and stiffness goes with depth cubed), the sideways force of an arch or a cable (load x span / (8 x rise)), the racking of a frame, and the truss forces (rafter = weight / (2 sin angle), tie = weight / (2 tan angle)). `beam.ts`, `arch.ts`, `frame.ts` and `truss.ts` are the tools.
- No bridge is named as the longest. Only two main spans are quoted (Golden Gate 1,280 m, Akashi Kaikyo 1,991 m), because a newer bridge may have passed them.
- The numbers are relative and the page says they are not a design. Keep that note.
- Without scripts every blueprint is a still drawing and the controls are hidden (`.needs-js`).

## The clocks page: how the movement works

The page is a clock movement taken apart into four brass plates on a dark wooden case. On each plate the picture comes first and the words after it (on a wide screen the pictures swap sides). The plates: a pendulum (length, weight and the size of the swing), an escapement (30 teeth, one tooth per half swing), a clock face with three hands (the gear ratios 60 to 1 and 12 to 1), and a quartz crystal (32,768 Hz halved 15 times, with a drift slider).

- `src/data/clocks.ts` holds all the words, the takeaways and the sources.
- `src/components/clocks/Movement.astro` is the frame. `Tool*.astro` is one plate each, with controls and a status line that is read out to screen readers.
- `src/scripts/clocks/physics.ts` holds the maths: the period 2 x pi x the square root of (length / g) with the first correction for a wide swing, the length of the seconds pendulum (g / pi squared, about 0.994 m), the drift of a clock built for a 2 second swing, and the drift for a number of parts per million. `pendulum.ts`, `escapement.ts`, `gears.ts` and `quartz.ts` are the tools.
- No dates for the escapement are given, because the sources disagreed. Keep it that way unless a clock history reference can be read.
- With reduced motion the pendulum, the running escapement and the blinking lamp do not animate. They are replaced by a still picture and text, and the buttons that start them are hidden or change what they do.
- Without scripts every picture is still and the controls are hidden (`.needs-js`).

## The chance page: how the notebook works

The page is a lab notebook on squared paper with a red margin line and binder holes. Four pages, each with the words on the left (with sticky notes) and an experiment on the right: two dice (a bar for each total, with a mark at the exact odds), flipping coins (the share of heads on a log scale up to 10,000 flips, and how often the flip after a run of five of the same side matches the run), the shared birthday (the curve for 1 to 80 people, a room you can fill, and 1,000 rooms at once) and the three doors puzzle (play by hand, or let the computer play 1,000 games always staying or always switching).

- `src/data/chance.ts` holds all the words, the takeaways and the sources.
- `src/components/chance/Notebook.astro` is the frame. `Tool*.astro` is one experiment each, with controls and a status line that is read out to screen readers.
- `src/scripts/chance/stats.ts` holds the maths (the ways to make each total with two dice, the exact birthday chance with 365 equal days, day names) and the random helper `pick()`, which uses `Math.random`. `dice.ts`, `coins.ts`, `birthday.ts` and `doors.ts` are the experiments. The automatic door games use the fact that staying wins when the first pick is right and switching wins when it is wrong, which holds when the host always opens an empty door and always makes the offer.
- The page is about the maths of chance. It says it gives no advice about gambling. Keep that note.
- Without scripts the dice chart shows the exact odds, the coins and birthday charts are empty or fixed, and the doors are closed. Controls carry `.needs-js`.

## The water page: how the river works

The page is a river that runs down the left side of the page as a wavy blue ribbon, with an orange knob at each of four stops: where the water is (three bars, each a closer look at a small slice of the one before), air that cannot hold it (a box of air as 52 slots, one for each gram of water, that you cool), the mountain (air pushed over a mountain: cloud, rain and a dry far side), and a drop's trail (a drop moving between the sea, the air, rivers, soil, groundwater and ice).

- `src/data/water.ts` holds all the words, the shares of the world's water from the USGS, the takeaways and the sources.
- `src/components/water/River.astro` is the frame. `Tool*.astro` is one stop each.
- `src/scripts/water/air.ts` holds the air maths: the most vapour a cubic metre of air can hold (the Magnus formula, checked against the HyperPhysics table at 0, 10, 20 and 30 degrees), the dew point, and the air over a mountain (dry air cools 9.8 degrees a kilometre, cloudy air 6.5, and the air that comes down is dry). It is a simple model and says so. `journey.ts` holds the places of the drop game: the average stays are rough (sources disagree) and the chances of each move are made up. `where.ts`, `airtool.ts`, `mountain.ts` and `drop.ts` are the tools.
- The word that the hard rules forbid is not used on the page. The file `journey.ts` keeps its name only because renaming adds nothing.
- Without scripts the bars show the first step, the air is the 20 degree example, the mountain is 2 km high, and the table of places shows the rough times. Controls carry `.needs-js`.

## The bits page: how the dock works

The page is a dark board with eight switches fixed at the bottom of the screen (the dock). The switches set one shared byte, from 0 to 255. Four panels above read the same byte in four ways: as a number (place values 128 to 1), as a letter (ASCII), as a counter (add 1, take away 1, double, halve, with carry and wrap at 255) and as a colour (the byte is red, two sliders set green and blue). Without a script the dock is a picture of the byte 65 and each panel shows one example.

- `src/data/bits.ts` holds all the words, the takeaways and the sources.
- `src/components/bits/Machine.astro` is the frame. `Dock.astro` is the switches and `Panel*.astro` is one reading each.
- `src/scripts/bits/byte.ts` holds the shared byte. A panel calls `setByte(v)` to change it and `watch(fn)` to hear about changes. `dock.ts`, `number.ts`, `letter.ts`, `count.ts` and `colour.ts` are the panels. The letter panel uses plain ASCII (128 places), so bytes over 127 say "outside the table".

## The light page: how the beam works

The page is a dark control room with one beam of light fixed at the top of the screen: Earth on the left, a far dot on the right, a pulse between them and a clock. Four panels send the beam somewhere and the clock shows the true travel time: a pulse to the mirrors on the Moon and back, nine places from the Moon to Proxima Centauri (a table without a script), a talk with a rover on Mars where every message takes minutes, and a trip to Proxima Centauri at walking speed, jet speed, Voyager speed and light speed. The animation is sped up and squeezed, but the numbers are true.

- `src/data/light.ts` holds all the words, the takeaways and the sources.
- `src/lib/light.ts` holds the maths shared by the build and the browser: the speed of light, the light-year, the nine places and the time and distance formatting. Distances are typical values, because the planets move.
- `src/components/light/Signal.astro` is the frame and `Beam.astro` is the beam. `Panel*.astro` is one call each.
- `src/scripts/light/beam.ts` runs the beam. A panel calls `send({ name, km, kmS, legs, done })`. With reduced motion it jumps to the end. `moon.ts`, `ladder.ts`, `talk.ts` and `year.ts` are the panels.

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
src/data/seasons.ts      everything the seasons page says: instruments, places, takeaways, sources
src/data/morse.ts        everything the Morse page says: messages, takeaways, sources
src/data/bridges.ts      everything the bridges page says: spans, takeaways, sources
src/data/clocks.ts       everything the clocks page says: plates, takeaways, sources
src/data/chance.ts       everything the chance page says: experiments, takeaways, sources
src/data/bits.ts         everything the bits page says: panels, takeaways, sources
src/data/light.ts        everything the light page says: panels, takeaways, sources
src/data/water.ts        everything the water page says: stops, the shares of Earth's water, takeaways, sources
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
src/components/seasons/  the seasons page: the wall with its four instruments
src/components/morse/    the Morse page: the tape and its four tools
src/components/bridges/  the bridges page: the crossing and its four blueprints
src/components/clocks/   the clocks page: the movement and its four plates
src/components/chance/   the chance page: the notebook and its four experiments
src/components/bits/     the bits page: the dock, the four panels and the frame
src/components/light/    the light page: the beam, the four panels and the frame
src/components/water/    the water page: the river and its four stops
src/styles/global.css    colors, fonts, spacing: change the look here
src/styles/chess.css     boards and pieces
src/styles/dig.css       the Peru dig: gauge, layers, controls
src/styles/roll.css      the Dutch film: plain mode, film mode, bar, strip, controls
src/styles/zoom.css      the radiation zoom: plain mode, film mode, lens, bar, controls
src/styles/tides.css     the tides quay: staff, benches, controls
src/styles/primes.css    the primes cabinet: drawer fronts, trays, controls
src/styles/strings.css   the strings page: boards, strings, controls
src/styles/seasons.css   the seasons page: night wall, cards, dials, controls
src/styles/morse.css     the Morse page: desk, tape, key, tree, bars, player
src/styles/bridges.css   the bridges page: spans, piers, blueprints, controls
src/styles/clocks.css    the clocks page: case, brass plates, dials, ladder
src/styles/notebook.css  the chance page: squared paper, sticky notes, charts, doors
src/styles/bits.css      the bits page: dark board, sticky dock, panels
src/styles/light.css     the light page: dark control room, sticky beam, panels, tables
src/styles/water.css     the water page: the river ribbon, stops, bars, air box, mountain
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
src/scripts/seasons/     the sun maths (sun.ts) and one script per instrument
src/scripts/morse/       the alphabet and timing (code.ts) and one script per tool
src/scripts/bridges/     the statics (model.ts) and one script per blueprint
src/scripts/clocks/      the clock maths (physics.ts) and one script per plate
src/scripts/chance/      the chance maths (stats.ts) and one script per experiment
src/scripts/bits/        the shared byte (byte.ts) and one script per panel
src/scripts/light/       the beam (beam.ts) and one script per panel
src/scripts/water/       the air maths (air.ts), the drop game (journey.ts) and one script per stop
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
