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

## 2026-10-10
- how-maps-flatten-the-earth (Places, lavender): a globe next to its flat copy in each of three panels, with six projections to pick from (Mercator, plate carrée, cylindrical equal-area, sinusoidal, Mollweide, Equal Earth). The panels stamp the same circle at 30 places, slide a patch as big as Greenland next to one as big as Africa, and compare the shortest route with the constant bearing route between ten cities. No coastlines, only a grid and shapes made for the page. The Mercator factor and the key distances were checked by computing them. 12 sources.
- how-a-lock-works (Technology, steel): a workshop with four benches, from a wooden peg lock (three keys) to a pin lock with a shear line (four keys, then a key you cut yourself), and a count of possible keys with a limit on neighbouring cuts (checked against counting every key one by one: 79,666 of 100,000 for 5 pins, 10 depths and a limit of 7). The locks are toy models. The page says nothing about defeating a lock. 10 sources.
- how-bread-rises (Nature, flour cream): one loaf through a day in four stops with a time of day on each (kneading and the gluten net, the rise against temperature, oven spring from the gas law, crust and crumb). Every curve is a toy model with typical numbers and the page says so. The sources for baking are mostly baking guides, and they disagree on when browning starts, so those numbers are marked rough. 11 sources.
- skipped: nothing. All three topics passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing. The repair list from the last error check was empty.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. The Yale dates differ between sources (1848, 1861, 1865), so the page only says the 1860s. A rhumb line that crosses the date line used longitudes beyond 180 at first and drew outside the map. It now wraps and the lines leave one edge and come back on the other.
- ideas for later: the Silk Road, photosynthesis, a volcano, compound growth (a toy, no advice), how a map is made from satellite photos.

## Error check 2026-10-10
- checked: five topics were published since the last check (how-computers-count and how-fast-is-light on 2026-10-09 after the 04:48 run, and how-maps-flatten-the-earth, how-a-lock-works and how-bread-rises last night). `npm run check` (0 errors), `npm run build` (21 pages), preview on 4322. `check-topic.mjs` with screenshots for all five: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all five: no cut-off text, no overlaps, no empty areas. Home page and the older topics the-water-cycle, how-chance-works, gambits-in-chess: 0 FAIL. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): ASCII capital A is 65 and a small a is 97, three bytes make 16,777,216 colours, light takes 1.28 seconds to the Moon and about 8 minutes 19 seconds from the Sun, the nearest star is 4.24 light-years away, Africa is about 14 times Greenland (30.4 against 2.17 million km2), Mercator dates from 1569, the oldest pin-like locks are about 4,000 years old (Khorsabad), Linus Yale Jr. patented his pin lock in the 1860s, yeast works best at about 25 to 32 degrees. All agree with the pages.
- found: nothing wrong. Nothing changed in the pages.
- repair list: empty.

## 2026-10-11
- the-seven-bridges-of-konigsberg (Maths, cyan): one drawn river town with four lands and places for eleven bridges, four panels (walk the old seven yourself, count the bridges at each land, build and remove bridges to see when a walk exists, find a walk from a start you choose). The rule (0 or 2 odd lands) and the walk finder (Hierholzer) were checked by computing. The page does not say which bridges Kaliningrad has today, because sources disagree. 9 sources.
- why-the-sky-is-blue (Nature, sky blue): four windows (short waves scatter more, the sun sliding down the sky, why not violet, white clouds). The ratios 5.9 and 9.4 against red are computed from one over the wavelength to the fourth power. The sky colours, band shares and cloud colours are toy models, and the page says so. The violet window only counts brightness and says it does not mix colours, because a first version that added the eye curve made green dominate, which would have been misleading. 9 sources.
- how-rhythm-works (Music, sea teal): a drum machine with four boards (a steady beat, a 16 step grid, hits spread evenly with the names that sources agree on, two beats at once). Nothing plays by itself, one board plays at a time, and the lit step is an outline and not a flash. The 5 in 8 name differs between sources, so both are given. 9 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing. The repair list from the last error check was empty.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. One push of the Königsberg page was made after a failed local build that only failed because unpublished pages were in the working tree without a registry entry. The pushed commit was then built in a clean copy of the repository and it passed. From now on the build is checked in a clean copy before any push.
- ideas for later: the Silk Road, photosynthesis, a volcano, compound growth (a toy, no advice), how a map is made from satellite photos, how a thermostat works, how vaccines train the body (careful, with a clear not medical advice note), why the Moon has phases.

## Error check 2026-10-11
- checked: three topics were published last night (the-seven-bridges-of-konigsberg, why-the-sky-is-blue, how-rhythm-works). `npm run check` (0 errors), `npm run build` (24 pages), preview on 4322. `check-topic.mjs` with screenshots for all three: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. Home page and the older topics how-computers-count, how-a-lock-works, pyramids-in-peru: 0 FAIL. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): Koenigsberg had four lands with 3, 3, 5 and 3 bridges and Euler solved it in 1736, a walk over every bridge needs 0 or 2 odd lands, (700/450) to the power 4 is 5.9 and (700/400) to the power 4 is 9.4 as the sky page says, Rayleigh scattering goes with one over the wavelength to the fourth power, Toussaint's paper on Euclidean rhythms is from 2005, and the 3 in 8 pattern is the Cuban tresillo. All agree with the pages.
- found: nothing wrong. Nothing changed in the pages.
- repair list: empty.

## 2026-10-12
- newtons-cannonball (Space, periwinkle): a cannon on a mountain over a round planet with no air, three panels (fire the cannon over Earth, the Moon, Mars or Jupiter with a stepped path and the speeds for an orbit and for escape, one second of fall against the curve of the ground, orbit speed and lap time at four heights). The shots are worked out by stepping the motion and the class of each shot comes from the energy. A first version of the ball animation threw an error because the browser timestamp can come before the start time, which was fixed. 8 sources.
- secret-writing (Language, hot pink): a cipher wheel and four tries (turn the wheel to hide and read a message, break a shift by counting letters against English, count the keys of a shift and of a full substitution with a made up speed, hide the counts with a keyword). Toy ciphers, and the page says so. The date of Babbage's break differs between sources, so the page only says the 1800s. 9 sources.
- why-leaves-change-colour (Nature, rust): three panels (mix the three colours of a leaf, pull them apart on paper, follow them through the weeks of autumn with sun and frost). All toy models of rules of thumb, and the page says so. The heights of the bands on paper differ between sources, so only their order is given as firm. 8 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing. The repair list from the last error check was empty.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. Each topic was published on its own, and the pushed commit was built in a clean copy of the repository before the push.
- ideas for later: the Silk Road, photosynthesis, a volcano, compound growth (a toy, no advice), how a thermostat works, why the Moon has phases, how vaccines train the body (careful, with a clear not medical advice note), how a search engine finds a page.

## Error check 2026-10-12
- checked: three topics were published last night (newtons-cannonball, secret-writing, why-leaves-change-colour). `npm run check` (0 errors), `npm run build` (27 pages), preview on 4322 (a stale preview record blocked the first start, so the first run of the checks failed to connect; after a clean restart all checks ran). `check-topic.mjs` with screenshots for all three: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. Home page and the older topics the-dutch-golden-age, how-rhythm-works, the-water-cycle: 0 FAIL. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): orbit speed just above Earth about 7.9 km/s and escape about 11.2 km/s, the Moon escape about 2.4 km/s, the space station at about 420 km, 7.66 km/s and 93 minutes, a geostationary orbit at 35,786 km, the Caesar cipher after Julius Caesar, letter counting by al-Kindi in the 9th century, E at about 12.7 per cent of English letters. The Jupiter escape speed of 60.2 km/s uses the mean radius (the usual quote of 59.5 uses the equatorial one), which is fine for a toy table. All agree with the pages.
- found: nothing wrong. Nothing changed in the pages.
- repair list: empty.

## 2026-10-13
- the-bee-dance (Nature, honey yellow): four looks into a hive, each with a comb next to a map from above (read a dance, send a bee, the sun moving through the day, many runs against noise). The distance scale of one kilometre a second and the toy sun (15 degrees an hour, south at noon) are rules of thumb, and the page says so. The typical error of an average of runs comes from a seeded simulation, so one lucky sample does not mislead. 7 sources.
- how-a-thermostat-works (Technology, steel blue): four strip charts of a room over a day (the loop, the gap or hysteresis, the walls, a slow heater). A toy room with a heater of 3 degrees an hour, and the page says so. Heating advice is not given. 9 sources.
- how-growth-compounds (Maths, sea green): four ledger pages with made up coins (simple against compound, the rule of 72 against the exact doubling time, prices rising, adding growth more often). The sums were checked against the worked example of the St. Louis Fed (5,000 at 8 per cent over 36 years is about 79,840). The page says clearly that it is maths and not money advice. The first run of the checks failed because a slider had the wrong data name, which was fixed before publishing. 9 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing. The repair list from the last error check was empty.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. Sources disagree on the exact range of rates where the rule of 72 works best, so the page only says it is close in the middle. Each topic's commit was built in a clean copy of the repository before the push.
- ideas for later: the Silk Road, photosynthesis, a volcano, why the Moon has phases, how vaccines train the body (careful, with a clear not medical advice note), how a search engine finds a page, how a battery works, how a tree grows rings.

## Error check 2026-10-13
- checked: three topics were published last night (the-bee-dance, how-a-thermostat-works, how-growth-compounds). `npm run check` (0 errors), `npm run build` (30 pages), preview on 4322. `check-topic.mjs` with screenshots for all three: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. The growth page carries the clear "not advice about money" note in its intro and in `sourcesNote`. Home page and the older topics radiation-therapy, newtons-cannonball, how-bread-rises: 0 FAIL. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): 100 coins at 8 per cent over 30 years give about 1,006 compound and 340 simple, the rule of 72 at 9 per cent gives 8 years against an exact 8.04, 100 coins at 10 per cent over 10 years give 259.37 once a year and 271.83 with continuous growth, Karl von Frisch decoded the waggle dance, one second of waggle is about one kilometre as a rule of thumb. All agree with the pages.
- found: nothing wrong. Nothing changed in the pages.
- repair list: empty.

## 2026-10-14
- why-we-have-leap-years (Maths, violet): four almanac pages (a calendar with no leap days, the Julian rule, the Gregorian rule with a year checker, the skipped days of 1582 and 1752 as month pages). The seasons drift is average year length times years, a plain sum. 8 sources.
- how-tree-rings-work (Nature, brown): a stump cut four ways (grow a stump, count the rings, match a beam against a long record, chain samples back in time). The climate and the beams are a toy model with seeded random weather, and the page says so. 8 sources.
- how-loud-is-loud (Body, red): four meters (the decibel ruler, two sounds added, distance, how long a level can be heard under the NIOSH and OSHA rules). Not medical advice, stated on the page. 10 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. The leap page gives no date for the Netherlands because the sources disagreed. The skip calendar draws the missing days as one gap row so the weekdays stay true. Sources give ranges for the pain threshold (120 to 140 dB) and for a rock concert, so the loudness page shows ranges. The oldest tree age differs between sources, so the tree page says about 4,765 years for one tree and about 8,500 years for a record.
- ideas for later: the Silk Road, photosynthesis, a volcano, why the Moon has phases, how vaccines train the body (careful), how a search engine finds a page, how a battery works.

## Error check 2026-10-14
- checked: three topics were published last night (why-we-have-leap-years, how-tree-rings-work, how-loud-is-loud). `npm run check` (0 errors), `npm run build` (33 pages), preview on 4322. `check-topic.mjs` with screenshots for all three: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. The loudness page states "not medical advice" in its intro, its takeaways and its `sourcesNote`. Home page and the older topics pyramids-in-peru, secret-writing, how-maps-flatten-the-earth: 0 FAIL. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): tropical year 365.2422 days and Gregorian average 365.2425, 4 October 1582 followed by 15 October, Britain skipping 2 to 14 September 1752 (11 days), a whisper near 30 dB and 20 micropascals as the 0 dB reference, 6 dB per doubling of distance, NIOSH 85 dBA for 8 hours with a 3 dB exchange rate (100 dBA for 15 minutes), OSHA 90 dBA with 5 dB. All agree with the pages.
- found: one claim that could not be confirmed. The tree rings page gave the age of the bristlecone pine Methuselah as 4,765 years, but published ages run from about 4,765 to 4,850 depending on the year of the count.
- fixed: `src/data/rings.ts` now says "about 4,800 years" in the text and explains the range in `sourcesNote`. `check`, `build` and `check-topic.mjs` on the page pass after the change.
- repair list: empty.

## 2026-10-15
- why-the-moon-has-phases (Space, slate): a dark room with four stations (move the Moon round the Earth, when each phase rises in a toy sky, why a month of phases is 29.5 days against 27.3 for one lap, why the 5 degree tilt makes eclipses rare). The eclipse limits and the made up year of 13 moons are marked as a toy on the page. 8 sources.
- how-a-search-engine-works (Technology, orange): four drawers on a made up web of eight garden club pages (a crawl, index cards, order by words with tf idf, order by links with PageRank). Everything is a toy model and the page says so. 8 sources.
- the-game-of-nim (Games, teal): a table of matchsticks and four tries (play a machine, add heaps in binary, find the winning move, the version where the last stick loses). The strategy was checked by computer against every position of up to four heaps of at most five sticks, in both versions. 8 sources.
- also: the tree rings page played sounds but had no sound switch, so one was added (the same button as the bits page).
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. Sources give different years for the Nimatron, so the Nim page leaves the year out. Google's own documentation could not be read for the search engine page, so it uses mostly explainers and says so.
- ideas for later: the Silk Road, photosynthesis, a volcano, how vaccines train the body (careful), how a battery works, how a map of the London Underground is drawn, why bridges need expansion joints, how a zip file shrinks text.

## Error check 2026-10-15
- checked: three topics were published last night (why-the-moon-has-phases, how-a-search-engine-works, the-game-of-nim), plus a sound switch added to how-tree-rings-work. `npm run check` (0 errors), `npm run build` (36 pages), preview on 4322. `check-topic.mjs` with screenshots for all three new pages: 0 FAIL, only the known faded "Learn" in the logo as WARN. Looked at the 1366 contact sheets of all three: no cut-off text, no overlaps, no empty areas. Home page and the older topics how-tree-rings-work, the-dutch-golden-age, how-fast-is-light: 0 FAIL. Dash scan prints nothing.
- facts re-checked (from my own knowledge, as the source sites are blocked from here): the lunar month of 29.53 days against 27.32 days for one lap round the Earth, the 5 degree tilt of the Moon's orbit, the Moon rising about 50 minutes later each day, the nim-sum of 1, 3, 5 and 7 being 0, Bouton's theory of 1901, the PageRank damping factor of 0.85, the Nimatron shown at the 1939 to 1940 World's Fair. All agree with the pages.
- found: nothing wrong. Nothing changed in the pages.
- repair list: empty.

## 2026-10-16
- how-earthquakes-are-found (Nature, terracotta): a wall of seismograph strips and a map table with four strips (the gap between the P and S wave, three circles that meet at the epicentre, the magnitude scale, the waves that cannot cross the liquid core). The wave speeds, maps and stations are a toy that gives exactly 8 km for every second of gap. 8 sources.
- how-files-shrink (Technology, orchid): a packing table with four toy versions of what a zip file does (runs, repeats as pointers, Huffman short codes with the table counted, and what cannot shrink). All sizes are counted by the page's own functions. 8 sources.
- how-the-eye-sees (Body, violet): four tests for the reader's own eyes (blind spot, pupil, afterimage, the side of vision). Not an eye test and not medical advice, stated on the page. The pupil toy and the letter size rule are marked as toys. 8 sources.
- skipped: nothing. All three passed `check`, `build` and `check-topic.mjs` (0 FAIL), the older pages and the home page still pass, and the dash scan prints nothing.
- notes: the source sites were blocked again, so only search summaries could be read, and each `sourcesNote` says so. The blind spot angle of about 15 degrees was not in the search results and comes from general knowledge, which the note says. The lens and ciliary muscle were left out because no source for them was found.
- ideas for later: the Silk Road, photosynthesis, a volcano, how vaccines train the body (careful), how a battery works, how a map of the London Underground is drawn, how a rainbow forms, why bridges need expansion joints, how GPS finds a place.
