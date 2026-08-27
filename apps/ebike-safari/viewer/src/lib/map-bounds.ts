import type { FeatureCollection } from 'geojson';
import type { SafariTrip } from '$lib/types/safari';

export function unionTripBounds(
	trips: SafariTrip[],
	selected: Set<string>
): [number, number, number, number] | undefined {
	const pick = trips.filter((t) => selected.has(t.id));
	if (!pick.length) return undefined;
	const west = Math.min(...pick.map((t) => t.bounds[0]));
	const south = Math.min(...pick.map((t) => t.bounds[1]));
	const east = Math.max(...pick.map((t) => t.bounds[2]));
	const north = Math.max(...pick.map((t) => t.bounds[3]));
	return [west, south, east, north];
}

export function filterRoutes(
	allRoutes: FeatureCollection,
	selected: Set<string>
): FeatureCollection {
	return {
		type: 'FeatureCollection',
		features: allRoutes.features.filter((f) => {
			const id = f.properties?.trip_id as string | undefined;
			return id && selected.has(id);
		})
	};
}

const DEFAULT_CELL_DEG = 0.00008;
const DEFAULT_SAMPLE_DIVISOR = 3;

function interpolateSegment(
	lon0: number,
	lat0: number,
	lon1: number,
	lat1: number,
	spacingDeg: number
): [number, number][] {
	const dlon = lon1 - lon0;
	const dlat = lat1 - lat0;
	const dist = Math.hypot(dlon, dlat);
	if (dist <= spacingDeg) {
		return [
			[lon0, lat0],
			[lon1, lat1]
		];
	}
	const steps = Math.ceil(dist / spacingDeg);
	const out: [number, number][] = [];
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		out.push([lon0 + dlon * t, lat0 + dlat * t]);
	}
	return out;
}

function accumulateSegment(
	grid: Map<string, { lon: number; lat: number; weight: number }>,
	lon0: number,
	lat0: number,
	lon1: number,
	lat1: number,
	cellDeg: number,
	sampleDivisor: number
) {
	const sampleDeg = cellDeg / sampleDivisor;
	for (const [lon, lat] of interpolateSegment(lon0, lat0, lon1, lat1, sampleDeg)) {
		const gx = Math.round(lon / cellDeg) * cellDeg;
		const gy = Math.round(lat / cellDeg) * cellDeg;
		const key = `${gx.toFixed(6)},${gy.toFixed(6)}`;
		const cur = grid.get(key);
		if (cur) cur.weight += 1;
		else grid.set(key, { lon: gx, lat: gy, weight: 1 });
	}
}

/** Visit-frequency grid from route lines. */
export function heatFromRoutes(
	routes: FeatureCollection,
	cellDeg = DEFAULT_CELL_DEG,
	sampleDivisor = DEFAULT_SAMPLE_DIVISOR
): FeatureCollection {
	const grid = new Map<string, { lon: number; lat: number; weight: number }>();

	for (const f of routes.features) {
		if (f.geometry.type !== 'LineString') continue;
		const coords = f.geometry.coordinates;
		for (let i = 1; i < coords.length; i++) {
			const [lon0, lat0] = coords[i - 1];
			const [lon1, lat1] = coords[i];
			accumulateSegment(grid, lon0, lat0, lon1, lat1, cellDeg, sampleDivisor);
		}
	}

	return gridToFeatureCollection(grid);
}

function gridToFeatureCollection(
	grid: Map<string, { lon: number; lat: number; weight: number }>
): FeatureCollection {
	return {
		type: 'FeatureCollection',
		features: [...grid.values()].map(({ lon, lat, weight }) => ({
			type: 'Feature',
			properties: { weight },
			geometry: { type: 'Point', coordinates: [lon, lat] }
		}))
	};
}
