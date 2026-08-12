<script lang="ts">
	import SafariMap from '$lib/components/SafariMap.svelte';
	import TripPicker from '$lib/components/TripPicker.svelte';
	import { filterRoutes, heatFromRoutes, unionTripBounds } from '$lib/map-bounds';
	import type { FeatureCollection } from 'geojson';
	import type { MapViewMode, SafariManifest, SafariSeries } from '$lib/types/safari';

	let manifest = $state<SafariManifest | null>(null);
	let allRoutes = $state<FeatureCollection | null>(null);
	let fullHeatmap = $state<FeatureCollection | null>(null);
	let selected = $state<Set<string>>(new Set());
	let viewMode = $state<MapViewMode>('both');
	let replayTripId = $state<string | null>(null);
	let series = $state<SafariSeries | null>(null);
	let scrubIndex = $state(0);
	let playing = $state(false);
	let error = $state<string | null>(null);
	let loading = $state(true);

	const filteredRoutes = $derived.by(() => {
		if (!allRoutes || selected.size === 0) {
			return { type: 'FeatureCollection', features: [] } as FeatureCollection;
		}
		return filterRoutes(allRoutes, selected);
	});

	const displayHeatmap = $derived.by(() => {
		if (selected.size === 0) return null;
		if (
			manifest &&
			selected.size === manifest.trips.length &&
			fullHeatmap?.features.length
		) {
			return fullHeatmap;
		}
		return heatFromRoutes(filteredRoutes);
	});

	const mapBounds = $derived.by(() => {
		if (!manifest) return undefined;
		if (selected.size === manifest.trips.length && manifest.coverage?.bounds) {
			return manifest.coverage.bounds;
		}
		return unionTripBounds(manifest.trips, selected);
	});

	const replayMode = $derived(replayTripId !== null && selected.size === 1);

	const dataFetch = (path: string) => fetch(path, { cache: 'no-store' });

	$effect(() => {
		(async () => {
			loading = true;
			error = null;
			try {
				const mRes = await dataFetch('/data/manifest.json');
				if (!mRes.ok) throw new Error(`manifest ${mRes.status}`);
				const m = (await mRes.json()) as SafariManifest;
				manifest = m;

				const ids = new Set(m.trips.map((t) => t.id));
				selected = ids;

				if (m.coverage?.all_routes) {
					const rRes = await dataFetch(`/data/${m.coverage.all_routes}`);
					if (rRes.ok) allRoutes = (await rRes.json()) as FeatureCollection;
				}

				if (!allRoutes?.features.length && m.trips.length) {
					const features: FeatureCollection['features'] = [];
					for (const trip of m.trips) {
						const rRes = await dataFetch(`/data/${trip.geojson}`);
						if (!rRes.ok) continue;
						const fc = (await rRes.json()) as FeatureCollection;
						for (const f of fc.features) {
							features.push({
								...f,
								properties: {
									...(f.properties ?? {}),
									trip_id: trip.id
								}
							});
						}
					}
					if (features.length) {
						allRoutes = { type: 'FeatureCollection', features };
					}
				}

				if (!allRoutes?.features.length && m.trips.length) {
					throw new Error('no route GeoJSON in deploy/data');
				}

				if (m.coverage?.heatmap) {
					const hRes = await dataFetch(`/data/${m.coverage.heatmap}`);
					if (hRes.ok) fullHeatmap = (await hRes.json()) as FeatureCollection;
				}
			} catch (e) {
				error = e instanceof Error ? e.message : String(e);
			} finally {
				loading = false;
			}
		})();
	});

	async function loadSeries(tripId: string) {
		const trip = manifest?.trips.find((t) => t.id === tripId);
		if (!trip) return;
		const sRes = await fetch(`/data/${trip.series}`);
		if (!sRes.ok) return;
		series = (await sRes.json()) as SafariSeries;
		scrubIndex = 0;
		playing = false;
	}

	function toggleTrip(id: string) {
		const next = new Set(selected);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selected = next;

		if (next.size === 1) {
			const only = [...next][0];
			replayTripId = only;
			loadSeries(only);
		} else {
			replayTripId = null;
			series = null;
			playing = false;
		}
	}

	function selectAll() {
		if (!manifest) return;
		selected = new Set(manifest.trips.map((t) => t.id));
		replayTripId = null;
		series = null;
		playing = false;
	}

	function selectNone() {
		selected = new Set();
		replayTripId = null;
		series = null;
		playing = false;
	}

	function msUntilNextPoint(idx: number): number {
		if (!series?.points.length || idx >= series.points.length - 1) return 500;
		const a = Date.parse(series.points[idx].t);
		const b = Date.parse(series.points[idx + 1].t);
		const delta = b - a;
		return Number.isFinite(delta) && delta > 0 ? delta : 500;
	}

	$effect(() => {
		if (!playing || !series?.points.length) return;
		const pts = series.points;
		let cancelled = false;
		let idx = scrubIndex;

		const tick = () => {
			if (cancelled) return;
			if (idx >= pts.length - 1) {
				playing = false;
				return;
			}
			idx += 1;
			scrubIndex = idx;
			window.setTimeout(tick, msUntilNextPoint(idx - 1));
		};

		window.setTimeout(tick, msUntilNextPoint(idx));
		return () => {
			cancelled = true;
		};
	});

	function togglePlay() {
		if (!series?.points.length) return;
		if (playing) {
			playing = false;
			return;
		}
		if (scrubIndex >= series.points.length - 1) scrubIndex = 0;
		playing = true;
	}

	const playhead = $derived.by(() => {
		if (!replayMode || !series?.points.length) return null;
		const p = series.points[Math.min(scrubIndex, series.points.length - 1)];
		return { lat: p.lat, lon: p.lon };
	});

	const currentPoint = $derived.by(() => {
		if (!replayMode || !series?.points.length) return null;
		return series.points[Math.min(scrubIndex, series.points.length - 1)];
	});
</script>

<svelte:head>
	<title>Ebike Safari</title>
</svelte:head>

<main>
	{#if error}
		<p class="error">{error} — copy <code>web/data/</code> to VM <code>deploy/data/</code></p>
	{:else if manifest && allRoutes}
		<header>
			<h1>Ebike Safari</h1>
			<span>{manifest.home.label} · {selected.size}/{manifest.trip_count} rides</span>
		</header>
		<div class="map-shell">
			<SafariMap
				tileUrl={manifest.map.tile_url}
				attribution={manifest.map.attribution}
				bounds={mapBounds}
				routes={filteredRoutes}
				heatmap={displayHeatmap}
				{viewMode}
				highlightTripId={replayTripId}
				{playhead}
			/>
			<TripPicker
				trips={manifest.trips}
				{selected}
				{viewMode}
				onToggle={toggleTrip}
				onSelectAll={selectAll}
				onSelectNone={selectNone}
				onViewMode={(m) => (viewMode = m)}
			/>
		</div>
		{#if replayMode && series}
			<footer>
				<div class="controls">
					<button type="button" onclick={togglePlay} aria-pressed={playing}>
						{playing ? 'Pause' : 'Play'}
					</button>
					<input
						type="range"
						min="0"
						max={Math.max(0, series.points.length - 1)}
						bind:value={scrubIndex}
						oninput={() => (playing = false)}
					/>
				</div>
				<div class="stats">
					{#if currentPoint}
						<span>{currentPoint.speed_kmh?.toFixed(1) ?? '—'} km/h</span>
						<span>{currentPoint.alt_m?.toFixed(0) ?? '—'} m</span>
						<span>{new Date(currentPoint.t).toLocaleTimeString()}</span>
					{/if}
					<span>{scrubIndex + 1} / {series.points.length}</span>
				</div>
			</footer>
		{:else}
			<footer class="summary">
				<span>Select one ride to replay. All {manifest.trip_count} shown = coverage map.</span>
			</footer>
		{/if}
	{:else if loading}
		<p class="loading">Loading rides…</p>
	{:else}
		<p class="error">No ride data — copy web/data to <code>deploy/data</code> on the server</p>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		margin: 0;
		background: #1a1a2e;
		color: #f8f9fa;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0.5rem 1rem;
		background: #16213e;
		font-size: 0.9rem;
		z-index: 1;
	}

	h1 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.map-shell {
		position: relative;
		flex: 1;
		min-height: 0;
	}

	footer {
		padding: 0.5rem 1rem 1rem;
		background: #16213e;
		z-index: 1;
	}

	footer.summary {
		font-size: 0.85rem;
		opacity: 0.85;
	}

	.controls {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	button {
		min-width: 4.5rem;
		padding: 0.35rem 0.75rem;
		border: none;
		border-radius: 6px;
		background: #e85d04;
		color: #fff;
		font-weight: 600;
		cursor: pointer;
	}

	button[aria-pressed='true'] {
		background: #0077b6;
	}

	input[type='range'] {
		flex: 1;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 0.35rem;
		font-size: 0.85rem;
		opacity: 0.9;
	}

	.loading,
	.error {
		padding: 2rem;
	}

	code {
		font-size: 0.85em;
	}
</style>
