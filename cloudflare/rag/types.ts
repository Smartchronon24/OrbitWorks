export const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';
export const DEFAULT_TOP_K = 5;

export type MetadataValue = string | number | boolean | undefined;

export interface KnowledgeMetadataBase {
  id: string;
  source: string;
  domain: string;
  level: string;
  section: string;
  project?: string;
  parent?: string;
  chunk_index: number;
  title: string;
  [key: string]: MetadataValue;
}

export interface KnowledgeMetadata extends KnowledgeMetadataBase {
  text: string;
}

export interface KnowledgeChunk {
  id: string;
  text: string;
  metadata: KnowledgeMetadataBase;
}

export interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

export interface VectorizeMatch {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface VectorizeResult {
  matches?: VectorizeMatch[];
}

export interface VectorizeBinding {
  query(
    vector: number[],
    options: { topK: number; returnMetadata: 'all'; filter?: Record<string, unknown> }
  ): Promise<VectorizeResult>;
  upsert(
    vectors: Array<{
      id: string;
      values: number[];
      metadata: KnowledgeMetadata;
    }>
  ): Promise<unknown>;
  delete(ids: string[]): Promise<unknown>;
}
