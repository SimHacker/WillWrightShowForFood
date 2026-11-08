export type LocationMode = 'gps' | 'manual' | 'off';

export type AppSettings = {
	locationMode: LocationMode;
	followUser: boolean;
	/** Speech in/out (synthesis + recognition). Off by default; opt in via Settings. */
	speechEnabled: boolean;
};

/** Dam Square. The opening view and the manual pin's starting point; never the rider's home. */
export const AMSTERDAM_CENTER = { lat: 52.3731, lon: 4.8932, zoom: 14 } as const;

export type MapView = { lat: number; lon: number; zoom: number };

/** `?lat=52.39&lon=4.87&zoom=17` overrides the opening view; any missing or bad part falls back. */
export function mapViewFromUrl(url: URL): MapView {
	const num = (key: string, min: number, max: number, fallback: number) => {
		const raw = url.searchParams.get(key);
		const n = raw === null ? NaN : Number(raw);
		return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
	};
	return {
		lat: num('lat', -85, 85, AMSTERDAM_CENTER.lat),
		lon: num('lon', -180, 180, AMSTERDAM_CENTER.lon),
		zoom: num('zoom', 0, 22, AMSTERDAM_CENTER.zoom)
	};
}

export const DEFAULT_SETTINGS: AppSettings = {
	locationMode: 'gps',
	/** Never on by default: a fresh visitor sees central Amsterdam, not wherever they are. */
	followUser: false,
	speechEnabled: false
};
