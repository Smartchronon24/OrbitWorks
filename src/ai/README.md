# AI Architecture Boundary

This directory defines the architectural boundary for the Orbit Works AI integration.

## Principles

- **Canonical Content**: The server-side `knowledge/` directory is the source of truth for the portfolio assistant's retrieval layer. It is kept separate from frontend assets.
- **Provider Agnostic**: UI components must not be directly coupled to a specific AI provider (like Cloudflare Workers AI).
- **No Hallucinations**: Future AI implementations must strictly answer based on provided portfolio content and state when information is missing.
- **Server-side retrieval**: Embeddings, Vectorize queries, and retrieved knowledge remain inside the Worker.

## Current Architecture

```text
Browser
  ↓
Cloudflare Worker /api/chat
  ↓
Workers AI embedding
  ↓
Cloudflare Vectorize
  ↓
Grounded context assembly
  ↓
Workers AI streaming generation
  ↓
Browser
```

Knowledge ingestion is performed with `npm run knowledge:ingest` against the protected Worker ingestion route. Retrieval can be inspected independently with `npm run knowledge:query -- "question"`.

For local Worker use, copy `.dev.vars.example` to `.dev.vars`, set the token, and run `npm run worker:dev`. The ingestion and query scripts use the local Worker by default:

```powershell
$env:KNOWLEDGE_INGEST_TOKEN = "your-local-token"
npm run knowledge:ingest
npm run knowledge:query -- "What is the architecture of Invoice Processing?"
```

To use a deployed Worker, set `KNOWLEDGE_INGEST_URL` or `KNOWLEDGE_QUERY_URL` to the corresponding protected endpoint. The ingestion script stores a local deterministic manifest so removed chunks can be pruned on later runs.