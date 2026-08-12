-- Flexible ride ingest: multiple source formats, open-ended point telemetry.

ALTER TABLE rides ADD COLUMN IF NOT EXISTS source_format TEXT NOT NULL DEFAULT 'fit';
ALTER TABLE rides ADD COLUMN IF NOT EXISTS source_uri TEXT;

COMMENT ON COLUMN rides.source_format IS 'fit | gpx | tcx | json | manual | …';
COMMENT ON COLUMN rides.source_uri IS 'Original file path or URL when known';
COMMENT ON COLUMN rides.source_fit IS 'Legacy FIT filename; prefer source_uri + source_format';
COMMENT ON COLUMN rides.meta IS 'Full source metadata blob (format-specific)';

ALTER TABLE ride_points ADD COLUMN IF NOT EXISTS extras JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN ride_points.extras IS 'Open telemetry: battery_pct, energy_wh, hr_bpm, …';
COMMENT ON COLUMN ride_points.alt_m IS 'Indexed altitude; also allowed in extras for sparse sources';

CREATE TABLE IF NOT EXISTS user_settings (
	user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
	settings JSONB NOT NULL DEFAULT '{}'::jsonb,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE user_settings IS 'Per-user prefs; anonymous defaults live in browser localStorage';
