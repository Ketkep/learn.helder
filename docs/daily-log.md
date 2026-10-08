# Daily topics log

One block per night, added by the daily routine (see `CLAUDE.md`). It records what was published, what was skipped and why, and ideas for later, so the next night does not repeat itself.

The error check (04:48) adds its own block each night with a "repair list". The builder (02:38) fixes that list first.

Format of a builder block:

```
## YYYY-MM-DD
- slug: one line on the subject and the structure (the metaphor), number of sources
- skipped: topic and the reason
- ideas for later: ...
```

## Before the routine started

Built by hand: gambits-in-chess, pyramids-in-peru, the-dutch-golden-age, radiation-therapy (also in Dutch at /nl/radiotherapie/).

Ideas that fit the same style, not yet built: how a lock works (pins to lift), tides and the moon (a shoreline you move through the month), how a bridge carries load (push on a span), the water cycle (a drop you follow), how sound turns into a note (strings you pluck), the Silk Road (a map you travel with a caravan), photosynthesis, how a volcano erupts, prime numbers, the speed of light across the solar system.

## 2026-10-06
- tides-and-the-moon (Nature, purple): a harbour wall with a tide staff. Four benches (two bulges around the Earth, a tide clock where highs slide 50 minutes a day, spring and neap tides, a toy tank that shows resonance). The staff shows the water level of the bench on screen. 12 sources.
- prime-numbers (Maths, magenta): a cabinet of five drawers that open like disclosure buttons (sieve, dots in rectangles, Euclid's trick, a window that thins out up to a million, easy to multiply and hard to split). 10 sources.
- strings-and-notes (Music, walnut): a row of five strings stretched across the page (bridge you drag, slow motion, tension and thickness, ratios and the sum of two vibrations, a mix of harmonics). Sound is made in the browser with a new `pluck()` in `sound.ts`. 8 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing.
- notes: the source sites (NOAA, Wikipedia, Britannica, NASA and others) were blocked from this environment, so only search summaries could be read. Each key number appeared in at least two search results, and every `sourcesNote` says so. The tides tank uses the exact formula for a basin that is open at one end, with made-up friction. The strings page uses a made-up starting note of 110 Hz.
- ideas for later: how a lock works (pins to lift), the water cycle (a drop you follow), how a bridge carries load, the Silk Road (a map you travel), photosynthesis, a volcano, the speed of light across the solar system, how a clock keeps time (a clock face), how bread rises, Morse code and binary (language), a river from source to sea.

## Error check 2026-10-06
- checked: `npm run check` (0 errors), `npm run build`, preview on 4322. `check-topic.mjs` with screenshots for tides-and-the-moon, prime-numbers and strings-and-notes: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. Home page (0 FAIL) and older topics radiation-therapy, gambits-in-chess, pyramids-in-peru (0 FAIL). Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): primes below 10^2 to 10^6 (25, 168, 1,229, 9,592, 78,498), the largest known prime 2^136,279,841 minus 1 with 41,024,320 digits, the lunar day of 24 h 50 min, the Sun's tide at about 46 per cent of the Moon's, the Bay of Fundy 16.3 m, the A 440 Hz standard (ISO 16, 1955 and 1975). All agree with the pages.
- found: nothing wrong. Not changed: the old Peru page shows a "Cover it again" button at 2.84 contrast in one state, a WARN that already existed. Worth a look by eye.
- repair list: empty.

## 2026-10-07
- why-we-have-seasons (Space, olive green): a wall of four instruments under a night sky (the Earth on its orbit and the distance that is not the cause, day length through the year for any tilt, a 24 hour daylight clock, the noon shadow of a stick). The Sun maths matches the Amsterdam day lengths to the minute and the Tromso midnight sun to a few days. 9 sources.
- morse-code (Language, navy): a strip of paper tape from a telegraph with four messages (a key you hold, a tree you walk, short codes for common letters with a shuffle test, a player with real timing and a word to copy by ear or lamp). Sound is made with two new helpers in `sound.ts` (`hold`, `beeps`). 9 sources.
- how-bridges-carry-load (Technology, light steel blue): a river crossing with four spans and blueprints (a plank that bends, arch and cable as the same curve upside down, a frame that folds without a diagonal, a two-rafter truss). Orange is pushing and light blue is pulling. The numbers are relative. 10 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing. The repair list from the last error check was empty.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. The English letter frequencies for Morse are from a standard table (the largest five were checked in two places). On the bridges page no bridge is called the longest, because a newer one may have passed the two that are quoted. The Morse lamp and the timeline do not flash with reduced motion.
- ideas for later: how a lock works (pins to lift), the water cycle (a drop you follow), the Silk Road (a map you travel), photosynthesis, a volcano, the speed of light across the solar system, how a clock keeps time (a clock face), how bread rises, binary and how a computer counts, a river from source to sea.

## Error check 2026-10-07
- checked: `npm run check` (0 errors), `npm run build` (13 pages), preview on 4322. `check-topic.mjs` with screenshots for why-we-have-seasons, morse-code and how-bridges-carry-load: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. Home page and the older topics gambits-in-chess, pyramids-in-peru, the-dutch-golden-age: 0 FAIL, only the known WARNs. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): Earth at about 147.1 million km in early January and 152.1 million km in early July, tilt of about 23.4 degrees and the Arctic Circle at about 66.5 degrees, the first telegraph message on 24 May 1844, the word PARIS as 50 units, SOS from the 1906 Berlin convention, the Golden Gate main span of 1,280 m (opened 1937) and the Akashi Kaikyo main span of 1,991 m (1998). All agree with the pages.
- found: nothing wrong. Nothing changed in the pages.
- repair list: empty.

## 2026-10-08
- how-clocks-keep-time (Technology, coral): a clock movement taken apart into four brass plates, picture first (a pendulum with length, weight and swing, an escapement with 30 teeth, a clock face with the 60 to 1 and 12 to 1 gear ratios, a quartz crystal halved 15 times from 32,768 Hz). 10 sources.
- how-chance-works (Maths, sage): a lab notebook on squared paper with four experiments (two dice against the exact odds, coin flips and the law of large numbers with a test of the gambler's fallacy, the shared birthday, the three doors puzzle). The page says it is about the maths and gives no gambling advice. 9 sources.
- the-water-cycle (Nature, bright blue): a river down the side of the page with four stops (where the water is, why air lets go of it, air over a mountain with a rain shadow, a drop's trail through the sea, air, rivers, soil, groundwater and ice). The residence times are rough because the sources disagree, and the chances in the drop game are made up. 10 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing. One check failed on the first run of the water page (the forbidden word for a trip in the title), and it was fixed before publishing. The repair list from the last error check was empty.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. The escapement dates in the search results disagreed, so the clocks page gives none. The Magnus formula for the vapour in air matches the HyperPhysics table to within about half a per cent.
- ideas for later: how a lock works (pins to lift), the Silk Road (a map you travel), photosynthesis, a volcano, the speed of light across the solar system, how bread rises, binary and how a computer counts, compound growth (money basics, with a clear note that it is a toy), how a river shapes the land, how a map is made (projections).
