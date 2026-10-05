// De Nederlandse tekst van de pagina "Radiotherapie". Dezelfde vorm als en.ts (zie types.ts), en
// hij moet hetzelfde zeggen. Woorden volgen zoveel mogelijk het profielwerkstuk en de
// Nederlandse ziekenhuis- en patiëntensites (afweersysteem, uitzaaiing, bronhouders, zaadjes).
// De zinnen met {naam} krijgen hun waarde van de pagina. Een paar [een, meer] kiest op aantal.

import type { Copy } from './types';

export const nl: Copy = {
  page: {
    intro: 'Bestraling kan kanker behandelen. Zoom in van een behandelkamer tot één streng DNA en weer terug naar de patiënt, dan zie je hoe.',
    sourcesNote:
      "Deze pagina is gebaseerd op een profielwerkstuk over bestraling bij kanker. De feiten zijn gecontroleerd aan de hand van de onderstaande pagina's, en een paar beweringen uit het werkstuk zijn gecorrigeerd. De afbeeldingen zijn tekeningen, en de interactieve onderdelen over de bundels, de cel en de weken zijn eenvoudige modellen, geen medische hulpmiddelen. De pagina legt het idee uit. Het is geen medisch advies.",
  },

  // ---------------------------------------------------------------- de acht scènes
  scenes: [
    {
      kicker: 'De behandelkamer',
      title: 'Buiten en binnen',
      paras: [
        'In 2025 kregen ongeveer 135.000 mensen in Nederland de diagnose kanker. Een op de twee mensen krijgt die diagnose ooit in zijn of haar leven.',
        'De meeste mensen kennen operaties, chemotherapie en immunotherapie. Bestraling wordt ook veel gebruikt, maar minder mensen weten hoe het werkt. De straling kan een tumor bereiken van buiten het lichaam of van binnenuit.',
      ],
      extra: {
        label: 'Na een bestraling',
        text: 'Na een bestraling met een apparaat ben je niet radioactief. Je kunt dus meteen weer contact hebben met anderen.',
      },
      go: 'Zoom in op het lichaam',
    },
    {
      kicker: 'Het lichaam',
      title: 'Veel bundels, één tumor',
      paras: [
        'Dit is een doorsnede van een lichaam, getekend zoals een CT-scan. De tumor zit in het midden. De kleuren laten zien waar de straling terechtkomt: blauw is een beetje, rood is de volle dosis.',
        'Röntgenstraling wordt zwakker naarmate ze dieper in het lichaam komt, dus één bundel geeft de huid meer dan de tumor. Bundels uit veel hoeken kruisen elkaar bij de tumor. Protonen geven de meeste energie af aan het einde van hun weg en stoppen dan.',
      ],
      extra: {
        label: 'Meest gebruikt',
        text: 'Bestraling met röntgenstraling is verreweg het meest gebruikt. Nederland heeft drie protonencentra: Groningen, Delft en Maastricht.',
      },
      go: 'Zoom in op de tumor',
    },
    {
      kicker: 'De tumor',
      title: 'Een menigte cellen',
      paras: [
        'Je lichaam maakt voortdurend nieuwe cellen. Soms gaat een kopie fout en doet de cel haar werk niet meer. Het afweersysteem ruimt zulke cellen meestal op, maar niet altijd.',
        'Cellen die gemist worden, blijven delen en hopen zich op. Dat is een tumor. Een tumor kan de organen eromheen beschadigen, en cellen kunnen via het bloed naar andere plekken reizen. Dat heet een uitzaaiing.',
      ],
      go: 'Zoom in op de cel',
    },
    {
      kicker: 'De cel',
      title: 'Kies je moment',
      paras: [
        'Een cel doorloopt een cyclus: ze groeit, kopieert haar DNA en deelt zich daarna. De deling heet de M-fase, of mitose. Straling beschadigt een cel dan het meest, want dan is ze het zwakst.',
        'De cellen van een tumor zitten niet allemaal tegelijk in dezelfde stap, dus met één bestraling krijg je ze niet allemaal te pakken. Druk op Bestralen op verschillende momenten en kijk wat de fase doet.',
      ],
      go: 'Zoom in op het DNA',
    },
    {
      kicker: 'Het DNA',
      title: 'Een breuk in de code',
      paras: [
        'DNA bevat de instructies van de cel. Straling breekt het. Een cel kan een beetje schade herstellen, maar bij te veel schade kan ze zichzelf niet meer repareren en zich niet meer delen, en dan sterft ze.',
        'Gezonde cellen worden ook geraakt, maar zij herstellen zich sneller en beter dan tumorcellen. De behandeling werkt dankzij dat verschil.',
      ],
      go: 'Zoom in op het atoom',
    },
    {
      kicker: 'Het atoom',
      title: 'Drie soorten straling',
      paras: [
        'Bij bestraling wordt ioniserende straling gebruikt. Die straling heeft zoveel energie dat ze elektronen uit atomen kan slaan en de moleculen van een cel kan veranderen.',
        'Alfa-, bèta- en gammastraling komen van atomen die uit elkaar vallen, en ze komen niet even ver. Röntgenstraling is een naaste verwant van gammastraling: allebei bestaan ze uit fotonen.',
      ],
      go: 'Zoom uit naar de behandelweken',
    },
    {
      kicker: 'De weken',
      title: 'Waarom zoveel bestralingen?',
      paras: [
        'De dosis wordt verdeeld over veel kleine bestralingen, meestal op werkdagen met rust in het weekend. Dat heet fractionering. Een gangbaar schema is ongeveer 2 gray (de eenheid van de stralingsdosis) per dag, vijf dagen per week, enkele weken lang.',
        'Gezonde cellen herstellen zich tussen de bestralingen beter dan tumorcellen. En elke bestraling treft vooral de tumorcellen die op dat moment aan het delen zijn: elke dag andere cellen.',
      ],
      go: 'Zoom uit naar de patiënt',
    },
    {
      kicker: 'De patiënt',
      title: 'Hoe het voelt',
      paras: [
        'De bestraling zelf doet geen pijn en duurt maar een paar minuten. De meeste mensen worden moe, en de huid in het bestraalde gebied kan reageren. Ook kan daar haar uitvallen.',
        'Andere klachten hangen af van het deel van het lichaam. Sommige mensen merken ze tijdens de behandeling, anderen pas na maanden of jaren. Veel mensen zeggen dat een persoonlijke band met hun team het makkelijker maakte.',
      ],
      go: 'Lees de belangrijkste punten',
    },
  ],

  // ---------------------------------------------------------------- de behandelkamer
  ways: [
    {
      id: 'linac',
      label: 'Linac',
      title: 'Een apparaat buiten het lichaam',
      points: [
        'Een lineaire versneller, of linac, versnelt elektronen tot bijna de lichtsnelheid en maakt er röntgenstraling van.',
        'Een CT-scan laat zien waar de tumor zit. Markeringen op de huid zorgen dat je elke keer precies hetzelfde ligt.',
        'Metalen lamellen geven de bundel de vorm van de tumor, hooguit 40 bij 40 cm. Een bestraling duurt minuten.',
      ],
    },
    {
      id: 'mr',
      label: 'MR-linac',
      title: 'Een MRI-scanner en een linac in één',
      points: [
        'De MR-linac is ontworpen in het UMC Utrecht. De eerste patiënten werden daar in 2017 behandeld.',
        'De MRI laat de tumor zien tijdens de behandeling, ook als hij beweegt of diep in het lichaam zit.',
        'Het doel is scherper bestralen, zodat minder gezond weefsel wordt geraakt. Soms zijn een hogere dosis en minder bestralingen mogelijk.',
      ],
    },
    {
      id: 'inside',
      label: 'Van binnenuit',
      title: 'Een bron in of naast de tumor',
      points: [
        'Dit heet brachytherapie. Het wordt gebruikt bij onder meer de prostaat, de blaas en de slokdarm.',
        'Buisjes (bronhouders) in het gebied van de tumor worden met slangetjes aan een apparaat met de bron gekoppeld. Daarna gaan ze eruit. Er blijft niets radioactiefs achter.',
        'Of kleine zaadjes blijven voorgoed in de prostaat, terwijl hun straling in maanden afneemt. Een tijd lang ben je een beetje radioactief.',
      ],
    },
  ],
  room: {
    art: 'Een behandelkamer. Een patiënt ligt op een behandeltafel. In de ene versie stuurt een groot apparaat, een linac, een bundel naar beneden op de buik van de patiënt. In een andere is het apparaat gekoppeld aan een MRI-scanner. In de derde loopt een dun buisje van de patiënt door een dikke muur naar een apparaat met een radioactieve bron.',
    group: 'Hoe de straling de tumor bereikt',
  },

  // ---------------------------------------------------------------- het lichaam
  body: {
    art: 'Een doorsnede van een lichaam, zoals op een CT-scan. De tumor is een klein rond vlekje in het midden. Kleuren erbovenop laten zien waar de straling van bundels uit verschillende hoeken terechtkomt: blauw is een beetje, rood is de volle dosis.',
    front: 'voor',
    back: 'achter',
    model: 'een eenvoudig model',
    kindGroup: 'Soort straling',
    photon: 'Röntgen',
    proton: 'Protonen',
    add: 'Bundel erbij',
    reset: 'Opnieuw',
    angle: 'Laatste bundel, vanaf',
    degrees: ['{n} graad', '{n} graden'],
    energy: 'Protonenenergie',
    matched: 'afgestemd',
    tumourDose: 'Dosis in de tumor',
    hottest: 'Piek in gezond weefsel',
    reached: 'Gezond weefsel geraakt',
    missed: 'De piek mist de tumor. Die krijgt maar <strong>{n}%</strong> van de dosis, en de piek valt in gezond weefsel.',
    protonOne: 'Eén protonenbundel is hier genoeg. De dosis piekt in de tumor en erachter komt bijna niets terecht.',
    protonMany: 'Elke protonenbundel stopt in de tumor. De lage dosis onderweg is verdeeld over meer hoeken.',
    photonOne: 'Eén röntgenbundel: de huid waar de bundel binnenkomt krijgt <strong>{n}%</strong>, meer dan de tumor, en de bundel gaat door het hele lichaam heen.',
    photonMany: 'Meerdere röntgenbundels: de piek in gezond weefsel is lager, want de bundels tellen alleen bij de tumor op. Maar een groter deel van het lichaam krijgt een beetje.',
  },

  // ---------------------------------------------------------------- de tumor
  tumour: {
    art: 'Een stukje weefsel onder de microscoop. Lichtroze cellen met een kleine paarse kern zijn gezond. Een groepje donkerdere cellen met grotere kernen in het midden zijn afwijkende cellen die zich hebben opgehoopt tot een tumor.',
    immune: 'Afweersysteem',
    weak: 'zwak',
    medium: 'matig',
    strong: 'sterk',
    run: 'Laat de tijd verstrijken',
    pause: 'Pauze',
    restart: 'Opnieuw beginnen',
    day: '<strong>Dag {n}.</strong> Afwijkende cellen: <strong>{cells}</strong>.',
    spread: 'Uitgezaaid naar andere plekken: <strong>{n}</strong>.',
    cleared: 'Het afweersysteem heeft ze allemaal opgeruimd.',
    overrun: 'De tumor heeft dit stukje weefsel overgenomen.',
    grows: 'Met dit afweersysteem groeit de tumor.',
    shrinks: 'Met dit afweersysteem krimpt de tumor.',
  },

  // ---------------------------------------------------------------- de cel
  phases: [
    { name: 'groeit', words: 'enige schade' },
    { name: 'haar DNA kopieert', words: 'weinig schade' },
    { name: 'zich klaarmaakt om te delen', words: 'behoorlijk wat schade' },
    { name: 'zich deelt', words: 'veel schade' },
  ],
  cell: {
    art: 'Eén cel onder de microscoop, met een ring eromheen die de stappen van de celcyclus laat zien. Een markering loopt rond de ring. In de deelfase maakt de kern plaats voor chromosomen die in het midden op een rij staan.',
    cycle: 'Celcyclus',
    play: 'Afspelen',
    pause: 'Pauze',
    fire: 'Bestralen',
    logLabel: 'Je laatste bestralingen',
    note: 'De schadeniveaus zijn een idee, geen exacte getallen.',
    levels: { most: 'het meest', lot: 'veel', some: 'iets', little: 'weinig' },
    fired: 'Bestraald in de <strong>{label}</strong>-fase, terwijl de cel {name}: <strong>{words}</strong>.',
    start: 'Druk op Bestralen op het moment dat jij kiest.',
  },

  // ---------------------------------------------------------------- het DNA
  dna: {
    art: 'Een stukje DNA: twee gedraaide strengen met gekleurde sporten ertussen, getekend op een donkerblauwe achtergrond. Stralen raken het en breken de strengen op sommige plekken, en de breuken herstellen langzaam.',
    kindGroup: 'Soort cel',
    healthy: 'Gezonde cel',
    tumour: 'Tumorcel',
    radiate: 'Bestralen',
    reset: 'Opnieuw',
    breaks: 'Breuken op dit moment',
    breaksOf: '{n} van {limit}',
    startHealthy: 'Een <strong>gezonde</strong> cel. Druk op Bestralen om stralen op het DNA te richten.',
    startTumour: 'Een <strong>tumorcel</strong>. Druk op Bestralen om stralen op het DNA te richten.',
    dead: '<strong>Te veel schade tegelijk.</strong> De cel kan zichzelf niet meer repareren en gaat dood.',
    broken: [
      '<strong>{n}</strong> breuk in het DNA. De cel begint die te herstellen.',
      '<strong>{n}</strong> breuken in het DNA. De cel begint ze te herstellen.',
    ],
    mended: '<strong>Alles hersteld.</strong> De cel heeft elke breuk gerepareerd ({n} in totaal).',
    left: [
      'Nog <strong>{n}</strong> breuk over. <strong>{m}</strong> tot nu toe hersteld.',
      'Nog <strong>{n}</strong> breuken over. <strong>{m}</strong> tot nu toe hersteld.',
    ],
  },

  // ---------------------------------------------------------------- het atoom
  rayKinds: [
    {
      id: 'alpha',
      label: 'Alfa',
      use: 'Alfastraling komt nauwelijks vooruit. Ze werkt alleen van binnenuit, bijvoorbeeld radium-223 bij kanker die is uitgezaaid naar de botten.',
    },
    {
      id: 'beta',
      label: 'Bèta',
      use: 'Bètastraling gaat door de huid, maar dun metaal houdt haar tegen. Ze wordt van binnenuit gebruikt, bijvoorbeeld jodium-131 bij schildklierkanker.',
    },
    {
      id: 'gamma',
      label: 'Gamma en röntgen',
      use: 'Gammastraling en röntgenstraling komen veel verder. Ze worden het meest gebruikt bij bestraling, van buiten het lichaam en van binnenuit.',
    },
  ],
  walls: [
    { id: 'paper', label: 'Papier', name: 'papier' },
    { id: 'metal', label: 'Aluminium, 1 cm', name: 'aluminium van 1 cm' },
    { id: 'concrete', label: 'Dik beton of lood', name: 'dik beton of lood' },
  ],
  rays: {
    art: 'Een atoom, getekend met een klompje protonen en neutronen in het midden en elektronen eromheen. Een straal verlaat het atoom richting een wand aan de rechterkant. Afhankelijk van de soort straling en de wand wordt de straal tegengehouden of gaat hij erdoorheen.',
    scale: 'niet op schaal',
    kindGroup: 'Soort straling',
    wallGroup: 'Afscherming',
    send: 'Stuur een straal',
    start: 'Kies een soort straling en een afscherming en stuur dan de straal.',
    stopped: '<strong>Tegengehouden</strong> door {wall}.',
    weaker: 'Gaat door {wall} heen, maar <strong>zwakker</strong>.',
    through: 'Gaat <strong>dwars door</strong> {wall} heen.',
  },

  // ---------------------------------------------------------------- de weken
  weeks: {
    art: 'Een schaaltje met cellen. Donkerpaarse tumorcellen zitten in het midden en lichte gezonde cellen eromheen. Cellen die bijna gaan delen hebben een gele ring. Naarmate de dagen van de behandeling voorbijgaan, verdwijnen er tumorcellen.',
    sessions: 'Bestralingen',
    plan: ['{n} keer {dose} Gy', '{n} keer {dose} Gy'],
    tumourLeft: 'Tumorcellen over',
    healthyLeft: 'Gezonde cellen over',
    start: 'Start',
    reset: 'Opnieuw',
    pause: 'Pauze',
    again: 'Nog een keer',
    ready: [
      'Dezelfde <strong>{total} Gy</strong> in {n} bestraling. Gele ringen zijn cellen die bijna gaan delen. Druk op Start.',
      'Dezelfde <strong>{total} Gy</strong> in {n} bestralingen. Gele ringen zijn cellen die bijna gaan delen. Druk op Start.',
    ],
    day: '<strong>Dag {d}.</strong> Tumorcellen: <strong>{t}</strong>. Gezonde cellen: <strong>{h}</strong>.',
    result: '<strong>Na {d} dagen.</strong> Gezond weefsel zakte op het laagst naar <strong>{low}%</strong> en eindigde op <strong>{hp}%</strong>. {verdict}',
    verdictGone: 'De tumor is weg en het meeste gezonde weefsel is in orde.',
    verdictCost: 'De tumor is weg, maar veel gezond weefsel ook. Als je de dosis over meer bestralingen verdeelt, blijft daarvan meer gespaard.',
    verdictLeft: ['{n} tumorcel heeft het overleefd.', '{n} tumorcellen hebben het overleefd.'],
  },

  // ---------------------------------------------------------------- de patiënt
  areas: [
    { id: 'head', label: 'Hoofd en hals', complaints: 'Een droge mond, heesheid, smaakverlies en slikklachten.' },
    { id: 'chest', label: 'Borstkas', complaints: 'Slikklachten, een droge hoest en kortademigheid.' },
    { id: 'belly', label: 'Buik en bekken', complaints: 'Darm- en blaasklachten, en misselijkheid.' },
  ],
  everyone: 'Vermoeidheid en huidreacties komen het meest voor. In het bestraalde gebied kan haar uitvallen.',
  lastSession: 'Sommige patiënten vertelden dat het team bij de laatste bestraling slingers rond het apparaat ophing. Zulke kleine dingen hielpen.',
  person: {
    art: 'Een patiënt die in een lichte kamer staat. Op het lichaam zijn drie ronde gebieden aangegeven: hoofd en hals, borstkas, en buik en bekken. Eén ervan licht op om te laten zien waar de behandeling is.',
    group: 'Bestraald gebied',
    all: 'Iedereen.',
    last: 'De laatste bestraling',
  },

  // ---------------------------------------------------------------- de balk bovenaan
  hud: {
    across: 'breedte van het beeld',
    routeLabel: 'Scènes',
    goTo: 'Ga naar scène {i}: {title}',
    // Samen gelezen: Leesweergave en Zoomweergave. Op een telefoon staat alleen het eerste deel.
    plain: ['Lees', 'weergave'],
    zoomView: ['Zoom', 'weergave'],
    soundOn: 'Geluid aan',
    soundOff: 'Geluid uit',
    sceneOf: 'Scène {i} van {n}: {title}',
    hint: 'Scroll om in te zoomen',
    readMore: 'Lees verder',
    showLess: 'Minder tonen',
    decimal: ',',
  },

  // ---------------------------------------------------------------- het einde van de pagina
  takeaways: [
    'Straling beschadigt het DNA van tumorcellen. Als de schade te groot is, kan de cel zichzelf niet meer repareren en zich niet meer delen.',
    'Bundels uit veel hoeken tellen bij de tumor op, terwijl gezond weefsel minder krijgt. Protonen stoppen bij de tumor, en röntgenstraling gaat er helemaal doorheen.',
    'De dosis wordt verdeeld over veel bestralingen. Gezonde cellen herstellen zich ertussen beter dan tumorcellen, en elke bestraling treft de delende cellen het hardst.',
    'Verschillende soorten straling doen verschillend werk. Röntgen- en gammastraling werken van buiten, alfa- en bètastraling van bronnen die in het lichaam worden geplaatst.',
    'De behandeling doet geen pijn en duurt een paar minuten. Vermoeidheid en huidreacties komen het meest voor, de rest hangt af van het deel van het lichaam.',
  ],

  sources: [
    { label: 'IKNL: 135.000 nieuwe kankerdiagnoses in 2025', url: 'https://iknl.nl/nieuws/2026/wereldkankerdag-2026', for: 'Hoeveel mensen in Nederland in 2025 de diagnose kanker kregen.' },
    { label: 'KWF: 1 op de 2 Nederlanders krijgt kanker', url: 'https://www.kwf.nl/nieuws/1-op-de-2-nederlanders-krijgt-kanker', for: 'De kans op kanker in een mensenleven.' },
    { label: 'RIVM: straling en radioactiviteit uitgelegd', url: 'https://www.rivm.nl/straling-en-radioactiviteit/uitleg', for: 'Ioniserende straling, en alfa-, bèta- en gammastraling.' },
    { label: 'natuurkunde.nl: protonentherapie', url: 'https://www.natuurkunde.nl/artikelen/3457/protonentherapie', for: 'Het verschil tussen protonen en fotonen.' },
    { label: 'UMCG Radiotherapie: toelichtingskaart over de keuze tussen protonen en fotonen', url: 'https://www.umcgradiotherapie.nl/nieuws/toelichtingskaart-totstandkoming-keuze-protonen-versus-fotonen', for: 'Hoe de keuze tussen protonen en fotonen wordt gemaakt.' },
    { label: 'Radiotherapy and Oncology: toegang tot protonentherapie in Nederland (Engels)', url: 'https://www.thegreenjournal.com/article/S0167-8140(22)04584-4/fulltext', for: 'De drie protonencentra in Nederland.' },
    { label: 'Cancer Network: principles of radiation therapy (Engels)', url: 'https://www.cancernetwork.com/view/principles-radiation-therapy', for: 'Hoe een linac röntgenstraling maakt en de bundel met metalen lamellen vormgeeft.' },
    { label: 'kanker.nl: uitwendige bestraling (radiotherapie)', url: 'https://www.kanker.nl/soorten-behandelingen/bestraling/de-behandeling-met-bestraling/uitwendige-bestraling-radiotherapie', for: 'Hoe een bestraling gaat, dat het een paar minuten duurt en geen pijn doet.' },
    { label: 'UMC Utrecht: folder over de MR-linac', url: 'https://www.umcutrecht.nl/nl/behandeling/mr-linac/folder', for: 'Wat een MR-linac is.' },
    { label: 'Elekta: eerste patiënt behandeld met de Unity in het UMC Utrecht (Engels)', url: 'https://ir.elekta.com/investors/press-releases/2018/first-patient-treated-with-ce-marked-elekta-unity-at-university-medical-center-utrecht/', for: 'De eerste MR-linacpatiënten in Utrecht: 2017 in een studie, 2018 met het goedgekeurde apparaat.' },
    { label: 'kanker.nl: inwendige bestraling (brachytherapie)', url: 'https://www.kanker.nl/soorten-behandelingen/bestraling/de-behandeling-met-bestraling/inwendige-bestraling-brachytherapie', for: 'Bronnen, buisjes en zaadjes in het lichaam.' },
    { label: 'UMCG: inwendige bestraling', url: 'https://www.umcg.nl/-/inwendige-bestraling', for: 'Behandeling van binnenuit.' },
    { label: 'Health Physics Society: na een implantatie van jodium-125-zaadjes (Engels)', url: 'https://hps.org/publicinformation/ate/q10518/', for: 'Hoe de zaadjes in maanden uitwerken en waar je op moet letten.' },
    { label: 'PubMed: de rol van de celcyclus bij de gevoeligheid voor radiotherapie (Engels)', url: 'https://pubmed.ncbi.nlm.nih.gov/15234026/', for: 'Cellen zijn het gevoeligst in de M-fase en de late G2-fase.' },
    { label: 'Radiopaedia: fractionering bij radiotherapie (Engels)', url: 'https://radiopaedia.org/articles/fractionation-radiation-therapy', for: 'Waarom de dosis wordt verdeeld, en gangbare doses per dag.' },
    { label: 'PMC: radium-223 bij prostaatkanker die naar het bot is uitgezaaid (Engels)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4467240/', for: 'Radium-223, een alfastraler die in het lichaam wordt gebruikt.' },
    { label: 'PubMed: alfa- en bètastralers in de nucleaire geneeskunde (Engels)', url: 'https://pubmed.ncbi.nlm.nih.gov/41828508/', for: 'Bètastralers zoals jodium-131 en lutetium-177 in gebruik.' },
    { label: 'kanker.nl: gevolgen van bestraling', url: 'https://www.kanker.nl/soorten-behandelingen/bestraling/gevolgen/gevolgen-van-bestraling-radiotherapie', for: 'Vermoeidheid, huidreacties en andere gevolgen.' },
    { label: 'Amsterdam UMC: kanker in het hoofd-halsgebied en bestraling', url: 'https://www.amsterdamumc.nl/nl/patienteninformatie/kanker-in-het-hoofd-halsgebied-en-bestraling.htm', for: 'Droge mond, haaruitval, huid- en slikproblemen in het hoofd-halsgebied.' },
    { label: 'Amsterdam UMC: longkanker en bestraling', url: 'https://amsterdamumc.nl/nl/patienteninformatie/longkanker-en-bestraling-radiotherapie.htm', for: 'Hoest, kortademigheid en slikproblemen na bestraling van de borstkas.' },
    { label: 'Radboudumc: bijwerkingen van bestraling bij endeldarmkanker', url: 'https://www.radboudumc.nl/patientenzorg/behandelingen/bestraling-endeldarm-voor-een-operatie/bijwerkingen', for: 'Darm- en blaasklachten en misselijkheid na bestraling van het bekken.' },
  ],
};
