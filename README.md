# Pokemon Card Locator

A web app for finding places to buy Pokemon trading cards, starting with a map-first MVP.

## Current status

The repo now includes a Next.js-style TypeScript bootstrap with:

- App Router pages for `/` and `/map`
- Stubbed API routes for `GET /api/stores` and `POST /api/reports`
- Shared types and Zod validation
- Environment variable scaffolding in `.env.example`
- Initial UI components for search, map preview, and store cards

## Project structure

```text
.
|-- README.md
|-- db/
|   `-- schema.sql
|-- docs/
|   |-- PROJECT_STRUCTURE.md
|   `-- WEEK1_PLAN.md
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |-- map/
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- components/
|   |   |-- map/
|   |   |-- search/
|   |   `-- store/
|   |-- lib/
|   `-- types/
|-- package.json
|-- tsconfig.json
`-- next.config.ts
```

## Local setup

This machine did not have `node` or `npm` available during bootstrap, so dependencies were not installed yet.

Once Node.js is installed, run:

```bash
npm install
npm run dev
```

Then create `.env.local` from `.env.example` and fill in:

```env
DATABASE_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
MAP_PROVIDER=mapbox
```

## Next build step

After dependencies are installed, the next implementation target should be:

1. Wire the real database client.
2. Replace the stubbed `GET /api/stores` response with a PostGIS nearby-stores query.
3. Connect the `/map` page to live API data instead of mock stores.

See:

- `docs/PROJECT_STRUCTURE.md` for the recommended language/stack and folder layout.
- `db/schema.sql` for the initial PostgreSQL + PostGIS schema.
- `docs/WEEK1_PLAN.md` for the week-one build order.
