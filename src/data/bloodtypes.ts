// Everything the "How blood types are inherited" page says, in one place.
// A family tree with three things to try: a Punnett square for two parents, which blood groups a child can have, and a family of children
// drawn by chance. The inheritance of the ABO groups and the history come from the sources. The families are drawn from fixed seeds.
// Not medical advice: the page is about how a gene is passed on, and says nothing about transfusion or health.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Two copies of one gene, one from each parent',
  paras: [
    'Your ABO blood group is set by a single gene, which comes in three versions, or alleles, called A, B and O. You have two copies, one from each parent. The A and B versions both show: a person with one of each is group AB. The O version is hidden by either of the others, so a person is group O only with two copies of O. Group A can be AA or AO, and group B can be BB or BO.',
    'Three branches to try. Fill in a square for two parents and see the chances for a child. Pick two blood groups and see which groups a child can have, and which are impossible. And draw a family of children by chance. This is about how a gene is passed on. It says nothing about health, transfusion or what anyone should do. Without a script each branch shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'square',
    kicker: 'First branch',
    title: 'A square for two parents',
    paras: [
      'A parent passes on one of their two copies, each with an even chance. Write one parent’s two copies along the top and the other’s down the side. Each cell of the square is one possible child, and the four cells are equally likely. This is called a Punnett square.',
      'Pick the two genotypes. The page fills in the square and adds up the chances of each genotype and each blood group in a child. A parent with two of the same copy, such as AA, can only pass on that copy, so the square has two matching columns.',
    ],
    tags: [
      { label: 'History', text: 'Karl Landsteiner discovered the ABO groups around 1900 or 1901, sources differ, and won the Nobel Prize in Physiology or Medicine in 1930. Felix Bernstein showed in 1924 how they are inherited.' },
    ],
  },
  {
    id: 'possible',
    kicker: 'Second branch',
    title: 'Which groups can a child have',
    paras: [
      'You usually see only a person’s blood group, not their two copies. A group A parent may be AA or AO, and a group B parent BB or BO, so what a child can have depends on what is hidden. The page tries every pair of genotypes the parents could have and lists the groups that are possible, with the lowest and highest chance.',
      'Pick two groups. Some results are surprising. Two parents of group A or B can have a group O child if both are carrying a hidden O. A group AB parent can never have a group O child, and two group O parents can only have group O children.',
    ],
  },
  {
    id: 'family',
    kicker: 'Third branch',
    title: 'A family by chance',
    paras: [
      'Each child gets a copy from each parent by chance, and the children do not influence each other. A child with a one in four chance of a group is not guaranteed to have one in four of the children in a group. In a small family the counts can be far from the chances.',
      'Pick two genotypes and a number of children. The page draws the family from a fixed seed, and counts the blood groups. Press the button for another family from the same parents.',
    ],
  },
];

export const takeaways = [
  'The ABO group comes from one gene with three versions, A, B and O. A child gets one copy from each parent.',
  'A and B both show, and O is hidden by either. Only OO gives group O. Group A is AA or AO, and group B is BB or BO.',
  'Each of the four cells of a Punnett square is equally likely.',
  'A group AB parent can never have a group O child. Two group O parents can only have group O children.',
  'Chances are not counts. In a small family the groups of the children can be far from the chances.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. One gene with three alleles (A, B and O), A and B both showing, O showing only as OO, the genotypes AA and AO for group A and BB and BO for group B, a child receiving one allele from each parent, Landsteiner’s discovery of the groups and his Nobel Prize in 1930, and Bernstein’s work on the inheritance in 1924 each appeared in at least two places. Sources give 1900 or 1901 for the discovery. The Rh factor was looked for and the search did not confirm how it is inherited or when it was found, so the page leaves it out, and leaves out how common each group is, which differs from place to place. The chances in the squares and the lists of possible groups are computed on the page by trying every pair of genotypes. The families are drawn from fixed seeds. Nothing here is medical advice.';

export const sources = [
  { label: 'Wikipedia: ABO blood group system', url: 'https://en.wikipedia.org/wiki/ABO_blood_group_system', for: 'Alleles, genotypes and history.' },
  { label: 'World Council for Blood Services (South Africa): inheritance of the ABO groups', url: 'https://wcbs.org.za/?p=18930', for: 'How the groups are inherited.' },
  { label: 'Biology Dictionary: blood type heredity', url: 'https://biologydictionary.net/?p=4112', for: 'Genotypes and groups.' },
  { label: 'Vinmec: ABO blood group', url: 'https://vinmec.com/eng/article/abo-blood-group-en', for: 'The ABO groups.' },
  { label: 'Cavacopedia: ABO blood group system', url: 'https://cavac.at/cavacopedia/ABO%20blood%20group%20system', for: 'The history of the ABO groups.' },
  { label: 'Wikipedia mirror: ABO blood group system', url: 'https://ipfs.ssi.eecc.de/ipns/en.wikipedia-on-ipfs.org/wiki/ABO_blood_group_system', for: 'Codominance of A and B.' },
  { label: 'MDWiki: ABO blood group system', url: 'https://kiwix.lema.org/mdwiki_en_all_2024-03/A/ABO', for: 'Landsteiner and the Nobel Prize.' },
  { label: 'LabCE: ABO groups and frequencies', url: 'https://labce.com/spg2474534_abo_groups_and_frequencies.aspx', for: 'The ABO groups.' },
];
