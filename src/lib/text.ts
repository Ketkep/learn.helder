// Two tiny helpers for lines of text that have slots and counts. They run on the server (to build
// the page) and in the browser (for the tools), so they stay free of anything else.

/** The languages the site is written in. English is the default. */
export type Lang = 'en' | 'nl';

/** The first form for exactly one, the second for any other number. */
export type Plural = [one: string, many: string];

/** Fills the {name} slots in a line of text. */
export function fill(text: string, values: Record<string, string | number> = {}) {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

/** Picks the form for a count. */
export const pick = (n: number, forms: Plural) => (n === 1 ? forms[0] : forms[1]);
