import type { RetrievedKnowledge } from './retrieval';

const MAX_CONTEXT_CHARACTERS = 18000;

export const buildKnowledgeContext = (matches: RetrievedKnowledge[]): string => {
  if (!matches.length) {
    return '<knowledge>\nNo relevant portfolio knowledge was retrieved for this question.\n</knowledge>';
  }

  const entries: string[] = [];
  let totalCharacters = 0;

  for (const match of matches) {
    const entry = [
      `[Source: ${match.source}]`,
      `[Level: ${match.level}; Section: ${match.section}${match.project ? `; Project: ${match.project}` : ''}]`,
      match.text
    ].join('\n');

    if (totalCharacters + entry.length > MAX_CONTEXT_CHARACTERS && entries.length > 0) break;
    entries.push(entry);
    totalCharacters += entry.length;
  }

  return `<knowledge>\n${entries.join('\n\n')}\n</knowledge>`;
};
