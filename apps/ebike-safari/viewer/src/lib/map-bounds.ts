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

const HEAT_CELL_DEG = 0.00015;

/** Visit-frequency grid from selected route lines (updates when selection changes). */
export function heatFromRoutes(routes: FeatureCollection): FeatureCollection {
	const grid = new Map<string, { lon: number; lat: number; weight: number }>();

	for (const f of routes.features) {
		if (f.geometry.type !== 'LineString') continue;
		const coords = f.geometry.coordinates;
		const step = Math.max(1, Math.floor(coords.length / 200));
		for (let i = 0; i < coords.length; i += step) {
			const [lon, lat] = coords[i];
			const gx = Math.round(lon / HEAT_CELL_DEG) * HEAT_CELL_DEG;
			const gy = Math.round(lat / HEAT_CELL_DEG) * HEAT_CELL_DEG;
			const key = `${gx.toFixed(6)},${gy.toFixed(6)}`;
			const cur = grid.get(key);
			if (cur) cur.weight += 1;
			else grid.set(key, { lon: gx, lat: gy, weight: 1 });
		}
	}

	return {
		type: 'FeatureCollection',
		features: [...grid.values()].map(({ lon, lat, weight }) => ({
			type: 'Feature',
			properties: { weight },
			geometry: { type: 'Point', coordinates: [lon, lat] }
		}))
	};
}
