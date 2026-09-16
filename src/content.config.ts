import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    // ── Required ──────────────────────────────────────────────
    title: z.string(),
    shortDescription: z.string(),

    // ── Classification ────────────────────────────────────────
    // status: 'active' | 'completed' | 'experimental' | 'archived'
    status: z.string().optional(),
    dates: z.string().optional(),
    featured: z.boolean().default(false),
    // Controls sort order on /projects and prev/next navigation.
    // Lower numbers appear first. Unset items sort to the end.
    order: z.number().optional(),

    // ── Technology ────────────────────────────────────────────
    technologies: z.array(z.string()).default([]),

    // ── Structured architecture flow (for CSS flow diagrams) ──
    // Each item is a step label. Rendered top-to-bottom with connectors.
    // Example: ["Email Ingestion", "Microsoft Graph API", "LLM Pipeline", "MySQL"]
    archFlow: z.array(z.string()).optional(),

    // ── External links ────────────────────────────────────────
    // Key = display label, value = URL
    // Example: { "GitHub": "https://github.com/...", "Demo": "https://..." }
    links: z.record(z.string()).optional(),

    // ── Visual evidence / Images ──────────────────────────────
    // Optional paths to images in /public/ (e.g. "/images/projects/jarvis/arch.png")
    heroImage: z.string().optional(),
    diagramImage: z.string().optional(),

    // ── Case-study structured fields (all optional) ───────────
    // These may be short strings or multi-sentence paragraphs.
    // Long-form content should live in the Markdown body below the frontmatter.
    overview: z.string().optional(),
    problem: z.string().optional(),
    whatWasBuilt: z.string().optional(),
    architecture: z.string().optional(),
    implementationDetails: z.string().optional(),
    challenges: z.string().optional(),
    decisions: z.string().optional(),
    tradeoffs: z.string().optional(),
    results: z.string().optional(),
    metrics: z.string().optional(),
    futureWork: z.string().optional(),
  }),
});

export const collections = { projects };