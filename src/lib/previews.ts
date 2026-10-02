// Loads the cover drawings from src/previews as text, so they can be placed inline
// in the page and styled (and moved on hover) with CSS.

const drawings = import.meta.glob('../previews/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** The SVG markup for a topic's preview. `name` is the file name without ".svg". */
export function getDrawing(name: string): string {
  const drawing = drawings[`../previews/${name}.svg`];
  if (!drawing) {
    throw new Error(`Missing cover drawing: add src/previews/${name}.svg`);
  }
  return drawing;
}
