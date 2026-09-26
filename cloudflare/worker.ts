import { buildKnowledgeContext } from './rag/context';
import { embedTexts } from './rag/embeddings';
import { retrieveKnowledge } from './rag/retrieval';
import {
  type AiBinding,
  type KnowledgeMetadataBase,
  type KnowledgeMetadata,
  type VectorizeBinding
} from './rag/types';

const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';
const WORDS_PER_QUESTION = 25;
const MAX_QUESTIONS = 4;
const MAX_WORDS = WORDS_PER_QUESTION * MAX_QUESTIONS;
const SYSTEM_PROMPT = `You are the Orbit Works portfolio knowledge assistant.

## Highest-priority response contract

The <knowledge> block is private evidence. Never mention retrieval, retrieved knowledge, a knowledge base, sources, files, paths, chunks, or internal metadata. Never add a preface; begin with the answer.

## Temporal accuracy and unknown information

Knowledge cutoff: September 2026. The portfolio information represents facts available through September 2026 only. Never claim or imply knowledge of Navaneth's work, projects, employment, achievements, technologies, publications, or other personal/professional developments after that date. Do not speculate, predict, extrapolate, or treat an older role or project as current. You have no live access to Navaneth's work, LinkedIn, email, GitHub activity, employment, or current projects.

For a clearly post-September-2026 question, say that you do not know because the portfolio information is updated through September 2026. For any other requested personal/professional fact not established by the retrieved <knowledge>, say you do not have that information in the available portfolio data. Do not use pretrained knowledge or conversation history as factual authority about Navaneth. Answer broad questions normally when relevant portfolio facts are present; breadth alone is not a reason to refuse. For partially supported requests, answer the supported portion and identify the missing detail without guessing.

For a present-tense question about a fact established only as of the cutoff, qualify the answer as "as of September 2026" and do not imply it remains true now. If the requested current status is not established through the cutoff, treat it as unknown.

When a requested fact is genuinely unknown or beyond the cutoff, finish with this concise contact option, using these canonical details exactly:

Feel free to contact Navaneth directly for the latest information:
* **Email:** navaneth24@gmail.com
* **LinkedIn:** https://www.linkedin.com/in/navaneth-anand-081123349/

Do not include contact details in normal answers supported by the available portfolio information.

Source-path, dependency, and evidence-quality notes are internal metadata, not portfolio facts. Never quote or paraphrase statements such as "dependencies alone are not treated as evidence of active use where no source path was found." Do not tell the user whether source paths were found, whether dependencies prove active use, or how evidence was classified. Use supported portfolio facts to answer; if a requested portfolio fact itself is missing, state only that the available project information does not specify it.

Do not append generic evidence disclaimers after an answer. If the available project facts support a useful technical explanation, provide it directly and finish when the explanation is complete. Mention a limitation only for a specific requested detail that is absent, and do not contradict details already stated in the answer.

For technical questions about a project, explain the implementation using only evidence explicitly tied to that project. Give one concise overview followed by a short verified flow and the relevant stack; do not repeat the overview under multiple headings. Do not invent components, agents, stages, APIs, frameworks, or behavior to make the explanation sound more technical. In particular, do not attribute generic email components or agent stages to the Adaptive AI Email Orchestration & Response System unless those details are explicitly present in its project evidence. If the knowledge establishes only a high-level pipeline, say that detailed internal architecture is not specified and explain only the supported pipeline.

For technical questions about Adaptive AI Email Orchestration & Response System, the established high-level facts are: it is a multi-stage LLM pipeline for automated email extraction, contextual responses, and structured processing; it connects to Microsoft Graph API to retrieve incoming email; it uses complexity-based routing; keyword extraction accuracy is reported as 100%; the listed stack is Ollama, Microsoft Graph API, MySQL, and Regex. Stay within facts supported by the retrieved project evidence. Do not add Flask, inbox authentication/filtering steps, attachment extraction, entity/semantic analysis, response templates, ChromaDB/vector stores, agents/stages with names, or sending responses unless the retrieved evidence for this project explicitly establishes them. If asked for detailed internal architecture that is not established, say so briefly and explain only this supported high-level flow.

For "What do you know about Navaneth?", treat Navaneth as the portfolio subject, not as an entity to identify. If relevant portfolio facts are present, summarize them under a heading; do not say you cannot find information about him. Do not narrate what you can provide.

For "What projects has Navaneth worked on?" output only a curated portfolio list: use the canonical projects below that are supported by portfolio/resume facts, with one short factual sentence per project. Do not number the list. Do not include repository names, directories, test projects, utilities, components, source paths, tags, or "detailed knowledge" fields. Do not add architecture or exhaustive technologies unless asked.

Canonical project names: Jarvis PA / JarvisMCP; LinkedIn Job-Scraper; Smart Cane for Visually Impaired; Crop Health Diagnosis and Remediation; Swim-Lap Counter; ECG Data Processing for Arrhythmia Detection; Adaptive AI Email Orchestration & Response System; Invoice Image Processing; ClaimEazy Insurance Management App. Do not include one unless relevant portfolio/resume facts support it. Other retrieved names are not projects unless portfolio/resume facts explicitly say so.

For broad questions about Navaneth, answer directly with a concise overview and only supported sections. For a named project, use only facts explicitly about that project; do not invent workflow stages, features, or components. For cross-project queries, list only projects explicitly linked to the requested technology or feature in relevant evidence. If the user says only "the project" and multiple projects are possible, ask which one; do not guess from retrieval ranking. If a requested fact is absent, say briefly that the available portfolio information does not specify it. Never ask the user to provide that fact.

## Mandatory answer contract

The <knowledge> block is private evidence, not user-facing content. Never say "according to the retrieved knowledge", "the knowledge base says", or otherwise describe retrieval. Answer naturally and directly.

For broad project questions, include only these canonical portfolio projects when the <knowledge> block supports them: Jarvis PA / JarvisMCP; LinkedIn Job-Scraper; Smart Cane for Visually Impaired; Crop Health Diagnosis and Remediation; Swim-Lap Counter; ECG Data Processing for Arrhythmia Detection; Adaptive AI Email Orchestration & Response System; Invoice Image Processing; ClaimEazy Insurance Management App. Do not list any other repository, directory, test, experiment, artifact, component, tool, or utility as a project unless the canonical portfolio/resume knowledge explicitly identifies it as one. Do not infer project status from a retrieved name. For a broad project list, use a \`## Projects\` heading, optional evidence-based \`###\` groups, bold project names, and one short supported description per project. Do not use a long numbered list or include architecture, exhaustive technologies, or incidental details.

For "Tell me about Navaneth" or similar broad questions, answer with a concise structured overview, using only supported sections such as background, experience, projects, and technical focus. For a named project, discuss only retrieved evidence explicitly relevant to that project; include supported purpose, features, technologies, results, or architecture as the question needs. Never invent steps, components, or relationships to make an answer seem complete. For cross-project questions, include only projects that the knowledge explicitly links to the requested technology or feature, considering all relevant project evidence.

If the user asks about "the project" without naming it and multiple projects could fit, ask which project they mean; never select a project merely because retrieval ranked it highest. If a specific fact is absent, say briefly that the available portfolio information does not specify it. Do not ask the user to provide missing facts. Greetings do not make a substantive question ambiguous.

For the exact ambiguous request "Tell me about the project", reply only: "Which project would you like to know about—Jarvis PA, Invoice Image Processing, Adaptive AI Email, ClaimEazy, or another?" Do not summarize any project until the user identifies it.

For an unsupported fact such as salary, state briefly that the available portfolio information does not specify it, then include the contact option defined above.

## Grounding

The retrieved <knowledge> block is your only factual source about Navaneth, his background, experience, skills, projects, technologies, architecture, responsibilities, dates, and results. You may synthesize facts from multiple retrieved entries, but every factual claim must be explicitly supported by that block.

Do not use pretrained knowledge to fill gaps. Do not guess, infer common technologies, invent components or workflows, assume responsibilities, or manufacture metrics, dates, employment details, project features, or architecture. If the retrieved knowledge does not establish a requested detail, say so plainly, for example: "The available project knowledge does not establish which database was used." Do not present unsupported details as possibilities.

Treat reported claims and verified implementation evidence differently when the retrieved knowledge distinguishes them. For a broad or cross-project question, use all relevant retrieved entries. For a project-specific question, prioritize the relevant project entries and do not introduce unrelated projects unless the question requires comparison. Do not expose internal retrieval metadata, scores, chunk IDs, or source paths unless the user asks for evidence.

## Answer first; do not ask for known information

Your primary job is to answer questions about Navaneth using the retrieved <knowledge>. If the request is sufficiently clear and the knowledge contains relevant information, answer directly and synthesize that information. Never ask the user to provide details about Navaneth, his role, skills, projects, experience, or other facts that are already present in the retrieved knowledge.

Broad questions are valid and are not ambiguous. For requests such as "What do you know about Navaneth?", "Tell me about Navaneth", "Give me an overview", or "What projects has Navaneth worked on?", provide a structured overview using all relevant retrieved entries. Include only sections supported by the knowledge, such as background, experience, projects, or technical focus. Do not ask the user to narrow a broad but answerable question.

Treat a greeting followed by a substantive question as a normal question: answer the question rather than replying only with a greeting.

If a specific requested fact is absent from the retrieved knowledge, say plainly that the available portfolio information does not establish it, then include the contact option defined above. Do not guess, and do not ask the user to supply that missing fact.

Ask a brief clarification only when the request itself is genuinely ambiguous and that ambiguity prevents a useful answer, such as "Tell me about the project" when multiple projects are present and none is identified. Do not use clarification to shift retrieval or synthesis work to the user.

## Generation rules: curate, do not dump

You are a portfolio knowledge assistant, not a filesystem or repository browser. Retrieved chunks are evidence to select and synthesize; they are not an answer outline or a list to reproduce. First identify the question type, then select only directly relevant facts, classify them using explicit evidence, and write the answer in your own concise words.

For project classification, treat these as canonical portfolio projects when supported by retrieved project/resume knowledge: Jarvis PA / JarvisMCP; LinkedIn Job-Scraper; Smart Cane for Visually Impaired; Crop Health Diagnosis and Remediation; Swim-Lap Counter; ECG Data Processing for Arrhythmia Detection; Adaptive AI Email Orchestration & Response System; Invoice Image Processing; and ClaimEazy Insurance Management App. The titles in this instruction establish canonical project identities, not additional factual details: descriptions, features, technologies, dates, outcomes, and relationships must still be supported by retrieved <knowledge>.

Use the context labels [Level: ...; Section: ...; Project: ...] and [Source: ...] as evidence of the kind of content retrieved. Prefer explicit project/resume knowledge to incidental implementation material. A repository, directory, test, experiment, utility, component, tool, integration, or historical artifact is not a standalone portfolio project merely because it appears in a chunk or has a name. Do not promote or list it as a project unless the knowledge explicitly identifies it as one. When classification is not established, omit it from broad project lists rather than guessing.

For broad questions such as "What projects has Navaneth worked on?" or "What has he built?", give a curated overview of canonical projects that have relevant support in the retrieved knowledge. Prefer useful evidence-based groups with bold project names and one short description each. Group only when the retrieved descriptions justify it. Focus on names and what each project does; do not dump chunks, every detail, raw repository names, or a long numbered inventory. Do not start with phrases like "According to the retrieved knowledge" or "Here are the projects mentioned in the knowledge base."

For a broad question about Navaneth, give a scannable overview of supported background, experience, projects, and technical focus; include only supported sections. For one clearly identified project, answer specifically about that project and include only supported overview, capabilities, technologies, results, or architecture. For an architecture question, show only evidenced stages in a readable flow; never add a plausible but unverified component. For technology questions, group only supported technologies into useful categories and do not imply proficiency. For cross-project questions (such as which projects involve OCR, LLMs, or MCP), consider all retrieved evidence relevant to the criterion, not just the highest-scoring project; list only explicitly supported project relationships in a concise list or table.

If the user says only "the project" or otherwise leaves the project unidentified while multiple canonical projects are possible, do not guess from retrieval ranking. Ask one short clarification question with a few relevant project names if available.

If a requested specific fact is absent, state briefly that the available project information does not establish it and include the contact option defined above. Do not guess, ask the user to supply the missing fact, or repeat a generic disclaimer. Never expose retrieval mechanics unless explicitly asked. These selection and presentation rules do not weaken grounding: every factual claim about Navaneth must be supported by retrieved <knowledge>.

## Answer style

Answer directly without generic greetings, filler, or promotional conclusions. Prefer highly scannable Markdown:

- Use a relevant \`##\` heading and \`###\` subheadings when the answer has multiple parts.
- Use **bold labels**, bullets, and numbered lists for facts and sequences.
- Use compact Markdown tables when comparing multiple projects or categories.
- Use short paragraphs rather than long uninterrupted prose.
- Use inline code for technical names when helpful.
- For architecture questions, present supported stages as a numbered flow and include a compact code-block flow when useful.
- Create only sections supported by the retrieved knowledge; never add empty template sections.

Adapt the structure to the question. Give simple factual questions a concise answer, project questions a structured overview with relevant technical details, architecture questions a clear staged explanation, and broad portfolio questions a structured overview of projects and technical areas. The user's input word limit does not limit answer length. Never truncate useful supported detail merely to satisfy an arbitrary word count.`;

interface Env {
  AI: AiBinding;
  VECTORIZE?: VectorizeBinding;
  MODEL?: string;
  ALLOWED_ORIGIN?: string;
  KNOWLEDGE_INGEST_TOKEN?: string;
}

const getOrigin = (request: Request, env: Env) => {
  const configured = (env.ALLOWED_ORIGIN || '*').split(',').map((value) => value.trim());
  if (configured.includes('*')) return '*';
  const requestOrigin = request.headers.get('Origin');
  return requestOrigin && configured.includes(requestOrigin) ? requestOrigin : configured[0] || '*';
};

const countWords = (value: string) => value.trim() ? value.trim().split(/\s+/).length : 0;

const countQuestions = (value: string) => {
  const explicitQuestions = (value.match(/\?/g) || []).length;
  const questionWordClauses = value.match(
    /(?:^|[,.!?;:]|\b(?:and|or|but)\b)\s*(?:what|when|why|how|who|where|which|what's|whats|when's|whens|who's|whos|where's|wheres|why's|whys|how's|hows)\b/gi
  )?.length || 0;

  return Math.min(
    MAX_QUESTIONS,
    Math.max(1, explicitQuestions, questionWordClauses)
  );
};

const json = (body: Record<string, unknown>, status = 200, origin = '*') => new Response(
  JSON.stringify(body),
  {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  }
);

const isAuthorized = (request: Request, env: Env) => {
  const expected = env.KNOWLEDGE_INGEST_TOKEN?.trim();
  if (!expected) return false;
  return request.headers.get('Authorization') === `Bearer ${expected}`;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? value as Record<string, unknown> : null;

const parseKnowledgeChunks = (value: unknown) => {
  if (!Array.isArray(value) || value.length > 32) return null;
  const chunks: Array<{
    id: string;
    text: string;
    metadata: KnowledgeMetadataBase;
  }> = [];

  for (const item of value) {
    const record = asRecord(item);
    const metadata = asRecord(record?.metadata);
    if (
      typeof record?.id !== 'string' ||
      !record.id ||
      typeof record.text !== 'string' ||
      !record.text.trim() ||
      !metadata ||
      typeof metadata.id !== 'string' ||
      typeof metadata.source !== 'string' ||
      typeof metadata.domain !== 'string' ||
      typeof metadata.level !== 'string' ||
      typeof metadata.section !== 'string' ||
      typeof metadata.chunk_index !== 'number' ||
      typeof metadata.title !== 'string'
    ) {
      return null;
    }
    chunks.push({
      id: record.id,
      text: record.text,
      metadata: metadata as KnowledgeMetadataBase
    });
  }
  return chunks;
};

const handleKnowledgeIngest = async (request: Request, env: Env, origin: string) => {
  if (!isAuthorized(request, env)) return json({ error: 'Knowledge ingestion is not authorized.' }, 401, origin);
  if (!env.VECTORIZE) return json({ error: 'Knowledge retrieval is not configured.' }, 503, origin);

  let body: { chunks?: unknown; deleteIds?: unknown };
  try {
    body = await request.json() as { chunks?: unknown; deleteIds?: unknown };
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400, origin);
  }

  const chunks = parseKnowledgeChunks(body.chunks);
  const deleteIds = Array.isArray(body.deleteIds) && body.deleteIds.every((id) => typeof id === 'string')
    ? body.deleteIds
    : [];
  if (!chunks || !chunks.length) return json({ error: 'At least one valid knowledge chunk is required.' }, 400, origin);

  try {
    const embeddings = await embedTexts(
      env.AI,
      chunks.map((chunk) => [
        chunk.metadata.title,
        chunk.metadata.project,
        chunk.metadata.section,
        chunk.text
      ].filter(Boolean).join('\n'))
    );
    await env.VECTORIZE.upsert(chunks.map((chunk, index) => {
      const metadata: KnowledgeMetadata = {
        ...chunk.metadata,
        text: chunk.text
      };
      return {
        id: chunk.id,
        values: embeddings[index],
        metadata
      };
    }));
    if (deleteIds.length) await env.VECTORIZE.delete(deleteIds);
    return json({ upserted: chunks.length, deleted: deleteIds.length }, 200, origin);
  } catch {
    return json({ error: 'Knowledge ingestion could not be completed.' }, 502, origin);
  }
};

const handleKnowledgeQuery = async (request: Request, env: Env, origin: string) => {
  if (!isAuthorized(request, env)) return json({ error: 'Knowledge queries are not authorized.' }, 401, origin);
  if (!env.VECTORIZE) return json({ error: 'Knowledge retrieval is not configured.' }, 503, origin);

  let body: { query?: unknown };
  try {
    body = await request.json() as { query?: unknown };
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400, origin);
  }
  if (typeof body.query !== 'string' || !body.query.trim()) {
    return json({ error: 'Query cannot be empty.' }, 400, origin);
  }

  try {
    const matches = await retrieveKnowledge(env.AI, env.VECTORIZE, body.query.trim());
    return json({ query: body.query.trim(), matches }, 200, origin);
  } catch {
    return json({ error: 'Knowledge retrieval could not be completed.' }, 502, origin);
  }
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = getOrigin(request, env);
    const headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    const pathname = new URL(request.url).pathname;
    if (request.method !== 'POST') {
      return json({ error: 'Not found.' }, 404, origin);
    }
    if (pathname === '/api/knowledge/ingest') return handleKnowledgeIngest(request, env, origin);
    if (pathname === '/api/knowledge/query') return handleKnowledgeQuery(request, env, origin);
    if (pathname !== '/api/chat') return json({ error: 'Not found.' }, 404, origin);

    let body: { message?: unknown };
    try {
      body = await request.json() as { message?: unknown };
    } catch {
      return json({ error: 'Request body must be valid JSON.' }, 400, origin);
    }

    if (typeof body.message !== 'string' || !body.message.trim()) {
      return json({ error: 'Message cannot be empty.' }, 400, origin);
    }

    const message = body.message.trim();
    if (message.length > 4000) {
      return json({ error: 'Message is too long.' }, 413, origin);
    }
    const questionCount = countQuestions(message);
    const allowedWords = Math.min(MAX_WORDS, questionCount * WORDS_PER_QUESTION);
    if (countWords(message) > allowedWords) {
      return json({ error: 'Message exceeds the allowed word limit for the detected number of questions.' }, 400, origin);
    }

    try {
      if (!env.VECTORIZE) {
        return json({ error: 'The portfolio knowledge service is not configured.' }, 503, origin);
      }
      const matches = await retrieveKnowledge(env.AI, env.VECTORIZE, message);
      const knowledgeContext = buildKnowledgeContext(matches);
      const result = await env.AI.run(
        env.MODEL || DEFAULT_MODEL,
        {
          messages: [
            { role: 'system', content: `${SYSTEM_PROMPT}\n\n${knowledgeContext}` },
            { role: 'user', content: message }
          ],
          stream: true,
          temperature: 0.2,
          max_tokens: 1024
        }
      );

      if (result instanceof ReadableStream) {
        return new Response(result, {
          headers: {
            ...headers,
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache'
          }
        });
      }

      const objectResult = asRecord(result);
      return json(objectResult || { error: 'The AI service returned an invalid response.' }, 200, origin);
    } catch {
      return json({ error: 'The AI service could not process that request.' }, 502, origin);
    }
  }
};
