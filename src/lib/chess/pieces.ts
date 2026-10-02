// The twelve chess pieces, drawn by hand for this site. Each of the six shapes is drawn once
// and used for both colors. The colors come from two CSS variables set by .pc-w and .pc-b
// (see src/styles/chess.css).
// Everything fits in a 46 by 46 box with the base along the bottom edge.

const shapes: Record<string, string> = {
  p:
    '<circle cx="23" cy="13" r="6.5"/><rect x="17" y="19" width="12" height="3.5" rx="1.7"/>' +
    '<path d="M19 22.5C19 28 15 31 13.5 37H32.5C31 31 27 28 27 22.5Z"/><rect x="11" y="36.5" width="24" height="5" rx="2.5"/>',
  b:
    '<circle cx="23" cy="9" r="3.2"/><path d="M23 12C14 17 14 26 18.5 30H27.5C32 26 32 17 23 12Z"/>' +
    '<path class="dl" d="M20.5 22L25.5 16.5"/><rect x="15.5" y="30" width="15" height="3.5" rx="1.7"/>' +
    '<path d="M17 33.5H29L32 38H14Z"/><rect x="11" y="38" width="24" height="4.5" rx="2.2"/>',
  n:
    '<path d="M13.5 38C13 31 15.5 27 20 23C17 23.4 14.2 25.6 11.5 29L9 27C10.2 21.6 13.6 17.2 18.4 13.6L17.6 8L22.4 10.8C27.4 9.6 32.6 12.2 35 18C37.4 23.6 36.6 31.4 35.5 38Z"/>' +
    '<circle class="dt" cx="22" cy="16" r="1.5"/><path class="dl" d="M26 12.5C29 14 31 17 31.5 21"/>' +
    '<rect x="11" y="37.5" width="24" height="5" rx="2.5"/>',
  r:
    '<path d="M12.5 10.5H17.5V14.5H20.8V10.5H25.2V14.5H28.5V10.5H33.5V21H12.5Z"/>' +
    '<path d="M15.5 21H30.5L29.2 31H16.8Z"/><rect x="13.5" y="30.5" width="19" height="4.2" rx="1.8"/>' +
    '<rect x="11" y="34.5" width="24" height="8" rx="2.5"/>',
  q:
    '<circle cx="9" cy="13.5" r="2.7"/><circle cx="16" cy="8.8" r="2.7"/><circle cx="23" cy="7.4" r="2.9"/><circle cx="30" cy="8.8" r="2.7"/><circle cx="37" cy="13.5" r="2.7"/>' +
    '<path d="M11.2 31L8.8 16.5L16 24L17.6 12L23 22.5L28.4 12L30 24L37.2 16.5L34.8 31Z"/>' +
    '<rect x="13" y="30.5" width="20" height="4.2" rx="1.8"/><rect x="11" y="34.5" width="24" height="8" rx="2.5"/>',
  k:
    '<path d="M21 3.5H25V6.5H28V10.5H25V13.5H21V10.5H18V6.5H21Z"/>' +
    '<path d="M23 13.5C14 16 12.4 26 15 31H31C33.6 26 32 16 23 13.5Z"/>' +
    '<path class="dl" d="M17.5 23H28.5"/>' +
    '<rect x="13.5" y="30.5" width="19" height="4.2" rx="1.8"/><rect x="11" y="34.5" width="24" height="8" rx="2.5"/>',
};

/** One <symbol> per piece shape: id "pc-p", "pc-n" and so on. Put this once on the page. */
export const pieceSymbols = Object.entries(shapes)
  .map(([type, body]) => `<symbol id="pc-${type}" viewBox="0 0 46 46">${body}</symbol>`)
  .join('');
