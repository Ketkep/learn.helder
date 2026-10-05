# Working on Helder Labs Learn

learn.helderlabs.com is a hub of interactive explainers by the studio Helder Labs. It is a portfolio piece, so it must look and read like a person made it with care. The owner is a Dutch beginner who does not write code ("you write the code, I test"). Reply to the owner in Dutch, in plain short steps, and explain what you did and what they can check. The site itself is in English (British spelling), apart from the Dutch version of the radiation page.

`README.md` explains how everything is built. Read it first, then read the newest topic as a model. This file holds the rules and the daily routine.

## Hard rules (never break these)

- **No em dashes and no en dashes**, anywhere: page text, code comments, README, alt text, meta tags, commit messages, chat replies. Use a full stop, a comma or a colon.
- **No AI buzzwords**: unlock, dive into, elevate, seamless, journey, empower, harness, delve, game-changer, "in today's world", "whether you're X or Y". No taglines in threes. No emojis.
- Short plain sentences. Sentence case headings. Say what a thing is, not how exciting it is.
- No gradient blobs, no glassmorphism, no purple-to-blue gradients, no glowing buttons. Drawings are custom SVG, never an icon set.
- Each topic is its own kind of interactive film. Do not reuse the layout of another topic with new words. Taken so far: chess gambits (a scrolling film with a pinned screen), Peru pyramids (one hole you dig down through, with a year gauge), the Dutch Golden Age (a sideways tracking shot along a film strip), radiation therapy (a round lens that zooms through the scales). Invent a new structure each time, for example a night sky you drift through, a cutaway building you walk up, a river from source to sea, a clock face, a workshop with one bench per idea, a map you fly over. Each topic has 3 to 6 things to try, and each one teaches one idea.
- Every number on a page is either checked against a source or marked on the page as made up. A toy model is called a toy model on the page. Nothing on a page is medical, legal or money advice.
- No backend, no cookies, no tracking, no outside requests (fonts and scripts are served from this site). Static output.

## How a page must behave

- **Stack first.** The plain version, a normal page you scroll and read, works with no script, with reduced motion and on a short screen. The film mode is added on top (`.film` class, see the radiation and Dutch pages). Tools that need script carry `.needs-js` so they are hidden without it. `html.js` is set by `BaseLayout`.
- Works from 320px wide up, with no sideways scroll. Heading order is h1, then h2, then h3, with no skipped levels. Everything works with the keyboard and shows a focus ring. Text contrast is at least 4.5 to 1 (3 to 1 for large text). `prefers-reduced-motion` means nothing plays by itself.
- **Old phones.** Do not use `color-mix()` (use `mix()` in `src/lib/color.ts`), container queries, `:has()` or the `inset` shorthand. Put a `vh` fallback before every `svh`, and never put `svh` in a custom property. Do not use `replaceChildren` or `mq.addEventListener` (use `clear()` and `onMedia()` from `src/scripts/util.ts`). The build targets Safari 13 and newer.
- Shared helpers: `src/scripts/sound.ts` and `soundButton.ts` (sound made in the browser, on by default, with a switch), `src/scripts/util.ts`, `src/lib/rand.ts` (seeded random), `src/lib/svgpath.ts`, `src/lib/color.ts`.
- Fast: no big images, drawings are SVG, scripts are small. SEO basics come from `TopicLayout` (title, description, canonical). Every page gets a `sources` list at the bottom and a `sourcesNote` that says how it was checked.
- Code reads like the code around it: short comments that say why, the same naming, the same density.

## Facts and sources

- Research with WebSearch and WebFetch. Use at least six independent sources per topic, preferably universities, museums, agencies and encyclopaedias. Check each key number in two places. Write in your own words. Never copy text or images.
- Some sites are blocked from this environment (for example kanker.nl). If you could only read a search summary, say so honestly in `sourcesNote`.
- Stay away from: medical advice, dosing, diagnosis, weapons, hate, party politics, real private people, gambling tips, anything a toy model could be mistaken for guidance on. Health topics get the same care as the radiation page: explain the idea, correct common myths, add "not medical advice".

## Checks before anything is published

Run all of these. Fix problems, never skip a check.

1. `npm run check` has 0 errors.
2. `npm run build` works. Then `npm run preview -- --port 4322` (in the background).
3. `node tools/check-topic.mjs /<slug>/ --out <scratchpad folder>` has 0 FAIL. It checks 8 screen widths, errors, outside requests, headings, labels, dashes, buzzwords, emojis, reduced motion, no script, keyboard and contrast, and it writes screenshots and contact sheets. Read every WARN and decide.
4. Look at the pictures with your own eyes: open `sheet-1366.png`, `sheet-390.png` and several single screenshots with the Read tool. Look for cut-off text, overlapping cards, empty areas, unreadable colours, a tool that does nothing.
5. Drive every tool with Playwright (click, drag, type, keyboard), also with reduced motion on, and read the texts that come out. Chromium is at `/opt/pw-browsers/chromium`. Playwright loads through `createRequire` (see `tools/check-topic.mjs`).
6. Run `node tools/check-topic.mjs / --no-shots --min-chars 300` for the home page and `node tools/check-topic.mjs /<old-slug>/ --no-shots` for every older topic. 0 FAIL, so nothing old broke. (Known harmless WARNs on old pages: the faded "Learn" in the logo, the film edge print and a caption on the Dutch page, focus rings drawn on the cover instead of the link.)
7. `grep -rnP "\xe2\x80[\x93\x94]" src README.md CLAUDE.md docs tools` prints nothing.

## The daily routine: three new topics

Runs every night at 02:38 Netherlands time, in a long-lived session. That session may remember earlier nights, but do not rely on it: read this file again in full at the start of every run. The owner chose: publish straight away, you pick the topics, English only, each topic as big and careful as the existing ones. Nobody is awake, so do not ask questions. Decide, and write the decision down. A second job, the error check, runs at 04:48 (see the end of this file), so aim to be done and pushed before then.

1. **Start.** `git fetch origin claude/busy-wozniak-ca7cbv`, check that branch out and pull. It is the production branch: Vercel publishes every push to it. If `node_modules` is missing, run `npm ci`. Get today's date with `TZ=Europe/Amsterdam date +%F`. Do not undo anything the owner changed. Read the newest "Error check" block in `docs/daily-log.md`. Everything on its repair list is fixed first, before any new topic, and ticked off in the log.
2. **Choose three topics.** Read `src/data/topics.ts` and `docs/daily-log.md` first. The three must differ from each other and from everything already there: different subject, different metaphor, different accent colour (an accent where cream or near-black text is readable, see `readableInk`). Mix the subjects over the days: nature, space, maths, technology, history, language, music, money basics, the body, games, places. Reuse an existing category name where it fits, so the filter does not grow a chip per topic. Pick topics that have something to move, test or guess.
3. **For each topic, one at a time, finish and publish it before starting the next:**
   1. Research (see Facts and sources). Write down what you will say and what you will let the reader try.
   2. Design a new structure and 3 to 6 tools. Plan the stack-first version first.
   3. Build it the way README describes: registry entry in `src/data/topics.ts` with `status: 'live'` and `dateAdded` set to today, the cover drawing in `src/previews/`, the page in `src/pages/<slug>/index.astro`, words in `src/data/<slug>.ts`, components in `src/components/<slug>/`, scripts in `src/scripts/<slug>/`, styles in `src/styles/`. Add a short section about the page to README.md and the new folders to "Where things are".
   4. Run every check above.
   5. Commit with a message that says what the page is and why it is built that way, then push to `claude/busy-wozniak-ca7cbv`. If the push is rejected, fetch, merge, check again and retry. Never force-push. The push puts the topic live within about a minute.
4. **Quality over count.** If a topic does not pass the checks and look good in the time you have, do not publish it. Publish fewer. Never publish unfinished or unverified work, never push a failing build, never switch a check off. If you are stuck after honest attempts, drop that topic, write why in the log, and move to the next one.
5. **Finish.** Add a block to `docs/daily-log.md`: date, the topics with their slugs and metaphors, how many sources each, anything skipped and why, ideas for later. Commit and push. Then give the owner a short report in Dutch: the live links (https://learn.helderlabs.com/<slug>/ and the same path on the Vercel link), what to look at first, and anything you are unsure about.

To take a topic offline, set its `status` to `'draft'` in `src/data/topics.ts` and push. Draft pages are removed from the production build.

## The nightly error check

Runs every night at 04:48 Netherlands time, in its own long-lived session, about two hours after the builder starts. Its job is to find and fix mistakes in what was published, before the owner wakes up. Nobody is awake, so do not ask questions. The same hard rules and checks apply. Read this file in full at the start of every run.

1. **Start** like the builder: fetch, check out `claude/busy-wozniak-ca7cbv`, pull, `npm ci` if needed. Read the newest blocks of `docs/daily-log.md` and run `git log --since="30 hours ago" --stat --oneline` to see which topics went live. If the newest commit is younger than 20 minutes, the builder is probably still working: check what is already published, but only report problems in the log. Do not edit files it may be editing.
2. **Check everything that changed.** `npm run check`, `npm run build`, preview on port 4322. Run `node tools/check-topic.mjs /<slug>/ --out <scratchpad>` (with screenshots) for every topic published since yesterday, and look at the contact sheets with your own eyes. Run it with `--no-shots` for the home page (`--min-chars 300`) and for three older topics, a different three each night (take the day of the year modulo the number of older topics). Run the dash scan from the checks list. A clean local build is the stand-in for a working Vercel deployment, because the live site cannot be reached from here.
3. **Check the facts again.** For each new topic pick three numbers or claims that matter and check them against the sources listed on its page. If one is wrong or cannot be confirmed, correct it or mark it as approximate, and say so in `sourcesNote` if it was a source problem.
4. **Fix what is wrong**, in the smallest way that works: commit, then pull and push to `claude/busy-wozniak-ca7cbv`, never force-push, and run the checks again. If a topic is broken in a way that cannot be fixed quickly and safely, set its `status` to `'draft'` so it goes offline, and put it on the repair list. Do not delete anyone's work.
5. **Log it.** Add an "Error check YYYY-MM-DD" block to `docs/daily-log.md`: what you checked, what you found, what you fixed, and a repair list for anything left (the builder fixes that list first the next night). Commit and push.
6. **Report** to the owner in Dutch, short: all fine, or what was wrong and what you did about it. Say clearly if a topic was taken offline.
