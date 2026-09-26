import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { discoverKnowledgeChunks, projectRoot } from './knowledge-lib.mjs';

const endpoint = process.env.KNOWLEDGE_INGEST_URL || 'http://127.0.0.1:8787/api/knowledge/ingest';
const token = process.env.KNOWLEDGE_INGEST_TOKEN;
const manifestPath = path.join(projectRoot, '.knowledge-vectorize-manifest.json');
const batchSize = 16;

if (!token) {
  throw new Error('Set KNOWLEDGE_INGEST_TOKEN before running knowledge:ingest.');
}

const readManifest = async () => {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch {
    return { vectorIds: [] };
  }
};

const request = async (payload) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Ingestion failed (${response.status}): ${text}`);
  return JSON.parse(text);
};

const { files, chunks } = await discoverKnowledgeChunks();
const previous = await readManifest();
const currentIds = new Set(chunks.map((chunk) => chunk.id));
const staleIds = (previous.vectorIds || []).filter((id) => !currentIds.has(id));
let upserted = 0;

for (let index = 0; index < chunks.length; index += batchSize) {
  const batch = chunks.slice(index, index + batchSize);
  const result = await request({
    chunks: batch,
    deleteIds: index + batchSize >= chunks.length ? staleIds : []
  });
  upserted += result.upserted || 0;
  console.log(`Processed ${Math.min(index + batch.length, chunks.length)} / ${chunks.length} chunks`);
}

await writeFile(
  manifestPath,
  `${JSON.stringify({ vectorIds: [...currentIds], sourceCount: files.length, chunkCount: chunks.length }, null, 2)}\n`,
  'utf8'
);

console.log(`Knowledge files: ${files.length}`);
console.log(`Chunks discovered: ${chunks.length}`);
console.log(`Vectors upserted: ${upserted}`);
console.log(`Stale vectors deleted: ${staleIds.length}`);
