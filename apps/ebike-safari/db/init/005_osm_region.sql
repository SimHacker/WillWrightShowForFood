-- OSM import metadata (region tag on ways; global osm_id)

ALTER TABLE osm_ways ADD COLUMN IF NOT EXISTS region TEXT;

CREATE INDEX IF NOT EXISTS osm_ways_region_idx ON osm_ways (region);

COMMENT ON COLUMN osm_ways.region IS 'Extract region slug: nl, california, …';
