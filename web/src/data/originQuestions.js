import { siteText, displayText } from '../core/content/store';

const clanQuestionKeys = new Map([
  'brujah', 'gangrel', 'malkavian', 'nosferatu', 'toreador', 'tremere',
  'ventrue', 'lasombra', 'tzimisce', 'ravnos', 'setites', 'giovanni',
  'assamites', 'gargoyles', 'samedi', 'daughters_cacophony', 'baali', 'salubri',
].map(clan => [clan, `vampire.origin.${clan}.question2`]));

export function getOriginQuestionEntries(clan) {
  const clanQuestionKey = clanQuestionKeys.get(clan);
  return [
    { contentKey: 'vampire.text.00586' },
    clanQuestionKey
      ? { contentKey: clanQuestionKey }
      : { contentKey: 'vampire.text.02556', variables: { v0: displayText('vampire', 'votre héritage et vos choix personnels') } },
    { contentKey: 'vampire.text.00588' },
  ];
}

export function getOriginQuestions(clan) {
  return getOriginQuestionEntries(clan).map(({ contentKey, variables }) => siteText(contentKey, variables));
}
