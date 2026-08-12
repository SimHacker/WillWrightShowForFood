import type { HeatmapLayerSpecification, LineLayerSpecification } from 'maplibre-gl';

/**
 * Purple → blue → teal fringe, yellow on-trail, red only at peak density.
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
		8,
		10,
		13,
		12,
		22,
		14,
		30,
		15,
		34,
		16,
		36,
		17,
		38
	],
	'heatmap-opacity': [
		'interpolate',
		['linear'],
		['zoom'],
		8,
		0.74,
		12,
		0.8,
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
		0.02,
		'rgba(114, 9, 183, 0.44)',
		0.06,
		'rgba(72, 12, 168, 0.5)',
		0.1,
		'rgba(67, 97, 238, 0.54)',
		0.16,
		'rgba(0, 150, 199, 0.58)',
		0.22,
		'rgba(0, 180, 216, 0.62)',
		0.3,
		'rgba(144, 224, 239, 0.66)',
		0.4,
		'rgba(255, 214, 102, 0.72)',
		0.52,
		'rgba(255, 193, 7, 0.78)',
		0.64,
		'rgba(255, 209, 102, 0.82)',
		0.76,
		'rgba(255, 183, 77, 0.86)',
		0.86,
		'rgba(255, 140, 0, 0.88)',
		0.94,
		'rgba(230, 57, 70, 0.9)',
		1,
		'rgba(208, 0, 0, 0.92)'
	]
} satisfies HeatmapLayerSpecification['paint'];

/** Dark casing so routes stay visible on the pale map and on yellow heat. */
export const ROUTE_CASING_PAINT = {
	'line-color': '#1a1a2e',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3.6, 13, 4.4, 15, 5.2, 17, 6.2],
	'line-opacity': 0.88
} satisfies LineLayerSpecification['paint'];

export const ROUTE_LINE_PAINT = {
	'line-color': '#4361ee',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2.2, 13, 2.8, 15, 3.4, 17, 4.2],
	'line-opacity': 0.96
} satisfies LineLayerSpecification['paint'];

export const ROUTE_HIGHLIGHT_PAINT = {
	'line-color': '#ffd60a',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3.2, 13, 4.2, 15, 5, 17, 6],
	'line-opacity': 1
} satisfies LineLayerSpecification['paint'];

export const ROUTE_HIGHLIGHT_CASING_PAINT = {
	'line-color': '#1a1a2e',
	'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4.6, 13, 5.6, 15, 6.4, 17, 7.4],
	'line-opacity': 0.92
} satisfies LineLayerSpecification['paint'];
