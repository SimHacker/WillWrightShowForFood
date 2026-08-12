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

	const PLAYBACK_SPEEDS = [1, 5, 10, 25, 50, 100, 200, 400] as const;

	let openMenu = $state<'speed' | 'location' | 'map' | null>(null);

	const speedLabel = $derived(playbackSpeed === 1 ? 'Real' : `${playbackSpeed}×`);

	const speedMenuItems = $derived(
		[...PLAYBACK_SPEEDS]
			.reverse()
			.map((speed) => ({
				id: String(speed),
				label: speed === 1 ? 'Real time' : `${speed}×`,
				active: playbackSpeed === speed
			}))
	);

	const locationLabel = $derived(
		locationMode === 'off' ? 'Off' : locationMode === 'gps' ? 'GPS' : 'Pin'
	);

	const mapLabel = $derived(
		viewMode === 'both' ? 'Both' : viewMode === 'routes' ? 'Lines' : 'Heat'
	);

	const scrubMax = $derived(Math.max(0, pointCount - 1));

	const statLine = $derived.by(() => {
		if (replayActive && currentPoint) {
			const speed = currentPoint.speed_kmh?.toFixed(1) ?? '—';
			return `${speed} km/h · ${scrubIndex + 1}/${pointCount}`;
		}
		return `${selectedCount}/${tripCount} rides`;
	});

	/** Worst-case stat width in ch so the scrub slider never reflows mid-replay. */
	const statWidthCh = $derived.by(() => {
		const replayWorst = `888.8 km/h · ${pointCount}/${pointCount}`.length;
		const idleWorst = `${tripCount}/${tripCount} rides`.length;
		return Math.max(replayWorst, idleWorst) + 1;
	});

	function closeMenus() {
		openMenu = null;
	}

	function toggleMenu(menu: 'speed' | 'location' | 'map') {
		openMenu = openMenu === menu ? null : menu;
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') closeMenus();
	}}
/>

<footer class="bottom-bar">
	<div class="row transport">
		<button
			type="button"
			class="play"
			disabled={!replayActive}
			aria-pressed={playing}
			onclick={onTogglePlay}
		>
			{playing ? '❚❚' : '▶'}
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
		<span class="stat" style:width="{statWidthCh}ch">{statLine}</span>
	</div>

	<div class="row controls" class:inactive={!replayActive}>
		<div class="tool-slot">
			<button
				type="button"
				class="chip"
				class:active={playbackSpeed > 1}
				disabled={!replayActive}
				aria-haspopup="menu"
				aria-expanded={openMenu === 'speed'}
				onclick={() => toggleMenu('speed')}
			>
				<span class="kicker">Speed</span>
				<span class="value">{speedLabel} <span class="disclosure" aria-hidden="true">▾</span></span>
			</button>
			<PopupMenu
				open={openMenu === 'speed'}
				items={speedMenuItems}
				onSelect={(id) => onSpeed(Number(id))}
				onClose={closeMenus}
			/>
		</div>

		<div class="tool-slot">
			<button
				type="button"
				class="chip"
				class:active={locationMode !== 'off'}
				aria-haspopup="menu"
				aria-expanded={openMenu === 'location'}
				onclick={() => toggleMenu('location')}
			>
				<span class="kicker">Location</span>
				<span class="value">{locationLabel} <span class="disclosure" aria-hidden="true">▾</span></span>
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

		<div class="tool-slot">
			<button
				type="button"
				class="chip"
				class:active={followUser}
				disabled={locationMode === 'off'}
				aria-pressed={followUser}
				onclick={() => onFollowUser(!followUser)}
			>
				<span class="kicker">Center</span>
				<span class="value">{followUser ? 'On' : 'Off'}</span>
			</button>
		</div>

		<div class="tool-slot">
			<button
				type="button"
				class="chip"
				aria-haspopup="menu"
				aria-expanded={openMenu === 'map'}
				onclick={() => toggleMenu('map')}
			>
				<span class="kicker">Map</span>
				<span class="value">{mapLabel} <span class="disclosure" aria-hidden="true">▾</span></span>
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

		<div class="tool-slot">
			<button
				type="button"
				class="chip"
				onclick={() => {
					closeMenus();
					onOpenMore();
				}}
			>
				<span class="kicker">More</span>
				<span class="value">⋯</span>
			</button>
		</div>
	</div>
</footer>

<style>
	.bottom-bar {
		box-sizing: border-box;
		height: 7.25rem;
		min-height: 7.25rem;
		padding: 0.35rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom, 0px));
		background: #16213e;
		border-top: 1px solid rgba(248, 249, 250, 0.12);
		z-index: 5;
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		min-width: 0;
	}

	.transport {
		flex: 0 0 2.15rem;
	}

	.controls {
		flex: 1;
		min-height: 0;
		gap: 0.25rem;
	}

	.controls.inactive {
		opacity: 0.6;
	}

	.play {
		flex: 0 0 2.15rem;
		width: 2.15rem;
		height: 2.15rem;
		padding: 0;
		border: none;
		border-radius: 8px;
		background: #e85d04;
		color: #fff;
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1;
		cursor: pointer;
	}

	.play:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.play[aria-pressed='true'] {
		background: #0077b6;
	}

	.scrub {
		flex: 1;
		min-width: 0;
		height: 1.75rem;
		margin: 0;
	}

	.scrub:disabled {
		opacity: 0.35;
	}

	/* Fixed width + tabular digits: the slider must never reflow as numbers tick. */
	.stat {
		flex: 0 0 auto;
		font-size: 0.68rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		opacity: 0.85;
		white-space: nowrap;
		overflow: hidden;
		text-align: right;
	}

	/* All five tools share identical flex so none can crush the others. */
	.tool-slot {
		position: relative;
		flex: 1 1 0;
		min-width: 3rem;
	}

	.chip {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.6rem;
		padding: 0.25rem 0.3rem;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 7px;
		background: #1a1a2e;
		color: #f8f9fa;
		font: inherit;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.08rem;
		overflow: hidden;
	}

	.kicker {
		font-size: 0.56rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.65;
		line-height: 1;
		white-space: nowrap;
	}

	.value {
		font-size: 0.78rem;
		font-weight: 700;
		line-height: 1.1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	.disclosure {
		font-size: 0.6rem;
		opacity: 0.65;
	}

	.chip.active,
	.chip[aria-pressed='true'] {
		background: #0077b6;
		border-color: #0077b6;
	}

	.chip:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
