# Project Structure + Base Stack

## Recommended stack
- **Frontend:** Next.js + TypeScript
- **Map:** Mapbox GL JS
- **Backend:** Next.js route handlers (TypeScript)
- **Database:** PostgreSQL + PostGIS
- **Hosting:** Vercel + managed Postgres (Supabase/Neon)

## Why this stack
- One language (TypeScript) across frontend and backend.
- Fast MVP iteration with a single app deployment.
- PostGIS enables proper geo queries (`nearest stores`, `within radius`).

## Folder blueprint

```text
src/
├── app/
│   ├── page.tsx                 # Home + search UX
│   ├── map/page.tsx             # Map-focused view
│   └── api/
│       ├── stores/route.ts      # GET nearby stores
│       └── reports/route.ts     # POST stock reports
├── components/
│   ├── map/
│   │   ├── StoreMap.tsx
│   │   └── StoreMarker.tsx
│   ├── search/
│   │   └── LocationSearch.tsx
│   └── store/
│       ├── StoreCard.tsx
│       └── StoreDetailDrawer.tsx
├── lib/
│   ├── db.ts                    # DB client
│   ├── geo.ts                   # distance/radius helpers
│   ├── map.ts                   # map config and token handling
│   └── validation.ts            # zod schemas for API input
└── types/
    ├── store.ts
    └── report.ts
```

## Initial API shape
- `GET /api/stores?lat=..&lng=..&radiusMi=..&openNow=..`
  - Returns stores sorted by distance.
- `POST /api/reports`
  - Stores a community stock sighting tied to store + timestamp.

## Environment variables (planned)
- `DATABASE_URL`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `MAP_PROVIDER=mapbox`
