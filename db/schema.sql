-- Initial schema for Pokemon Card Locator
-- PostgreSQL + PostGIS

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state_region TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'US',
  phone TEXT,
  website_url TEXT,
  place_type TEXT NOT NULL CHECK (place_type IN ('lgs', 'big_box', 'vending', 'event')),
  has_sealed BOOLEAN NOT NULL DEFAULT TRUE,
  has_singles BOOLEAN NOT NULL DEFAULT FALSE,
  has_graded BOOLEAN NOT NULL DEFAULT FALSE,
  buys_cards BOOLEAN NOT NULL DEFAULT FALSE,
  hosts_events BOOLEAN NOT NULL DEFAULT FALSE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stores_location_idx ON stores USING GIST (location);
CREATE INDEX IF NOT EXISTS stores_place_type_idx ON stores (place_type);

CREATE TABLE IF NOT EXISTS stock_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  reporter_name TEXT,
  product_note TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL,
  confidence SMALLINT NOT NULL DEFAULT 3 CHECK (confidence BETWEEN 1 AND 5),
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stock_reports_store_id_idx ON stock_reports (store_id);
CREATE INDEX IF NOT EXISTS stock_reports_reported_at_idx ON stock_reports (reported_at DESC);

-- Helper view: latest stock report per store
CREATE OR REPLACE VIEW store_latest_report AS
SELECT DISTINCT ON (sr.store_id)
  sr.store_id,
  sr.product_note,
  sr.in_stock,
  sr.confidence,
  sr.reported_at
FROM stock_reports sr
ORDER BY sr.store_id, sr.reported_at DESC;

-- Example nearby query (10 miles) using lon/lat params:
-- SELECT id, name,
--   ST_Distance(location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) / 1609.34 AS distance_miles
-- FROM stores
-- WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, 16093.4)
-- ORDER BY distance_miles ASC;
