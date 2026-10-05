// The English words of the "Radiation therapy" page. The shape is in types.ts and the numbers
// are in index.ts. The Dutch version is in nl.ts and must say the same things.

import type { Copy } from './types';

export const en: Copy = {
  page: {
    intro: 'Radiation can treat cancer. Zoom from a treatment room down to one strand of DNA, and back to the person, to see how.',
    sourcesNote:
      'This page is based on a school research project about radiation therapy. The facts were checked against the pages below, and a few statements from the project were corrected. The pictures are drawings, and the beam, cell and weeks tools are simple models, not medical tools. The page explains the idea. It is not medical advice.',
  },

  // ---------------------------------------------------------------- the eight scenes
  scenes: [
    {
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
      go: 'Zoom in to the body',
    },
    {
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
      go: 'Zoom in to the tumour',
    },
    {
      kicker: 'The tumour',
      title: 'A crowd of cells',
      paras: [
        'Your body makes new cells all the time. Now and then a copy goes wrong and the cell stops doing its job. The immune system usually clears these cells away, but not always.',
        'Cells that are missed keep dividing and pile up. That is a tumour. It can harm the organs around it, and cells can travel through the blood to other places. That is called a metastasis.',
      ],
      go: 'Zoom in to the cell',
    },
    {
      kicker: 'The cell',
      title: 'Time your shot',
      paras: [
        'A cell goes round a cycle: it grows, copies its DNA and then divides. The dividing step is called the M phase, or mitosis. Radiation harms a cell most then, when it is at its weakest.',
        'The cells of a tumour are not all at the same step at the same time, so one session cannot catch them all. Press Fire at different moments and see what the phase does.',
      ],
      go: 'Zoom in to the DNA',
    },
    {
      kicker: 'The DNA',
      title: 'A break in the code',
      paras: [
        'DNA holds the instructions of the cell. Radiation breaks it. A cell can repair a little damage, but when there is too much it can no longer repair itself or divide, and it dies.',
        'Healthy cells are hit too, but they repair themselves faster and better than tumour cells do. The treatment depends on that difference.',
      ],
      go: 'Zoom in to the atom',
    },
    {
      kicker: 'The atom',
      title: 'Three kinds of rays',
      paras: [
        'Radiation therapy uses ionising radiation. Its rays carry so much energy that they can knock electrons out of atoms and change the molecules of a cell.',
        'Alpha, beta and gamma rays come from atoms that fall apart, and they differ in how far they get. X-rays are close relatives of gamma rays: both are made of photons.',
      ],
      go: 'Zoom out to the weeks',
    },
    {
      kicker: 'The weeks',
      title: 'Why so many sessions?',
      paras: [
        'The dose is split over many small sessions, usually on weekdays with a rest at the weekend. This is called fractionation. A common plan is about 2 gray (the unit of dose) a day, five days a week, for several weeks.',
        'Healthy cells recover between sessions better than tumour cells do. And each session hits hardest the tumour cells that are dividing at that moment: different cells each day.',
      ],
      go: 'Zoom out to the person',
    },
    {
      kicker: 'The person',
      title: 'How it feels',
      paras: [
        'The treatment itself does not hurt, and a session takes only a few minutes. Most people feel tired, and the skin in the treated area can react. Hair can fall out there too.',
        'Other complaints depend on the body area. Some people notice them during the treatment, others only months or years later. Many people say a personal bond with their team made it easier.',
      ],
      go: 'Read the takeaways',
    },
  ],

  // ---------------------------------------------------------------- the room
  ways: [
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
  ],
  room: {
    art: 'A treatment room. A person lies on a couch. In one version a big machine, a linac, sends a beam down at their belly. In another the machine is joined to an MRI scanner. In the third a thin tube runs from the person through a thick wall to a machine with a radioactive source.',
    group: 'How the radiation reaches the tumour',
  },

  // ---------------------------------------------------------------- the body
  body: {
    art: 'A slice through a body, like a CT scan. The tumour is a small round shape in the middle. Colours on top show where radiation from beams at different angles lands: blue is a little, red is the full dose.',
    front: 'front',
    back: 'back',
    model: 'a simple model',
    kindGroup: 'Kind of radiation',
    photon: 'X-rays',
    proton: 'Protons',
    add: 'Add a beam',
    reset: 'Reset',
    angle: 'Last beam, from',
    degrees: ['{n} degree', '{n} degrees'],
    energy: 'Proton energy',
    matched: 'matched',
    tumourDose: 'Tumour dose',
    hottest: 'Hottest healthy spot',
    reached: 'Healthy tissue reached',
    missed: 'The peak has missed the tumour. It gets only <strong>{n}%</strong> of the dose, and the peak lands in healthy tissue.',
    protonOne: 'One proton beam is enough here. The dose peaks in the tumour, and hardly anything lands behind it.',
    protonMany: 'Every proton beam stops in the tumour. The low dose on the way in is spread over more angles.',
    photonOne: 'One X-ray beam: the skin on the way in gets <strong>{n}%</strong>, more than the tumour, and the beam goes on through the body.',
    photonMany: 'Several X-ray beams: the hottest healthy spot is lower, because the beams only add up at the tumour. But a bigger part of the body gets a little.',
  },

  // ---------------------------------------------------------------- the tumour
  tumour: {
    art: 'A patch of tissue seen through a microscope. Pale pink cells with a small purple nucleus are healthy. A cluster of darker cells with bigger nuclei in the middle are faulty cells that have piled up into a tumour.',
    immune: 'Immune system',
    weak: 'weak',
    medium: 'medium',
    strong: 'strong',
    run: 'Let time pass',
    pause: 'Pause',
    restart: 'Start again',
    day: '<strong>Day {n}.</strong> Faulty cells: <strong>{cells}</strong>.',
    spread: 'Spread to other places: <strong>{n}</strong>.',
    cleared: 'The immune system cleared them all.',
    overrun: 'The tumour has taken over this patch.',
    grows: 'With this immune system the tumour grows.',
    shrinks: 'With this immune system the tumour shrinks.',
  },

  // ---------------------------------------------------------------- the cell
  phases: [
    { name: 'growing', words: 'some damage' },
    { name: 'copying DNA', words: 'little damage' },
    { name: 'getting ready', words: 'quite a lot of damage' },
    { name: 'dividing', words: 'a lot of damage' },
  ],
  cell: {
    art: 'A single cell seen through a microscope, with a ring around it that shows the stages of the cell cycle. A marker moves round the ring. In the dividing stage the nucleus gives way to chromosomes lined up in the middle.',
    cycle: 'Cell cycle',
    play: 'Play',
    pause: 'Pause',
    fire: 'Fire',
    logLabel: 'Your last shots',
    note: 'The damage levels are an idea, not exact numbers.',
    levels: { most: 'most', lot: 'a lot', some: 'some', little: 'little' },
    fired: 'Fired in the <strong>{label}</strong> phase, while the cell is {name}: <strong>{words}</strong>.',
    start: 'Press Fire when you want to take a shot.',
  },

  // ---------------------------------------------------------------- the DNA
  dna: {
    art: 'A piece of DNA: two twisting strands joined by coloured rungs, drawn on a dark blue background. Rays hit it and break the strands in places, and the breaks slowly mend.',
    kindGroup: 'Kind of cell',
    healthy: 'Healthy cell',
    tumour: 'Tumour cell',
    radiate: 'Radiate',
    reset: 'Reset',
    breaks: 'Breaks right now',
    breaksOf: '{n} of {limit}',
    startHealthy: 'A <strong>healthy</strong> cell. Press Radiate to send rays at its DNA.',
    startTumour: 'A <strong>tumour</strong> cell. Press Radiate to send rays at its DNA.',
    dead: '<strong>Too much damage at once.</strong> The cell can no longer repair itself, and it dies.',
    broken: [
      '<strong>{n}</strong> break in the DNA. The cell starts to repair it.',
      '<strong>{n}</strong> breaks in the DNA. The cell starts to repair them.',
    ],
    mended: '<strong>All mended.</strong> The cell repaired every break ({n} in all).',
    left: [
      '<strong>{n}</strong> break left. <strong>{m}</strong> mended so far.',
      '<strong>{n}</strong> breaks left. <strong>{m}</strong> mended so far.',
    ],
  },

  // ---------------------------------------------------------------- the rays
  rayKinds: [
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
  ],
  walls: [
    { id: 'paper', label: 'Paper', name: 'paper' },
    { id: 'metal', label: 'Aluminium, 1 cm', name: 'aluminium, 1 cm' },
    { id: 'concrete', label: 'Thick concrete or lead', name: 'thick concrete or lead' },
  ],
  rays: {
    art: 'An atom drawn with a clump of protons and neutrons in the middle and electrons circling it. A ray leaves the atom towards a wall on the right. Depending on the kind of ray and the wall, the ray is stopped or passes through.',
    scale: 'not to scale',
    kindGroup: 'Kind of ray',
    wallGroup: 'Wall',
    send: 'Send a ray',
    start: 'Pick a ray and a wall, then send the ray.',
    stopped: '<strong>Stopped</strong> by {wall}.',
    weaker: 'Goes through {wall}, but <strong>weaker</strong>.',
    through: 'Goes <strong>straight through</strong> {wall}.',
  },

  // ---------------------------------------------------------------- the weeks
  weeks: {
    art: 'A dish of cells. Dark purple tumour cells sit in the middle and pale healthy cells around them. Cells that are about to divide have a yellow ring. As the days of treatment pass, tumour cells disappear.',
    sessions: 'Sessions',
    plan: ['{n} session of {dose} Gy', '{n} sessions of {dose} Gy'],
    tumourLeft: 'Tumour cells left',
    healthyLeft: 'Healthy cells left',
    start: 'Start treatment',
    reset: 'Reset',
    pause: 'Pause',
    again: 'Treat again',
    ready: [
      'The same <strong>{total} Gy</strong> in {n} session. Yellow rings are cells about to divide. Press Start.',
      'The same <strong>{total} Gy</strong> in {n} sessions. Yellow rings are cells about to divide. Press Start.',
    ],
    day: '<strong>Day {d}.</strong> Tumour cells: <strong>{t}</strong>. Healthy cells: <strong>{h}</strong>.',
    result: '<strong>After {d} days.</strong> Healthy tissue fell to <strong>{low}%</strong> at its lowest and ended at <strong>{hp}%</strong>. {verdict}',
    verdictGone: 'The tumour is gone and most healthy tissue is fine.',
    verdictCost: 'The tumour is gone, but so is a lot of healthy tissue. Splitting the dose into more sessions spares it.',
    verdictLeft: ['{n} tumour cell survived.', '{n} tumour cells survived.'],
  },

  // ---------------------------------------------------------------- the person
  areas: [
    { id: 'head', label: 'Head and neck', complaints: 'A dry mouth, a hoarse voice, loss of taste and trouble swallowing.' },
    { id: 'chest', label: 'Chest', complaints: 'Trouble swallowing, a dry cough and shortness of breath.' },
    { id: 'belly', label: 'Belly and pelvis', complaints: 'Bowel and bladder problems, and feeling sick.' },
  ],
  everyone: 'Tiredness and skin reactions are the most common. Hair can fall out in the treated area.',
  lastSession: 'Some patients said their team hung streamers around the machine for the last session. Small things like that helped.',
  person: {
    art: 'A person standing in a light room. Three round areas are marked on the body: the head and neck, the chest, and the belly and pelvis. One of them is lit up to show where the treatment is.',
    group: 'Treated area',
    all: 'Everyone.',
    last: 'The last session',
  },

  // ---------------------------------------------------------------- the bar at the top
  hud: {
    across: 'across the picture',
    routeLabel: 'Scenes',
    goTo: 'Go to scene {i}: {title}',
    plain: ['Plain', ' view'],
    zoomView: ['Zoom', ' view'],
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    sceneOf: 'Scene {i} of {n}: {title}',
    hint: 'Scroll to zoom in',
    readMore: 'Read more',
    showLess: 'Show less',
    decimal: '.',
  },

  // ---------------------------------------------------------------- the end of the page
  takeaways: [
    'Radiation damages the DNA of tumour cells. When the damage is too much, the cell can no longer repair itself or divide.',
    'Beams from many angles add up at the tumour while healthy tissue gets less. Protons stop at the tumour, and X-rays go all the way through.',
    'The dose is split over many sessions. Healthy cells recover in between better than tumour cells, and each session hits the dividing cells hardest.',
    'Different rays do different jobs. X-rays and gamma rays work from outside, while alpha and beta rays work from sources placed inside.',
    'The treatment is painless and takes minutes. Tiredness and skin reactions are the most common complaints, and the rest depends on the body area.',
  ],

  sources: [
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
  ],
};
