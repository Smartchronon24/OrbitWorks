# Orbit Works

Orbit Works is the technical portfolio of **Navaneth Anand**: a static Astro site for presenting engineering work, experiments, project case studies, experience, education, certifications, and technical interests.

> “I build things, experiment deeply, and understand how the systems underneath them work.”

The site is intentionally content-driven. Portfolio facts live in typed data files and Markdown case studies; Astro components and layouts provide the presentation layer.

## What the site contains

- **Home** — concise introduction and current work.
- **About** — profile, engineering journey, skills, education, certifications, and interests.
- **Work** — ordered project index with status labels and case-study links.
- **Project pages** — reusable technical case-study layout with architecture flows, snapshot cards, implementation details, decisions, results, and future work.
- **Experience** — professional history with links to related projects.
- **Resume** — resume page and canonical PDF asset.
- **OrbitWorks-AI** — persistent portfolio chat workspace powered by a Cloudflare Worker, Workers AI, and Vectorize.

## Technology

- [Astro](https://astro.build/) 7 — static site generation and routing
- TypeScript — configuration, structured portfolio data, and type checking
- Astro Content Collections — validated Markdown project content
- Cloudflare Workers AI and Vectorize — grounded AI responses and portfolio knowledge retrieval
- HTML and scoped CSS — responsive presentation without a UI framework
- Node.js and npm — local development and production builds
- Netlify configuration included for static deployment

The portfolio pages are statically generated. The optional AI workspace uses a Cloudflare Worker backend; no database, CMS, external UI library, or animation framework is required for the site itself.

## Requirements

- Node.js `>=22.12.0` (see `package.json`)
- npm

Install dependencies after cloning:

```bash
npm install
```

## Development

Start the Astro development server:

```bash
npm run dev
```

The site is normally available at `http://localhost:4321`.

For the repository's preferred background-server workflow:

```bash
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

Other available scripts:

```bash
npm run build      # Generate the production site in dist/
npm run preview    # Preview the generated production build locally
npm run astro      # Run the Astro CLI directly
npm run worker:dev # Run the Cloudflare Worker locally
```

## OrbitWorks-AI setup

The AI workspace calls a Cloudflare Worker. For local development, run `npm run worker:dev` alongside `npm run dev`; the Astro dev server proxies `/api/*` to the local Worker at `127.0.0.1:8787`. To use a different endpoint, copy `.env.example` to `.env` and set `PUBLIC_AI_API_URL`; the local environment file is ignored by Git. GitHub Pages builds read this URL from the repository Actions variable named `PUBLIC_AI_API_URL`. Set it in **Settings → Secrets and variables → Actions → Variables** to the public chat endpoint, including `/api/chat` (for example, `https://<worker>.<account>.workers.dev/api/chat`). It is a public endpoint, not a credential. The Pages workflow stops with an error if the variable is missing, rather than publishing a site whose chat silently points to a nonexistent GitHub Pages API.

The Worker is configured in `wrangler.jsonc` and uses Workers AI plus the `orbitworks-knowledge` Vectorize index. For local development, copy `.dev.vars.example` to `.dev.vars` and set a private `KNOWLEDGE_INGEST_TOKEN`; `.dev.vars` is ignored. Run the Worker with:

```bash
npm run worker:dev
```

The private `knowledge/` directory contains source material used to build the retrieval index and is intentionally excluded from Git. The Node-based ingestion and query utilities also need `KNOWLEDGE_INGEST_TOKEN` in the current shell environment. Set the ingestion token as a Cloudflare Worker secret (for example, with `npx wrangler secret put KNOWLEDGE_INGEST_TOKEN`) and use the matching value locally when running the scripts. Do not put this token in `PUBLIC_AI_API_URL`, frontend code, or a GitHub Pages build variable. With the Worker running and the token configured, maintain the index or inspect retrieval with:

```bash
export KNOWLEDGE_INGEST_TOKEN="<your-local-token>"
npm run knowledge:ingest
npm run knowledge:query -- "What is the architecture of Invoice Processing?"
```

In PowerShell, set it for the current terminal with `$env:KNOWLEDGE_INGEST_TOKEN = "<your-local-token>"`.

Ingestion updates Vectorize and uses the local `.knowledge-vectorize-manifest.json` to identify stale vectors. Keep access tokens, `.env` files, Worker secrets, and private knowledge sources out of commits. Example configuration files contain placeholders only.

## Production build

Build the complete static site before deployment:

```bash
npm run build
```

Astro writes the generated site to `dist/`. The build generates routes for all pages and Markdown project entries, validates the content collection, and reports content/type/build errors.

Preview the generated output with:

```bash
npm run preview
```

## Repository structure

```text
.
├── public/
│   ├── images/                 # Static certificates, illustrations, and project assets
│   └── resume.pdf              # Canonical resume PDF
├── src/
│   ├── ai/                     # AI integration architecture notes
│   ├── components/             # Reusable page, shell, project, and primitive components
│   ├── content/
│   │   └── projects/           # Markdown case studies; one file becomes one project route
│   ├── data/                   # Canonical typed site data
│   ├── layouts/                # Shared BaseLayout and ProjectLayout
│   ├── pages/                  # Astro routes
│   ├── scripts/                # Small client-side scripts/utilities
│   ├── styles/                 # Global design tokens and site styles
│   └── content.config.ts       # Astro Content Collection schema
├── CONTENT_GUIDE.md            # Detailed content authoring rules
├── astro.config.mjs            # Astro/Vite configuration
├── netlify.toml                # Netlify build and publish settings
├── wrangler.jsonc              # Cloudflare Worker and AI bindings
├── cloudflare/                 # Worker API and retrieval implementation
├── scripts/                    # Knowledge ingestion and query utilities
├── package.json                # Scripts and dependencies
└── tsconfig.json               # TypeScript configuration
```

## Routes

The main routes are:

| Route | Source | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Home page |
| `/about` | `src/pages/about.astro` | About and background |
| `/projects` | `src/pages/projects/index.astro` | Ordered project index |
| `/projects/:slug` | `src/pages/projects/[slug].astro` | Generated project case study |
| `/experience` | `src/pages/experience.astro` | Work experience |
| `/resume` | `src/pages/resume.astro` | Resume page |
| `/ai` | `src/pages/ai.astro` | OrbitWorks-AI workspace entry page |

Project detail routes are generated automatically from files in `src/content/projects/`. Do not create an individual Astro page for each project.

## Content architecture

Content and presentation are deliberately separate:

| Content | Canonical file/location |
|---|---|
| Profile and biography | `src/data/profile.ts` |
| Experience and related project links | `src/data/experience.ts` |
| Engineering journey | `src/data/journey.ts` |
| Skills | `src/data/skills.ts` |
| Education | `src/data/education.ts` |
| Certifications | `src/data/certifications.ts` |
| Site metadata | `src/data/site.ts` |
| Project case studies | `src/content/projects/*.md` |
| Images and static files | `public/images/` |

The project collection schema is defined in `src/content.config.ts`. Project pages consume the collection through the dynamic route and render it with `src/layouts/ProjectLayout.astro`.

## Adding or editing a project

Create a Markdown file whose filename becomes the URL slug:

```text
src/content/projects/my-project.md
→ /projects/my-project
```

At minimum, provide:

```yaml
---
title: "Project title"
shortDescription: "One concise sentence used in cards and page metadata."
---
```

Useful optional fields include:

```yaml
status: "Active"
dates: "2025 — Present"
featured: true
order: 1
technologies:
  - "Python"
  - "Astro"
archFlow:
  - "Input"
  - "Processing"
  - "Output"
heroImage: "/images/projects/my-project/hero.png"
diagramImage: "/images/projects/my-project/architecture.png"
links:
  GitHub: "https://github.com/example/project"
overview: >
  What the project is and why it exists.
problem: >
  The problem being addressed.
whatWasBuilt: >
  The verified implementation.
architecture: >
  How the system components interact.
implementationDetails: >
  Important technical details.
challenges: >
  Real engineering difficulties and resolutions.
decisions: >
  Important technical decisions.
tradeoffs: >
  Accepted constraints and trade-offs.
results: >
  Factual outcome without invented claims.
metrics: |
  Only verified measurements go here.
futureWork: >
  Planned, experimental, or incomplete work.
---
```

Use the Markdown body after the frontmatter for deeper explanations that do not belong in a single structured field. Keep claims factual: do not invent metrics, production deployment, authentication methods, integrations, or capabilities.

Projects are ordered by the numeric `order` field. Lower values appear first on `/projects` and determine previous/next project navigation. `featured` controls featured-project selection where used.

For the full schema, status meanings, architecture-flow rules, metrics guidance, and authoring conventions, read [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md).

## Updating supporting content

- Replace `public/resume.pdf` with the real resume PDF when updating the resume.
- To refresh the HTML resume, attach your latest resume PDF in the chat and ask for the resume page to be updated. The PDF is the source of truth: update `src/data/resume.ts` with its verified content, replace `public/resume.pdf`, then build and check `/resume`.
- Resume-specific experience, personal projects, certifications, languages, and activities are maintained in `src/data/resume.ts`. Education and technical skills are shared with the rest of the site through `src/data/education.ts` and `src/data/skills.ts`.
- Edit `src/data/experience.ts` for roles, descriptions, tags, dates, and related project slugs.
- Edit `src/data/education.ts`, `src/data/certifications.ts`, and `src/data/skills.ts` for About-page content.
- Add static images under `public/images/` and reference them with root-relative paths such as `/images/projects/example/hero.png`.
- Prefer existing components and data structures over hard-coded project-specific content in global layouts.

## Images and evidence

Use real project screenshots, diagrams, or other verified evidence when available. If no real visual exists, use a restrained data-driven flow or architecture representation rather than fabricating a screenshot, dashboard, chart, or metric. Keep image files in `public/images/` and optimize large assets before adding them.

## Accessibility and responsive behavior

Project pages are designed to work across mobile and desktop widths. Essential information must not depend on hover. When adding interactive behavior:

- preserve semantic HTML and meaningful labels;
- support keyboard focus and touch interaction;
- maintain readable contrast;
- respect `prefers-reduced-motion`;
- make diagrams stack or scroll safely on narrow screens;
- avoid animation that communicates information without a static equivalent.

## Deployment

This is a static site; no server process or database is needed in production.

Netlify is configured in `netlify.toml`:

```toml
[build]
command = "npm run build"
publish = "dist"
```

For other static hosts, use:

- Build command: `npm run build`
- Output directory: `dist`

The supported deployment model is compatible with Netlify, Cloudflare Pages, and GitHub Pages. Confirm the host's Node version matches the project requirement before building.

## AI architecture

`src/ai/` documents the frontend integration boundary. The active assistant retrieves relevant material on the server and streams a grounded response:

```text
Canonical Portfolio Content
            ↓
  Cloudflare Worker
            ↓
 Workers AI Embeddings
            ↓
 Cloudflare Vectorize
            ↓
 Context Assembly and Streaming Generation
```

The chat frontend and `/api/chat` Worker preserve streaming and Markdown responses. The browser stores the latest 10 chat messages in local storage and sends them as follow-up context; use **New chat** to clear them. Retrieval and knowledge files remain server-side; there is no live connection to external profile or email services. See [`src/ai/README.md`](./src/ai/README.md) for the integration boundary.

## Validation checklist

Before publishing content or layout changes:

1. Run `npm run build`.
2. Check the affected route at desktop and mobile widths.
3. Verify project links and image paths.
4. Confirm Markdown frontmatter matches `src/content.config.ts`.
5. Check that factual claims and metrics are supported by the project.
6. Test reduced-motion and keyboard-relevant interactions when changing UI behavior.

## Git and contribution boundary

Git and GitHub operations are user-controlled in this project. Automated agents must not initialize Git, create commits, or push to remotes. Keep changes focused, avoid unrelated redesigns, and update content through the canonical data/content locations.
