// The picture of an edition, served at /daily/<number>/cover.svg. The home page and the archive show it
// with a plain <img>, so the browser can swap it when the day changes. The drawing lives in the edition's
// folder (cover.svg) and uses fixed colours, because an <img> cannot take the page's colours.
import type { APIRoute } from 'astro';
import { getEditions } from '../../../data/editions';

const covers = import.meta.glob<string>('../../../editions/*/cover.svg', { query: '?raw', import: 'default', eager: true });

export function getStaticPaths() {
  return getEditions(import.meta.env.DEV).map((e) => ({ params: { n: String(e.number) }, props: { slug: e.slug } }));
}

export const GET: APIRoute = ({ props }) => {
  const svg = covers[`../../../editions/${props.slug}/cover.svg`];
  if (!svg) throw new Error(`Add src/editions/${props.slug}/cover.svg`);
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
