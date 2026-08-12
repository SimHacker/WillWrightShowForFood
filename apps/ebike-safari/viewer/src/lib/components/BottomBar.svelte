<script lang="ts">
	import PopupMenu from '$lib/components/PopupMenu.svelte';
	import type { SeriesPoint, MapViewMode } from '$lib/types/safari';
	import type { LocationMode } from '$lib/types/settings';

	type Props = {
		replayActive: boolean;
		pointCount: number;
		playing: boolean;
		scrubIndex: number;
		playbackSpeed: number;
		currentPoint: SeriesPoint | null;
		locationMode: LocationMode;
		followUser: boolean;
		viewMode: MapViewMode;
		selectedCount: number;
		tripCount: number;
		onTogglePlay: () => void;
		onScrubInput: () => void;
		onScrubChange: (index: number) => void;
		onSpeed: (speed: number) => void;
		onLocationMode: (mode: LocationMode) => void;
		onFollowUser: (follow: boolean) => void;
		onViewMode: (mode: MapViewMode) => void;
		onOpenMore: () => void;
	};

	let {
		replayActive,
		pointCount,
		playing,
		scrubIndex,
		playbackSpeed,
		currentPoint,
		locationMode,
		followUser,
		viewMode,
		selectedCount,
		tripCount,
		onTogglePlay,
		onScrubInput,
		onScrubChange,
		onSpeed,
		onLocationMode,
		onFollowUser,
		onViewMode,
		onOpenMore
	}: Props = $props();

	const PLAYBACK_SPEEDS = [1, 5, 10, 50, 100] as const;

	let openMenu = $state<'location' | 'map' | null>(null);

	const locationLabel = $derived(
		locationMode === 'off' ? 'Off' : locationMode === 'gps' ? 'GPS' : 'Manual'
	);

	const mapLabel = $derived(
		viewMode === 'both' ? 'Both' : viewMode === 'routes' ? 'Routes' : 'Heat'
	);

	const scrubMax = $derived(Math.max(0, pointCount - 1));

	function closeMenus() {
		openMenu = null;
	}

	function toggleMenu(menu: 'location' | 'map') {
		openMenu = openMenu === menu ? null : menu;
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') closeMenus();
	}}
/>

<footer class="bottom-bar">
	<div class="transport">
		<button
			type="button"
			class="play"
			disabled={!replayActive}
			aria-pressed={playing}
			onclick={onTogglePlay}
		>
			{playing ? 'Pause' : 'Play'}
		</button>
		<input
			class="scrub"
			type="range"
			min="0"
			max={scrubMax}
			value={scrubIndex}
			disabled={!replayActive}
			oninput={(e) => {
				onScrubInput();
				onScrubChange(Number(e.currentTarget.value));
				closeMenus();
			}}
			aria-label="Ride position"
		/>
	</div>

	<div class="speed-bar" class:inactive={!replayActive} role="group" aria-label="Playback speed">
		<span class="speed-label">Speed</span>
		{#each PLAYBACK_SPEEDS as speed}
			<button
				type="button"
				class="speed"
				class:active={playbackSpeed === speed}
				disabled={!replayActive}
				aria-pressed={playbackSpeed === speed}
				onclick={() => onSpeed(speed)}
			>
				{speed === 1 ? 'Real' : `${speed}×`}
			</button>
		{/each}
	</div>

	<div class="toolbar">
		<div class="tool-slot">
			<button
				type="button"
				class="tool"
				aria-haspopup="menu"
				aria-expanded={openMenu === 'location'}
				onclick={() => toggleMenu('location')}
			>
				<span class="tool-kicker">Location</span>
				<span class="tool-value">{locationLabel}</span>
			</button>
			<PopupMenu
				open={openMenu === 'location'}
				items={[
					{ id: 'off', label: 'Off — hide pin', active: locationMode === 'off' },
					{ id: 'gps', label: 'GPS — live location', active: locationMode === 'gps' },
					{ id: 'manual', label: 'Manual — drag pin', active: locationMode === 'manual' }
				]}
				onSelect={(id) => onLocationMode(id as LocationMode)}
				onClose={closeMenus}
			/>
		</div>

		<button
			type="button"
			class="tool center"
			class:active={followUser}
			disabled={locationMode === 'off'}
			aria-pressed={followUser}
			onclick={() => onFollowUser(!followUser)}
		>
			<span class="tool-kicker">Center</span>
			<span class="tool-value">{followUser ? 'On' : 'Off'}</span>
		</button>

		<div class="tool-slot">
			<button
				type="button"
				class="tool"
				aria-haspopup="menu"
				aria-expanded={openMenu === 'map'}
				onclick={() => toggleMenu('map')}
			>
				<span class="tool-kicker">Map</span>
				<span class="tool-value">{mapLabel}</span>
			</button>
			<PopupMenu
				open={openMenu === 'map'}
				items={[
					{ id: 'both', label: 'Routes + heat', active: viewMode === 'both' },
					{ id: 'routes', label: 'Routes only', active: viewMode === 'routes' },
					{ id: 'heat', label: 'Heat only', active: viewMode === 'heat' }
				]}
				onSelect={(id) => onViewMode(id as MapViewMode)}
				onClose={closeMenus}
			/>
		</div>

		<button type="button" class="tool" onclick={() => { closeMenus(); onOpenMore(); }}>
			<span class="tool-kicker">More</span>
			<span class="tool-value">⋯</span>
		</button>
	</div>

	<div class="stats">
		{#if replayActive && currentPoint}
			<span>{currentPoint.speed_kmh?.toFixed(1) ?? '—'} km/h</span>
			<span>{currentPoint.alt_m?.toFixed(0) ?? '—'} m</span>
			<span>{new Date(currentPoint.t).toLocaleTimeString()}</span>
			<span>{scrubIndex + 1} / {pointCount}</span>
		{:else}
			<span>{selectedCount}/{tripCount} rides · select one to replay</span>
		{/if}
	</div>
</footer>

<style>
	.bottom-bar {
		box-sizing: border-box;
		height: 11.75rem;
		min-height: 11.75rem;
		padding: 0.45rem 0.65rem calc(0.55rem + env(safe-area-inset-bottom, 0px));
		background: #16213e;
		border-top: 1px solid rgba(248, 249, 250, 0.12);
		z-index: 5;
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.transport {
		display: flex;
		gap: 0.55rem;
		align-items: center;
		flex: 0 0 2.5rem;
	}

	.play {
		flex: 0 0 auto;
		min-width: 4.25rem;
		min-height: 2.5rem;
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: 8px;
		background: #e85d04;
		color: #fff;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}

	.play:disabled {
		opacity: 0.38;
		cursor: not-allowed;
	}

	.play[aria-pressed='true'] {
		background: #0077b6;
	}

	.scrub {
		flex: 1;
		min-width: 0;
		min-height: 2rem;
		margin: 0;
	}

	.scrub:disabled {
		opacity: 0.35;
	}

	.speed-bar {
		display: flex;
		gap: 0.3rem;
		align-items: stretch;
		flex: 0 0 2.35rem;
	}

	.speed-bar.inactive {
		opacity: 0.45;
	}

	.speed-label {
		display: flex;
		align-items: center;
		font-size: 0.78rem;
		font-weight: 700;
		opacity: 0.9;
		flex: 0 0 auto;
		padding-right: 0.1rem;
	}

	.speed {
		flex: 1;
		min-width: 2.4rem;
		min-height: 2.35rem;
		padding: 0.35rem 0.25rem;
		border: none;
		border-radius: 8px;
		background: #343a40;
		color: #fff;
		font: inherit;
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
	}

	.speed:disabled {
		cursor: not-allowed;
	}

	.speed.active,
	.speed[aria-pressed='true'] {
		background: #0077b6;
	}

	.toolbar {
		display: flex;
		gap: 0.35rem;
		flex: 0 0 3.1rem;
	}

	.tool-slot {
		position: relative;
		flex: 1;
		min-width: 0;
	}

	.tool {
		box-sizing: border-box;
		width: 100%;
		min-height: 3.1rem;
		padding: 0.3rem 0.35rem;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 10px;
		background: #1a1a2e;
		color: #f8f9fa;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.1rem;
	}

	.tool.center.active {
		background: #0077b6;
		border-color: #0077b6;
	}

	.tool:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.tool-kicker {
		font-size: 0.62rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		opacity: 0.72;
		line-height: 1;
	}

	.tool-value {
		font-size: 0.88rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem 1rem;
		flex: 0 0 1.1rem;
		align-items: center;
		font-size: 0.78rem;
		opacity: 0.88;
		overflow: hidden;
	}
</style>
