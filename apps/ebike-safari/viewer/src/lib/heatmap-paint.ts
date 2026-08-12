import type { HeatmapLayerSpecification, LineLayerSpecification } from 'maplibre-gl';

/**
 * SimCity Supreme box-art palette: marbled bakelite (cream → peach → orange → gold).
 * Cool fringe is warm cream, not purple; peak is burnt orange/umber, not blood red.
 * Routes use the logo “City” sky blue with navy casing.
 */
export const HEATMAP_PAINT = {
	'heatmap-weight': [
		'interpolate',
		['linear'],
		['get', 'weight'],
		1,
		0.4,
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
		0.9,
		15,
		1.05,
		16,
		1.22,
		17,
		1.32
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
		24,
		14,
		32,
		15,
		36,
		16,
		40,
		17,
		44
	],
	'heatmap-opacity': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		0.76,
		12,
		0.82,
		15,
		0.86,
		17,
		0.88
	],
	'heatmap-color': [
		'interpolate',
		['linear'],
		['heatmap-density'],
		0,
		'rgba(0,0,0,0)',
		0.02,
		'rgba(255, 251, 235, 0.42)',
		0.06,
		'rgba(255, 248, 220, 0.52)',
		0.1,
		'rgba(245, 230, 200, 0.58)',
		0.16,
		'rgba(238, 210, 175, 0.64)',
		0.22,
		'rgba(232, 185, 140, 0.68)',
		0.3,
		'rgba(255, 200, 120, 0.72)',
		0.38,
		'rgba(255, 183, 77, 0.76)',
		0.46,
		'rgba(252, 191, 73, 0.8)',
		0.54,
		'rgba(255, 209, 102, 0.83)',
		0.62,
		'rgba(255, 193, 7, 0.86)',
		0.72,
		'rgba(255, 159, 28, 0.88)',
		0.82,
		'rgba(244, 140, 6, 0.9)',
		0.92,
		'rgba(232, 119, 34, 0.91)',
		1,
		'rgba(188, 108, 37, 0.92)'
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
