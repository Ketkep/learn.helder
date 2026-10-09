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

## Error check 2026-10-08
- checked: `npm run check` (0 errors), `npm run build` (16 pages), preview on 4322. `check-topic.mjs` with screenshots for how-clocks-keep-time, how-chance-works and the-water-cycle: 0 FAIL, only the known faded "Learn" in the logo as WARN (none for how-chance-works). Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. Home page and the older topics pyramids-in-peru, the-dutch-golden-age, radiation-therapy: 0 FAIL. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): a pendulum of about 0.994 m beats 2 seconds, 32,768 = 2 to the power 15, the second as 9,192,631,770 caesium-133 periods, 23 people give 50.7 per cent for a shared birthday (253 pairs), switching wins 2 in 3 in the three doors puzzle (Marilyn vos Savant, 1990), 96.5 per cent of Earth's water in the sea and about 2.5 per cent fresh, about 30 g of vapour per cubic metre of air at 30 degrees. All agree with the pages.
- found: nothing wrong. Nothing changed in the pages.
- repair list: empty.

## Error check 2026-10-09
- checked: no new topics today. The newest topic commit is still the water cycle of 2026-10-08, so the builder did not publish anything last night. `npm run check` (0 errors), `npm run build` (16 pages), preview on 4322. `check-topic.mjs --no-shots`: home page, the-dutch-golden-age, tides-and-the-moon and prime-numbers all 0 FAIL. Dash scan prints nothing.
- found: nothing wrong. Nothing changed. Note for the builder: no log block for 2026-10-09 exists.
- repair list: empty.

## 2026-10-09
- how-computers-count (Technology, pink): eight switches fixed at the bottom of the screen set one shared byte, and four panels read it (a number by place values, a letter by ASCII, a counter with carry and wrap, a colour with the byte as red). The letter panel uses plain ASCII, so bytes over 127 say "outside the table". 9 sources.
- how-fast-is-light (Space, signal green): one beam fixed at the top of the screen with a true clock, sent by four panels (a pulse to the Moon mirrors and back, nine places from the Moon to Proxima Centauri, a delayed talk with a rover on Mars, a trip to Proxima Centauri at four speeds). The animation is sped up, the numbers are true, the Mars talk is a toy model that assumes instant answers. 11 sources.
- skipped: the map projections page (research done, not built). The error check at 04:48 had already run when the two pages were finished, so a third page would have gone live unchecked. Both pages passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing. The repair list from the last error check was empty.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. One search result gave 12 minutes for the closest Mars, which is wrong (about 3 minutes), and it was not used. NASA gives 18 November 2026 as the day Voyager 1 is one light-day away. The page for how-chance-works once failed with 404s in a regression run because a build ran while the check was running, and passed on a second run.
- ideas for later: map projections (Mercator scale factor sec(latitude), Africa is about 14 times Greenland, great circles, graticule only, no coastline data), how a lock works, the Silk Road, photosynthesis, a volcano, how bread rises, compound growth (a toy, no advice).
