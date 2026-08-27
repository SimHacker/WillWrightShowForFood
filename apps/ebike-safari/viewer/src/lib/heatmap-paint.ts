import type { HeatmapLayerSpecification, LineLayerSpecification } from 'maplibre-gl';

/**
 * Jawbreaker on bakelite: hairline yellow core, wide cream/orange/red mid-band,
 * candle-dipped rainbow halo (gentle wide slices), thin black shadow at the edge.
 * Alphas kept low so OSM labels and terrain show through.
 * heatmap-density 0 = outer halo, 1 = hottest overlap on trail.
 */
export const HEATMAP_PAINT = {
	'heatmap-weight': [
		'interpolate',
		['linear'],
		['get', 'weight'],
		1,
		0.52,
		4,
		0.55,
		10,
		0.74,
		20,
		0.88,
		35,
		1
	],
	'heatmap-intensity': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		0.16,
		10,
		0.3,
		12,
		0.55,
		14,
		0.82,
		16,
		0.78,
		18,
		0.74
	],
	'heatmap-radius': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		9,
		10,
		14,
		12,
		22,
		14,
		28,
		16,
		34,
		18,
		40
	],
	'heatmap-opacity': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		0.62,
		12,
		0.68,
		15,
		0.72,
		17,
		0.74
	],
	'heatmap-color': [
		'interpolate',
		['linear'],
		['heatmap-density'],
		0,
		'rgba(0,0,0,0)',
		0.004,
		'rgba(0, 0, 0, 0.16)',
		0.012,
		'rgba(0, 0, 0, 0.1)',
		0.022,
		'rgba(0, 0, 0, 0.04)',
		0.03,
		'rgba(255, 0, 130, 0.22)',
		0.06,
		'rgba(0, 210, 255, 0.22)',
		0.09,
		'rgba(155, 93, 229, 0.21)',
		0.12,
		'rgba(80, 210, 80, 0.21)',
		0.15,
		'rgba(255, 90, 200, 0.2)',
		0.18,
		'rgba(0, 195, 240, 0.2)',
		0.21,
		'rgba(200, 60, 220, 0.19)',
		0.24,
		'rgba(255, 120, 160, 0.19)',
		0.27,
		'rgba(0, 180, 200, 0.18)',
		0.3,
		'rgba(140, 80, 255, 0.18)',
		0.33,
		'rgba(100, 220, 60, 0.18)',
		0.36,
		'rgba(255, 60, 180, 0.17)',
		0.39,
		'rgba(0, 220, 230, 0.17)',
		0.42,
		'rgba(180, 70, 230, 0.17)',
		0.45,
		'rgba(255, 140, 120, 0.18)',
		0.48,
		'rgba(210, 85, 70, 0.22)',
		0.52,
		'rgba(218, 88, 58, 0.26)',
		0.56,
		'rgba(228, 98, 48, 0.3)',
		0.6,
		'rgba(238, 112, 42, 0.33)',
		0.64,
		'rgba(248, 128, 38, 0.36)',
		0.68,
		'rgba(255, 145, 42, 0.38)',
		0.72,
		'rgba(255, 168, 55, 0.4)',
		0.76,
		'rgba(255, 188, 85, 0.41)',
		0.8,
		'rgba(255, 205, 120, 0.42)',
		0.84,
		'rgba(255, 218, 150, 0.43)',
		0.88,
		'rgba(255, 228, 175, 0.44)',
		0.92,
		'rgba(255, 236, 190, 0.45)',
		0.955,
		'rgba(255, 242, 175, 0.46)',
		0.978,
		'rgba(255, 248, 130, 0.47)',
		0.992,
		'rgba(255, 252, 95, 0.48)',
		1,
		'rgba(255, 255, 75, 0.5)'
	]
} satisfies HeatmapLayerSpecification['paint'];

/** Navy shadow like the SimCity “City” letter outline. */
export const ROUTE_CASING_PAINT = {
	'line-color': '#023047',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3.6, 13, 4.4, 15, 5.2, 17, 6.2],
	'line-opacity': 0.9
} satisfies LineLayerSpecification['paint'];

/** Logo “City” sky blue. */
export const ROUTE_LINE_PAINT = {
	'line-color': '#48cae4',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2.2, 13, 2.8, 15, 3.4, 17, 4.2],
	'line-opacity': 0.97
} satisfies LineLayerSpecification['paint'];

/** SimCity energy-meter yellow for replay highlight. */
export const ROUTE_HIGHLIGHT_PAINT = {
	'line-color': '#fcbf49',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3.2, 13, 4.2, 15, 5, 17, 6],
	'line-opacity': 1
} satisfies LineLayerSpecification['paint'];

export const ROUTE_HIGHLIGHT_CASING_PAINT = {
	'line-color': '#023047',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4.6, 13, 5.6, 15, 6.4, 17, 7.4],
	'line-opacity': 0.92
} satisfies LineLayerSpecification['paint'];
