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

**2. Draw the cover.** Put a simple SVG at `src/previews/my-new-topic.svg`. Use viewBox `0 0 400 300` and no colors of its own: the cover supplies them, so the drawing works on any cover color and in both light and dark mode. Copy one of the existing files in that folder and change the shapes. These classes are available inside the SVG:

- `class="a"` a solid shape in the text color. `class="b"` a softer shape. `class="c"` a very faint one. `class="cv"` a shape in the cover color (to cut a hole).
- `class="l"` a line, and `class="l dash"` a dotted line.
- `class="knob"` the orange knob. Every cover has one, it is the brand's signature. Use it for the thing the reader moves.
- `class="m"` with `style="--dx: 40px"` (or `--dy`) slides a shape when the cover is hovered. `class="grow"` with `style="--g: 0.1"` stretches it upwards. Add `--i: 2` to delay it by a few steps.
- Plain `<text>` is styled for you (small, in the text color).

For bigger animations, a drawing can contain its own `<style>` block. The three current covers do this: `gambits-in-chess.svg` plays a whole little story on a board, `pyramids-in-peru.svg` moves the sun across the sky with the shadow following it, and `the-dutch-golden-age.svg` sails a ship past canal houses. A few rules keep this tidy:

- Start your class names and `@keyframes` names with a short prefix for the topic (`ch-`, `pe-`, `nl-`), so two drawings never clash.
- Put the selector `:is(a, .head-art):is(:hover, :focus-visible)` in front of a rule to run an animation only while the cover is hovered or focused. The same drawing is shown on the topic page, where `.head-art` is the hover target.
- Wrap animations in `@media (prefers-reduced-motion: no-preference)`, so people who ask for less motion get a still drawing.
- Colors: use `var(--cover)` (the cover color), `var(--on-cover)` (the text color on it) and `var(--accent)` (the orange knob), mixed with `color-mix(in oklab, ...)` if you need a lighter or darker shade.

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

The three topics (chess gambits, pyramids in Peru, the Dutch Golden Age) are set to `live`, but their pages still say "Coming soon". That is fine while you look at the site on the `.vercel.app` link. Before you attach learn.helderlabs.com, either build the pages or set any topic you are not ready to show to `draft`.

## Draft and live

- `status: 'draft'` topics show in `npm run dev` with a small "Draft" label.
- `status: 'live'` topics show everywhere.
- In `npm run build`, the pages of draft topics are deleted from the output, so unfinished work never goes online.

## Where things are

```
src/data/topics.ts       the list of all topics
src/pages/index.astro    the homepage (hero, filter, grid)
src/pages/<slug>/        one folder per topic
src/layouts/             BaseLayout (page shell) and TopicLayout (topic frame)
src/components/          header, footer, topic card, "coming soon" block
src/styles/global.css    colors, fonts, spacing: change the look here
src/previews/            one SVG drawing per topic, shown on its cover
src/lib/                 small helpers (cover text color, loading the drawings)
src/scripts/             the lamp (lamp.ts): pull the cord to switch light and dark
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
- Movement is switched off for people who ask for reduced motion: no lamp swing, no drawing animation, no cover lift. The lamp still works when used.
- The whole cover is one link (cover and caption), so clicking anywhere on it opens the topic.
- The favicon is a placeholder. The link preview image `public/og-image.png` is a 1200 by 630 picture of the hero. Replace both when the brand artwork is ready.

## Writing rules for this site

Short, plain sentences. Sentence case for headings. No em dashes or en dashes anywhere, no emojis, and no marketing words. Use a period, comma, colon or parentheses instead.
