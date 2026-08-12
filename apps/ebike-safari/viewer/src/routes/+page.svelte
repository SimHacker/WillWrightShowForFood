<script lang="ts">
	import AuthMenu from '$lib/components/AuthMenu.svelte';
	import SafariMap from '$lib/components/SafariMap.svelte';
	import TripPicker from '$lib/components/TripPicker.svelte';
	import { getAuthContext } from '$lib/auth-context';
	import { filterRoutes, heatFromRoutes, unionTripBounds } from '$lib/map-bounds';
	import { getSettingsContext } from '$lib/settings-context';
	import type { FeatureCollection } from 'geojson';
	import type { UserLocation } from '$lib/types/location';
	import type { MapViewMode, SafariManifest, SafariSeries } from '$lib/types/safari';

	const settingsStore = getSettingsContext();
	const auth = getAuthContext();

	let manifest = $state<SafariManifest | null>(null);
	let allRoutes = $state<FeatureCollection | null>(null);
	let fullHeatmap = $state<FeatureCollection | null>(null);
	let selected = $state<Set<string>>(new Set());
	let viewMode = $state<MapViewMode>('both');
	let replayTripId = $state<string | null>(null);
	let series = $state<SafariSeries | null>(null);
	let scrubIndex = $state(0);
	let playing = $state(false);
	let playbackSpeed = $state(1);
	let error = $state<string | null>(null);
	let loading = $state(true);
	let userLocation = $state<UserLocation | null>(null);
	let locationError = $state<string | null>(null);
	let ridesOpen = $state(true);

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
		if (manifest.coverage?.bounds) {
			return manifest.coverage.bounds;
		}
		return unionTripBounds(
			manifest.trips,
			new Set(manifest.trips.map((t) => t.id))
		);
	});

	const replayMode = $derived(replayTripId !== null && selected.size === 1);

	const locationMode = $derived(settingsStore.current.locationMode);
	const followUser = $derived(settingsStore.current.followUser);

	function defaultLocation(): UserLocation | null {
		if (!manifest) return null;
		return {
			lat: manifest.home.lat,
			lon: manifest.home.lon,
			updated_at: new Date().toISOString(),
			source: 'manual'
		};
	}

	function setUserLocation(loc: UserLocation) {
		userLocation = loc;
	}

	$effect(() => {
		const mode = locationMode;
		locationError = null;

		if (mode === 'off') {
			userLocation = null;
			return;
		}

		if (mode === 'manual') {
			if (!userLocation || userLocation.source === 'gps') {
				userLocation = defaultLocation();
			}
			return;
		}

		if (typeof navigator === 'undefined' || !navigator.geolocation) {
			locationError = 'Geolocation not available';
			if (!userLocation) userLocation = defaultLocation();
			return;
		}

		const watchId = navigator.geolocation.watchPosition(
			(pos) => {
				userLocation = {
					lat: pos.coords.latitude,
					lon: pos.coords.longitude,
					accuracy_m: pos.coords.accuracy,
					updated_at: new Date().toISOString(),
					source: 'gps'
				};
			},
			(err) => {
				locationError = err.message;
				if (!userLocation) userLocation = defaultLocation();
			},
			{ enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
		);

		return () => navigator.geolocation.clearWatch(watchId);
	});

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
		settingsStore.update({ locationMode: 'manual' });
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

	$effect(() => {
		if (!replayMode || !series?.points.length) return;
		if (locationMode !== 'manual') {
			settingsStore.update({ locationMode: 'manual' });
		}
	});

	$effect(() => {
		if (!replayMode || !series?.points.length) return;
		scrubIndex;
		const p = series.points[Math.min(scrubIndex, series.points.length - 1)];
		userLocation = {
			lat: p.lat,
			lon: p.lon,
			updated_at: p.t,
			source: 'manual'
		};
	});

	const PLAYBACK_SPEEDS = [1, 5, 10, 50, 100] as const;

	function msUntilNextPoint(idx: number): number {
		if (!series?.points.length || idx >= series.points.length - 1) return 500;
		const a = Date.parse(series.points[idx].t);
		const b = Date.parse(series.points[idx + 1].t);
		const delta = b - a;
		const real = Number.isFinite(delta) && delta > 0 ? delta : 500;
		return Math.max(8, real / playbackSpeed);
	}

	$effect(() => {
		if (!playing || !series?.points.length) return;
		playbackSpeed;
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

	const currentPoint = $derived.by(() => {
		if (!replayMode || !series?.points.length) return null;
		return series.points[Math.min(scrubIndex, series.points.length - 1)];
	});

	const mapUserLocation = $derived(replayMode ? userLocation : locationMode === 'off' ? null : userLocation);
	const mapFollowUser = $derived(followUser && locationMode !== 'off');
	const mapLocationDraggable = $derived(
		replayMode ? !playing && locationMode === 'manual' && !followUser : locationMode === 'manual' && !followUser
	);
</script>

<svelte:head>
	<title>eBike Safari</title>
</svelte:head>

<main>
	<header>
		<div class="head-text">
			<h1>
				eBike Safari
				{#if manifest && allRoutes}
					<span class="title-sep" aria-hidden="true">·</span>
					<button
						type="button"
						class="rides-toggle"
						onclick={() => (ridesOpen = !ridesOpen)}
						aria-expanded={ridesOpen}
						aria-controls="rides-panel"
					>
						{selected.size}/{manifest.trip_count} rides
					</button>
				{/if}
			</h1>
		</div>
		<AuthMenu
			user={auth.user}
			authAvailable={auth.authAvailable}
			settings={auth.settings}
			onUserChange={auth.onUserChange}
			onSettingsChange={auth.onSettingsChange}
		/>
	</header>
	{#if error}
		<p class="error">{error} — copy <code>web/data/</code> to VM <code>deploy/data/</code></p>
	{:else if manifest && allRoutes}
		{#if locationError && locationMode === 'gps'}
			<p class="loc-warn">{locationError}</p>
		{/if}
		<div class="map-shell">
			<SafariMap
				tileUrl={manifest.map.tile_url}
				attribution={manifest.map.attribution}
				bounds={mapBounds}
				routes={filteredRoutes}
				heatmap={displayHeatmap}
				{viewMode}
				highlightTripId={replayTripId}
				userLocation={mapUserLocation}
				userLocationDraggable={mapLocationDraggable}
				followUser={mapFollowUser}
				onUserLocationChange={setUserLocation}
			/>
			<TripPicker
				open={ridesOpen}
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
					<button type="button" class="play" onclick={togglePlay} aria-pressed={playing}>
						{playing ? 'Pause' : 'Play'}
					</button>
					<div class="speed-row">
						<span class="speed-label">Speed</span>
						<div class="speeds" role="group" aria-label="Playback speed">
							{#each PLAYBACK_SPEEDS as speed}
								<button
									type="button"
									class="speed"
									class:active={playbackSpeed === speed}
									aria-pressed={playbackSpeed === speed}
									onclick={() => (playbackSpeed = speed)}
								>
									{speed === 1 ? 'Real' : `${speed}×`}
								</button>
							{/each}
						</div>
					</div>
				</div>
				<input
					class="scrub"
					type="range"
					min="0"
					max={Math.max(0, series.points.length - 1)}
					bind:value={scrubIndex}
					oninput={() => (playing = false)}
					aria-label="Ride position"
				/>
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
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.65rem 0.4rem 1rem;
		background: #16213e;
		font-size: 0.9rem;
		z-index: 10;
		flex: 0 0 auto;
	}

	.head-text {
		flex: 1;
		min-width: 0;
	}

	h1 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		display: flex;
		align-items: baseline;
		flex-wrap: nowrap;
		gap: 0.35rem;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.title-sep {
		opacity: 0.65;
		font-weight: 400;
		flex: 0 0 auto;
	}

	.rides-toggle {
		display: inline;
		min-width: 0;
		padding: 0;
		border: none;
		border-radius: 0;
		background: none;
		color: inherit;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: rgba(248, 249, 250, 0.35);
		text-underline-offset: 0.15em;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rides-toggle:hover,
	.rides-toggle[aria-expanded='true'] {
		text-decoration-color: rgba(248, 249, 250, 0.85);
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
		flex-wrap: wrap;
		margin-bottom: 0.5rem;
	}

	.speed-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: min(100%, 20rem);
	}

	.speed-label {
		font-size: 0.8rem;
		font-weight: 600;
		opacity: 0.85;
		flex: 0 0 auto;
	}

	.speeds {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	button.play {
		flex: 0 0 auto;
	}

	input.scrub {
		width: 100%;
		margin: 0;
	}

	button.speed {
		min-width: 0;
		padding: 0.35rem 0.55rem;
		background: rgba(248, 249, 250, 0.12);
		font-size: 0.8rem;
		font-weight: 600;
	}

	button.speed.active,
	button.speed[aria-pressed='true'] {
		background: #0077b6;
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

	button[aria-pressed='true']:not(.speed) {
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
	.error,
	.loc-warn {
		padding: 2rem;
	}

	.loc-warn {
		padding: 0.35rem 1rem;
		margin: 0;
		font-size: 0.8rem;
		color: #ffb4a2;
		background: rgba(22, 33, 62, 0.9);
	}

	code {
		font-size: 0.85em;
	}
</style>
