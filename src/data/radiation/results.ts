// What happens for each ray (rows) and each wall (columns): through, weaker or stopped.
// This is the same in every language, and the ray tool needs it in the browser, so it sits in a
// file of its own that does not pull in any of the words.

export const rayResults: Record<string, ('through' | 'weaker' | 'stopped')[]> = {
  alpha: ['stopped', 'stopped', 'stopped'],
  beta: ['through', 'stopped', 'stopped'],
  gamma: ['through', 'weaker', 'stopped'],
};
