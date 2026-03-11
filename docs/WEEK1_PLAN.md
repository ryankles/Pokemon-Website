# Week 1 Build Plan (Map-First MVP)

## Goal
Ship a usable prototype where a user can enter a location and see nearby Pokémon card stores on a map + list.

## Day 1 - App bootstrap
- Initialize Next.js + TypeScript project.
- Set up lint/format and `.env` management.
- Add map provider package and token plumbing.

## Day 2 - Database foundation
- Provision Postgres with PostGIS.
- Apply `db/schema.sql`.
- Seed 20-50 starter stores in one target region.

## Day 3 - Nearby stores API
- Implement `GET /api/stores` endpoint with:
  - input validation (`lat`, `lng`, `radiusMi`)
  - PostGIS query (`ST_DWithin`, `ST_Distance`)
  - response sorted by distance
- Add basic API tests for parameter validation and empty state.

## Day 4 - Map + list UI
- Build map view with clustered markers.
- Build store list cards synchronized with map results.
- Add filters: `place_type`, `has_singles`, `hosts_events`.

## Day 5 - Report pipeline (basic)
- Add `POST /api/reports` endpoint.
- Allow anonymous “in stock / out of stock” report submission.
- Display “last reported” status in store detail drawer.

## Day 6 - QA + polish
- Mobile layout pass.
- Error and loading states.
- Empty-state UX for no stores found.

## Day 7 - Soft launch prep
- Deploy preview + production environments.
- Add analytics events:
  - location search
  - store click
  - directions click
- Define next-week backlog (auth, moderation, store claiming).

## Definition of done for Week 1
- User can search by zip/city or geolocation.
- User sees nearby stores on map and in sorted list.
- User can open store details and submit a basic stock report.
