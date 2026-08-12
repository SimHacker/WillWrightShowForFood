<script lang="ts">
	import type { AppSettings, LocationMode } from '$lib/types/settings';

	interface Props {
		open: boolean;
		settings: AppSettings;
		onClose: () => void;
		onChange: (partial: Partial<AppSettings>) => void;
	}

	let { open, settings, onClose, onChange }: Props = $props();

	const locationModes: { value: LocationMode; label: string }[] = [
		{ value: 'off', label: 'Off — hide my location' },
		{ value: 'gps', label: 'GPS — live device location' },
		{ value: 'manual', label: 'Manual — drag the marker on the map' }
	];

	const followDisabled = $derived(settings.locationMode === 'off');

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) onClose();
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if open}
	<div class="backdrop" onclick={onClose} role="presentation"></div>
	<div class="dialog" role="dialog" aria-labelledby="settings-title">
		<h2 id="settings-title">Settings</h2>
		<p class="hint">Saved on this device. Log in later to sync across devices.</p>

		<fieldset>
			<legend>My location</legend>
			{#each locationModes as mode}
				<label class="radio">
					<input
						type="radio"
						name="locationMode"
						value={mode.value}
						checked={settings.locationMode === mode.value}
						onchange={() => onChange({ locationMode: mode.value })}
					/>
					{mode.label}
				</label>
			{/each}
		</fieldset>

		<label class="check" class:disabled={followDisabled}>
			<input
				type="checkbox"
				checked={settings.followUser}
				disabled={followDisabled}
				onchange={(e) => onChange({ followUser: e.currentTarget.checked })}
			/>
			Keep map centered on my location
		</label>

		<div class="actions">
			<button type="button" onclick={onClose}>Done</button>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 30;
		background: rgba(0, 0, 0, 0.45);
	}

	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 31;
		width: min(22rem, calc(100vw - 2rem));
		min-height: 16.5rem;
		max-height: calc(100dvh - 2rem);
		overflow: auto;
		padding: 1rem 1.1rem;
		border-radius: 10px;
		background: #16213e;
		color: #f8f9fa;
		transform: translate(-50%, -50%);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
	}

	h2 {
		margin: 0 0 0.35rem;
		font-size: 1rem;
		font-weight: 600;
	}

	.hint {
		margin: 0 0 1rem;
		font-size: 0.78rem;
		opacity: 0.75;
	}

	fieldset {
		margin: 0 0 1rem;
		padding: 0;
		border: none;
	}

	legend {
		margin-bottom: 0.45rem;
		font-size: 0.82rem;
		font-weight: 600;
	}

	.radio,
	.check {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.45rem;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.radio input,
	.check input {
		margin-top: 0.15rem;
	}

	.check.disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}

	.actions button {
		padding: 0.4rem 0.85rem;
		border: none;
		border-radius: 6px;
		background: #e85d04;
		color: #fff;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
</style>
