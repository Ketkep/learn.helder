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

## The maps page: how the globe and its copy work

The page has three panels. Each one shows a globe on the left (the truth) and a flat copy on the right, and a drop-down picks the projection of the copy. The drop-downs of all panels stay the same. Panel 1 stamps the same small circle at 30 places (Tissot's circles) and says how much bigger a circle looks at 30 and 60 degrees than on the equator. Panel 2 slides a patch with the area of Greenland north next to a patch with the area of Africa. Panel 3 draws the shortest route and the constant compass bearing route between two of ten cities. There are no coastlines: the pictures only show a grid and shapes made for the page, and the Earth is a ball of radius 6,371 km.

- `src/data/maps.ts` holds all the words, the takeaways and the sources.
- `src/lib/projections.ts` holds the maths: six projections (Mercator, plate carrée, cylindrical equal-area, sinusoidal, Mollweide and Equal Earth), circles on a ball, great circles and constant bearing routes, and the globe seen from space. `src/lib/maplayers.ts` turns that into the path data each panel draws. The page uses it at build time for the first picture and the scripts use it again in the browser.
- `src/components/maps/Atlas.astro` is the frame. `Twin.astro` is a globe and map pair, and `Panel*.astro` is one panel each.
- `src/scripts/maps/state.ts` holds the chosen projection. `draw.ts` puts new paths into a pair. `circles.ts`, `size.ts` and `route.ts` are the panels.

## The lock page: how the workshop works

The page is a dark workshop with four benches, from a wooden peg lock to a pin lock. Bench 1 is the wooden lock: a bolt with three holes, three loose pegs and three keys (one right, one with the prongs too far apart, one with a prong missing). Bench 2 pushes four keys into a pin lock, and each pin rides the cuts of the key. Bench 3 lets you set the five cuts of your own key and shows which pair of pins blocks the plug. Bench 4 counts possible keys from the number of pins and depths, with and without a limit on neighbouring cuts. The locks are toy models, the count says nothing about how safe a real lock is, and the page does not explain how to defeat a lock.

- `src/data/lock.ts` holds all the words, the takeaways and the sources.
- `src/lib/lock.ts` holds the maths shared by the build and the browser: where each pin sits for a key pushed in by some amount (a pair of pins splits at the shear line when its key pin top is on the line), the key shape, the springs, the wooden lock and the key count (checked against counting every key one by one).
- `src/components/lock/Workshop.astro` is the frame. `PinLock.astro` is the pin lock picture used by benches 2 and 3, and `Panel*.astro` is one bench each.
- `src/scripts/lock/pins.ts` redraws the pin lock. `wood.ts`, `insert.ts`, `cut.ts` and `count.ts` are the benches.

## The bread page: how the day with one loaf works

The page follows one loaf through a day in four stops, each headed by a time of day: 07:30 kneading (a slice of dough whose gluten net gets stronger and holds more gas), 09:00 the rise (dough in a jar, with a temperature and hours to move), 12:00 the oven (a loaf that grows as the gas warms, until the loaf sets at about 76 degrees) and 12:40 the crust (a slice whose crust browns as the surface gets hotter, while the crumb stays near 100 degrees). Without a script each stop shows a picture and a table. Every curve is a toy model with typical numbers, and the page says so.

- `src/data/bread.ts` holds all the words, the takeaways and the sources.
- `src/lib/bread.ts` holds the models (yeast speed against temperature, gluten strength against kneading time, the gas law, crust colour against temperature) and draws the pictures as SVG text, so the build and the browser draw the same thing.
- `src/components/bread/Kitchen.astro` is the frame and `Panel*.astro` is one stop each.
- `src/scripts/bread/` has one script per stop: `knead.ts`, `rise.ts`, `spring.ts` and `crust.ts`.

## The Königsberg page: how the town works

The page is one drawn river town with four pieces of land (A, B, C, D) and places for eleven bridges, shown in four panels. Panel 1 lets you walk the old seven bridges by pressing a land and then the bridges next to you. Panel 2 counts the bridges at each land (3, 3, 5 and 3) and shows that the counts add up to twice the number of bridges. Panel 3 lets you build and remove bridges and says whether a walk over every bridge exists (the town is shared with panel 4). Panel 4 finds such a walk from a start you choose and numbers the bridges in the order of the walk. The shapes of the bridges are pressable SVG shapes with a keyboard focus. The map is a simple drawing, not to scale, and the page does not say which bridges Kaliningrad has today, because the sources disagree.

- `src/data/konigsberg.ts` holds all the words, the takeaways and the sources.
- `src/lib/konigsberg.ts` holds the graph maths: the bridges and where they are drawn, the counts at each land, whether the bridges are joined up, the rule (0 or 2 odd lands) and a walk over every bridge (Hierholzer's method).
- `src/components/konigsberg/Walk.astro` is the frame, `Map.astro` is the town and `Panel*.astro` is one panel each.
- `src/scripts/konigsberg/` has `map.ts` (helpers that make SVG shapes pressable), `build.ts` (the shared town) and one script per panel: `try.ts`, `count.ts`, `build.ts` and `route.ts`.

## The sky page: how the windows work

The page is a dusk blue room with four windows, each an arch of sky with one thing to move. Window 1 slides through the colours (400 to 700 nm) and says how many times more strongly air scatters each colour than red light (one over the wavelength to the fourth power, computed). Window 2 slides the sun from overhead to the horizon and shows the colour of the sun and of the sky overhead, with a toy model of three colours and one layer of air (air mass is one over the sine of the height, capped at 38). Window 3 switches three effects on one at a time (short waves scatter more, the sun gives less violet, the eye notices violet less) and shows how the light is shared between four colour bands. It only counts brightness and says so. Window 4 slides the size of a particle from a gas molecule to a cloud drop and shows the colour it scatters, with a toy curve between blue and white. Without a script each window shows a picture and a table.

- `src/data/sky.ts` holds all the words, the takeaways and the sources.
- `src/lib/sky.ts` holds the models: the colour of a wavelength, scattering against red, the optical depth of the air, the sunlight (a blackbody at 5772 K), the eye curve and the particle size curve.
- `src/components/sky/Windows.astro` is the frame and `Panel*.astro` is one window each.
- `src/scripts/sky/` has one script per window: `waves.ts`, `sun.ts`, `violet.ts` and `cloud.ts`.

## The rhythm page: how the drum machine works

The page is a dark drum machine with four boards, and nothing plays until you press play (the sound can be switched off). Board 1 is a steady beat with a tempo (40 to 200 BPM) and a time signature, and the first beat of each bar sounds different. Board 2 is a grid of 16 steps with presets. Board 3 spreads a number of hits as evenly as possible over a number of steps (Toussaint's Euclidean rhythms) on a ring and names the ones that have names. Board 4 plays two evenly spaced beats at once, such as 3 against 2, on two rings. Only one board plays at a time. The lit step is shown with an outline, not a flash. Without a script each board shows its patterns as rows of x and dots.

- `src/data/rhythm.ts` holds all the words, the takeaways and the sources.
- `src/lib/rhythm.ts` holds the maths: seconds per beat, the evenly spread pattern, the named rhythms, the points of a ring and the least common multiple.
- `src/components/rhythm/Stage.astro` is the frame and `Panel*.astro` is one board each.
- `src/scripts/rhythm/clock.ts` is the small looping clock that plays the hits (one loop at a time). `beat.ts`, `grid.ts`, `euclid.ts` and `poly.ts` are the boards.

## The cannon page: how the mountain works

The page is about Newton's cannonball: a cannon on a very high mountain fires a ball sideways over a round planet with no air. Panel 1 draws the path for a planet (Earth, the Moon, Mars or Jupiter), a mountain height and a speed, and says whether the ball falls back (and where), goes round in a circle or an oval (with the closest and farthest height and the time for one lap) or escapes. A button moves the ball along the path. Panel 2 shows that in one second the ball falls about 4.9 metres while the ground curves away by the same amount at about 7.9 km a second. Panel 3 gives the speed and lap time of a circular orbit at four heights on Earth. The shots are worked out by stepping the motion in small time steps (velocity Verlet) and the class of the shot (falls, orbit, escape) comes from the energy and the closest point. Without a script each panel shows one picture and a table.

- `src/data/cannon.ts` holds all the words, the takeaways and the sources.
- `src/lib/orbit.ts` holds the maths: the four planets, circular and escape speed, the stepped shot, the curve of the ground and the picture of a shot as SVG text, so the build and the browser draw the same thing.
- `src/components/cannon/Range.astro` is the frame and `Panel*.astro` is one panel each.
- `src/scripts/cannon/` has one script per panel: `fire.ts`, `second.ts` and `heights.ts`.

## The cipher page: how the wheel works

The page is a dark writing desk with a cipher wheel and four tries. Try 1 is a wheel of two rings of letters: type a message, turn the inner ring by a number of places and read the result (it also decodes, and has a button for a shift of 13). Try 2 breaks a shifted message by counting letters: a bar chart of the letter counts is drawn against the usual English pattern, you turn a guess until the two line up, or let the computer pick the shift that fits English best. Try 3 counts the keys of a shift cipher (25) and of a cipher where every letter has its own partner (26 factorial, about 4 times 10 to the power of 26) and shows how long trying them would take at a made up speed. Try 4 uses a keyword (Vigenère) and shows how the letter counts flatten. These are toy ciphers and the page says they are not safe to use. Without a script each panel shows a worked example.

- `src/data/cipher.ts` holds all the words, the takeaways and the sources.
- `src/lib/cipher.ts` holds the maths: the shift, the keyword cipher, letter counts, the English table, the best shift and the bar charts as HTML text, so the build and the browser draw the same thing.
- `src/components/cipher/Wheel.astro` is the frame and `Panel*.astro` is one try each.
- `src/scripts/cipher/` has one script per try: `wheel.ts`, `break.ts`, `keys.ts` and `keyword.ts`.

## The leaves page: how the leaf works

The page has three panels about the colours of a leaf. Panel 1 is a mixer: three sliders for green chlorophyll, yellow and orange carotenoids and red anthocyanins, and a leaf that takes the colour left over when each pigment soaks up its colours of light. Panel 2 is a strip of paper (paper chromatography) where a summer or an autumn leaf is pulled apart as the liquid climbs: carotene travels farthest, then xanthophyll, then chlorophyll a, then chlorophyll b. Panel 3 slides through the weeks of autumn, with sunny days and cool nights or dull weather, and a hard frost in week 4 that stops any more red being made. All of it is a toy model of rules of thumb and the page says so. Without a script each panel shows a table.

- `src/data/leaves.ts` holds all the words, the takeaways and the sources.
- `src/lib/leaves.ts` holds the models: the leaf colour from the three pigments, the season and the bands of the paper strip.
- `src/components/leaves/Turn.astro` is the frame and `Panel*.astro` is one panel each.
- `src/scripts/leaves/` has one script per panel: `mix.ts`, `paper.ts` and `season.ts`.

## The bee page: how the hive works

The page is a dark honey room with four looks into a hive, each with the comb (a bee dancing on an upright comb, where straight up means the direction of the sun) next to a map of the garden from above (the hive in the middle, the sun at the edge, the flowers). Look 1 reads a dance: the angle of the waggle run and its length give the direction and distance of the flowers. Look 2 goes the other way: press the map or move the sliders and the comb shows the dance. Look 3 slides the sun through the day with the flowers fixed, and the angle of the dance changes. Look 4 shows noise: each run is off by up to about 15 degrees and 15 per cent, and the average of more runs lands closer, with the typical error over many tries worked out by a seeded simulation. The distance scale is a rule of thumb of one kilometre a second and the page says so. The sun is a toy (15 degrees an hour, south at noon).

- `src/data/bees.ts` holds all the words, the takeaways and the sources.
- `src/lib/bees.ts` holds the maths: the map points, the angle of the dance, the sun, the noisy runs, the typical error, and the comb and garden as SVG text.
- `src/components/bees/Hive.astro` is the frame, `Pair.astro` is the comb and the map, and `Panel*.astro` is one look each.
- `src/scripts/bees/` has `draw.ts` (redraws a pair) and one script per look: `read.ts`, `send.ts`, `sun.ts` and `noise.ts`.

## The thermostat page: how the strip charts work

The page shows four strip charts, like the paper strips of a chart recorder: a room over one day (24 hours, one step a minute) with a thermostat that switches a heater on and off. The grey blue band is the gap between switching on and switching off, the dashed line is the set temperature, the green dotted line is the outside temperature, the orange marks show when the heater is on and the red line is the room temperature. Strip 1 changes the temperature you want and the outside temperature (the loop). Strip 2 changes the gap (hysteresis). Strip 3 changes how fast the room loses heat (the walls). Strip 4 gives the heater a lag so the room overshoots. The room, the heater power (3 degrees an hour) and the leak numbers are a toy model and the page says so. Without a script each panel shows one chart.

- `src/data/thermostat.ts` holds all the words, the takeaways and the sources.
- `src/lib/thermostat.ts` holds the model (`simulate`) and the chart as SVG text, so the build and the browser draw the same thing.
- `src/components/thermostat/Room.astro` is the frame and `Panel*.astro` is one strip each.
- `src/scripts/thermostat/strip.ts` redraws a strip when a slider moves, and `thermostat.ts` sets up the four strips and the sentences they say.

## The growth page: how the ledger works

The page is about compound growth, with made up coins and a clear note that nothing on it is money advice. Page 1 draws simple growth (a straight line) against compound growth (a curve) for a rate and a number of years. Page 2 compares the rule of 72 with the exact doubling time. Page 3 shows what coins can buy once prices rise (the exact form of the Fisher equation). Page 4 shows what happens when growth is added once a year, monthly, daily or all the time. The charts are drawn as SVG text from `src/lib/growth.ts`, so the build and the browser draw the same thing. Without a script each panel shows one chart or table.

- `src/data/growth.ts` holds all the words, the takeaways and the sources.
- `src/lib/growth.ts` holds the sums and the line chart.
- `src/components/growth/Ledger.astro` is the frame and `Panel*.astro` is one page each.
- `src/scripts/growth/growth.ts` starts all four panels.

## The leap year page: how the almanac works

The page has four almanac pages about why the calendar needs leap years. Page 1 runs a calendar with no leap days and shows the spring equinox slipping later (a quarter of a day a year). Page 2 runs the Julian rule (a leap day every four years, an average year of 365.25 days) and shows the equinox slipping earlier, about 10 days after about 1,300 years. Page 3 checks any year against the Julian rule and the Gregorian rule and counts the 400 year cycle (365.2425 days). Page 4 draws the month pages of October 1582 and September 1752 with the skipped days left out, so the weekdays stay true (Thursday 4 October is followed by Friday 15 October, and Wednesday 2 September by Thursday 14 September). The sums are year length differences times years, and the model uses the average year. The page gives no date for the Netherlands because the sources did not agree. Without a script each page shows one chart or table.

- `src/data/leap.ts` holds all the words, the takeaways and the sources.
- `src/lib/calendar.ts` holds the maths: the three year lengths, the leap rules, the shift of the equinox, the drift chart and the month pages as HTML text.
- `src/components/leap/Almanac.astro` is the frame and `Panel*.astro` is one page each.
- `src/scripts/leap/leap.ts` starts all four pages.

## The tree ring page: how the four cuts work

The page is a stump cut four ways. Cut 1 grows a stump year by year from a seeded made-up climate and shows that a wide ring is a good year and a narrow ring a poor one. Cut 2 asks the reader to count the rings of a stump and checks the count. Cut 3 slides the ring pattern of a beam along a long record and shows the correlation r at every start year, with a button that finds the best match (cross dating). Cut 4 chains overlapping samples (a living tree, a fallen tree, beams) so the record reaches further back. The climate, the beams and the matches are a toy model: the weather is a seeded random series, not real data, and the page says so. The real facts (earlywood and latewood, cross dating, bristlecone pines of about 4,765 years, records of about 8,500 years) come from the sources. Without a script each cut shows one drawing or table.

- `src/data/rings.ts` holds all the words, the takeaways and the sources.
- `src/lib/rings.ts` holds the seeded climate, the ring widths, the stump and chart drawings as SVG text, the correlation and the best-fit search.
- `src/components/rings/Stump.astro` is the frame and `Panel*.astro` is one cut each.
- `src/scripts/rings/rings.ts` starts all four cuts.

## The loudness page: how the four meters work

The page is a bench with a sound level meter. Meter 1 is a ruler from 0 to 140 decibels with real examples, and shows that every 10 dB is ten times the sound intensity (60 dB is a million times 0 dB). Meter 2 adds two sounds (two equal sounds add 3 dB, not double). Meter 3 moves away from a sound source and shows the level drop by 6 dB each time the distance doubles (free field, a toy model). Meter 4 shows how long a level can be listened to with the NIOSH rule (3 dB halves the time, 85 dB for 8 hours) and the OSHA rule (5 dB halves the time, 90 dB for 8 hours). The page is not medical advice and says so. Without a script each meter shows one table or picture.

- `src/data/loud.ts` holds all the words, the takeaways and the sources.
- `src/lib/decibel.ts` holds the decibel maths, the exposure rules and the example sounds.
- `src/components/loud/` is the meter frame, one meter and `Panel*.astro` for each of the four.
- `src/scripts/loud/loud.ts` starts all four meters.

## The Moon page: how the four stations work

The page is a dark room with a lamp and four stations. Station 1 moves the Moon round the Earth with a days slider, and shows a top view of the orbit next to the Moon as seen from the northern hemisphere, with the lit fraction and the phase name (the shape is the lit half seen at an angle, never the shadow of the Earth). Station 2 shows when each of the eight phases rises and sets in a toy sky (Sun up 06:00 to 18:00, the Moon rising about 50 minutes later each day). Station 3 keeps the stars fixed and shows why the phases repeat every 29.53 days while one lap against the stars takes 27.32 days. Station 4 is a side view of a made up year of 13 new moons and 13 full moons, with the 5.145 degree tilt, and counts how many bring an eclipse. The eclipse limits (1.5 and 0.9 degrees), the year and its start angle are made up, and the page says so. Without a script each station shows one picture or table.

- `src/data/moon.ts` holds all the words, the takeaways and the sources.
- `src/lib/moon.ts` holds the maths (elongation, lit fraction, rise hour, the tilt and the eclipse limits) and the drawings as SVG text.
- `src/components/moon/Room.astro` is the frame and `Panel*.astro` is one station each.
- `src/scripts/moon/moon.ts` starts all four stations.

## The search engine page: how the four drawers work

The page is a card room with four drawers on a made up web of eight small garden club pages. Drawer 1 runs a crawl one page at a time (a queue, breadth first) and shows that a page no other page links to is never found. Drawer 2 is the index: for every word the pages that contain it, with a search box that keeps only the pages on every card. Drawer 3 orders the matches by the share of the page made of the query words, with a switch that weighs rare words more (tf idf, with the log of pages over pages with the word, so a word on every page counts for nothing). Drawer 4 runs PageRank by rounds with a damping factor of 0.85 and lets the reader add one link. The web, the texts and every score are made up, and the page says so. Without a script each drawer shows one picture or table.

- `src/data/search.ts` holds all the words, the takeaways and the sources.
- `src/lib/search.ts` holds the pages and links, the index, the crawl, the scores, PageRank and the drawing of the web as SVG text.
- `src/components/search/Cards.astro` is the frame and `Panel*.astro` is one drawer each.
- `src/scripts/search/search.ts` starts all four drawers.

## The Nim page: how the table works

The page is a table with rows of matchsticks and four things to try. Try 1 plays the classic game (heaps of 1, 3, 5 and 7, last stick wins) against a machine that plays at random or perfectly, with the choice of who starts. Try 2 shows the heaps in binary with the nim-sum (XOR). Try 3 asks for the winning move in seeded positions and checks it. Try 4 plays the version where the last stick loses. The strategy in `src/lib/nim.ts` was checked by computer against every position of up to four heaps of at most five sticks in both versions. Without a script the sticks are a picture and the binary table is shown.

- `src/data/nim.ts` holds all the words, the takeaways and the sources.
- `src/lib/nim.ts` holds the nim-sum, the winning moves for both versions and the practice positions.
- `src/components/nim/Table.astro` is the frame, `Sticks.astro` draws the heaps and `Panel*.astro` is one try each.
- `src/scripts/nim/nim.ts` starts all four tries.

## The earthquake page: how the four strips work

The page is a dark wall of seismograph strips and a map table. Strip 1 draws a seismogram for a station at a chosen distance, with the P wave and the S wave arriving. The wave speeds are a toy (6.0 and 24/7 km/s) that gives the rule of thumb of 8 km for every second between the two. Strip 2 gives the gap at three stations on a map and lets the reader set three circles; when the radii are within 15 km of the true distances the epicentre shows up. Strip 3 is the magnitude scale (each whole number is 10 times the wave height and 10 to the power 1.5 times the energy). Strip 4 draws a cut through the Earth and the zones where P and S waves arrive (S waves stop beyond 103 degrees, the P wave shadow zone is 103 to 142 degrees). The map, the stations and the speeds are a toy model and the page says so. Without a script each strip shows one picture or table.

- `src/data/quake.ts` holds all the words, the takeaways and the sources.
- `src/lib/quake.ts` holds the wave maths, the stations and quakes, and the seismogram, map and Earth drawings as SVG text.
- `src/components/quake/Wall.astro` is the frame and `Panel*.astro` is one strip each.
- `src/scripts/quake/quake.ts` starts all four strips.

## The file compression page: how the four packs work

The page is a dark packing table with four things to try, each a small toy version of an idea in a zip file. Pack 1 turns a row of 32 dots into runs (1 bit a dot plain, 1 bit plus 6 bits a run) and shows that a checker row gets longer. Pack 2 replaces repeated text with pointers back (a letter costs 9 bits, a pointer 13), which is the LZ77 idea. Pack 3 builds Huffman codes for the letters of a text and counts the table that must be stored too (12 bits a letter). Pack 4 compares the ideas on four texts, including random letters that do not shrink, and counts the messages of 10 bits against the shorter ones (1,024 against 1,023). All sizes are counted by `src/lib/shrink.ts`, so the page shows exactly what the toy gives. Without a script each pack shows one table.

- `src/data/shrink.ts` holds all the words, the takeaways and the sources.
- `src/lib/shrink.ts` holds the runs, the repeats, the Huffman codes, the sample texts and the bit counts.
- `src/components/shrink/Bench.astro` is the frame and `Panel*.astro` is one pack each.
- `src/scripts/shrink/shrink.ts` starts all four packs.

## The eye page: how the four tests work

The page is a dark room with four tests of your own eyes. Test 1 is the blind spot: a cross and a dot, with the dot placed at the angle of about 15 degrees for a chosen distance from the screen (distance times the tangent of 15 degrees, with a CSS pixel taken as 1/96 inch). Test 2 is the pupil: a toy that moves it from 8 mm to 2 mm in a straight line with brightness, and shows that the light that gets in goes with the area. Test 3 is an afterimage that the reader makes with their own eyes: stare at a colour patch and look at a blank one (the ghost colour is the opponent colour). Test 4 is the side of vision: a letter whose readable size grows with the angle from the cross (a toy, with 33 pixels for a degree at about 50 cm). The page is not an eye test and not medical advice, and says so. Without a script each test shows one picture.

- `src/data/eye.ts` holds all the words, the takeaways and the sources.
- `src/lib/eye.ts` holds the blind spot geometry, the pupil toy, the afterimage colours and the letter size rule.
- `src/components/eye/Room.astro` is the frame and `Panel*.astro` is one test each.
- `src/scripts/eye/eye.ts` starts all four tests.

## The languages page: how the four cards work

The page is a light paper desk of word cards with four things to try. Card 1 shows twelve basic words in English, Dutch, German, French and Spanish, with bars for how alike each word is to the English one (spelling, counted as edit distance divided by the longer word). Card 2 builds a family tree from those differences by joining the two closest groups again and again (average distance, UPGMA) and draws it sideways step by step. Card 3 applies Grimm's law to the first sound of a Latin word (p to f, t to th, c as k to h) and shows the real English, Dutch and German words. Card 4 is a small quiz of Dutch words that English borrowed (about 1 per cent of English words). Spelling is a toy for how alike languages are, and the page says so. Without a script each card shows one table, and the tree and the quiz answers are shown.

- `src/data/tongues.ts` holds all the words, the takeaways and the sources.
- `src/lib/tongues.ts` holds the word cards, the similarity, the tree joins and drawing, the sound shifts and the loanwords.
- `src/components/tongues/Desk.astro` is the frame and `Panel*.astro` is one card each.
- `src/scripts/tongues/tongues.ts` starts all four cards.

## The solar system page: how the four stops work

The page is a long dark road from the Sun with four stops. Stop 1 shrinks the Sun to a pea, an apple or a beach ball and lists the distance and width of every planet in the model (everything is scaled by the same number, so it is exact). Stop 2 is a strip with the planets to scale for an apple Sun and a slider that walks along it (1.4 m a second). Stop 3 is a guessing game for the distance of a planet. Stop 4 gives the trip time from the Sun at the speed of walking, a car, a jet, Voyager 1 (17 km/s) and light. The distances are the mean values from NASA and JPL sources, and Voyager 1 is put at about 160 astronomical units (2025). Without a script each stop shows one table.

- `src/data/scale.ts` holds all the words, the takeaways and the sources.
- `src/lib/scale.ts` holds the planets, the scale model maths, the trip times and the formatting of lengths and times.
- `src/components/scale/Road.astro` is the frame and `Panel*.astro` is one stop each.
- `src/scripts/scale/scale.ts` starts all four stops.

## The sound page: how the four screens work

The page is a dark bench with a scope screen and four things to try, with play buttons that use the shared sound helpers (`src/scripts/sound.ts`, with the sound switch). Screen 1 draws one sine wave for a chosen frequency over a hundredth of a second, names the nearest note and holds the tone while the button is down. Screen 2 adds eight harmonics with sliders (presets for sine, square, sawtooth and triangle) and draws the sum. Screen 3 compares toy recipes for a flute, a clarinet, a violin and an organ at the same pitch. Screen 4 draws two close notes added together (the fast wiggle is drawn slowly, the beat envelope is true to time) and plays both. The instrument recipes are toys, and the page says so. Without a script each screen shows one picture.

- `src/data/scope.ts` holds all the words, the takeaways and the sources.
- `src/lib/wave.ts` holds the wave sums, the note names, the recipes and the scope drawings as SVG text.
- `src/components/scope/Screen.astro` is the frame and `Panel*.astro` is one screen each.
- `src/scripts/scope/scope.ts` starts all four screens.

## The aqueduct page: how the four hills work

The page is a dark hillside with four things to try. Hill 1 draws a channel from a spring to a town and works out the fall as the slope (cm per km) times the length (km), with the Nîmes values (34 cm/km over 50 km, 17 m) as the start. Hill 2 draws a siphon and gives the pressure at the bottom (0.0981 bar for each metre of depth) and the head the far tank must lose. Hill 3 is a quiz of four pieces of land (follow the slope, tunnel, arches, siphon), with the reason for each choice. Hill 4 is a guessing game for the share of Rome's water line on arches (about 48 of about 500 km). The fall is drawn much bigger than life, and the page says so. Without a script each hill shows one picture.

- `src/data/aqueduct.ts` holds all the words, the takeaways and the sources.
- `src/lib/aqueduct.ts` holds the fall and pressure maths, the four pieces of land and the drawings as SVG text.
- `src/components/aqueduct/Channel.astro` is the frame and `Panel*.astro` is one hill each.
- `src/scripts/aqueduct/aqueduct.ts` starts all four hills.

## The time zone page: how the four maps work

The page is a dark navy room with a flat map of the world in four versions. Map 1 moves the Sun over the map with a UTC slider: the daylight band is 180 degrees wide around the point where the Sun is highest (15 degrees an hour), and the numbers under the map are the clock hour of each hourly zone. Map 2 gives the clocks of eight cities for a chosen time in Amsterdam (winter offsets, with the day shown). Map 3 shows how many minutes each city's clock is ahead of or behind its Sun (offset minus longitude divided by 15), with a switch for summer time in Europe and the US. Map 4 flies across zones and works out the clock at the other end. The offsets are standard winter time and the city longitudes are general knowledge. Without a script each map shows one picture or table.

- `src/data/zones.ts` holds all the words, the takeaways and the sources.
- `src/lib/zones.ts` holds the cities, the clock sums, the flights and the map drawing as SVG text.
- `src/components/zones/Map.astro` is the frame and `Panel*.astro` is one map each.
- `src/scripts/zones/zones.ts` starts all four maps.

## The loan page: how the five lines work

The page is a dark ledger with five things to try on a made up loan (a fixed yearly rate, one payment a month, no fees and no taxes, amounts in euros). Line 1 works out the level payment from the amount, the yearly rate and the years, and the total interest. Line 2 draws every payment of a loan of 100,000 at 5 per cent over 25 years as interest under repayment, with a month slider and the month where repayment passes interest. Line 3 compares terms of 10 to 30 years. Line 4 adds an extra amount each month (the page's own sum) and shows months and interest saved. Line 5 compares a level (annuity) payment with a falling (linear) one. The sums match the examples in the sources (a level payment of 2,387 and a linear payment from 3,056 to 1,394 for 500,000 at 4 per cent over 30 years, and the crossover in month 223). The page explains maths and is not financial advice. Without a script each line shows one picture or table.

- `src/data/loan.ts` holds all the words, the takeaways and the sources.
- `src/lib/loan.ts` holds the payment and schedule maths and the two charts as SVG text.
- `src/components/loan/Ledger.astro` is the frame and `Panel*.astro` is one line each.
- `src/scripts/loan/loan.ts` starts all five lines.

## The volcano page: how the four vents work

The page is a dark ash room with a cone and four things to try. Vent 1 sets the silica (45 to 75 per cent) and the dissolved gas of a magma and shows an eruption: the rock type (basalt below 52, rhyolite from 69), a toy temperature and a rough viscosity, and a toy score that turns stickiness and gas into a quiet flow, a fountain or an explosion, drawn as lava or an ash column. Vent 2 works out the pressure from the weight of rock (2,500 kg for every cubic metre) and how much a gas bubble grows on its way up (in proportion to the drop in pressure, constant temperature). Vent 3 draws four plate settings and says how magma is made in each. Vent 4 shows the VEI scale, each step about ten times the one before, with Mount St. Helens (1980) at 5. The scores are toys, and the page says so. Without a script each vent shows one picture.

- `src/data/volcano.ts` holds all the words, the takeaways and the sources.
- `src/lib/volcano.ts` holds the magma maths, the toy score, the pressure and growth sums, and the drawings as SVG text.
- `src/components/volcano/Cone.astro` is the frame and `Panel*.astro` is one vent each.
- `src/scripts/volcano/volcano.ts` starts all four vents.

## The battery page: how the four benches work

The page is a dark bench with four things to try. Bench 1 stacks Volta's pile of zinc discs, cards and copper discs, with a toy of 1.1 volts for each pair (the voltage of a zinc and copper cell). Bench 2 goes through the five steps of a Daniell cell and lights up the part that is working (zinc gives up electrons, they go round the wire, copper takes them up, ions finish the circuit). Bench 3 wires four toy cells of 1.5 V and 2,000 mAh in series, two by two or in parallel and shows the voltage, the capacity and the energy (volts times amp hours, the same in each layout). Bench 4 divides the energy by the power of a device to give hours, and says that real batteries give less when drained fast. The cell values are made up, and the page explains how batteries work and gives no advice on using or charging them. Without a script each bench shows one picture.

- `src/data/cell.ts` holds all the words, the takeaways and the sources.
- `src/lib/battery.ts` holds the pile, the cell steps, the layouts, the run time sum and the drawings as SVG text.
- `src/components/cell/Bench.astro` is the frame and `Panel*.astro` is one bench each.
- `src/scripts/cell/cell.ts` starts all four benches.

## The heart page: how the four beats work

The page is a dark room with a flat drawing of the heart and four things to try. Beat 1 goes through the eight steps of the blood's trip (body, right atrium, right ventricle, lungs, left atrium, left ventricle, aorta, body) with a drop that is blue before the lungs and red after. Beat 2 multiplies beats a minute by millilitres a beat to give litres a minute, and beats and litres in a day. Beat 3 multiplies a resting rate by an age to give the beats of a life. Beat 4 shows the four valves open or shut in the two halves of a beat. All sums are plain arithmetic and the page says it is not medical advice and gives no targets. Without a script each beat shows one picture.

- `src/data/heart.ts` holds all the words, the takeaways and the sources.
- `src/lib/heart.ts` holds the route, the sums and the drawings as SVG text.
- `src/components/heart/Pump.astro` is the frame and `Panel*.astro` is one beat each.
- `src/scripts/heart/heart.ts` starts all four beats.

## The rainbow page: how the four drops work

The page is a dark rain room with four things to try. Drop 1 sends a ray through a round drop (entry, one reflection, exit) and plots the total turn against where the ray hits, with the smallest turn of about 138 degrees marked (180 minus 138 gives the bow at about 42 degrees). Drop 2 uses a fitted formula for the refractive index of water (about 1.330 for red, 1.343 for violet) to give each colour its own bow angle (red 42.5, violet 40.6). Drop 3 draws the sky for a Sun at a chosen height, with the bow as a circle round the point opposite the Sun, and says when the whole bow is below the horizon (the page's own geometry). Drop 4 switches between one and two bounces, with the second bow at about 51 degrees and the colours reversed. The angles come from Snell's law, worked out in `src/lib/rainbow.ts`, and agree with the sources. Without a script each drop shows one picture.

- `src/data/bow.ts` holds all the words, the takeaways and the sources.
- `src/lib/rainbow.ts` holds the optics maths and the drawings of the drop, the curve and the sky as SVG text.
- `src/components/bow/Shower.astro` is the frame and `Panel*.astro` is one drop each.
- `src/scripts/bow/bow.ts` starts all four drops.

## The camera page: how the four shots work

The page is a dark room with four things to try. Shot 1 is a pinhole: the brightness goes with the area of the hole and the blur is the width of the hole plus the spreading of light at a small hole (2.44 times the wavelength times the box depth over the hole width), so there is a best size (about 0.37 mm in a box 10 cm deep, the page's own simple optics). Shot 2 is the f-number series 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, each full step halving the light, with blurred lights that grow with a wider opening. Shot 3 sets aperture, shutter time and ISO against a toy scene that needs f/4, 1/250 s and ISO 100, and shows the picture too bright or too dark in stops, a moving ball smeared by the shutter and grain from a high ISO. Shot 4 shows a face with 2, 4, 8 or 16 squares a side and the size of a 12 megapixel picture kept as three bytes a pixel (36 megabytes). The toy scene is made up. Without a script each shot shows one picture.

- `src/data/camera.ts` holds all the words, the takeaways and the sources.
- `src/lib/camera.ts` holds the pinhole, f-number, exposure and pixel maths and the drawings as SVG text.
- `src/components/camera/Darkroom.astro` is the frame and `Panel*.astro` is one shot each.
- `src/scripts/camera/camera.ts` starts all four shots.

## The printing press page: how the four benches work

The page is a dark printer's workshop with four things to try. Bench 1 goes through seven steps (steel punch, matrix, cast type, set type, ink, press, lift the page) with a picture for each, using the usual punch and matrix account and noting that it is debated. Bench 2 shows a line of type as it stands in the frame (mirrored and running right to left) and as it prints, and counts the pieces of type of each letter. Bench 3 compares copying a book by hand (7 pages a day, from a source) with setting type once (1,000 letters an hour, from a source) and printing copies, using made up page size, press speed and working day. Bench 4 is a guessing game for three numbers on a scale that rises ten times each step: towns with a press by 1500 (282), different editions before 1501 (about 30,000) and surviving copies (about 550,000). Without a script each bench shows one picture or table.

- `src/data/press.ts` holds all the words, the takeaways and the sources.
- `src/lib/press.ts` holds the steps, the letter counts, the time sums, the numbers and the drawings as SVG text.
- `src/components/press/Workshop.astro` is the frame and `Panel*.astro` is one bench each.
- `src/scripts/press/press.ts` starts all four benches.

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

## The tic-tac-toe page: how the four slates work

The page is a dark green school slate with chalk and four things to try. Slate 1 plays the machine, which looks at every continuation (minimax) and picks at random among equally good moves, so it never errs, with a score of your games on the page. Slate 2 picks the first move of cross and marks every reply of the nought as a draw or a loss, from the computed values. Slate 3 shows how many of the 255,168 games end on each move (5 to 9), and has a button that makes the browser play out every game again and compare. Slate 4 asks for the best move in five positions and says whether a move wins, draws or loses. Without a script each slate shows one board or table.

- `src/data/ttt.ts` holds all the words, the takeaways and the sources.
- `src/lib/ttt.ts` holds the rules, the minimax values, the counts (positions, games, symmetry classes) and the practice positions. The counts match the published figures (5,478 positions, 255,168 games, 765 up to turning and mirroring).
- `src/lib/tttview.ts` makes the board as HTML text, used at build time and in the browser. Pieces and marks always carry words as well as colour.
- `src/components/ttt/Slate.astro` is the frame and `Panel*.astro` is one slate each.
- `src/scripts/ttt/ttt.ts` starts all four slates.

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
src/data/maps.ts         everything the maps page says: panels, takeaways, sources
src/data/lock.ts         everything the lock page says: benches, takeaways, sources
src/data/bread.ts        everything the bread page says: stops, takeaways, sources
src/data/konigsberg.ts   everything the Königsberg page says: panels, takeaways, sources
src/data/sky.ts           everything the sky page says: windows, takeaways, sources
src/data/rhythm.ts        everything the rhythm page says: boards, takeaways, sources
src/data/cannon.ts        everything the cannon page says: panels, takeaways, sources
src/data/cipher.ts        everything the cipher page says: tries, takeaways, sources
src/data/leaves.ts        everything the leaves page says: panels, takeaways, sources
src/data/bees.ts          everything the bee page says: looks, takeaways, sources
src/data/thermostat.ts    everything the thermostat page says: strips, takeaways, sources
src/data/growth.ts        everything the growth page says: pages, takeaways, sources
src/data/leap.ts          everything the leap year page says: pages, takeaways, sources
src/data/rings.ts         everything the tree ring page says: cuts, takeaways, sources
src/data/loud.ts          everything the loudness page says: meters, takeaways, sources
src/data/moon.ts          everything the Moon page says: stations, takeaways, sources
src/data/search.ts        everything the search engine page says: drawers, takeaways, sources
src/data/nim.ts           everything the Nim page says: tries, takeaways, sources
src/data/quake.ts         everything the earthquake page says: strips, takeaways, sources
src/data/shrink.ts        everything the file compression page says: packs, takeaways, sources
src/data/eye.ts           everything the eye page says: tests, takeaways, sources
src/data/tongues.ts       everything the languages page says: cards, takeaways, sources
src/data/scale.ts          everything the solar system page says: stops, takeaways, sources
src/data/scope.ts          everything the sound page says: screens, takeaways, sources
src/data/aqueduct.ts       everything the aqueduct page says: hills, takeaways, sources
src/data/zones.ts          everything the time zone page says: maps, takeaways, sources
src/data/loan.ts           everything the loan page says: lines, takeaways, sources
src/data/volcano.ts        everything the volcano page says: vents, takeaways, sources
src/data/cell.ts           everything the battery page says: benches, takeaways, sources
src/data/heart.ts          everything the heart page says: beats, takeaways, sources
src/data/bow.ts            everything the rainbow page says: drops, takeaways, sources
src/data/camera.ts         everything the camera page says: shots, takeaways, sources
src/data/press.ts          everything the printing press page says: benches, takeaways, sources
src/data/ttt.ts            everything the tic-tac-toe page says: slates, takeaways, sources
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
src/components/maps/     the maps page: the globe and map pairs, three panels and the frame
src/components/lock/     the lock page: the pin lock picture, four benches and the frame
src/components/bread/    the bread page: four stops and the frame
src/components/konigsberg/ the Königsberg page: the town map, four panels and the frame
src/components/sky/       the sky page: four windows and the frame
src/components/rhythm/    the rhythm page: four boards and the frame
src/components/cannon/    the cannon page: three panels and the frame
src/components/cipher/    the cipher page: the wheel, four tries and the frame
src/components/leaves/    the leaves page: three panels and the frame
src/components/bees/      the bee page: the comb and map pair, four looks and the frame
src/components/thermostat/ the thermostat page: four strip charts and the frame
src/components/growth/    the growth page: four panels and the frame
src/components/leap/       the leap year page: four almanac pages and the frame
src/components/rings/      the tree ring page: four cuts and the stump frame
src/components/loud/       the loudness page: four meters and the meter frame
src/components/moon/       the Moon page: four stations and the room frame
src/components/search/     the search engine page: four drawers and the card frame
src/components/nim/        the Nim page: four tries, the table frame and the sticks
src/components/quake/      the earthquake page: four strips and the wall frame
src/components/shrink/     the file compression page: four packs and the table frame
src/components/eye/        the eye page: four tests and the room frame
src/components/tongues/    the languages page: four cards and the desk frame
src/components/scale/      the solar system page: four stops and the road frame
src/components/scope/      the sound page: four screens and the scope frame
src/components/aqueduct/   the aqueduct page: four hills and the channel frame
src/components/zones/      the time zone page: four maps and the world frame
src/components/loan/       the loan page: five lines and the ledger frame
src/components/volcano/    the volcano page: four vents and the cone frame
src/components/cell/       the battery page: four benches and the bench frame
src/components/heart/      the heart page: four beats and the pump frame
src/components/bow/        the rainbow page: four drops and the shower frame
src/components/camera/     the camera page: four shots and the darkroom frame
src/components/press/      the printing press page: four benches and the workshop frame
src/components/ttt/        the tic-tac-toe page: four slates and the slate frame
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
src/styles/maps.css      the maps page: atlas paper, panels, globe and map pairs
src/styles/lock.css      the lock page: dark workshop, benches, lock pictures
src/styles/bread.css     the bread page: flour white, stops with a time of day, pictures
src/styles/konigsberg.css the Königsberg page: old map paper, the town, bridges and lands
src/styles/sky.css        the sky page: dusk blue room, arches, bars
src/styles/rhythm.css     the rhythm page: dark drum machine, pads, rings
src/styles/cannon.css     the cannon page: deep space blue, planet and ball pictures
src/styles/cipher.css     the cipher page: dark writing desk, wheel and bar charts
src/styles/leaves.css     the leaves page: dark autumn room, leaf and paper strip
src/styles/bees.css       the bee page: dark honey room, comb and garden map
src/styles/thermostat.css the thermostat page: dark blue room, strip charts
src/styles/growth.css     the growth page: dark green ledger room, ruled charts
src/styles/leap.css        the leap year page: dark violet room, drift charts, month pages
src/styles/rings.css       the tree ring page: dark brown bench, stumps, charts
src/styles/loud.css        the loudness page: dark red bench, meter zones
src/styles/moon.css        the Moon page: dark room, top views, Moon face, strips
src/styles/search.css      the search engine page: dark green desk, the web, bars
src/styles/nim.css         the Nim page: dark table, matchsticks, binary table
src/styles/quake.css       the earthquake page: dark wall, seismograms, map, Earth cut
src/styles/shrink.css      the file compression page: dark table, dots, chips, bars
src/styles/eye.css         the eye page: dark room, cross and dot, eye, colour patch
src/styles/tongues.css     the languages page: light paper desk, bars, tree, quiz
src/styles/scale.css       the solar system page: dark road, strip, tables
src/styles/scope.css       the sound page: dark bench, scope screen, bars
src/styles/aqueduct.css    the aqueduct page: dark hillside, side views, quiz
src/styles/zones.css       the time zone page: dark navy room, world map, bars
src/styles/loan.css        the loan page: dark ledger, stacked charts, bars
src/styles/volcano.css     the volcano page: dark ash room, cone, bubbles, plate sections
src/styles/cell.css        the battery page: dark bench, discs, two beakers, cells
src/styles/heart.css       the heart page: dark room, flat heart, valves, big numbers
src/styles/bow.css         the rainbow page: dark rain room, drop, curve, sky
src/styles/camera.css      the camera page: dark room, pinhole, blur, toy scene, pixels
src/styles/press.css       the printing press page: dark workshop, type, frame, bars
src/styles/ttt.css         the tic-tac-toe page: dark green slate, chalk board, bars
src/styles/water.css     the water page: the river ribbon, stops, bars, air box, mountain
src/previews/            one SVG drawing per topic, shown on its cover
src/lib/                 small helpers (cover text color, loading the drawings)
src/lib/siteText.ts      the words around the topics (header, footer, headings) in English and Dutch
src/lib/text.ts          fill {slots} in a line, and pick singular or plural
src/lib/chess/           chess pieces, still diagrams, and the build-time analysis of games
src/lib/dutch/           drawing helpers, background strips, map and painting for the Dutch page
src/lib/rand.ts          repeatable random numbers.  src/lib/svgpath.ts: smooth curves for drawings
src/lib/calendar.ts        calendar maths for the leap year page
src/lib/rings.ts           seeded climate, ring widths and best-fit search for the tree ring page
src/lib/decibel.ts         decibel maths and exposure rules for the loudness page
src/lib/moon.ts            Moon phase, rise time and eclipse maths and drawings for the Moon page
src/lib/search.ts          the web of eight pages, index, crawl, scores and PageRank
src/lib/nim.ts             nim-sum and winning moves for the Nim page
src/lib/quake.ts           wave maths and drawings for the earthquake page
src/lib/shrink.ts          runs, repeats, Huffman codes and bit counts for the compression page
src/lib/eye.ts             blind spot, pupil, afterimage and letter size maths for the eye page
src/lib/tongues.ts         word cards, similarity, family tree and sound shifts for the languages page
src/lib/scale.ts           planets, scale model and trip time maths for the solar system page
src/lib/wave.ts            wave sums, note names and scope drawings for the sound page
src/lib/aqueduct.ts        fall, pressure and crossing maths and drawings for the aqueduct page
src/lib/zones.ts           cities, clock sums and the world map for the time zone page
src/lib/loan.ts            payment and schedule maths for the loan page
src/lib/volcano.ts         magma, pressure, bubble and VEI maths for the volcano page
src/lib/battery.ts         pile, cell, layout and run time maths for the battery page
src/lib/heart.ts           route, sums and drawings for the heart page
src/lib/rainbow.ts         refraction maths and drawings for the rainbow page
src/lib/camera.ts          pinhole, f-number, exposure and pixel maths for the camera page
src/lib/press.ts           steps, type, time sums and drawings for the printing press page
src/lib/ttt.ts            tic-tac-toe rules, minimax values and counts
src/lib/tttview.ts        the board as HTML for the tic-tac-toe page
src/lib/thermostat.ts    room and thermostat model for the thermostat page
src/lib/growth.ts        growth sums and charts for the growth page
src/lib/bees.ts          dance maths for the bee page
src/lib/cipher.ts        cipher maths for the cipher page
src/lib/leaves.ts        leaf colour models for the leaves page
src/lib/orbit.ts         orbit maths for the cannon page: shots, speeds, lap times
src/lib/sky.ts           sky colour models for the sky page
src/lib/rhythm.ts        rhythm maths for the rhythm page
src/lib/konigsberg.ts    graph maths for the Königsberg page: bridges, counts, the rule, a walk
src/lib/bread.ts         bread models and pictures for the bread page
src/lib/lock.ts          lock maths for the lock page: pins, keys, the wooden lock, key counts
src/lib/projections.ts   map maths for the maps page: projections, circles, routes, the globe.  src/lib/maplayers.ts: what each panel draws
src/lib/light.ts         light travel maths for the light page
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
src/scripts/maps/        the chosen projection (state.ts), drawing (draw.ts) and one script per panel
src/scripts/lock/        redrawing the pin lock (pins.ts) and one script per bench
src/scripts/bread/       one script per stop: knead, rise, spring and crust
src/scripts/konigsberg/  pressable map shapes, the shared town (build.ts) and one script per panel
src/scripts/sky/         one script per window: waves, sun, violet and cloud
src/scripts/rhythm/      the looping clock (clock.ts) and one script per board
src/scripts/cannon/       one script per panel: fire, second and heights
src/scripts/cipher/       one script per try: wheel, break, keys and keyword
src/scripts/leaves/       one script per panel: mix, paper and season
src/scripts/bees/        redrawing a pair (draw.ts) and one script per look
src/scripts/thermostat/   redrawing a strip (strip.ts) and the four strips (thermostat.ts)
src/scripts/growth/       all four growth panels (growth.ts)
src/scripts/leap/         all four leap year pages (leap.ts)
src/scripts/rings/        all four tree ring cuts (rings.ts)
src/scripts/loud/         all four loudness meters (loud.ts)
src/scripts/moon/         all four Moon stations (moon.ts)
src/scripts/search/       all four search engine drawers (search.ts)
src/scripts/nim/          all four Nim tries (nim.ts)
src/scripts/quake/        all four earthquake strips (quake.ts)
src/scripts/shrink/       all four compression packs (shrink.ts)
src/scripts/eye/          all four eye tests (eye.ts)
src/scripts/tongues/      all four language cards (tongues.ts)
src/scripts/scale/        all four solar system stops (scale.ts)
src/scripts/scope/        all four sound screens (scope.ts)
src/scripts/aqueduct/     all four aqueduct hills (aqueduct.ts)
src/scripts/zones/        all four time zone maps (zones.ts)
src/scripts/loan/         all five loan lines (loan.ts)
src/scripts/volcano/      all four volcano vents (volcano.ts)
src/scripts/cell/         all four battery benches (cell.ts)
src/scripts/heart/        all four heart beats (heart.ts)
src/scripts/bow/          all four rainbow drops (bow.ts)
src/scripts/camera/       all four camera shots (camera.ts)
src/scripts/press/        all four printing press benches (press.ts)
src/scripts/ttt/         all four tic-tac-toe slates (ttt.ts)
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
