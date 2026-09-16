---
title: "Adaptive AI Email Orchestration & Response System"
shortDescription: "A multi-stage LLM pipeline for automated email ingestion, contextual processing, and response generation."
status: "Completed"
dates: "2026"
featured: true
order: 3
technologies: ["Python", "Microsoft Graph API", "LLMs", "Ollama", "MySQL", "Regex"]
archFlow:
  - "Email Ingestion (Microsoft Graph API)"
  - "Preprocessing & Keyword Extraction"
  - "Complexity Router (Regex / LLM)"
  - "Contextual LLM Processing"
  - "MySQL Storage"
overview: >
  A pipeline for processing incoming emails, extracting structured information, routing based on complexity, and generating contextually appropriate responses using a multi-stage LLM architecture.
problem: >
  Email volumes at scale require automated handling for common patterns while preserving quality and context. Simple keyword routing is too brittle; pure LLM processing of every email is expensive and slow. The challenge was building a system that intelligently routes based on complexity, applies LLM reasoning only where it adds value, and generates coherent responses.
whatWasBuilt: >
  A multi-stage pipeline integrating Microsoft Graph API for email ingestion, a two-stage routing system combining Regex and LLM classification, contextual processing for each email category, LLM-based response generation, and MySQL for storage and audit. Ollama provides local LLM inference.
architecture: >
  Emails arrive via Microsoft Graph API. A preprocessing stage extracts keywords and metadata. A complexity router classifies the email — Regex handles deterministic patterns, the LLM handles ambiguous or complex content. The appropriate processing branch generates a contextual response. All records and responses are persisted to MySQL.
implementationDetails: >
  The routing layer was deliberately designed as a hybrid: Regex is used for high-confidence pattern matching (specific email types, formatting, keywords) because it is fast, deterministic, and auditable. The LLM is invoked only for emails where complexity exceeds what Regex can handle confidently. This keeps inference costs proportional to actual complexity. Ollama runs inference locally, avoiding external API dependencies.
decisions: >
  The Regex/LLM hybrid routing was the key architectural decision. A naive approach would route all emails through an LLM, which is both costly and latency-intensive. Using Regex as a first-pass filter ensures that high-volume, structurally consistent email patterns are handled efficiently, while the LLM is reserved for genuinely ambiguous content.
tradeoffs: >
  Local inference via Ollama removes API costs and keeps data on-premise, but constrains model selection to models that run efficiently on available hardware. Prompt design is more constrained than with hosted, larger models.
results: >
  Evaluated on a representative test set. The keyword extraction stage achieved 100% accuracy. Full pipeline accuracy across email categories is not yet published.
metrics: >
  Keyword extraction accuracy:   100%
---