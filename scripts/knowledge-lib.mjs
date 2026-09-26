import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(scriptDirectory, '..');
export const knowledgeRoot = path.join(projectRoot, 'knowledge');
const MAX_CHUNK_CHARACTERS = 4200;

const scalar = (value) => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'null') return undefined;
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const parseFrontmatter = (document) => {
  const match = document.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { metadata: {}, body: document };
  const metadata = {};
  const frontmatter = match[1].split(/\r?\n/);
  for (const line of frontmatter) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const value = scalar(match[2]);
    if (value !== undefined && !value.startsWith('[')) metadata[match[1]] = value;
  }

  return {
    metadata,
    body: document.slice(match[0].length)
  };
};

const titleFromBody = (body, fallback) =>
  body.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;

const splitLargeBlock = (block) => {
  if (block.length <= MAX_CHUNK_CHARACTERS) return [block.trim()];
  const lines = block.split(/\r?\n/);
  const heading = lines[0].match(/^#{1,6}\s+/) ? lines[0] : '';
  const paragraphs = block.split(/\n{2,}/);
  const chunks = [];
  let current = heading;

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= MAX_CHUNK_CHARACTERS) {
      current = candidate;
      continue;
    }
    if (current.trim()) chunks.push(current.trim());
    current = paragraph;
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.flatMap((chunk) => {
    if (chunk.length <= MAX_CHUNK_CHARACTERS) return [chunk];
    const pieces = [];
    for (let start = 0; start < chunk.length; start += MAX_CHUNK_CHARACTERS) {
      pieces.push(chunk.slice(start, start + MAX_CHUNK_CHARACTERS).trim());
    }
    return pieces;
  });
};

const chunkBody = (body) => {
  if (body.trim().length <= MAX_CHUNK_CHARACTERS) return [body.trim()];

  const blocks = body
    .split(/(?=^#{1,6}\s+)/m)
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap(splitLargeBlock);

  const chunks = [];
  let current = '';
  for (const block of blocks) {
    const candidate = current ? `${current}\n\n${block}` : block;
    if (candidate.length <= MAX_CHUNK_CHARACTERS) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = block;
    }
  }
  if (current) chunks.push(current);
  return chunks;
};

const walkMarkdown = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkMarkdown(fullPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) files.push(fullPath);
  }
  return files;
};

const digest = (value) => createHash('sha256').update(value).digest('hex').slice(0, 24);

export const discoverKnowledgeChunks = async () => {
  const files = (await walkMarkdown(knowledgeRoot)).sort();
  const chunks = [];

  for (const filePath of files) {
    const document = await readFile(filePath, 'utf8');
    const { metadata, body } = parseFrontmatter(document);
    const relativePath = path.relative(projectRoot, filePath).split(path.sep).join('/');
    const relativeKnowledgePath = path.relative(knowledgeRoot, filePath).split(path.sep).join('/');
    const pathParts = relativeKnowledgePath.split('/');
    const inResumeContext = pathParts[0] === '00-resume-context';
    const project = metadata.project || (!inResumeContext && pathParts[0] === 'projects' ? pathParts[1] : undefined);
    const section = metadata.section || path.basename(filePath, '.md');
    const level = metadata.level || (section === 'overview' ? 'overview' : 'detail');
    const domain = metadata.domain || (inResumeContext ? 'resume' : 'project');
    const parent = metadata.parent || (project && section !== 'overview' ? `${project}-overview` : undefined);
    const title = titleFromBody(body, path.basename(filePath, '.md'));
    const baseId = metadata.id || `${project || domain}-${section}`;

    for (const [chunkIndex, text] of chunkBody(body).entries()) {
      const id = `kw-${digest(`${relativePath}:${chunkIndex}`)}`;
      chunks.push({
        id,
        text,
        metadata: {
          id: baseId,
          source: relativePath,
          domain,
          level,
          section,
          ...(project ? { project } : {}),
          ...(parent ? { parent } : {}),
          chunk_index: chunkIndex,
          title
        }
      });
    }
  }

  return { files, chunks };
};
