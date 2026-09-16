# Orbit Works Content Guide

## Architecture Overview

Content and data are strictly separated from presentation.

```
src/data/         → Structured TypeScript data (profile, experience, journey, skills, education, certifications)
src/content/      → Project case studies (Markdown)
src/components/   → Reusable UI components
src/layouts/      → Page layout templates
src/pages/        → Route pages (consume data + components)
public/images/    → Static assets (screenshots, diagrams)
public/resume.pdf → Canonical PDF resume
```

---

## Deployment

The site is a static Astro build. No server is required.

**Supported hosts:** Netlify, Cloudflare Pages, GitHub Pages.

**Build command:** `npm run build` → publishes `dist/`

Netlify is pre-configured via `netlify.toml` in the project root. For Cloudflare Pages, set Build command: `npm run build`, Output directory: `dist`.

---

## Current Content Status

### Resume PDF
`public/resume.pdf` **must be replaced** with the real PDF before going live. The current placeholder is 23 bytes and not a valid PDF. The resume page architecture is correct — only the file needs to be swapped.

### Projects currently in `src/content/projects/`
| Slug | Title | Order |
|---|---|---|
| `jarvis` | Jarvis Personal AI Assistant | 1 |
| `invoice-processing` | Invoice Image Processing | 2 |
| `adaptive-email` | Adaptive AI Email Orchestration | 3 |
| `smart-cane` | Smart Cane | 4 |
| `linkedin-job-scraper` | LinkedIn Job Scraper | 5 |
| `ecg-arrhythmia` | ECG Data Processing for Arrhythmia Detection | 6 |

Projects **not yet created** (ClaimEazy, Crop Health, Swim-Lap Counter): do not link to these slugs until their content files exist. They will produce 404 errors.

---

## Where Things Live

| Content | File |
|---|---|
| Profile (name, bio, tagline) | `src/data/profile.ts` |
| Experience & Project Links | `src/data/experience.ts` |
| Engineering journey nodes | `src/data/journey.ts` |
| Skills (grouped categories) | `src/data/skills.ts` |
| Education | `src/data/education.ts` |
| Certifications | `src/data/certifications.ts` |
| Site metadata | `src/data/site.ts` |
| Project case studies | `src/content/projects/*.md` |
| Project images | `public/images/projects/` |

---

## How to Add a New Project

1. Create `src/content/projects/my-project.md`
2. Fill in the required frontmatter fields (see schema below)
3. Optionally add images to `public/images/projects/`
4. Run `npm run dev` — the route `/projects/my-project` is generated automatically
5. Verify the page at `http://localhost:4321/projects/my-project`

**No new `.astro` page is needed.** The dynamic route `src/pages/projects/[slug].astro` handles all projects automatically.

---

## How to Update the Resume

The canonical resume is a PDF file.

1. Create or update your resume PDF.
2. Replace the file at `public/resume.pdf`.
3. Update any relevant structured data (e.g., `src/data/experience.ts` or `src/data/certifications.ts`) if factual information has changed.
4. Run `npm run build` and deploy.

**Do not build automatic resume parsing or a resume generator.** The website data is the canonical source for website content, and the PDF is an output artifact.

---

## Data Structures for Supporting Pages

### Experience (`src/data/experience.ts`)
Experience entries can optionally link to project case studies using the `relatedProjects` array.
```ts
{
  company: 'Company Name',
  role: 'Role',
  dates: '2024 — Present',
  description: '...',
  tags: ['Tag 1', 'Tag 2'],
  relatedProjects: [
    { label: 'Project Name', slug: 'project-slug' } // Slug must match the project MD filename
  ]
}
```

### Skills (`src/data/skills.ts`)
Skills are grouped by category for readability on the About page.
```ts
{
  category: 'AI / ML',
  items: ['Python', 'TensorFlow']
}
```

### Education (`src/data/education.ts`)
```ts
{
  institution: 'University Name',
  degree: 'Degree Name',
  dates: 'Graduated 2025',
  details: ['CGPA 7.17'] // Optional bullet points
}
```

### Certifications (`src/data/certifications.ts`)
Grouped similarly to skills.
```ts
{
  category: 'Cloud',
  items: [
    { name: 'AZ-900', issuer: 'Microsoft' }
  ]
}
```

---

## Project Frontmatter Schema

```yaml
---
# ── Required ──────────────────────────────────────────────────────────────────
title: "Project Title"
shortDescription: "One sentence. Used on cards, lists, and metadata."

# ── Classification ─────────────────────────────────────────────────────────────
status: "Active"        # active | completed | experimental | archived
dates: "2024 — 2025"   # Free text. Omit if unknown.
featured: true          # Show on homepage Selected Work section
order: 1                # Sort position on /projects. Lower = appears first.
                        # Omit for projects that don't need specific ordering.

# ── Technologies ───────────────────────────────────────────────────────────────
technologies:           # Factual only. Omit if genuinely unknown.
  - "Python"
  - "EasyOCR"
  - "LLMs"

# ── Architecture flow (generates a CSS flow diagram on the project page) ───────
# Each string is one node in the top-to-bottom flow.
# Omit this key entirely if the project does not have a meaningful flow.
archFlow:
  - "Input Stage"
  - "Processing Layer"
  - "Output"

# ── External links ─────────────────────────────────────────────────────────────
links:                  # Key = display label, value = URL. Omit if none.
  GitHub: "https://github.com/..."
  Demo: "https://demo.example.com"

# ── Case-study structured fields (all optional) ────────────────────────────────
# Use these for concise single-paragraph content.
# For longer narratives, write them in the Markdown body below the frontmatter.
overview: >
  What is this project and why does it exist?

problem: >
  What problem did this solve? What motivated it?

whatWasBuilt: >
  What was actually built? What does it do?

architecture: >
  Prose description of the architecture. Used alongside archFlow if both present.

implementationDetails: >
  Technical implementation details, algorithms, data flow choices.

challenges: >
  Engineering difficulties encountered and how they were addressed.

decisions: >
  Key technical decisions, alternatives considered.

tradeoffs: >
  Trade-offs accepted; what was gained and at what cost.

results: >
  Measurable outcomes. Only include if factual and verifiable.

metrics: |
  Accuracy: 98.56%      ← Multi-line monospace block for metrics.
  Items matched: 27/27

futureWork: >
  Planned or experimental next steps. Clearly distinguish from completed features.
---
```

---

## Status Values

| Value | Meaning |
|---|---|
| `active` | Currently being built or actively maintained |
| `completed` | Finished; no ongoing development |
| `experimental` | In exploration; not production-ready |
| `archived` | No longer maintained |

Status is displayed as a small badge on the project page and list. On the `/projects` list, `active` projects receive a highlighted badge.

---

## Technologies Rule

**Do not invent technologies.**

If you do not know what technologies a project used, omit the `technologies` field. The UI will display nothing rather than fabricate a list. Never add generic placeholder technologies.

---

## Architecture Flow

The `archFlow` field generates a clean top-to-bottom CSS flow diagram on the project page. Each string in the array becomes one labelled node, connected by arrows.

Use it when a project has a meaningful data flow or processing pipeline. Omit it for projects where a flow diagram would be artificial (e.g., a simple script or a UI-only project).

---

## Metrics

Only include `metrics` when the values are factual and verifiable. Never manufacture:
- percentages
- user counts
- performance benchmarks
- business impact figures

If a metric exists and is real, include it. If it does not exist, omit the `metrics` field entirely.

---

## Long-Form Content

The Markdown body below the frontmatter (`---`) is for long-form prose. This is rendered as the final section of the project page after all structured fields.

Use it for:
- Additional context that doesn't fit in a short paragraph
- Experimental branches and rejected approaches
- Technical depth for specific subsystems
- Caveats and clarifications

---

## Project Images

Place images in `public/images/projects/` and reference them in the Markdown body:

```markdown
![Architecture diagram](/images/projects/my-project/architecture.png)
```

Images are optional. If no meaningful visual asset exists, omit it — the typography and architecture diagram are sufficient.

---

## Completed vs Experimental vs Future Work

When documenting Jarvis or other active projects, clearly distinguish:

```
Completed  → working features in the current build
Experimental → tested but not retained or not production-ready
Future / Planned → not built yet; only intended direction
```

Never present planned features as completed. Never present experimental branches as production features.

---

## AI Content Rules

Future AI functionality will consume this canonical content. Do NOT:
- Create duplicate AI-specific fact files
- Hardcode portfolio facts inside UI components
- Duplicate project information between content files and data files

---

## Rules for Future Coding Agents (DO NOT TOUCH)

Future AI coding agents working on this project MUST strictly follow these boundaries:

1. **DO NOT** redesign the Quiet Space background or particle system.
2. **DO NOT** create an admin panel, CMS, or database.
3. **DO NOT** add a backend (Cloudflare Workers, Express, Node server, etc.) unless requested in a dedicated backend phase.
4. **DO NOT** duplicate project layouts or create individual `.astro` pages for projects (`src/pages/projects/[slug].astro` handles all projects automatically).
5. **DO NOT** build a PDF resume parser or generator.
6. **DO NOT** migrate frameworks (keep Astro + TypeScript + CSS).
7. **DO NOT** introduce unnecessary dependencies (Three.js, GSAP, React, etc.).
8. **DO NOT** perform Git operations (`git init`, `git commit`, `git push`, remote edits).
9. **DO NOT** fabricate project facts, metrics, employers, or links.

---

## Image & Visual Evidence Conventions

Store all static project images under `public/images/projects/<slug>/`.

### Schema Image Fields
Projects support two optional frontmatter image fields in `src/content.config.ts`:

- `heroImage`: Featured screenshot/visual rendered below header (`/images/projects/jarvis/hero.png`)
- `diagramImage`: Architecture or workflow diagram rendered under the Architecture section (`/images/projects/jarvis/architecture.png`)

```yaml
---
title: "Project Title"
heroImage: "/images/projects/my-project/hero.png"
diagramImage: "/images/projects/my-project/arch.png"
---
```

If images are not provided, the page automatically renders without empty image placeholders.
