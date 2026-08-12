export type SafariCoverage = {
	bounds: [number, number, number, number] | null;
	trip_count: number;
	cell_count: number;
	all_routes: string;
	heatmap: string;
};

export type SafariManifest = {
	generated_at: string;
	home: { label: string; lat: number; lon: number };
	map: { tile_url: string; attribution: string };
	trip_count: number;
	trips: SafariTrip[];
	videos: unknown[];
	video_count: number;
	coverage?: SafariCoverage;
};

export type SafariTrip = {
	id: string;
	title: string;
	started_at: string;
	distance_km: number;
	duration_min: number;
	point_count: number;
	bounds: [number, number, number, number];
	pause_count: number;
	source_fit: string;
	geojson: string;
	series: string;
	meta: string;
	videos: unknown[];
};

export type SeriesPoint = {
	t: string;
	lat: number;
	lon: number;
	alt_m?: number;
	speed_kmh?: number;
	power_w?: number;
	cadence_rpm?: number;
	distance_m?: number;
};

export type SafariSeries = {
	id: string;
	points: SeriesPoint[];
};

export type MapViewMode = 'routes' | 'heat' | 'both';
