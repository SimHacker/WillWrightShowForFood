<script>
	/**
	 * A control at its home in the outline, as its owner offered it to the toolbar, with the 📌
	 * that puts a copy in the toolbar, last, or the ⏏️ that takes the copy out. Without a
	 * toolbar on the page (the PDP-7's, for now) the control is shown alone.
	 */
	/** @type {{ bar: import('./toolbar.svelte.js').Toolbar, id: string }} */
	let { bar, id } = $props();

	const control = $derived(bar.controls.get(id));
	const pinned = $derived(bar.has(id));
</script>

{#if control}
	<span class="pinnable" data-home={id}>
		{@render control.render(false)}
		{#if bar.live}
			<button
				type="button"
				class={['pin', { pinned }]}
				aria-label={pinned ? `Take ${control.label} out of the toolbar` : `Put ${control.label} in the toolbar`}
				title={pinned ? `Take ${control.label} out of the toolbar` : `Put ${control.label} in the toolbar, at its end`}
				onclick={() => bar.toggle(id)}>{pinned ? '⏏️' : '📌'}</button
			>
		{/if}
	</span>
{/if}

<style>
	.pinnable {
		display: inline-flex;
		align-items: center;
		gap: 0.1rem;
	}
	/* Small and faint, beside the control and not on it: the control is what is used. */
	.pin {
		padding: 0 0.1rem;
		border: none;
		background: none;
		font-size: 0.65rem;
		line-height: 1;
		opacity: 0.4;
		cursor: pointer;
		align-self: flex-start;
	}
	.pin:hover,
	.pin:focus-visible {
		opacity: 1;
	}
	.pin.pinned {
		opacity: 0.6;
	}
</style>
