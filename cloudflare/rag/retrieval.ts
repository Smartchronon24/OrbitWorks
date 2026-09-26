import { embedTexts } from './embeddings';
import { DEFAULT_TOP_K, type AiBinding, type VectorizeBinding, type VectorizeMatch } from './types';

export interface RetrievedKnowledge {
  id: string;
  score: number;
  text: string;
  source: string;
  domain: string;
  level: string;
  section: string;
  project?: string;
  parent?: string;
  chunk_index?: number;
  title?: string;
}

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

const projectAliases: Array<[string, string[]]> = [
  ['invoice-processing', ['invoice processing', 'invoice image processing', 'invoice extraction']],
  ['adaptive-email', ['adaptive ai email', 'adaptive email', 'email orchestration', 'email automation']],
  ['jarvismcp', ['jarvismcp', 'jarvis pa', 'jarvis']],
  ['claimeazy', ['claimeazy', 'claim eazy']],
  ['plant-disease-prediction', ['crop health', 'crop disease', 'plant disease']],
  ['webscraping', ['linkedin job scraper', 'job scraper', 'web scraping']],
  ['other-projects', ['smart cane']]
];

const getRetrievalFilter = (query: string): Record<string, unknown> | undefined => {
  const normalized = query.toLowerCase();
  const project = projectAliases.find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  )?.[0];
  if (project) return { project };

  if (
    /\b(what|which)\s+projects\b/i.test(query) ||
    /\bprojects\s+(has|did)\b/i.test(query)
  ) {
    return { domain: 'resume' };
  }

  return undefined;
};

const mapMatch = (match: VectorizeMatch): RetrievedKnowledge | null => {
  const metadata = match.metadata || {};
  const text = asString(metadata.text);
  const source = asString(metadata.source);
  const domain = asString(metadata.domain);
  const level = asString(metadata.level);
  const section = asString(metadata.section);

  if (!text || !source || !domain || !level || !section) return null;

  return {
    id: match.id,
    score: match.score,
    text,
    source,
    domain,
    level,
    section,
    project: asString(metadata.project),
    parent: asString(metadata.parent),
    chunk_index: typeof metadata.chunk_index === 'number' ? metadata.chunk_index : undefined,
    title: asString(metadata.title)
  };
};

export const retrieveKnowledge = async (
  ai: AiBinding,
  vectorize: VectorizeBinding,
  query: string,
  topK = DEFAULT_TOP_K
): Promise<RetrievedKnowledge[]> => {
  const [embedding] = await embedTexts(ai, [query]);
  const filter = getRetrievalFilter(query);
  const result = await vectorize.query(embedding, {
    topK: filter ? Math.max(topK * 2, 10) : topK,
    returnMetadata: 'all'
  });

  const matches = (result.matches || [])
    .map(mapMatch)
    .filter((match): match is RetrievedKnowledge => Boolean(match));

  if (!filter) return matches.slice(0, topK);

  const scopedMatches = matches.filter((match) =>
    Object.entries(filter).every(([key, value]) => match[key as keyof RetrievedKnowledge] === value)
  );

  return (scopedMatches.length ? scopedMatches : matches).slice(0, topK);
};
