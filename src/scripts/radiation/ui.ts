// The words for the scripts. The page puts them on the root element as JSON, in the language of
// the page, so the scripts never hold a sentence of their own.

import type { Ui } from '../../data/radiation/types';

export { fill, pick } from '../../lib/text';

let cached: Ui | undefined;

export function readUi(root: HTMLElement): Ui {
  if (!cached) cached = JSON.parse(root.dataset.ui ?? '{}') as Ui;
  return cached;
}
