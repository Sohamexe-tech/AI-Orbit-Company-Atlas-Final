# AI Company Atlas

A full-stack AI company discovery module built for the Module Design & Development task.

The experience uses **AI Orbit as the visual design reference**: dark surfaces, high-contrast typography,
compact controls, bordered cards, restrained accents and responsive directory patterns. The implementation
extends the supplied starter application with a dedicated Companies module rather than treating the task as a
single static page.

> **Project note:** this repository was developed from a supplied starter codebase and substantially extended
> for the Companies module. AI Orbit is used as the requested design reference.

## Module

- `/companies` — searchable and filterable company directory
- `/companies/[slug]` — company profile with company facts, links and related companies
- Loading, empty, error and not-found states
- Responsive card grid for desktop, tablet and mobile
- REST endpoints backed by Prisma/PostgreSQL

## Stack

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Prisma 6 + PostgreSQL
- Lucide icons

## Run locally

Requires Node 22, pnpm 10 and PostgreSQL (or the included Docker setup).

```bash
pnpm install
cp .env.example .env
# Configure DATABASE_URL, DIRECT_URL and AUTH_SECRET
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000/companies`.

## Companies API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/companies` | Search, filter and sort companies |
| GET | `/api/companies/:slug` | Company detail and related companies |

Examples:

```text
/api/companies?q=ai
/api/companies?industry=AI%20Infrastructure
/api/companies?sort=name
/api/companies/openai
```

## Main implementation files

```text
src/app/companies/page.tsx
src/app/companies/[slug]/page.tsx
src/components/companies/company-explorer.tsx
src/components/companies/company-card.tsx
src/app/api/companies/route.ts
src/app/api/companies/[slug]/route.ts
prisma/schema.prisma
prisma/seed.ts
```

## Verification

Before submission, run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The project includes the original Learn module as well, but `/` now opens the Companies module so the assigned
module is immediately demonstrable.
