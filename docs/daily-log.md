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
