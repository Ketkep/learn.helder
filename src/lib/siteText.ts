// The words around the topics: header, footer, the frame every topic page shares.
// What a topic itself says lives with the topic (for example src/data/radiation).
// "switchHere" is the text of the link that leads TO this language.

import type { Lang } from './text';

export interface SiteText {
  skip: string;
  homeLabel: string;
  otherSites: string;
  games: string;
  footer: string;
  ogAlt: string;
  ogLocale: string;
  allTopics: string;
  backToAll: string;
  stage: string;
  takeaways: string;
  takeawaysPending: string;
  sources: string;
  nextTopic: string;
  switchHere: string;
}

export const siteText: Record<Lang, SiteText> = {
  en: {
    skip: 'Skip to content',
    homeLabel: 'Helder Labs Learn, home',
    otherSites: 'Other Helder Labs sites',
    games: 'Games',
    footer: 'Set in Young Serif and Hanken Grotesk. No cookies, no tracking.',
    ogAlt: 'Helder Labs Learn, interactive explainers',
    ogLocale: 'en_GB',
    allTopics: 'All topics',
    backToAll: 'Back to all topics',
    stage: 'Interactive explainer',
    takeaways: 'Key takeaways',
    takeawaysPending: 'The takeaways will appear here when the explainer is ready.',
    sources: 'Sources',
    nextTopic: 'Next topic',
    switchHere: 'Read this page in English',
  },
  nl: {
    skip: 'Naar de inhoud',
    homeLabel: 'Helder Labs Learn, startpagina',
    otherSites: 'Andere sites van Helder Labs',
    games: 'Games',
    footer: 'Gezet in Young Serif en Hanken Grotesk. Geen cookies, geen tracking.',
    ogAlt: 'Helder Labs Learn, interactieve uitleg',
    ogLocale: 'nl_NL',
    // The home page and the other topics are English only, so the links say so
    allTopics: 'Alle onderwerpen (Engels)',
    backToAll: 'Terug naar alle onderwerpen (Engels)',
    stage: 'Interactieve uitleg',
    takeaways: 'De belangrijkste punten',
    takeawaysPending: 'De belangrijkste punten komen hier te staan als de uitleg klaar is.',
    sources: 'Bronnen',
    nextTopic: 'Volgend onderwerp',
    switchHere: 'Lees deze pagina in het Nederlands',
  },
};
