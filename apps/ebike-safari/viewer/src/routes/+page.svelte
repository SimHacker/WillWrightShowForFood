<script lang="ts">
	import { untrack } from 'svelte';
	import AuthMenu from '$lib/components/AuthMenu.svelte';
	import BottomBar from '$lib/components/BottomBar.svelte';
	import SafariMap from '$lib/components/SafariMap.svelte';
	import SettingsDialog from '$lib/components/SettingsDialog.svelte';
	import TripPicker from '$lib/components/TripPicker.svelte';
	import { getAuthContext } from '$lib/auth-context';
	import { debugLog, skipHeatmap } from '$lib/debug-trap';
	import { filterRoutes, heatFromRoutes, unionTripBounds } from '$lib/map-bounds';
	import { loadSelectedTripIds, saveSelectedTripIds } from '$lib/selected-trips';
	import { getSettingsContext } from '$lib/settings-context';
	import type { FeatureCollection } from 'geojson';
	import type { UserLocation } from '$lib/types/location';
	import type { MapViewMode, SafariManifest, SafariSeries } from '$lib/types/safari';

	const settingsStore = getSettingsContext();
	const auth = getAuthContext();

	let manifest = $state<SafariManifest | null>(null);
	let allRoutes = $state<FeatureCollection | null>(null);
	let selected = $state<Set<string>>(new Set());
	let viewMode = $state<MapViewMode>('both');
	// The one "selected" ride (0 or 1): drives heat, highlight, and replay.
	// `selected` above is the set of *shown* rides (checkboxes).
	let activeTripId = $state<string | null>(null);
	let series = $state<SafariSeries | null>(null);
	let scrubIndex = $state(0);
	let playing = $state(false);
	let playbackSpeed = $state(200);
	let error = $state<string | null>(null);
	let netWarning = $state<string | null>(null);
	let loading = $state(true);
	let userLocation = $state<UserLocation | null>(null);
	let locationError = $state<string | null>(null);
	let ridesOpen = $state(false);
	let settingsOpen = $state(false);

	const filteredRoutes = $derived.by(() => {
		if (!allRoutes || selected.size === 0) {
			return { type: 'FeatureCollection', features: [] } as FeatureCollection;
		}
		return filterRoutes(allRoutes, selected);
	});

	// Heat only for the selected ride: one ride's geometry is cheap to grid,
	// and the 17MB precomputed all-rides heatmap never gets downloaded.
	const displayHeatmap = $derived.by(() => {
		if (!activeTripId || !allRoutes || skipHeatmap()) return null;
		return heatFromRoutes(filterRoutes(allRoutes, new Set([activeTripId])));
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

	const replayMode = $derived(activeTripId !== null);

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

	function describeError(e: unknown): string {
		const msg = e instanceof Error ? e.message : String(e);
		return msg === 'Failed to fetch' || msg === 'Load failed' ? 'network error' : msg;
	}

	let warningTimer = 0;
	function noteNetworkHiccup(e: unknown) {
		netWarning = `Network hiccup (${describeError(e)}) — retrying`;
		window.clearTimeout(warningTimer);
		warningTimer = window.setTimeout(() => (netWarning = null), 6000);
	}

	// Survive network loss: initial load retries forever with backoff; once the
	// app is up, later failures only show a transient banner, never a dead screen.
	let retryDelayMs = 2000;

	async function loadAll() {
		loading = true;
		error = null;
		try {
			const mRes = await dataFetch('/data/manifest.json');
			if (!mRes.ok) throw new Error(`manifest ${mRes.status}`);
			const m = (await mRes.json()) as SafariManifest;
			manifest = m;

			const validIds = new Set(m.trips.map((t) => t.id));
			selected = loadSelectedTripIds(validIds);
			if (selected.size === 1) setActive([...selected][0]);

			if (m.coverage?.all_routes) {
				try {
					const rRes = await dataFetch(`/data/${m.coverage.all_routes}`);
					if (rRes.ok) allRoutes = (await rRes.json()) as FeatureCollection;
				} catch {
					/* fall through to per-trip fetch */
				}
			}

			if (!allRoutes?.features.length && m.trips.length) {
				const features: FeatureCollection['features'] = [];
				for (const trip of m.trips) {
					try {
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
					} catch {
						continue;
					}
				}
				if (features.length) {
					allRoutes = { type: 'FeatureCollection', features };
				}
			}

			if (!allRoutes?.features.length && m.trips.length) {
				throw new Error('no route GeoJSON on server');
			}

			retryDelayMs = 2000;
		} catch (e) {
			if (manifest && allRoutes) {
				noteNetworkHiccup(e);
			} else {
				error = describeError(e);
				window.setTimeout(loadAll, retryDelayMs);
				retryDelayMs = Math.min(retryDelayMs * 2, 15000);
			}
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadAll();
	});

	function applySelection(next: Set<string>) {
		selected = next;
		saveSelectedTripIds(next);
	}

	function setActive(id: string | null) {
		if (activeTripId === id) return;
		activeTripId = id;
		playing = false;
		series = null;
		if (id) loadSeries(id);
	}

	// Where to seat the scrub index once the series arrives (map tap on a
	// not-yet-selected path).
	let pendingSeat: { lon: number; lat: number } | null = null;

	async function loadSeries(tripId: string) {
		const trip = manifest?.trips.find((t) => t.id === tripId);
		if (!trip) return;
		try {
			const sRes = await dataFetch(`/data/${trip.series}`);
			if (!sRes.ok) return;
			const s = (await sRes.json()) as SafariSeries;
			if (activeTripId !== tripId) return; // selection moved on
			series = s;
		} catch (e) {
			noteNetworkHiccup(e);
			window.setTimeout(() => {
				if (activeTripId === tripId && !series) loadSeries(tripId);
			}, 3000);
			return;
		}
		playing = false;
		scrubIndex = pendingSeat ? (nearestIndex(pendingSeat.lon, pendingSeat.lat) ?? 0) : 0;
		pendingSeat = null;
	}

	function nearestIndex(lon: number, lat: number): number | null {
		const pts = series?.points;
		if (!pts?.length) return null;
		const cosLat = Math.cos((lat * Math.PI) / 180);
		let best = 0;
		let bestD = Infinity;
		for (let i = 0; i < pts.length; i++) {
			const dx = (pts[i].lon - lon) * cosLat;
			const dy = pts[i].lat - lat;
			const d = dx * dx + dy * dy;
			if (d < bestD) {
				bestD = d;
				best = i;
			}
		}
		return best;
	}

	function seatAt(lon: number, lat: number) {
		const i = nearestIndex(lon, lat);
		if (i === null) return;
		playing = false;
		scrubIndex = i;
	}

	// Checkbox: shown on/off. Checking also selects; unchecking only steals
	// selection from itself.
	function toggleTrip(id: string) {
		const next = new Set(selected);
		if (next.has(id)) {
			next.delete(id);
			if (activeTripId === id) setActive(null);
		} else {
			next.add(id);
			setActive(id);
		}
		applySelection(next);
	}

	// Name tap: force shown, toggle selected.
	function nameTap(id: string) {
		if (!selected.has(id)) {
			const next = new Set(selected);
			next.add(id);
			applySelection(next);
		}
		setActive(activeTripId === id ? null : id);
	}

	// Map tap on a path: select it and seat replay time at the tap point.
	function handlePathTap(tripId: string, lon: number, lat: number) {
		debugLog(`path tap ${tripId}`);
		if (activeTripId === tripId) {
			seatAt(lon, lat);
			return;
		}
		if (!selected.has(tripId)) {
			const next = new Set(selected);
			next.add(tripId);
			applySelection(next);
		}
		pendingSeat = { lon, lat };
		setActive(tripId);
	}

	function selectAll() {
		if (!manifest) return;
		applySelection(new Set(manifest.trips.map((t) => t.id)));
	}

	function selectNone() {
		applySelection(new Set());
		setActive(null);
	}

	$effect(() => {
		if (!replayMode || !series?.points.length) return;
		if (locationMode !== 'manual') return;
		scrubIndex;
		const p = series.points[Math.min(scrubIndex, series.points.length - 1)];
		userLocation = {
			lat: p.lat,
			lon: p.lon,
			updated_at: p.t,
			source: 'manual'
		};
	});

	// Bumped to restart the playback clock after an external scrub jump
	// (skip-pause) without toggling `playing`.
	let playbackEpoch = $state(0);

	// Playback clock: one stable ~30fps timer that advances as many points as
	// elapsed wall time × speed requires. It must NOT track scrubIndex, or every
	// tick tears the effect down and reschedules — fragile and easy to stall.
	$effect(() => {
		if (!playing || !series?.points.length) return;
		playbackEpoch;
		const pts = series.points;
		const speed = playbackSpeed;
		let idx = untrack(() => scrubIndex);
		let carryMs = 0;
		let last = performance.now();
		let timer = 0;

		const frame = () => {
			const now = performance.now();
			carryMs += (now - last) * speed;
			last = now;
			while (idx < pts.length - 1) {
				const dt = Date.parse(pts[idx + 1].t) - Date.parse(pts[idx].t);
				const step = Number.isFinite(dt) && dt > 0 ? dt : 500;
				if (carryMs < step) break;
				carryMs -= step;
				idx += 1;
			}
			scrubIndex = idx;
			if (idx >= pts.length - 1) {
				playing = false;
				return;
			}
			timer = window.setTimeout(frame, 33);
		};

		timer = window.setTimeout(frame, 33);
		return () => window.clearTimeout(timer);
	});

	function togglePlay() {
		if (!series?.points.length) return;
		if (playing) {
			playing = false;
			return;
		}
		if (scrubIndex >= series.points.length - 1) scrubIndex = 0;
		// Replay drives the pin in manual mode; switch once on play, don't lock.
		if (locationMode !== 'manual') {
			settingsStore.update({ locationMode: 'manual' });
		}
		playing = true;
	}

	const currentPoint = $derived.by(() => {
		if (!replayMode || !series?.points.length) return null;
		return series.points[Math.min(scrubIndex, series.points.length - 1)];
	});

	// Below this, the rider counts as stopped (traffic light, bridge, break).
	const STOP_KMH = 2;
	// A sample gap this long means the app auto-paused recording: no points
	// exist for the stop, so speed alone can't see it.
	const GAP_S = 10;

	function pointSpeed(i: number): number {
		const pts = series?.points;
		if (!pts?.length) return 0;
		const p = pts[Math.max(0, Math.min(i, pts.length - 1))];
		if (typeof p.speed_kmh === 'number') return p.speed_kmh;
		if (i <= 0) return 0;
		const prev = pts[i - 1];
		const dtS = (Date.parse(p.t) - Date.parse(prev.t)) / 1000;
		if (!(dtS > 0)) return 0;
		const cosLat = Math.cos((p.lat * Math.PI) / 180);
		const dxM = (p.lon - prev.lon) * cosLat * 111320;
		const dyM = (p.lat - prev.lat) * 110540;
		return (Math.hypot(dxM, dyM) / dtS) * 3.6;
	}

	/** Ride-seconds between point i and i+1 (0 at the last point). */
	function gapAfterS(i: number): number {
		const pts = series?.points;
		if (!pts?.length || i >= pts.length - 1 || i < 0) return 0;
		const dt = (Date.parse(pts[i + 1].t) - Date.parse(pts[i].t)) / 1000;
		return Number.isFinite(dt) && dt > 0 ? dt : 0;
	}

	/** Stopped = dwelling at low speed, or parked inside a recording gap. */
	function stoppedAt(i: number): boolean {
		return pointSpeed(i) < STOP_KMH || gapAfterS(i) >= GAP_S;
	}

	const isStopped = $derived.by(() => {
		if (!replayMode || !series?.points.length) return false;
		return stoppedAt(Math.min(scrubIndex, series.points.length - 1));
	});

	// When the replay head is stopped: index of the next motion and how many
	// ride-seconds remain until it. Null while moving or if stopped to the end.
	const stopInfo = $derived.by(() => {
		if (!replayMode || !series?.points.length) return null;
		const pts = series.points;
		const i = Math.min(scrubIndex, pts.length - 1);
		if (!stoppedAt(i)) return null;
		// Scan by speed only: a moving point that precedes another gap is real
		// motion and ends this pause (the next pause gets its own badge).
		let j = i + 1;
		while (j < pts.length && pointSpeed(j) < STOP_KMH) j++;
		if (j >= pts.length) return null;
		const remainingS = Math.max(
			0,
			Math.round((Date.parse(pts[j].t) - Date.parse(pts[i].t)) / 1000)
		);
		return { nextIndex: j, remainingS };
	});

	// Pause countdown ticks at 10 Hz during playback instead of only when the
	// scrub index advances (which can sit on one sample for minutes).
	const PAUSE_TICK_MS = 100;
	let pauseDisplayS = $state<number | null>(null);

	$effect(() => {
		if (!stopInfo) {
			pauseDisplayS = null;
			return;
		}
		if (!playing) {
			pauseDisplayS = stopInfo.remainingS;
			return;
		}
		const speed = playbackSpeed;
		scrubIndex;
		stopInfo.nextIndex;
		playbackEpoch;
		let remaining = stopInfo.remainingS;
		pauseDisplayS = Math.max(0, Math.ceil(remaining));
		const id = window.setInterval(() => {
			remaining = Math.max(0, remaining - (PAUSE_TICK_MS / 1000) * speed);
			pauseDisplayS = Math.max(0, Math.ceil(remaining));
		}, PAUSE_TICK_MS);
		return () => window.clearInterval(id);
	});

	const uiPauseRemainingS = $derived.by(() => {
		if (!stopInfo || !isStopped) return null;
		if (playing) return pauseDisplayS ?? stopInfo.remainingS;
		return stopInfo.remainingS;
	});

	function skipPause() {
		if (!stopInfo) return;
		scrubIndex = stopInfo.nextIndex;
		playbackEpoch++;
	}

	// Compass arrow for current motion; while stopped, the last direction moved.
	const headingArrow = $derived.by(() => {
		if (!replayMode || !series?.points.length) return null;
		const pts = series.points;
		let i = Math.min(scrubIndex, pts.length - 1);
		while (i > 0 && pointSpeed(i) < STOP_KMH) i--;
		if (i <= 0) return null;
		const from = pts[i - 1];
		const to = pts[i];
		const cosLat = Math.cos((to.lat * Math.PI) / 180);
		const dx = (to.lon - from.lon) * cosLat;
		const dy = to.lat - from.lat;
		if (dx === 0 && dy === 0) return null;
		const deg = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
		const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
		return arrows[Math.round(deg / 45) % 8];
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
			onUserChange={auth.onUserChange}
		/>
	</header>
	{#if manifest && allRoutes}
		{#if netWarning}
			<p class="loc-warn">{netWarning}</p>
		{/if}
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
				highlightTripId={activeTripId}
				userLocation={mapUserLocation}
				userLocationDraggable={mapLocationDraggable}
				followUser={mapFollowUser}
				onUserLocationChange={setUserLocation}
				onPathTap={handlePathTap}
				onPathScrub={seatAt}
				pauseSeconds={playing && uiPauseRemainingS !== null ? uiPauseRemainingS : null}
				onSkipPause={skipPause}
			/>
			<TripPicker
				open={ridesOpen}
				trips={manifest.trips}
				{selected}
				active={activeTripId}
				onToggle={toggleTrip}
				onNameTap={nameTap}
				onSelectAll={selectAll}
				onSelectNone={selectNone}
			/>
		</div>
		<BottomBar
			replayActive={replayMode && !!series?.points.length}
			pointCount={series?.points.length ?? 0}
			{playing}
			{scrubIndex}
			{playbackSpeed}
			{currentPoint}
			{locationMode}
			{followUser}
			{viewMode}
			selectedCount={selected.size}
			tripCount={manifest.trip_count}
			stopped={isStopped}
			pauseRemainingS={uiPauseRemainingS}
			{headingArrow}
			onSkipPause={skipPause}
			onTogglePlay={togglePlay}
			onScrubInput={() => (playing = false)}
			onScrubChange={(index) => (scrubIndex = index)}
			onSpeed={(speed) => (playbackSpeed = speed)}
			onLocationMode={(mode) => settingsStore.update({ locationMode: mode })}
			onFollowUser={(follow) => settingsStore.update({ followUser: follow })}
			onViewMode={(mode) => (viewMode = mode)}
			onOpenMore={() => (settingsOpen = true)}
		/>
		<SettingsDialog
			open={settingsOpen}
			settings={settingsStore.current}
			onClose={() => (settingsOpen = false)}
			onChange={(partial) => settingsStore.update(partial)}
		/>
	{:else if loading}
		<p class="loading">Loading rides…</p>
	{:else}
		<p class="error">
			Can't load ride data{error ? ` (${error})` : ''} — retrying…
			<br /><small>If this persists, the server's <code>deploy/data/</code> may be missing.</small>
		</p>
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
		/* Own stacking context: map internals (marker z-index etc.) can never
		   paint above the header, dialogs, or bottom bar. */
		z-index: 1;
		flex: 1;
		min-height: 0;
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
