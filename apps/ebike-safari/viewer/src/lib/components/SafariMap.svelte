<script lang="ts">
	import {
		Map,
		Marker,
		NavigationControl,
		setWorkerUrl,
		type FilterSpecification,
		type GeoJSONSource,
		type LayerSpecification,
		type LineLayerSpecification,
		type Map as MapLibreMap
	} from 'maplibre-gl';
	import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { FeatureCollection } from 'geojson';
	import { onMount } from 'svelte';
	import type { MapViewMode } from '$lib/types/safari';
	import type { UserLocation } from '$lib/types/location';
	import {
		HEATMAP_PAINT,
		ROUTE_CASING_PAINT,
		ROUTE_HIGHLIGHT_CASING_PAINT,
		ROUTE_HIGHLIGHT_PAINT,
		ROUTE_LINE_PAINT
	} from '$lib/heatmap-paint';
	import { FINE_HEAT_ZOOM, heatFromRoutesFine } from '$lib/map-bounds';

	setWorkerUrl(workerUrl);

	type Props = {
		tileUrl: string;
		attribution: string;
		bounds?: [number, number, number, number];
		routes?: FeatureCollection | null;
		heatmap?: FeatureCollection | null;
		viewMode?: MapViewMode;
		highlightTripId?: string | null;
		playhead?: { lat: number; lon: number } | null;
		userLocation?: UserLocation | null;
		userLocationDraggable?: boolean;
		followUser?: boolean;
		onUserLocationChange?: (loc: UserLocation) => void;
	};

	let {
		tileUrl,
		attribution,
		bounds,
		routes = null,
		heatmap = null,
		viewMode = 'both',
		highlightTripId = null,
		playhead = null,
		userLocation = null,
		userLocationDraggable = false,
		followUser = false,
		onUserLocationChange
	}: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let map: MapLibreMap | undefined;
	let styleLoaded = $state(false);
	let mapZoom = $state(12);
	let userMarker: Marker | undefined;

	const ROUTES_SOURCE = 'safari-routes';
	const ROUTES_CASING = 'ride-lines-casing';
	const ROUTES_LAYER = 'ride-lines';
	const ROUTES_HIGHLIGHT_CASING = 'ride-highlight-casing';
	const ROUTES_HIGHLIGHT = 'ride-highlight';
	const HEAT_SOURCE = 'safari-heat';
	const HEAT_LAYER = 'ride-heat';

	const EMPTY_FC: FeatureCollection = { type: 'FeatureCollection', features: [] };

	function lineLayer(
		id: string,
		paint: LineLayerSpecification['paint'],
		filter?: FilterSpecification
	): LayerSpecification {
		const layer: LayerSpecification = {
			id,
			type: 'line',
			source: ROUTES_SOURCE,
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint
		};
		if (filter) layer.filter = filter;
		return layer;
	}

	function resolveHeatData(): FeatureCollection {
		if (mapZoom >= FINE_HEAT_ZOOM && routes?.features.length) {
			return heatFromRoutesFine(routes);
		}
		return heatmap?.features.length ? heatmap : EMPTY_FC;
	}

	function syncRoutes() {
		if (!map || !styleLoaded) return;

		const data = routes?.features.length ? routes : EMPTY_FC;

		if (!map.getSource(ROUTES_SOURCE)) {
			if (!data.features.length) return;
			map.addSource(ROUTES_SOURCE, { type: 'geojson', data });
			map.addLayer(lineLayer(ROUTES_CASING, ROUTE_CASING_PAINT));
			map.addLayer(lineLayer(ROUTES_LAYER, ROUTE_LINE_PAINT));
		} else {
			(map.getSource(ROUTES_SOURCE) as GeoJSONSource).setData(data);
		}

		if (!data.features.length) {
			for (const id of [ROUTES_HIGHLIGHT, ROUTES_HIGHLIGHT_CASING]) {
				if (map.getLayer(id)) map.removeLayer(id);
			}
			if (map.getLayer(ROUTES_LAYER)) map.setFilter(ROUTES_LAYER, null);
			if (map.getLayer(ROUTES_CASING)) map.setFilter(ROUTES_CASING, null);
			return;
		}

		if (highlightTripId) {
			const dim: FilterSpecification = ['!=', ['get', 'trip_id'], highlightTripId];
			const hi: FilterSpecification = ['==', ['get', 'trip_id'], highlightTripId];
			if (!map.getLayer(ROUTES_HIGHLIGHT_CASING)) {
				map.addLayer(lineLayer(ROUTES_HIGHLIGHT_CASING, ROUTE_HIGHLIGHT_CASING_PAINT, hi));
				map.addLayer(lineLayer(ROUTES_HIGHLIGHT, ROUTE_HIGHLIGHT_PAINT, hi));
			} else {
				map.setFilter(ROUTES_HIGHLIGHT_CASING, hi);
				map.setFilter(ROUTES_HIGHLIGHT, hi);
			}
			map.setFilter(ROUTES_CASING, dim);
			map.setFilter(ROUTES_LAYER, dim);
		} else {
			for (const id of [ROUTES_HIGHLIGHT, ROUTES_HIGHLIGHT_CASING]) {
				if (map.getLayer(id)) map.removeLayer(id);
			}
			map.setFilter(ROUTES_CASING, null);
			map.setFilter(ROUTES_LAYER, null);
		}

		raiseRouteLayers();
	}

	function syncHeatmap() {
		if (!map || !styleLoaded) return;

		const data = resolveHeatData();

		if (!map.getSource(HEAT_SOURCE)) {
			if (!data.features.length) return;
			map.addSource(HEAT_SOURCE, { type: 'geojson', data });
			map.addLayer({
				id: HEAT_LAYER,
				type: 'heatmap',
				source: HEAT_SOURCE,
				paint: HEATMAP_PAINT
			});
		} else {
			(map.getSource(HEAT_SOURCE) as GeoJSONSource).setData(data);
		}

		raiseRouteLayers();
	}

	function raiseRouteLayers() {
		if (!map) return;
		if (map.getLayer(HEAT_LAYER) && map.getLayer(ROUTES_CASING)) {
			map.moveLayer(ROUTES_CASING);
		}
		if (map.getLayer(ROUTES_LAYER)) {
			map.moveLayer(ROUTES_LAYER);
		}
		if (map.getLayer(ROUTES_HIGHLIGHT_CASING)) {
			map.moveLayer(ROUTES_HIGHLIGHT_CASING);
		}
		if (map.getLayer(ROUTES_HIGHLIGHT)) {
			map.moveLayer(ROUTES_HIGHLIGHT);
		}
	}

	function applyVisibility() {
		if (!map || !styleLoaded) return;
		const showRoutes = viewMode === 'routes' || viewMode === 'both';
		const showHeat = viewMode === 'heat' || viewMode === 'both';
		for (const id of [ROUTES_CASING, ROUTES_LAYER, ROUTES_HIGHLIGHT_CASING, ROUTES_HIGHLIGHT]) {
			if (map.getLayer(id)) {
				map.setLayoutProperty(id, 'visibility', showRoutes ? 'visible' : 'none');
			}
		}
		if (map.getLayer(HEAT_LAYER)) {
			map.setLayoutProperty(HEAT_LAYER, 'visibility', showHeat ? 'visible' : 'none');
		}
	}

	function syncAll() {
		syncHeatmap();
		syncRoutes();
		applyVisibility();
	}

	function fitMapBounds() {
		if (!map || !bounds) return;
		map.fitBounds(
			[
				[bounds[0], bounds[1]],
				[bounds[2], bounds[3]]
			],
			{ padding: 56, duration: 600 }
		);
	}

	onMount(() => {
		if (!container) return;

		map = new Map({
			container,
			style: {
				version: 8,
				sources: {
					osm: {
						type: 'raster',
						tiles: [tileUrl],
						tileSize: 256,
						attribution
					}
				},
				layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
			},
			center: bounds ? [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2] : [4.78, 52.34],
			zoom: 12
		});

		map.addControl(new NavigationControl(), 'bottom-right');

		map.on('load', () => {
			styleLoaded = true;
			mapZoom = map!.getZoom();
			syncAll();
			fitMapBounds();
		});

		map.on('zoom', () => {
			mapZoom = map!.getZoom();
		});

		map.on('error', (e) => {
			console.error('[SafariMap]', e.error?.message ?? e);
		});

		return () => {
			userMarker?.remove();
			userMarker = undefined;
			map?.remove();
			map = undefined;
			styleLoaded = false;
		};
	});

	$effect(() => {
		routes;
		heatmap;
		mapZoom;
		viewMode;
		highlightTripId;
		syncAll();
	});

	$effect(() => {
		if (!map || !styleLoaded || !playhead) {
			if (map?.getLayer('playhead-dot')) {
				map.setLayoutProperty('playhead-dot', 'visibility', 'none');
			}
			return;
		}

		const data: FeatureCollection = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: { type: 'Point', coordinates: [playhead.lon, playhead.lat] }
				}
			]
		};

		if (!map.getSource('playhead')) {
			map.addSource('playhead', { type: 'geojson', data });
			map.addLayer({
				id: 'playhead-dot',
				type: 'circle',
				source: 'playhead',
				paint: {
					'circle-radius': 9,
					'circle-color': '#0077b6',
					'circle-stroke-width': 3,
					'circle-stroke-color': '#ffffff'
				}
			});
			map.moveLayer('playhead-dot');
		} else {
			(map.getSource('playhead') as GeoJSONSource).setData(data);
			map.setLayoutProperty('playhead-dot', 'visibility', 'visible');
		}
	});

	function syncUserMarker() {
		if (!map || !styleLoaded) return;

		if (!userLocation) {
			userMarker?.remove();
			userMarker = undefined;
			return;
		}

		if (!userMarker) {
			userMarker = new Marker({
				color: '#2dc653',
				draggable: userLocationDraggable
			})
				.setLngLat([userLocation.lon, userLocation.lat])
				.addTo(map);

			userMarker.on('dragend', () => {
				if (!userMarker || !onUserLocationChange) return;
				const { lat, lng } = userMarker.getLngLat();
				onUserLocationChange({
					lat,
					lon: lng,
					updated_at: new Date().toISOString(),
					source: 'manual'
				});
			});
		} else {
			userMarker.setDraggable(userLocationDraggable);
			userMarker.setLngLat([userLocation.lon, userLocation.lat]);
		}

		if (followUser) {
			map.easeTo({
				center: [userLocation.lon, userLocation.lat],
				duration: 400
			});
		}
	}

	$effect(() => {
		userLocation;
		userLocationDraggable;
		followUser;
		syncUserMarker();
	});
</script>

<div class="map-root" bind:this={container}></div>

<style>
	.map-root {
		position: absolute;
		inset: 0;
	}
</style>
