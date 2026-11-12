# Working on Helder Labs Learn

learn.helderlabs.com is a hub of interactive explainers by the studio Helder Labs. It is a portfolio piece, so it must look and read like a person made it with care. The owner is a Dutch beginner who does not write code ("you write the code, I test"). Reply to the owner in Dutch, in plain short steps, and explain what you did and what they can check. The site itself is in English (British spelling), apart from the Dutch version of the radiation page.

`README.md` explains how everything is built. Read it first, then read the newest topic as a model. This file holds the rules and the daily routine.

The site has two parts. **Learndle** is the daily discovery: the home page (`/`) shows today's edition, older ones are in `/archive/`, each at `/daily/<number>/`. Editions are scheduled in `src/data/editions.ts` and live in `src/editions/<slug>/` (README, "Daily editions"). **The library** at `/library/` is the grid of longer topics, each at `/<slug>/`. The nightly routine below makes one new daily edition each night. The library is finished work: the routine does not add library topics any more, and it only touches them to fix a mistake.

## Hard rules (never break these)

- **No em dashes and no en dashes**, anywhere: page text, code comments, README, alt text, meta tags, commit messages, chat replies. Use a full stop, a comma or a colon.
- **No AI buzzwords**: unlock, dive into, elevate, seamless, journey, empower, harness, delve, game-changer, "in today's world", "whether you're X or Y". No taglines in threes. No emojis.
- Short plain sentences. Sentence case headings. Say what a thing is, not how exciting it is.
- No gradient blobs, no glassmorphism, no purple-to-blue gradients, no glowing buttons. Drawings are custom SVG, never an icon set.
- Each topic is its own kind of interactive film. Do not reuse the layout of another topic with new words. Taken so far: chess gambits (a scrolling film with a pinned screen), Peru pyramids (one hole you dig down through, with a year gauge), the Dutch Golden Age (a sideways tracking shot along a film strip), radiation therapy (a round lens that zooms through the scales). Invent a new structure each time, for example a night sky you drift through, a cutaway building you walk up, a river from source to sea, a clock face, a workshop with one bench per idea, a map you fly over. Each topic has 3 to 6 things to try, and each one teaches one idea. Daily editions share one frame on purpose (the six steps, see README): inside that frame, the experiment, the pictures and the colours are new every time.
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
6. Run `node tools/check-topic.mjs / --no-shots --min-chars 300` for the home page, the same for `/library/` and `/archive/`, and `--no-shots` for the previous edition. If shared files changed (anything in `src/layouts/`, `src/components/` outside an edition, `src/styles/global.css`, `src/scripts/util.ts`, `src/lib/`), also run `node tools/check-topic.mjs /<old-slug>/ --no-shots` for every library topic. If only an edition's own folder and the schedule changed, three library topics are enough. 0 FAIL, so nothing old broke. (Known harmless WARNs: the faded "Learn" in the logo, the film edge print and a caption on the Dutch page, focus rings drawn on the cover instead of the link, few words on the archive.)
7. `grep -rnP "\xe2\x80[\x93\x94]" src README.md CLAUDE.md docs tools` prints nothing.

## The nightly routine: one daily edition

Runs every night at 02:38 Netherlands time, in a long-lived session. That session may remember earlier nights, but do not rely on it: read this file again in full at the start of every run. The owner chose: one edition per night, published straight away (it opens for readers on its own date), you pick the topic, English only. Each edition should be better than the one before: a sharper surprise, a more striking interaction, a picture worth a screenshot. The aim is editions people want to send to a friend. Read "What makes an edition worth sharing" below before choosing. Nobody is awake, so do not ask questions. Decide, and write the decision down. The error check runs at 04:48 (see the end of this file), so aim to be pushed before then. If a scheduled prompt still asks for three library topics, it is from before 12 November 2026: make one edition as described here instead.

1. **Start.** `git fetch origin claude/busy-wozniak-ca7cbv`, check that branch out and pull. It is the production branch: Vercel publishes every push to it. If `node_modules` is missing, run `npm ci`. Get today's date with `TZ=Europe/Amsterdam date +%F`. Do not undo anything the owner changed. Read the newest "Error check" block in `docs/daily-log.md`. Everything on its repair list is fixed first, before the new edition, and ticked off in the log.
2. **Find the slot.** Run `npm run schedule`. The new edition gets the next number and the day after the last edition in `src/data/editions.ts`, but never a date earlier than tomorrow. So it is always built at least a day ahead, and the error check and the owner can look at it with `?preview` before anyone else sees it.
3. **Choose the topic.** Start from `docs/edition-ideas.md`, or find a better one that meets the same bar. Read the last seven editions in `src/data/editions.ts` and `src/data/topics.ts`: the new one has a different subject and a different kind of interaction than the last seven, and it is not a library topic again unless it clearly goes further (then set `basedOn` to it). Mix the subjects over the week: nature, space, maths, technology, history, language, music, money basics, the body, games, places, the mind. Pick an accent colour that differs from the last seven, where cream or near-black text is readable (`readableInk`).
4. **Research** (see Facts and sources). At least six independent sources, every key number checked in two places. Write down the misconception and the facts that undo it.
5. **Plan before you build**, and write the plan into tonight's log block: the one question, the misconception, the moment the reader's guess turns around, the experiment (what the reader changes, what visibly changes, and why that change is the cause), the three new situations (each needs the idea, not memory of a number), and what the share text will say.
6. **Build** it the way README describes ("Add an edition"): the entry in `src/data/editions.ts` (`'draft'` while you work), and the folder `src/editions/<slug>/` with `Edition.astro`, `model.ts`, `draw.ts`, `sim.ts`, `edition.css` and `cover.svg`. Use `src/editions/closer-and-colder/` as the model for structure and care, not for its look. Every simplification in the model is named on the page and in `sourcesNote`.
7. **Review it like a stranger.** Walk through every step with Playwright at 1366 and 390 wide: every answer, every goal, the done step, the share text, a reload in the middle. Then score it 1 to 5 on the list in "What makes an edition worth sharing". Anything under 4 gets fixed now. Write the scores and the weakest point in the log.
8. **Check** everything in "Checks before anything is published", with `/daily/<number>/?preview` as the address, because the edition has not opened yet. Also check contrast in light and in dark mode with every step open.
9. **Publish.** Set `status: 'ready'`, run `npm run build` once more, commit with a message that says what the edition is and why it is built that way, and push to `claude/busy-wozniak-ca7cbv`. If the push is rejected, fetch, merge, check again and retry. Never force-push.
10. **Quality over count.** An edition that does not reach the bar is not published. Never leave a draft in the schedule: take its entry out of `src/data/editions.ts`, move its folder to `drafts/<slug>/` at the root of the repo (outside `src`, so it is not built), and write in the log why, so a later night can finish it. A night without a new edition is fine. The home page says so honestly when a day has none.
11. **Finish.** Add a block to `docs/daily-log.md`: date, the edition with its number, slug, date and subject, how many sources, the scores, anything skipped and why, and ideas for later (add good ones to `docs/edition-ideas.md`, tick off the one you used). Commit and push. Then give the owner a short report in Dutch: the preview link (https://learn.helderlabs.com/daily/<number>/?preview), the day it opens, what to try first, and anything you are unsure about.

Work efficiently: tokens and time cost money. Use a few targeted searches instead of many broad ones, do not re-run a long check on a build that has not changed, and stop researching a fact once two good sources agree.

### What makes an edition worth sharing

- **A hook that sounds wrong and is true.** One sentence someone would repeat at dinner. "Fold a sheet of paper 42 times and it reaches the Moon." "A traffic jam can start with no cause at all." If the hook needs a paragraph before it surprises, find a sharper one.
- **The reader is part of the experiment.** Their own guess, their own clicks or keys, their own eyes, ears or reaction time, measured in their own browser (nothing is sent). A result that is about the reader ("the page predicted 68 per cent of my keys") is what people share.
- **One big interaction, done well,** beats four small ones. Move the thing itself where you can (drag the car, fold the paper, swap the cards), not a slider beside it. The picture answers at once. A slider only counts when moving it shows the cause.
- **A planned reveal.** A moment where a picture or a number turns the reader's guess around. It comes back to what they guessed.
- **New situations from daily life** in "Use it", so the idea travels: a queue, a password, a playlist, a recipe.
- **A share text that makes others curious** without giving the answer away, with a score only where a score means something.
- **One picture worth a screenshot**, in the edition's own colours, and a cover worth a click. Type in pictures stays readable on a phone (draw a narrow version if needed, as No. 1 does).
- **Motion with care.** A simulation starts when the reader starts it, has a pause button, and with reduced motion it steps instead of plays. Canvas is fine for many moving parts, with a still picture or text for no script. No flashing more than three times a second, nothing meant to make people feel unwell. Sound may add to an edition, never carry it alone, and it follows the sound switch.
- **Avoid:** quizzes about facts, "click next" experiments, walls of text, gambling or betting framing, tests that look like a diagnosis, anything about real private people, party politics.
- **Score 1 to 5 before publishing:** hook, surprise, the reader's own part, cause and effect, clarity, new situations, pictures, accuracy. Publish only when every score is at least 4.

## The nightly error check

Runs every night at 04:48 Netherlands time, in its own long-lived session, about two hours after the builder starts. Its job is to find and fix mistakes before readers see them. Nobody is awake, so do not ask questions. The same hard rules and checks apply. Read this file in full at the start of every run.

1. **Start** like the builder: fetch, check out `claude/busy-wozniak-ca7cbv`, pull, `npm ci` if needed. Read the newest blocks of `docs/daily-log.md`, run `git log --since="30 hours ago" --stat --oneline` and `npm run schedule`. If the newest commit is younger than 20 minutes, the builder is probably still working: check what is already pushed, but only report problems in the log. Do not edit files it may be editing.
2. **Check what changed.** `npm run check`, `npm run build`, preview on port 4322. For the edition the builder made last night (`/daily/<number>/?preview`) and for the edition that opens today: `node tools/check-topic.mjs` with screenshots, look at the contact sheets with your own eyes, and walk through every step with Playwright, reading every feedback text, the done step and the share text. Run `--no-shots` for the home page (`--min-chars 300`), `/archive/`, `/library/`, and three library topics, a different three each night (take the day of the year modulo the number of library topics). Run the dash scan. A clean local build is the stand-in for a working Vercel deployment, because the live site cannot be reached from here.
3. **Check the facts again.** For the new edition, pick three numbers or claims that matter and check them against the sources listed on its page. Also check that the answer marked right in each question really is right, and that each feedback text says why. If something is wrong or cannot be confirmed, correct it or mark it as approximate, and say so in `sourcesNote` if it was a source problem.
4. **Fix what is wrong**, in the smallest way that works: commit, then pull and push to `claude/busy-wozniak-ca7cbv`, never force-push, and run the checks again.
   - An edition that has **not opened yet** and cannot be fixed quickly and safely: set its `status` to `'draft'` (it is the last one, so the schedule stays valid) and put it on the repair list. The builder fixes it first the next night.
   - An edition that **has opened** is never taken offline, renumbered or moved to another date: people may have shared it, and streaks depend on it. Fix it in place. Keep its question ids and choice ids the same, because readers' saved progress refers to them. If a fact was wrong, correct it and say so in `sourcesNote`.
   - A library topic that is broken in a way that cannot be fixed quickly: set its `status` to `'draft'` in `src/data/topics.ts` and put it on the repair list. Do not delete anyone's work.
5. **Log it.** Add an "Error check YYYY-MM-DD" block to `docs/daily-log.md`: what you checked, what you found, what you fixed, and a repair list for anything left. Commit and push.
6. **Report** to the owner in Dutch, short: all fine, or what was wrong and what you did about it. Say clearly if an edition or a topic was taken offline.
