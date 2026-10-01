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
  accent: '#E0A12A',               // one mid-tone color, the tints and line colors are mixed from it
  preview: 'my-new-topic',         // name of the drawing in src/previews
  dateAdded: '2026-11-01',         // topics are ordered by this date, oldest first
  status: 'draft',                 // change to 'live' when it is ready
},
```

**2. Add the preview drawing.** Put a simple SVG at `src/previews/my-new-topic.svg`. Use viewBox `0 0 400 280` and no colors of its own: the card draws it with thin lines in a dark shade of the topic's color. Copy one of the existing files in that folder and change the shapes. Three helper classes are available inside the SVG:

- `class="f"` fills a shape with the panel's light color.
- `class="s"` makes a shape solid (dots, markers).
- `class="m"` with `style="--dx: 40px"` (or `--dy`) moves a shape on hover. `class="grow"` with `style="--g: 0.1"` stretches it upwards.

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

The three starter topics are placeholders set to `live`, so the deployed site shows cards. Before you attach learn.helderlabs.com, replace them with real topics or set them to `draft`.

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
src/previews/            one SVG drawing per topic, shown on the cards
public/                  favicon and the link preview image
```

## Design notes

- Colors, fonts and spacing are CSS variables at the top of `src/styles/global.css`. Light and dark mode follow the system setting.
- Fonts are Bricolage Grotesque (headings) and Hanken Grotesk (text), installed through `@fontsource` so they are served from this site and not from Google.
- The look is thin hairlines, soft tinted panels and one orange accent. Each topic's panel color is mixed from the one `accent` value in the registry, so it also works in dark mode.
- The name in the hero comes into focus when the page loads ("helder" means clear). The card drawings move a little on hover. Both are switched off for people who ask for reduced motion.
- The favicon is a placeholder. The link preview image `public/og-image.png` is a 1200 by 630 picture of the hero. Replace both when the brand artwork is ready.

## Writing rules for this site

Short, plain sentences. Sentence case for headings. No em dashes or en dashes anywhere, no emojis, and no marketing words. Use a period, comma, colon or parentheses instead.
