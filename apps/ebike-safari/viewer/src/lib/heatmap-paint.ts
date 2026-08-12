import type { HeatmapLayerSpecification, LineLayerSpecification } from 'maplibre-gl';

/**
 * Jawbreaker on bakelite: bright yellow core, cream fill, crisp rainbow fringe.
 * Low heatmap-density = outer blur (rainbow wrapper); high = hot trail (yellow).
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
		0.012,
		'rgba(255, 0, 110, 0.55)',
		0.028,
		'rgba(0, 245, 255, 0.52)',
		0.044,
		'rgba(155, 93, 229, 0.5)',
		0.06,
		'rgba(112, 224, 0, 0.48)',
		0.076,
		'rgba(255, 105, 180, 0.46)',
		0.1,
		'rgba(180, 140, 110, 0.58)',
		0.14,
		'rgba(196, 164, 132, 0.62)',
		0.2,
		'rgba(212, 180, 145, 0.66)',
		0.28,
		'rgba(232, 200, 165, 0.7)',
		0.36,
		'rgba(245, 220, 185, 0.74)',
		0.44,
		'rgba(255, 235, 200, 0.78)',
		0.52,
		'rgba(255, 228, 170, 0.81)',
		0.6,
		'rgba(255, 220, 130, 0.84)',
		0.68,
		'rgba(255, 210, 90, 0.87)',
		0.76,
		'rgba(255, 230, 60, 0.9)',
		0.84,
		'rgba(255, 240, 30, 0.93)',
		0.92,
		'rgba(255, 248, 0, 0.95)',
		1,
		'rgba(255, 255, 100, 0.97)'
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
