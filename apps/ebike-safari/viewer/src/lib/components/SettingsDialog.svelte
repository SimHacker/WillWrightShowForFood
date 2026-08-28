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
		{ value: 'manual', label: 'Pin — drag the marker on the map' }
	];

	const followDisabled = $derived(settings.locationMode === 'off');

	let dialogEl = $state<HTMLDialogElement | null>(null);

	// Native <dialog>.showModal() renders in the browser top layer, above all
	// page content regardless of z-index. Escape is handled natively.
	$effect(() => {
		if (!dialogEl) return;
		if (open && !dialogEl.open) dialogEl.showModal();
		else if (!open && dialogEl.open) dialogEl.close();
	});
</script>

<dialog
	bind:this={dialogEl}
	class="dialog"
	aria-labelledby="settings-title"
	onclose={() => {
		if (open) onClose();
	}}
	onclick={(e) => {
		if (e.target === dialogEl) onClose();
	}}
>
		<h2 id="settings-title">Settings</h2>
		<p class="todo">TODO: More settings will live here later (sync, units, themes, pie menus, …).</p>
		<p class="todo">TODO: Scrubber as parallel tracks — speed, altitude, power — like After Effects / Blender.</p>
		<p class="hint">Use the bottom bar while riding. This dialog is for extras.</p>

		<fieldset>
			<legend>My location</legend>
			{#each locationModes as mode (mode.value)}
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

		<fieldset>
			<legend>Speech (experimental)</legend>
			<label class="check">
				<input
					type="checkbox"
					checked={settings.speechEnabled}
					onchange={(e) => onChange({ speechEnabled: e.currentTarget.checked })}
				/>
				Enable speech in and out (voice synthesis + recognition)
			</label>
			{#if settings.speechEnabled}
				<p class="hint speech-hint">
					<a href="/lab">Open the speech lab</a> — pick voices, test the mic, run feedback mode.
				</p>
			{/if}
		</fieldset>

		<div class="actions">
			<button type="button" onclick={onClose}>Done</button>
		</div>
</dialog>

<style>
	.dialog {
		width: min(22rem, calc(100vw - 2rem));
		min-height: 16.5rem;
		max-height: calc(100dvh - 2rem);
		overflow: auto;
		padding: 1rem 1.1rem;
		border: none;
		border-radius: 10px;
		background: #16213e;
		color: #f8f9fa;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
	}

	.dialog::backdrop {
		background: rgba(0, 0, 0, 0.45);
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

	.todo {
		margin: 0 0 0.5rem;
		font-size: 0.78rem;
		color: #fcbf49;
		line-height: 1.35;
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

	.speech-hint {
		margin: 0.15rem 0 0 1.6rem;
	}

	.speech-hint a {
		color: #8cf;
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
