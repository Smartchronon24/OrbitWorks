# AI Architecture Boundary

This directory defines the architectural boundary for future AI integration in Orbit Works.

## Principles

- **Canonical Content**: AI must use the website's canonical content (e.g., `src/data`, `src/content/projects`). Do not maintain a separate AI-specific database.
- **Provider Agnostic**: UI components must not be directly coupled to a specific AI provider (like Cloudflare Workers AI).
- **No Hallucinations**: Future AI implementations must strictly answer based on provided portfolio content and state when information is missing.

## Future Architecture

```text
Canonical Portfolio Content
            ↓
      AI Context Builder
            ↓
       AI Provider
            ↓
   Cloudflare Worker
            ↓
      Workers AI
```

Do not implement the backend in Phase 0.