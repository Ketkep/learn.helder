// Everything the "Radiation therapy" page says, in one place.
// The page is a zoom: you scroll and the picture zooms from a treatment room down to a single
// strand of DNA, then back out to the person. Each scene has one tool to try.
// This page explains the idea. It is not medical advice, and the tools are simple models.

export interface Scene {
  id: string;
  /** A short name for the dots and the bar. */
  short: string;
  kicker: string;
  title: string;
  paras: string[];
  extra?: { label: string; text: string };
  /** How wide the picture is in real life, in metres. The scale bar and the number at the top use it. */
  size: number;
  /** The jump to the next scene: how much the picture grows or shrinks, and which way. */
  zoom?: { ratio: number; dir: 'in' | 'out' };
}

export const scenes: Scene[] = [
  {
    id: 'room',
    short: 'Room',
    kicker: 'The room',
    title: 'Two ways in',
    paras: [
      'About 135,000 people in the Netherlands were told they had cancer in 2025. One in two people will hear it at some point in their life.',
      'Surgery, chemotherapy and immunotherapy are well known. Radiation therapy is used a lot too, but fewer people know how it works. The radiation can reach a tumour from outside the body or from inside it.',
    ],
    extra: {
      label: 'After a session',
      text: 'After a session on a machine you are not radioactive, so you can meet other people straight away.',
    },
    size: 4,
    zoom: { ratio: 7, dir: 'in' },
  },
  {
    id: 'body',
    short: 'Body',
    kicker: 'The body',
    title: 'Many beams, one tumour',
    paras: [
      'This is a slice through a body, drawn like a CT scan. The tumour is in the middle. Colours show where the radiation lands: blue is a little, red is the full dose.',
      'X-rays lose strength as they go deeper, so one beam gives the skin more than the tumour. Beams from many angles cross at the tumour. Protons give most of their energy at the end of their path and then stop.',
    ],
    extra: {
      label: 'Most common',
      text: 'X-ray treatment is by far the most common. The Netherlands has three proton centres: Groningen, Delft and Maastricht.',
    },
    size: 0.5,
    zoom: { ratio: 8, dir: 'in' },
  },
  {
    id: 'tumour',
    short: 'Tumour',
    kicker: 'The tumour',
    title: 'A crowd of cells',
    paras: [
      'Your body makes new cells all the time. Now and then a copy goes wrong and the cell stops doing its job. The immune system usually clears these cells away, but not always.',
      'Cells that are missed keep dividing and pile up. That is a tumour. It can harm the organs around it, and cells can travel through the blood to other places. That is called a metastasis.',
    ],
    size: 0.0005,
    zoom: { ratio: 8, dir: 'in' },
  },
  {
    id: 'cell',
    short: 'Cell',
    kicker: 'The cell',
    title: 'Time your shot',
    paras: [
      'A cell goes round a cycle: it grows, copies its DNA and then divides. The dividing step is called the M phase, or mitosis. Radiation harms a cell most then, when it is at its weakest.',
      'The cells of a tumour are not all at the same step at the same time, so one session cannot catch them all. Press Fire at different moments and see what the phase does.',
    ],
    size: 0.00004,
    zoom: { ratio: 8, dir: 'in' },
  },
  {
    id: 'dna',
    short: 'DNA',
    kicker: 'The DNA',
    title: 'A break in the code',
    paras: [
      'DNA holds the instructions of the cell. Radiation breaks it. A cell can repair a little damage, but when there is too much it can no longer repair itself or divide, and it dies.',
      'Healthy cells are hit too, but they repair themselves faster and better than tumour cells do. The treatment depends on that difference.',
    ],
    size: 0.00000002,
    zoom: { ratio: 8, dir: 'in' },
  },
  {
    id: 'rays',
    short: 'Atom',
    kicker: 'The atom',
    title: 'Three kinds of rays',
    paras: [
      'Radiation therapy uses ionising radiation. Its rays carry so much energy that they can knock electrons out of atoms and change the molecules of a cell.',
      'Alpha, beta and gamma rays come from atoms that fall apart, and they differ in how far they get. X-rays are close relatives of gamma rays: both are made of photons.',
    ],
    size: 0.000000001,
    zoom: { ratio: 30, dir: 'out' },
  },
  {
    id: 'weeks',
    short: 'Weeks',
    kicker: 'The weeks',
    title: 'Why so many sessions?',
    paras: [
      'The dose is split over many small sessions, usually on weekdays with a rest at the weekend. This is called fractionation. A common plan is about 2 gray (the unit of dose) a day, five days a week, for several weeks.',
      'Healthy cells recover between sessions better than tumour cells do. And each session hits hardest the tumour cells that are dividing at that moment: different cells each day.',
    ],
    size: 0.0005,
    zoom: { ratio: 30, dir: 'out' },
  },
  {
    id: 'person',
    short: 'Person',
    kicker: 'The person',
    title: 'How it feels',
    paras: [
      'The treatment itself does not hurt, and a session takes only a few minutes. Most people feel tired, and the skin in the treated area can react. Hair can fall out there too.',
      'Other complaints depend on the body area. Some people notice them during the treatment, others only months or years later. Many people say a personal bond with their team made it easier.',
    ],
    size: 2,
  },
];

// ---------------------------------------------------------------- the room

export const ways = [
  {
    id: 'linac',
    label: 'Linac',
    title: 'A machine outside the body',
    points: [
      'A linear accelerator, or linac, speeds electrons up to nearly the speed of light and turns them into X-rays.',
      'A CT scan shows the tumour. Marks on the skin put you in exactly the same place each time.',
      'Metal leaves shape the beam, at most 40 by 40 cm, to fit the tumour. A session takes minutes.',
    ],
  },
  {
    id: 'mr',
    label: 'MR-linac',
    title: 'An MRI scanner and a linac in one',
    points: [
      'The MR-linac was designed at UMC Utrecht. The first patients were treated there in 2017.',
      'The MRI shows the tumour during the treatment, also when it moves or sits deep in the body.',
      'The aim is sharper, so less healthy tissue is hit. Sometimes a higher dose and fewer sessions are possible.',
    ],
  },
  {
    id: 'inside',
    label: 'From inside',
    title: 'A source in or next to the tumour',
    points: [
      'This is called brachytherapy. It is used for the prostate, the bladder, the oesophagus and more.',
      'Thin tubes are placed in the tumour area and joined to a machine with the source. Afterwards they come out. Nothing radioactive stays.',
      'Or tiny seeds go into the prostate and stay for good, fading over months. For a while you are slightly radioactive.',
    ],
  },
] as const;

// ---------------------------------------------------------------- the cell

export const phases = [
  { id: 'g1', label: 'G1', name: 'growing', from: 0, to: 0.4, damage: 0.45, words: 'some damage' },
  { id: 's', label: 'S', name: 'copying DNA', from: 0.4, to: 0.72, damage: 0.28, words: 'little damage' },
  { id: 'g2', label: 'G2', name: 'getting ready', from: 0.72, to: 0.88, damage: 0.75, words: 'quite a lot of damage' },
  { id: 'm', label: 'M', name: 'dividing', from: 0.88, to: 1, damage: 1, words: 'a lot of damage' },
] as const;

// ---------------------------------------------------------------- the rays

export const rayKinds = [
  {
    id: 'alpha',
    label: 'Alpha',
    use: 'Alpha rays hardly travel at all. They only work from inside the body, for example radium-223 against cancer that has spread to the bones.',
  },
  {
    id: 'beta',
    label: 'Beta',
    use: 'Beta rays get through skin, but thin metal stops them. They are used from inside the body, for example iodine-131 against thyroid cancer.',
  },
  {
    id: 'gamma',
    label: 'Gamma and X-rays',
    use: 'Gamma rays and X-rays go much further. They are the most used rays in radiation therapy, from outside the body and from inside.',
  },
] as const;

export const walls = [
  { id: 'paper', label: 'Paper' },
  { id: 'metal', label: 'Aluminium, 1 cm' },
  { id: 'concrete', label: 'Thick concrete or lead' },
] as const;

/** What happens for each ray (rows) and each wall (columns): through, weaker or stopped. */
export const rayResults: Record<string, ('through' | 'weaker' | 'stopped')[]> = {
  alpha: ['stopped', 'stopped', 'stopped'],
  beta: ['through', 'stopped', 'stopped'],
  gamma: ['through', 'weaker', 'stopped'],
};

// ---------------------------------------------------------------- the person

export const areas = [
  { id: 'head', label: 'Head and neck', complaints: 'A dry mouth, a hoarse voice, loss of taste and trouble swallowing.' },
  { id: 'chest', label: 'Chest', complaints: 'Trouble swallowing, a dry cough and shortness of breath.' },
  { id: 'belly', label: 'Belly and pelvis', complaints: 'Bowel and bladder problems, and feeling sick.' },
] as const;

export const everyone = 'Tiredness and skin reactions are the most common. Hair can fall out in the treated area.';

export const lastSession =
  'Some patients said their team hung streamers around the machine for the last session. Small things like that helped.';

// ---------------------------------------------------------------- the end of the page

export const takeaways = [
  'Radiation damages the DNA of tumour cells. When the damage is too much, the cell can no longer repair itself or divide.',
  'Beams from many angles add up at the tumour while healthy tissue gets less. Protons stop at the tumour, and X-rays go all the way through.',
  'The dose is split over many sessions. Healthy cells recover in between better than tumour cells, and each session hits the dividing cells hardest.',
  'Different rays do different jobs. X-rays and gamma rays work from outside, while alpha and beta rays work from sources placed inside.',
  'The treatment is painless and takes minutes. Tiredness and skin reactions are the most common complaints, and the rest depends on the body area.',
];

export interface Source {
  label: string;
  url: string;
  for: string;
}

export const sources: Source[] = [
  { label: 'IKNL: 135,000 new cancer diagnoses in 2025', url: 'https://iknl.nl/nieuws/2026/wereldkankerdag-2026', for: 'How many people in the Netherlands were told they had cancer in 2025.' },
  { label: 'KWF: 1 in 2 Dutch people get cancer', url: 'https://www.kwf.nl/nieuws/1-op-de-2-nederlanders-krijgt-kanker', for: 'The chance of cancer during a lifetime.' },
  { label: 'RIVM: radiation and radioactivity explained', url: 'https://www.rivm.nl/straling-en-radioactiviteit/uitleg', for: 'Ionising radiation, and alpha, beta and gamma rays.' },
  { label: 'natuurkunde.nl: proton therapy', url: 'https://www.natuurkunde.nl/artikelen/3457/protonentherapie', for: 'How protons and photons differ.' },
  { label: 'UMCG Radiotherapy: choosing between protons and photons', url: 'https://www.umcgradiotherapie.nl/nieuws/toelichtingskaart-totstandkoming-keuze-protonen-versus-fotonen', for: 'How the choice between protons and photons is made.' },
  { label: 'Radiotherapy and Oncology: access to proton therapy in the Netherlands', url: 'https://www.thegreenjournal.com/article/S0167-8140(22)04584-4/fulltext', for: 'The three proton centres in the Netherlands.' },
  { label: 'Cancer Network: principles of radiation therapy', url: 'https://www.cancernetwork.com/view/principles-radiation-therapy', for: 'How a linac makes X-rays and shapes the beam with metal leaves.' },
  { label: 'kanker.nl: external radiation (radiotherapy)', url: 'https://www.kanker.nl/soorten-behandelingen/bestraling/de-behandeling-met-bestraling/uitwendige-bestraling-radiotherapie', for: 'How a session goes, and that it takes a few minutes and does not hurt.' },
  { label: 'UMC Utrecht: MR-linac leaflet', url: 'https://www.umcutrecht.nl/nl/behandeling/mr-linac/folder', for: 'What an MR-linac is.' },
  { label: 'Elekta: first patient treated with the Unity at UMC Utrecht', url: 'https://ir.elekta.com/investors/press-releases/2018/first-patient-treated-with-ce-marked-elekta-unity-at-university-medical-center-utrecht/', for: 'The first MR-linac patients in Utrecht: 2017 in a study, 2018 with the approved machine.' },
  { label: 'kanker.nl: internal radiation (brachytherapy)', url: 'https://www.kanker.nl/soorten-behandelingen/bestraling/de-behandeling-met-bestraling/inwendige-bestraling-brachytherapie', for: 'Sources, tubes and seeds inside the body.' },
  { label: 'UMCG: internal radiation', url: 'https://www.umcg.nl/-/inwendige-bestraling', for: 'Treatment from inside the body.' },
  { label: 'Health Physics Society: after an iodine-125 seed implant', url: 'https://hps.org/publicinformation/ate/q10518/', for: 'How the seeds fade over months and what to take care of.' },
  { label: 'PubMed: the role of the cell cycle in sensitivity to radiotherapy', url: 'https://pubmed.ncbi.nlm.nih.gov/15234026/', for: 'Cells are most sensitive in the M and late G2 phases.' },
  { label: 'Radiopaedia: fractionation in radiation therapy', url: 'https://radiopaedia.org/articles/fractionation-radiation-therapy', for: 'Why the dose is split, and typical doses per day.' },
  { label: 'PMC: radium-223 for prostate cancer that has spread to bone', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4467240/', for: 'Radium-223, an alpha emitter used inside the body.' },
  { label: 'PubMed: alpha and beta emitters in nuclear medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/41828508/', for: 'Beta emitters such as iodine-131 and lutetium-177 in use.' },
  { label: 'kanker.nl: effects of radiation therapy', url: 'https://www.kanker.nl/soorten-behandelingen/bestraling/gevolgen/gevolgen-van-bestraling-radiotherapie', for: 'Tiredness, skin reactions and other effects.' },
  { label: 'Amsterdam UMC: cancer in the head and neck area and radiation', url: 'https://www.amsterdamumc.nl/nl/patienteninformatie/kanker-in-het-hoofd-halsgebied-en-bestraling.htm', for: 'Dry mouth, hair loss, skin and swallowing problems in the head and neck area.' },
  { label: 'Amsterdam UMC: lung cancer and radiation', url: 'https://amsterdamumc.nl/nl/patienteninformatie/longkanker-en-bestraling-radiotherapie.htm', for: 'Cough, shortness of breath and swallowing problems after treatment of the chest.' },
  { label: 'Radboudumc: side effects of radiation for rectal cancer', url: 'https://www.radboudumc.nl/patientenzorg/behandelingen/bestraling-endeldarm-voor-een-operatie/bijwerkingen', for: 'Bowel and bladder problems and feeling sick after treatment of the pelvis.' },
];
