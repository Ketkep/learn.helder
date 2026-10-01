import { defineConfig } from 'astro/config';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { topics } from './src/data/topics.ts';

// Astro builds every folder in src/pages. Draft topics must not go live,
// so after a production build we delete their output folders from dist.
// (In `npm run dev` nothing is deleted, so drafts stay visible locally.)
function pruneDrafts() {
  return {
    name: 'prune-draft-topics',
    hooks: {
      'astro:build:done': ({ dir }) => {
        for (const topic of topics.filter((t) => t.status === 'draft')) {
          const folder = fileURLToPath(new URL(`./${topic.slug}/`, dir));
          rmSync(folder, { recursive: true, force: true });
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://learn.helderlabs.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [pruneDrafts()],
});
