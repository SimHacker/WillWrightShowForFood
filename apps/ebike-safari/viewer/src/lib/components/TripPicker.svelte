<script lang="ts">
	import type { SafariTrip, MapViewMode } from '$lib/types/safari';

	type Props = {
		open: boolean;
		trips: SafariTrip[];
		selected: Set<string>;
		viewMode: MapViewMode;
		onToggle: (id: string) => void;
		onSelectAll: () => void;
		onSelectNone: () => void;
		onViewMode: (mode: MapViewMode) => void;
	};

	let { open, trips, selected, viewMode, onToggle, onSelectAll, onSelectNone, onViewMode }: Props =
		$props();

	function formatDate(iso: string): string {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

{#if open}
	<aside id="rides-panel">
		<div class="panel">
			<div class="view-modes">
				<button
					type="button"
					class:active={viewMode === 'both'}
					onclick={() => onViewMode('both')}>Both</button
				>
				<button
					type="button"
					class:active={viewMode === 'routes'}
					onclick={() => onViewMode('routes')}>Routes</button
				>
				<button
					type="button"
					class:active={viewMode === 'heat'}
					onclick={() => onViewMode('heat')}>Heat</button
				>
			</div>

			<p class="hint">Heat = where you ride often. Gaps = not yet (in this set).</p>

			<div class="bulk">
				<button type="button" onclick={onSelectAll}>All</button>
				<button type="button" onclick={onSelectNone}>None</button>
			</div>

			<ul>
				{#each trips as trip (trip.id)}
					<li>
						<label>
							<input
								type="checkbox"
								checked={selected.has(trip.id)}
								onchange={() => onToggle(trip.id)}
							/>
							<span class="text">
								<span class="title">{trip.title}</span>
								<span class="meta"
									>{formatDate(trip.started_at)} · {trip.distance_km?.toFixed(1)} km</span
								>
							</span>
						</label>
					</li>
				{/each}
			</ul>
		</div>
	</aside>
{/if}

<style>
	aside {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 2;
		max-width: min(20rem, calc(100% - 1rem));
		font-size: 0.8rem;
	}

	.panel {
		max-height: min(60dvh, 28rem);
		overflow: auto;
		padding: 0.5rem;
		border-radius: 6px;
		background: rgba(22, 33, 62, 0.92);
		color: #f8f9fa;
	}

	.view-modes {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.view-modes button,
	.bulk button {
		flex: 1;
		padding: 0.25rem 0.4rem;
		border: 1px solid #444;
		border-radius: 4px;
		background: #1a1a2e;
		color: #f8f9fa;
		cursor: pointer;
		font-size: 0.75rem;
	}

	.view-modes button.active {
		background: #e85d04;
		border-color: #e85d04;
	}

	.hint {
		margin: 0 0 0.5rem;
		opacity: 0.75;
		font-size: 0.72rem;
		line-height: 1.3;
	}

	.bulk {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	label {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.35rem 0;
		cursor: pointer;
	}

	input[type='checkbox'] {
		flex: 0 0 auto;
		margin: 0.15rem 0 0;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.title {
		font-weight: 500;
		line-height: 1.25;
	}

	.meta {
		opacity: 0.7;
		font-size: 0.7rem;
		line-height: 1.25;
	}
</style>
