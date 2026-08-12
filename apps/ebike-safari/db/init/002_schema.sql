-- Ebike Safari — v0 schema (rides + points)
-- Git YAML remains authoritative for game layers; this mirrors ride ingest for GIS queries.

CREATE TABLE IF NOT EXISTS rides (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    started_at      TIMESTAMPTZ NOT NULL,
    distance_m      DOUBLE PRECISION,
    duration_s      DOUBLE PRECISION,
    source_fit      TEXT,
    bounds          GEOMETRY(Polygon, 4326),
    path            GEOMETRY(LineString, 4326) NOT NULL,
    meta            JSONB DEFAULT '{}'::jsonb,
    git_ref         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rides_path_gix ON rides USING GIST (path);
CREATE INDEX IF NOT EXISTS rides_started_at_idx ON rides (started_at DESC);

CREATE TABLE IF NOT EXISTS ride_points (
    ride_id         TEXT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
    seq             INTEGER NOT NULL,
    recorded_at     TIMESTAMPTZ NOT NULL,
    geom            GEOMETRY(Point, 4326) NOT NULL,
    alt_m           DOUBLE PRECISION,
    speed_kmh       DOUBLE PRECISION,
    power_w         DOUBLE PRECISION,
    cadence_rpm     DOUBLE PRECISION,
    distance_m      DOUBLE PRECISION,
    PRIMARY KEY (ride_id, seq)
);

CREATE INDEX IF NOT EXISTS ride_points_geom_gix ON ride_points USING GIST (geom);
CREATE INDEX IF NOT EXISTS ride_points_time_idx ON ride_points (ride_id, recorded_at);

-- OSM way cache (road graph skeleton — populated later from Overpass / PBF)
CREATE TABLE IF NOT EXISTS osm_ways (
    osm_id          BIGINT PRIMARY KEY,
    tags            JSONB DEFAULT '{}'::jsonb,
    geom            GEOMETRY(LineString, 4326) NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS osm_ways_geom_gix ON osm_ways USING GIST (geom);

COMMENT ON TABLE rides IS 'FIT pipeline rides; path = full LineString WGS84';
COMMENT ON TABLE osm_ways IS 'Local OSM extract for map-match and territory edges';
