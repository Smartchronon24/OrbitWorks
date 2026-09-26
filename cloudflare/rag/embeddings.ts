import { EMBEDDING_MODEL, type AiBinding } from './types';

interface EmbeddingResponse {
  data?: unknown;
}

const isEmbeddingMatrix = (value: unknown): value is number[][] =>
  Array.isArray(value) &&
  value.every((row) => Array.isArray(row) && row.every((item) => typeof item === 'number'));

export const embedTexts = async (ai: AiBinding, texts: string[]): Promise<number[][]> => {
  if (!texts.length) return [];

  const result = await ai.run(EMBEDDING_MODEL, { text: texts }) as EmbeddingResponse;
  if (!isEmbeddingMatrix(result.data) || result.data.length !== texts.length) {
    throw new Error('Workers AI returned an invalid embedding response.');
  }

  return result.data;
};
