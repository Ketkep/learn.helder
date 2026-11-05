// Drawings and small data for the Rosetta Stone page. The history and the idea of reading royal names from their shared signs come from
// the sources. The signs are simplified shapes made for this page, not the real hieroglyphs, and the spelling of the two names is
// simplified. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);

export const BANDS = [
  { id: 'hiero', name: 'Hieroglyphs', words: 'The top band is in hieroglyphs, the script of priests and temples. By the time the stone was found, nobody could read it. It had not been read for about 1400 years.' },
  { id: 'demotic', name: 'Demotic', words: 'The middle band is in demotic, a quick script for everyday writing. It was also unreadable in 1799. Thomas Young made early progress on it.' },
  { id: 'greek', name: 'Greek', words: 'The bottom band is in Greek, the language of the rulers. Scholars could read Greek, so they knew what the stone said. All three bands carry the same decree.' },
];

/** A sign: a simplified shape in a 24 by 24 box, with the sound it stands for in these names. */
export interface Sign {
  id: string;
  sound: string;
  svg: string;
}

export const SIGNS: Record<string, Sign> = {
  p: { id: 'p', sound: 'p', svg: '<rect x="4" y="8" width="16" height="8"/>' },
  t: { id: 't', sound: 't', svg: '<path d="M3 17 A9 9 0 0 1 21 17 Z"/>' },
  o: { id: 'o', sound: 'o', svg: '<circle cx="10" cy="14" r="5"/><path d="M14 11 L21 7 L18 14 Z"/>' },
  l: { id: 'l', sound: 'l', svg: '<path d="M3 18 L8 8 L13 14 L21 8 L19 18 Z"/>' },
  m: { id: 'm', sound: 'm', svg: '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="10" r="1.6" class="eyehole"/><circle cx="15" cy="10" r="1.6" class="eyehole"/>' },
  ii: { id: 'ii', sound: 'i', svg: '<path d="M7 20 Q4 8 9 3 Q10 12 7 20 Z"/><path d="M16 20 Q13 8 18 3 Q19 12 16 20 Z"/>' },
  s: { id: 's', sound: 's', svg: '<path d="M3 7 H21 V10 H3 Z M3 12 H21 V15 H3 Z M3 17 H21 V20 H3 Z"/>' },
  k: { id: 'k', sound: 'k', svg: '<path d="M5 12 H19 L17 20 H7 Z"/><path d="M6 12 Q12 2 18 12" fill="none" class="stroke"/>' },
  i: { id: 'i', sound: 'i', svg: '<path d="M12 21 Q6 10 12 2 Q18 10 12 21 Z"/>' },
  a: { id: 'a', sound: 'a', svg: '<path d="M4 18 L12 5 L20 18 L12 14 Z"/>' },
  r: { id: 'r', sound: 'r', svg: '<ellipse cx="12" cy="12" rx="9" ry="5"/>' },
};

/** The two royal names as rows of signs. */
export const PTOLEMY = ['p', 't', 'o', 'l', 'm', 'ii', 's'];
export const CLEOPATRA = ['k', 'l', 'i', 'o', 'p', 'a', 't', 'r', 'a'];

/** The signs that appear in both names. */
export const SHARED = PTOLEMY.filter((s) => CLEOPATRA.includes(s));

const CELL = 26;

/** Two cartouches in rows of signs. A chosen sign and its twins are lit, and their sound is shown under them. */
export function cartouchesSvg(pick: string): string {
  let o = `<rect class="slab" x="1" y="1" width="298" height="174" rx="8"/>`;
  const row = (names: string[], y: number, label: string) => {
    const w = names.length * CELL + 14;
    const x0 = 150 - w / 2;
    let r = `<rect class="cartouche" x="${f1(x0)}" y="${y}" width="${w}" height="46" rx="23"/>`;
    names.forEach((id, i) => {
      const on = id === pick;
      r += `<g class="sign${on ? ' hot' : ''}" transform="translate(${f1(x0 + 7 + i * CELL + 1)} ${y + 11}) scale(0.9)">${SIGNS[id].svg}</g>`;
      if (on) r += `<text class="lab mid" x="${f1(x0 + 7 + i * CELL + 13)}" y="${y + 58}">${SIGNS[id].sound}</text>`;
    });
    r += `<text class="lab small" x="12" y="${y - 6}">${label}</text>`;
    return r;
  };
  o += row(PTOLEMY, 30, 'Ptolemy, simplified');
  o += row(CLEOPATRA, 108, 'Cleopatra, simplified');
  return o;
}

/** The stone, drawn as a slab in three bands, one of them lit. */
export function slabSvg(active: string): string {
  let o = `<rect class="stone" x="70" y="6" width="160" height="188" rx="22"/>`;
  BANDS.forEach((b, i) => {
    const y = 20 + i * 58;
    const on = b.id === active;
    o += `<rect class="band${on ? ' hot' : ''}" x="82" y="${y}" width="136" height="50" rx="6"/>`;
    if (b.id === 'hiero') {
      ['p', 't', 'o', 'l', 'm', 'ii', 's', 'a'].forEach((id, j) => (o += `<g class="glyph" transform="translate(${f1(86 + j * 16.5)} ${y + 14}) scale(0.62)">${SIGNS[id].svg}</g>`));
    } else if (b.id === 'demotic') {
      let d = '';
      for (let j = 0; j < 6; j++) d += `M86 ${y + 12 + j * 5.5} q8 -5 16 0 t16 0 t16 0 t16 0 t16 0 t14 0 `;
      o += `<path class="wave" d="${d}"/>`;
    } else {
      o += `<text class="greek" x="150" y="${y + 20}">ΠΤΟΛΕΜΑΙΟΥ</text><text class="greek" x="150" y="${y + 35}">ΒΑΣΙΛΕΩΣ</text>`;
    }
  });
  return o;
}

// ---------- Sound signs and meaning signs: a rebus as a toy ----------

export interface Rebus {
  word: string;
  parts: { pic: string; sound: string }[];
}

export const REBUSES: Rebus[] = [
  { word: 'belief', parts: [{ pic: 'a bee', sound: 'be' }, { pic: 'a leaf', sound: 'lief' }] },
  { word: 'carpet', parts: [{ pic: 'a car', sound: 'car' }, { pic: 'a pet', sound: 'pet' }] },
  { word: 'mother', parts: [{ pic: 'a moth', sound: 'moth' }, { pic: 'an ear', sound: 'er' }] },
  { word: 'season', parts: [{ pic: 'the sea', sound: 'sea' }, { pic: 'a son', sound: 'son' }] },
];
