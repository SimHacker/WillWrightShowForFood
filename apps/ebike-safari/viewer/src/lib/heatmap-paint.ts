import type { HeatmapLayerSpecification, LineLayerSpecification } from 'maplibre-gl';

/**
 * Hand-tuned heatmap: color slope from cool fringe → warm near-trail → hot on-trail.
 * Intensity rises with zoom so close views keep a bold core; radius widens for gentle bleed.
 */
export const HEATMAP_PAINT = {
	'heatmap-weight': [
		'interpolate',
		['linear'],
		['get', 'weight'],
		1,
		0.42,
		4,
		0.58,
		10,
		0.76,
		20,
		0.9,
		35,
		1
	],
	'heatmap-intensity': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		0.14,
		10,
		0.28,
		12,
		0.52,
		14,
		0.88,
		15,
		1.08,
		16,
		1.28,
		17,
		1.42
	],
	'heatmap-radius': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		7,
		10,
		12,
		12,
		20,
		14,
		32,
		15,
		42,
		16,
		50,
		17,
		58
	],
	'heatmap-opacity': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		0.72,
		12,
		0.78,
		15,
		0.84,
		17,
		0.86
	],
	'heatmap-color': [
		'interpolate',
		['linear'],
		['heatmap-density'],
		0,
		'rgba(0,0,0,0)',
		0.015,
		'rgba(67, 97, 238, 0.38)',
		0.05,
		'rgba(76, 201, 240, 0.5)',
		0.1,
		'rgba(144, 224, 239, 0.54)',
		0.16,
		'rgba(255, 209, 102, 0.58)',
		0.24,
		'rgba(255, 183, 77, 0.66)',
		0.34,
		'rgba(251, 133, 0, 0.74)',
		0.46,
		'rgba(230, 57, 70, 0.8)',
		0.58,
		'rgba(208, 0, 0, 0.86)',
		0.72,
		'rgba(186, 0, 28, 0.9)',
		0.86,
		'rgba(157, 2, 8, 0.93)',
		1,
		'rgba(102, 0, 18, 0.95)'
	]
} satisfies HeatmapLayerSpecification['paint'];

/** Route stroke — light edge on thermal heat so paths stay readable. */
export const ROUTE_LINE_PAINT = {
	'line-color': '#f8f9fa',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 13, 2.8, 15, 3.6, 17, 4.5],
	'line-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.72, 14, 0.82, 17, 0.9]
} satisfies LineLayerSpecification['paint'];

export const ROUTE_HIGHLIGHT_PAINT = {
	'line-color': '#ffffff',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 13, 4, 15, 5, 17, 6],
	'line-opacity': 1
} satisfies LineLayerSpecification['paint'];
